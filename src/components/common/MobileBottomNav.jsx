import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Receipt, Settings } from 'lucide-react';

export default function MobileBottomNav({ buildingId, role = "rep" }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const repTabs = [
    { id: 'home', label: '홈', icon: Home, page: 'RepDashboard' },
    { id: 'bills', label: '청구', icon: Receipt, page: 'RepBillingMonthlyEdit' },
    { id: 'settings', label: '설정', icon: Settings, page: 'RepSettings' }
  ];
  
  const tenantTabs = [
    { id: 'home', label: '홈', icon: Home, page: 'TenantDashboard' },
    { id: 'bills', label: '청구서', icon: Receipt, page: 'TenantMyBills' },
    { id: 'settings', label: '내 정보', icon: Settings, page: 'TenantMyUnit' }
  ];
  
  const tabs = role === "rep" ? repTabs : tenantTabs;
  
  const isActive = (page) => {
    return location.pathname.includes(page);
  };
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-700 safe-bottom">
      <div className="grid grid-cols-3 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.page);
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(createPageUrl(`${tab.page}?buildingId=${buildingId}`))}
              className={`flex flex-col items-center justify-center gap-1 transition-colors touch-manipulation ${
                active 
                  ? 'text-primary' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <style>{`
        .safe-bottom {
          padding-bottom: var(--safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}