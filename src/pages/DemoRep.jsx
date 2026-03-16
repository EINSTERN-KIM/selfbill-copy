import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2, Users, Receipt, CreditCard, Send, FileText,
  PlusCircle, BarChart3, CheckCircle2, Clock, ChevronRight, X
} from 'lucide-react';
import {
  DEMO_BUILDING, DEMO_UNITS, DEMO_FEE_ITEMS, DEMO_BILL_CYCLE,
  DEMO_UNIT_CHARGES, DEMO_PAYMENTS
} from '@/components/demo/demoData';
import DemoLoginModal from '@/components/demo/DemoLoginModal';
import { formatWon } from '@/components/utils/formatters';

const VIEWS = {
  DASHBOARD: 'dashboard',
  UNITS: 'units',
  FEE_ITEMS: 'fee_items',
  CHARGES: 'charges',
  PAYMENTS: 'payments',
  REPORTS: 'reports',
};

export default function DemoRep({ onLoginRequired }) {
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const unpaid = DEMO_PAYMENTS.filter(p => p.status === '미납').length;
  const partial = DEMO_PAYMENTS.filter(p => p.status === '부분납').length;
  const paid = DEMO_PAYMENTS.filter(p => p.status === '완납').length;

  const handleAction = () => {
    setShowLoginModal(true);
  };

  const navItems = [
    { label: '대시보드', view: VIEWS.DASHBOARD, icon: Building2 },
    { label: '세대 목록', view: VIEWS.UNITS, icon: Users },
    { label: '관리비 항목', view: VIEWS.FEE_ITEMS, icon: FileText },
    { label: '세대별 청구', view: VIEWS.CHARGES, icon: Receipt },
    { label: '납부 현황', view: VIEWS.PAYMENTS, icon: CreditCard },
    { label: '보고서', view: VIEWS.REPORTS, icon: BarChart3 },
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
                    ? 'border-primary text-primary'
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{DEMO_BUILDING.name}</h1>
                <p className="text-sm text-slate-500">{DEMO_BUILDING.address}</p>
              </div>
            </div>

            {/* Primary Card */}
            <Card className="border-0 shadow-md overflow-hidden" style={{ background: 'linear-gradient(135deg, #2F6F4F 0%, #1E5A3A 100%)' }}>
              <CardContent className="p-5 relative">
                <p className="text-white/80 text-sm mb-2">2026년 3월 관리비 청구</p>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <p className="text-xs text-slate-500 mb-1">총 청구 금액</p>
                  <p className="text-3xl font-bold text-slate-900">{formatWon(DEMO_BILL_CYCLE.total_amount)}</p>
                  <p className="text-xs text-slate-400 mt-1">납부 기한: 2026년 3월 25일</p>
                </div>
                <div className="absolute right-4 top-4 opacity-10">
                  <Receipt className="w-20 h-20 text-white" />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '총 세대', value: DEMO_BUILDING.building_units_count, icon: Users, color: 'blue' },
                { label: '완납', value: paid, icon: CheckCircle2, color: 'green' },
                { label: '미납', value: unpaid + partial, icon: Clock, color: 'red' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="pt-4 pb-4 text-center">
                      <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center mx-auto mb-2`}>
                        <Icon className={`w-5 h-5 text-${s.color}-600`} />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-sm font-semibold text-slate-500 mb-3">빠른 작업</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: '월별 관리비 작성', icon: PlusCircle, color: 'blue', view: null },
                  { label: '세대별 청구 확인', icon: Receipt, color: 'emerald', view: VIEWS.CHARGES },
                  { label: '청구서 발송', icon: Send, color: 'rose', action: true },
                  { label: '납부 현황 관리', icon: CreditCard, color: 'teal', view: VIEWS.PAYMENTS },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={i}
                      className="cursor-pointer hover:shadow-md transition-all border-0 shadow-sm"
                      onClick={() => item.action ? handleAction() : item.view ? setView(item.view) : handleAction()}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${item.color}-600`} />
                        </div>
                        <span className="font-semibold text-slate-800 flex-1 text-sm">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Start CTA */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5 text-center">
                <p className="font-semibold text-slate-800 mb-1">내 빌라도 이렇게 관리하고 싶으신가요?</p>
                <p className="text-sm text-slate-500 mb-4">지금 바로 등록하면 오늘부터 사용 가능합니다.</p>
                <Button onClick={onLoginRequired} className="bg-primary text-white hover:bg-primary-dark">
                  내 빌라 등록하기 →
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* UNITS */}
        {view === VIEWS.UNITS && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">세대 목록</h2>
              <Button size="sm" onClick={handleAction} className="bg-primary text-white">입주자 초대</Button>
            </div>
            <div className="space-y-2">
              {DEMO_UNITS.map(u => (
                <Card key={u.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">{u.unit_name}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{u.tenant_name}</p>
                      <p className="text-xs text-slate-500">{u.tenant_phone}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">활성</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* FEE ITEMS */}
        {view === VIEWS.FEE_ITEMS && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">관리비 항목</h2>
              <Button size="sm" onClick={handleAction} className="bg-primary text-white">항목 추가</Button>
            </div>
            <div className="space-y-2">
              {DEMO_FEE_ITEMS.map(f => (
                <Card key={f.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{f.name}</p>
                        <Badge variant="outline" className="text-xs">{f.category}</Badge>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900">{formatWon(f.amount_total)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-0 shadow-sm bg-slate-50">
              <CardContent className="p-4 flex justify-between items-center">
                <span className="font-semibold text-slate-700">총 합계</span>
                <span className="text-xl font-bold text-primary">{formatWon(DEMO_BILL_CYCLE.total_amount)}</span>
              </CardContent>
            </Card>
          </>
        )}

        {/* CHARGES */}
        {view === VIEWS.CHARGES && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">세대별 청구 내역 <span className="text-base text-slate-500 font-normal">2026-03</span></h2>
              <Button size="sm" onClick={handleAction} className="bg-primary text-white">
                <Send className="w-3.5 h-3.5 mr-1" />청구서 발송
              </Button>
            </div>
            <div className="space-y-2">
              {DEMO_UNIT_CHARGES.map(c => (
                <Card key={c.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{c.unit_name}</div>
                      <span className="font-semibold text-slate-900">{c.tenant_name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatWon(c.amount_total)}</p>
                      <Badge className="text-xs bg-blue-100 text-blue-700">발송완료</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* PAYMENTS */}
        {view === VIEWS.PAYMENTS && (
          <>
            <h2 className="text-xl font-bold text-slate-900">납부 현황 <span className="text-base text-slate-500 font-normal">2026-03</span></h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '완납', count: paid, color: 'green' },
                { label: '부분납', count: partial, color: 'yellow' },
                { label: '미납', count: unpaid, color: 'red' },
              ].map((s, i) => (
                <Card key={i} className="border-0 shadow-sm text-center">
                  <CardContent className="py-4">
                    <p className={`text-2xl font-bold text-${s.color}-600`}>{s.count}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-2">
              {DEMO_PAYMENTS.map(p => (
                <Card key={p.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{p.unit_name}</div>
                      <span className="font-semibold text-slate-900">{p.tenant_name}</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <Badge className={
                        p.status === '완납' ? 'bg-green-100 text-green-700'
                        : p.status === '미납' ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }>{p.status}</Badge>
                      <button onClick={handleAction} className="text-xs text-primary underline">수정</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* REPORTS */}
        {view === VIEWS.REPORTS && (
          <>
            <h2 className="text-xl font-bold text-slate-900">관리비 현황 보고서</h2>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">2026년 월별 관리비 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['2026-03', '2026-02', '2026-01', '2025-12'].map((ym, i) => {
                    const amounts = [DEMO_BILL_CYCLE.total_amount, 458000, 462000, 471000];
                    const pcts = [67, 83, 92, 100];
                    return (
                      <div key={ym} className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 w-16">{ym}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                          <div className="bg-primary rounded-full h-2.5 transition-all" style={{ width: `${pcts[i]}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 w-20 text-right">{formatWon(amounts[i])}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600 mb-3">상세 보고서는 로그인 후 확인 가능합니다.</p>
                <Button onClick={onLoginRequired} size="sm" className="bg-primary text-white">
                  로그인 후 보고서 보기
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <DemoLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} role="rep" />
    </div>
  );
}