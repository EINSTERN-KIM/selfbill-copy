import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, Home, Receipt, CreditCard, 
  ChevronRight, AlertCircle, CheckCircle2, Clock,
  FileText
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';
import TenantLayout from '@/components/common/TenantLayout';
import { formatWon } from '@/components/utils/formatters';

export default function TenantDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, user, building, memberships, hasTenantRole, error } = useBuildingAuth(buildingId, "입주자");
  
  // 입주자 멤버십 찾기 (복수 역할 가능하므로 입주자 멤버십만 필터)
  const membership = memberships?.find(m => m.role === "입주자");
  const [unit, setUnit] = useState(null);
  const [latestCharge, setLatestCharge] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!membership?.unit_id || isLoading) return;
      
      try {
        // Load unit info
        const units = await base44.entities.Unit.filter({ id: membership.unit_id });
        if (units.length > 0) {
          setUnit(units[0]);
        }

        // Load latest charge
        const charges = await base44.entities.UnitCharge.filter({
          unit_id: membership.unit_id
        });
        if (charges.length > 0) {
          const sorted = charges.sort((a, b) => b.year_month.localeCompare(a.year_month));
          setLatestCharge(sorted[0]);

          // Load payment status for latest charge
          const payments = await base44.entities.PaymentStatus.filter({
            unit_charge_id: sorted[0].id
          });
          if (payments.length > 0) {
            setPaymentStatus(payments[0]);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }
    loadData();
  }, [membership, isLoading]);

  const getUnitDisplay = () => {
    if (!unit) return "-";
    const parts = [];
    if (unit.floor) parts.push(`${unit.floor}층`);
    if (unit.ho) parts.push(`${unit.ho}호`);
    return parts.length > 0 ? parts.join(" ") : "-";
  };

  const menuItems = [
    { 
      label: "내 세대 정보", 
      icon: Home, 
      page: "TenantMyUnit", 
      color: "blue",
      description: "세대 정보 확인 및 수정"
    },
    { 
      label: "관리비 청구서", 
      icon: Receipt, 
      page: "TenantMyBills", 
      color: "purple",
      description: "월별 관리비 청구서 확인"
    },
    { 
      label: "납부 현황", 
      icon: CreditCard, 
      page: "TenantMyPayments", 
      color: "green",
      description: "납부 내역 조회"
    },
  ];

  if (isLoading) {
    return (
      <TenantLayout buildingId={buildingId} building={building} currentPage="TenantDashboard">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </TenantLayout>
    );
  }

  if (error) {
    return (
      <TenantLayout buildingId={buildingId} building={building} currentPage="TenantDashboard">
        <div className="flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 mb-2">접근 오류</h2>
              <p className="text-slate-500 mb-4">{error}</p>
              <Button onClick={() => navigate(createPageUrl("MyBuildings"))}>
                내 건물 목록으로
              </Button>
            </CardContent>
          </Card>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout buildingId={buildingId} building={building} currentPage="TenantDashboard">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(createPageUrl("MyBuildings"))}
            className="text-sm text-slate-600 hover:text-primary mb-3 flex items-center gap-1 touch-manipulation"
          >
            ← 내 건물 목록
          </button>
          <div className="flex items-center gap-4">
            {building?.building_icon_url ? (
              <img 
                src={building.building_icon_url} 
                alt="건물 아이콘"
                className="w-14 h-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-keep">{building?.name}</h1>
              <p className="text-sm text-slate-600 break-keep">{getUnitDisplay()}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          {/* Primary Card - Current Charge */}
          {latestCharge ? (
            <Card className="card-rounded border-0 shadow-md mb-3 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #2F6F4F 0%, #1E5A3A 100%)' }}>
              <CardContent className="pt-5 pb-5 px-5">
                <div className="relative z-10">
                  <p className="text-white/90 text-sm mb-2">
                    {latestCharge.year_month.split('-')[1]}월 관리비
                  </p>
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-600">
                        {latestCharge.year_month} 관리비 청구서
                      </p>
                      {paymentStatus && (
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          paymentStatus.status === "완납" 
                            ? "bg-green-100 text-green-700"
                            : paymentStatus.status === "부분납"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {paymentStatus.status}
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                      {formatWon(latestCharge.amount_total)}
                    </p>
                    <p className="text-xs text-slate-500">
                      납부 기한: {building?.billing_due_day ? `매월 ${building.billing_due_day}일` : '-'}
                    </p>
                  </div>
                </div>
                <div className="absolute right-4 top-4 opacity-15">
                  <Receipt className="w-20 h-20 text-white" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-3 bg-gradient-to-br from-slate-50 to-slate-100 border-0">
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">아직 발송된 관리비 청구서가 없습니다.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1 break-keep">
            빠른 메뉴
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={idx}
                  className="cursor-pointer hover:shadow-lg transition-all group card-rounded border-0 shadow-sm touch-manipulation"
                  onClick={() => navigate(createPageUrl(`${item.page}?buildingId=${buildingId}`))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 text-${item.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm break-keep">{item.label}</p>
                        <p className="text-xs text-slate-600 mt-0.5 break-keep">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bank Account Info */}
        {building?.bank_name && (
          <Card className="mt-6 card-rounded border-0 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-slate-500 mb-2 font-semibold break-keep">입금 계좌</p>
              <p className="font-semibold text-slate-900 break-keep">
                {building.bank_name} {building.bank_account}
              </p>
              <p className="text-sm text-slate-500 break-keep">
                예금주: {building.bank_holder}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TenantLayout>
  );
}