import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

/**
 * 대표자 권한이 박탈된 경우를 체크하는 컴포넌트
 * 대표자 페이지에서 이 컴포넌트를 사용하여 권한을 확인합니다.
 */
export default function RepDashboardCheck({ buildingId, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkRepAuth() {
      if (!buildingId) return;

      try {
        const user = await base44.auth.me();
        const memberships = await base44.entities.BuildingMember.filter({
          building_id: buildingId,
          user_email: user.email,
          status: "활성"
        });

        const hasRepRole = memberships.some(m => m.role === "대표자");
        const hasTenantRole = memberships.some(m => m.role === "입주자");

        // 대표자 권한이 없는 경우
        if (!hasRepRole) {
          alert("대표자 권한이 변경되어 더 이상 이 건물의 대표자가 아닙니다.");
          
          // 입주자 권한이 있으면 입주자 대시보드로, 없으면 건물 목록으로
          if (hasTenantRole) {
            navigate(createPageUrl(`TenantDashboard?buildingId=${buildingId}`));
          } else {
            navigate(createPageUrl("MyBuildings"));
          }
        }
      } catch (err) {
        console.error("Rep auth check error:", err);
      }
    }

    checkRepAuth();
  }, [buildingId, navigate]);

  return children;
}