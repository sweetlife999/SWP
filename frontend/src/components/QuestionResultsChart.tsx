import type { AnswerStat } from '../lib/api'

interface QuestionResultsChartProps {
  stats: AnswerStat[]
}

const SLICE_COLORS = [
  'var(--accent)',
  'var(--info)',
  'var(--purple)',
  'var(--warn)',
  'var(--danger)',
  'var(--accent-600)',
]

const SIZE = 120
const RADIUS = SIZE / 2
// The circle is drawn with r = RADIUS / 2 and strokeWidth = RADIUS (a ring
// thick enough to fill the disc, turning it into a pie). The dash math must
// use that same drawn radius, not the outer RADIUS, or slices past 50% wrap
// all the way around and paint over the rest of the chart.
const CIRCLE_R = RADIUS / 2
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R

export function QuestionResultsChart({ stats }: QuestionResultsChartProps) {
  const total = stats.reduce((sum, s) => sum + s.count, 0)

  if (total === 0) {
    return <p className="text-muted" style={{ fontSize: 13 }}>Нет данных</p>
  }

  const slices = stats.reduce<{ cum: number; items: { dash: number; dashoffset: number }[] }>(
    (acc, stat) => {
      const dash = (stat.pct / 100) * CIRCUMFERENCE
      const dashoffset = -((acc.cum / 100) * CIRCUMFERENCE)
      acc.items.push({ dash, dashoffset })
      acc.cum += stat.pct
      return acc
    },
    { cum: 0, items: [] },
  ).items

  return (
    <div className="row gap-4" style={{ alignItems: 'center' }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ flexShrink: 0 }}>
        <g transform={`rotate(-90 ${RADIUS} ${RADIUS})`}>
          {stats.map((stat, i) => (
            <circle
              key={i}
              cx={RADIUS}
              cy={RADIUS}
              r={CIRCLE_R}
              fill="none"
              stroke={SLICE_COLORS[i % SLICE_COLORS.length]}
              strokeWidth={RADIUS}
              strokeDasharray={`${slices[i].dash} ${CIRCUMFERENCE - slices[i].dash}`}
              strokeDashoffset={slices[i].dashoffset}
            />
          ))}
        </g>
      </svg>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
        {stats.map((stat, i) => (
          <li key={i} className="row gap-2" style={{ alignItems: 'center', marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: SLICE_COLORS[i % SLICE_COLORS.length], display: 'inline-block', flexShrink: 0 }} />
            <span>{stat.answer || '—'}</span>
            <span className="text-muted">({stat.count} · {stat.pct}%)</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
