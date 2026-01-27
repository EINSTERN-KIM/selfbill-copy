import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BuildingInviteSelectionModal from '@/components/common/BuildingInviteSelectionModal';

export default function TenantInviteCheck() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsLoading(false);
      } catch (err) {
        base44.auth.redirectToLogin();
      }
    }
    init();
  }, []);

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
          
          // Check if this unit already has an active member (any account with this phone)
          const unitMembers = await base44.entities.BuildingMember.filter({
            building_id: invitation.building_id,
            unit_id: invitation.unit_id,
            status: "활성"
          });
          
          const isAlreadyUsed = unitMembers.length > 0;
          
          return {
            ...invitation,
            buildingName: buildings[0]?.name || '건물명 없음',
            buildingAddress: buildings[0]?.address || '',
            unitName: units[0]?.unit_name || units[0]?.ho || '세대 정보 없음',
            isRegistered: existingBuildingIds.includes(invitation.building_id) || isAlreadyUsed,
            invitePhone: invitePhone
          };
        })
      );
      
      // Filter out unregistered invitations
      const unregisteredInvitations = invitationsWithDetails.filter(inv => !inv.isRegistered);
      
      if (unregisteredInvitations.length === 0) {
        setInviteError("이미 모든 건물에 등록되어 있습니다.");
        setCheckingInvite(false);
        return;
      }
      
      if (invitationsWithDetails.length === 1 && !invitationsWithDetails[0].isRegistered) {
        // Single unregistered invitation - proceed directly
        await handleSelectInvitation(invitationsWithDetails[0]);
      } else {
        // Multiple invitations - show selection modal
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
      // Store invitation data and navigate to additional info page
      sessionStorage.setItem('pendingInvitation', JSON.stringify({
        invitationId: invitation.id,
        buildingId: invitation.building_id,
        unitId: invitation.unit_id,
        invitePhone: invitation.invitePhone
      }));
      
      navigate(createPageUrl("TenantAdditionalInfo"));
    } catch (err) {
      console.error("Select error:", err);
      setInviteError("선택 처리 중 오류가 발생했습니다.");
      setCheckingInvite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center">
        <LoadingSpinner text="확인 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6955621ae58823aa6ee78811/43a1bd447__260126_IMG__byW.png" 
              alt="똑빌 로고"
              className="h-16"
            />
          </div>
          <p className="text-slate-600">입주자 초대 확인</p>
        </div>

        <Card className="card-rounded">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  초대 확인
                </h2>
                <p className="text-slate-500 text-sm">
                  대표자로부터 초대 문자를 받으신 휴대폰 번호를 입력해주세요.
                </p>
              </div>
            </div>

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

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl("MyBuildings"))}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  뒤로
                </Button>
                <Button
                  onClick={handleCheckInvite}
                  disabled={checkingInvite || !phone1 || !phone2 || !phone3}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white"
                >
                  {checkingInvite ? "확인 중..." : "초대 확인"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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