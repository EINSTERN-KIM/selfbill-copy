import React from 'react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --color-primary: #2563eb;
          --color-primary-dark: #1d4ed8;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .bg-blue-100 { background-color: #dbeafe; }
        .bg-blue-600 { background-color: #2563eb; }
        .text-blue-600 { color: #2563eb; }
        .text-blue-700 { color: #1d4ed8; }
        
        .bg-green-100 { background-color: #dcfce7; }
        .bg-green-600 { background-color: #16a34a; }
        .text-green-600 { color: #16a34a; }
        .text-green-700 { color: #15803d; }
        
        .bg-purple-100 { background-color: #f3e8ff; }
        .text-purple-600 { color: #9333ea; }
        
        .bg-orange-100 { background-color: #ffedd5; }
        .text-orange-600 { color: #ea580c; }
        
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
      `}</style>
      {children}
    </div>
  );
}