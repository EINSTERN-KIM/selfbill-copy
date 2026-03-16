import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';

/**
 * 게임 튜토리얼 스타일 - Spotlight 방식
 * - 한 번에 하나의 요소만 강조
 * - 나머지는 어둡게 + 블러
 * - 말풍선으로 설명
 * - 다음/건너뛰기 버튼
 */

const TutorialContext = createContext({ active: false, step: 0, total: 0, next: () => {}, dismiss: () => {} });

export function useTutorial() {
  return useContext(TutorialContext);
}

export function TutorialProvider({ viewKey, children }) {
  const [active, setActive] = useState(true);
  const [step, setStep] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setActive(true);
    setStep(0);
    setItems([]);
  }, [viewKey]);

  const register = useCallback((newItems) => {
    setItems(newItems);
  }, []);

  const next = useCallback(() => {
    setStep(s => {
      if (s >= items.length - 1) {
        setActive(false);
        return s;
      }
      return s + 1;
    });
  }, [items.length]);

  const dismiss = useCallback(() => setActive(false), []);

  return (
    <TutorialContext.Provider value={{ active, step, total: items.length, items, next, dismiss, register }}>
      {children}
    </TutorialContext.Provider>
  );
}

/**
 * SpotlightTutorial — 등록된 요소들을 순서대로 강조하는 오버레이
 */
export function SpotlightTutorial({ steps }) {
  const { active, step, next, dismiss, register } = useTutorial();
  const [rect, setRect] = useState(null);
  const rafRef = useRef(null);

  // steps를 context에 등록
  useEffect(() => {
    if (steps && steps.length > 0) {
      register(steps);
    }
  }, [steps, register]);

  // 현재 step의 타겟 요소 위치 추적
  useEffect(() => {
    if (!active || !steps || steps.length === 0) {
      setRect(null);
      return;
    }

    const currentStep = steps[step];
    if (!currentStep) return;

    const measure = () => {
      const el = document.querySelector(`[data-tutorial="${currentStep.id}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      } else {
        setRect(null);
      }
    };

    measure();
    // 레이아웃 변화 대응
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [active, step, steps]);

  if (!active || !steps || steps.length === 0) return null;

  const currentStep = steps[step];
  if (!currentStep) return null;

  const PADDING = 8;
  const spotTop    = rect ? rect.top    - PADDING : -999;
  const spotLeft   = rect ? rect.left   - PADDING : -999;
  const spotWidth  = rect ? rect.width  + PADDING * 2 : 0;
  const spotHeight = rect ? rect.height + PADDING * 2 : 0;

  // 말풍선 위치 계산 (화면 밖으로 나가지 않도록)
  const getBubblePosition = () => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bubbleWidth = Math.min(280, vw - 32);
    const bubbleHeight = 130;

    // 아래에 공간이 있으면 아래, 없으면 위
    const spaceBelow = vh - (rect.bottom + PADDING);
    const spaceAbove = rect.top - PADDING;

    let top, left;

    if (spaceBelow >= bubbleHeight + 16) {
      top = rect.bottom + PADDING + 12;
    } else if (spaceAbove >= bubbleHeight + 16) {
      top = rect.top - PADDING - bubbleHeight - 12;
    } else {
      // 중앙 아래
      top = Math.min(rect.bottom + PADDING + 8, vh - bubbleHeight - 16);
    }

    // 수평 위치: 요소 중앙에 맞추되 화면 밖으로 안 나가게
    const centerX = rect.left + rect.width / 2;
    left = centerX - bubbleWidth / 2;
    left = Math.max(16, Math.min(left, vw - bubbleWidth - 16));

    return { top, left, width: bubbleWidth };
  };

  const bubblePos = getBubblePosition();
  const isBelow = rect && bubblePos.top > (rect.bottom ?? 0);

  return (
    <div className="fixed inset-0 z-[200]" style={{ pointerEvents: 'all' }}>
      {/* SVG 마스크 오버레이 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={spotLeft}
                y={spotTop}
                width={spotWidth}
                height={spotHeight}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* 어두운 배경 */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.72)"
          mask="url(#spotlight-mask)"
          style={{ backdropFilter: 'blur(4px)' }}
        />
      </svg>

      {/* 강조 요소 테두리 */}
      {rect && (
        <div
          className="absolute pointer-events-none rounded-xl"
          style={{
            top: spotTop,
            left: spotLeft,
            width: spotWidth,
            height: spotHeight,
            boxShadow: '0 0 0 3px #22c55e, 0 0 24px rgba(34,197,94,0.5)',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      )}

      {/* 클릭 차단 - 강조 영역 제외 */}
      <div
        className="absolute inset-0"
        onClick={dismiss}
        style={{ pointerEvents: rect ? 'none' : 'all' }}
      />

      {/* 말풍선 */}
      <div
        className="absolute z-[210]"
        style={{
          top: bubblePos.top,
          left: bubblePos.left,
          width: bubblePos.width,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 꼬리 */}
        {rect && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-slate-100"
            style={isBelow
              ? { top: -6, borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }
              : { bottom: -6, borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }
            }
          />
        )}

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: steps.length }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? 'bg-white w-5' : i < step ? 'bg-white/60 w-1.5' : 'bg-white/30 w-1.5'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/80 text-xs">{step + 1} / {steps.length}</span>
          </div>

          {/* 내용 */}
          <div className="px-4 py-3">
            <p className="text-xs font-bold text-green-600 mb-0.5">{currentStep.title}</p>
            <p className="text-sm text-slate-700 leading-relaxed break-keep">{currentStep.description}</p>
          </div>

          {/* 버튼 */}
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={dismiss}
              className="flex-1 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              건너뛰기
            </button>
            <button
              onClick={next}
              className="flex-[2] py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {step < steps.length - 1 ? '다음 →' : '시작하기 ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 커서 옆 말풍선 (튜토리얼 해제 후 호버용) */
export function useDemoTooltip() {
  const [hoverTooltip, setHoverTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const { active } = useTutorial();

  const show = useCallback((text, e) => {
    if (active) return;
    setHoverTooltip({ visible: true, text, x: e?.clientX ?? 0, y: e?.clientY ?? 0 });
  }, [active]);

  const move = useCallback((text, e) => {
    if (active) return;
    setHoverTooltip(prev => ({ ...prev, x: e?.clientX ?? 0, y: e?.clientY ?? 0 }));
  }, [active]);

  const hide = useCallback(() => {
    setHoverTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  const triggerProps = useCallback((text) => ({
    'data-demo-tip': text,
    onMouseEnter: (e) => show(text, e),
    onMouseMove: (e) => move(text, e),
    onMouseLeave: hide,
  }), [show, move, hide]);

  return { tooltip: hoverTooltip, triggerProps };
}

export default function DemoTooltipOverlay({ tooltip }) {
  if (!tooltip.visible || !tooltip.text) return null;
  const offsetX = tooltip.x > window.innerWidth * 0.65 ? -180 : 14;
  return (
    <div className="fixed z-[200] pointer-events-none" style={{ left: tooltip.x + offsetX, top: tooltip.y - 36 }}>
      <div className="bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap max-w-[200px] break-keep">
        {tooltip.text}
      </div>
    </div>
  );
}

// 하위 호환성을 위한 빈 컴포넌트
export function TutorialBubbles() { return null; }