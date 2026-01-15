import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, Send, Home, Check, Phone, Calendar, Info } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';
import RepLayout from '@/components/common/RepLayout';

export default function RepBillingSend() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const yearMonthParam = urlParams.get('yearMonth');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const [selectedYearMonth, setSelectedYearMonth] = useState(() => {
    if (yearMonthParam) return yearMonthParam;
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [billCycle, setBillCycle] = useState(null);
  const [units, setUnits] = useState([]);
  const [unitCharges, setUnitCharges] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  useEffect(() => {
    loadData();
  }, [buildingId, selectedYearMonth]);

  const loadData = async () => {
    if (!buildingId) return;
    setIsLoadingData(true);
    
    try {
      const [cyclesData, unitsData] = await Promise.all([
        base44.entities.BillCycle.filter({ building_id: buildingId, year_month: selectedYearMonth }),
        base44.entities.Unit.filter({ building_id: buildingId, status: "active" })
      ]);

      setUnits(unitsData);

      if (cyclesData.length === 0) {
        setBillCycle(null);
        setUnitCharges([]);
        setIsLoadingData(false);
        return;
      }

      const cycle = cyclesData[0];
      setBillCycle(cycle);

      const chargesData = await base44.entities.UnitCharge.filter({ bill_cycle_id: cycle.id });
      setUnitCharges(chargesData);
      
      // Auto-select units with phone numbers that haven't been sent
      const toSelect = chargesData
        .filter(c => !c.is_sent)
        .map(c => c.unit_id)
        .filter(unitId => {
          const unit = unitsData.find(u => u.id === unitId);
          return unit?.tenant_phone && !unit.tenant_phone.includes("--");
        });
      setSelectedUnits(toSelect);
      
      setIsLoadingData(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setIsLoadingData(false);
    }
  };

  const handleToggleUnit = (unitId) => {
    setSelectedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleSelectAll = () => {
    const selectableUnits = units
      .filter(u => u.tenant_phone && !u.tenant_phone.includes("--"))
      .map(u => u.id);
    
    if (selectedUnits.length === selectableUnits.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(selectableUnits);
    }
  };

  const handleSend = async () => {
    // 청구서 발송 확인 경고
    if (!confirm("청구서를 한 세대에라도 발송하면 더 이상 수정이 어렵습니다. 그래도 발송하시겠습니까?")) {
      return;
    }

    // 부과기간 종료일 체크
    const [year, month] = selectedYearMonth.split('-').map(Number);
    const billingPeriodStart = building?.billing_period_start || 1;
    const billingPeriodEnd = building?.billing_period_end || 31;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    let billingEndDate;
    if (billingPeriodStart > billingPeriodEnd) {
      // 예: 21일~20일 (익월) - 다음달 20일
      billingEndDate = new Date(year, month, billingPeriodEnd);
    } else {
      // 예: 1일~31일 (동월) - 같은달 31일
      billingEndDate = new Date(year, month - 1, billingPeriodEnd);
    }
    billingEndDate.setHours(23, 59, 59, 999);
    
    if (currentDate <= billingEndDate) {
      const endDateStr = billingEndDate.toLocaleDateString('ko-KR');
      alert(`부과기간 종료일(${endDateStr})이 지나야 청구서를 발송할 수 있습니다.`);
      return;
    }

    // 납기일 계산 (관리비 설정의 납입기일 사용)
    const billingDueDay = building?.billing_due_day || 25;
    const sendDate = new Date();
    let dueYear = year;
    let dueMonth = month;
    
    // 익월 납기일로 설정 (예: 1월 청구서는 2월 N일이 납기일)
    dueMonth++;
    if (dueMonth > 12) {
      dueMonth = 1;
      dueYear++;
    }
    
    // 해당 월의 마지막 날 확인
    const lastDayOfMonth = new Date(dueYear, dueMonth, 0).getDate();
    const dueDateDay = billingDueDay > lastDayOfMonth ? lastDayOfMonth : billingDueDay;
    
    const dueDate = new Date(dueYear, dueMonth - 1, dueDateDay);
    const dueDateStr = `${dueYear}-${String(dueMonth).padStart(2, '0')}-${String(dueDateDay).padStart(2, '0')}`;
    const dueDateDisplay = dueDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

    // 부과기간 문자열 생성
    let billingPeriodText;
    if (billingPeriodStart > billingPeriodEnd) {
      // 익월 걸침 (예: 21일 ~ 익월 20일)
      billingPeriodText = `${month}월 ${billingPeriodStart}일 ~ ${month + 1}월 ${billingPeriodEnd}일`;
    } else {
      // 동월 (예: 1일 ~ 31일)
      billingPeriodText = `${month}월 ${billingPeriodStart}일 ~ ${month}월 ${billingPeriodEnd}일`;
    }

    setIsSending(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      for (const unitId of selectedUnits) {
        const unit = units.find(u => u.id === unitId);
        const charge = unitCharges.find(c => c.unit_id === unitId);

        if (!unit || !charge) {
          failCount++;
          continue;
        }

        try {
          // Mark as sent (even for resend)
          if (!charge.is_sent) {
            await base44.entities.UnitCharge.update(charge.id, {
              is_sent: true,
              sent_at: new Date().toISOString()
            });
          }

          const billDetailUrl = `${window.location.origin}${createPageUrl(`TenantMyBills?buildingId=${buildingId}`)}`;
          const notificationBody = `[${building?.name}]\n${selectedYearMonth} 관리비 청구\n\n부과기간: ${billingPeriodText}\n청구금액: ${charge.amount_total?.toLocaleString()}원\n납기일: ${dueDateDisplay}\n\n입금계좌\n${building?.bank_name} ${building?.bank_account}\n예금주: ${building?.bank_holder}\n\n상세내역은 셀프빌 링크에서 확인하세요.\n${billDetailUrl}`;

          await base44.functions.invoke('sendTwilioSMS', {
            to_phone: unit.tenant_phone,
            body: notificationBody,
            building_id: buildingId,
            event_type: "BILL_NOTICE",
            event_ref_id: charge.id
          });

          const existingPayment = await base44.entities.PaymentStatus.filter({
            unit_charge_id: charge.id
          });
          
          if (existingPayment.length === 0) {
            await base44.entities.PaymentStatus.create({
              unit_charge_id: charge.id,
              building_id: buildingId,
              unit_id: unitId,
              year_month: selectedYearMonth,
              status: "미납",
              charged_amount: charge.amount_total,
              paid_amount: 0
            });
          }
          
          successCount++;
        } catch (unitErr) {
          console.error("Error sending to unit:", unitErr);
          failCount++;
        }
      }

      await base44.entities.BillCycle.update(billCycle.id, {
        status: "sent",
        due_date: dueDateStr
      });

      if (failCount === 0) {
        alert(`✅ 청구서 발송 완료!\n${successCount}세대에 청구서가 성공적으로 발송되었습니다.`);
      } else {
        alert(`⚠️ 청구서 발송 완료\n성공: ${successCount}세대\n실패: ${failCount}세대`);
      }

      navigate(createPageUrl(`RepDashboard?buildingId=${buildingId}`));
    } catch (err) {
      console.error("Error sending:", err);
      alert("❌ 청구서 발송 중 오류가 발생했습니다.");
    }
    
    setIsSending(false);
  };

  if (isLoading || isLoadingData) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepBillingSend">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </RepLayout>
    );
  }

  if (error) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepBillingSend">
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

  const getUnitDisplay = (unit) => {
    const dong = unit.dong || "";
    const ho = unit.ho || "호수 미입력";
    if (dong && unit.ho) {
      return `${dong}, ${ho}호`;
    }
    return ho;
  };

  const getChargeForUnit = (unitId) => {
    return unitCharges.find(c => c.unit_id === unitId);
  };

  const canSendUnit = (unit) => {
    return unit.tenant_phone && !unit.tenant_phone.includes("--");
  };

  const selectableCount = units.filter(canSendUnit).length;

  // Generate year-month options
  const yearMonthOptions = [];
  const now = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    yearMonthOptions.push(ym);
  }

  return (
    <RepLayout buildingId={buildingId} building={building} currentPage="RepBillingSend">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="청구서 발송"
          subtitle="관리비 청구서를 세대에 발송합니다"
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
        />

        {/* Month Selector */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <Select value={selectedYearMonth} onValueChange={setSelectedYearMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearMonthOptions.map(ym => (
                    <SelectItem key={ym} value={ym}>{ym}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 납기일 표시 */}
            <div className="border-t pt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-medium text-amber-900 mb-1">납기일</p>
                <p className="text-sm text-amber-800">
                  {(() => {
                    const [year, month] = selectedYearMonth.split('-').map(Number);
                    const billingDueDay = building?.billing_due_day || 25;
                    let dueYear = year;
                    let dueMonth = month + 1;
                    if (dueMonth > 12) {
                      dueMonth = 1;
                      dueYear++;
                    }
                    const lastDayOfMonth = new Date(dueYear, dueMonth, 0).getDate();
                    const dueDateDay = billingDueDay > lastDayOfMonth ? lastDayOfMonth : billingDueDay;
                    return `${dueYear}년 ${dueMonth}월 ${dueDateDay}일`;
                  })()}
                </p>
                <p className="text-xs text-amber-700 mt-1">※ 관리비 설정에서 변경 가능</p>
              </div>
            </div>

            {/* 부과기간 표시 */}
            {building && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-900 mb-1">부과기간</p>
                <p className="text-sm text-blue-800">
                  {(() => {
                    const [year, month] = selectedYearMonth.split('-').map(Number);
                    const start = building.billing_period_start || 1;
                    const end = building.billing_period_end || 31;
                    
                    if (start > end) {
                      return `${month}월 ${start}일 ~ ${month + 1}월 ${end}일`;
                    } else {
                      return `${month}월 ${start}일 ~ ${month}월 ${end}일`;
                    }
                  })()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {unitCharges.length === 0 ? (
          <EmptyState
            icon={Send}
            title="발송할 청구서가 없습니다"
            description="먼저 세대별 청구 금액을 계산해주세요."
            actionLabel="세대별 청구 확인"
            onAction={() => navigate(createPageUrl(`RepBillingUnitCharges?buildingId=${buildingId}`))}
          />
        ) : (
          <>
            {/* Select All */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedUnits.length === selectableCount && selectableCount > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="font-medium text-slate-900">전체 선택</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {selectedUnits.length} / {selectableCount} 세대 선택
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Unit List */}
            <div className="space-y-3 mb-6">
              {units.sort((a, b) => {
                const hoA = parseInt(a.ho) || 0;
                const hoB = parseInt(b.ho) || 0;
                return hoA - hoB;
              }).map((unit) => {
                const charge = getChargeForUnit(unit.id);
                const canSend = canSendUnit(unit);
                const isSelected = selectedUnits.includes(unit.id);
                const isSent = charge?.is_sent;
                
                return (
                  <Card 
                    key={unit.id} 
                    className={`transition-all ${!canSend ? 'opacity-50' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleUnit(unit.id)}
                          disabled={!canSend}
                        />
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Home className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{getUnitDisplay(unit)}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            {unit.tenant_name && <span>{unit.tenant_name}</span>}
                            {canSend ? (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {unit.tenant_phone}
                              </span>
                            ) : (
                              <span className="text-red-500">번호 미등록</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {charge && (
                            <p className="font-bold text-slate-900">
                              {charge.amount_total?.toLocaleString()}원
                            </p>
                          )}
                          {isSent && (
                            <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                              <Check className="w-3 h-3" />
                              발송완료
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Send Button */}
            <Card className="sticky bottom-4">
              <CardContent className="p-4">
                <Button
                  onClick={handleSend}
                  disabled={selectedUnits.length === 0 || isSending}
                  className="w-full"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      발송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {selectedUnits.length}세대 청구서 발송
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 text-center mt-2">
                  선택한 세대에 MMS로 관리비 청구서가 발송됩니다.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </RepLayout>
  );
}