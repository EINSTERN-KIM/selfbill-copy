import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronLeft, ChevronRight, Calendar, CheckCircle2, X, Triangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';
import TenantLayout from '@/components/common/TenantLayout';

export default function TenantMyPayments() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, membership, error } = useBuildingAuth(buildingId, "입주자");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [unitCharges, setUnitCharges] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate, membership]);

  const loadData = async () => {
    if (!membership?.unit_id) return;
    
    try {
      const yearMonth = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
      
      const [statuses, charges] = await Promise.all([
        base44.entities.PaymentStatus.filter({
          building_id: buildingId,
          unit_id: membership.unit_id,
          year_month: yearMonth
        }),
        base44.entities.UnitCharge.filter({
          building_id: buildingId,
          unit_id: membership.unit_id,
          year_month: yearMonth
        })
      ]);

      setPaymentStatuses(statuses);
      setUnitCharges(charges);
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
      <TenantLayout buildingId={buildingId} building={building} currentPage="TenantMyPayments">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </TenantLayout>
    );
  }

  if (error) {
    return (
      <TenantLayout buildingId={buildingId} building={building} currentPage="TenantMyPayments">
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

  const charge = unitCharges[0];
  const payment = paymentStatuses[0];

  return (
    <TenantLayout buildingId={buildingId} building={building} currentPage="TenantMyPayments">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="납부 현황"
          subtitle="월별 관리비 납부 내역을 확인합니다"
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

        {!charge ? (
          <EmptyState
            icon={AlertCircle}
            title="청구 내역이 없습니다"
            description={`${formatYearMonth(selectedDate)} 관리비 청구 내역이 없습니다.`}
          />
        ) : (
          <>
            {/* Payment Status Card */}
            <Card className={`mb-6 card-rounded border-0 shadow-md ${
              payment?.status === "완납" 
                ? "bg-green-50 border-green-200"
                : payment?.status === "부분납"
                ? "bg-amber-50 border-amber-200"
                : "bg-red-50 border-red-200"
            }`}>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-700">
                    {formatYearMonth(selectedDate)} 납부 현황
                  </span>
                  <div className="flex items-center gap-2">
                    {payment?.status === "완납" && (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <Badge className="bg-green-100 text-green-700">완납</Badge>
                      </>
                    )}
                    {payment?.status === "부분납" && (
                      <>
                        <Triangle className="w-5 h-5 text-amber-600" />
                        <Badge className="bg-amber-100 text-amber-700">부분납</Badge>
                      </>
                    )}
                    {(!payment || payment?.status === "미납") && (
                      <>
                        <X className="w-5 h-5 text-red-600" />
                        <Badge className="bg-red-100 text-red-700">미납</Badge>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">청구 금액</span>
                    <span className="text-lg font-bold text-slate-900">
                      {charge.amount_total?.toLocaleString()}원
                    </span>
                  </div>

                  {payment && payment.paid_amount > 0 && (
                    <div className="flex items-center justify-between py-2 border-t">
                      <span className="text-sm text-slate-600">납부 금액</span>
                      <span className="text-lg font-bold text-green-700">
                        {payment.paid_amount?.toLocaleString()}원
                      </span>
                    </div>
                  )}

                  {payment?.status === "부분납" && (
                    <div className="flex items-center justify-between py-2 border-t">
                      <span className="text-sm text-slate-600">잔액</span>
                      <span className="text-lg font-bold text-red-600">
                        {(charge.amount_total - payment.paid_amount).toLocaleString()}원
                      </span>
                    </div>
                  )}

                  {payment?.paid_at && (
                    <div className="flex items-center justify-between py-2 border-t">
                      <span className="text-sm text-slate-600">납부일</span>
                      <span className="text-sm font-medium text-slate-900">
                        {new Date(payment.paid_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  )}

                  {payment?.memo && (
                    <div className="py-2 border-t">
                      <span className="text-sm text-slate-600 block mb-1">메모</span>
                      <p className="text-sm text-slate-900">{payment.memo}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bank Account Info */}
            {building?.bank_name && (
              <Card className="card-rounded">
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