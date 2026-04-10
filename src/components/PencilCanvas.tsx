import { useEffect, useRef } from 'react'

interface Props {
  onClearRef: React.MutableRefObject<(() => void) | null>
  onUndoRef: React.MutableRefObject<(() => void) | null>
  onRedoRef: React.MutableRefObject<(() => void) | null>
  onCountChange: (strokeCount: number, redoCount: number) => void
  color: string
  disabled?: boolean
}

const LINE_WIDTH = 8
const NUM_COPIES = 4
const WIGGLE_FPS = 8
const WIGGLE_AMP = 2.0
const MIN_DIST = 2

interface Offset { dx: number; dy: number }
interface StrokePoint { x: number; y: number; offsets: Offset[] }
interface Stroke { color: string; width: number; points: StrokePoint[] }

function makePoint(x: number, y: number): StrokePoint {
  const offsets: Offset[] = []
  for (let c = 0; c < NUM_COPIES; c++) {
    offsets.push({
      dx: (Math.random() - 0.5) * 2 * WIGGLE_AMP,
      dy: (Math.random() - 0.5) * 2 * WIGGLE_AMP,
    })
  }
  return { x, y, offsets }
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, t: number) {
  const pts = stroke.points
  if (pts.length < 2) return
  const ci = Math.floor(t * WIGGLE_FPS) % NUM_COPIES
  ctx.save()
  ctx.strokeStyle = stroke.color
  ctx.lineWidth = stroke.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  const o0 = pts[0].offsets[ci]
  ctx.moveTo(pts[0].x + o0.dx, pts[0].y + o0.dy)
  for (let i = 1; i < pts.length - 1; i++) {
    const oc = pts[i].offsets[ci]
    const on = pts[i + 1].offsets[ci]
    const cx = pts[i].x + oc.dx
    const cy = pts[i].y + oc.dy
    const nx = pts[i + 1].x + on.dx
    const ny = pts[i + 1].y + on.dy
    ctx.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2)
  }
  const oL = pts[pts.length - 1].offsets[ci]
  ctx.lineTo(pts[pts.length - 1].x + oL.dx, pts[pts.length - 1].y + oL.dy)
  ctx.stroke()
  ctx.restore()
}

function ptDist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export default function PencilCanvas({ onClearRef, onUndoRef, onRedoRef, onCountChange, color, disabled = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const disabledRef = useRef(disabled)
  disabledRef.current = disabled
  const colorRef = useRef(color)
  colorRef.current = color

  const strokesRef = useRef<Stroke[]>([])
  const redoStackRef = useRef<Stroke[]>([])
  const activeStrokeRef = useRef<Stroke | null>(null)
  const isDrawingRef = useRef(false)
  const onCountChangeRef = useRef(onCountChange)
  onCountChangeRef.current = onCountChange

  function notifyCounts() {
    onCountChangeRef.current(strokesRef.current.length, redoStackRef.current.length)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx.scale(dpr, dpr)
    }
    resize()

    onClearRef.current = () => {
      strokesRef.current = []
      redoStackRef.current = []
      activeStrokeRef.current = null
      isDrawingRef.current = false
      notifyCounts()
    }

    onUndoRef.current = () => {
      if (strokesRef.current.length === 0) return
      const last = strokesRef.current[strokesRef.current.length - 1]
      strokesRef.current = strokesRef.current.slice(0, -1)
      redoStackRef.current = [...redoStackRef.current, last]
      notifyCounts()
    }

    onRedoRef.current = () => {
      if (redoStackRef.current.length === 0) return
      const last = redoStackRef.current[redoStackRef.current.length - 1]
      redoStackRef.current = redoStackRef.current.slice(0, -1)
      strokesRef.current = [...strokesRef.current, last]
      notifyCounts()
    }

    const startTime = performance.now()
    let rafId: number

    function frame(now: number) {
      const t = (now - startTime) / 1000
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const stroke of strokesRef.current) {
        drawStroke(ctx, stroke, t)
      }
      if (activeStrokeRef.current) {
        drawStroke(ctx, activeStrokeRef.current, t)
      }
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    function isOverInteractive(x: number, y: number): boolean {
      const el = document.elementFromPoint(x, y)
      if (!el) return false
      const interactive = el.closest('button, a, [role="button"], [data-clickable]')
      return interactive !== null
    }

    function updateCursor(x: number, y: number) {
      const overInteractive = isOverInteractive(x, y)
      const cursor = cursorRef.current
      if (cursor) {
        cursor.style.left = (x - 5) + 'px'
        cursor.style.top = (y - 36) + 'px'
        cursor.style.display = overInteractive ? 'none' : 'block'
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (e.target !== canvas || disabledRef.current) return
      isDrawingRef.current = true
      activeStrokeRef.current = {
        color: colorRef.current,
        width: LINE_WIDTH,
        points: [makePoint(e.clientX, e.clientY)],
      }
    }

    function onMouseMove(e: MouseEvent) {
      updateCursor(e.clientX, e.clientY)
      if (!isDrawingRef.current || !activeStrokeRef.current || disabledRef.current) return
      const last = activeStrokeRef.current.points[activeStrokeRef.current.points.length - 1]
      const pos = { x: e.clientX, y: e.clientY }
      if (ptDist(pos, last) > MIN_DIST) {
        activeStrokeRef.current = {
          ...activeStrokeRef.current,
          points: [...activeStrokeRef.current.points, makePoint(pos.x, pos.y)],
        }
      }
    }

    function finishStroke() {
      if (!isDrawingRef.current || !activeStrokeRef.current) return
      isDrawingRef.current = false
      if (activeStrokeRef.current.points.length >= 2) {
        strokesRef.current = [...strokesRef.current, activeStrokeRef.current]
        redoStackRef.current = []
        notifyCounts()
      }
      activeStrokeRef.current = null
    }

    function onMouseUp() { finishStroke() }

    function onMouseEnter() {
      const cursor = cursorRef.current
      if (cursor) cursor.style.display = 'block'
    }

    function onMouseLeave() {
      finishStroke()
      const cursor = cursorRef.current
      if (cursor) cursor.style.display = 'none'
    }

    function onTouchStart(e: TouchEvent) {
      if (e.target !== canvas || disabledRef.current) return
      e.preventDefault()
      const touch = e.touches[0]
      isDrawingRef.current = true
      activeStrokeRef.current = {
        color: colorRef.current,
        width: LINE_WIDTH,
        points: [makePoint(touch.clientX, touch.clientY)],
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!isDrawingRef.current || !activeStrokeRef.current || disabledRef.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const last = activeStrokeRef.current.points[activeStrokeRef.current.points.length - 1]
      const pos = { x: touch.clientX, y: touch.clientY }
      if (ptDist(pos, last) > MIN_DIST) {
        activeStrokeRef.current = {
          ...activeStrokeRef.current,
          points: [...activeStrokeRef.current.points, makePoint(pos.x, pos.y)],
        }
      }
    }

    function onTouchEnd(e: TouchEvent) {
      e.preventDefault()
      finishStroke()
    }

    function onKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 'z' && !e.shiftKey) { onUndoRef.current?.(); e.preventDefault() }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { onRedoRef.current?.(); e.preventDefault() }
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClearRef, onUndoRef, onRedoRef])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ pointerEvents: disabled ? 'none' : 'auto' }}
      />
      <div ref={cursorRef} id="pencil-cursor"><img src="/images/cursor-pencil.svg" alt="" draggable={false} style={{ width: 40, height: 40, objectFit: 'contain' }} /></div>
    </>
  )
}
