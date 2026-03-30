import { useState } from 'react'

interface Props {
  color: string
  onColorChange: (color: string) => void
  strokeCount: number
  redoCount: number
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
}

const COLORS = ['#171717', '#ffdd00', '#19d9ff']

export default function HeroSection({
  color, onColorChange,
  strokeCount, redoCount,
  onUndo, onRedo, onClear,
}: Props) {
  const [contactVisible, setContactVisible] = useState(false)

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* Color palette — top left */}
      <div
        className="absolute top-6 left-6 flex items-center gap-[6px] bg-[var(--surface-white)] border border-[var(--surface-elevation)] rounded-full px-2 py-[6px] pointer-events-auto"
        style={{ boxShadow: '0 8px 8px -8px rgba(0,0,0,0.25)' }}
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
      <div className="absolute top-6 right-6 flex items-center pointer-events-auto">
        <button
          className="ctrl-btn cursor-pointer"
          onClick={onUndo}
          disabled={strokeCount === 0}
          aria-label="Undo"
        >
          <span className="material-icons">undo</span>
        </button>
        <button
          className="ctrl-btn cursor-pointer"
          onClick={onRedo}
          disabled={redoCount === 0}
          aria-label="Redo"
        >
          <span className="material-icons">redo</span>
        </button>
        <button
          className="ctrl-btn cursor-pointer"
          onClick={onClear}
          disabled={strokeCount === 0}
          aria-label="Clear"
        >
          <span className="material-icons">delete</span>
        </button>
      </div>

      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center w-[clamp(320px,52vw,800px)] pointer-events-auto">
          {/* Contact pills */}
          <div
            className="flex gap-2 justify-center overflow-hidden transition-all duration-200 ease-out"
            style={{
              maxHeight: contactVisible ? '60px' : '0px',
              opacity: contactVisible ? 1 : 0,
              marginBottom: contactVisible ? '8px' : '0px',
            }}
          >
            <a
              href="mailto:carlfiler@me.com"
              className="flex items-center gap-2 bg-[#19d9ff] rounded-2xl px-3 py-2 cursor-pointer no-underline"
            >
              <span className="material-icons text-black text-xl">mail</span>
              <span className="font-outfit font-semibold text-[clamp(1rem,2vw,1.5rem)] leading-[0.9] tracking-[-0.06em] text-black">
                carlfiler@me.com
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/carlfiler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#19d9ff] rounded-2xl px-3 py-2 cursor-pointer no-underline"
            >
              <span className="font-outfit font-semibold text-[clamp(1rem,2vw,1.5rem)] leading-[0.9] tracking-[-0.06em] text-black">
                LinkedIn
              </span>
            </a>
          </div>

          {/* Carl Filer button */}
          <button
            onClick={() => setContactVisible(prev => !prev)}
            className="bg-[var(--brand-yellow)] rounded-2xl px-3 py-2 cursor-pointer"
          >
            <span className="font-outfit font-semibold text-[clamp(2rem,4vw,4rem)] leading-[0.9] tracking-[-0.06em] text-black">
              Carl Filer
            </span>
          </button>

          {/* Subtitle */}
          <p className="font-outfit font-medium text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.02em] text-[var(--surface-black)] text-center mt-2">
            is a visual designer, using craft to tell stories and clarify.
          </p>

          {/* Tagline */}
          <p className="font-outfit font-medium text-base leading-[0.9] text-[var(--text-gray)] text-center mt-10">
            Case studies coming soon, for now draw a little something.
          </p>
        </div>
      </div>
    </div>
  )
}
