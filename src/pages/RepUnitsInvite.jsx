import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Send, Home, Phone, Check, Clock, UserPlus } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useBuildingAuth } from '@/components/common/useBuildingAuth';

export default function RepUnitsInvite() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildingId = urlParams.get('buildingId');
  const navigate = useNavigate();
  
  const { isLoading, building, error } = useBuildingAuth(buildingId, "대표자");
  const [units, setUnits] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sendingInvite, setSendingInvite] = useState(null);

  useEffect(() => {
    loadData();
  }, [buildingId]);

  const loadData = async () => {
    if (!buildingId) return;
    try {
      const [unitsData, invitationsData] = await Promise.all([
        base44.entities.Unit.filter({ building_id: buildingId, status: "active" }),
        base44.entities.Invitation.filter({ building_id: buildingId })
      ]);
      
      setUnits(unitsData);
      setInvitations(invitationsData);
      setIsLoadingData(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setIsLoadingData(false);
    }
  };

  const getInvitationForUnit = (unitId) => {
    return invitations.find(inv => inv.unit_id === unitId);
  };

  const handleSendInvite = async (unit) => {
    if (!unit.tenant_phone || unit.tenant_phone.includes("--")) {
      alert("입주자 휴대폰 번호가 등록되지 않았습니다. 세대 목록에서 먼저 등록해주세요.");
      return;
    }

    setSendingInvite(unit.id);
    
    try {
      const existingInvite = getInvitationForUnit(unit.id);
      const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      if (existingInvite) {
        await base44.entities.Invitation.update(existingInvite.id, {
          status: "초대 발송",
          invite_code: inviteCode,
          invited_at: new Date().toISOString()
        });
      } else {
        await base44.entities.Invitation.create({
          building_id: buildingId,
          unit_id: unit.id,
          tenant_name: unit.tenant_name || "",
          tenant_phone: unit.tenant_phone,
          status: "초대 발송",
          invite_code: inviteCode,
          invited_at: new Date().toISOString()
        });
      }

      // Create notification log
      await base44.entities.NotificationLog.create({
        building_id: buildingId,
        type: "입주자초대",
        to_phone: unit.tenant_phone,
        to_name: unit.tenant_name || "",
        message_content: `[${building?.name}] 관리비 앱 초대\n\n안녕하세요, ${unit.tenant_name || "입주자"}님.\n셀프빌 앱에 초대되었습니다.\n\n아래 링크를 통해 가입해주세요.`,
        status: "성공",
        reference_id: unit.id,
        reference_type: "Unit",
        sent_at: new Date().toISOString()
      });

      await loadData();
    } catch (err) {
      console.error("Error sending invite:", err);
    }
    
    setSendingInvite(null);
  };

  if (isLoading || isLoadingData) {
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

  const getStatusBadge = (unit) => {
    const invitation = getInvitationForUnit(unit.id);
    
    if (!unit.tenant_phone || unit.tenant_phone.includes("--")) {
      return <Badge variant="outline" className="text-slate-400">번호 미등록</Badge>;
    }
    
    if (!invitation || invitation.status === "초대 전") {
      return <Badge variant="outline" className="text-slate-500">초대 전</Badge>;
    }
    
    if (invitation.status === "초대 발송") {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          초대 발송
        </Badge>
      );
    }
    
    if (invitation.status === "가입 완료") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <Check className="w-3 h-3 mr-1" />
          가입 완료
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="입주자 초대"
          subtitle="세대별 입주자를 초대합니다"
          backUrl={createPageUrl(`RepDashboard?buildingId=${buildingId}`)}
        />

        {units.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="등록된 세대가 없습니다"
            description="먼저 세대 목록에서 세대를 등록해주세요."
            actionLabel="세대 목록으로"
            onAction={() => navigate(createPageUrl(`RepUnits?buildingId=${buildingId}`))}
          />
        ) : (
          <div className="space-y-3">
            {units.map((unit) => {
              const invitation = getInvitationForUnit(unit.id);
              const canInvite = unit.tenant_phone && !unit.tenant_phone.includes("--") && invitation?.status !== "가입 완료";
              
              return (
                <Card key={unit.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Home className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-900">
                              {[unit.dong, unit.floor, unit.ho].filter(Boolean).join(" ")}
                            </p>
                            {getStatusBadge(unit)}
                          </div>
                          {unit.tenant_name && (
                            <p className="text-sm text-slate-500">
                              {unit.tenant_name}
                              {unit.tenant_phone && !unit.tenant_phone.includes("--") && (
                                <span className="ml-2 text-slate-400">{unit.tenant_phone}</span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      {canInvite && (
                        <Button
                          size="sm"
                          onClick={() => handleSendInvite(unit)}
                          disabled={sendingInvite === unit.id}
                        >
                          {sendingInvite === unit.id ? (
                            "발송 중..."
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-1" />
                              {invitation?.status === "초대 발송" ? "재발송" : "초대 발송"}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}