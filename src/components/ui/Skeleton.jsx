/**
 * Design System - Skeleton Loading Components
 *
 * Provides shimmer-based loading placeholders for content that hasn't loaded yet.
 * Use these instead of spinners for layout-preserving loading states.
 *
 * Components:
 * - Skeleton: Base primitive (rectangle, circle, text line)
 * - SkeletonKPI: KPI card placeholder (matches KPICard layout)
 * - SkeletonTable: Table rows placeholder (matches DataTable layout)
 * - SkeletonCard: Generic card placeholder
 * - SkeletonChart: Chart area placeholder
 */

/**
 * Base skeleton primitive with shimmer animation.
 *
 * @param {object} props
 * @param {'rect'|'circle'|'text'} [props.variant='rect'] - Shape variant
 * @param {string} [props.width] - CSS width (e.g. 'w-24', 'w-full')
 * @param {string} [props.height] - CSS height (e.g. 'h-4', 'h-10')
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export function Skeleton({ variant = 'rect', width = 'w-full', height = 'h-4', className = '' }) {
  const base = 'animate-pulse bg-white/[0.08]'
  const shape = variant === 'circle' ? 'rounded-full' : 'rounded-[4px]'

  return <div className={`${base} ${shape} ${width} ${height} ${className}`} />
}

/**
 * KPI card skeleton — matches KPICard layout exactly.
 *
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export function SkeletonKPI({ className = '' }) {
  return (
    <div className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="rect" width="w-10" height="h-10" />
          <Skeleton variant="rect" width="w-16" height="h-5" />
        </div>
        <Skeleton width="w-24" height="h-8" className="mb-2" />
        <Skeleton width="w-32" height="h-4" />
      </div>
    </div>
  )
}

/**
 * Table skeleton — renders N placeholder rows.
 *
 * @param {object} props
 * @param {number} [props.rows=5] - Number of skeleton rows
 * @param {number} [props.cols=4] - Number of columns per row
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export function SkeletonTable({ rows = 5, cols = 4, className = '' }) {
  return (
    <div
      className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden ${className}`}
    >
      <div className="animate-pulse">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} width={i === 0 ? 'w-1/3' : 'w-1/5'} height="h-4" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} width={j === 0 ? 'w-1/3' : 'w-1/5'} height="h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Generic card skeleton.
 *
 * @param {object} props
 * @param {boolean} [props.hasImage=false] - Whether to show an image placeholder
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export function SkeletonCard({ hasImage = false, className = '' }) {
  return (
    <div
      className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden ${className}`}
    >
      <div className="animate-pulse">
        {hasImage && <Skeleton width="w-full" height="h-48" className="rounded-none" />}
        <div className="p-4 space-y-3">
          <Skeleton width="w-3/4" height="h-5" />
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-1/2" height="h-4" />
        </div>
      </div>
    </div>
  )
}

/**
 * Chart area skeleton.
 *
 * @param {object} props
 * @param {string} [props.height='h-64'] - Chart height
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export function SkeletonChart({ height = 'h-64', className = '' }) {
  return (
    <div className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 ${className}`}>
      <div className="animate-pulse">
        <Skeleton width="w-40" height="h-5" className="mb-4" />
        <div className={`${height} flex items-end gap-2`}>
          {[40, 65, 50, 80, 60, 75, 45, 90, 55, 70, 85, 50].map((h, i) => (
            <Skeleton key={i} width="w-full" height={`h-[${h}%]`} className="flex-1 min-w-0" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Skeleton
