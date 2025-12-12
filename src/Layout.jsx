import React from 'react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --color-primary: #2F6F4F;
          --color-primary-light: #A8C3A0;
          --color-primary-dark: #1E5A3A;
          --color-background: #F8F8F4;
          --color-surface: #FFFFFF;
          --color-text-main: #222222;
          --color-text-sub: #666666;
          --color-border: #E5E5E5;
          --color-success: #1E7C4F;
          --color-danger: #F45B5B;
        }
        
        body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', 'Segoe UI', sans-serif;
          background-color: var(--color-background);
        }
        
        /* Primary Green System */
        .bg-primary { background-color: var(--color-primary); }
        .bg-primary-light { background-color: var(--color-primary-light); }
        .text-primary { color: var(--color-primary); }
        .text-primary-light { color: var(--color-primary-light); }
        .border-primary { border-color: var(--color-primary); }
        
        /* Legacy blue classes mapped to green */
        .bg-blue-50 { background-color: #EDF5F0; }
        .bg-blue-100 { background-color: #D4E8DD; }
        .bg-blue-600 { background-color: var(--color-primary); }
        .bg-blue-700 { background-color: var(--color-primary-dark); }
        .text-blue-600 { color: var(--color-primary); }
        .text-blue-700 { color: var(--color-primary-dark); }
        .border-blue-100 { border-color: #D4E8DD; }
        .border-blue-200 { border-color: #B9D9C6; }
        .border-blue-500 { border-color: var(--color-primary); }
        
        /* Success/Danger */
        .bg-green-50 { background-color: #E8F5ED; }
        .bg-green-100 { background-color: #C3E6CE; }
        .bg-green-600 { background-color: var(--color-success); }
        .bg-green-700 { background-color: #176941; }
        .text-green-600 { color: var(--color-success); }
        .text-green-700 { color: #176941; }
        .border-green-100 { border-color: #C3E6CE; }
        
        .bg-red-50 { background-color: #FEF2F2; }
        .bg-red-100 { background-color: #FECACA; }
        .bg-red-500 { background-color: var(--color-danger); }
        .text-red-500 { color: var(--color-danger); }
        .text-red-600 { color: var(--color-danger); }
        .border-red-100 { border-color: #FECACA; }
        
        /* Supporting colors */
        .bg-yellow-50 { background-color: #FEFCE8; }
        .bg-yellow-100 { background-color: #FEF3C7; }
        .text-yellow-600 { color: #CA8A04; }
        .text-yellow-700 { color: #A16207; }
        .border-yellow-100 { border-color: #FEF3C7; }
        
        .bg-purple-100 { background-color: #f3e8ff; }
        .text-purple-600 { color: #9333ea; }
        .text-purple-700 { color: #7e22ce; }
        
        .bg-orange-100 { background-color: #ffedd5; }
        .text-orange-600 { color: #ea580c; }
        
        .bg-indigo-50 { background-color: #EEF2FF; }
        .bg-indigo-100 { background-color: #e0e7ff; }
        .text-indigo-600 { color: #4f46e5; }
        
        .bg-emerald-100 { background-color: #d1fae5; }
        .text-emerald-600 { color: #059669; }
        
        .bg-rose-100 { background-color: #ffe4e6; }
        .text-rose-600 { color: #e11d48; }
        
        .bg-teal-100 { background-color: #ccfbf1; }
        .text-teal-600 { color: #0d9488; }
        
        .bg-violet-100 { background-color: #ede9fe; }
        .text-violet-600 { color: #7c3aed; }
        
        .bg-cyan-100 { background-color: #cffafe; }
        .text-cyan-600 { color: #0891b2; }
        
        .bg-lime-100 { background-color: #ecfccb; }
        .text-lime-600 { color: #65a30d; }
        
        .bg-amber-100 { background-color: #fef3c7; }
        .text-amber-600 { color: #d97706; }
        
        .bg-slate-100 { background-color: #f1f5f9; }
        .text-slate-600 { color: #475569; }
        
        /* Button styles */
        .btn-primary {
          background-color: var(--color-primary);
          color: white;
          border-radius: 999px;
          font-weight: 600;
          min-height: 44px;
        }
        .btn-primary:hover {
          background-color: var(--color-primary-dark);
        }
        
        /* Card styles */
        .card-rounded {
          border-radius: 20px;
        }
      `}</style>
      {children}
    </div>
  );
}