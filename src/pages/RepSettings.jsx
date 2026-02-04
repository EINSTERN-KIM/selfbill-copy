import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Receipt, Palette } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RepLayout from '@/components/common/RepLayout';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepSettings">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RepLayout>
    );
  }

  if (error || !building) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepSettings">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-500">{error || "건물 정보를 불러올 수 없습니다"}</p>
            </CardContent>
          </Card>
        </div>
      </RepLayout>
    );
  }

  const totalMonthlyFee = building.billing_monthly_fee_krw || 0;

  return (
    <RepLayout buildingId={buildingId} building={building} currentPage="RepSettings">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">설정</h1>
          <p className="text-slate-500 dark:text-slate-400">건물 정보 및 앱 설정을 관리합니다</p>
        </div>

        <div className="space-y-6">
          {/* 건물 정보 */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Building2 className="w-5 h-5 text-primary" />
                건물 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-600 dark:text-slate-400">건물명</Label>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{building.name}</p>
              </div>
              <div>
                <Label className="text-slate-600 dark:text-slate-400">주소</Label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {building.address} {building.address_detail}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600 dark:text-slate-400">총 세대 수</Label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                    {building.building_units_count || 0}세대
                  </p>
                </div>
                <div>
                  <Label className="text-slate-600 dark:text-slate-400">부과 방식</Label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                    {building.billing_method || "균등 배분"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이용 요금 정보 */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Receipt className="w-5 h-5 text-primary" />
                똑빌 이용 요금
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-600 dark:text-slate-400">요금 계산 방식</Label>
                <p className="text-slate-900 dark:text-white mt-1">
                  세대당 월 {(totalMonthlyFee / (building.building_units_count || 1)).toLocaleString()}원
                </p>
              </div>
              <div className="pt-4 border-t dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-600 dark:text-slate-400">총 월 이용료</Label>
                  <p className="text-2xl font-bold text-primary">
                    {totalMonthlyFee.toLocaleString()}원
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  * 현재 {building.building_units_count || 0}세대 기준
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 테마 설정 */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Palette className="w-5 h-5 text-primary" />
                테마 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-900 dark:text-white font-medium">다크 모드</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    어두운 색상 테마를 사용합니다
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RepLayout>
  );
}