/**
 * Base44 Functions: functions/sendAligoSMS.ts 를 호출
 * - receiver: "01012345678"
 * - message: "인증번호는 123456 입니다."
 * - testmode: true/false (옵션)
 */
export async function sendAligoSMS({ receiver, message, testmode = false }) {
    const res = await fetch("/functions/sendAligoSMS", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver, message, testmode }),
    });
  
    const data = await res.json().catch(() => null);
  
    if (!res.ok) {
      const msg = data?.error || data?.message || "알리고 문자 요청 실패";
      throw new Error(msg);
    }
  
    return data;
  }
  