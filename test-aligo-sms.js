/**
 * 알리고 SMS 로컬 테스트 스크립트
 * 
 * 사용 방법:
 * 1. 브라우저 개발자 도구 콘솔에서 실행
 * 2. 또는 Node.js 환경에서 실행 (fetch 지원 필요)
 * 
 * 주의사항:
 * - 로그인된 상태에서만 작동합니다
 * - Base44 Functions가 로컬에서 실행 중이어야 합니다
 */

async function testAligoSMS() {
  console.log('🚀 알리고 SMS 테스트 시작...\n');

  const testData = {
    receiver: "01012345678",
    message: "알리고 문자 테스트",
    testmode: true
  };

  console.log('📤 요청 데이터:', testData);
  console.log('📡 요청 URL: /functions/sendAligoSMS\n');

  try {
    const response = await fetch("/functions/sendAligoSMS", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log('📥 응답 상태:', response.status, response.statusText);
    console.log('📋 응답 헤더:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('\n📦 응답 데이터:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ 테스트 성공!');
      console.log('📊 상세 정보:', data.data);
    } else {
      console.log('\n❌ 테스트 실패!');
      console.log('🔍 오류 정보:', data.error || data.message);
    }

    return { response, data };
  } catch (error) {
    console.error('\n💥 테스트 중 오류 발생:', error);
    console.error('스택 트레이스:', error.stack);
    throw error;
  }
}

// 브라우저 콘솔에서 실행할 경우
if (typeof window !== 'undefined') {
  window.testAligoSMS = testAligoSMS;
  console.log('✅ 테스트 함수가 준비되었습니다. testAligoSMS()를 실행하세요.');
}

// Node.js 환경에서 실행할 경우
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAligoSMS };
}

