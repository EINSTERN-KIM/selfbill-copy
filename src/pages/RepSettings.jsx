import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Building2, Receipt, Palette, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RepLayout from '@/components/common/RepLayout';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error, user } = useBuildingAuth(buildingId, "대표자");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Delete user memberships
      const memberships = await base44.entities.BuildingMember.filter({ 
        user_email: user.email 
      });
      
      for (const membership of memberships) {
        await base44.entities.BuildingMember.delete(membership.id);
      }
      
      // Logout and redirect
      await base44.auth.logout(createPageUrl("Onboarding"));
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("계정 삭제 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
      setIsDeleting(false);
    }
  };

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

          {/* 계정 관리 */}
          <Card className="dark:bg-slate-800 dark:border-slate-700 border-red-200 dark:border-red-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Trash2 className="w-5 h-5" />
                계정 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  계정을 삭제하면 모든 건물 멤버십이 제거되고 앱에 접근할 수 없게 됩니다.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  계정 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 계정을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 모든 건물 멤버십이 제거되며, 다시 초대를 받아야 앱을 사용할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RepLayout>
  );
}