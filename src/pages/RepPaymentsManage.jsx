import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Home, Calendar, CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepPaymentsManage() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedYearMonth, setSelectedYearMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [units, setUnits] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    status: "미납",
    paid_amount: "",
    memo: ""
  });

  useEffect(() => {
    loadData();
  }, [buildingId, selectedYearMonth]);

  const loadData = async () => {
    if (!buildingId) return;
    setIsLoadingData(true);
    
    try {
      const [unitsData, paymentsData] = await Promise.all([
        base44.entities.Unit.filter({ building_id: buildingId, status: "active" }),
        base44.entities.PaymentStatus.filter({ building_id: buildingId, year_month: selectedYearMonth })
      ]);

      setUnits(unitsData);
      setPayments(paymentsData);
      setIsLoadingData(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setIsLoadingData(false);
    }
  };

  const handleOpenDialog = (payment, unit) => {
    setEditingPayment({ ...payment, unit });
    setFormData({
      status: payment.status || "미납",
      paid_amount: payment.paid_amount || "",
      memo: payment.memo || ""
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const paidAmount = parseFloat(formData.paid_amount) || 0;
      let status = formData.status;
      
      // Auto-determine status based on paid amount
      if (paidAmount >= editingPayment.charged_amount) {
        status = "완납";
      } else if (paidAmount > 0) {
        status = "부분납";
      }

      await base44.entities.PaymentStatus.update(editingPayment.id, {
        status,
        paid_amount: paidAmount,
        paid_at: paidAmount > 0 ? new Date().toISOString() : null,
        memo: formData.memo
      });

      await loadData();
      setShowDialog(false);
    } catch (err) {
      console.error("Error saving:", err);
    }
    setIsSaving(false);
  };

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

  // Generate year-month options
  const yearMonthOptions = [];
  const now = new Date();
  for (let i = -6; i <= 1; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    yearMonthOptions.push(ym);
  }

  const getUnitDisplay = (unit) => {
    return [unit.dong, unit.floor, unit.ho].filter(Boolean).join(" ") || "호수 미입력";
  };

  const getPaymentForUnit = (unitId) => {
    return payments.find(p => p.unit_id === unitId);
  };

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

  // Summary
  const summary = {
    total: payments.length,
    paid: payments.filter(p => p.status === "완납").length,
    partial: payments.filter(p => p.status === "부분납").length,
    unpaid: payments.filter(p => p.status === "미납").length,
    totalAmount: payments.reduce((sum, p) => sum + (p.charged_amount || 0), 0),
    paidAmount: payments.reduce((sum, p) => sum + (p.paid_amount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="납부 현황 관리"
          subtitle="세대별 납부 상태를 관리합니다"
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
        />

        {/* Month Selector */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
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
          </CardContent>
        </Card>

        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="납부 현황이 없습니다"
            description="청구서가 발송된 후 납부 현황이 표시됩니다."
          />
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <Card className="bg-green-50 border-green-100">
                <CardContent className="pt-3 pb-3 text-center">
                  <p className="text-xl font-bold text-green-700">{summary.paid}</p>
                  <p className="text-xs text-green-600">완납</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-100">
                <CardContent className="pt-3 pb-3 text-center">
                  <p className="text-xl font-bold text-yellow-700">{summary.partial}</p>
                  <p className="text-xs text-yellow-600">부분납</p>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-100">
                <CardContent className="pt-3 pb-3 text-center">
                  <p className="text-xl font-bold text-red-700">{summary.unpaid}</p>
                  <p className="text-xs text-red-600">미납</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-3 pb-3 text-center">
                  <p className="text-xl font-bold text-blue-600">
                    {Math.round((summary.paidAmount / summary.totalAmount) * 100) || 0}%
                  </p>
                  <p className="text-xs text-slate-500">수납률</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment List */}
            <div className="space-y-3">
              {units.map((unit) => {
                const payment = getPaymentForUnit(unit.id);
                if (!payment) return null;
                
                return (
                  <Card 
                    key={unit.id} 
                    className="hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleOpenDialog(payment, unit)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="font-medium text-slate-900">{getUnitDisplay(unit)}</p>
                            {unit.tenant_name && (
                              <p className="text-sm text-slate-500">{unit.tenant_name}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {payment.paid_amount?.toLocaleString() || 0} / {payment.charged_amount?.toLocaleString()}원
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                납부 정보 수정 - {editingPayment?.unit && getUnitDisplay(editingPayment.unit)}
              </DialogTitle>
            </DialogHeader>
            
            {editingPayment && (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">청구 금액</span>
                    <span className="font-bold">{editingPayment.charged_amount?.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>납부 상태</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="미납">미납</SelectItem>
                      <SelectItem value="부분납">부분납</SelectItem>
                      <SelectItem value="완납">완납</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>납부 금액</Label>
                  <Input
                    type="number"
                    value={formData.paid_amount}
                    onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>메모</Label>
                  <Textarea
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                    placeholder="납부 관련 메모"
                    rows={2}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                취소
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "저장"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}