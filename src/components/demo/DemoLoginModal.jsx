import React from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LogIn, Building2, Users } from 'lucide-react';

export default function DemoLoginModal({ isOpen, onClose, role = 'rep' }) {
  const isRep = role === 'rep';

  const handleLogin = () => {
    // 역할 정보를 세션에 저장해 로그인 후 자연스럽게 이어지도록
    sessionStorage.setItem('demoRole', role);
    base44.auth.redirectToLogin(createPageUrl('Onboarding'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader className="text-center">
          <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${isRep ? 'bg-primary/10' : 'bg-blue-50'}`}>
            {isRep
              ? <Building2 className="w-7 h-7 text-primary" />
              : <Users className="w-7 h-7 text-blue-600" />
            }
          </div>
          <DialogTitle className="text-lg">
            {isRep ? '내 빌라를 등록하고 시작하세요' : '내 빌라에 연결하세요'}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-2 break-keep leading-relaxed">
            {isRep
              ? '데모 체험은 여기까지 가능합니다.\n이제 내 빌라를 등록하고 실제로 시작해보세요.'
              : '대표자가 초대한 빌라에 연결하면\n내 청구서를 바로 확인할 수 있어요.'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-2">
          <Button
            onClick={handleLogin}
            className="w-full bg-primary text-white hover:bg-primary-dark font-semibold"
            size="lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            로그인 / 회원가입
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-slate-500">
            계속 체험하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}