import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, Save, Calendar, Plus, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepBillingMonthlyEdit() {
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
  
  const [billCycle, setBillCycle] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    loadData();
  }, [buildingId, selectedYearMonth]);

  const loadData = async () => {
    if (!buildingId) return;
    setIsLoadingData(true);
    
    try {
      // Load templates
      const templatesData = await base44.entities.BillItemTemplate.filter({
        building_id: buildingId,
        is_active: true
      });
      setTemplates(templatesData);

      // Load or create bill cycle
      const cycles = await base44.entities.BillCycle.filter({
        building_id: buildingId,
        year_month: selectedYearMonth
      });

      let cycle = cycles[0];
      
      if (!cycle) {
        const [year, month] = selectedYearMonth.split('-').map(Number);
        const dueDay = building?.due_day || 25;
        const dueDate = new Date(year, month - 1, dueDay);
        
        cycle = await base44.entities.BillCycle.create({
          building_id: buildingId,
          year: year,
          month: month,
          year_month: selectedYearMonth,
          due_date: dueDate.toISOString().split('T')[0],
          status: "draft",
          is_locked: false,
          total_amount: 0
        });
      }
      
      setBillCycle(cycle);

      // Load bill items for this cycle
      const items = await base44.entities.BillItem.filter({
        bill_cycle_id: cycle.id
      });

      if (items.length === 0 && templatesData.length > 0) {
        // Auto-create items from templates
        const newItems = [];
        for (const template of templatesData) {
          const item = await base44.entities.BillItem.create({
            bill_cycle_id: cycle.id,
            building_id: buildingId,
            template_id: template.id,
            name: template.name,
            category: template.category,
            amount_total: template.default_amount || 0,
            allocation_method: building?.billing_method || "균등분배",
            type: template.default_type
          });
          newItems.push(item);
        }
        setBillItems(newItems);
      } else {
        setBillItems(items);
      }
      
      setIsLoadingData(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setIsLoadingData(false);
    }
  };

  const handleItemChange = (itemId, field, value) => {
    setBillItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const handleAddItem = async () => {
    try {
      const newItem = await base44.entities.BillItem.create({
        bill_cycle_id: billCycle.id,
        building_id: buildingId,
        name: "새 항목",
        category: "일반관리비",
        amount_total: 0,
        allocation_method: building?.billing_method || "균등분배",
        type: "공용"
      });
      setBillItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await base44.entities.BillItem.delete(itemId);
      setBillItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update all items
      for (const item of billItems) {
        await base44.entities.BillItem.update(item.id, {
          name: item.name,
          category: item.category,
          amount_total: parseFloat(item.amount_total) || 0,
          allocation_method: item.allocation_method,
          type: item.type
        });
      }

      // Update cycle total
      const total = billItems.reduce((sum, item) => sum + (parseFloat(item.amount_total) || 0), 0);
      await base44.entities.BillCycle.update(billCycle.id, {
        total_amount: total
      });

      navigate(createPageUrl(`RepBillingUnitCharges?buildingId=${buildingId}&yearMonth=${selectedYearMonth}`));
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

  const totalAmount = billItems.reduce((sum, item) => sum + (parseFloat(item.amount_total) || 0), 0);

  // Generate year-month options
  const yearMonthOptions = [];
  const now = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    yearMonthOptions.push(ym);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="월별 관리비 입력"
          subtitle="관리비 항목별 금액을 입력합니다"
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
              {billCycle?.status === "sent" && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">발송완료</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bill Items */}
        <div className="space-y-3 mb-6">
          {billItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">항목명</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">금액 (원)</Label>
                        <Input
                          type="number"
                          value={item.amount_total}
                          onChange={(e) => handleItemChange(item.id, 'amount_total', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">분류</Label>
                        <Select 
                          value={item.category} 
                          onValueChange={(v) => handleItemChange(item.id, 'category', v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="일반관리비">일반관리비</SelectItem>
                            <SelectItem value="수선충당금">수선충당금</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">부과 유형</Label>
                        <Select 
                          value={item.type} 
                          onValueChange={(v) => handleItemChange(item.id, 'type', v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="공용">공용</SelectItem>
                            <SelectItem value="세대별">세대별</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">분배 방식</Label>
                        <Select 
                          value={item.allocation_method} 
                          onValueChange={(v) => handleItemChange(item.id, 'allocation_method', v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="균등분배">균등분배</SelectItem>
                            <SelectItem value="면적비례">면적비례</SelectItem>
                            <SelectItem value="세대별차등">세대별차등</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={handleAddItem} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            항목 추가
          </Button>
        </div>

        {/* Total & Actions */}
        <Card className="sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">총 관리비</span>
              <span className="text-2xl font-bold text-blue-600">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
            <div className="flex gap-3">
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
                    저장 후 세대별 확인
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