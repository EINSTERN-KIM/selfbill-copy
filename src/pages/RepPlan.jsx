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
    selfbill_bank_name: "",
    selfbill_account_holder: "",
    selfbill_account_number: "",
    selfbill_billing_start_date: ""
  });

  useEffect(() => {
    if (building) {
      setFormData({
        selfbill_bank_name: building.selfbill_bank_name || "",
        selfbill_account_holder: building.selfbill_account_holder || "",
        selfbill_account_number: building.selfbill_account_number || "",
        selfbill_billing_start_date: building.selfbill_billing_start_date || ""
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

  const unitCount = building?.building_units_count || 0;
  const billingUnitCount = Math.ceil(unitCount / 10) || 0;
  const monthlyFee = billingUnitCount * 9900;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <PageHeader
          title="요금제 확인"
          subtitle="셀프빌 이용 요금 및 자동이체 설정"
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
        />

        {/* Pricing Card */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-slate-900">{building?.name}</h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded-lg">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-slate-900">{unitCount}</p>
                <p className="text-xs text-slate-500">활성 세대</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Receipt className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-slate-900">{billingUnitCount * 10}</p>
                <p className="text-xs text-slate-500">과금 단위</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-600">{monthlyFee.toLocaleString()}</p>
                <p className="text-xs text-slate-500">월 요금(원)</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">요금 계산 방식</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 1~10세대: 9,900원</li>
                <li>• 11~20세대: 19,800원</li>
                <li>• 21~30세대: 29,700원</li>
                <li className="text-slate-400">• 10세대 단위로 9,900원씩 추가</li>
              </ul>
            </div>
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
            <div className="space-y-2">
              <Label>은행</Label>
              <Select
                value={formData.selfbill_bank_name}
                onValueChange={(value) => setFormData({ ...formData, selfbill_bank_name: value })}
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
              <Label>예금주</Label>
              <Input
                value={formData.selfbill_account_holder}
                onChange={(e) => setFormData({ ...formData, selfbill_account_holder: e.target.value })}
                placeholder="예금주명"
              />
            </div>

            <div className="space-y-2">
              <Label>계좌번호</Label>
              <Input
                value={formData.selfbill_account_number}
                onChange={(e) => setFormData({ ...formData, selfbill_account_number: e.target.value })}
                placeholder="- 없이 입력"
              />
            </div>

            <div className="space-y-2">
              <Label>자동이체 시작일</Label>
              <Input
                type="date"
                value={formData.selfbill_billing_start_date}
                onChange={(e) => setFormData({ ...formData, selfbill_billing_start_date: e.target.value })}
              />
              <p className="text-xs text-slate-500">
                매월 이 날짜에 셀프빌 이용료가 자동이체됩니다.
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