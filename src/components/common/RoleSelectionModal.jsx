import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Users } from 'lucide-react';

export default function RoleSelectionModal({ building, onClose }) {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === "대표자") {
      // Check if building setup is incomplete
      if (building.status === "draft" || building.setup_step < 5) {
        navigate(createPageUrl(`BuildingSetupWizard?buildingId=${building.id}`));
      } else {
        navigate(createPageUrl(`RepDashboard?buildingId=${building.id}`));
      }
    } else {
      navigate(createPageUrl(`TenantDashboard?buildingId=${building.id}`));
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">역할 선택</DialogTitle>
          <DialogDescription className="text-slate-500 mt-2">
            {building.name}에 어떤 역할로 들어가시겠습니까?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <button
            onClick={() => handleRoleSelect("대표자")}
            className="w-full p-4 border-2 border-slate-200 rounded-2xl hover:border-primary hover:bg-primary-light/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-900 group-hover:text-primary">
                  대표자 대시보드로 들어가기
                </div>
                <div className="text-sm text-slate-500 mt-0.5">
                  건물 관리, 관리비 설정, 청구서 발송 등
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("입주자")}
            className="w-full p-4 border-2 border-slate-200 rounded-2xl hover:border-primary hover:bg-primary-light/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-900 group-hover:text-primary">
                  입주자 대시보드로 들어가기
                </div>
                <div className="text-sm text-slate-500 mt-0.5">
                  내 관리비 확인, 납부 현황 조회 등
                </div>
              </div>
            </div>
          </button>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full mt-4"
        >
          취소
        </Button>
      </DialogContent>
    </Dialog>
  );
}