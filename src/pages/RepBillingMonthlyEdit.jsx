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
import { AlertCircle, Loader2, Save, Calendar, Trash2, Plus } from 'lucide-react';
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

      let items = await base44.entities.BillItem.filter({
        bill_cycle_id: cycle.id
      });

      // 템플릿의 기본금액 변경사항을 확인하여 "기본금액"으로 설정된 항목 업데이트
      for (const item of items) {
        if (item.template_id) {
          const template = templatesData.find(t => t.id === item.template_id);
          if (template) {
            // 항목이 템플릿의 기본금액과 일치하면 (사용자가 수정하지 않았다면) 업데이트
            if (item.amount_total === template.default_amount || item.amount_total === 0) {
              await base44.entities.BillItem.update(item.id, {
                amount_total: template.default_amount || 0
              });
              item.amount_total = template.default_amount || 0;
            }
          }
        }
      }

      // 기존 항목이 없으면 템플릿에서 생성
      if (items.length === 0 && templatesData.length > 0) {
        const newItems = [];
        for (const template of templatesData) {
          const [year, month] = selectedYearMonth.split('-').map(Number);
          const shouldInclude = !template.default_months || template.default_months.includes(month);
          
          if (shouldInclude) {
            let itemData = {
              bill_cycle_id: cycle.id,
              building_id: buildingId,
              template_id: template.id,
              name: template.name,
              category: template.category,
              amount_total: template.default_amount || 0,
              type: template.default_type || "공용",
              target_unit_ids: template.default_target_unit_ids || []
            };
            
            // 기타 항목이고 세대별 금액이 설정되어 있으면 그대로 복사
            if (template.category === "기타" && template.default_unit_amounts) {
              itemData.unit_amounts = template.default_unit_amounts;
              // 세대별 금액 합계를 amount_total로 설정
              try {
                const unitAmounts = JSON.parse(template.default_unit_amounts);
                const total = Object.values(unitAmounts).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);
                itemData.amount_total = total;
              } catch (e) {
                console.error("Error parsing unit amounts:", e);
              }
            }
            
            const item = await base44.entities.BillItem.create(itemData);
            newItems.push(item);
          }
        }
        items = newItems;
      } else {
        // 기존 항목이 있어도 새로운 템플릿이 추가되었는지 확인
        const existingTemplateIds = items.map(item => item.template_id).filter(Boolean);
        const newTemplates = templatesData.filter(t => !existingTemplateIds.includes(t.id));
        
        if (newTemplates.length > 0) {
          const [year, month] = selectedYearMonth.split('-').map(Number);
          for (const template of newTemplates) {
            const shouldInclude = !template.default_months || template.default_months.includes(month);
            
            if (shouldInclude) {
              let itemData = {
                bill_cycle_id: cycle.id,
                building_id: buildingId,
                template_id: template.id,
                name: template.name,
                category: template.category,
                amount_total: template.default_amount || 0,
                type: template.default_type || "공용",
                target_unit_ids: template.default_target_unit_ids || []
              };
              
              // 기타 항목이고 세대별 금액이 설정되어 있으면 그대로 복사
              if (template.category === "기타" && template.default_unit_amounts) {
                itemData.unit_amounts = template.default_unit_amounts;
                try {
                  const unitAmounts = JSON.parse(template.default_unit_amounts);
                  const total = Object.values(unitAmounts).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);
                  itemData.amount_total = total;
                } catch (e) {
                  console.error("Error parsing unit amounts:", e);
                }
              }
              
              const newItem = await base44.entities.BillItem.create(itemData);
              items.push(newItem);
            }
          }
        }
      }
      
      // 세대별 항목의 세대별 금액 로드
      const loadedUnitAmounts = {};
      for (const item of items) {
        if (item.type === "세대별" && item.unit_amounts) {
          try {
            loadedUnitAmounts[item.id] = JSON.parse(item.unit_amounts);
          } catch (e) {
            console.error("Error parsing unit_amounts:", e);
          }
        } else if (item.category === "기타" && item.type === "세대별" && item.unit_amounts) {
          // 기타 항목은 템플릿에서 온 금액을 그대로 사용
          try {
            loadedUnitAmounts[item.id] = JSON.parse(item.unit_amounts);
          } catch (e) {
            console.error("Error parsing unit_amounts:", e);
          }
        }
      }
      setUnitAmounts(loadedUnitAmounts);
      
      setBillItems(items);
      
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
        
        // 세대별 항목인 경우 세대별 금액 저장
        if (item.type === "세대별" && unitAmounts[item.id]) {
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

  const generalItems = billItems.filter(item => item.category === "일반");
  const repairItems = billItems.filter(item => item.category === "수선");
  const otherItems = billItems.filter(item => item.category === "기타");

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

        <div className="space-y-6 mb-6">
          {/* 일반관리비 */}
          {generalItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded"></span>
                일반관리비
              </h3>
              <div className="space-y-3">
                {generalItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          {item.type === "세대별" ? (
                            <>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-xs">항목명</Label>
                                  <span className="text-sm font-semibold text-primary">
                                    합계: {(unitAmounts[item.id] ? Object.values(unitAmounts[item.id]).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0) : 0).toLocaleString()}원
                                  </span>
                                </div>
                                <Input value={item.name} disabled className="bg-slate-50" />
                              </div>
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
                                          const newAmount = parseInt(e.target.value) || 0;
                                          setUnitAmounts(prev => ({
                                            ...prev,
                                            [item.id]: { ...prev[item.id], [unit.id]: newAmount }
                                          }));
                                          const updatedAmounts = { ...unitAmounts[item.id], [unit.id]: newAmount };
                                          const total = Object.values(updatedAmounts).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);
                                          handleItemChange(item.id, 'amount_total', total);
                                        }}
                                        className="h-8 flex-1"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">항목명</Label>
                                <Input value={item.name} disabled className="mt-1 bg-slate-50" />
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
                          )}
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
              </div>
            </div>
          )}

          {/* 수선유지비 */}
          {repairItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded"></span>
                수선유지비
              </h3>
              <div className="space-y-3">
                {repairItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          {item.type === "세대별" ? (
                            <>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-xs">항목명</Label>
                                  <span className="text-sm font-semibold text-primary">
                                    합계: {(unitAmounts[item.id] ? Object.values(unitAmounts[item.id]).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0) : 0).toLocaleString()}원
                                  </span>
                                </div>
                                <Input value={item.name} disabled className="bg-slate-50" />
                              </div>
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
                                          const newAmount = parseInt(e.target.value) || 0;
                                          setUnitAmounts(prev => ({
                                            ...prev,
                                            [item.id]: { ...prev[item.id], [unit.id]: newAmount }
                                          }));
                                          const updatedAmounts = { ...unitAmounts[item.id], [unit.id]: newAmount };
                                          const total = Object.values(updatedAmounts).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);
                                          handleItemChange(item.id, 'amount_total', total);
                                        }}
                                        className="h-8 flex-1"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">항목명</Label>
                                <Input value={item.name} disabled className="mt-1 bg-slate-50" />
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
                          )}
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
              </div>
            </div>
          )}

          {/* 기타(세대별) */}
          {otherItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded"></span>
                기타(세대별)
              </h3>
              <div className="space-y-3">
                {otherItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          {item.type === "세대별" ? (
                           <>
                             <div>
                               <div className="flex items-center justify-between mb-2">
                                 <Label className="text-xs">항목명</Label>
                                 <span className="text-sm font-semibold text-primary">
                                   합계: {(unitAmounts[item.id] ? Object.values(unitAmounts[item.id]).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0) : 0).toLocaleString()}원
                                 </span>
                               </div>
                               <Input value={item.name} disabled className="bg-slate-50" />
                             </div>
                             <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                               <Label className="text-xs mb-2 block">세대별 금액 입력</Label>
                               <div className="space-y-2 max-h-60 overflow-y-auto">
                                 {units.filter(u => item.target_unit_ids?.includes(u.id)).map(unit => (
                                   <div key={unit.id} className="flex items-center gap-2">
                                     <span className="text-sm w-32">{unit.unit_name}</span>
                                     <Input
                                       type="number"
                                       placeholder="0"
                                       value={unitAmounts[item.id]?.[unit.id] || 0}
                                       onChange={(e) => {
                                         const newAmount = parseInt(e.target.value) || 0;
                                         setUnitAmounts(prev => ({
                                           ...prev,
                                           [item.id]: { ...prev[item.id], [unit.id]: newAmount }
                                         }));
                                         const updatedAmounts = { ...unitAmounts[item.id], [unit.id]: newAmount };
                                         const total = Object.values(updatedAmounts).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);
                                         handleItemChange(item.id, 'amount_total', total);
                                       }}
                                       className="h-8 flex-1"
                                     />
                                   </div>
                                 ))}
                               </div>
                             </div>
                           </>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">항목명</Label>
                                <Input value={item.name} disabled className="mt-1 bg-slate-50" />
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
                          )}
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
              </div>
            </div>
          )}
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