import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle } from 'lucide-react';

export default function BuildingInviteSelectionModal({ 
  isOpen, 
  onClose, 
  invitations, 
  onSelect 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>건물 선택</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm text-slate-600">
            해당 전화번호로 여러 건물의 초대가 발송되었습니다.<br />
            가입할 건물을 선택해주세요.
          </p>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {invitations.map((invitation) => (
              <button
                key={invitation.id}
                onClick={() => onSelect(invitation)}
                disabled={invitation.isRegistered}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  invitation.isRegistered
                    ? 'bg-slate-50 border-slate-200 cursor-not-allowed'
                    : 'hover:border-primary hover:bg-primary/5 border-slate-200 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    invitation.isRegistered ? 'bg-slate-200' : 'bg-primary-light'
                  }`}>
                    {invitation.isRegistered ? (
                      <CheckCircle className="w-6 h-6 text-slate-500" />
                    ) : (
                      <Building2 className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${
                        invitation.isRegistered ? 'text-slate-500' : 'text-slate-900'
                      }`}>
                        {invitation.buildingName}
                      </h3>
                      {invitation.isRegistered && (
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                          등록 완료
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${
                      invitation.isRegistered ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {invitation.buildingAddress}
                    </p>
                    <p className={`text-sm mt-1 ${
                      invitation.isRegistered ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      세대: {invitation.unitName}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full mt-4"
          >
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}