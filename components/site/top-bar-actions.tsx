interface TopBarActionsProps {
  /** ISO date string (e.g. "2026-04-11") from the doc frontmatter. */
  updatedIso: string
}

/**
 * Renders the "Updated <Mon Day>" label in the top bar. Parses the ISO date
 * string manually so the displayed day never drifts by one due to UTC/local
 * timezone offsets (a bare `new Date("2026-04-11")` is UTC midnight, which is
 * the previous calendar day in any timezone west of UTC).
 */
export function TopBarActions({ updatedIso }: TopBarActionsProps) {
  const label = formatShortDate(updatedIso)

  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-xs text-[var(--text-tertiary)] hidden md:block">
        Updated
        <span className="block font-semibold text-[var(--text-secondary)]">
          {label}
        </span>
      </div>
    </div>
  )
}

function formatShortDate(iso: string): string {
  const dateOnly = iso.split('T')[0]
  const [, monthStr, dayStr] = dateOnly.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthIndex = Number(monthStr) - 1
  const day = Number(dayStr)
  return `${months[monthIndex] ?? ''} ${day}`
}
