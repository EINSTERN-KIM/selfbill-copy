/**
 * 금액을 "xxx,xxx원" 형식으로 포맷합니다.
 * 축약 표기(만, 천 등) 없이 1원 단위까지 정확하게 표시합니다.
 * 
 * @param {number} amount - 포맷할 금액 (원 단위)
 * @returns {string} "xxx,xxx원" 형식의 문자열
 */
export function formatWon(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0원";
  }
  
  return `${Math.round(amount).toLocaleString()}원`;
}