import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, CreditCard, Palette, Moon, Sun } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';
import RepLayout from '@/components/common/RepLayout';

export default function RepSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepSettings">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RepLayout>
    );
  }

  if (error) {
    return (
      <RepLayout buildingId={buildingId} building={building} currentPage="RepSettings">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">{error}</p>
            </CardContent>
          </Card>
        </div>
      </RepLayout>
    );
  }

  const monthlyFee = building?.billing_monthly_fee_krw || 0;

  return (
    <RepLayout buildingId={buildingId} building={building} currentPage="RepSettings">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">설정</h1>
          <p className="text-slate-500 dark:text-slate-400">건물 정보 및 이용 요금제를 확인하고 테마를 설정할 수 있습니다</p>
        </div>

        {/* 건물 정보 */}
        <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Building2 className="w-5 h-5 text-primary dark:text-primary-light" />
              건물 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-slate-600 dark:text-slate-400">건물명</Label>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">{building?.name}</p>
              </div>
              <div>
                <Label className="text-sm text-slate-600 dark:text-slate-400">총 세대 수</Label>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">{building?.building_units_count || 0}세대</p>
              </div>
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">주소</Label>
              <p className="text-base text-slate-900 dark:text-slate-100 mt-1">{building?.address} {building?.address_detail}</p>
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">관리비 부과 방식</Label>
              <p className="text-base text-slate-900 dark:text-slate-100 mt-1">{building?.billing_method || '균등 배분'}</p>
            </div>
          </CardContent>
        </Card>

        {/* 이용 요금제 */}
        <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <CreditCard className="w-5 h-5 text-primary dark:text-primary-light" />
              이용 요금제
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">요금 계산 방식</Label>
              <p className="text-base text-slate-900 dark:text-slate-100 mt-1">세대 수 기반 과금</p>
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">월 이용 요금</Label>
              <p className="text-2xl font-bold text-primary dark:text-primary-light mt-1">
                {monthlyFee.toLocaleString()}원 / 월
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                • 현재 등록된 세대 수: <span className="font-semibold">{building?.building_units_count || 0}세대</span>
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                • 세대당 요금: <span className="font-semibold">{building?.building_units_count > 0 ? Math.round(monthlyFee / building.building_units_count).toLocaleString() : 0}원</span>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl(`RepPlan?buildingId=${buildingId}`))}
              className="w-full dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              요금제 상세 정보 보기
            </Button>
          </CardContent>
        </Card>

        {/* 테마 설정 */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Palette className="w-5 h-5 text-primary dark:text-primary-light" />
              테마 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">화면 테마</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {theme === 'light' ? '라이트 모드' : '다크 모드'}가 적용 중입니다
                </p>
              </div>
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="lg"
                className="gap-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5" />
                    다크 모드
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5" />
                    라이트 모드
                  </>
                )}
              </Button>
            </div>
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                • 라이트 모드: 밝은 배경과 어두운 텍스트
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                • 다크 모드: 어두운 배경과 밝은 텍스트
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RepLayout>
  );
}