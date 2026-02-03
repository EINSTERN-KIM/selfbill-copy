import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Building2, Receipt, CreditCard, Home, Menu, X, 
  ChevronDown, ChevronUp, LogOut, HelpCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import SupportDialog from '@/components/common/SupportDialog';

export default function TenantLayout({ buildingId, building, currentPage, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'TenantDashboard', label: '대시보드', icon: Home, isBold: true },
    { id: 'TenantMyUnit', label: '나의 입주 현황', icon: Home },
    { id: 'TenantMyBills', label: '나의 관리비 청구서', icon: Receipt },
    { id: 'TenantMyPayments', label: '나의 납부 현황', icon: CreditCard }
  ];

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await base44.auth.logout(createPageUrl("Onboarding"));
    }
  };

  const renderMenu = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Logo & Building Header */}
        <div className="p-4 border-b space-y-3">
          <button 
            onClick={() => navigate(createPageUrl("MyBuildings"))}
            className="flex items-center justify-start w-full hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png" 
              alt="똑빌 로고"
              className="h-8"
            />
          </button>
          <button
            onClick={() => navigate(createPageUrl("MyBuildings"))}
            className="flex items-center gap-3 w-full hover:bg-slate-50 active:bg-slate-100 rounded-lg p-3 -mx-3 transition-colors touch-manipulation"
          >
            {building?.building_icon_url ? (
              <img 
                src={building.building_icon_url} 
                alt="건물 아이콘"
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-slate-900 truncate break-keep">{building?.name || '공동주택'}</p>
              <p className="text-xs text-slate-500 break-keep">입주자</p>
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Link
                key={item.id}
                to={createPageUrl(`${item.id}?buildingId=${buildingId}`)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm break-keep ${item.isBold ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Support & Logout */}
      <div className="p-3 border-t space-y-1">
        <button
          onClick={() => setShowSupport(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors w-full touch-manipulation"
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium break-keep">고객센터</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors w-full touch-manipulation"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium break-keep">로그아웃</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r fixed h-screen">
        {renderMenu()}
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="touch-manipulation flex-shrink-0 -ml-2"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
        <button 
          onClick={() => navigate(createPageUrl("MyBuildings"))}
          className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition-opacity"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png" 
            alt="똑빌 로고"
            className="h-6 flex-shrink-0"
          />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl">
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <button 
                onClick={() => navigate(createPageUrl("MyBuildings"))}
                className="hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png" 
                  alt="똑빌 로고"
                  className="h-6"
                />
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="touch-manipulation"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            {renderMenu()}
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>

      {/* Support Dialog */}
      <SupportDialog isOpen={showSupport} onClose={() => setShowSupport(false)} />
    </div>
  );
}