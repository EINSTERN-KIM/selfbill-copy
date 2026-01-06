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

    const { phone, code } = await req.json();

    if (!phone || !code) {
      return Response.json({ error: 'phone and code are required' }, { status: 400 });
    }

    // Format phone number to E.164 format
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const e164Phone = formattedPhone.startsWith('82') ? `+${formattedPhone}` : `+82${formattedPhone.substring(1)}`;

    // Verify code via Twilio Verify
    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    
    const formData = new URLSearchParams();
    formData.append('To', e164Phone);
    formData.append('Code', code);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok || twilioData.status !== 'approved') {
      return Response.json({ 
        success: false, 
        error: '인증번호가 올바르지 않습니다.'
      }, { status: 400 });
    }

    // Update user phone and verification status
    await base44.auth.updateMe({
      phone: phone,
      phone_verified: true
    });

    return Response.json({ 
      success: true
    });

  } catch (error) {
    console.error("Error verifying code:", error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});