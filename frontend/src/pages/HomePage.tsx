import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, API_BASE, photoUrl, type Member, type Event } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'
import { EventsCarousel } from '../components/EventsCarousel'
import { sanitizeHtml } from '../lib/sanitize'

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

type IntroPhase = 'start' | 'letters' | 'text' | 'reveal'

export default function HomePage() {
  const { isAdmin } = useAdmin()
  const [editingIntro, setEditingIntro] = useState(false)
  const [introHtml, setIntroHtml] = useState(DEFAULT_INTRO)
  const [toast, setToast] = useState('')
  const introRef = useRef<HTMLElement>(null)
  const { data: fetchedMembers } = useFetch<Member[]>(`${API_BASE}/members`)
  const { data: avatars } = useFetch<{ core: string[]; active: string[]; media: string[] }>(`${API_BASE}/members/avatars`)
  const { data: fetchedEvents, loading: eventsLoading, error: eventsError, retry: retryEvents } = useFetch<Event[]>(`${API_BASE}/events`)

  const [introPhase, setIntroPhase] = useState<IntroPhase>('start')
  const eventsBoxWrapRef = useRef<HTMLDivElement>(null)
  const [contactBtnSize, setContactBtnSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    api.content.get('home-intro').then(d => setIntroHtml(d.html)).catch(() => {})
  }, [])

  // Kick off the intro sequence one frame after first paint, so the browser
  // registers the letters' off-position starting styles before we transition
  // them — otherwise the transition would have nothing to animate from.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const raf = requestAnimationFrame(() => setIntroPhase(reduced ? 'reveal' : 'letters'))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (introPhase !== 'letters') return
    const t = setTimeout(() => setIntroPhase('text'), 1400)
    return () => clearTimeout(t)
  }, [introPhase])

  useEffect(() => {
    if (introPhase !== 'text') return
    const t = setTimeout(() => setIntroPhase('reveal'), 200)
    return () => clearTimeout(t)
  }, [introPhase])

  const depCounts = useMemo(() => {
    if (!fetchedMembers) return { core: 8, active: 14, media: 6 }
    const counts = { core: 0, active: 0, media: 0 }
    fetchedMembers.forEach((m: Member) => { if (m.dep in counts) counts[m.dep as keyof typeof counts]++ })
    return counts
  }, [fetchedMembers]);

  const departmentCards = useMemo(() => {
    return DEPARTMENT_ORDER.map(dep => ({
      dep,
      testId: `dept-card-${dep}`,
      cls: `dep-${dep}`,
      count: depCounts[dep],
      ...DEPARTMENT_META[dep],
    }))
  }, [depCounts])

  const upcomingEvents = useMemo(() => {
    return (fetchedEvents ?? [])
      .filter(ev => !ev.past)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4)
  }, [fetchedEvents])

  // Keeps the "Contact SU" button's size in sync with the events box, whose
  // height is intrinsic (cover aspect-ratio + description length) rather than fixed.
  useEffect(() => {
    const box = eventsBoxWrapRef.current?.querySelector('.events-carousel-box')
    if (!box) { setContactBtnSize(null); return }
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContactBtnSize({ width, height })
    })
    ro.observe(box)
    return () => ro.disconnect()
  }, [eventsLoading, eventsError, upcomingEvents.length])

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

  const lettersLanded = introPhase !== 'start'
  const heroVisible = introPhase === 'text' || introPhase === 'reveal'
  const modulesVisible = introPhase === 'reveal'

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>{toast}</div>
      )}

      <div className={`su-intro${lettersLanded ? ' landed' : ''}`} aria-hidden="true">
        <svg className="su-glyph" viewBox="0 0 56 96" xmlns="http://www.w3.org/2000/svg">
          <path
            className="su-stroke"
            d="M46,10 C46,3 36,0 25,0 C13,0 4,7 4,18 C4,29 15,33 27,37 C40,41 52,47 52,64 C52,80 40,90 27,90 C15,90 4,84 4,73"
          />
        </svg>
        <svg className="su-glyph" viewBox="0 0 56 96" xmlns="http://www.w3.org/2000/svg">
          <path
            className="su-stroke"
            d="M8,4 L8,64 C8,84 22,94 30,94 C40,94 52,84 52,64 L52,4"
          />
        </svg>
      </div>

      <div style={{ position: 'relative' }} className={`su-fade${heroVisible ? ' visible' : ''}`}>
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

      <div className={`home-reveal${modulesVisible ? ' visible' : ''}`}>
        <div className="home-columns">
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

            <div className="deps-list">
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
                  <div className="meta"></div>
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

          <section aria-label="Ближайшие события">
            <div className="section-rule">
              <div className="sr-left">
                <span className="eyebrow">События</span>
                <h2>Ближайшие события</h2>
              </div>
              <Link className="more" to="/events">
                Все события
                <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            <div ref={eventsBoxWrapRef}>
              {eventsError ? (
                <ErrorBanner message="Failed to load events. Please try again." onRetry={retryEvents} stack={eventsError ?? undefined} />
              ) : eventsLoading ? (
                <LoadingSkeleton type="event" count={1} />
              ) : upcomingEvents.length === 0 ? (
                <EmptyState title="Нет предстоящих событий" description="Загляните позже — здесь появятся ближайшие мероприятия студсовета." />
              ) : (
                <EventsCarousel events={upcomingEvents} />
              )}
            </div>

            <div className="home-contact">
              <div
                className="contact-stack"
                style={contactBtnSize ? { width: contactBtnSize.width, height: contactBtnSize.height } : undefined}
              >
                <button type="button" className="btn secondary contact-su-btn">
                  Как попасть в студсовет?
                </button>
                <a className="btn secondary contact-su-btn" href="mailto:su@innopolis.university">
                  <Icon id="i-mail" style={{ width: 18, height: 18 }} />
                  Связаться с SU
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
