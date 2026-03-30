import { useEffect, useRef, useState } from 'react'
import type { CaseStudy } from '../data/caseStudies'

interface Props {
  study: CaseStudy
  cardRect: DOMRect
  onClose: () => void
}

type Phase = 'entering' | 'open' | 'exiting' | 'gone'

// Final panel geometry (matches Figma: 40px margins, 24px from top)
const PANEL_MARGIN = 40
const PANEL_TOP = 24

export default function CaseStudyPanel({ study, cardRect, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('entering')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Computed final panel rect
  const panelLeft = PANEL_MARGIN
  const panelTop = PANEL_TOP
  const panelW = window.innerWidth - PANEL_MARGIN * 2
  const panelH = window.innerHeight - PANEL_TOP

  // FLIP: invert transform to make panel appear at card position
  const scaleX = cardRect.width / panelW
  const scaleY = cardRect.height / panelH
  const tx = cardRect.left - panelLeft
  const ty = cardRect.top - panelTop

  const invertedTransform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`
  const identityTransform = `translate(0px, 0px) scale(1, 1)`

  const [transform, setTransform] = useState(invertedTransform)
  const [opacity, setOpacity] = useState(0)

  // Kick off enter animation on next frame
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransform(identityTransform)
        setOpacity(1)
        // Switch to 'open' after transition completes
        const t = setTimeout(() => setPhase('open'), 215)
        return () => clearTimeout(t)
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [identityTransform])

  function handleClose() {
    setPhase('exiting')
    setTransform(invertedTransform)
    setOpacity(0)
    setTimeout(() => {
      setPhase('gone')
      onClose()
    }, 200)
  }

  // Smooth wheel scrolling for the panel
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let rafId: number
    let velocity = 0
    let isAnimating = false

    function animateScroll() {
      if (!el) return
      velocity *= 0.88
      el.scrollTop += velocity
      if (Math.abs(velocity) > 0.5) {
        rafId = requestAnimationFrame(animateScroll)
      } else {
        isAnimating = false
      }
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      velocity += e.deltaY * 0.175
      if (!isAnimating) {
        isAnimating = true
        rafId = requestAnimationFrame(animateScroll)
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <>
      {/* Backdrop — subtle darkening of canvas */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        style={{
          opacity: phase === 'entering' ? opacity : phase === 'exiting' ? opacity : 1,
          transition: 'opacity 150ms ease',
        }}
        onClick={handleClose}
      />

      {/* Panel — outer shell handles transform/animation only, no overflow */}
      <div
        className={`case-panel ${phase === 'entering' || phase === 'open' ? 'case-panel--entering' : 'case-panel--exiting'}`}
        style={{
          left: panelLeft,
          top: panelTop,
          width: panelW,
          height: panelH,
          transform,
          borderRadius: '12px',
          opacity,
        }}
      >
        {/* Inner wrapper: clips content to border-radius, holds background */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#efefef',
          position: 'relative',
        }}>
        {/* Scrollable content */}
        <div ref={scrollRef} className="case-study-scroll w-full h-full">

          {/* ── Case study header (sticky peek area) ──────────────────── */}
          <div className="relative px-[clamp(48px,6.25vw,120px)] pt-[clamp(48px,6.25vw,120px)] pb-20">
            {/* Client tag */}
            <span className="inline-flex items-center px-[10px] py-[6px] bg-[#ffdd00] rounded-[8px] font-quicksand text-[length:var(--text-tag)] text-black leading-none mb-6">
              {study.client}
            </span>

            {/* Title */}
            <h1
              className="font-forum text-[length:var(--text-title)] leading-[0.9] tracking-[-0.02em] text-black mb-4"
              style={{ maxWidth: '660px' }}
            >
              {study.title}
            </h1>

            {/* Subtitle */}
            <p
              className="font-instrument text-[length:var(--text-body-lg)] font-medium leading-[1.2] tracking-[-0.02em] text-[#777]"
              style={{ maxWidth: '660px' }}
            >
              {study.subtitle}
            </p>
          </div>

          {/* ── Hero section: heading + image ─────────────────────────── */}
          <div className="flex items-center gap-[clamp(32px,5vw,80px)] px-[clamp(48px,6.25vw,120px)] py-[clamp(48px,6.25vw,100px)]">
            <div className="flex-1 flex flex-col gap-[clamp(20px,2.5vw,40px)]">
              <h2 className="font-onest text-[length:var(--text-heading)] leading-[1] tracking-[-0.03em] text-[#131514]">
                {study.heroHeading}
              </h2>
              <p className="font-instrument text-[length:var(--text-body-lg)] font-medium leading-[1.2] tracking-[-0.02em] text-[#6f6f6f]">
                {study.heroBody}
              </p>
            </div>
            <div className="flex-1 aspect-square rounded-[clamp(32px,4.2vw,80px)] overflow-hidden">
              <img
                src={study.heroImageUrl}
                alt={study.heroHeading}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* ── Stats row ─────────────────────────────────────────────── */}
          <div className="px-[clamp(48px,6.25vw,120px)] py-[clamp(48px,6.25vw,100px)]">
            <div className="text-center mb-[clamp(32px,4vw,80px)]">
              <h3 className="font-instrument font-semibold text-[length:var(--text-heading)] leading-[1.1] tracking-[-0.02em] text-[#131514]">
                I design brands &amp; products that attract
              </h3>
            </div>
            <div className="flex gap-4">
              {study.stats.map(stat => (
                <div
                  key={stat.label}
                  className="flex-1 flex items-center justify-center bg-[#e3e3e3] rounded-[clamp(24px,3vw,60px)]"
                  style={{ height: 'clamp(120px, 14vw, 275px)' }}
                >
                  <span className="font-instrument font-semibold text-[length:var(--text-heading)] tracking-[-0.02em] text-[#131514] whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Image grid (Z-pattern: wide | tall / square | wide) ───── */}
          <div
            className="px-[clamp(48px,6.25vw,120px)] py-[clamp(48px,6.25vw,100px)] grid gap-4"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, clamp(180px,18vw,360px))' }}
          >
            <div className="col-span-2 rounded-[clamp(24px,3vw,60px)] overflow-hidden">
              <img src={study.images.wide} alt="" className="w-full h-full object-cover" draggable={false} />
            </div>
            <div className="col-span-1 rounded-[clamp(24px,3vw,60px)] overflow-hidden">
              <img src={study.images.tall} alt="" className="w-full h-full object-cover" draggable={false} />
            </div>
            <div className="col-span-1 rounded-[clamp(24px,3vw,60px)] overflow-hidden">
              <img src={study.images.square} alt="" className="w-full h-full object-cover" draggable={false} />
            </div>
            <div className="col-span-2 rounded-[clamp(24px,3vw,60px)] overflow-hidden">
              <img src={study.images.wide2} alt="" className="w-full h-full object-cover" draggable={false} />
            </div>
          </div>

          {/* ── Text block ────────────────────────────────────────────── */}
          <div className="flex justify-center px-[clamp(48px,6.25vw,120px)] py-[clamp(48px,6.25vw,100px)]">
            <div className="flex flex-col gap-4" style={{ maxWidth: '680px' }}>
              <h3 className="font-instrument font-semibold text-[length:var(--text-label)] leading-[1.125] tracking-[-0.02em] text-[#131514]">
                {study.bodyHeading}
              </h3>
              <p className="font-instrument font-medium text-[length:var(--text-body)] leading-[1.4] tracking-[-0.02em] text-[#6f6f6f]">
                {study.bodyText}
              </p>
            </div>
          </div>

          {/* Bottom padding */}
          <div style={{ height: 'clamp(64px, 8vw, 120px)' }} />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-[30px] right-[30px] w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors duration-75 cursor-none z-10"
          aria-label="Close case study"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="#131514" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
        </div>{/* end inner wrapper */}
      </div>
    </>
  )
}
