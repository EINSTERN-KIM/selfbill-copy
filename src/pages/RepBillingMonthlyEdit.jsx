import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Loader2, Save, Calendar, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';
import RepLayout from '@/components/common/RepLayout';

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
  const [units, setUnits] = useState([]);
  const [unitAmounts, setUnitAmounts] = useState({}); // itemId -> { unitId: amount }

  useEffect(() => {
    loadData();
  }, [buildingId, selectedYearMonth]);

  const loadData = async () => {
    if (!buildingId) return;
    setIsLoadingData(true);
    
    try {
      const [templatesData, unitsData] = await Promise.all([
        base44.entities.BillItemTemplate.filter({ building_id: buildingId }),
        base44.entities.Unit.filter({ building_id: buildingId, status: "active" })
      ]);
      
      setTemplates(templatesData);
      setUnits(unitsData);

      const cycles = await base44.entities.BillCycle.filter({
        building_id: buildingId,
        year_month: selectedYearMonth
      });

      let cycle = cycles[0];
      
      if (!cycle) {
        const [year, month] = selectedYearMonth.split('-').map(Number);
        cycle = await base44.entities.BillCycle.create({
          building_id: buildingId,
          year: year,
          month: month,
          year_month: selectedYearMonth,
          status: "draft",
          is_locked: false,
          total_amount: 0
        });
      }
      
      setBillCycle(cycle);

      const items = await base44.entities.BillItem.filter({
        bill_cycle_id: cycle.id
      });

      if (items.length === 0 && templatesData.length > 0) {
        const newItems = [];
        for (const template of templatesData) {
          const item = await base44.entities.BillItem.create({
            bill_cycle_id: cycle.id,
            building_id: buildingId,
            template_id: template.id,
            name: template.name,
            category: template.category,
            amount_total: template.amount_type === "고정" ? (template.default_amount || 0) : 0,
            type: template.default_type || "공용",
            target_unit_ids: []
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

  const toggleUnitSelection = (itemId, unitId) => {
    setBillItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const targetIds = item.target_unit_ids || [];
      const hasUnit = targetIds.includes(unitId);
      return {
        ...item,
        target_unit_ids: hasUnit 
          ? targetIds.filter(id => id !== unitId)
          : [...targetIds, unitId]
      };
    }));
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
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
      for (const item of billItems) {
        const updateData = {
          name: item.name,
          category: item.category,
          amount_total: parseFloat(item.amount_total) || 0,
          type: item.type,
          target_unit_ids: item.target_unit_ids || []
        };
        
        // 변동항목인 경우 세대별 금액 저장
        const templateType = getTemplateType(item.id);
        if (templateType === "변동" && unitAmounts[item.id]) {
          updateData.unit_amounts = JSON.stringify(unitAmounts[item.id]);
        }
        
        await base44.entities.BillItem.update(item.id, updateData);
      }

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
      <RepLayout buildingId={buildingId} building={building} currentPage="RepBillingMonthlyEdit">
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RepLayout>
    );
  }

  if (error) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepBillingMonthlyEdit">
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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

  const totalAmount = billItems.reduce((sum, item) => sum + (parseFloat(item.amount_total) || 0), 0);

  const yearMonthOptions = [];
  const now = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    yearMonthOptions.push(ym);
  }

  const getTemplateType = (itemId) => {
    const item = billItems.find(i => i.id === itemId);
    if (!item?.template_id) return null;
    const template = templates.find(t => t.id === item.template_id);
    return template?.amount_type;
  };

  return (
    <RepLayout buildingId={buildingId} building={building} currentPage="RepBillingMonthlyEdit">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">월별 관리비 입력</h1>
          <p className="text-slate-500">관리비 항목별 금액을 입력합니다</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
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
          </CardContent>
        </Card>

        <div className="space-y-3 mb-6">
          {billItems.map((item) => {
            const templateType = getTemplateType(item.id);
            const isFixed = templateType === "고정";
            const isVariable = templateType === "변동";
            
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">항목명</Label>
                          <Input
                            value={item.name}
                            disabled
                            className="mt-1 bg-slate-50"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">
                            금액 (원) {isFixed && <span className="text-slate-500">(고정)</span>}
                          </Label>
                          <Input
                            type="number"
                            value={item.amount_total}
                            onChange={(e) => handleItemChange(item.id, 'amount_total', e.target.value)}
                            disabled={isFixed}
                            className={`mt-1 ${isFixed ? 'bg-slate-50' : ''}`}
                          />
                        </div>
                      </div>

                      {isVariable && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <Label className="text-xs mb-2 block">세대별 금액 입력</Label>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {units.map(unit => (
                              <div key={unit.id} className="flex items-center gap-2">
                                <span className="text-sm w-32">{unit.unit_name}</span>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={unitAmounts[item.id]?.[unit.id] || 0}
                                  onChange={(e) => {
                                    setUnitAmounts(prev => ({
                                      ...prev,
                                      [item.id]: {
                                        ...prev[item.id],
                                        [unit.id]: parseInt(e.target.value) || 0
                                      }
                                    }));
                                  }}
                                  className="h-8 flex-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {!isFixed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">총 관리비</span>
              <span className="text-2xl font-bold text-primary">
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
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
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
    </RepLayout>
  );
}