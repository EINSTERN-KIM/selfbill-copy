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
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Plus, Loader2, FileText, Trash2, Edit2, GripVertical } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepFeeItems() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "일반관리비",
    default_amount: "",
    default_type: "공용",
    is_active: true
  });

  useEffect(() => {
    loadTemplates();
  }, [buildingId]);

  const loadTemplates = async () => {
    if (!buildingId) return;
    try {
      const data = await base44.entities.BillItemTemplate.filter({
        building_id: buildingId
      });
      setTemplates(data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      setIsLoadingTemplates(false);
    } catch (err) {
      console.error("Error loading templates:", err);
      setIsLoadingTemplates(false);
    }
  };

  const handleOpenDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name || "",
        category: template.category || "일반관리비",
        default_amount: template.default_amount || "",
        default_type: template.default_type || "공용",
        is_active: template.is_active !== false
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        category: "일반관리비",
        default_amount: "",
        default_type: "공용",
        is_active: true
      });
    }
    setShowDialog(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saveData = {
        ...formData,
        building_id: buildingId,
        default_amount: formData.default_amount ? parseFloat(formData.default_amount) : 0,
        sort_order: editingTemplate ? editingTemplate.sort_order : templates.length
      };

      if (editingTemplate) {
        await base44.entities.BillItemTemplate.update(editingTemplate.id, saveData);
      } else {
        await base44.entities.BillItemTemplate.create(saveData);
      }
      
      await loadTemplates();
      setShowDialog(false);
    } catch (err) {
      console.error("Error saving template:", err);
    }
    setIsSaving(false);
  };

  const handleDelete = async (templateId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await base44.entities.BillItemTemplate.delete(templateId);
      await loadTemplates();
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  const handleToggleActive = async (template) => {
    try {
      await base44.entities.BillItemTemplate.update(template.id, {
        is_active: !template.is_active
      });
      await loadTemplates();
    } catch (err) {
      console.error("Error toggling template:", err);
    }
  };

  if (isLoading || isLoadingTemplates) {
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

  const categoryColors = {
    "일반관리비": "bg-blue-100 text-blue-700",
    "수선충당금": "bg-orange-100 text-orange-700",
    "기타": "bg-slate-100 text-slate-700"
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="관리비 항목"
          subtitle="매월 부과할 관리비 항목을 설정합니다"
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
          actions={
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              항목 추가
            </Button>
          }
        />

        {templates.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="등록된 관리비 항목이 없습니다"
            description="관리비 항목을 추가하여 매월 부과할 항목을 정의하세요."
            actionLabel="항목 추가"
            onAction={() => handleOpenDialog()}
          />
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className={`hover:shadow-md transition-all ${!template.is_active ? 'opacity-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-300">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900">{template.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[template.category]}`}>
                            {template.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            template.default_type === "공용" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                          }`}>
                            {template.default_type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          기본 금액: {template.default_amount?.toLocaleString() || 0}원
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.is_active !== false}
                        onCheckedChange={() => handleToggleActive(template)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(template)}
                      >
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "항목 수정" : "항목 추가"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>항목명 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 공용전기료, 수선충당금"
                />
              </div>

              <div className="space-y-2">
                <Label>분류</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="일반관리비">일반관리비</SelectItem>
                    <SelectItem value="수선충당금">수선충당금</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>부과 유형</Label>
                <Select
                  value={formData.default_type}
                  onValueChange={(value) => setFormData({ ...formData, default_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="공용">공용 (전체 세대에 분배)</SelectItem>
                    <SelectItem value="세대별">세대별 (개별 입력)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>기본 금액 (원)</Label>
                <Input
                  type="number"
                  value={formData.default_amount}
                  onChange={(e) => setFormData({ ...formData, default_amount: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>활성화</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                취소
              </Button>
              <Button onClick={handleSave} disabled={!formData.name || isSaving}>
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