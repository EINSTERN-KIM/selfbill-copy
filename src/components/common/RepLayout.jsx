import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { 
  Building2, Users, Receipt, CreditCard, Settings, 
  ChevronRight, ChevronDown, Menu, X, Home, FileText,
  PlusCircle, Send, BarChart3, LogOut
} from 'lucide-react';

export default function RepLayout({ children, buildingId, building, currentPage }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    building: true,
    units: true,
    billing: true,
    payments: true,
    reports: true
  });

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await base44.auth.logout(createPageUrl("Onboarding"));
    }
  };

  const isCurrentPage = (page) => currentPage === page;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuSections = [
    {
      id: 'main',
      title: '대시보드',
      items: [
        { label: "대시보드", icon: Home, page: "RepDashboard" }
      ]
    },
    {
      id: 'building',
      title: '건물 관리',
      items: [
        { label: "건물 기본정보", icon: Building2, page: "RepBuildingSetup" },
        { label: "관리비 부과 방식", icon: Settings, page: "RepBillingSettings" },
        { label: "관리비 입금 계좌", icon: CreditCard, page: "RepBankAccount" },
        { label: "셀프빌 이용 요금", icon: Receipt, page: "RepPlan" },
      ]
    },
    {
      id: 'units',
      title: '세대 관리',
      items: [
        { label: "입주자 목록 변경/조회", icon: Users, page: "RepUnits" },
        { label: "입주자 초대", icon: Send, page: "RepUnitsInvite" },
        { label: "대표자 변경", icon: Users, page: "RepRoleChange" },
      ]
    },
    {
      id: 'billing',
      title: '관리비 청구',
      items: [
        { label: "관리비 항목/금액 설정", icon: FileText, page: "RepFeeItems" },
        { label: "월별 관리비 작성/수정", icon: PlusCircle, page: "RepBillingMonthlyEdit" },
        { label: "세대별 청구서 조회", icon: Receipt, page: "RepBillingUnitCharges" },
        { label: "세대별 청구서 발송", icon: Send, page: "RepBillingSend" },
      ]
    },
    {
      id: 'payments',
      title: '납부 현황 관리',
      items: [
        { label: "납부 현황 관리", icon: CreditCard, page: "RepPaymentsManage" },
      ]
    },
    {
      id: 'reports',
      title: '연간 보고서',
      items: [
        { label: "전체 관리비", icon: BarChart3, page: "RepReportsTotalFee" },
        { label: "세대별 관리비", icon: Receipt, page: "RepReportsUnitFee" },
        { label: "세대별 납부율 현황", icon: Receipt, page: "RepReportsUnitPayments" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static overflow-y-auto`}>
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <button 
            onClick={() => navigate(createPageUrl("MyBuildings"))}
            className="flex items-center gap-2 hover:opacity-80"
          >
            {building?.building_icon_url ? (
              <img 
                src={building.building_icon_url} 
                alt="건물 아이콘"
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="text-left">
              <div className="font-bold text-slate-900 text-sm">{building?.name || "건물"}</div>
              <div className="text-xs text-slate-500">대표자</div>
            </div>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-3 space-y-1">
          {menuSections.map((section) => {
            const isExpanded = expandedSections[section.id];

            if (section.id === 'main') {
              return section.items.map((item, idx) => {
                const Icon = item.icon;
                const isCurrent = isCurrentPage(item.page);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(createPageUrl(`${item.page}?buildingId=${buildingId}`));
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left touch-manipulation ${
                      isCurrent 
                        ? 'bg-primary text-white font-semibold' 
                        : 'hover:bg-primary-light hover:text-primary active:bg-primary-light'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold break-keep">{item.label}</span>
                  </button>
                );
              });
            }
            
            return (
              <div key={section.id} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors text-left touch-manipulation"
                >
                  <span className="text-xs font-semibold text-slate-600 break-keep">{section.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-2 space-y-0.5">
                    {section.items.map((item, idx) => {
                      const Icon = item.icon;
                      const isCurrent = isCurrentPage(item.page);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            navigate(createPageUrl(`${item.page}?buildingId=${buildingId}`));
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left touch-manipulation ${
                            isCurrent 
                              ? 'bg-primary text-white font-semibold' 
                              : 'hover:bg-slate-100 active:bg-slate-200'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                          <span className={`text-sm break-keep ${isCurrent ? 'text-white' : 'text-slate-700'}`}>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="p-3 border-t mt-auto sticky bottom-0 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium break-keep">로그아웃</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="lg:hidden p-4 border-b bg-white sticky top-0 z-40 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="touch-manipulation p-2 flex-shrink-0 -ml-2">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {building?.building_icon_url ? (
                <img 
                  src={building.building_icon_url} 
                  alt="건물 아이콘"
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <Building2 className="w-6 h-6 text-primary flex-shrink-0" />
              )}
              <span className="text-sm font-semibold text-slate-900 truncate">{building?.name}</span>
            </div>
          </div>
        {children}
      </div>
    </div>
  );
}