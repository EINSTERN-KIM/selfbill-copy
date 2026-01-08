import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useBuildingAuth(buildingId, requiredRole = null) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [building, setBuilding] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [hasRepRole, setHasRepRole] = useState(false);
  const [hasTenantRole, setHasTenantRole] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        setIsLoading(true);
        
        // Get current user
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        if (!buildingId) {
          setIsLoading(false);
          return;
        }

        // Get building
        const buildings = await base44.entities.Building.filter({ id: buildingId });
        if (buildings.length === 0) {
          setError("존재하지 않는 공동주택입니다.");
          setIsLoading(false);
          return;
        }
        setBuilding(buildings[0]);

        // Check all memberships (복수 역할 가능)
        const userMemberships = await base44.entities.BuildingMember.filter({
          building_id: buildingId,
          user_email: currentUser.email,
          status: "활성"
        });

        if (userMemberships.length === 0) {
          setError("이 공동주택에 대한 권한이 없습니다.");
          setIsLoading(false);
          return;
        }

        setMemberships(userMemberships);

        // 역할 플래그 계산
        const hasRep = userMemberships.some(m => m.role === "대표자");
        const hasTenant = userMemberships.some(m => m.role === "입주자");
        
        setHasRepRole(hasRep);
        setHasTenantRole(hasTenant);

        // Check role if required
        if (requiredRole === "대표자" && !hasRep) {
          setError("이 페이지는 대표자만 접근할 수 있습니다.");
          setIsLoading(false);
          return;
        }

        if (requiredRole === "입주자" && !hasTenant) {
          setError("이 페이지는 입주자만 접근할 수 있습니다.");
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Auth error:", err);
        setError("인증 오류가 발생했습니다.");
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [buildingId, requiredRole]);

  return { 
    isLoading, 
    user, 
    building, 
    memberships,
    hasRepRole,
    hasTenantRole,
    error,
    // 하위 호환성을 위한 속성들
    membership: memberships[0],
    isRepresentative: hasRepRole,
    isTenant: hasTenantRole
  };
}