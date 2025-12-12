import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, Plus, Loader2, Home, Phone, Trash2, Edit2 } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import PhoneInput from '@/components/common/PhoneInput';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepUnits() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [units, setUnits] = useState([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    dong: "",
    floor: "",
    ho: "",
    area_sqm: "",
    payment_ratio: 100,
    tenant_name: "",
    tenant_phone: "010--"
  });

  useEffect(() => {
    loadUnits();
  }, [buildingId]);

  const loadUnits = async () => {
    if (!buildingId) return;
    try {
      const data = await base44.entities.Unit.filter({
        building_id: buildingId
      });
      setUnits(data.filter(u => u.status !== "inactive"));
      setIsLoadingUnits(false);
    } catch (err) {
      console.error("Error loading units:", err);
      setIsLoadingUnits(false);
    }
  };

  const updateBuildingUnitsCount = async () => {
    const activeUnits = await base44.entities.Unit.filter({
      building_id: buildingId,
      status: "active"
    });
    const count = activeUnits.length;
    const billingUnitCount = Math.ceil(count / 10);
    const monthlyFee = billingUnitCount * 9900;
    
    await base44.entities.Building.update(buildingId, {
      building_units_count: count,
      billing_unit_count: billingUnitCount,
      billing_monthly_fee_krw: monthlyFee
    });
  };

  const handleOpenDialog = (unit = null) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData({
        dong: unit.dong || "",
        floor: unit.floor || "",
        ho: unit.ho || "",
        area_sqm: unit.area_sqm || "",
        payment_ratio: unit.payment_ratio || 100,
        tenant_name: unit.tenant_name || "",
        tenant_phone: unit.tenant_phone || "010--"
      });
    } else {
      setEditingUnit(null);
      setFormData({
        dong: "",
        floor: "",
        ho: "",
        area_sqm: "",
        payment_ratio: 100,
        tenant_name: "",
        tenant_phone: "010--"
      });
    }
    setShowDialog(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saveData = {
        ...formData,
        building_id: buildingId,
        area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
        payment_ratio: parseFloat(formData.payment_ratio) || 100,
        status: "active"
      };

      if (editingUnit) {
        await base44.entities.Unit.update(editingUnit.id, saveData);
      } else {
        await base44.entities.Unit.create(saveData);
      }
      
      await updateBuildingUnitsCount();
      await loadUnits();
      setShowDialog(false);
    } catch (err) {
      console.error("Error saving unit:", err);
    }
    setIsSaving(false);
  };

  const handleDelete = async (unitId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await base44.entities.Unit.update(unitId, { status: "inactive" });
      await updateBuildingUnitsCount();
      await loadUnits();
    } catch (err) {
      console.error("Error deleting unit:", err);
    }
  };

  if (isLoading || isLoadingUnits) {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="세대 목록"
          subtitle={`총 ${units.length}세대`}
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
          actions={
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              세대 추가
            </Button>
          }
        />

        {units.length === 0 ? (
          <EmptyState
            icon={Home}
            title="등록된 세대가 없습니다"
            description="세대를 추가하여 관리비 부과를 시작하세요."
            actionLabel="세대 추가"
            onAction={() => handleOpenDialog()}
          />
        ) : (
          <div className="space-y-3">
            {units.map((unit) => (
              <Card key={unit.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Home className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {[unit.dong, unit.floor, unit.ho].filter(Boolean).join(" ") || "호수 미입력"}
                        </p>
                        {unit.tenant_name && (
                          <p className="text-sm text-slate-500">
                            {unit.tenant_name}
                            {unit.tenant_phone && ` · ${unit.tenant_phone}`}
                          </p>
                        )}
                        {unit.area_sqm && (
                          <p className="text-xs text-slate-400">{unit.area_sqm}㎡</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(unit)}
                      >
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(unit.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUnit ? "세대 수정" : "세대 추가"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>동</Label>
                  <Input
                    value={formData.dong}
                    onChange={(e) => setFormData({ ...formData, dong: e.target.value })}
                    placeholder="A동"
                  />
                </div>
                <div className="space-y-2">
                  <Label>층</Label>
                  <Input
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="3층"
                  />
                </div>
                <div className="space-y-2">
                  <Label>호수 *</Label>
                  <Input
                    value={formData.ho}
                    onChange={(e) => setFormData({ ...formData, ho: e.target.value })}
                    placeholder="301호"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>전용면적 (㎡)</Label>
                  <Input
                    type="number"
                    value={formData.area_sqm}
                    onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                    placeholder="59.8"
                  />
                </div>
                <div className="space-y-2">
                  <Label>납부 비율 (%)</Label>
                  <Input
                    type="number"
                    value={formData.payment_ratio}
                    onChange={(e) => setFormData({ ...formData, payment_ratio: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-slate-700 mb-3">입주자 정보</p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>입주자 이름</Label>
                    <Input
                      value={formData.tenant_name}
                      onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
                      placeholder="홍길동"
                    />
                  </div>
                  <PhoneInput
                    value={formData.tenant_phone}
                    onChange={(val) => setFormData({ ...formData, tenant_phone: val })}
                    label="입주자 휴대폰"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                취소
              </Button>
              <Button onClick={handleSave} disabled={!formData.ho || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "저장"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}