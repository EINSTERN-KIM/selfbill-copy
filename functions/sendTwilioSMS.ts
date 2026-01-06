import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to_phone, body, building_id, event_type, event_ref_id } = await req.json();

    if (!to_phone || !body || !building_id) {
      return Response.json({ error: 'to_phone, body, and building_id are required' }, { status: 400 });
    }

    // Get building's Twilio phone number
    const buildings = await base44.asServiceRole.entities.Building.filter({ id: building_id });
    if (buildings.length === 0 || !buildings[0].twilio_phone_number) {
      return Response.json({ error: 'Building Twilio phone number not configured' }, { status: 400 });
    }

    const fromPhoneNumber = buildings[0].twilio_phone_number;

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    
    const formData = new URLSearchParams();
    formData.append('To', to_phone);
    formData.append('From', fromPhoneNumber);
    formData.append('Body', body);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      // Log failure
      if (building_id) {
        await base44.asServiceRole.entities.NotificationLog.create({
          building_id,
          to_phone,
          channel: "SMS",
          event_type: event_type || "기타",
          event_ref_id: event_ref_id || null,
          body,
          status: "발송실패",
          error_message: twilioData.message || "Unknown error",
          sent_at: new Date().toISOString()
        });
      }

      return Response.json({ 
        success: false, 
        error: twilioData.message 
      }, { status: twilioResponse.status });
    }

    // Log success
    if (building_id) {
      await base44.asServiceRole.entities.NotificationLog.create({
        building_id,
        to_phone,
        channel: "SMS",
        event_type: event_type || "기타",
        event_ref_id: event_ref_id || null,
        body,
        status: "발송성공",
        provider_message_id: twilioData.sid,
        sent_at: new Date().toISOString()
      });
    }

    return Response.json({ 
      success: true, 
      message_id: twilioData.sid 
    });

  } catch (error) {
    console.error("Error sending Twilio SMS:", error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});