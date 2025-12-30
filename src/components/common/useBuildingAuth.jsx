import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useBuildingAuth(buildingId, requiredRole = null) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [building, setBuilding] = useState(null);
  const [membership, setMembership] = useState(null);
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

        // Check membership
        const memberships = await base44.entities.BuildingMember.filter({
          building_id: buildingId,
          user_email: currentUser.email,
          status: "활성"
        });

        if (memberships.length === 0) {
          setError("이 공동주택에 대한 권한이 없습니다.");
          setIsLoading(false);
          return;
        }

        // If requiredRole is specified, find membership with that role
        let member;
        if (requiredRole) {
          member = memberships.find(m => m.role === requiredRole);
          if (!member) {
            setError(`이 페이지는 ${requiredRole}만 접근할 수 있습니다.`);
            setIsLoading(false);
            return;
          }
        } else {
          member = memberships[0];
        }

        setMembership(member);

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
    membership, 
    error,
    isRepresentative: membership?.role === "대표자",
    isTenant: membership?.role === "입주자"
  };
}