import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, Settings, Home, FileText, Receipt, 
  Loader2, Check, AlertCircle, ChevronRight, Trash2 
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const BANKS = [
  "국민은행", "신한은행", "우리은행", "하나은행", "농협은행",
  "기업은행", "SC제일은행", "카카오뱅크", "토스뱅크", "케이뱅크"
];

export default function BuildingSetupWizard() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [building, setBuilding] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: 건물정보
  const [step1Data, setStep1Data] = useState({
    name: "",
    address: "",
    address_detail: "",
    planned_units_count: ""
  });

  // Step 2: 관리비 설정
  const [step2Data, setStep2Data] = useState({
    billing_method: "",
    billing_period_start: 1,
    billing_period_end: 31,
    billing_due_day: 10,
    late_fee_rate_percent: 2.0,
    bank_name: "",
    bank_account: "",
    bank_holder: ""
  });

  // Step 3: 세대 정보
  const [units, setUnits] = useState([]);
  const [selectedRepUnit, setSelectedRepUnit] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitForm, setUnitForm] = useState({
    dong: "", ho: "", floor: "",
    tenant_name: "",
    phone1: "010", phone2: "", phone3: "",
    share_ratio: ""
  });

  // Step 4: 관리비 항목
  const [templates, setTemplates] = useState([]);
  const [templateForm, setTemplateForm] = useState({
    name: "", category: "일반", amount_type: "고정",
    default_amount: "", default_months: [1,2,3,4,5,6,7,8,9,10,11,12]
  });

  useEffect(() => {
    init();
  }, [buildingId]);

  const init = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (buildingId) {
        const buildings = await base44.entities.Building.filter({ id: buildingId });
        if (buildings.length > 0) {
          const bldg = buildings[0];
          setBuilding(bldg);
          
          // Load data based on setup_step
          if (bldg.setup_step >= 1) {
            setStep1Data({
              name: bldg.name || "",
              address: bldg.address || "",
              address_detail: bldg.address_detail || "",
              planned_units_count: bldg.planned_units_count || ""
            });
          }
          if (bldg.setup_step >= 2) {
            setStep2Data({
              billing_method: bldg.billing_method || "",
              billing_period_start: bldg.billing_period_start || 1,
              billing_period_end: bldg.billing_period_end || 31,
              billing_due_day: bldg.billing_due_day || 10,
              late_fee_rate_percent: bldg.late_fee_rate_percent || 2.0,
              bank_name: bldg.bank_name || "",
              bank_account: bldg.bank_account || "",
              bank_holder: bldg.bank_holder || ""
            });
          }
          if (bldg.setup_step >= 3) {
            const unitsData = await base44.entities.Unit.filter({
              building_id: buildingId,
              status: "active"
            });
            setUnits(unitsData);
          }
          if (bldg.setup_step >= 4) {
            const templatesData = await base44.entities.BillItemTemplate.filter({
              building_id: buildingId
            });
            setTemplates(templatesData);
          }
          
          setCurrentStep(bldg.setup_step || 1);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Init error:", err);
      base44.auth.redirectToLogin();
    }
  };

  const saveStep1 = async () => {
    if (!step1Data.name || !step1Data.planned_units_count) {
      alert("건물명과 전체 세대수를 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      let bldgId = buildingId;
      if (!bldgId) {
        const newBuilding = await base44.entities.Building.create({
          ...step1Data,
          planned_units_count: parseInt(step1Data.planned_units_count),
          status: "draft",
          setup_step: 1,
          building_units_count: 0
        });
        bldgId = newBuilding.id;
        
        await base44.entities.BuildingMember.create({
          building_id: bldgId,
          user_id: user.id,
          user_email: user.email,
          role: "대표자",
          is_primary_representative: true,
          status: "활성"
        });
        
        navigate(createPageUrl(`BuildingSetupWizard?buildingId=${bldgId}`));
      } else {
        await base44.entities.Building.update(bldgId, {
          ...step1Data,
          planned_units_count: parseInt(step1Data.planned_units_count),
          setup_step: 1
        });
      }
      
      await init();
      setCurrentStep(2);
    } catch (err) {
      console.error("Error saving step 1:", err);
    }
    setIsSaving(false);
  };

  const saveStep2 = async () => {
    if (!step2Data.billing_method || !step2Data.bank_name || !step2Data.bank_account || !step2Data.bank_holder) {
      alert("모든 필수 정보를 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.Building.update(buildingId, {
        ...step2Data,
        setup_step: 2
      });
      await init();
      setCurrentStep(3);
    } catch (err) {
      console.error("Error saving step 2:", err);
    }
    setIsSaving(false);
  };

  const addUnit = async () => {
    if (!unitForm.ho || !unitForm.tenant_name || !unitForm.phone2 || !unitForm.phone3) {
      alert("호수, 입주자 이름, 전화번호를 모두 입력해 주세요.");
      return;
    }

    // 전화번호 형식 검증
    const phone1 = unitForm.phone1.trim();
    const phone2 = unitForm.phone2.trim();
    const phone3 = unitForm.phone3.trim();
    
    if (phone1.length < 3 || phone2.length < 3 || phone2.length > 4 || phone3.length !== 4) {
      alert("올바른 전화번호 형식을 입력해 주세요. (예: 010-1234-5678)");
      return;
    }

    if (step2Data.billing_method === "지분율에 의거 부과" && !unitForm.share_ratio) {
      alert("지분율을 입력해 주세요.");
      return;
    }

    const tenant_phone = `${unitForm.phone1}-${unitForm.phone2}-${unitForm.phone3}`;
    const unit_name = [step1Data.name && `${step1Data.name}동`, unitForm.ho && `${unitForm.ho}호`].filter(Boolean).join(" ");

    try {
      if (editingUnit) {
        await base44.entities.Unit.update(editingUnit.id, {
          dong: step1Data.name,
          ho: unitForm.ho,
          floor: unitForm.floor,
          unit_name,
          tenant_name: unitForm.tenant_name,
          tenant_phone,
          share_ratio: unitForm.share_ratio ? parseFloat(unitForm.share_ratio) : null,
          building_id: buildingId,
          status: "active"
        });
      } else {
        await base44.entities.Unit.create({
          dong: step1Data.name,
          ho: unitForm.ho,
          floor: unitForm.floor,
          unit_name,
          tenant_name: unitForm.tenant_name,
          tenant_phone,
          share_ratio: unitForm.share_ratio ? parseFloat(unitForm.share_ratio) : null,
          building_id: buildingId,
          status: "active"
        });
      }

      const unitsData = await base44.entities.Unit.filter({
        building_id: buildingId,
        status: "active"
      });
      setUnits(unitsData);
      
      // Auto-calculate share_ratio for 균등배분
      if (step2Data.billing_method === "균등 배분") {
        await recalculateEqualShares(unitsData);
      }

      setUnitForm({
        dong: "", ho: "", floor: "",
        tenant_name: "",
        phone1: "010", phone2: "", phone3: "",
        share_ratio: ""
      });
      setEditingUnit(null);
    } catch (err) {
      console.error("Error adding unit:", err);
    }
  };

  const recalculateEqualShares = async (unitsData) => {
    const count = unitsData.length;
    if (count === 0) return;

    const baseShare = 100 / count;
    for (let i = 0; i < unitsData.length; i++) {
      const share = i === unitsData.length - 1 
        ? 100 - (baseShare * (count - 1))
        : baseShare;
      
      await base44.entities.Unit.update(unitsData[i].id, {
        share_ratio: parseFloat(share.toFixed(2))
      });
    }

    const updatedUnits = await base44.entities.Unit.filter({
      building_id: buildingId,
      status: "active"
    });
    setUnits(updatedUnits);
  };

  const deleteUnit = async (unitId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await base44.entities.Unit.update(unitId, { status: "inactive" });
      const unitsData = await base44.entities.Unit.filter({
        building_id: buildingId,
        status: "active"
      });
      setUnits(unitsData);
      
      if (step2Data.billing_method === "균등 배분") {
        await recalculateEqualShares(unitsData);
      }
    } catch (err) {
      console.error("Error deleting unit:", err);
    }
  };

  const saveStep3 = async () => {
    if (units.length === 0) {
      alert("최소 1개 이상의 세대를 등록해 주세요.");
      return;
    }

    if (step2Data.billing_method === "지분율에 의거 부과") {
      const totalShare = units.reduce((sum, u) => sum + (u.share_ratio || 0), 0);
      if (Math.abs(totalShare - 100) > 0.1) {
        alert(`지분율 합계가 100%가 되어야 합니다. 현재: ${totalShare.toFixed(1)}%`);
        return;
      }
    }

    if (!selectedRepUnit) {
      alert("대표자의 세대를 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.Building.update(buildingId, {
        building_units_count: units.length,
        setup_step: 3
      });
      
      // Update BuildingMember with unit_id
      const members = await base44.entities.BuildingMember.filter({
        building_id: buildingId,
        user_email: user.email,
        role: "대표자"
      });
      if (members.length > 0) {
        await base44.entities.BuildingMember.update(members[0].id, {
          unit_id: selectedRepUnit
        });
      }

      await init();
      setCurrentStep(4);
    } catch (err) {
      console.error("Error saving step 3:", err);
    }
    setIsSaving(false);
  };

  const addTemplate = async () => {
    if (!templateForm.name) {
      alert("항목명을 입력해 주세요.");
      return;
    }

    try {
      await base44.entities.BillItemTemplate.create({
        building_id: buildingId,
        name: templateForm.name,
        category: templateForm.category,
        amount_type: templateForm.amount_type,
        default_amount: templateForm.default_amount ? parseFloat(templateForm.default_amount) : 0,
        default_months: templateForm.default_months,
        default_type: "공용"
      });

      const templatesData = await base44.entities.BillItemTemplate.filter({
        building_id: buildingId
      });
      setTemplates(templatesData);

      setTemplateForm({
        name: "", category: "일반", amount_type: "고정",
        default_amount: "", default_months: [1,2,3,4,5,6,7,8,9,10,11,12]
      });
    } catch (err) {
      console.error("Error adding template:", err);
    }
  };

  const deleteTemplate = async (templateId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await base44.entities.BillItemTemplate.delete(templateId);
      const templatesData = await base44.entities.BillItemTemplate.filter({
        building_id: buildingId
      });
      setTemplates(templatesData);
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  const saveStep4 = async () => {
    if (templates.length === 0) {
      alert("최소 1개 이상의 관리비 항목을 등록해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.Building.update(buildingId, {
        setup_step: 4
      });
      await init();
      setCurrentStep(5);
    } catch (err) {
      console.error("Error saving step 4:", err);
    }
    setIsSaving(false);
  };

  const completeSetup = async () => {
    setIsSaving(true);
    try {
      const unitCount = units.length;
      let monthlyFee = 19900;
      if (unitCount > 10) {
        monthlyFee = 19900 + (unitCount - 10) * 2900;
      }

      await base44.entities.Building.update(buildingId, {
        billing_monthly_fee_krw: monthlyFee,
        selfbill_plan_confirmed_at: new Date().toISOString(),
        setup_step: 5,
        status: "active"
      });

      navigate(createPageUrl(`RepDashboard?buildingId=${buildingId}`));
    } catch (err) {
      console.error("Error completing setup:", err);
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

  const steps = [
    { num: 1, label: "건물정보", icon: Building2 },
    { num: 2, label: "관리비 설정", icon: Settings },
    { num: 3, label: "세대 정보", icon: Home },
    { num: 4, label: "관리비 항목", icon: FileText },
    { num: 5, label: "요금제 확인", icon: Receipt }
  ];

  const totalShareRatio = units.reduce((sum, u) => sum + (u.share_ratio || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isComplete = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              
              return (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isComplete ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-primary text-white' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {isComplete ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className="text-xs font-medium text-slate-600">{step.label}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      isComplete ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step 1: 건물정보 */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>1단계: 건물정보 입력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>공동주택 이름 *</Label>
                <Input
                  value={step1Data.name}
                  onChange={(e) => setStep1Data({...step1Data, name: e.target.value})}
                  placeholder="예: 행복빌라 101동"
                />
              </div>
              <div className="space-y-2">
                <Label>주소</Label>
                <Input
                  value={step1Data.address}
                  onChange={(e) => setStep1Data({...step1Data, address: e.target.value})}
                  placeholder="예: 서울시 강남구 테헤란로 123"
                />
              </div>
              <div className="space-y-2">
                <Label>상세 주소</Label>
                <Input
                  value={step1Data.address_detail}
                  onChange={(e) => setStep1Data({...step1Data, address_detail: e.target.value})}
                  placeholder="예: A동 전체"
                />
              </div>
              <div className="space-y-2">
                <Label>전체 세대수 *</Label>
                <Input
                  type="number"
                  min="1"
                  value={step1Data.planned_units_count}
                  onChange={(e) => setStep1Data({...step1Data, planned_units_count: e.target.value})}
                  placeholder="예: 10"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={saveStep1} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  다음 단계
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 관리비 설정 */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>2단계: 관리비 부과 방식 및 수납 계좌</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">관리비 부과 방식 *</Label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="billing_method"
                      value="균등 배분"
                      checked={step2Data.billing_method === "균등 배분"}
                      onChange={(e) => setStep2Data({...step2Data, billing_method: e.target.value})}
                      className="w-4 h-4 mt-1"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">균등 배분</div>
                      <div className="text-sm text-slate-500 mt-1">모든 세대에 동일한 금액 부과 (자동 1/N 계산)</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="billing_method"
                      value="지분율에 의거 부과"
                      checked={step2Data.billing_method === "지분율에 의거 부과"}
                      onChange={(e) => setStep2Data({...step2Data, billing_method: e.target.value})}
                      className="w-4 h-4 mt-1"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">지분율에 의거 부과</div>
                      <div className="text-sm text-slate-500 mt-1">각 세대의 지분율(%)에 따라 부과</div>
                    </div>
                  </label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">관리비 부과 기간 설정</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>부과 기간 시작일</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={step2Data.billing_period_start}
                        onChange={(e) => setStep2Data({...step2Data, billing_period_start: parseInt(e.target.value)})}
                        className="w-24"
                      />
                      <span className="text-slate-500">일</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>부과 기간 종료일</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={step2Data.billing_period_end}
                        onChange={(e) => setStep2Data({...step2Data, billing_period_end: parseInt(e.target.value)})}
                        className="w-24"
                      />
                      <span className="text-slate-500">일</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>납입 기일 (매월)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={step2Data.billing_due_day}
                      onChange={(e) => setStep2Data({...step2Data, billing_due_day: parseInt(e.target.value)})}
                      className="w-24"
                    />
                    <span className="text-slate-500">일</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>연체료율 (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={step2Data.late_fee_rate_percent}
                      onChange={(e) => setStep2Data({...step2Data, late_fee_rate_percent: parseFloat(e.target.value)})}
                      className="w-24"
                    />
                    <span className="text-slate-500">%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">관리비 수납 계좌</Label>
                <div className="space-y-2">
                  <Label>은행명 *</Label>
                  <Select value={step2Data.bank_name} onValueChange={(val) => setStep2Data({...step2Data, bank_name: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="은행 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANKS.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>예금주 *</Label>
                  <Input
                    value={step2Data.bank_holder}
                    onChange={(e) => setStep2Data({...step2Data, bank_holder: e.target.value})}
                    placeholder="예금주명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>계좌번호 *</Label>
                  <Input
                    value={step2Data.bank_account}
                    onChange={(e) => setStep2Data({...step2Data, bank_account: e.target.value})}
                    placeholder="- 없이 입력"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  이전
                </Button>
                <Button onClick={saveStep2} disabled={isSaving} className="flex-1">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  다음 단계
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: 세대 정보 */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>3단계: 세대별 정보 입력</CardTitle>
              <div className="text-sm text-slate-500 mt-2">
                세대 등록 진행상황: <span className="font-bold text-primary">{units.length}세대</span> / {step1Data.planned_units_count}세대
              </div>
              {step2Data.billing_method === "지분율에 의거 부과" && (
                <div className="text-sm text-slate-600 mt-1">
                  지분율 합계: <span className={`font-bold ${Math.abs(totalShareRatio - 100) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalShareRatio.toFixed(1)}%
                  </span> / 100%
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 세대 입력 폼 */}
              <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">동 (고정)</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        value={step1Data.name}
                        disabled
                        className="flex-1 bg-slate-100"
                      />
                      <span className="text-sm text-slate-600">동</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">호수 *</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={unitForm.ho}
                        onChange={(e) => setUnitForm({...unitForm, ho: e.target.value})}
                        placeholder="302"
                        className="flex-1"
                      />
                      <span className="text-sm text-slate-600">호</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">층</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={unitForm.floor}
                        onChange={(e) => setUnitForm({...unitForm, floor: e.target.value})}
                        placeholder="3"
                        className="flex-1"
                      />
                      <span className="text-sm text-slate-600">층</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">입주자 이름 *</Label>
                    <Input
                      value={unitForm.tenant_name}
                      onChange={(e) => setUnitForm({...unitForm, tenant_name: e.target.value})}
                      placeholder="홍길동"
                    />
                  </div>
                  {step2Data.billing_method === "지분율에 의거 부과" && (
                    <div>
                      <Label className="text-xs">지분율 (%) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={unitForm.share_ratio}
                        onChange={(e) => setUnitForm({...unitForm, share_ratio: e.target.value})}
                        placeholder="10.5"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-xs">전화번호 *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={unitForm.phone1}
                      onChange={(e) => setUnitForm({...unitForm, phone1: e.target.value})}
                      className="w-20"
                      maxLength={3}
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      value={unitForm.phone2}
                      onChange={(e) => setUnitForm({...unitForm, phone2: e.target.value})}
                      className="w-24"
                      maxLength={4}
                      placeholder="1234"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      value={unitForm.phone3}
                      onChange={(e) => setUnitForm({...unitForm, phone3: e.target.value})}
                      className="w-24"
                      maxLength={4}
                      placeholder="5678"
                    />
                  </div>
                </div>

                <Button onClick={addUnit} className="w-full">
                  {editingUnit ? "세대 수정" : "세대 추가"}
                </Button>
              </div>

              {/* 세대 목록 */}
              <div className="space-y-2">
                {units.map(unit => (
                  <div key={unit.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="repUnit"
                        checked={selectedRepUnit === unit.id}
                        onChange={() => setSelectedRepUnit(unit.id)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {unit.unit_name || [unit.dong && `${unit.dong}동`, unit.ho && `${unit.ho}호`, unit.floor && `${unit.floor}층`].filter(Boolean).join(" ")}
                        </div>
                        <div className="text-sm text-slate-500">
                          {unit.tenant_name} · {unit.tenant_phone}
                          {unit.share_ratio && ` · 지분율 ${unit.share_ratio}%`}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteUnit(unit.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              {selectedRepUnit && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    ✓ 선택된 세대가 대표자의 세대로 등록됩니다
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  이전
                </Button>
                <Button onClick={saveStep3} disabled={isSaving} className="flex-1">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  다음 단계
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: 관리비 항목 */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>4단계: 관리비 항목 선택 (고정관리비)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">항목명 *</Label>
                    <Input
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                      placeholder="예: 공용전기료"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">카테고리</Label>
                    <Select value={templateForm.category} onValueChange={(val) => setTemplateForm({...templateForm, category: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="일반">일반</SelectItem>
                        <SelectItem value="수선">수선</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">금액 유형</Label>
                    <Select value={templateForm.amount_type} onValueChange={(val) => setTemplateForm({...templateForm, amount_type: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="고정">고정 (변동 없음)</SelectItem>
                        <SelectItem value="변동">변동 (매달 입력)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {templateForm.amount_type === "고정" && (
                    <div>
                      <Label className="text-xs">기본 금액</Label>
                      <Input
                        type="number"
                        value={templateForm.default_amount}
                        onChange={(e) => setTemplateForm({...templateForm, default_amount: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={addTemplate} className="w-full">
                  항목 추가
                </Button>
              </div>

              <div className="space-y-2">
                {templates.map(tpl => (
                  <div key={tpl.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{tpl.name}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        <Badge variant="outline" className="mr-2">{tpl.category}</Badge>
                        <Badge variant="outline" className="mr-2">{tpl.amount_type}</Badge>
                        {tpl.amount_type === "고정" && `${tpl.default_amount?.toLocaleString()}원`}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTemplate(tpl.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  이전
                </Button>
                <Button onClick={saveStep4} disabled={isSaving} className="flex-1">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  다음 단계
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: 요금제 */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>5단계: 셀프빌 요금제 확인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  {units.length}세대
                </div>
                <p className="text-slate-500">현재 등록된 세대 수</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-primary-light/20 to-primary/10 rounded-xl">
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-600 mb-2">이 건물의 셀프빌 요금</p>
                  <div className="text-5xl font-bold text-slate-900">
                    {units.length <= 10 
                      ? '19,900'
                      : (19900 + (units.length - 10) * 2900).toLocaleString()
                    }<span className="text-2xl text-slate-600">원/월</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">1~10세대</span>
                      <span className="font-medium">19,900원</span>
                    </div>
                    {units.length > 10 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">추가 {units.length - 10}세대</span>
                        <span className="font-medium">+ {((units.length - 10) * 2900).toLocaleString()}원</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>합계</span>
                      <span className="text-primary">
                        {units.length <= 10 
                          ? '19,900'
                          : (19900 + (units.length - 10) * 2900).toLocaleString()
                        }원/월
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  ✓ 위 요금으로 셀프빌 서비스를 이용하실 수 있습니다.<br/>
                  ✓ 건물 등록을 완료하면 대표자 대시보드로 이동합니다.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>
                  이전
                </Button>
                <Button onClick={completeSetup} disabled={isSaving || units.length === 0} className="flex-1 bg-green-600 hover:bg-green-700">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-5 h-5 mr-2" />}
                  등록 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}