import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, API_BASE, photoUrl, type Member } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'
import { sanitizeHtml } from '../lib/sanitize'

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

const DEPARTMENT_META: Record<DepKey, { name: string; tagline: string; desc: string }> = {
  core: {
    name: 'SU:Core',
    tagline: 'Стратегия и переговоры с университетом',
    desc: 'Определяет приоритеты студсовета, ведёт бюджет и коммуникацию с администрацией университета.',
  },
  active: {
    name: 'SU:Active',
    tagline: 'События и кампусная жизнь',
    desc: 'Организует мероприятия, ивенты и активности для студентов на кампусе.',
  },
  media: {
    name: 'SU:Media',
    tagline: 'Контент и коммуникации',
    desc: 'Ведёт соцсети, освещает события студсовета и отвечает за визуальный контент.',
  },
}

export default function HomePage() {
  const { isAdmin } = useAdmin()
  const [editingIntro, setEditingIntro] = useState(false)
  const [introHtml, setIntroHtml] = useState(DEFAULT_INTRO)
  const [toast, setToast] = useState('')
  const introRef = useRef<HTMLElement>(null)
  const { data: fetchedMembers } = useFetch<Member[]>(`${API_BASE}/members`)
  const { data: avatars } = useFetch<{ core: string[]; active: string[]; media: string[] }>(`${API_BASE}/members/avatars`)
  const { data: newsItems, loading: newsLoading, error: newsError, retry: newsRetry } = useFetch<NewsItem[]>(`${API_BASE}/news`);

  useEffect(() => {
    api.content.get('home-intro').then(d => {
      if (d.html) setIntroHtml(d.html)
    }).catch(() => {})
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
      const { name, tagline, desc } = DEPARTMENT_META[dep]
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

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function handleIntroSave() {
    const html = sanitizeHtml(introRef.current?.innerHTML ?? introHtml)
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
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(introHtml) }}
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
            <Link
              key={card.dep}
              data-testid={card.testId}
              className={`dep-tint ${card.cls}`}
              to={`/members?dep=${card.dep}`}
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
                <span>Смотреть участников</span>
                <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
              </div>
            </Link>
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
    </>
  )
}
