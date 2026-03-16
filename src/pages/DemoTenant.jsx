import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Receipt, CreditCard, Home, ChevronRight, CheckCircle2,
  History, Building2, LogIn, Menu, X
} from 'lucide-react';
import {
  DEMO_BUILDING, DEMO_MY_UNIT, DEMO_MY_CHARGE, DEMO_MY_PAYMENT,
  DEMO_PAST_BILLS, DEMO_BREAKDOWN, DEMO_BILL_CYCLE
} from '@/components/demo/demoData';
import DemoLoginModal from '@/components/demo/DemoLoginModal';
import DemoTooltipOverlay, { useDemoTooltip, TutorialProvider, TutorialBubbles } from '@/components/demo/DemoTooltip';
import { formatWon } from '@/components/utils/formatters';

const VIEWS = {
  DASHBOARD:   'dashboard',
  BILL_DETAIL: 'bill_detail',
  PAYMENTS:    'payments',
  MY_UNIT:     'my_unit',
};

const MENU = [
  {
    title: '홈',
    items: [{ label: '대시보드', view: VIEWS.DASHBOARD, icon: Home }],
  },
  {
    title: '관리비',
    items: [
      { label: '이번 달 청구서', view: VIEWS.BILL_DETAIL, icon: Receipt },
      { label: '납부 내역',     view: VIEWS.PAYMENTS,    icon: History },
    ],
  },
  {
    title: '내 정보',
    items: [
      { label: '내 세대 정보', view: VIEWS.MY_UNIT, icon: Building2 },
    ],
  },
];

