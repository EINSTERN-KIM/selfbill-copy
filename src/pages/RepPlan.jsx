import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, Save, CreditCard, Building2, Users, Receipt } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';
import RepLayout from '@/components/common/RepLayout';

const BANKS = [
  "국민은행", "신한은행", "우리은행", "하나은행", "농협은행",
  "기업은행", "SC제일은행", "카카오뱅크", "토스뱅크", "케이뱅크",
  "새마을금고", "신협", "우체국", "수협", "지방은행"
];

export default function RepPlan() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    selfbill_auto_bank_name: "",
    selfbill_auto_bank_holder: "",
    selfbill_auto_bank_account: ""
  });
  const [planConfirmed, setPlanConfirmed] = useState(false);

  useEffect(() => {
    if (building) {
      setFormData({
        selfbill_auto_bank_name: building.selfbill_auto_bank_name || "",
        selfbill_auto_bank_holder: building.selfbill_auto_bank_holder || "",
        selfbill_auto_bank_account: building.selfbill_auto_bank_account || ""
      });
      setPlanConfirmed(!!building.selfbill_plan_confirmed_at);
    }
  }, [building]);
  
  const getNextMonthDate = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  };

  const calculateAutoStartDate = () => {
    const today = new Date();
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    
    // Handle month overflow (e.g., Jan 31 + 1 month = Feb 28/29)
    if (threeMonthsLater.getDate() < today.getDate()) {
      threeMonthsLater.setDate(0); // Set to last day of previous month
    }
    
    return threeMonthsLater.toISOString().split('T')[0];
  };

  const init = async () => {
    try {
      const buildings = await base44.entities.Building.filter({ id: buildingId });
      if (buildings.length > 0) {
        // Data will update via the building state from useBuildingAuth
      }
    } catch (err) {
      console.error("Error loading building:", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        selfbill_auto_start_date: getNextMonthDate()
      };
      await base44.entities.Building.update(buildingId, updateData);
      alert("저장되었습니다.");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Error saving:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepPlan">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </RepLayout>
    );
  }

  if (error) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepPlan">
        <div className="flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-slate-500">{error}</p>
            </CardContent>
          </Card>
        </div>
      </RepLayout>
    );
  }

  const unitCount = building?.building_units_count || 0;
  const monthlyFee = unitCount * 2900;

  return (
    <RepLayout buildingId={buildingId} building={building} currentPage="RepPlan">
      <div className="max-w-lg mx-auto px-4 py-6">
        <PageHeader
          title="요금제 확인"
          subtitle="셀프빌 이용 요금 및 자동이체 설정"
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
        />

        {/* Pricing Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary-light/20 to-primary/10 border-primary-light card-rounded border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-bold text-slate-900">{building?.name}</h2>
              <p className="text-sm text-slate-500 mt-1">셀프빌 이용 요금제</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-4 bg-white rounded-xl">
                <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{unitCount}</p>
                <p className="text-xs text-slate-500 mt-1">총 세대 수</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl">
                <CreditCard className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{monthlyFee.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">월 이용요금(원)</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-slate-900 mb-3">요금 계산 방식</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>• 세대당 요금:</span>
                  <span className="font-medium">2,900원</span>
                </div>
                <div className="flex justify-between">
                  <span>• 총 세대 수:</span>
                  <span className="font-medium">{unitCount}세대</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">월 이용료:</span>
                  <span className="font-bold text-primary">{monthlyFee.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-3">셀프빌 입금 계좌</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">은행</span>
                  <span className="font-medium">신한은행</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">예금주</span>
                  <span className="font-medium">(주)셀프빌</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">계좌번호</span>
                  <span className="font-medium">110-123-456789</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-payment Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                셀프빌 자동이체 계좌
              </CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  수정하기
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">은행명</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formData.selfbill_auto_bank_name || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">예금주</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formData.selfbill_auto_bank_holder || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">계좌번호</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formData.selfbill_auto_bank_account || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">자동이체 시작일</span>
                    <span className="text-sm font-medium text-slate-900">
                      {building?.selfbill_auto_start_date || "-"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    건물 등록일로부터 1개월 후인 <strong>{getNextMonthDate()}</strong>부터 요금이 부과됩니다.
                  </p>
                </div>
                <p className="text-sm text-slate-600">
                  셀프빌 이용료 자동이체를 위한 계좌 정보를 등록해 주세요.
                </p>

                <div className="space-y-2">
                  <Label>은행명 *</Label>
                  <Select
                    value={formData.selfbill_auto_bank_name}
                    onValueChange={(value) => setFormData({ ...formData, selfbill_auto_bank_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="은행 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANKS.map((bank) => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>예금주 *</Label>
                  <Input
                    value={formData.selfbill_auto_bank_holder}
                    onChange={(e) => setFormData({ ...formData, selfbill_auto_bank_holder: e.target.value })}
                    placeholder="예금주명"
                  />
                </div>

                <div className="space-y-2">
                  <Label>계좌번호 *</Label>
                  <Input
                    value={formData.selfbill_auto_bank_account}
                    onChange={(e) => setFormData({ ...formData, selfbill_auto_bank_account: e.target.value })}
                    placeholder="- 없이 입력"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        selfbill_auto_bank_name: building?.selfbill_auto_bank_name || "",
                        selfbill_auto_bank_holder: building?.selfbill_auto_bank_holder || "",
                        selfbill_auto_bank_account: building?.selfbill_auto_bank_account || ""
                      });
                    }}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold"
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </RepLayout>
  );
}