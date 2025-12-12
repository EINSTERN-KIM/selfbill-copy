import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, Users, Receipt, CreditCard, Settings, 
  ChevronRight, AlertCircle, CheckCircle2, Clock,
  FileText, PlusCircle, Send, BarChart3
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, user, building, membership, error } = useBuildingAuth(buildingId, "대표자");
  const [stats, setStats] = useState({
    totalUnits: 0,
    invitedUnits: 0,
    unpaidCount: 0,
    currentMonthTotal: 0
  });
  const [units, setUnits] = useState([]);
  const [billCycles, setBillCycles] = useState([]);

  useEffect(() => {
    async function loadStats() {
      if (!buildingId || isLoading) return;
      
      try {
        // Load units
        const unitsData = await base44.entities.Unit.filter({
          building_id: buildingId,
          status: "active"
        });
        setUnits(unitsData);

        // Load bill cycles
        const cycles = await base44.entities.BillCycle.filter({
          building_id: buildingId
        });
        setBillCycles(cycles);

        // Load payment statuses
        const currentDate = new Date();
        const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        
        const payments = await base44.entities.PaymentStatus.filter({
          building_id: buildingId,
          year_month: yearMonth
        });

        const unpaid = payments.filter(p => p.status === "미납").length;

        // Load current cycle
        const currentCycle = cycles.find(c => c.year_month === yearMonth);

        setStats({
          totalUnits: unitsData.length,
          invitedUnits: unitsData.filter(u => u.tenant_phone).length,
          unpaidCount: unpaid,
          currentMonthTotal: currentCycle?.total_amount || 0
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    }
    loadStats();
  }, [buildingId, isLoading]);

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
            <h2 className="text-lg font-semibold text-slate-900 mb-2">접근 오류</h2>
            <p className="text-slate-500 mb-4">{error}</p>
            <Button onClick={() => navigate(createPageUrl("MyBuildings"))}>
              내 건물 목록으로
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    {
      title: "건물 설정",
      items: [
        { label: "건물 기본정보", icon: Building2, page: "RepBuildingSetup", color: "blue" },
        { label: "관리비 설정", icon: Settings, page: "RepBillingSettings", color: "slate" },
        { label: "입금 계좌", icon: CreditCard, page: "RepBankAccount", color: "green" },
      ]
    },
    {
      title: "세대 관리",
      items: [
        { label: "세대 목록", icon: Users, page: "RepUnits", color: "purple" },
        { label: "입주자 초대", icon: Send, page: "RepUnitsInvite", color: "orange" },
      ]
    },
    {
      title: "관리비 부과",
      items: [
        { label: "관리비 항목", icon: FileText, page: "RepFeeItems", color: "indigo" },
        { label: "월별 관리비 입력", icon: PlusCircle, page: "RepBillingMonthlyEdit", color: "blue" },
        { label: "세대별 청구 확인", icon: Receipt, page: "RepBillingUnitCharges", color: "emerald" },
        { label: "청구서 발송", icon: Send, page: "RepBillingSend", color: "rose" },
      ]
    },
    {
      title: "납부 관리",
      items: [
        { label: "납부 현황 관리", icon: CreditCard, page: "RepPaymentsManage", color: "teal" },
      ]
    },
    {
      title: "리포트",
      items: [
        { label: "전체 관리비 현황", icon: BarChart3, page: "RepReportsTotalFee", color: "violet" },
        { label: "세대별 관리비", icon: Receipt, page: "RepReportsUnitFee", color: "cyan" },
        { label: "세대별 납부 현황", icon: CheckCircle2, page: "RepReportsUnitPayments", color: "lime" },
      ]
    },
    {
      title: "기타",
      items: [
        { label: "요금제 확인", icon: Receipt, page: "RepPlan", color: "amber" },
        { label: "대표자 변경", icon: Users, page: "RepRoleChange", color: "slate" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(createPageUrl("MyBuildings"))}
            className="text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            ← 내 건물 목록
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{building?.name}</h1>
              <p className="text-sm text-slate-500">대표자 관리 화면</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUnits}</p>
                  <p className="text-xs text-slate-500">총 세대</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.invitedUnits}</p>
                  <p className="text-xs text-slate-500">초대 완료</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.unpaidCount}</p>
                  <p className="text-xs text-slate-500">미납 세대</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.currentMonthTotal > 0 ? `${(stats.currentMonthTotal / 10000).toFixed(0)}만` : '-'}
                  </p>
                  <p className="text-xs text-slate-500">이번달 총액</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <Card 
                      key={itemIdx}
                      className="cursor-pointer hover:shadow-md transition-all group"
                      onClick={() => navigate(createPageUrl(`${item.page}?buildingId=${buildingId}`))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${item.color}-600`} />
                          </div>
                          <span className="font-medium text-slate-700 flex-1">{item.label}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}