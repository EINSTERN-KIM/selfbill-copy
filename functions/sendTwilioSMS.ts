import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Twilio from 'npm:twilio';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, message } = await req.json();

    if (!to || !message) {
      return Response.json({ error: 'to와 message가 필요합니다.' }, { status: 400 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return Response.json({ 
        error: 'Twilio 설정이 완료되지 않았습니다. TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER를 설정해 주세요.' 
      }, { status: 400 });
    }

    const client = Twilio(accountSid, authToken);

    // 전화번호 형식 변환 (010-1234-5678 -> +821012345678)
    let formattedTo = to.replace(/-/g, '');
    if (formattedTo.startsWith('010')) {
      formattedTo = '+82' + formattedTo.substring(1);
    } else if (!formattedTo.startsWith('+')) {
      formattedTo = '+82' + formattedTo;
    }

    const messageResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedTo
    });

    return Response.json({
      success: true,
      messageSid: messageResponse.sid,
      status: messageResponse.status
    });

  } catch (error) {
    console.error('Twilio SMS Error:', error);
    return Response.json({ 
      error: error.message || 'SMS 발송 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
});