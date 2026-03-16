import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Shield, Users, LogIn } from 'lucide-react';
import DemoRep from './DemoRep';
import DemoTenant from './DemoTenant';
import DemoWelcomeModal from '@/components/demo/DemoWelcomeModal';

export default function Demo() {
  const navigate = useNavigate();
  const [role, setRole] = useState('rep');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then((auth) => {
      if (auth) navigate(createPageUrl('MyBuildings'));
    });
  }, [navigate]);

  const handleLoginClick = (targetRole) => {
    sessionStorage.setItem('demoRole', targetRole || role);
    base44.auth.redirectToLogin(createPageUrl('Onboarding'));
  };

  const handleStartDemo = () => setShowWelcome(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png"
            alt="똑빌"
            className="h-7 flex-shrink-0"
          />

          {/* Role Toggle */}
          <div className="flex items-center bg-slate-100 rounded-full p-1 gap-1 flex-1 max-w-xs mx-2">
            <button
              onClick={() => setRole('rep')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === 'rep'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              빌라대표자 체험
            </button>
            <button
              onClick={() => setRole('tenant')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === 'tenant'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              빌라입주자 체험
            </button>
          </div>

          {/* CTA */}
          <Button
            size="sm"
            onClick={() => handleLoginClick()}
            className="bg-primary text-white hover:bg-primary-dark font-semibold flex-shrink-0 text-xs px-3"
          >
            <LogIn className="w-3.5 h-3.5 mr-1" />
            {role === 'rep' ? '내 빌라 등록하기' : '내 빌라 연결하기'}
          </Button>
        </div>

        {/* Demo Banner */}
        <div className="bg-amber-50 border-t border-amber-100 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-amber-800">
          <span>💡</span>
          <span className="break-keep">현재 체험 모드입니다. 실제 저장·발송은 로그인 후 가능합니다.</span>
        </div>
      </header>

      {/* Demo Content */}
      <div className="flex-1">
        {role === 'rep'
          ? <DemoRep onLoginRequired={() => handleLoginClick('rep')} />
          : <DemoTenant onLoginRequired={() => handleLoginClick('tenant')} />
        }
      </div>
    </div>
  );
}