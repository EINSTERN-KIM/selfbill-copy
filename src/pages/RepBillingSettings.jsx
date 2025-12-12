import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, Save } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepBillingSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    billing_method: "균등분배",
    due_day: 25,
    late_fee_rate: 5
  });

  useEffect(() => {
    if (building) {
      setFormData({
        billing_method: building.billing_method || "균등분배",
        due_day: building.due_day || 25,
        late_fee_rate: building.late_fee_rate || 5
      });
    }
  }, [building]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.entities.Building.update(buildingId, formData);
      navigate(createPageUrl(`RepDashboard?buildingId=${buildingId}`));
    } catch (err) {
      console.error("Error saving:", err);
    }
    setIsSaving(false);
  };

  if (isLoading) {
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
      <div className="max-w-lg mx-auto px-4 py-6">
        <PageHeader
          title="관리비 설정"
          subtitle="부과 방식, 납기일, 연체율을 설정합니다"
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
        />

        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <Label>부과 방식</Label>
              <Select
                value={formData.billing_method}
                onValueChange={(value) => setFormData({ ...formData, billing_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="균등분배">균등분배 (동일 금액)</SelectItem>
                  <SelectItem value="면적비례">면적비례</SelectItem>
                  <SelectItem value="세대별차등">세대별 차등</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                공용 관리비 항목을 세대별로 어떻게 나눌지 결정합니다.
              </p>
            </div>

            <div className="space-y-2">
              <Label>납기일 (매월)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={28}
                  value={formData.due_day}
                  onChange={(e) => setFormData({ ...formData, due_day: parseInt(e.target.value) || 25 })}
                  className="w-24"
                />
                <span className="text-slate-500">일</span>
              </div>
              <p className="text-xs text-slate-500">
                관리비 납기일입니다. 1~28일 사이로 설정하세요.
              </p>
            </div>

            <div className="space-y-2">
              <Label>연체율</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={formData.late_fee_rate}
                  onChange={(e) => setFormData({ ...formData, late_fee_rate: parseFloat(e.target.value) || 0 })}
                  className="w-24"
                />
                <span className="text-slate-500">%</span>
              </div>
              <p className="text-xs text-slate-500">
                납기일 이후 연체료가 부과됩니다.
              </p>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(createPageUrl(`RepDashboard?buildingId=${buildingId}`))}
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