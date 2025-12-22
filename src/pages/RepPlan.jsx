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
  const [formData, setFormData] = useState({
    selfbill_auto_bank_name: "",
    selfbill_auto_bank_holder: "",
    selfbill_auto_bank_account: "",
    selfbill_auto_start_date: ""
  });
  const [planConfirmed, setPlanConfirmed] = useState(false);

  useEffect(() => {
    if (building) {
      setFormData({
        selfbill_auto_bank_name: building.selfbill_auto_bank_name || "",
        selfbill_auto_bank_holder: building.selfbill_auto_bank_holder || "",
        selfbill_auto_bank_account: building.selfbill_auto_bank_account || "",
        selfbill_auto_start_date: building.selfbill_auto_start_date || ""
      });
      setPlanConfirmed(!!building.selfbill_plan_confirmed_at);
    }
  }, [building]);

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

  const handleSave = async () => {
    if (!planConfirmed) {
      alert("요금제 및 월 이용료 확인에 동의해 주세요.");
      return;
    }
    
    if (!formData.selfbill_auto_bank_name || !formData.selfbill_auto_bank_holder || !formData.selfbill_auto_bank_account) {
      alert("셀프빌 자동이체 계좌 정보를 모두 입력해 주세요.");
      return;
    }
    
    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        billing_amount_per_unit: 9900,
        billing_unit_count: billingUnitCount,
        billing_monthly_fee_krw: monthlyFee
      };
      
      // If this is the first time confirming the plan
      if (!building.selfbill_plan_confirmed_at) {
        const today = new Date().toISOString().split('T')[0];
        updateData.selfbill_plan_confirmed_at = today;
        updateData.selfbill_auto_start_date = calculateAutoStartDate();
      }
      
      await base44.entities.Building.update(buildingId, updateData);
      navigate(createPageUrl(`RepDashboard?buildingId=${buildingId}`));
    } catch (err) {
      console.error("Error saving:", err);
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
  const billingUnitCount = Math.ceil(unitCount / 10) || 0;
  const monthlyFee = billingUnitCount * 9900;

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

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-4 bg-white rounded-xl">
                <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{unitCount}</p>
                <p className="text-xs text-slate-500 mt-1">총 세대 수</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl">
                <Receipt className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{billingUnitCount}</p>
                <p className="text-xs text-slate-500 mt-1">과금 단위 개수</p>
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
                  <span>• 과금 기준 단위:</span>
                  <span className="font-medium">10세대당 9,900원</span>
                </div>
                <div className="flex justify-between">
                  <span>• 과금 단위 개수:</span>
                  <span className="font-medium">{billingUnitCount}단위 (세대 수 ÷ 10 올림)</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">월 이용료:</span>
                  <span className="font-bold text-primary">{monthlyFee.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-white rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={planConfirmed}
                onChange={(e) => setPlanConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-primary"
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-900">요금제 및 월 이용료 확인</div>
                <div className="text-sm text-slate-500 mt-1">위 요금제 내용을 확인했으며 동의합니다</div>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Auto-payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              셀프빌 자동이체 계좌
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-slate-600 mb-4">
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

            {formData.selfbill_auto_start_date && (
              <div className="bg-primary-light/20 rounded-xl p-4">
                <Label className="text-sm font-medium text-slate-700">자동이체 시작일</Label>
                <p className="text-lg font-bold text-primary mt-1">
                  {new Date(formData.selfbill_auto_start_date).toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  요금제 확인일로부터 정확히 3개월 후 자동이체가 시작됩니다.
                </p>
              </div>
            )}

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
                disabled={isSaving || !planConfirmed}
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
          </CardContent>
        </Card>
      </div>
    </RepLayout>
  );
}