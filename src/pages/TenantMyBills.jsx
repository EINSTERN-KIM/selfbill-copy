import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronLeft, ChevronRight, Receipt, Calendar } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';
import TenantLayout from '@/components/common/TenantLayout';

export default function TenantMyBills() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, membership, error } = useBuildingAuth(buildingId, "입주자");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [unitCharge, setUnitCharge] = useState(null);
  const [billCycle, setBillCycle] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [unit, setUnit] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate, membership]);

  const loadData = async () => {
    if (!membership?.unit_id) return;
    
    try {
      const yearMonth = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
      
      const [charges, cycles, items, units] = await Promise.all([
        base44.entities.UnitCharge.filter({
          building_id: buildingId,
          unit_id: membership.unit_id,
          year_month: yearMonth
        }),
        base44.entities.BillCycle.filter({
          building_id: buildingId,
          year_month: yearMonth
        }),
        base44.entities.BillItem.filter({
          building_id: buildingId
        }),
        base44.entities.Unit.filter({
          id: membership.unit_id
        })
      ]);

      // 같은 달에 여러 청구서가 있을 경우 가장 최신 것만 표시
      const sortedCharges = charges.sort((a, b) => 
        new Date(b.sent_at || b.created_date) - new Date(a.sent_at || a.created_date)
      );
      setUnitCharge(sortedCharges[0] || null);
      setBillCycle(cycles[0] || null);
      setBillItems(items.filter(item => {
        const cycleMatch = cycles[0] && item.bill_cycle_id === cycles[0].id;
        return cycleMatch;
      }));
      setUnit(units[0] || null);
      setIsLoadingData(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setIsLoadingData(false);
    }
  };

  const changeMonth = (delta) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  const formatYearMonth = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  if (isLoading || isLoadingData) {
    return (
      <TenantLayout buildingId={buildingId} building={building} currentPage="TenantMyBills">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </TenantLayout>
    );
  }

  if (error) {
    return (
      <TenantLayout buildingId={buildingId} building={building} currentPage="TenantMyBills">
        <div className="flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-slate-500">{error}</p>
            </CardContent>
          </Card>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout buildingId={buildingId} building={building} currentPage="TenantMyBills">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="나의 관리비 청구서"
          subtitle="월별 관리비 청구 내역을 확인합니다"
          backUrl={createPageUrl(`TenantDashboard?buildingId=${buildingId}`)}
        />

        {/* Month Selector */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeMonth(-1)}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-slate-900">{formatYearMonth(selectedDate)}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeMonth(1)}
            className="rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {!unitCharge || !billCycle ? (
          <EmptyState
            icon={Receipt}
            title="청구서가 없습니다"
            description={`${formatYearMonth(selectedDate)} 관리비 청구서가 아직 발행되지 않았습니다.`}
          />
        ) : (
          <>
            {/* Summary Card */}
            <Card className="mb-6 bg-gradient-to-br from-primary-light/20 to-primary/10 border-primary-light card-rounded border-0 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-primary font-semibold mb-2">
                    {unitCharge.year_month} 관리비
                  </p>
                  <p className="text-4xl font-bold text-slate-900 tracking-tight">
                    {unitCharge.amount_total?.toLocaleString()}<span className="text-2xl text-slate-600">원</span>
                  </p>
                  {(() => {
                    const unit = membership?.unit_id ? base44.entities.Unit.filter({ id: membership.unit_id }).then(u => u[0]) : null;
                    return null;
                  })()}
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">부과 기간</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {building?.billing_period_start && building?.billing_period_end
                        ? `${building.billing_period_start}일~${building.billing_period_end}일`
                        : '-'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">납기일</p>
                    <p className="text-sm font-medium text-primary mt-1">
                      {billCycle.due_date ? new Date(billCycle.due_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) + '까지' : '-'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">납기후 금액</p>
                    <p className="text-sm font-medium text-amber-600 mt-1">
                      {unitCharge.after_due_amount?.toLocaleString() || 0}원
                    </p>
                  </div>
                </div>
                {unitCharge.late_fee_amount > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-center text-slate-500">
                      연체 시 연체료 {unitCharge.late_fee_amount?.toLocaleString()}원 ({building?.late_fee_rate_percent || 0}%)이 추가됩니다
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items List */}
            <Card className="card-rounded">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>항목별 내역</CardTitle>
                  {unit?.share_ratio !== null && unit?.share_ratio !== undefined && (
                    <Badge className="bg-primary-light text-primary">
                      지분율: {unit.share_ratio}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  let breakdown = [];
                  if (unitCharge?.breakdown_json) {
                    try {
                      breakdown = JSON.parse(unitCharge.breakdown_json);
                    } catch (e) {
                      console.error("Error parsing breakdown:", e);
                    }
                  }
                  
                  if (breakdown.length === 0) {
                    return <p className="text-center text-slate-500 py-4">항목 정보가 없습니다.</p>;
                  }
                  
                  return (
                    <div className="space-y-3">
                      {breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="font-semibold text-slate-900">
                            {item.amount?.toLocaleString()}원
                          </p>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-4 border-t-2">
                        <p className="font-bold text-slate-900">합계</p>
                        <p className="text-2xl font-bold text-primary">
                          {unitCharge.amount_total?.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Bank Info */}
            {building?.bank_name && (
              <Card className="mt-6 card-rounded">
                <CardHeader>
                  <CardTitle className="text-base">입금 계좌 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">은행</span>
                    <span className="font-medium text-slate-900">{building.bank_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">예금주</span>
                    <span className="font-medium text-slate-900">{building.bank_holder}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">계좌번호</span>
                    <span className="font-medium text-slate-900">{building.bank_account}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </TenantLayout>
  );
}