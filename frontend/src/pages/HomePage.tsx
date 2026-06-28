import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Member } from '../lib/api'
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

export default function HomePage() {
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()
  const [editingIntro, setEditingIntro] = useState(false)
  const [introHtml, setIntroHtml] = useState(DEFAULT_INTRO)
  const [toast, setToast] = useState('')
  const introRef = useRef<HTMLElement>(null)
  const { data: fetchedMembers } = useFetch<Member[]>('/api/members');
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
          <div className="dep-tint dep-core" onClick={() => navigate('/members?dep=core')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('/members?dep=core')}>
            <span className="dep-name">SU:Core</span>
            <h3>Стратегия, инфраструктура, переговоры с университетом.</h3>
            <p className="desc">Координирует политики, бюджет студсовета, ведёт коммуникацию с деканатами и кампусной службой.</p>
            <div className="meta">
              <span><b>{depCounts.core}</b> участников</span>
              <span className="dot" />
              <span><b>3</b> активных проекта</span>
              <span className="dot" />
              <span><b>2</b> co-leads</span>
            </div>
            <div className="avatars">
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#a3e0ad,#32b247)' }}>МР</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' }}>ДА</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#c7dfa9,#74a55c)' }}>ЕВ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#a8dba8,#3da152)' }}>ТК</div>
              {depCounts.core > 4 && <div className="more">+{depCounts.core - 4}</div>}
            </div>
            <div className="open-row">
              <span>Подробнее о департаменте</span>
              <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
            </div>
          </div>

          <div className="dep-tint dep-active" onClick={() => navigate('/members?dep=active')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('/members?dep=active')}>
            <span className="dep-name">SU:Active</span>
            <h3>Мероприятия, культура, спорт — всё, что собирает кампус.</h3>
            <p className="desc">Организует тематические недели, лекции, спортивные турниры. Главные люди за back-of-house ивентов.</p>
            <div className="meta">
              <span><b>{depCounts.active}</b> участников</span>
              <span className="dot" />
              <span><b>7</b> ивентов в плане</span>
              <span className="dot" />
              <span><b>3</b> co-leads</span>
            </div>
            <div className="avatars">
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#a8c0e0,#3868b8)' }}>АГ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#b9c8e0,#5481c5)' }}>КЛ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#c8d3e6,#7290c9)' }}>ИС</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#9eb6db,#2c5ba8)' }}>МЯ</div>
              {depCounts.active > 4 && <div className="more">+{depCounts.active - 4}</div>}
            </div>
            <div className="open-row">
              <span>Подробнее о департаменте</span>
              <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
            </div>
          </div>

          <div className="dep-tint dep-media" onClick={() => navigate('/members?dep=media')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('/members?dep=media')}>
            <span className="dep-name">SU:Media</span>
            <h3>Контент, дизайн, лента кампуса — фронт студсовета.</h3>
            <p className="desc">Снимает ивенты, ведёт соцсети, делает плакаты, пишет лонгриды для портала.</p>
            <div className="meta">
              <span><b>{depCounts.media}</b> участников</span>
              <span className="dot" />
              <span><b>34</b> публикации</span>
              <span className="dot" />
              <span><b>1</b> co-lead</span>
            </div>
            <div className="avatars">
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#e0a8c8,#c93f8b)' }}>АЛ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#e6b9d3,#d65fa3)' }}>ПК</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#dbb3d8,#b85eb0)' }}>ОН</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#e8c5db,#dc7eb3)' }}>СВ</div>
              {depCounts.media > 4 && <div className="more">+{depCounts.media - 4}</div>}
            </div>
            <div className="open-row">
              <span>Подробнее о департаменте</span>
              <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
            </div>
          </div>
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
