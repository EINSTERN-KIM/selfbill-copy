import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
            <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">셀프빌 이용약관</h1>
            
            <div className="prose prose-slate max-w-none space-y-6 text-sm">
              <p className="text-slate-600">
                본 약관은 주식회사 펜타라(이하 "회사")가 운영하는 "셀프빌(SelfBill)" 서비스의 이용과 관련하여 회사와 이용자 간 권리·의무 및 책임사항 등을 규정합니다.
              </p>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">제1장 총칙</h2>
                
                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">제1조(목적)</h3>
                <p className="text-slate-600">
                  본 약관은 회사가 제공하는 셀프빌 웹 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
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
                <p className="text-slate-600 mb-2">② 대표자는 건물 단위로 서비스를 개설할 수 있으며, 회사는 건물명/주소/세대수 등 최소 정보를 요구할 수 있습니다.</p>
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
              </section>

              <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">고객센터</h3>
                <p className="text-sm text-slate-600">이메일: selfbill.service@gmail.com</p>
                <p className="text-sm text-slate-600">연락처: 010-5945-0198</p>
                <p className="text-sm text-slate-600">운영시간: 평일 10:00~17:00 (점심시간 오후 12시~오후 1시)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}