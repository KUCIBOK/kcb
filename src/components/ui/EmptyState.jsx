import { Inbox } from 'lucide-react'
import { Button } from './Button'

/**
 * Design System - Empty State Component
 *
 * Displays a centered message with optional icon and action when a list/table has no data.
 *
 * @param {object} props
 * @param {import('lucide-react').LucideIcon} [props.icon=Inbox] - Lucide icon component
 * @param {string} props.title - Primary message
 * @param {string} [props.description] - Secondary description
 * @param {string} [props.actionLabel] - CTA button label
 * @param {function} [props.onAction] - CTA click handler
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="bg-white/[0.03] p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-kcb-pierre" />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-kcb-pierre max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="kcb_outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
