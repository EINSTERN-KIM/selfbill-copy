import React from 'react';
import { Info } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-center gap-2 text-sm text-amber-800">
      <Info className="w-4 h-4 flex-shrink-0" />
      <span className="break-keep">현재 체험 모드입니다. 실제 저장·발송은 로그인 후 가능합니다.</span>
    </div>
  );
}