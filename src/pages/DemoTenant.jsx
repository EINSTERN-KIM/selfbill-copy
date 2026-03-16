import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Receipt, CreditCard, Home, History, ChevronRight, CheckCircle2
} from 'lucide-react';
import {
  DEMO_BUILDING, DEMO_MY_UNIT, DEMO_MY_CHARGE, DEMO_MY_PAYMENT,
  DEMO_PAST_BILLS, DEMO_BREAKDOWN, DEMO_BILL_CYCLE
} from '@/components/demo/demoData';
import DemoLoginModal from '@/components/demo/DemoLoginModal';
import { formatWon } from '@/components/utils/formatters';

const VIEWS = {
  DASHBOARD: 'dashboard',
  BILL_DETAIL: 'bill_detail',
  PAYMENTS: 'payments',
  MY_UNIT: 'my_unit',
};

export default function DemoTenant({ onLoginRequired }) {
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAction = () => setShowLoginModal(true);

  const navItems = [
    { label: '대시보드', view: VIEWS.DASHBOARD, icon: Home },
    { label: '이번 달 청구서', view: VIEWS.BILL_DETAIL, icon: Receipt },
    { label: '납부 내역', view: VIEWS.PAYMENTS, icon: CreditCard },
    { label: '내 세대 정보', view: VIEWS.MY_UNIT, icon: Home },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Sub Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-[88px] z-40 overflow-x-auto">
        <div className="flex px-4 gap-1 min-w-max">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  view === item.view
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* DASHBOARD */}
        {view === VIEWS.DASHBOARD && (
          <>
            <div>
              <p className="text-sm text-slate-500">안녕하세요,</p>
              <h1 className="text-2xl font-bold text-slate-900">{DEMO_MY_UNIT.tenant_name}님 👋</h1>
              <p className="text-sm text-slate-500 mt-0.5">{DEMO_BUILDING.name} {DEMO_MY_UNIT.unit_name}</p>
            </div>

            {/* Bill Summary Card */}
            <Card
              className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setView(VIEWS.BILL_DETAIL)}
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}
            >
              <CardContent className="p-5 relative">
                <p className="text-white/80 text-sm mb-2">2026년 3월 관리비</p>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">청구 금액</p>
                      <p className="text-3xl font-bold text-slate-900">{formatWon(DEMO_MY_CHARGE.amount_total)}</p>
                      <p className="text-xs text-slate-400 mt-1">납부 기한: 2026년 3월 25일</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 self-start">
                      <CheckCircle2 className="w-3 h-3 mr-1" />완납
                    </Badge>
                  </div>
                </div>
                <div className="absolute right-4 top-4 opacity-10">
                  <Receipt className="w-20 h-20 text-white" />
                </div>
              </CardContent>
            </Card>

            {/* Bank Info */}
            <Card className="border-0 shadow-sm bg-slate-50">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">납부 계좌 정보</p>
                <p className="font-semibold text-slate-900">{DEMO_BUILDING.bank_name}</p>
                <p className="text-slate-700">{DEMO_BUILDING.bank_account}</p>
                <p className="text-sm text-slate-500">{DEMO_BUILDING.bank_holder}</p>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="space-y-2">
              {[
                { label: '이번 달 청구서 보기', icon: Receipt, view: VIEWS.BILL_DETAIL },
                { label: '납부 내역 확인', icon: CreditCard, view: VIEWS.PAYMENTS },
                { label: '내 세대 정보', icon: Home, view: VIEWS.MY_UNIT },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={i}
                    className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setView(item.view)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-slate-800 flex-1 text-sm">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-5 text-center">
                <p className="font-semibold text-slate-800 mb-1">내 빌라 청구서를 바로 받아보세요</p>
                <p className="text-sm text-slate-500 mb-4">대표자가 초대한 빌라에 연결하면 내 청구서를 바로 확인할 수 있어요.</p>
                <Button onClick={onLoginRequired} className="bg-blue-600 text-white hover:bg-blue-700">
                  내 빌라 연결하기 →
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* BILL DETAIL */}
        {view === VIEWS.BILL_DETAIL && (
          <>
            <h2 className="text-xl font-bold text-slate-900">2026년 3월 청구서</h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-500 pb-2 border-b">
                  <span>부과 기간</span>
                  <span>{DEMO_BILL_CYCLE.period_start} ~ {DEMO_BILL_CYCLE.period_end}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 pb-2 border-b">
                  <span>납부 기한</span>
                  <span className="font-semibold text-slate-900">{DEMO_BILL_CYCLE.due_date}</span>
                </div>
                {DEMO_BREAKDOWN.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="font-semibold text-slate-900">{formatWon(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900">합계</span>
                  <span className="text-2xl font-bold text-primary">{formatWon(DEMO_MY_CHARGE.amount_total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Bank */}
            <Card className="border-0 shadow-sm bg-slate-50">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">납부 계좌</p>
                <p className="font-semibold text-slate-900">{DEMO_BUILDING.bank_name} {DEMO_BUILDING.bank_account}</p>
                <p className="text-sm text-slate-500">{DEMO_BUILDING.bank_holder}</p>
              </CardContent>
            </Card>

            {/* Past Bills */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-3">이전 청구 내역</h3>
              <div className="space-y-2">
                {DEMO_PAST_BILLS.map((b, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                      <span className="text-slate-700">{b.year_month}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatWon(b.amount_total)}</span>
                        <Badge className="bg-green-100 text-green-700">{b.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PAYMENTS */}
        {view === VIEWS.PAYMENTS && (
          <>
            <h2 className="text-xl font-bold text-slate-900">납부 내역</h2>
            <div className="space-y-2">
              {[DEMO_MY_PAYMENT, ...DEMO_PAST_BILLS.map((b, i) => ({
                year_month: b.year_month,
                status: b.status,
                charged_amount: b.amount_total,
                paid_amount: b.amount_total,
              }))].map((p, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">{p.year_month}</p>
                      <p className="text-xs text-slate-500">청구: {formatWon(p.charged_amount)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={p.status === '완납' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {p.status}
                      </Badge>
                      {p.paid_amount > 0 && (
                        <p className="text-xs text-slate-500 mt-1">납부: {formatWon(p.paid_amount)}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* MY UNIT */}
        {view === VIEWS.MY_UNIT && (
          <>
            <h2 className="text-xl font-bold text-slate-900">내 세대 정보</h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 space-y-4">
                {[
                  { label: '건물명', value: DEMO_BUILDING.name },
                  { label: '주소', value: DEMO_BUILDING.address },
                  { label: '세대', value: DEMO_MY_UNIT.unit_name },
                  { label: '입주자', value: DEMO_MY_UNIT.tenant_name },
                  { label: '연락처', value: DEMO_MY_UNIT.tenant_phone },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-slate-500">{row.label}</span>
                    <span className="font-semibold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600 mb-3">정보 수정은 로그인 후 가능합니다.</p>
                <Button onClick={handleAction} size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  로그인 후 수정하기
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <DemoLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} role="tenant" />
    </div>
  );
}