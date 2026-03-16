import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Users, LogIn, Play } from 'lucide-react';

export default function DemoWelcomeModal({ isOpen, onStartDemo, onLogin }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #2F6F4F 0%, #1E5A3A 100%)' }}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png"
            alt="똑빌"
            className="h-8 mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-white/90 text-sm break-keep">
            빌라 관리비, 이렇게 쉬워져도 되나요?
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-center text-slate-600 text-sm break-keep">
            <span className="font-semibold text-slate-900">똑똑한빌라 샘플</span>로 서비스를<br />직접 체험해 보세요.
          </p>

          {/* Demo option */}
          <button
            onClick={onStartDemo}
            className="w-full border-2 border-primary rounded-2xl p-4 text-left hover:bg-primary/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">서비스 체험해보기</p>
                <p className="text-xs text-slate-500 mt-0.5">로그인 없이 데모 버전 사용</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                <Shield className="w-3 h-3" />대표자 체험
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                <Users className="w-3 h-3" />입주자 체험
              </span>
            </div>
          </button>

          {/* Login option */}
          <button
            onClick={onLogin}
            className="w-full bg-slate-900 rounded-2xl p-4 text-left hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">로그인 / 회원가입</p>
                <p className="text-xs text-white/60 mt-0.5">내 빌라 등록 또는 청구서 확인</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}