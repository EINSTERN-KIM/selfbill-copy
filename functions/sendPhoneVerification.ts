import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_VERIFY_SERVICE_SID = Deno.env.get("TWILIO_VERIFY_SERVICE_SID");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phone } = await req.json();

    if (!phone) {
      return Response.json({ error: 'phone is required' }, { status: 400 });
    }

    // Format phone number to E.164 format (+821012345678)
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const e164Phone = formattedPhone.startsWith('82') ? `+${formattedPhone}` : `+82${formattedPhone.substring(1)}`;

    // Send verification code via Twilio Verify
    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    
    const formData = new URLSearchParams();
    formData.append('To', e164Phone);
    formData.append('Channel', 'sms');

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
      return Response.json({ 
        success: false, 
        error: twilioData.message || 'Failed to send verification code'
      }, { status: twilioResponse.status });
    }

    return Response.json({ 
      success: true,
      status: twilioData.status
    });

  } catch (error) {
    console.error("Error sending verification:", error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});