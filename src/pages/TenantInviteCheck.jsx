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

export default function TenantInviteCheck() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [checkingInvite, setCheckingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");

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
      // Search for invitation by phone
      const invitations = await base44.entities.Invitation.filter({
        tenant_phone: invitePhone,
        status: "초대 발송"
      });
      
      if (invitations.length === 0) {
        setInviteError("해당 번호로 발송된 초대장을 찾을 수 없습니다.");
        setCheckingInvite(false);
        return;
      }
      
      const invitation = invitations[0];
      
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
      setInviteError("초대 확인 중 오류가 발생했습니다.");
    }
    
    setCheckingInvite(false);
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
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-900">셀프빌</span>
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
      </div>
    </div>
  );
}