import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ArrowLeft, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function BuildingCreate() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    address_detail: ""
  });

  useEffect(() => {
    async function init() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsLoading(false);
      } catch (err) {
        base44.auth.redirectToLogin();
      }
    }
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Create building with initial values
      const building = await base44.entities.Building.create({
        ...formData,
        status: "active",
        building_units_count: 0,
        billing_unit_count: 0,
        billing_amount_per_unit: 990,
        billing_monthly_fee_krw: 0,
        plan_type: "basic"
      });

      // Create BuildingMember for current user as representative
      await base44.entities.BuildingMember.create({
        building_id: building.id,
        user_id: user.id,
        user_email: user.email,
        role: "대표자",
        is_primary_representative: true,
        status: "활성"
      });

      // Navigate to rep dashboard
      navigate(createPageUrl(`RepDashboard?buildingId=${building.id}`));
    } catch (err) {
      console.error("Error creating building:", err);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </button>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">새 공동주택 등록</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              관리할 공동주택 정보를 입력해주세요
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  공동주택 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="예: 행복빌라 101동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  placeholder="예: 서울시 강남구 테헤란로 123"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_detail">상세 주소</Label>
                <Input
                  id="address_detail"
                  placeholder="예: A동 전체"
                  value={formData.address_detail}
                  onChange={(e) => setFormData({ ...formData, address_detail: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.name || isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      등록 중...
                    </>
                  ) : (
                    "등록하기"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}