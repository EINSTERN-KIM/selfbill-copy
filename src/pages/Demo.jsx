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
  const [autoStartTutorial, setAutoStartTutorial] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then((auth) => {
      if (auth) navigate(createPageUrl('MyBuildings'));
    });
  }, [navigate]);

  const handleLoginClick = (targetRole) => {
    sessionStorage.setItem('demoRole', targetRole || role);
    base44.auth.redirectToLogin(createPageUrl('Onboarding'));
  };

  const handleStartDemo = () => {
    setShowWelcome(false);
    setAutoStartTutorial(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoWelcomeModal
        isOpen={showWelcome}
        onStartDemo={handleStartDemo}
        onLogin={() => handleLoginClick(role)}
      />
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
        <div className="px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Logo */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png"
            alt="똑빌"
            className="h-6 sm:h-7 flex-shrink-0"
          />

          {/* Role Toggle */}
          <div className="flex items-center bg-slate-100 rounded-full p-1 gap-0.5 flex-1 max-w-xs mx-1 sm:mx-2">
            <button
              onClick={() => setRole('rep')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === 'rep' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">대표자</span>
              <span className="xs:hidden sm:hidden">대표자</span>
            </button>
            <button
              onClick={() => setRole('tenant')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === 'tenant' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span>입주자</span>
            </button>
          </div>

          {/* CTA */}
          <Button
            size="sm"
            onClick={() => handleLoginClick()}
            className="bg-primary text-white hover:bg-primary-dark font-semibold flex-shrink-0 text-xs px-2.5 sm:px-3 h-8"
          >
            <LogIn className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">{role === 'rep' ? '내 빌라 등록' : '내 빌라 연결'}</span>
          </Button>
        </div>

        {/* Demo Banner */}
        <div className="bg-amber-50 border-t border-amber-100 px-3 py-1.5 flex items-center justify-center gap-1.5 text-xs text-amber-800">
          <span>💡</span>
          <span className="break-keep">체험 모드 — 실제 저장·발송은 로그인 후 가능합니다.</span>
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