import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          navigate(createPageUrl('MyBuildings'));
        } else {
          navigate(createPageUrl('Onboarding'));
        }
      } catch (err) {
        console.error('Auth check error:', err);
        navigate(createPageUrl('Onboarding'));
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500">로딩 중...</div>
    </div>
  );
}