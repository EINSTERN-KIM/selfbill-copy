import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2, Users, Receipt, CreditCard, Send, FileText,
  PlusCircle, BarChart3, CheckCircle2, Clock, ChevronRight,
  Settings, Home, Menu, X, LogIn
} from 'lucide-react';
import {
  DEMO_BUILDING, DEMO_UNITS, DEMO_FEE_ITEMS, DEMO_BILL_CYCLE,
  DEMO_UNIT_CHARGES, DEMO_PAYMENTS, DEMO_INVITATIONS
} from '@/components/demo/demoData';
import DemoLoginModal from '@/components/demo/DemoLoginModal';
import DemoTooltipOverlay, { useDemoTooltip, TutorialProvider, TutorialBubbles } from '@/components/demo/DemoTooltip';
import { formatWon } from '@/components/utils/formatters';

const VIEWS = {
  DASHBOARD: 'dashboard',
  UNITS: 'units',
  INVITE: 'invite',
  FEE_ITEMS: 'fee_items',
  CHARGES: 'charges',
  SEND: 'send',
  PAYMENTS: 'payments',
  REPORTS: 'reports',
};

const MENU_SECTIONS = [
  {
    title: '대시보드',
    items: [{ label: '대시보드', view: VIEWS.DASHBOARD, icon: Home }],
  },
  {
    title: '세대 관리',
    items: [
      { label: '입주자 목록', view: VIEWS.UNITS, icon: Users },
      { label: '입주자 초대', view: VIEWS.INVITE, icon: Send },
    ],
  },
  {
    title: '관리비 청구',
    items: [
      { label: '관리비 항목 설정', view: VIEWS.FEE_ITEMS, icon: FileText },
      { label: '세대별 청구서 조회', view: VIEWS.CHARGES, icon: Receipt },
      { label: '청구서 발송', view: VIEWS.SEND, icon: Send },
    ],
  },
  {
    title: '납부 현황',
    items: [
      { label: '납부 현황 관리', view: VIEWS.PAYMENTS, icon: CreditCard },
    ],
  },
  {
    title: '보고서',
    items: [
      { label: '관리비 현황 보고서', view: VIEWS.REPORTS, icon: BarChart3 },
    ],
  },
];

