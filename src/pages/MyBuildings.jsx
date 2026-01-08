import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Plus, MapPin, Users, ChevronRight, AlertCircle, UserPlus, LogOut } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import RoleBadge from '@/components/common/RoleBadge';
import RoleChangeRequestModal from '@/components/common/RoleChangeRequestModal';
import RoleSelectionModal from '@/components/common/RoleSelectionModal';

export default function MyBuildings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buildingsData, setBuildingsData] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestsByBuilding, setRequestsByBuilding] = useState({});
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Get user's memberships - 활성 + 초대중 모두 포함
        const allMemberships = await base44.entities.BuildingMember.list();
        const memberships = allMemberships.filter(
          m => m.user_email === currentUser.email && (m.status === "활성" || m.status === "초대중")
        );

        if (memberships.length === 0) {
          navigate(createPageUrl("Onboarding"));
          return;
        }

        // Get building details for each membership
        const buildingIds = [...new Set(memberships.map(m => m.building_id))];
        const buildings = await base44.entities.Building.list();
        const filteredBuildings = buildings.filter(b => buildingIds.includes(b.id));

        // Group memberships by building
        const buildingRoles = {};
        memberships.forEach(m => {
          if (!buildingRoles[m.building_id]) {
            buildingRoles[m.building_id] = {
              building_id: m.building_id,
              roles: [],
              memberships: []
            };
          }
          buildingRoles[m.building_id].roles.push(m.role);
          buildingRoles[m.building_id].memberships.push(m);
        });

        // Combine data - 건물별로 통합
        const combined = Object.values(buildingRoles).map(br => {
          const building = filteredBuildings.find(b => b.id === br.building_id);
          const hasRepRole = br.roles.includes("대표자");
          const hasTenantRole = br.roles.includes("입주자");
          const hasBothRoles = hasRepRole && hasTenantRole;
          
          return {
            building_id: br.building_id,
            building,
            roles: br.roles,
            memberships: br.memberships,
            hasRepRole,
            hasTenantRole,
            hasBothRoles,
            // 하나의 역할만 가진 경우 그 역할 표시
            primaryRole: hasBothRoles ? null : br.roles[0]
          };
        }).filter(item => item.building);

        setBuildingsData(combined);
        
        // Check for pending role change requests
        if (currentUser && buildingIds.length > 0) {
          const allRequests = await base44.entities.RoleChangeRequest.filter({
            to_user_id: currentUser.id,
            status: "요청"
          });
          
          // 건물별로 요청 매핑
          const requestsMap = {};
          allRequests.forEach(req => {
            requestsMap[req.building_id] = req;
          });
          setRequestsByBuilding(requestsMap);
          
          // 첫 번째 요청을 모달로 표시
          if (allRequests.length > 0) {
            const request = allRequests[0];
            setPendingRequest(request);
            setShowRequestModal(true);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        base44.auth.redirectToLogin();
      }
    }
    loadData();
  }, [navigate]);

  const handleBuildingClick = (item) => {
    const { building, hasRepRole, hasTenantRole, hasBothRoles, primaryRole } = item;
    
    // 두 역할을 모두 가진 경우 역할 선택 모달 표시
    if (hasBothRoles) {
      setSelectedBuilding(building);
      setShowRoleModal(true);
      return;
    }
    
    // 하나의 역할만 가진 경우
    if (hasRepRole) {
      // Check if building setup is incomplete
      if (building.status === "draft" || building.setup_step < 5) {
        navigate(createPageUrl(`BuildingSetupWizard?buildingId=${building.id}`));
        return;
      }
      navigate(createPageUrl(`RepDashboard?buildingId=${building.id}`));
    } else if (hasTenantRole) {
      navigate(createPageUrl(`TenantDashboard?buildingId=${building.id}`));
    }
  };

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await base44.auth.logout();
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
      {/* Role Change Request Modal */}
      {showRequestModal && pendingRequest && (
        <RoleChangeRequestModal
          buildingId={pendingRequest.building_id}
          userId={user?.id}
          onClose={() => setShowRequestModal(false)}
        />
      )}
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">내 공동주택</h1>
            <p className="text-slate-500 mt-1">관리 중인 공동주택 목록</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate(createPageUrl("TenantInviteCheck"))}
              className="border-primary text-primary hover:bg-primary-light hover:text-primary-dark rounded-full px-4 font-semibold"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              입주자 등록
            </Button>
            <Button 
              onClick={() => navigate(createPageUrl("BuildingSetupWizard"))}
              className="bg-primary hover:bg-primary-dark text-white rounded-full px-4 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 건물 등록
            </Button>
          </div>
        </div>

        {/* Building List */}
        {buildingsData.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="등록된 공동주택이 없습니다"
            description="새 공동주택을 등록하거나 초대를 받아 시작하세요."
            actionLabel="새 건물 등록"
            onAction={() => navigate(createPageUrl("BuildingSetupWizard"))}
          />
        ) : (
          <div className="space-y-4">
            {buildingsData.map((item) => (
              <Card 
                key={item.id}
                className="cursor-pointer hover:shadow-xl transition-all group card-rounded border border-slate-200"
                onClick={() => handleBuildingClick(item)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {item.building?.name || "이름 없음"}
                        </h3>
                        <RoleBadge role={item.role} />
                        {item.role === "대표자" && (item.building?.status === "draft" || item.building?.setup_step < 5) && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            초기 설정 미완료
                          </Badge>
                        )}
                        {requestsByBuilding[item.building_id] && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            대표자 변경 요청 있음
                          </Badge>
                        )}
                      </div>
                      {item.building?.address && (
                        <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{item.building.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        {item.building?.building_units_count > 0 ? (
                          <span>입주자 {item.building.building_units_count}세대</span>
                        ) : (
                          <span className="text-slate-400">세대 정보 미등록</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}