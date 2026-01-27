import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Onboarding"))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>

        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">똑빌 서비스이용약관</h1>
            <p className="text-center text-slate-600 mb-8">시행일: 2026년 1월 23일</p>
            
            <div className="prose prose-slate max-w-none space-y-6 text-sm">
              <p className="text-slate-600">
                본 약관은 주식회사 펜타라(이하 "회사")가 운영하는 "똑빌(TTOKBILL)" 서비스의 이용과 관련하여 회사와 이용자 간 권리·의무 및 책임사항 등을 규정합니다.
              </p>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">제1장 총칙</h2>
                
                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제1조(목적)</h3>
                <p className="text-slate-600">
                  본 약관은 회사가 제공하는 똑빌 웹 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제2조(용어의 정의)</h3>
                <p className="text-slate-600 mb-2">① "서비스"란 회사가 웹을 통해 제공하는 공동주택·집합건물 등(이하 "건물")의 공용비용/관리비 관련 업무를 지원하는 기능(청구서 생성·열람·공유, 납부 현황 관리, 정산 내역 공유, 공지·소통, 문서 보관, 리포트 제공 등) 및 이에 부수하는 제반 기능을 말합니다.</p>
                <p className="text-slate-600 mb-2">② "이용자"란 본 약관에 동의하고 회사와 서비스 이용계약을 체결하여 서비스를 이용하는 개인 또는 법인을 말합니다.</p>
                <p className="text-slate-600 mb-2">③ "대표자"란 특정 건물(또는 단위)에 대해 서비스를 개설·운영하며, 입주자 초대·권한부여·권한회수, 건물/세대 정보 설정, 결제(유료서비스) 책임 등을 수행하는 자를 말합니다.</p>
                <p className="text-slate-600 mb-2">④ "입주자"란 대표자의 초대 및 승인 절차를 통해 해당 건물 단위에서 서비스를 이용할 수 있는 권한을 부여받은 자(세대주/입주민/권한 위임자 등)를 말합니다.</p>
                <p className="text-slate-600 mb-2">⑤ "세대"란 대표자가 서비스에 등록한 건물 내의 개별 호수/세대/점포 등 회사가 정한 단위(주거 또는 상가 포함)를 의미합니다.</p>
                <p className="text-slate-600 mb-2">⑥ "운영 데이터"란 서비스 이용 과정에서 이용자가 입력·업로드·연동·생성하는 청구서, 납부내역, 정산기준(배분규칙), 항목설정, 공지, 파일/문서, 메시지 등 일체의 데이터를 말합니다.</p>
                <p className="text-slate-600 mb-2">⑦ "유료서비스"란 서비스 중 회사가 별도 요금을 부과하여 제공하는 기능 또는 이용권을 말합니다.</p>
                <p className="text-slate-600 mb-2">⑧ 본 약관에서 정하지 아니한 용어는 관계 법령 및 일반 상관례에 따릅니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제3조(약관의 효력 및 적용범위)</h3>
                <p className="text-slate-600 mb-2">① 본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 서비스별로 개별 약관, 운영정책, 가이드, 공지(이하 "운영정책 등")를 둘 수 있으며, 운영정책 등은 본 약관과 함께 서비스 이용계약의 일부를 구성합니다.</p>
                <p className="text-slate-600 mb-2">③ 본 약관과 운영정책 등이 상충할 경우, 특별히 정한 바가 없는 한 운영정책 등이 우선합니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제4조(약관의 명시 및 개정)</h3>
                <p className="text-slate-600 mb-2">① 회사는 이용자가 약관 내용을 쉽게 확인할 수 있도록 서비스 내에 게시합니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 관계 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 회사가 약관을 개정하는 경우 적용일자 및 개정사유를 명시하여 적용일 7일 전부터 공지합니다. 다만, 이용자에게 불리하거나 권리·의무에 중대한 영향을 미치는 변경(유료서비스 요금/환불 기준, 책임 제한의 중요한 변경, 서비스 종료 등)의 경우에는 적용일 30일 이전에 공지하는 것을 원칙으로 합니다.</p>
                <p className="text-slate-600 mb-2">④ 이용자가 개정 약관에 동의하지 않는 경우 서비스 이용계약을 해지(탈퇴)할 수 있습니다. 개정 약관의 적용일 이후에도 서비스를 계속 이용하는 경우 이용자는 개정 약관에 동의한 것으로 봅니다(관계 법령이 허용하는 범위 내).</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제5조(약관 외 준칙)</h3>
                <p className="text-slate-600">
                  본 약관에서 정하지 않은 사항 및 해석은 약관의 규제에 관한 법률, 전자상거래 등에서의 소비자 보호에 관한 법률, 개인정보보호법, 정보통신망 관련 법령(해당 시) 및 기타 관계 법령과 상관례에 따릅니다.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제6조(운영정책 등)</h3>
                <p className="text-slate-600 mb-2">① 회사는 서비스의 안전한 운영, 이용자 보호, 공정한 이용질서 유지를 위해 운영정책 등을 제정·변경할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 운영정책 등은 서비스 내 공지 또는 연결화면을 통해 안내하며, 이용자는 이를 준수하여야 합니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제2장 이용계약 및 계정</h2>
                
                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제7조(이용계약의 성립)</h3>
                <p className="text-slate-600 mb-2">① 서비스 이용계약은 이용자가 약관에 동의하고 회사가 정한 방식(회원가입, 건물 생성, 초대 수락 등)으로 이용 신청을 하며, 회사가 이를 승낙함으로써 성립합니다.</p>
                <p className="text-slate-600 mb-2">② 대표자는 건물 단위로 서비스를 개설할 수 있으며, 회사는 건물명/주소/세대 수 등 최소 정보를 요구할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 회사는 다음 각 호에 해당하는 경우 승낙을 거절하거나 사후에 이용계약을 해지할 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 타인의 명의/정보를 도용하거나 허위 정보를 기재한 경우</p>
                <p className="text-slate-600 ml-4 mb-1">2. 법령 또는 본 약관을 위반하거나 위반할 우려가 있는 경우</p>
                <p className="text-slate-600 ml-4 mb-1">3. 서비스의 안정적 운영을 방해하거나 보안상 위험을 초래하는 경우</p>
                <p className="text-slate-600 ml-4 mb-1">4. 유료서비스 이용요금의 미납 등 이용자가 부담하는 채무를 이행하지 않는 경우</p>
                <p className="text-slate-600 ml-4 mb-2">5. 기타 회사가 합리적으로 필요하다고 판단하는 경우</p>
                <p className="text-slate-600 mb-2">④ 만 14세 미만은 원칙적으로 서비스 이용계약을 체결할 수 없습니다. (필요 시 회사가 별도 절차를 안내).</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제8조(역할 및 권한과 책임)</h3>
                <p className="text-slate-600 mb-2">① 대표자는 해당 건물 단위에서 다음 각 호의 권한을 가질 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 입주자 초대/승인/권한부여/권한회수</p>
                <p className="text-slate-600 ml-4 mb-1">2. 건물/세대 정보 및 배분규칙 설정</p>
                <p className="text-slate-600 ml-4 mb-1">3. 청구서 생성 및 공유 범위 설정</p>
                <p className="text-slate-600 ml-4 mb-2">4. 유료서비스 결제 책임자</p>
                <p className="text-slate-600 mb-2">② 입주자는 대표자에 의해 부여된 범위에서 열람, 입력, 납부확인, 의견 작성 등 서비스를 이용할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 대표자는 입주자에게 운영 데이터가 공유되거나 알림이 발송될 수 있음을 고지하고, 필요한 동의(연락처 제공, 안내 수신 등)를 적법하게 확보할 책임이 있습니다.</p>
                <p className="text-slate-600 mb-2">④ 대표자는 건물 운영과 관련된 운영 데이터의 정확성 및 최신성 유지에 대해 1차 책임을 부담하며, 입주자는 자신이 입력/업로드한 운영 데이터에 대해 책임을 부담합니다.</p>
                <p className="text-slate-600 mb-2">⑤ 대표자는 입주자 간 분쟁(정산 기준, 납부 여부, 금액 오류 등)이 발생한 경우 당사자 간 해결을 원칙으로 하며, 회사는 제8장에 정한 범위 내에서만 책임을 부담합니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제9조(이용자 정보의 변경)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 서비스 내 설정 또는 회사가 정한 방법으로 이용자 정보를 열람·수정할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 이용자가 변경사항을 갱신하지 않아 발생한 불이익에 대해 회사는 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제10조(계정 및 인증정보의 관리)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 계정(이메일/휴대전화 등), 비밀번호 등을 스스로 관리할 책임이 있습니다.</p>
                <p className="text-slate-600 mb-2">② 이용자는 계정/인증정보를 제3자에게 공유·양도·대여할 수 없으며, 부정 사용이 의심되는 경우 즉시 회사에 알려야 합니다.</p>
                <p className="text-slate-600 mb-2">③ 이용자의 관리 소홀로 발생한 손해에 대하여 회사는 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제11조(이용자에 대한 통지)</h3>
                <p className="text-slate-600 mb-2">① 회사는 서비스 내 공지, 이메일, 문자(SMS/MMS), 푸시 알림 등 합리적인 방법으로 이용자에게 통지할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 불특정 다수에 대한 통지는 서비스 내 공지로 갈음할 수 있으나, 이용자에게 중대한 영향을 미치는 사항은 가능한 한 개별 통지를 병행합니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제3장 서비스 이용</h2>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제12조(서비스 제공 범위)</h3>
                <p className="text-slate-600 mb-2">① 회사는 이용자에게 다음 각 호의 기능을 제공합니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 건물/세대 설정 및 입주자 초대</p>
                <p className="text-slate-600 ml-4 mb-1">2. 공용비용/관리비 항목 설정 및 배분규칙 관리</p>
                <p className="text-slate-600 ml-4 mb-1">3. 청구서 생성·열람·공유 및 납부 현황 관리</p>
                <p className="text-slate-600 ml-4 mb-2">4. 리포트/통계 등 정보 제공</p>
                <p className="text-slate-600 mb-2">② 서비스는 "업무 지원 도구"이며, 회사는 법률·세무·회계·관리업(면허/등록이 필요한 업무)의 대행을 제공하지 않습니다. 이용자는 필요 시 전문가 자문을 별도로 받아야 합니다.</p>
                <p className="text-slate-600 mb-2">③ 회사는 이용자의 운영 데이터에 기반하여 산출 결과를 표시할 수 있으나, 그 결과의 법적 효력 또는 분쟁 해결을 보증하지 않습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제13조(서비스 이용시간)</h3>
                <p className="text-slate-600 mb-2">① 서비스는 원칙적으로 연중무휴 24시간 제공을 목표로 하나, 점검·장애·외부 인프라 이슈 등으로 일시 중단될 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 안정적 제공을 위해 필요한 조치를 취할 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제14조(이용자의 의무 및 금지행위)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 다음 행위를 해서는 안 됩니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 타인의 정보 도용, 허위 가입/허위 정보 입력</p>
                <p className="text-slate-600 ml-4 mb-1">2. 권한 없는 접근, 해킹, 악성코드 유포, 서비스 장애 유발 행위</p>
                <p className="text-slate-600 ml-4 mb-1">3. 불법·유해 정보 게시, 명예훼손, 사기, 스팸 발송</p>
                <p className="text-slate-600 ml-4 mb-1">4. 회사 또는 제3자의 지식재산권 침해</p>
                <p className="text-slate-600 ml-4 mb-1">5. 서비스의 운영정책 위반 또는 부정 이용(무료기간/쿠폰 남용 등)</p>
                <p className="text-slate-600 ml-4 mb-2">6. 기타 관계 법령 위반 행위</p>
                <p className="text-slate-600 mb-2">② 이용자는 서비스 이용과 관련하여 관계 법령, 본 약관, 운영정책 등을 준수해야 합니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제15조(운영 데이터의 정확성 및 관리 책임)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 운영 데이터(청구서, 납부내역, 정산기준 등)의 사실성·완전성·최신성을 확인할 책임이 있습니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 운영 데이터의 생성·열람·공유를 위한 도구를 제공하나, 이용자 입력/합의 내용 및 이에 기반한 당사자 간 금전 분쟁에 대해 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>
                <p className="text-slate-600 mb-2">③ 이용자는 청구서 원본(고지·청구 문서), 영수증, 통장 내역 등 근거자료를 별도로 보관해야 하며, 이를 소홀히 하여 발생한 손해에 대해 회사는 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제16조(외부 서비스 연동 및 책임 범위)</h3>
                <p className="text-slate-600 mb-2">① 회사는 결제대행(PG), 문자 발송, 클라우드 등 외부 서비스와 연동하여 기능을 제공할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 외부 서비스 장애 또는 정책 변경으로 서비스 일부가 제한될 수 있으며, 회사는 합리적인 범위에서 안내·대응하되 회사의 관리 범위를 벗어난 사유에 대해서는 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>
                <p className="text-slate-600 mb-2">③ 결제는 현금 입금으로 처리되며 차후 결제대행사(PG)를 통해 처리 예정입니다. 결제 관련 세부 절차는 서비스 내 안내 및 결제대행사의 정책이 함께 적용될 수 있습니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제4장 서비스 운영, 변경, 중단</h2>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제17조(서비스의 변경)</h3>
                <p className="text-slate-600 mb-2">① 회사는 품질 향상, 보안 강화, 기능 개선, 법령/정책 변경 등을 위해 서비스의 전부 또는 일부를 변경할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 이용자에게 중대한 영향을 미치는 변경(유료 기능의 핵심 변경, 필수 기능 중단, 요금체계 변경 등)은 적용일 및 변경 내용을 사전에 안내합니다.</p>
                <p className="text-slate-600 mb-2">③ 경미한 UI 변경, 오류 수정, 보안 패치 등은 사후 공지로 갈음할 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제18조(점검 및 서비스 중단)</h3>
                <p className="text-slate-600 mb-2">① 회사는 정기 또는 비정기 점검을 실시할 수 있으며, 예정된 점검은 가능한 한 사전에 공지합니다.</p>
                <p className="text-slate-600 mb-2">② 다음 사유가 있는 경우 회사는 서비스를 일시 중단할 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 설비 보수/교체/증설, 장애 대응</p>
                <p className="text-slate-600 ml-4 mb-1">2. 외부 인프라/통신망/클라우드 장애</p>
                <p className="text-slate-600 ml-4 mb-2">3. 천재지변, 정전, 국가비상사태 등 불가항력</p>
                <p className="text-slate-600 mb-2">③ 회사는 중단 발생 시 지체 없이 진행 상황(가능한 경우 예상 복구 시점 포함)을 안내하기 위해 노력합니다. 긴급 상황에서는 선조치 후안내할 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제19조(데이터 보관, 백업 및 복구)</h3>
                <p className="text-slate-600 mb-2">① 회사는 서비스 운영을 위해 합리적인 수준의 보안 및 백업 체계를 운영하기 위해 노력합니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 운영 데이터의 보관 기간, 백업 주기, 복구 범위를 운영정책으로 정할 수 있으며 서비스 내 안내합니다.</p>
                <p className="text-slate-600 mb-2">③ 회사는 회사의 고의 또는 중대한 과실이 없는 한 데이터 손실로 인한 손해에 대해 책임을 부담하지 않습니다. 다만, 회사의 귀책사유가 인정되는 경우 제8장에 따릅니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제20조(서비스 종료 및 데이터 내보내기)</h3>
                <p className="text-slate-600 mb-2">① 회사가 서비스의 전부 또는 일부를 종료하는 경우, 종료 예정일, 사유, 대체 수단, 데이터 내보내기 방법 등을 사전에 안내합니다(중대한 영향 시 30일 이전 고지를 원칙).</p>
                <p className="text-slate-600 mb-2">② 회사는 이용자가 운영 데이터를 열람·다운로드할 수 있는 기간을 운영정책으로 정할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 종료/해지 후 데이터 보관 및 삭제는 제39조에 따릅니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제5장 게시물 및 지식재산권</h2>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제21조(이용자 콘텐츠의 권리 및 이용허락)</h3>
                <p className="text-slate-600 mb-2">① 운영 데이터 및 이용자가 작성·업로드한 콘텐츠의 권리는 원칙적으로 이용자 또는 정당한 권리자에게 귀속됩니다.</p>
                <p className="text-slate-600 mb-2">② 이용자는 회사가 서비스를 제공·유지·개선(오류 수정, 보안 강화, 기능 제공을 위한 처리 포함)하기 위해 필요한 범위에서 운영 데이터를 저장, 처리, 표시, 전송할 수 있도록 비독점적·무상 이용허락을 부여합니다.</p>
                <p className="text-slate-600 mb-2">③ 회사는 본 조의 목적 범위를 초과하여 운영 데이터를 이용하거나 제3자에게 제공하지 않으며, 필요한 경우 별도 동의 및 개인정보처리방침에 따릅니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제22조(게시물의 관리)</h3>
                <p className="text-slate-600 mb-2">① 회사는 다음 사유가 있는 경우 게시물/콘텐츠의 노출 제한, 삭제, 이동 등의 조치를 할 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 법령 위반 또는 타인의 권리 침해</p>
                <p className="text-slate-600 ml-4 mb-1">2. 본 약관 또는 운영정책 위반</p>
                <p className="text-slate-600 ml-4 mb-2">3. 스팸/악성코드/피싱 등 서비스 안전을 위협하는 경우</p>
                <p className="text-slate-600 mb-2">② 회사는 원칙적으로 조치 사유를 통지하며, 긴급 조치가 필요한 경우 선조치 후통지할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 이용자는 회사의 조치에 대해 회사가 정한 절차로 이의제기 할 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제23조(서비스 및 회사 저작물의 지식재산권)</h3>
                <p className="text-slate-600 mb-2">① 서비스, 소프트웨어, UI, 로고, 상표, 문서, 콘텐츠 등 회사가 제공하는 저작물에 대한 권리는 회사 또는 정당한 권리자에게 귀속됩니다.</p>
                <p className="text-slate-600 mb-2">② 이용자는 회사의 사전 승낙 없이 이를 복제, 배포, 전송, 2차적 저작물 작성, 역설계, 판매, 대여 등 할 수 없습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제24조(이용 제한 사항)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 회사의 명시적 승인 없이 서비스를 영리 목적의 재판매, 재임대, 재라이선스, 대행 제공 형태로 이용할 수 없습니다.</p>
                <p className="text-slate-600 mb-2">② 이용자가 본 조를 위반한 경우 회사는 제38조에 따라 이용을 제한할 수 있습니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제6장 유료서비스, 결제, 해지 및 환불</h2>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제25조(유료서비스의 정의 및 적용)</h3>
                <p className="text-slate-600 mb-2">① 회사는 서비스의 전부 또는 일부를 유료서비스로 제공할 수 있으며, 구체적 내용·요금·과금 방식·제공 기간은 본 장 및 서비스 내 안내에 따릅니다.</p>
                <p className="text-slate-600 mb-2">② 유료서비스는 건물 단위로 제공되며, 대표자가 결제 책임을 부담합니다.</p>
                <p className="text-slate-600 mb-2">③ 회사는 유료서비스 제공 조건을 변경하는 경우 제31조 및 제4조에 따라 고지합니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제26조(요금제 및 과금 단위: 세대 수 기준)</h3>
                <p className="text-slate-600 mb-2">① 이용요금은 건물에 등록된 세대 수 기준으로 산정합니다. 세대당 월 3,900원이 과금되며, 월 이용요금은 세대 수에 세대당 단가를 곱하여 산정합니다.</p>
                <p className="text-slate-600 mb-2">예) 10세대 : 39,000원, 11세대 : 42,900원</p>
                <p className="text-slate-600 mb-2">② 세대 수 입력·관리의 정확성 책임은 대표자에게 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제27조(무료 이용기간: 가입 후 1개월)</h3>
                <p className="text-slate-600 mb-2">① 회사는 프로모션으로 건물 생성일로부터 1개월 간 이용요금을 부과하지 않을 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 무료 이용기간의 적용 범위, 시작/종료 기준, 대상, 조건(결제수단 등록 필요 여부 등)은 서비스 내 안내에 따릅니다.</p>
                <p className="text-slate-600 mb-2">③ 무료 이용기간은 원칙적으로 건물당 1회로 제한될 수 있으며, 남용이 확인되는 경우 제공이 제한되거나 회수될 수 있습니다.</p>
                <p className="text-slate-600 mb-2">④ 무료 이용기간 종료 전 해지하지 않고 유료서비스를 계속 이용하는 경우, 무료 이용기간 종료일 다음 날부터 이용요금이 부과될 수 있습니다(자동결제 동의가 있는 경우).</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제28조(결제수단 등록 및 자동결제)</h3>
                <p className="text-slate-600 mb-2">① 유료서비스 이용자는 회사가 제공하는 결제수단을 등록하거나 회사가 정한 방식으로 결제해야 합니다.</p>
                <p className="text-slate-600 mb-2">② 정기결제(자동결제)를 선택한 경우, 이용자는 매 결제일에 이용요금이 자동 청구되는 것에 동의합니다.</p>
                <p className="text-slate-600 mb-2">③ 결제수단 변경/갱신/해제는 서비스 내 설정 또는 회사가 안내하는 방법으로 가능하며, 결제일 직전/당일 등 즉시 반영이 어려운 경우 다음 결제일부터 적용될 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제29조(결제일, 이용기간 및 청구 기준)</h3>
                <p className="text-slate-600 mb-2">① 결제일은 원칙적으로 유료서비스 전환일(무료 이용기간 종료일의 다음 날 또는 유료 신청일)과 동일한 일자에 매월 반복됩니다. 해당 월에 동일 일자가 없는 경우 말일로 할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 이용기간은 결제일(포함)부터 다음 결제일 전일(포함)까지로 합니다.</p>
                <p className="text-slate-600 mb-2">③ 세대 수 변동은 원칙적으로 다음 결제 주기부터 반영합니다. 다만 즉시 상향 제공 등 회사 정책이 있는 경우 변동 시점에 따라 추가 과금 또는 차기 결제 시 합산 청구될 수 있으며, 이 경우 사전에 명확히 안내합니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제30조(부가서비스 및 추가 과금)</h3>
                <p className="text-slate-600 mb-2">① 회사는 문자(SMS/MMS) 발송, 추가 저장공간 등 부가서비스를 별도 유료로 제공할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 부가서비스의 요금, 과금 방식(선불/후불), 제공 조건은 서비스 내 별도 안내 및 해당 정책에 따릅니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제31조(요금 변경)</h3>
                <p className="text-slate-600 mb-2">① 회사는 운영상·기술상 필요 또는 시장 환경 변경 등에 따라 요금을 변경할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 이용자에게 불리한 요금 변경은 적용일 30일 이전에 변경 내용과 사유를 고지하는 것을 원칙으로 합니다.</p>
                <p className="text-slate-600 mb-2">③ 이용자는 요금 변경에 동의하지 않는 경우 적용일 이전까지 해지할 수 있으며, 적용일 이후 계속 이용하는 경우 변경된 요금에 동의한 것으로 봅니다(관계 법령이 허용하는 범위 내).</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제32조(유료서비스 해지 및 이용종료)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 언제든지 서비스 내 해지 기능 또는 회사가 안내하는 방법으로 해지를 신청할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 해지 효력은 원칙적으로 결제 주기 종료 시점에 발생합니다(즉시 해지 정책이 있는 경우 그에 따름).</p>
                <p className="text-slate-600 mb-2">③ 해지 후 데이터 열람/다운로드(읽기 전용 제공 여부 포함) 기간과 범위는 운영정책에 따릅니다.</p>
                <p className="text-slate-600 mb-2">④ 해지 후 동일 건물로 재가입하는 경우 무료 이용기간이 재부여되지 않을 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제33조(환불 정책)</h3>
                <p className="text-slate-600 mb-2">① 회사는 관계 법령 및 본 약관에 따라 환불을 처리합니다.</p>
                <p className="text-slate-600 mb-2">② 월 구독형 서비스 특성상 결제 주기 중도 해지 시 원칙적으로 일할 환불하지 않을 수 있습니다. 다만, 회사 귀책사유로 유료서비스를 정상 이용할 수 없는 상태가 상당 기간 지속되는 등 합리적 사유가 있는 경우 이용기간 연장, 일부 환불 등 적절한 조치를 검토할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 이용자가 할인/쿠폰/프로모션 혜택을 받은 경우 환불 시 해당 혜택 상당액이 공제될 수 있습니다(관계 법령이 허용하는 범위 내).</p>
                <p className="text-slate-600 mb-2">④ 환불은 원칙적으로 원 결제수단으로 진행되며, PG/금융기관 사정으로 일정 기간이 소요될 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제34조(미납 및 결제실패)</h3>
                <p className="text-slate-600 mb-2">① 결제일에 결제가 실패한 경우 회사는 재결제를 시도하거나 결제수단 변경/갱신을 요청할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 결제실패가 일정 기간 해소되지 않으면 회사는 기능 제한(예: 읽기 전용 전환, 발송 제한 등) 또는 유료서비스 제공 중단을 할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 회사는 가능한 범위에서 사전 안내 후 조치하되, 긴급한 경우 선 조치 후 안내할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">④ 미납이 장기간 지속되는 경우 회사는 이용계약을 해지할 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제35조(프로모션, 쿠폰, 할인)</h3>
                <p className="text-slate-600 mb-2">① 회사는 기간·대상·조건을 정하여 프로모션을 제공할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 제공 조건, 사용 기간, 중복 적용 여부, 회수/취소 조건은 서비스 내 안내에 따릅니다.</p>
                <p className="text-slate-600 mb-2">③ 부정 사용이 확인되는 경우 회사는 혜택 회수 및 이용 제한/해지를 할 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제36조(유료서비스 종료 및 정산)</h3>
                <p className="text-slate-600 mb-2">① 회사가 유료서비스를 종료하는 경우 종료 예정일, 사유, 데이터 내보내기 방법 등을 사전에 고지합니다(중대한 영향 시 30일 이전 고지 원칙).</p>
                <p className="text-slate-600 mb-2">② 종료로 인해 이미 결제한 기간 중 미제공 기간이 발생하는 경우, 회사는 관계 법령에 따라 합리적 범위에서 환불 또는 이용기간 연장 등의 조치를 합니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제7장 계약해지 및 이용제한</h2>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제37조(이용계약 해지 및 회원 탈퇴)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 언제든지 서비스 내 탈퇴 기능 또는 회사가 안내하는 방법으로 이용계약 해지를 신청할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 이용자의 요청을 처리하며, 관련 데이터 처리(보관/삭제)는 제39조 및 운영정책에 따릅니다.</p>
                <p className="text-slate-600 mb-2">③ 유료서비스 이용 중 탈퇴 시 제32조 및 제33조가 함께 적용됩니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제38조(이용제한 사유 및 절차)</h3>
                <p className="text-slate-600 mb-2">① 회사는 이용자가 다음에 해당하는 경우 이용을 제한(접속 제한, 기능 제한, 계정 정지 등)할 수 있습니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 본 약관/운영정책 위반</p>
                <p className="text-slate-600 ml-4 mb-1">2. 서비스 보안/안정성 침해(해킹, 악성코드, 비정상 트래픽 등)</p>
                <p className="text-slate-600 ml-4 mb-1">3. 타인의 권리 침해 또는 불법행위</p>
                <p className="text-slate-600 ml-4 mb-2">4. 결제실패/미납의 장기화</p>
                <p className="text-slate-600 mb-2">② 회사는 원칙적으로 제한 사유, 범위, 이의제기 방법을 사전 통지합니다. 다만 긴급한 보안 위험 또는 피해 확산 우려가 있는 경우 선 조치 후 통지할 수 있습니다.</p>
                <p className="text-slate-600 mb-2">③ 이용자는 회사 조치에 대해 이의 제기할 수 있으며, 회사는 합리적인 범위에서 검토 후 결과를 안내합니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제39조(해지/정지 후 데이터 처리)</h3>
                <p className="text-slate-600 mb-2">① 회사는 이용계약 종료 시점 이후 운영 데이터를 즉시 삭제하지 않고, 분쟁 대응, 법령 준수, 정산 처리 등을 위해 일정 기간 보관할 수 있으며, 구체 기간은 운영정책으로 정합니다.</p>
                <p className="text-slate-600 mb-2">② 보관 기간 경과 후 회사는 운영 데이터를 삭제하거나 비식별 처리할 수 있습니다(관계 법령 및 개인정보처리방침에 따름).</p>
                <p className="text-slate-600 mb-2">③ 이용자는 계약 종료 전 중요한 운영 데이터를 다운로드/백업해야 하며, 이를 소홀히 하여 발생한 손해에 대해 회사는 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제8장 책임 및 면책</h2>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제40조(회사의 의무)</h3>
                <p className="text-slate-600 mb-2">① 회사는 관계 법령과 본 약관이 금지하는 행위를 하지 않으며, 안정적 서비스 제공을 위해 노력합니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 보안 강화를 위해 합리적인 보호조치를 시행하기 위해 노력합니다.</p>
                <p className="text-slate-600 mb-2">③ 회사는 이용자의 문의/불만이 정당하다고 인정되는 경우 합리적인 기간 내 처리하기 위해 노력합니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제41조(책임의 제한)</h3>
                <p className="text-slate-600 mb-2">① 회사는 회사의 고의 또는 중대한 과실로 이용자에게 손해가 발생한 경우 관계 법령에 따라 책임을 부담합니다.</p>
                <p className="text-slate-600 mb-2">② 회사가 책임을 부담하는 경우에도 그 범위는 통상손해로 한정되며, 특별손해(간접손해, 영업손실, 일실이익 등)에 대해서는 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>
                <p className="text-slate-600 mb-2">③ 유료서비스와 관련하여 회사의 배상책임이 인정되는 경우 배상 한도는 손해 발생일 직전 3개월 동안 이용자가 회사에 실제로 지급한 이용요금 총액을 초과하지 않습니다. 단, 회사의 고의 또는 중대한 과실로 인한 손해에는 적용되지 않습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제42조(면책)</h3>
                <p className="text-slate-600 mb-2">① 회사는 다음 각 호의 사유로 서비스를 제공할 수 없거나 제한되는 경우 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>
                <p className="text-slate-600 ml-4 mb-1">1. 천재지변, 정전, 국가비상사태 등 불가항력</p>
                <p className="text-slate-600 ml-4 mb-1">2. 외부 통신망/클라우드/결제대행 등 회사의 관리 범위를 벗어난 장애</p>
                <p className="text-slate-600 ml-4 mb-1">3. 이용자의 귀책사유(계정 관리 소홀, 허위 입력, 내부 분쟁 등)</p>
                <p className="text-slate-600 ml-4 mb-2">4. 회사가 사전에 공지한 점검</p>
                <p className="text-slate-600 mb-2">② 회사는 이용자 간 또는 이용자와 제3자 간 분쟁(정산, 납부, 금전거래 등)에 개입할 의무가 없으며, 회사의 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제43조(손해배상 청구 절차)</h3>
                <p className="text-slate-600 mb-2">① 이용자는 손해배상을 청구하려는 경우 손해 발생 사실, 청구 금액, 산출 근거 및 입증자료를 회사가 지정한 고객센터 이메일로 제출해야 합니다.</p>
                <p className="text-slate-600 mb-2">② 회사는 접수 후 합리적인 기간 내 검토 결과를 안내합니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">제9장 분쟁해결</h2>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제44조(준거법)</h3>
                <p className="text-slate-600">본 약관은 대한민국 법령에 따라 해석·이행됩니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제45조(분쟁해결 절차)</h3>
                <p className="text-slate-600 mb-2">① 회사와 이용자는 분쟁 발생 시 성실히 협의하여 해결하도록 노력합니다.</p>
                <p className="text-slate-600 mb-2">② 협의가 어려운 경우 이용자는 고객센터를 통해 분쟁 조정을 요청할 수 있습니다.</p>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제46조(관할법원)</h3>
                <p className="text-slate-600">본 약관과 서비스 이용과 관련한 분쟁의 관할법원은 민사소송법 등 관계 법령이 정하는 바에 따릅니다.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">부칙</h2>
                <p className="text-slate-600 mb-2"><strong>제1조(시행일)</strong> 본 약관은 2026년 1월 23일부터 시행합니다.</p>
                <p className="text-slate-600 mb-2"><strong>제2조(개정이력)</strong> 회사는 약관 개정 시 서비스 내에 개정 이력을 게시합니다.</p>
              </section>

              <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">[고객센터]</h3>
                <p className="text-sm text-slate-600">- 이메일: ttokbill.service@gmail.com</p>
                <p className="text-sm text-slate-600">- 연락처: 010-5945-0198</p>
                <p className="text-sm text-slate-600">- 운영시간: 평일 10:00~17:00 (점심시간 오후 12시~오후 1시)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}