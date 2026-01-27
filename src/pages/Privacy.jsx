import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>

        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">똑빌 개인정보처리방침</h1>
            <p className="text-center text-slate-600 mb-8">똑빌(TTOKBILL) 개인정보처리방침 (Ver.1.0)<br />시행일: 2026년 1월 23일</p>
            
            <div className="prose prose-slate max-w-none space-y-6 text-sm">
              <p className="text-slate-600">
                똑빌 서비스 운영자(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며, 정보주체의 개인정보를 안전하게 처리하고 권익을 보호하기 위하여 본 개인정보처리방침을 수립·공개합니다.
              </p>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. 개인정보의 처리 목적</h2>
                <p className="text-slate-600 mb-2">회사는 다음 목적을 위해 개인정보를 처리합니다. 목적이 변경되는 경우 관련 법령에 따라 필요한 조치를 이행합니다.</p>
                <p className="text-slate-600 mb-2"><strong>(1) 회원 가입·로그인 및 계정 관리</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 이용자 식별, 가입 의사 확인, 인증, 계정 및 접근권한 관리, 부정 이용 방지, 본인 확인(해당 기능 제공 시)</p>
                <p className="text-slate-600 mb-2"><strong>(2) 서비스 제공(공동주택/집합건물 관리비·공용요금 관리)</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 건물생성, 대표자/입주자 초대·승인, 세대 구성</p>
                <p className="text-slate-600 ml-4 mb-2">- 청구서(관리비) 항목 관리, 산정·배분, 열람, 납부 현황 관리, 정산 및 통계 제공</p>
                <p className="text-slate-600 ml-4 mb-2">- 증빙자료(영수증/이체확인증 등) 업로드·보관 기능 제공(해당 기능 제공 시)</p>
                <p className="text-slate-600 mb-2"><strong>(3) 고객지원 및 고충·분쟁 처리</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 문의 응대, 민원 처리, 분쟁 대응, 공지/안내 전달, 서비스 운영상 사실관계 확인</p>
                <p className="text-slate-600 mb-2"><strong>(4) 유료 서비스 제공 및 결제·정산(해당 기능 제공 시)</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 구독 결제, 결제 내역 확인, 환불 처리, 회계·정산 처리, 법령상 보관 의무 이행</p>
                <p className="text-slate-600 mb-2"><strong>(5) 서비스 품질 개선 및 보안</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 접속기록/이용기록 분석, 오류 확인, 기능 개선, 보안 강화, 통계 산출</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. 처리하는 개인정보 항목 및 수집 방법</h2>
                <p className="text-slate-600 mb-4">회사는 서비스 제공에 필요한 최소한의 개인정보를 처리합니다.</p>
                
                <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-3">2.1 수집/처리 항목</h3>
                <p className="text-slate-600 mb-2"><strong>(1) 가입·로그인 시</strong>(이용자가 선택한 인증 방식에 따라 달라질 수 있음)</p>
                <p className="text-slate-600 ml-4 mb-2">- 이메일, 비밀번호(자체 계정 방식 제공 시), 이름</p>
                <p className="text-slate-600 ml-4 mb-2">- 휴대전화번호(고지/인증/보안 알림 기능 제공 시)</p>
                <p className="text-slate-600 mb-2"><strong>(2) 건물/세대 등록 및 이용 과정</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 건물(집합건물/공동주택) 식별정보 : 건물명, 주소, 동/호 또는 호실, 세대 수(또는 관리 단위)</p>
                <p className="text-slate-600 ml-4 mb-2">- 역할 및 권한 정보: 대표자/입주자 구분, 초대·승인 이력</p>
                <p className="text-slate-600 mb-2"><strong>(3) 청구서(관리비)·납부 관리</strong>(서비스 이용 과정에서 생성/입력되는 정보)</p>
                <p className="text-slate-600 ml-4 mb-2">- 청구 항목(공용전기/수도/청소비 등), 산정·배분 기준, 세대별 부과액, 납부 상태/일자</p>
                <p className="text-slate-600 mb-2"><strong>(4) 유료 결제 기능 제공 시</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 입금내역(입금일시, 입금액, 결제상태), 입금/환불 이력, 거래 식별정보</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">2.2 수집 방법</h3>
                <p className="text-slate-600 mb-1">- 이용자가 서비스 화면에서 직접 입력(가입, 건물/세대 등록, 청구서 입력 등)</p>
                <p className="text-slate-600 mb-1">- 서비스 이용 과정에서 자동 수집(로그, 기기정보, 쿠키 등)</p>
                <p className="text-slate-600 mb-2">- 대표자가 입주자를 초대·승인하면서 제공(호실 등 건물 내 정보)</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. 개인정보의 보유 및 이용기간</h2>
                <p className="text-slate-600 mb-2">회사는 개인정보를 처리 목적 달성 시까지 보유·이용하며, 관계 법령에 따라 보존이 필요한 경우 해당기간 동안 보관합니다.</p>
                <p className="text-slate-600 mb-2"><strong>(1) 회원정보</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 원칙 : 회원 탈퇴(계정 삭제) 시 지체 없이 파기</p>
                <p className="text-slate-600 ml-4 mb-2">- 예외 : 부정이용 방지, 분쟁 대응 등 필요 최소 범위에서 제한적으로 보관할 수 있음</p>
                <p className="text-slate-600 mb-2"><strong>(2) 건물 운영 데이터(청구서/정산/납부현황 등)</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 서비스 특성상 '건물 단위 공동 데이터'가 포함될 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-2">- 개인 계정 탈퇴만으로 공동 데이터 전체가 즉시 삭제되지 않을 수 있으며, 회사는 개인 식별정보를 분리·최소화하여 관리하거나 접근을 제한하는 방식으로 처리합니다.</p>
                <p className="text-slate-600 mb-2"><strong>(3) 법령에 따른 보관(해당되는 경우)</strong></p>
                <p className="text-slate-600 ml-4 mb-1">- 표시/광고에 관한 기록 : 6개월</p>
                <p className="text-slate-600 ml-4 mb-1">- 계약 또는 청약철회 등에 관한 기록: 5년</p>
                <p className="text-slate-600 ml-4 mb-1">- 대금결제 및 재화 등의 공급에 관한 기록: 5년</p>
                <p className="text-slate-600 ml-4 mb-1">- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년</p>
                <p className="text-slate-600 ml-4 mb-2">- 서비스 이용 관련 접속기록 등: 3개월(해당 법령 범위 내)</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. 개인정보의 제3자 제공</h2>
                <p className="text-slate-600 mb-2">회사는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다.</p>
                <p className="text-slate-600 mb-2"><strong>(1) 예외 사항</strong></p>
                <p className="text-slate-600 ml-4 mb-1">- 이용자가 사전에 동의한 경우</p>
                <p className="text-slate-600 ml-4 mb-2">- 법령에 근거하거나 수사기관 등의 적법한 절차에 따른 요청이 있는 경우</p>
                <p className="text-slate-600 mb-2"><strong>(2) 동일 건물 내 공개 범위</strong></p>
                <p className="text-slate-600 mb-2">서비스의 투명한 운영을 위해, 같은 건물(단지) 입주자에게 다음 정보가 제한적으로 표시될 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-1">- 호실(동/호), 이름 일부</p>
                <p className="text-slate-600 ml-4 mb-1">- 세대별 부과액 및 납부 상태(완납/미납/부분납 등)</p>
                <p className="text-slate-600 ml-4 mb-2">- 공용 항목별 총액 및 산정 근거(대표자가 입력한 범위)</p>
                <p className="text-slate-600 mb-2">회사는 전화번호·이메일 등 연락처 정보는 원칙적으로 다른 입주자에게 공개하지 않습니다.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. 개인정보 처리의 위탁</h2>
                <p className="text-slate-600 mb-2">회사는 서비스 제공을 위해 개인정보 처리 업무를 외부 전문업체에 위탁할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">위탁이 발생하는 경우, 회사는 관련 법령에 따라 수탁자, 위탁업무 내용, 보유·이용기간 등을 본 방침 또는 서비스 공지사항을 통해 공개하고, 계약을 통해 안전하게 관리·감독합니다.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. 정보주체의 권리·의무 및 행사방법</h2>
                <p className="text-slate-600 mb-2">정보주체는 관련 법령에 따라 다음 권리를 행사할 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-2">- 개인정보 열람, 정정·삭제, 처리정지, 동의철회(해당 시) 등</p>
                <p className="text-slate-600 mb-2">권리 행사는 서비스 내 설정/고객센터(문의하기) 또는 회사가 안내하는 방법으로 요청할 수 있으며, 회사는 지체 없이 조치합니다.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. 개인정보의 파기 절차 및 방법</h2>
                <p className="text-slate-600 mb-2"><strong>(1) 파기 절차</strong> : 파기 사유 발생 시 파기 대상 개인정보를 선정하여 내부 절차에 따라 파기합니다.</p>
                <p className="text-slate-600 mb-2"><strong>(2) 파기 방법</strong></p>
                <p className="text-slate-600 ml-4 mb-2">- 전자적 파일 : 복구 불가능한 방법으로 영구 삭제</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">8. 개인정보의 안전성 확보조치</h2>
                <p className="text-slate-600 mb-2">회사는 개인정보의 안전성 확보를 위해 다음 조치를 시행합니다.</p>
                <p className="text-slate-600 mb-1">- 관리적 조치 : 내부관리계획 수립, 정기 교육, 취급자 최소화</p>
                <p className="text-slate-600 mb-1">- 기술적 조치 : 접근권한 관리, 암호화(전송/저장), 침해 대응, 접속기록 보관 및 위·변조 방지, 백업/복구</p>
                <p className="text-slate-600 mb-2">- 물리적 조치 : 자료 보관 장소 및 시스템 접근 통제(해당 시)</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">9. 자동 수집 장치(쿠키 등)의 설치·운영 및 거부</h2>
                <p className="text-slate-600 mb-2">회사는 웹 기반 서비스 제공을 위해 쿠키(cookie) 등 자동 수집 장치를 사용할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있으며, 이 경우 일부 서비스 이용이 제한될 수 있습니다.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">10. 개인정보 보호책임자 및 고충처리</h2>
                <p className="text-slate-600 mb-2">회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 개인정보 관련 고충처리를 위해 다음과 같이 운영합니다.</p>
                <p className="text-slate-600 mb-1">- 개인정보 보호책임자 : 대표 김경아</p>
                <p className="text-slate-600 mb-2">- 고충처리/문의 접수 : 서비스 내 고객센터(문의하기) 또는 회사가 서비스 내에 고지한 개인정보 문의 채널</p>
                <p className="text-slate-600 mb-2">회사는 접수된 문의를 신속히 검토하여 답변 드립니다.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">11. 권익침해 구제방법</h2>
                <p className="text-slate-600 mb-2">정보주체는 개인정보 침해로 인한 구제를 받기 위해 아래 기관에 상담·신고할 수 있습니다.</p>
                <p className="text-slate-600 mb-1">- 개인정보침해 신고센터(한국인터넷진흥원): 국번없이 118</p>
                <p className="text-slate-600 mb-1">- 개인정보분쟁조정위원회: 국번없이 1833-6972</p>
                <p className="text-slate-600 mb-2">- 경찰청 사이버수사국: 국번없이 182</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">12. 개인정보처리방침의 변경</h2>
                <p className="text-slate-600 mb-2">본 방침의 내용이 추가·삭제·수정될 경우, 회사는 시행 전에 서비스 내 공지사항 등 이용자가 확인할 수 있는 방법으로 안내합니다.</p>
                <p className="text-slate-600 mb-1">- 경미한 변경 : 최소 7일 전 공지</p>
                <p className="text-slate-600 mb-2">- 이용자에게 불리한 중대한 변경 : 최소 30일 전 공지</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}