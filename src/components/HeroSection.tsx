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
        className="absolute top-6 left-6 flex items-center gap-[6px] bg-[var(--surface-white)] border border-[var(--surface-elevation)] rounded-full px-2 py-[6px] pointer-events-auto"
        style={{ boxShadow: '0 8px 8px -8px rgba(0,0,0,0.25)' }}
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
      <div className="absolute inset-0 flex items-center justify-center overflow-y-auto py-20 pointer-events-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col items-center gap-10 w-[min(800px,90vw)] pointer-events-none my-auto">

          {/* Hero block: Carl Filer pill + subtitle + contact */}
          <div className="flex flex-col items-center gap-2 w-[min(600px,100%)] select-none" data-entrance="1">
            <div className="bg-[var(--brand-yellow)] rounded-[8px] px-3 py-2">
              <span
                className="font-dm font-medium text-[40px] leading-[0.9] tracking-[-0.8px] text-[var(--surface-black)]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Carl Filer
              </span>
            </div>
            <p
              className="font-dm font-medium text-[40px] leading-none tracking-[-0.8px] text-[var(--surface-black)] text-center"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              is a visual designer crafting impactful, engaging narratives.
            </p>
          </div>

          {/* Contact pills */}
          <div className="flex gap-2 items-center pointer-events-auto" data-entrance="2">
            <a
              href="mailto:carlfiler@me.com"
              className="flex items-center gap-2 bg-[var(--surface-elevation)] rounded-[4px] p-2 cursor-pointer no-underline"
            >
              <img src="/images/icon-mail.svg" alt="" className="w-6 h-6 shrink-0" />
              <span
                className="font-dm font-semibold text-base tracking-[-0.32px] text-[var(--text-gray)] whitespace-nowrap"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                carlfiler@me.com
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/carlfiler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[var(--surface-elevation)] rounded-[4px] p-2 cursor-pointer no-underline"
            >
              <img src="/images/icon-linkedin.svg" alt="LinkedIn" className="w-6 h-6 shrink-0" />
              <span
                className="font-dm font-semibold text-base tracking-[-0.32px] text-[var(--text-gray)] whitespace-nowrap"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
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
      className={`flex gap-6 items-center p-1 rounded-xl transition-colors duration-100 hover:bg-black/[0.04] group w-full md:w-[calc(50%-4px)] pointer-events-auto ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={onSelect ? () => onSelect(study.id) : undefined}
      onMouseEnter={handleMouseEnter}
      data-clickable={onSelect ? '' : undefined}
    >
      <img
        src={study.thumbnailUrl}
        alt={study.title}
        className="w-20 h-20 rounded-lg object-cover shrink-0"
        draggable={false}
      />
      <div className="flex flex-col gap-2 min-w-0">
        {study.comingSoon && (
          <div className="inline-flex items-center bg-[var(--brand-yellow)] rounded-[4px] p-1 self-start">
            <span
              className="font-dm font-medium text-[14px] text-black uppercase leading-[0.9]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Coming soon
            </span>
          </div>
        )}
        <span
          className="font-dm font-medium text-[20px] leading-[0.9] tracking-[-0.2px] text-black"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {study.title}
        </span>
        <span
          className="font-dm font-normal text-[14px] leading-[0.9] tracking-[0.14px] text-[var(--text-gray)]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {study.category} / {study.year}
        </span>
      </div>
    </div>
  )
}
