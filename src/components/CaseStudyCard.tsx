import { useRef } from 'react'
import type { CaseStudy } from '../data/caseStudies'

interface Props {
  study: CaseStudy
  onOpen: (study: CaseStudy, cardRect: DOMRect) => void
}

export default function CaseStudyCard({ study, onOpen }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  function handleClick() {
    if (!cardRef.current) return
    onOpen(study, cardRef.current.getBoundingClientRect())
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="relative rounded-card shrink-0 cursor-none"
      style={{
        width: 'clamp(240px, 23vw, 450px)',
        height: 'clamp(140px, 11.5vw, 220px)',
        transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
    >
      {/* Inner clip — keeps overflow hidden without fighting the scale transform */}
      <div className="absolute inset-0 rounded-card overflow-hidden">
        <img
          src={study.thumbnailUrl}
          alt={study.title}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-[rgba(23,23,23,0.6)]" />

        {/* hover highlight */}
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.06] transition-opacity duration-100" />
      </div>
    </div>
  )
}
