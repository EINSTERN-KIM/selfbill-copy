import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';

const TutorialContext = createContext({
  active: false, step: 0, total: 0, items: [],
  next: () => {}, dismiss: () => {}, register: () => {},
});

export function useTutorial() {
  return useContext(TutorialContext);
}

export function TutorialProvider({ viewKey, autoStart = false, children }) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [items, setItems] = useState([]);

  // 뷰 바뀌면 리셋 (autoStart면 자동 시작)
  useEffect(() => {
    setStep(0);
    setItems([]);
    if (autoStart) setActive(true);
    else setActive(false);
  }, [viewKey]);

  // autoStart가 true로 바뀌면 즉시 시작
  useEffect(() => {
    if (autoStart) setActive(true);
  }, [autoStart]);

  const register = useCallback((newItems) => {
    setItems(newItems);
  }, []);

  const next = useCallback((totalSteps) => {
    setStep(s => {
      const total = totalSteps ?? items.length;
      if (s >= total - 1) {
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
 * SpotlightTutorial
 * - 대상 요소로 자동 스크롤
 * - 말풍선은 스포트라이트 밖(위/아래/화면하단 고정)에 배치
 * - 스포트라이트 영역은 절대 가리지 않음
 */
export function SpotlightTutorial({ steps }) {
  const { active, step, next, dismiss, register } = useTutorial();
  const [rect, setRect] = useState(null);
  const [bubblePos, setBubblePos] = useState(null);

  // steps context 등록
  useEffect(() => {
    if (steps && steps.length > 0) register(steps);
  }, [steps, register]);

  // 현재 step 요소 추적 + 스크롤
  useEffect(() => {
    if (!active || !steps || steps.length === 0) {
      setRect(null);
      setBubblePos(null);
      return;
    }

    const currentStep = steps[step];
    if (!currentStep) return;

    const measure = () => {
      const el = document.querySelector(`[data-tutorial="${currentStep.id}"]`);
      if (!el) {
        setRect(null);
        setBubblePos(null);
        return;
      }

      // 요소가 화면 밖이면 스크롤
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const MARGIN = 80; // 헤더 여백

      if (r.top < MARGIN || r.bottom > vh - MARGIN) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // 스크롤 후 재측정
        setTimeout(() => {
          const r2 = el.getBoundingClientRect();
          updatePositions(r2, vw, vh);
        }, 400);
        return;
      }

      updatePositions(r, vw, vh);
    };

    const updatePositions = (r, vw, vh) => {
      const PADDING = 8;
      const newRect = { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
      setRect(newRect);

      // 말풍선 위치 계산: 스포트라이트 밖에 배치
      const bubbleW = Math.min(300, vw - 32);
      const bubbleH = 150;
      const spotTop    = r.top    - PADDING;
      const spotBottom = r.bottom + PADDING;
      const spaceBelow = vh - spotBottom;
      const spaceAbove = spotTop;

      let top, placement;

      if (spaceBelow >= bubbleH + 20) {
        // 아래에 공간 충분
        top = spotBottom + 12;
        placement = 'below';
      } else if (spaceAbove >= bubbleH + 20) {
        // 위에 공간 충분
        top = spotTop - bubbleH - 12;
        placement = 'above';
      } else {
        // 화면 하단 고정 (스포트라이트 아래를 침범하지 않게)
        top = Math.min(spotBottom + 12, vh - bubbleH - 12);
        // 그래도 스포트라이트와 겹치면 위로 올림
        if (top < spotBottom) top = Math.max(12, spotTop - bubbleH - 12);
        placement = 'fixed';
      }

      // 수평 중앙 정렬 (화면 경계 보정)
      const cx = r.left + r.width / 2;
      let left = cx - bubbleW / 2;
      left = Math.max(16, Math.min(left, vw - bubbleW - 16));

      setBubblePos({ top, left, width: bubbleW, placement, spotTop, spotBottom });
    };

    measure();
    const timer = setTimeout(measure, 150);
    return () => clearTimeout(timer);
  }, [active, step, steps]);

  if (!active || !steps || steps.length === 0) return null;

  const currentStep = steps[step];
  if (!currentStep) return null;

  const PADDING = 8;
  const spotTop    = rect ? rect.top    - PADDING : 0;
  const spotLeft   = rect ? rect.left   - PADDING : 0;
  const spotWidth  = rect ? rect.width  + PADDING * 2 : 0;
  const spotHeight = rect ? rect.height + PADDING * 2 : 0;

  const isBelow = bubblePos?.placement === 'below';

  return (
    <div className="fixed inset-0 z-[200]">
      {/* SVG 마스크 배경 */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={spotLeft} y={spotTop}
                width={spotWidth} height={spotHeight}
                rx="12" fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%" height="100%"
          fill="rgba(0,0,0,0.70)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* 강조 테두리 */}
      {rect && (
        <div
          className="absolute pointer-events-none rounded-xl"
          style={{
            top: spotTop, left: spotLeft,
            width: spotWidth, height: spotHeight,
            boxShadow: '0 0 0 3px #22c55e, 0 0 28px rgba(34,197,94,0.5)',
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 201,
          }}
        />
      )}

      {/* 어두운 영역 클릭 → 닫기 (스포트라이트 제외) */}
      {rect && (
        <>
          {/* 위쪽 */}
          <div className="absolute left-0 right-0" style={{ top: 0, height: spotTop, cursor: 'pointer' }} onClick={dismiss} />
          {/* 아래쪽 */}
          <div className="absolute left-0 right-0" style={{ top: spotTop + spotHeight, bottom: 0, cursor: 'pointer' }} onClick={dismiss} />
          {/* 왼쪽 */}
          <div className="absolute" style={{ top: spotTop, height: spotHeight, left: 0, width: spotLeft, cursor: 'pointer' }} onClick={dismiss} />
          {/* 오른쪽 */}
          <div className="absolute" style={{ top: spotTop, height: spotHeight, left: spotLeft + spotWidth, right: 0, cursor: 'pointer' }} onClick={dismiss} />
        </>
      )}
      {!rect && (
        <div className="absolute inset-0 cursor-pointer" onClick={dismiss} />
      )}

      {/* 말풍선 */}
      {bubblePos && (
        <div
          className="absolute z-[210]"
          style={{
            top: bubblePos.top,
            left: bubblePos.left,
            width: bubblePos.width,
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'all',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* 꼬리 */}
          {rect && (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"
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
                onClick={() => next(steps.length)}
                className="flex-[2] py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {step < steps.length - 1 ? '다음 →' : '완료 ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 호버 툴팁 제거됨 - 하위 호환용 빈 훅 */
export function useDemoTooltip() {
  const triggerProps = useCallback(() => ({}), []);
  return { tooltip: { visible: false, text: '', x: 0, y: 0 }, triggerProps };
}

export default function DemoTooltipOverlay() {
  return null;
}

export function TutorialBubbles() { return null; }