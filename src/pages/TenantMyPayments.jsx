import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function TenantMyPayments() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, membership, error } = useBuildingAuth(buildingId, "입주자");
  const [payments, setPayments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!membership?.unit_id) {
        setIsLoadingData(false);
        return;
      }
      
      try {
        const data = await base44.entities.PaymentStatus.filter({ 
          unit_id: membership.unit_id 
        });
        setPayments(data.sort((a, b) => b.year_month.localeCompare(a.year_month)));
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "완납":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "부분납":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "완납":
        return "bg-green-100 text-green-700";
      case "부분납":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  // Calculate summary
  const summary = {
    total: payments.length,
    paid: payments.filter(p => p.status === "완납").length,
    partial: payments.filter(p => p.status === "부분납").length,
    unpaid: payments.filter(p => p.status === "미납").length
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <PageHeader
          title="납부 현황"
          subtitle="월별 관리비 납부 내역"
          backUrl={createPageUrl(`TenantDashboard?buildingId=${buildingId}`)}
        />

        {/* Summary */}
        {payments.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-green-700">{summary.paid}</p>
                <p className="text-xs text-green-600">완납</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-100">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-yellow-700">{summary.partial}</p>
                <p className="text-xs text-yellow-600">부분납</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-red-700">{summary.unpaid}</p>
                <p className="text-xs text-red-600">미납</p>
              </CardContent>
            </Card>
          </div>
        )}

        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="납부 내역이 없습니다"
            description="아직 기록된 납부 내역이 없습니다."
          />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <p className="font-medium text-slate-900">{payment.year_month}</p>
                        <p className="text-sm text-slate-500">
                          청구: {payment.charged_amount?.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                      {payment.paid_amount > 0 && (
                        <p className="text-sm text-slate-600 mt-1">
                          납부: {payment.paid_amount?.toLocaleString()}원
                        </p>
                      )}
                    </div>
                  </div>
                  {payment.paid_at && (
                    <p className="text-xs text-slate-400 mt-2">
                      납부일: {new Date(payment.paid_at).toLocaleDateString()}
                    </p>
                  )}
                  {payment.memo && (
                    <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded">
                      {payment.memo}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}