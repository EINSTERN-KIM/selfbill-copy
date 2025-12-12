import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Receipt, ChevronRight, Calendar } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function TenantMyBills() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, membership, error } = useBuildingAuth(buildingId, "입주자");
  const [charges, setCharges] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!membership?.unit_id) {
        setIsLoadingData(false);
        return;
      }
      
      try {
        const [chargesData, paymentsData] = await Promise.all([
          base44.entities.UnitCharge.filter({ unit_id: membership.unit_id }),
          base44.entities.PaymentStatus.filter({ unit_id: membership.unit_id })
        ]);
        
        setCharges(chargesData.sort((a, b) => b.year_month.localeCompare(a.year_month)));
        setPayments(paymentsData);
        setIsLoadingData(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setIsLoadingData(false);
      }
    }
    
    if (!isLoading) {
      loadData();
    }
  }, [membership, isLoading]);

  if (isLoading || isLoadingData) {
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

  const getPaymentStatus = (chargeId) => {
    return payments.find(p => p.unit_charge_id === chargeId);
  };

  const parseBreakdown = (breakdownJson) => {
    try {
      return JSON.parse(breakdownJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <PageHeader
          title="관리비 청구서"
          subtitle="월별 관리비 청구 내역"
          backUrl={createPageUrl(`TenantDashboard?buildingId=${buildingId}`)}
        />

        {charges.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="청구서가 없습니다"
            description="아직 발송된 관리비 청구서가 없습니다."
          />
        ) : (
          <div className="space-y-4">
            {charges.map((charge) => {
              const payment = getPaymentStatus(charge.id);
              const breakdown = parseBreakdown(charge.breakdown_json);
              const isExpanded = expandedId === charge.id;
              
              return (
                <Card 
                  key={charge.id} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : charge.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{charge.year_month}</span>
                      </div>
                      {payment && (
                        <Badge className={
                          payment.status === "완납" 
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : payment.status === "부분납"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }>
                          {payment.status}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {charge.amount_total?.toLocaleString()}원
                        </p>
                        {charge.late_fee_amount > 0 && (
                          <p className="text-sm text-red-500">
                            연체료: {charge.late_fee_amount?.toLocaleString()}원
                          </p>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>

                    {isExpanded && breakdown.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-slate-700 mb-2">상세 내역</p>
                        <div className="space-y-2">
                          {breakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-slate-600">{item.name}</span>
                              <span className="text-slate-900">{item.amount?.toLocaleString()}원</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isExpanded && building?.bank_name && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">입금 계좌</p>
                        <p className="text-sm text-slate-900">
                          {building.bank_name} {building.bank_account_number}
                        </p>
                        <p className="text-xs text-slate-500">
                          예금주: {building.bank_account_holder}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}