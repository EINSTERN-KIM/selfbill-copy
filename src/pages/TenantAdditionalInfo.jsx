import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Users, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function TenantAdditionalInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingInvitation, setPendingInvitation] = useState(null);
  const [unit, setUnit] = useState(null);
  const [building, setBuilding] = useState(null);
  
  const [formData, setFormData] = useState({
    tenant_name: "",
    is_owner: false,
    residents_count: 1,
    move_in_date: "",
    car_count: 0,
    car_numbers: []
  });

  useEffect(() => {
    async function init() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Get pending invitation from sessionStorage
        const invitationData = sessionStorage.getItem('pendingInvitation');
        if (!invitationData) {
          navigate(createPageUrl("TenantInviteCheck"));
          return;
        }
        
        const invitation = JSON.parse(invitationData);
        setPendingInvitation(invitation);
        
        // Fetch unit and building data
        const [unitData, buildingData] = await Promise.all([
          base44.entities.Unit.filter({ id: invitation.unitId }),
          base44.entities.Building.filter({ id: invitation.buildingId })
        ]);
        
        if (unitData.length > 0) {
          setUnit(unitData[0]);
          setFormData(prev => ({
            ...prev,
            tenant_name: unitData[0].tenant_name || currentUser.full_name || ""
          }));
        }
        
        if (buildingData.length > 0) {
          setBuilding(buildingData[0]);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Init error:", err);
        base44.auth.redirectToLogin();
      }
    }
    init();
  }, [navigate]);

  const handleCarCountChange = (count) => {
    const newCount = parseInt(count) || 0;
    setFormData(prev => ({
      ...prev,
      car_count: newCount,
      car_numbers: Array(newCount).fill("").map((_, i) => prev.car_numbers[i] || "")
    }));
  };

  const handleCarNumberChange = (index, value) => {
    const newCarNumbers = [...formData.car_numbers];
    newCarNumbers[index] = value;
    setFormData(prev => ({
      ...prev,
      car_numbers: newCarNumbers
    }));
  };

  const handleSubmit = async () => {
    if (!formData.tenant_name) {
      alert("입주자 이름을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // Update unit with additional info
      await base44.entities.Unit.update(pendingInvitation.unitId, {
        tenant_name: formData.tenant_name,
        is_owner: formData.is_owner,
        residents_count: formData.residents_count,
        move_in_date: formData.move_in_date || null,
        car_count: formData.car_count,
        car_numbers: formData.car_numbers.filter(cn => cn.trim() !== "")
      });
      
      // Create BuildingMember
      await base44.entities.BuildingMember.create({
        building_id: pendingInvitation.buildingId,
        user_id: user.id,
        user_email: user.email,
        role: "입주자",
        unit_id: pendingInvitation.unitId,
        status: "활성"
      });
      
      // Update invitation status
      await base44.entities.Invitation.update(pendingInvitation.invitationId, {
        status: "가입 완료",
        accepted_at: new Date().toISOString()
      });
      
      // Clear sessionStorage
      sessionStorage.removeItem('pendingInvitation');
      
      navigate(createPageUrl("MyBuildings"));
    } catch (err) {
      console.error("Error saving:", err);
      alert("정보 저장 중 오류가 발생했습니다.");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center">
        <LoadingSpinner text="로딩 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-900">셀프빌</span>
          </div>
          <p className="text-slate-600">입주자 추가 정보 입력</p>
        </div>

        <Card className="card-rounded">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  추가 정보 입력
                </h2>
                <p className="text-slate-500 text-sm">
                  {building?.name} {unit?.unit_name}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label>입주자 이름 *</Label>
                <Input
                  value={formData.tenant_name}
                  onChange={(e) => setFormData({...formData, tenant_name: e.target.value})}
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_owner"
                    checked={formData.is_owner}
                    onCheckedChange={(checked) => setFormData({...formData, is_owner: checked})}
                  />
                  <Label htmlFor="is_owner" className="cursor-pointer">자가 여부</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>거주 인원</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.residents_count}
                  onChange={(e) => setFormData({...formData, residents_count: parseInt(e.target.value) || 1})}
                  placeholder="거주 인원"
                />
              </div>

              <div className="space-y-2">
                <Label>입주일</Label>
                <Input
                  type="date"
                  value={formData.move_in_date}
                  onChange={(e) => setFormData({...formData, move_in_date: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>차량 대수</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.car_count}
                  onChange={(e) => handleCarCountChange(e.target.value)}
                  placeholder="차량 대수"
                />
              </div>

              {formData.car_count > 0 && (
                <div className="space-y-2">
                  <Label>차량 번호</Label>
                  {Array.from({ length: formData.car_count }).map((_, idx) => (
                    <Input
                      key={idx}
                      value={formData.car_numbers[idx] || ""}
                      onChange={(e) => handleCarNumberChange(idx, e.target.value)}
                      placeholder={`차량 ${idx + 1} 번호 (예: 12가3456)`}
                    />
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl("TenantInviteCheck"))}
                  className="flex-1"
                  disabled={isSaving}
                >
                  이전
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSaving || !formData.tenant_name}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    "완료"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}