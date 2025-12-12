import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Save, Home } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function TenantMyUnit() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, membership, error } = useBuildingAuth(buildingId, "입주자");
  const [unit, setUnit] = useState(null);
  const [isLoadingUnit, setIsLoadingUnit] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    tenant_email: "",
    tenant_move_in_date: "",
    tenant_memo: ""
  });

  useEffect(() => {
    async function loadUnit() {
      if (!membership?.unit_id) {
        setIsLoadingUnit(false);
        return;
      }
      
      try {
        const units = await base44.entities.Unit.filter({ id: membership.unit_id });
        if (units.length > 0) {
          const unitData = units[0];
          setUnit(unitData);
          setFormData({
            tenant_email: unitData.tenant_email || "",
            tenant_move_in_date: unitData.tenant_move_in_date || "",
            tenant_memo: unitData.tenant_memo || ""
          });
        }
        setIsLoadingUnit(false);
      } catch (err) {
        console.error("Error loading unit:", err);
        setIsLoadingUnit(false);
      }
    }
    
    if (!isLoading) {
      loadUnit();
    }
  }, [membership, isLoading]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.entities.Unit.update(unit.id, formData);
      navigate(createPageUrl(`TenantDashboard?buildingId=${buildingId}`));
    } catch (err) {
      console.error("Error saving:", err);
    }
    setIsSaving(false);
  };

  if (isLoading || isLoadingUnit) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-slate-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUnitDisplay = () => {
    if (!unit) return "-";
    const parts = [];
    if (unit.dong) parts.push(unit.dong);
    if (unit.floor) parts.push(unit.floor);
    if (unit.ho) parts.push(unit.ho);
    return parts.join(" ") || "-";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <PageHeader
          title="내 세대 정보"
          subtitle={getUnitDisplay()}
          backUrl={createPageUrl(`TenantDashboard?buildingId=${buildingId}`)}
        />

        {/* Read-only info from representative */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500 flex items-center gap-2">
              <Home className="w-4 h-4" />
              세대 기본정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">동/층/호수</p>
                <p className="font-medium text-slate-900">{getUnitDisplay()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">전용면적</p>
                <p className="font-medium text-slate-900">
                  {unit?.area_sqm ? `${unit.area_sqm}㎡` : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">입주자명</p>
                <p className="font-medium text-slate-900">{unit?.tenant_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">연락처</p>
                <p className="font-medium text-slate-900">{unit?.tenant_phone || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editable info by tenant */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">추가 정보 (선택)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input
                type="email"
                value={formData.tenant_email}
                onChange={(e) => setFormData({ ...formData, tenant_email: e.target.value })}
                placeholder="이메일 주소"
              />
            </div>

            <div className="space-y-2">
              <Label>입주일</Label>
              <Input
                type="date"
                value={formData.tenant_move_in_date}
                onChange={(e) => setFormData({ ...formData, tenant_move_in_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>메모</Label>
              <Textarea
                value={formData.tenant_memo}
                onChange={(e) => setFormData({ ...formData, tenant_memo: e.target.value })}
                placeholder="대표자에게 전달할 메모가 있다면 입력해주세요"
                rows={3}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(createPageUrl(`TenantDashboard?buildingId=${buildingId}`))}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}