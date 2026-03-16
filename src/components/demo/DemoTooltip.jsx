import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

/**
 * 게임 튜토리얼 스타일 툴팁 시스템
 * - 페이지 진입 시 반투명 오버레이 + 버튼 위에 말풍선이 모두 보임
 * - 화면 아무 곳이나 탭/클릭하면 오버레이 해제
 * - 이후에는 호버(PC) / 터치(모바일) 시 개별 툴팁만 표시
 */

const TutorialContext = createContext({ active: false, dismiss: () => {} });

export function useTutorial() {
  return useContext(TutorialContext);
}

// 뷰가 바뀔 때마다 새 튜토리얼 컨텍스트를 제공하는 Provider
export function TutorialProvider({ viewKey, children }) {
  const [active, setActive] = useState(true);

  // viewKey(현재 뷰)가 바뀌면 튜토리얼 다시 활성화
  useEffect(() => {
    setActive(true);
  }, [viewKey]);

  const dismiss = useCallback(() => setActive(false), []);

  return (
    <TutorialContext.Provider value={{ active, dismiss }}>
      {/* 오버레이 — 터치/클릭 시 해제 */}
      {active && (
        <div
          className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[1px] cursor-pointer"
          onClick={dismiss}
          onTouchEnd={dismiss}
        >
          {/* 안내 문구 */}
          <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none px-4">
            <div className="bg-white/10 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2">
              <span>👆</span>
              <span>화면을 터치하면 체험을 시작합니다</span>
            </div>
          </div>
        </div>
      )}
      {children}
    </TutorialContext.Provider>
  );
}

/**
 * useDemoTooltip — 개별 버튼 툴팁 훅
 * 튜토리얼 활성 중에는 항목 위에 항상 말풍선을 고정 표시하고,
 * 해제 후에는 호버/터치 시에만 커서 옆 말풍선을 표시
 */
export function useDemoTooltip() {
  const [hoverTooltip, setHoverTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const { active } = useTutorial();

  const show = useCallback((text, e) => {
    if (active) return; // 튜토리얼 중엔 개별 호버 툴팁 무시
    setHoverTooltip({ visible: true, text, x: e?.clientX ?? 0, y: e?.clientY ?? 0 });
  }, [active]);

  const move = useCallback((text, e) => {
    if (active) return;
    setHoverTooltip(prev => ({ ...prev, x: e?.clientX ?? 0, y: e?.clientY ?? 0 }));
  }, [active]);

  const hide = useCallback(() => {
    setHoverTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // triggerProps: 버튼/카드에 spread
  const triggerProps = useCallback((text) => ({
    'data-demo-tip': text,  // 튜토리얼 오버레이가 읽는 속성
    onMouseEnter: (e) => show(text, e),
    onMouseMove:  (e) => move(text, e),
    onMouseLeave: hide,
    onTouchStart: (e) => {
      if (active) return;
      const t = e.touches[0];
      setHoverTooltip({ visible: true, text, x: t.clientX, y: t.clientY });
      setTimeout(hide, 1800);
    },
  }), [show, move, hide, active]);

  return { tooltip: hoverTooltip, triggerProps };
}

/** 커서 옆 말풍선 (튜토리얼 해제 후 호버용) */
export default function DemoTooltipOverlay({ tooltip }) {
  if (!tooltip.visible || !tooltip.text) return null;

  const offsetX = tooltip.x > window.innerWidth * 0.65 ? -160 : 14;
  const offsetY = -36;

  return (
    <div
      className="fixed z-[200] pointer-events-none"
      style={{ left: tooltip.x + offsetX, top: tooltip.y + offsetY }}
    >
      <div className="bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-sm whitespace-nowrap max-w-[200px] break-keep leading-snug">
        {tooltip.text}
        <div
          className="absolute w-2 h-2 bg-slate-900/90 rotate-45"
          style={{ bottom: -4, left: offsetX < 0 ? 'calc(100% - 18px)' : 10 }}
        />
      </div>
    </div>
  );
}

/**
 * TutorialBubble — 튜토리얼 활성 중에 버튼 근처에 고정으로 표시되는 말풍선
 * data-demo-tip 속성을 가진 요소들을 DOM에서 찾아 각각 말풍선을 렌더링
 */
export function TutorialBubbles({ containerRef }) {
  const { active } = useTutorial();
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    if (!active || !containerRef?.current) {
      setBubbles([]);
      return;
    }

    const calculate = () => {
      const els = containerRef.current.querySelectorAll('[data-demo-tip]');
      const results = [];
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const text = el.getAttribute('data-demo-tip');
        if (!text || rect.width === 0) return;
        results.push({
          text,
          top: rect.top + window.scrollY,
          left: rect.left + rect.width / 2,
          bottom: rect.bottom + window.scrollY,
        });
      });
      setBubbles(results);
    };

    calculate();
    // 레이아웃 변화 대응
    const timer = setTimeout(calculate, 100);
    return () => clearTimeout(timer);
  }, [active, containerRef]);

  if (!active || bubbles.length === 0) return null;

  return (
    <>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="fixed z-[160] pointer-events-none"
          style={{ top: b.bottom + 8, left: b.left, transform: 'translateX(-50%)' }}
        >
          <div className="bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap break-keep border border-slate-200 flex items-center gap-1.5">
            <span className="text-primary">💬</span>
            {b.text}
          </div>
          {/* 위쪽 꼬리 */}
          <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-slate-200 rotate-45" />
        </div>
      ))}
    </>
  );
}