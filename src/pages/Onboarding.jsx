import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, Shield, ArrowRight, Check, LogOut } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PhoneInput from '@/components/common/PhoneInput';
import BuildingInviteSelectionModal from '@/components/common/BuildingInviteSelectionModal';

export default function Onboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState("select"); // select, invite-check
  const [selectedRole, setSelectedRole] = useState(null);
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [checkingInvite, setCheckingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [showBuildingSelection, setShowBuildingSelection] = useState(false);
  const [availableInvitations, setAvailableInvitations] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const isAuthenticated = await base44.auth.isAuthenticated();
        
        if (!isAuthenticated) {
          // 비로그인 상태: 공개 온보딩 페이지 표시
          setIsLoading(false);
          return;
        }
        
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Check if user already has memberships
        const memberships = await base44.entities.BuildingMember.filter({
          user_email: currentUser.email,
          status: "활성"
        });
        
        if (memberships.length > 0) {
          navigate(createPageUrl("MyBuildings"));
          return;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Onboarding init error:", err);
        setIsLoading(false);
      }
    }
    init();
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === "대표자") {
      navigate(createPageUrl("BuildingSetupWizard"));
    } else {
      setStep("invite-check");
    }
  };

  const handleCheckInvite = async () => {
    // Validate phone format
    if (!phone1 || !phone2 || !phone3) {
      alert("전화번호를 모두 입력해주세요.");
      return;
    }
    
    if (phone1.length < 3 || phone2.length !== 4 || phone3.length !== 4) {
      alert("올바른 전화번호 형식으로 입력해주세요. (예: 010-1234-5678)");
      return;
    }
    
    const invitePhone = `${phone1}-${phone2}-${phone3}`;
    
    setCheckingInvite(true);
    setInviteError("");
    
    try {
      // Search for all invitations by phone
      const invitations = await base44.entities.Invitation.filter({
        tenant_phone: invitePhone,
        status: "초대 발송"
      });
      
      if (invitations.length === 0) {
        setInviteError("해당 번호로 발송된 초대장을 찾을 수 없습니다.");
        setCheckingInvite(false);
        return;
      }
      
      // Check which buildings the user is already a member of
      const existingMemberships = await base44.entities.BuildingMember.filter({
        user_email: user.email,
        status: "활성"
      });
      
      const existingBuildingIds = existingMemberships.map(m => m.building_id);
      
      // Get building and unit details for each invitation
      const invitationsWithDetails = await Promise.all(
        invitations.map(async (invitation) => {
          const buildings = await base44.entities.Building.filter({ id: invitation.building_id });
          const units = await base44.entities.Unit.filter({ id: invitation.unit_id });
          
          // Check if this unit already has an active member from a DIFFERENT account
          const unitMembers = await base44.entities.BuildingMember.filter({
            building_id: invitation.building_id,
            unit_id: invitation.unit_id,
            status: "활성"
          });

          // Allow same user to be both 대표자 and 입주자, but block different users
          const isAlreadyUsed = unitMembers.length > 0 && unitMembers.some(m => m.user_id !== user.id);

          return {
            ...invitation,
            buildingName: buildings[0]?.name || '건물명 없음',
            buildingAddress: buildings[0]?.address || '',
            unitName: units[0]?.unit_name || units[0]?.ho || '세대 정보 없음',
            isRegistered: existingBuildingIds.includes(invitation.building_id) || isAlreadyUsed
          };
          })
          );

          // Always show the modal if there are any invitations
          if (invitationsWithDetails.length === 1 && !invitationsWithDetails[0].isRegistered) {
          // Single unregistered invitation - proceed directly
          await handleSelectInvitation(invitationsWithDetails[0]);
          } else {
          // Show selection modal for all cases (multiple invitations or registered buildings)
          setAvailableInvitations(invitationsWithDetails);
          setShowBuildingSelection(true);
          setCheckingInvite(false);
          }
    } catch (err) {
      console.error("Invite check error:", err);
      setInviteError("초대 확인 중 오류가 발생했습니다.");
      setCheckingInvite(false);
    }
  };

  const handleSelectInvitation = async (invitation) => {
    if (invitation.isRegistered) {
      return;
    }
    
    setShowBuildingSelection(false);
    setCheckingInvite(true);
    
    try {
      // Create BuildingMember
      await base44.entities.BuildingMember.create({
        building_id: invitation.building_id,
        user_id: user.id,
        user_email: user.email,
        role: "입주자",
        unit_id: invitation.unit_id,
        status: "활성"
      });
      
      // Update invitation status
      await base44.entities.Invitation.update(invitation.id, {
        status: "가입 완료",
        accepted_at: new Date().toISOString()
      });
      
      navigate(createPageUrl("MyBuildings"));
    } catch (err) {
      console.error("Join error:", err);
      setInviteError("가입 처리 중 오류가 발생했습니다.");
      setCheckingInvite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner text="확인 중..." />
      </div>
    );
  }

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      base44.auth.logout(createPageUrl("Onboarding"));
    }
  };

  const handleGoogleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl("Onboarding"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logout Button - 로그인 상태일 때만 표시 */}
        {user && (
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png" 
              alt="똑빌 로고"
              className="h-16"
            />
          </div>
          <p className="text-slate-600">공동주택 관리비 자동화 서비스</p>
        </div>

        {/* 비로그인 상태: 서비스 소개 + 구글 로그인 */}
        {!user && (
          <div className="space-y-6">
            <Card className="card-rounded">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  똑빌에 오신 것을 환영합니다
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  공동주택 관리비 청구와 납부 현황을 투명하게 관리하세요.
                  <br />
                  대표자와 입주자가 함께 사용하는 관리비 자동화 플랫폼입니다.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-left">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">간편한 청구서 작성</p>
                      <p className="text-sm text-slate-600">항목별 관리비를 자동으로 계산하고 청구서를 생성합니다</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">투명한 납부 관리</p>
                      <p className="text-sm text-slate-600">세대별 납부 현황을 실시간으로 확인하고 관리합니다</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">편리한 소통</p>
                      <p className="text-sm text-slate-600">입주자들과 관리비 정보를 손쉽게 공유합니다</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  size="lg"
                  className="w-full bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-semibold mb-3"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  구글 계정으로 계속하기
                </Button>

                <Button
                  onClick={() => base44.auth.redirectToLogin(createPageUrl("Onboarding"), { mode: 'signup' })}
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-primary text-primary hover:bg-primary-light/20 font-semibold"
                >
                  이메일로 가입하기
                </Button>
                </CardContent>
                </Card>

            {/* Terms and Privacy Links */}
            <div className="flex justify-center gap-4 text-xs text-slate-500">
              <button 
                onClick={() => window.open(createPageUrl("Terms"), '_blank')}
                className="hover:text-slate-700 underline"
              >
                이용약관
              </button>
              <span>·</span>
              <button 
                onClick={() => window.open(createPageUrl("Privacy"), '_blank')}
                className="hover:text-slate-700 underline"
              >
                개인정보처리방침
              </button>
            </div>
          </div>
        )}

        {/* 로그인 상태: 역할 선택 */}
        {user && step === "select" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
              똑빌 시작하기
            </h2>

            {/* Terms and Privacy Links */}
            <div className="flex justify-center gap-4 mb-6 text-xs text-slate-500">
              <button 
                onClick={() => window.open(createPageUrl("Terms"), '_blank')}
                className="hover:text-slate-700 underline"
              >
                이용약관
              </button>
              <span>·</span>
              <button 
                onClick={() => window.open(createPageUrl("Privacy"), '_blank')}
                className="hover:text-slate-700 underline"
              >
                개인정보처리방침
              </button>
            </div>
            
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary card-rounded"
              onClick={() => handleRoleSelect("대표자")}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">새로운 공동주택을 등록할 대표자입니다</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      내가 관리하는 공동주택을 처음 똑빌에 등록합니다.
                      건물 정보, 세대, 관리비 항목을 설정하고 관리할 수 있습니다.
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-300 flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary card-rounded"
              onClick={() => handleRoleSelect("입주자")}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">이미 대표자에게 초대받은 입주자입니다</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      대표자가 보내준 초대 정보를 통해 입주자로 연결합니다.
                      나의 관리비 청구서와 납부 현황을 확인할 수 있습니다.
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-300 flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user && step === "invite-check" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                초대 확인
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                대표자로부터 초대 문자를 받으신 휴대폰 번호를 입력해주세요.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>휴대폰 번호 *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={phone1}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setPhone1(val);
                      }}
                      className="w-20"
                      placeholder="010"
                    />
                    <span>-</span>
                    <Input
                      type="text"
                      value={phone2}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPhone2(val);
                      }}
                      className="w-24"
                      placeholder="1234"
                    />
                    <span>-</span>
                    <Input
                      type="text"
                      value={phone3}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPhone3(val);
                      }}
                      className="w-24"
                      placeholder="5678"
                    />
                  </div>
                </div>

                {inviteError && (
                  <p className="text-sm text-red-500">{inviteError}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("select")}
                    className="flex-1"
                  >
                    뒤로
                  </Button>
                  <Button
                    onClick={handleCheckInvite}
                    disabled={checkingInvite || !phone1 || !phone2 || !phone3}
                    className="flex-1"
                  >
                    {checkingInvite ? "확인 중..." : "초대 확인"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Building Selection Modal */}
        <BuildingInviteSelectionModal
          isOpen={showBuildingSelection}
          onClose={() => setShowBuildingSelection(false)}
          invitations={availableInvitations}
          onSelect={handleSelectInvitation}
        />
      </div>
    </div>
  );
}