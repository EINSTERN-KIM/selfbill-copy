엔드포인트: https://apis.aligo.in/send/ 
필수 파라미터: key/user_id/sender/receiver/msg
테스트: testmode_yn=Y 
대량발송 제한: receiver 1,000개/호출

## 로컬 테스트 절차 (Base44 Functions: sendAligoSMS)

### 0) 사전 조건
- 함수 파일: `functions/sendAligoSMS.ts`
- 예상 호출 경로: `/functions/sendAligoSMS`
- 환경변수(Functions 런타임에 주입되어야 함)
  - `ALIGO_API_KEY`
  - `ALIGO_USER_ID`
  - `ALIGO_SENDER`

### 1) 가장 간단한 테스트 (브라우저/프론트에서)
- 로그인된 상태에서 아래 요청을 실행한다.
- DevTools → Network에서 응답을 확인한다.

요청 바디:
```json
{
  "receiver": "01012345678",
  "message": "알리고 문자 테스트",
  "testmode": true
}
```

### 2) 테스트 스크립트 사용 (권장)

프로젝트 루트에 `test-aligo-sms.js` 파일이 있습니다. 브라우저 개발자 도구 콘솔에서 다음을 실행하세요:

```javascript
// 콘솔에서 직접 실행
await testAligoSMS();
```

### 3) 예상되는 문제점 및 해결 방법

#### 문제 1: 환경변수 미설정
**증상**: `"알리고 API 환경변수가 설정되지 않았습니다."` 오류  
**해결**: Base44 Functions 런타임에 다음 환경변수를 설정해야 합니다:
- `ALIGO_API_KEY`: 알리고 API 키
- `ALIGO_USER_ID`: 알리고 사용자 ID
- `ALIGO_SENDER`: 발신번호

#### 문제 2: 인증 실패
**증상**: `"Unauthorized"` 오류 (401)  
**해결**: 로그인된 상태에서 요청해야 합니다. Base44 인증 토큰이 필요합니다.

#### 문제 3: 알리고 API 오류
**증상**: `result_code`가 "1"이 아닌 경우  
**가능한 원인**:
- IP 주소 미등록 (알리고 관리자 페이지에서 발송 서버 IP 등록 필요)
- 발신번호 미등록
- API 키 또는 사용자 ID 오류
- 잔여 포인트 부족

**해결**: 알리고 관리자 페이지에서 설정을 확인하고, 응답의 `message` 필드를 확인하세요.

#### 문제 4: 네트워크 오류
**증상**: CORS 오류 또는 네트워크 연결 실패  
**해결**: Base44 Functions가 정상적으로 실행 중인지 확인하세요.
