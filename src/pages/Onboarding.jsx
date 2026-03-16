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

  // 데모 모드에서 로그인한 경우 역할 기반으로 자동 연결
  useEffect(() => {
    if (!user) return;
    const demoRole = sessionStorage.getItem('demoRole');
    if (!demoRole) return;
    sessionStorage.removeItem('demoRole');
    // 이미 멤버십이 있으면 MyBuildings로 (init에서 처리)
    if (demoRole === 'rep') {
      navigate(createPageUrl("BuildingSetupWizard"));
    } else {
      setStep("invite-check");
    }
  }, [user]);

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
      
      // Check existing memberships for this user
      const existingMemberships = await base44.entities.BuildingMember.filter({
        user_email: user.email,
        status: "활성"
      });
      
      // Get building and unit details for each invitation
      const invitationsWithDetails = await Promise.all(
        invitations.map(async (invitation) => {
          const buildings = await base44.entities.Building.filter({ id: invitation.building_id });
          const units = await base44.entities.Unit.filter({ id: invitation.unit_id });
          
          // Check if this specific unit already has an active 입주자 membership for this user
          const existingTenantMembership = existingMemberships.find(m => 
            m.building_id === invitation.building_id && 
            m.unit_id === invitation.unit_id && 
            m.role === "입주자"
          );
          
          // Check if this unit already has an active member from a DIFFERENT account
          const unitMembers = await base44.entities.BuildingMember.filter({
            building_id: invitation.building_id,
            unit_id: invitation.unit_id,
            role: "입주자",
            status: "활성"
          });

          // Block if: different user already registered OR same user already has 입주자 role for this unit
          const isAlreadyUsed = unitMembers.some(m => m.user_id !== user.id) || !!existingTenantMembership;

          return {
            ...invitation,
            buildingName: buildings[0]?.name || '건물명 없음',
            buildingAddress: buildings[0]?.address || '',
            unitName: units[0]?.unit_name || units[0]?.ho || '세대 정보 없음',
            isRegistered: isAlreadyUsed
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

    // Store invitation with correct structure
    sessionStorage.setItem('pendingInvitation', JSON.stringify({
      buildingId: invitation.building_id,
      unitId: invitation.unit_id,
      invitationId: invitation.id
    }));
    navigate(createPageUrl("TenantAdditionalInfo"));
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
                  className="w-full bg-primary text-white hover:bg-primary-dark font-semibold"
                >
                  로그인/회원가입 하기
                </Button>
                <Button
                  onClick={() => window.open('https://ttokbill.framer.website/%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%9D%B4%EC%9A%A9-%EA%B0%80%EC%9D%B4%EB%93%9C', '_blank')}
                  size="lg"
                  variant="outline"
                  className="w-full font-semibold"
                >
                  서비스 이용가이드
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
              <span>·</span>
              <button 
                onClick={() => window.open('https://ttokbill.framer.website/%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%9D%B4%EC%9A%A9-%EA%B0%80%EC%9D%B4%EB%93%9C', '_blank')}
                className="hover:text-slate-700 underline"
              >
                서비스 이용가이드
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