import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

Deno.serve(async (req) => {
  try {
    // 1. 인증
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 요청 파라미터
    const { receiver, message, testmode = false } = await req.json();

    if (!receiver || !message) {
      return Response.json(
        { error: "receiver와 message는 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 3. 환경변수
    const apiKey = Deno.env.get("ALIGO_API_KEY");
    const userId = Deno.env.get("ALIGO_USER_ID");
    const sender = Deno.env.get("ALIGO_SENDER");

    if (!apiKey || !userId || !sender) {
      return Response.json(
        { error: "알리고 API 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 4. 알리고 요청 파라미터
    const formData = new URLSearchParams({
      key: apiKey,
      user_id: userId,
      sender,
      receiver,
      msg: message,
      testmode_yn: testmode ? "Y" : "N",
    });

    // 5. 알리고 API 호출
    const response = await fetch("https://apis.aligo.in/send/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const text = await response.text();
    let result: any;

    try {
      result = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "알리고 응답 파싱 실패", raw: text },
        { status: 502 }
      );
    }

    // 6. 결과 처리
    // 알리고 API는 result_code를 문자열 "1" 또는 숫자 1로 반환할 수 있음
    const resultCode = String(result.result_code);
    if (resultCode === "1") {
      return Response.json({
        success: true,
        message: "문자 발송 성공",
        data: result,
      });
    }

    return Response.json(
      {
        success: false,
        error: result.message || "문자 발송 실패",
        data: result,
      },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
});