export default function DemoRep({ onLoginRequired }) {
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = React.useRef(null);

  const unpaid  = DEMO_PAYMENTS.filter(p => p.status === '미납').length;
  const partial = DEMO_PAYMENTS.filter(p => p.status === '부분납').length;
  const paid    = DEMO_PAYMENTS.filter(p => p.status === '완납').length;
  const inviteDone  = DEMO_INVITATIONS.filter(i => i.status === '가입 완료').length;
  const inviteSent  = DEMO_INVITATIONS.filter(i => i.status === '초대 발송').length;
  const inviteNone  = DEMO_INVITATIONS.filter(i => i.status === '초대 전').length;
  const sentCharges = DEMO_UNIT_CHARGES.filter(c => c.is_sent).length;
  const { tooltip, triggerProps } = useDemoTooltip();

  const handleAction = () => setShowLoginModal(true);

  const navigate = (v) => {
    setView(v);
    setSidebarOpen(false);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Building info */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{DEMO_BUILDING.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{DEMO_BUILDING.address}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {MENU_SECTIONS.map((section) => (
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
                      ? 'bg-primary text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom CTA */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        <button
          onClick={onLoginRequired}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <LogIn className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm font-semibold text-primary">내 빌라 등록하기</span>
        </button>
      </div>
    </div>
  );

  return (
    <TutorialProvider viewKey={view}>
    <div className="flex h-[calc(100vh-88px)]">
      <DemoTooltipOverlay tooltip={tooltip} />
      <TutorialBubbles containerRef={containerRef} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-xl lg:shadow-none
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 flex flex-col
        top-[88px] bottom-0
      `}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            {MENU_SECTIONS.flatMap(s => s.items).find(i => i.view === view)?.label || '대시보드'}
          </span>
        </div>

        <div ref={containerRef} className="max-w-3xl mx-auto px-4 py-6 space-y-6">

          {/* ── DASHBOARD ── */}
          {view === VIEWS.DASHBOARD && (
            <>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">대표자님, 환영합니다</p>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{DEMO_BUILDING.name}</h1>
              </div>

              {/* Primary Card */}
              <Card className="border-0 shadow-md overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #2F6F4F 0%, #1E5A3A 100%)' }}>
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
                  { label: '완납',   value: paid,           icon: CheckCircle2, color: 'green' },
                  { label: '미납',   value: unpaid + partial, icon: Clock,       color: 'red' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardContent className="pt-4 pb-4 text-center">
                        <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center mx-auto mb-2`}>
                          <Icon className={`w-5 h-5 text-${s.color}-600`} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">빠른 작업</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: '입주자 초대 현황', icon: Send,        color: 'orange',  view: VIEWS.INVITE,   tip: '입주자 초대 발송 현황을 확인합니다' },
                    { label: '세대별 청구서 조회', icon: Receipt,   color: 'emerald', view: VIEWS.CHARGES,  tip: '각 세대 청구 내역을 조회합니다' },
                    { label: '청구서 발송',        icon: Send,      color: 'rose',    action: true,         tip: '세대에 청구서 문자를 발송합니다' },
                    { label: '납부 현황 관리',     icon: CreditCard, color: 'teal',   view: VIEWS.PAYMENTS, tip: '납부 완료 여부를 기록·관리합니다' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Card
                        key={i}
                        className="cursor-pointer hover:shadow-md transition-all border-0 shadow-sm"
                        onClick={() => item.action ? handleAction() : navigate(item.view)}
                        {...triggerProps(item.tip)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${item.color}-600`} />
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-100 flex-1 text-sm">{item.label}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-500" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── UNITS ── */}
          {view === VIEWS.UNITS && (
            <>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">입주자 목록</h2>

              <div className="space-y-2">
                {DEMO_UNITS.map(u => {
                  const inv = DEMO_INVITATIONS.find(i => i.unit_id === u.id);
                  return (
                    <Card key={u.id} className="border-0 shadow-sm">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200">{u.unit_name}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{u.tenant_name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{u.tenant_phone}</p>
                        </div>
                        <Badge className={
                          inv?.status === '가입 완료' ? 'bg-green-100 text-green-700'
                          : inv?.status === '초대 발송' ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-500'
                        }>{inv?.status || '초대 전'}</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* ── INVITE ── */}
          {view === VIEWS.INVITE && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">입주자 초대</h2>
                <Button size="sm" onClick={handleAction} className="bg-primary text-white" {...triggerProps('미가입 세대에 초대 SMS를 일괄 발송합니다')}>전체 재발송</Button>
              </div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '가입 완료', value: inviteDone, color: 'green' },
                  { label: '초대 발송', value: inviteSent, color: 'blue' },
                  { label: '미초대',   value: inviteNone, color: 'slate' },
                ].map((s, i) => (
                  <Card key={i} className="border-0 shadow-sm text-center">
                    <CardContent className="py-4">
                      <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="space-y-2">
                {DEMO_INVITATIONS.map(inv => (
                  <Card key={inv.id} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200">{inv.unit_name}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{inv.tenant_name}</p>
                      </div>
                      <Badge className={
                        inv.status === '가입 완료' ? 'bg-green-100 text-green-700'
                        : inv.status === '초대 발송' ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
                      }>{inv.status}</Badge>
                      {inv.status !== '가입 완료' && (
                        <button onClick={handleAction} className="text-xs text-primary underline ml-2">발송</button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── FEE ITEMS ── */}
          {view === VIEWS.FEE_ITEMS && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">관리비 항목 설정</h2>
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
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatWon(f.amount_total)}</p>
                        <button onClick={handleAction} className="text-xs text-primary underline">수정</button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="border-0 bg-slate-50 shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">총 합계</span>
                  <span className="text-xl font-bold text-primary">{formatWon(DEMO_BILL_CYCLE.total_amount)}</span>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── CHARGES ── */}
          {view === VIEWS.CHARGES && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">세대별 청구서 <span className="text-base text-slate-500 font-normal">2026-03</span></h2>
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
                        <Badge className={c.is_sent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}>
                          {c.is_sent ? '발송완료' : '미발송'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── SEND ── */}
          {view === VIEWS.SEND && (
            <>
              <h2 className="text-xl font-bold text-slate-900">청구서 발송 <span className="text-base text-slate-500 font-normal">2026-03</span></h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '발송 완료', value: sentCharges,                         color: 'blue' },
                  { label: '미발송',   value: DEMO_UNITS.length - sentCharges, color: 'slate' },
                ].map((s, i) => (
                  <Card key={i} className="border-0 shadow-sm text-center">
                    <CardContent className="py-4">
                      <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="space-y-2">
                {DEMO_UNIT_CHARGES.map(c => (
                  <Card key={c.id} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{c.unit_name}</div>
                        <span className="font-semibold text-slate-900">{c.tenant_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={c.is_sent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}>
                          {c.is_sent ? '발송완료' : '미발송'}
                        </Badge>
                        {!c.is_sent && (
                          <button onClick={handleAction} className="text-xs text-primary underline">발송</button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button onClick={handleAction} className="w-full bg-primary text-white" {...triggerProps('아직 받지 못한 세대에 청구서를 한 번에 발송합니다')}>
                <Send className="w-4 h-4 mr-2" />미발송 세대 일괄 발송
              </Button>
            </>
          )}

          {/* ── PAYMENTS ── */}
          {view === VIEWS.PAYMENTS && (
            <>
              <h2 className="text-xl font-bold text-slate-900">납부 현황 <span className="text-base text-slate-500 font-normal">2026-03</span></h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '완납',  count: paid,    color: 'green' },
                  { label: '부분납', count: partial, color: 'yellow' },
                  { label: '미납',  count: unpaid,  color: 'red' },
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
                        <div>
                          <p className="font-semibold text-slate-900">{p.tenant_name}</p>
                          <p className="text-xs text-slate-500">{formatWon(p.charged_amount)} 청구</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <Badge className={
                            p.status === '완납'  ? 'bg-green-100 text-green-700'
                            : p.status === '미납' ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }>{p.status}</Badge>
                          {p.paid_amount > 0 && p.status !== '완납' && (
                            <p className="text-xs text-slate-500 mt-0.5">{formatWon(p.paid_amount)} 납부</p>
                          )}
                        </div>
                        <button onClick={handleAction} className="text-xs text-primary underline">수정</button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── REPORTS ── */}
          {view === VIEWS.REPORTS && (
            <>
              <h2 className="text-xl font-bold text-slate-900">관리비 현황 보고서</h2>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">월별 관리비 추이</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { ym: '2026-03', amount: DEMO_BILL_CYCLE.total_amount, pct: 67 },
                      { ym: '2026-02', amount: 458000, pct: 83 },
                      { ym: '2026-01', amount: 462000, pct: 92 },
                      { ym: '2025-12', amount: 471000, pct: 100 },
                    ].map(row => (
                      <div key={row.ym} className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 w-16">{row.ym}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                          <div className="bg-primary rounded-full h-2.5" style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 w-20 text-right">{formatWon(row.amount)}</span>
                      </div>
                    ))}
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
      </div>

      <DemoLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} role="rep" />
    </div>
    </TutorialProvider>
  );
}