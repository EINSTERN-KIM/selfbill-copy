import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Shield, Loader2 } from 'lucide-react';

export default function RoleChangeRequestModal({ buildingId, userId, onClose }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [request, setRequest] = useState(null);
  const [building, setBuilding] = useState(null);
  const [fromMember, setFromMember] = useState(null);

  useEffect(() => {
    loadRequest();
  }, [buildingId, userId]);

  const loadRequest = async () => {
    if (!buildingId || !userId) return;
    
    try {
      const [requests, buildings, members] = await Promise.all([
        base44.entities.RoleChangeRequest.filter({
          building_id: buildingId,
          to_user_id: userId,
          status: "요청"
        }),
        base44.entities.Building.filter({ id: buildingId }),
        base44.entities.BuildingMember.filter({ building_id: buildingId, status: "활성" })
      ]);

      if (requests.length > 0) {
        const req = requests[0];
        setRequest(req);
        setBuilding(buildings[0]);
        
        const fromMemberData = members.find(m => m.user_id === req.from_user_id);
        setFromMember(fromMemberData);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading request:", err);
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!request || !userId) return;
    setIsProcessing(true);

    try {
      // 1. Update request status
      await base44.entities.RoleChangeRequest.update(request.id, {
        status: "예비대표 수락",
        responded_at: new Date().toISOString()
      });

      // 2. Get all members
      const members = await base44.entities.BuildingMember.filter({
        building_id: buildingId,
        status: "활성"
      });

      // 3. 기존 대표자의 대표자 권한 제거
      const oldRepMembers = members.filter(m => 
        m.user_id === request.from_user_id && m.role === "대표자"
      );
      
      for (const oldRepMember of oldRepMembers) {
        // 대표자 역할을 가진 멤버십 삭제
        await base44.entities.BuildingMember.delete(oldRepMember.id);
      }

      // 기존 대표자가 입주자 역할을 가지고 있는지 확인
      const oldRepTenantMember = members.find(m => 
        m.user_id === request.from_user_id && m.role === "입주자"
      );
      
      // 입주자 역할이 없다면 새로 생성 (선택사항 - PRD에 따라)
      if (!oldRepTenantMember) {
        const oldRepUnit = members.find(m => m.user_id === request.from_user_id)?.unit_id;
        if (oldRepUnit) {
          await base44.entities.BuildingMember.create({
            building_id: buildingId,
            user_id: request.from_user_id,
            user_email: members.find(m => m.user_id === request.from_user_id)?.user_email,
            role: "입주자",
            unit_id: oldRepUnit,
            status: "활성"
          });
        }
      }

      // 4. 새로운 대표자에게 대표자 권한 부여
      const newRepMemberExists = members.find(m => 
        m.user_id === userId && m.role === "대표자"
      );

      if (!newRepMemberExists) {
        const newRepTenantMember = members.find(m => m.user_id === userId);
        await base44.entities.BuildingMember.create({
          building_id: buildingId,
          user_id: userId,
          user_email: newRepTenantMember?.user_email,
          role: "대표자",
          is_primary_representative: true,
          status: "활성"
        });
      } else {
        // 이미 대표자 멤버십이 있으면 업데이트
        await base44.entities.BuildingMember.update(newRepMemberExists.id, {
          is_primary_representative: true
        });
      }

      alert("대표자 변경이 완료되었습니다.");
      
      // Navigate to rep dashboard
      navigate(createPageUrl(`RepDashboard?buildingId=${buildingId}`));
      window.location.reload();
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("처리 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;
    if (!confirm("대표자 변경 요청을 거절하시겠습니까?")) return;

    setIsProcessing(true);
    
    try {
      await base44.entities.RoleChangeRequest.update(request.id, {
        status: "거절",
        responded_at: new Date().toISOString()
      });

      alert("대표자 변경 요청을 거절했습니다.");
      onClose();
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("처리 중 오류가 발생했습니다.");
    }
    
    setIsProcessing(false);
  };

  if (!request || isLoading) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">대표자 변경 요청</DialogTitle>
          <DialogDescription className="text-center">
            기존 대표자가 당신을 새로운 대표자로 지정했습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {building && (
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">공동주택</p>
                  <p className="font-semibold text-slate-900">{building.name}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 leading-relaxed">
              수락하시면 즉시 대표자 권한이 이전됩니다. 
              대표자는 건물의 관리비 입력, 청구서 발송, 세대 관리 등의 업무를 담당합니다.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isProcessing}
            className="flex-1"
          >
            거절
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 bg-primary hover:bg-primary-dark"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                처리 중...
              </>
            ) : (
              '수락'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}