import { useRef } from 'react'
import type { CaseStudy } from '../data/caseStudies'
import { preloadCaseStudyImages } from './CaseStudyPanel'


interface Props {
  studies: CaseStudy[]
  color: string
  onColorChange: (color: string) => void
  strokeCount: number
  redoCount: number
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onSelectStudy: (id: string) => void
}

const COLORS = ['#171717', '#ffdd00', '#19d9ff']

export default function HeroSection({
  studies,
  color, onColorChange,
  strokeCount, redoCount,
  onUndo, onRedo, onClear,
  onSelectStudy,
}: Props) {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none">

      {/* Color palette — top left */}
      <div
        className="absolute top-6 left-6 flex items-center gap-[6px] bg-[var(--surface-white)] rounded-full px-2 py-[6px] pointer-events-auto"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06), 0 2px 4px 0 rgba(0,0,0,0.04)' }}
        data-entrance="4"
      >
        {COLORS.map(c => (
          <button
            key={c}
            className={`swatch cursor-pointer ${color === c ? 'active' : ''}`}
            data-color={c}
            style={{ background: c }}
            onClick={() => onColorChange(c)}
            aria-label={c}
          />
        ))}
      </div>

      {/* Controls — top right */}
      <div className="absolute top-6 right-6 flex items-center pointer-events-auto" data-entrance="4">
        <button className="ctrl-btn cursor-pointer" onClick={onUndo} disabled={strokeCount === 0} aria-label="Undo">
          <span className="material-icons">undo</span>
        </button>
        <button className="ctrl-btn cursor-pointer" onClick={onRedo} disabled={redoCount === 0} aria-label="Redo">
          <span className="material-icons">redo</span>
        </button>
        <button className="ctrl-btn cursor-pointer" onClick={onClear} disabled={strokeCount === 0} aria-label="Clear">
          <span className="material-icons">delete</span>
        </button>
      </div>

      {/* Centered content — matches Figma: 800px wide, vertically centered */}
      <div className="absolute inset-0 flex items-center justify-center overflow-y-auto py-20 pointer-events-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain">
        <div className="flex flex-col items-center w-[min(800px,90vw)] pointer-events-none my-auto shrink-0">

          {/* Hero headline */}
          <p
            className="mb-6 font-domine font-normal text-[24px] leading-[1.4] tracking-[-0.48px] text-[var(--surface-black)] text-center text-balance select-none"
            data-entrance="1"
          >
            Carl Filer is a visual designer crafting impactful, engaging narratives.
          </p>

          {/* Contact pills */}
          <div className="mb-10 md:mb-20 flex gap-2 items-center pointer-events-auto" data-entrance="2">
            <a
              href="mailto:carlfiler@me.com"
              className="flex items-center gap-2 bg-[var(--button-gray)] hover:bg-[var(--surface-elevation)] rounded-[4px] pl-[8px] pr-[12px] py-[8px] cursor-pointer no-underline transition-all duration-150 ease-out active:scale-[0.96]"
            >
              <img src="/images/icon-mail.svg" alt="" className="w-6 h-6 shrink-0" />
              <span className="font-inter font-medium text-[14px] leading-none tracking-[-0.28px] text-[var(--surface-black)] whitespace-nowrap">
                carlfiler@me.com
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/carlfiler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[var(--button-gray)] hover:bg-[var(--surface-elevation)] rounded-[4px] pl-[8px] pr-[12px] py-[8px] cursor-pointer no-underline transition-all duration-150 ease-out active:scale-[0.96]"
            >
              <img src="/images/icon-linkedin.svg" alt="LinkedIn" className="w-6 h-6 shrink-0" />
              <span className="font-inter font-medium text-[14px] leading-none tracking-[-0.28px] text-[var(--surface-black)] whitespace-nowrap">
                LinkedIn
              </span>
            </a>
          </div>

          {/* Case studies — 2-col flex-wrap, stacks at tablet */}
          <div className="flex flex-wrap gap-2 w-full" data-entrance="3">
            {studies.map(study => (
              <CaseStudyItem key={study.id} study={study} onSelect={study.hasPage ? onSelectStudy : undefined} />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function CaseStudyItem({ study, onSelect }: { study: CaseStudy; onSelect?: (id: string) => void }) {
  const preloadedRef = useRef(false)

  function handleMouseEnter() {
    if (onSelect && !preloadedRef.current) {
      preloadedRef.current = true
      preloadCaseStudyImages()
    }
  }

  return (
    <div
      className={`flex gap-6 items-center p-1 rounded-xl transition-all duration-150 ease-out hover:bg-black/[0.04] active:scale-[0.96] group w-full md:w-[calc(50%-4px)] pointer-events-auto ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={onSelect ? () => onSelect(study.id) : undefined}
      onMouseEnter={handleMouseEnter}
      data-clickable={onSelect ? '' : undefined}
    >
      <img
        src={study.thumbnailUrl}
        alt={study.title}
        className="w-20 h-20 rounded-lg object-cover shrink-0 outline outline-1 -outline-offset-1 outline-black/10"
        draggable={false}
      />
      <div className="flex flex-col gap-2 min-w-0">
        {study.comingSoon && (
          <div className="inline-flex items-center bg-[var(--brand-yellow)] rounded-[4px] p-1 self-start">
            <span className="font-inter font-semibold text-[10px] text-[var(--surface-black)] uppercase leading-none">
              Coming soon
            </span>
          </div>
        )}
        <span className="font-inter font-medium text-[16px] leading-none tracking-[-0.48px] text-[var(--surface-black)]">
          {study.title}
        </span>
        <span className="font-inter font-medium text-[12px] leading-none tracking-[-0.24px] text-[var(--text-gray)]">
          {study.category}
        </span>
      </div>
    </div>
  )
}
