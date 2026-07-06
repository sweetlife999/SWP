import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, photoUrl, type Member } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'

interface NewsItem {
  thumbClass?: string
  date?: string
  category?: string
  title: string
  excerpt?: string
  desc?: string
}

const DEFAULT_INTRO = `<span class="eyebrow">О студсовете</span>
<h1>Студенческий совет<br>Университета Иннополис</h1>
<p class="lead">Представляем интересы студентов, организуем кампусную жизнь и помогаем университету становиться лучше — с 2019 года. Три департамента, одна команда.</p>`

type DepKey = 'core' | 'active' | 'media'

const DEPARTMENT_ORDER: DepKey[] = ['core', 'active', 'media']

function depLabel(dep: DepKey): string {
  return `SU:${dep.charAt(0).toUpperCase()}${dep.slice(1)}`
}

export default function HomePage() {
  const { isAdmin } = useAdmin()
  const [openDep, setOpenDep] = useState<DepKey | null>(null)
  const [editingIntro, setEditingIntro] = useState(false)
  const [introHtml, setIntroHtml] = useState(DEFAULT_INTRO)
  const [toast, setToast] = useState('')
  const introRef = useRef<HTMLElement>(null)
  const { data: fetchedMembers } = useFetch<Member[]>('/api/members')
  const { data: avatars } = useFetch<{ core: string[]; active: string[]; media: string[] }>('/api/members/avatars')
  const { data: newsItems, loading: newsLoading, error: newsError, retry: newsRetry } = useFetch<NewsItem[]>('/api/news');

  useEffect(() => {
    api.content.get('home-intro').then(d => setIntroHtml(d.html)).catch(() => {})
  }, [])

  const depCounts = useMemo(() => {
    if (!fetchedMembers) return { core: 8, active: 14, media: 6 }
    const counts = { core: 0, active: 0, media: 0 }
    fetchedMembers.forEach((m: Member) => { if (m.dep in counts) counts[m.dep as keyof typeof counts]++ })
    return counts
  }, [fetchedMembers]);

  const departmentCards = useMemo(() => {
    return DEPARTMENT_ORDER.map(dep => {
      const members = (fetchedMembers ?? []).filter(m => m.dep === dep)
      const first = members[0]
      const name = first?.tag?.trim() || depLabel(dep)
      const tagline = first?.role?.trim() || `Команда ${name}`
      const desc = first?.meta?.trim() || first?.bio?.trim() || `Департамент ${name}`
      const uniqueRecent = new Set<string>()
      let leadCount = 0
      members.forEach(member => {
        if (/lead/i.test(member.role)) leadCount += 1
        ;(member.recent ?? []).forEach(item => {
          const text = item.trim()
          if (text) uniqueRecent.add(text)
        })
      })
      return {
        dep,
        testId: `dept-card-${dep}`,
        cls: `dep-${dep}`,
        name,
        tagline,
        desc,
        count: depCounts[dep],
        activityCount: uniqueRecent.size,
        leadCount,
      }
    })
  }, [depCounts, fetchedMembers])

  const info = openDep ? departmentCards.find(card => card.dep === openDep) ?? null : null
  const openDepMembers = useMemo(
    () => (openDep ? (fetchedMembers ?? []).filter(member => member.dep === openDep) : []),
    [openDep, fetchedMembers],
  )
  const openDepRecent = (() => {
    const seen = new Set<string>()
    for (const member of openDepMembers) {
      for (const item of member.recent ?? []) {
        const text = item.trim()
        if (!text || seen.has(text)) continue
        seen.add(text)
        if (seen.size === 3) return [...seen]
      }
    }
    return [...seen]
  })()

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function handleIntroSave() {
    const html = introRef.current?.innerHTML ?? introHtml
    try {
      await api.content.update('home-intro', html)
      setIntroHtml(html)
      showToast('Сохранено')
    } catch {
      showToast('Ошибка сохранения')
    }
    setEditingIntro(false)
  }

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>{toast}</div>
      )}
      <div style={{ position: 'relative' }}>
        <section
          ref={introRef}
          className="intro"
          aria-label="О студсовете"
          contentEditable={editingIntro}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: introHtml }}
          style={editingIntro ? { outline: '2px solid var(--accent)', borderRadius: 8, padding: 16 } : {}}
        />
        {isAdmin && !editingIntro && (
          <button className="btn ghost" style={{ position: 'absolute', top: 0, right: 0, fontSize: 12 }} onClick={() => setEditingIntro(true)}>
            <Icon id="i-edit" style={{ width: 12, height: 12 }} /> Редактировать
          </button>
        )}
        {editingIntro && (
          <div className="row gap-2" style={{ marginTop: 8 }}>
            <button className="btn ghost" onClick={() => setEditingIntro(false)}>Отмена</button>
            <button className="btn primary" onClick={handleIntroSave}><Icon id="i-check" style={{ width: 14, height: 14 }} />Сохранить</button>
          </div>
        )}
      </div>

      <section aria-label="Команда">
        <div className="section-rule">
          <div className="sr-left">
            <span className="eyebrow">Команда</span>
            <h2>Три департамента, одно сообщество</h2>
          </div>
          <Link className="more" to="/members">
            Все участники
            <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        <div className="deps">
          {departmentCards.map(card => (
            <div
              key={card.dep}
              data-testid={card.testId}
              className={`dep-tint ${card.cls}`}
              onClick={() => setOpenDep(card.dep)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setOpenDep(card.dep)}
            >
              <span className="dep-name">{card.name}</span>
              <h3>{card.tagline}</h3>
              <p className="desc">{card.desc}</p>
              <div className="meta">
              </div>
              <div className="avatars">
                {(avatars?.[card.dep] ?? []).map((url, i) => (
                  <div key={i} className="avatar" style={{ padding: 0, overflow: 'hidden' }}>
                    <img src={photoUrl(url, '80x80')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                {card.count > (avatars?.[card.dep]?.length ?? 0) && (
                  <div className="more">+{card.count - (avatars?.[card.dep]?.length ?? 0)}</div>
                )}
              </div>
              <div className="open-row">
                <span>Подробнее о департаменте</span>
                <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section aria-label="Новости" style={{ marginTop: 48 }}>
        <div className="section-rule">
          <div className="sr-left">
            <span className="eyebrow">Новости</span>
            <h2>Последние обновления</h2>
          </div>
        </div>

        {newsError && (
          <ErrorBanner
            message="Failed to load news. Please try again."
            onRetry={newsRetry}
            stack={newsError}
          />
        )}

        {newsLoading && (
          <div className="news-list">
            <LoadingSkeleton type="news" count={3} />
          </div>
        )}

        {!newsLoading && !newsError && (!newsItems || newsItems.length === 0) && (
          <EmptyState
            title="No news yet"
            description="Stay tuned for updates — new news will appear soon!"
          />
        )}

        {!newsLoading && !newsError && newsItems && newsItems.length > 0 && (
          <div className="news-list">
            {newsItems.map((item: NewsItem, index: number) => (
              <div key={index} className="news-row">
                <div className={`thumb ${item.thumbClass || ''}`} />
                <div className="news-body">
                  <div className="meta">
                    <span>{item.date || 'Soon'}</span>
                    <span>{item.category || 'News'}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt || item.desc || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {info && (
        <div className="modal-overlay" onClick={() => setOpenDep(null)}>
          <div data-testid="dept-modal" className={`dep-modal ${info.cls}`} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenDep(null)}>
              <Icon id="i-x" style={{ width: 14, height: 14 }} />
            </button>
            <div className="dep-modal-header">
              <div className="dep-name">{info.name}</div>
              <h2 style={{ margin: '6px 0 4px' }}>{info.name}</h2>
              <p className="tagline">{info.tagline}</p>
            </div>
            <div className="dep-modal-body">
              <p>{info.desc}</p>
              <h4>Недавние активности</h4>
              {openDepRecent.length > 0 ? (
                <ul>
                  {openDepRecent.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              ) : (
                <p className="text-muted">Пока нет данных об активностях.</p>
              )}
            </div>
            <div className="dep-modal-foot">
              <Link
                className="btn primary"
                style={{ width: '100%', justifyContent: 'center' }}
                to={`/members?dep=${info.dep}`}
                onClick={() => setOpenDep(null)}
              >
                Посмотреть участников ({fetchedMembers ? openDepMembers.length : depCounts[info.dep]} чел.)
                <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
