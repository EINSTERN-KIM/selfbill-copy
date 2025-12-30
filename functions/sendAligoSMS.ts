import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { receiver, message, testmode = false } = await req.json();

        if (!receiver || !message) {
            return Response.json({ 
                error: 'receiver와 message는 필수 항목입니다.' 
            }, { status: 400 });
        }

        const apiKey = Deno.env.get("ALIGO_API_KEY");
        const userId = Deno.env.get("ALIGO_USER_ID");
        const sender = Deno.env.get("ALIGO_SENDER");

        if (!apiKey || !userId || !sender) {
            return Response.json({ 
                error: 'API 키, 사용자 ID 또는 발신번호가 설정되지 않았습니다.' 
            }, { status: 500 });
        }

        // 알리고 API 요청
        const formData = new URLSearchParams({
            key: apiKey,
            user_id: userId,
            sender: sender,
            receiver: receiver,
            msg: message,
            testmode_yn: testmode ? 'Y' : 'N'
        });

        const response = await fetch('https://apis.aligo.in/send/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        const result = await response.json();

        if (result.result_code === '1') {
            return Response.json({
                success: true,
                message: '문자 발송 성공',
                data: result
            });
        } else {
            return Response.json({
                success: false,
                error: result.message || '문자 발송 실패',
                data: result
            }, { status: 400 });
        }

    } catch (error) {
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});