export default function DemoTenant({ onLoginRequired }) {
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = React.useRef(null);
  const { tooltip, triggerProps } = useDemoTooltip();

  const handleAction = () => setShowLoginModal(true);

  const navigate = (v) => {
    setView(v);
    setSidebarOpen(false);
  };

  const currentLabel = MENU.flatMap(s => s.items).find(i => i.view === view)?.label || '대시보드';

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Unit info */}
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{DEMO_MY_UNIT.tenant_name}님</p>
            <p className="text-xs text-slate-500 truncate">{DEMO_BUILDING.name} {DEMO_MY_UNIT.unit_name}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {MENU.map((section) => (
          <div key={section.title} className="space-y-0.5">
            <p className="px-3 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = view === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => navigate(item.view)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    active
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom CTA */}
      <div className="p-3 border-t border-slate-200 flex-shrink-0">
        <button
          onClick={onLoginRequired}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <LogIn className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm font-semibold text-blue-600">내 빌라 연결하기</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-88px)]">
      <DemoTooltipOverlay tooltip={tooltip} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 shadow-xl lg:shadow-none
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 flex flex-col
        top-[88px] bottom-0
      `}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-semibold text-slate-800 text-sm">{currentLabel}</span>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

          {/* ── DASHBOARD ── */}
          {view === VIEWS.DASHBOARD && (
            <>
              <div>
                <p className="text-sm text-slate-500">안녕하세요,</p>
                <h1 className="text-xl font-bold text-slate-900">{DEMO_MY_UNIT.tenant_name}님 👋</h1>
                <p className="text-sm text-slate-500 mt-0.5">{DEMO_BUILDING.name} {DEMO_MY_UNIT.unit_name}</p>
              </div>

              {/* Bill Summary Card */}
              <Card
                className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(VIEWS.BILL_DETAIL)}
                style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}
                {...triggerProps('이번 달 청구서를 확인합니다')}
              >
                <CardContent className="p-5 relative">
                  <p className="text-white/80 text-sm mb-2">2026년 3월 관리비</p>
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">청구 금액</p>
                        <p className="text-2xl font-bold text-slate-900">{formatWon(DEMO_MY_CHARGE.amount_total)}</p>
                        <p className="text-xs text-slate-400 mt-1">납부 기한: 2026년 3월 25일</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 self-start">
                        <CheckCircle2 className="w-3 h-3 mr-1" />완납
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 opacity-10">
                    <Receipt className="w-16 h-16 text-white" />
                  </div>
                </CardContent>
              </Card>

              {/* Bank Info */}
              <Card className="border-0 shadow-sm bg-slate-50">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">납부 계좌 정보</p>
                  <p className="font-semibold text-slate-900">{DEMO_BUILDING.bank_name}</p>
                  <p className="text-slate-700 text-sm">{DEMO_BUILDING.bank_account}</p>
                  <p className="text-xs text-slate-500">{DEMO_BUILDING.bank_holder}</p>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div className="space-y-2">
                {[
                  { label: '이번 달 청구서 보기', icon: Receipt,     view: VIEWS.BILL_DETAIL, tip: '항목별 관리비 상세 내역을 확인합니다' },
                  { label: '납부 내역 확인',      icon: CreditCard,  view: VIEWS.PAYMENTS,    tip: '월별 납부 현황을 확인합니다' },
                  { label: '내 세대 정보',        icon: Building2,   view: VIEWS.MY_UNIT,     tip: '내 세대 기본 정보를 확인합니다' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={i}
                      className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(item.view)}
                      {...triggerProps(item.tip)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-800 flex-1 text-sm">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* ── BILL DETAIL ── */}
          {view === VIEWS.BILL_DETAIL && (
            <>
              <h2 className="text-lg font-bold text-slate-900">2026년 3월 청구서</h2>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between text-sm text-slate-500 pb-2 border-b">
                    <span>부과 기간</span>
                    <span className="text-right">{DEMO_BILL_CYCLE.period_start} ~ {DEMO_BILL_CYCLE.period_end}</span>
                  </div>
                  <div className="flex justify-between text-sm pb-2 border-b">
                    <span className="text-slate-500">납부 기한</span>
                    <span className="font-semibold text-slate-900">{DEMO_BILL_CYCLE.due_date}</span>
                  </div>
                  {DEMO_BREAKDOWN.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className="text-slate-700 text-sm">{item.name}</span>
                      <span className="font-semibold text-slate-900">{formatWon(item.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-bold text-slate-900">합계</span>
                    <span className="text-xl font-bold text-primary">{formatWon(DEMO_MY_CHARGE.amount_total)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-slate-50">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">납부 계좌</p>
                  <p className="font-semibold text-slate-900 text-sm">{DEMO_BUILDING.bank_name} {DEMO_BUILDING.bank_account}</p>
                  <p className="text-xs text-slate-500">{DEMO_BUILDING.bank_holder}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-3">이전 청구 내역</h3>
                <div className="space-y-2">
                  {DEMO_PAST_BILLS.map((b, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardContent className="p-4 flex justify-between items-center">
                        <span className="text-slate-700 text-sm">{b.year_month}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">{formatWon(b.amount_total)}</span>
                          <Badge className="bg-green-100 text-green-700">{b.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PAYMENTS ── */}
          {view === VIEWS.PAYMENTS && (
            <>
              <h2 className="text-lg font-bold text-slate-900">납부 내역</h2>
              <div className="space-y-2">
                {[DEMO_MY_PAYMENT, ...DEMO_PAST_BILLS.map((b) => ({
                  year_month: b.year_month,
                  status: b.status,
                  charged_amount: b.amount_total,
                  paid_amount: b.amount_total,
                }))].map((p, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{p.year_month}</p>
                        <p className="text-xs text-slate-500">청구: {formatWon(p.charged_amount)}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={p.status === '완납' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {p.status}
                        </Badge>
                        {p.paid_amount > 0 && (
                          <p className="text-xs text-slate-500 mt-1">{formatWon(p.paid_amount)} 납부</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── MY UNIT ── */}
          {view === VIEWS.MY_UNIT && (
            <>
              <h2 className="text-lg font-bold text-slate-900">내 세대 정보</h2>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-4">
                  {[
                    { label: '건물명', value: DEMO_BUILDING.name },
                    { label: '주소',  value: DEMO_BUILDING.address },
                    { label: '세대',  value: DEMO_MY_UNIT.unit_name },
                    { label: '입주자', value: DEMO_MY_UNIT.tenant_name },
                    { label: '연락처', value: DEMO_MY_UNIT.tenant_phone },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-start gap-4 border-b pb-3 last:border-0 last:pb-0">
                      <span className="text-sm text-slate-500 flex-shrink-0">{row.label}</span>
                      <span className="font-semibold text-slate-900 text-sm text-right">{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-slate-600 mb-3">정보 수정은 로그인 후 가능합니다.</p>
                  <Button
                    onClick={handleAction}
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    {...triggerProps('로그인하면 세대 정보를 직접 수정할 수 있어요')}
                  >
                    로그인 후 수정하기
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

        </div>
      </div>

      <DemoLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} role="tenant" />
    </div>
  );
}