import React, { useState, useRef, useCallback } from 'react';

/**
 * useDemoTooltip — 커서 옆 말풍선 훅
 * 사용법:
 *   const { tooltipProps, triggerProps } = useDemoTooltip('설명 텍스트');
 *   <button {...triggerProps('설명')}>...</button>
 *   <DemoTooltipPortal {...tooltipProps} />
 */
export function useDemoTooltip() {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  const show = useCallback((text, e) => {
    const x = e?.clientX ?? 0;
    const y = e?.clientY ?? 0;
    setTooltip({ visible: true, text, x, y });
  }, []);

  const move = useCallback((text, e) => {
    const x = e?.clientX ?? 0;
    const y = e?.clientY ?? 0;
    setTooltip(prev => ({ ...prev, x, y }));
  }, []);

  const hide = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // triggerProps: 버튼/카드에 spread할 이벤트 핸들러를 반환
  const triggerProps = useCallback((text) => ({
    onMouseEnter: (e) => show(text, e),
    onMouseMove:  (e) => move(text, e),
    onMouseLeave: hide,
    // 모바일: 터치 시 잠깐 보여줬다가 숨김
    onTouchStart: (e) => {
      const t = e.touches[0];
      show(text, { clientX: t.clientX, clientY: t.clientY });
      setTimeout(hide, 1800);
    },
  }), [show, move, hide]);

  return { tooltip, triggerProps };
}

/** 실제 말풍선 렌더링 컴포넌트 (Demo 루트에 한 번만 마운트) */
export default function DemoTooltipOverlay({ tooltip }) {
  if (!tooltip.visible || !tooltip.text) return null;

  // 화면 오른쪽 잘림 방지: x가 화면 3/4 이상이면 왼쪽에 표시
  const offsetX = tooltip.x > window.innerWidth * 0.65 ? -160 : 14;
  const offsetY = -36;

  return (
    <div
      className="fixed z-[200] pointer-events-none"
      style={{ left: tooltip.x + offsetX, top: tooltip.y + offsetY }}
    >
      <div className="bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-sm whitespace-nowrap max-w-[200px] break-keep leading-snug">
        {tooltip.text}
        {/* 말풍선 꼬리 */}
        <div
          className="absolute w-2 h-2 bg-slate-900/90 rotate-45"
          style={{ bottom: -4, left: offsetX < 0 ? 'calc(100% - 18px)' : 10 }}
        />
      </div>
    </div>
  );
}