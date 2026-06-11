import { useState } from 'react'
import { Icon } from '../components/Icon'

type TabKey = 'members' | 'invites' | 'roles' | 'audit'

export default function AdminAccountsPage() {
  const [tab, setTab] = useState<TabKey>('members')

  const tabs: { key: TabKey; label: React.ReactNode }[] = [
    { key: 'members', label: <>Участники <span className="text-mono" style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>32</span></> },
    { key: 'invites', label: <>Pending invites <span className="text-mono" style={{ fontSize: 11, color: '#92400E', background: 'var(--warn-50)', padding: '1px 6px', borderRadius: 999, marginLeft: 4 }}>4</span></> },
    { key: 'roles', label: 'Роли и права' },
    { key: 'audit', label: 'Audit log' },
  ]

  return (
    <>

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Admin · только для super-admin</span>
          <h1>Account management</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
            Управление участниками студсовета, ролями и правами доступа. Студенты эту страницу не видят.
          </p>
        </div>
        <div className="row gap-2">
          <button className="btn secondary"><Icon id="i-download" style={{ width: 14, height: 14 }} />Экспорт CSV</button>
          <button className="btn primary"><Icon id="i-plus" style={{ width: 14, height: 14 }} />Пригласить участника</button>
        </div>
      </div>

      {/* Stats */}
      <section className="stats">
        <div className="stat">
          <div>
            <span className="lbl">Всего участников</span>
            <span className="v">32</span>
            <span className="sub">26 active · 4 invited · 2 inactive</span>
          </div>
          <div className="ic-wrap"><Icon id="i-users" /></div>
        </div>
        <div className="stat b">
          <div>
            <span className="lbl">Зашли за 7 дней</span>
            <span className="v">21</span>
            <span className="sub up">+3 к прошлой неделе</span>
          </div>
          <div className="ic-wrap"><Icon id="i-trending" /></div>
        </div>
        <div className="stat c">
          <div>
            <span className="lbl">Pending invites</span>
            <span className="v">4</span>
            <span className="sub">2 истекают через 3 дня</span>
          </div>
          <div className="ic-wrap"><Icon id="i-mail" /></div>
        </div>
        <div className="stat d">
          <div>
            <span className="lbl">Super-admin</span>
            <span className="v">3</span>
            <span className="sub">co-leads трёх департаментов</span>
          </div>
          <div className="ic-wrap"><Icon id="i-shield" /></div>
        </div>
      </section>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Members pane */}
      {tab === 'members' && (
        <div>
          <section className="acc-toolbar">
            <label className="input-group" style={{ width: 280 }}>
              <Icon id="i-search" className="ic" />
              <input type="text" placeholder="Найти по имени, email или группе…" />
            </label>
            <select className="select">
              <option>Все департаменты</option>
              <option>SU:Core (8)</option>
              <option>SU:Active (14)</option>
              <option>SU:Media (10)</option>
            </select>
            <select className="select">
              <option>Все роли</option>
              <option>Super-admin</option>
              <option>Department lead</option>
              <option>Member</option>
              <option>Contributor</option>
              <option>Read-only</option>
            </select>
            <select className="select">
              <option>Любой статус</option>
              <option>Active</option>
              <option>Invited</option>
              <option>Inactive</option>
              <option>Blocked</option>
            </select>
            <button className="btn ghost sm" style={{ marginLeft: 'auto' }}>
              <Icon id="i-filter" style={{ width: 13, height: 13 }} />
              Ещё фильтры
            </button>
          </section>

          <div className="acc-card">
            <div className="bulk-bar show">
              <span>Выбрано <b>2 участника</b></span>
              <div className="bulk-actions">
                <button className="btn sm secondary">Сменить роль</button>
                <button className="btn sm secondary">Сменить департамент</button>
                <button className="btn sm secondary">Отправить уведомление</button>
                <button className="btn sm danger">Заблокировать</button>
              </div>
            </div>

            <table className="acc-table">
              <thead>
                <tr>
                  <th><span className="tcheck tri"></span></th>
                  <th>Участник</th>
                  <th>Роль</th>
                  <th>Департамент</th>
                  <th>Группа</th>
                  <th>Статус</th>
                  <th>Последний вход</th>
                  <th style={{ textAlign: 'right' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { init: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)', name: 'Мария Романова', email: 'm.romanova@innopolis.ru', note: ' · you', role: <span className="badge-mono purple">SUPER-ADMIN</span>, dept: <span className="tag green" style={{ height: 22 }}>SU:Core</span>, group: 'B22-DS-02', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen now">сейчас</span>, selected: true },
                  { init: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)', name: 'Денис Алимов', email: 'd.alimov@innopolis.ru', note: '', role: <span className="badge-mono purple">SUPER-ADMIN</span>, dept: <span className="tag green" style={{ height: 22 }}>SU:Core</span>, group: 'B21-SE-04', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen">12 мин назад</span>, selected: false },
                  { init: 'АГ', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)', name: 'Алия Газизова', email: 'a.gazizova@innopolis.ru', note: '', role: <span className="badge-mono blue">DEPT LEAD</span>, dept: <span className="tag blue" style={{ height: 22 }}>SU:Active</span>, group: 'B22-DS-01', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen">1 ч назад</span>, selected: true },
                  { init: 'ИС', bg: 'linear-gradient(135deg,#f5b8d5,#db2777)', name: 'Илья Соколов', email: 'i.sokolov@innopolis.ru', note: '', role: <span className="badge-mono pink">DEPT LEAD</span>, dept: <span className="tag" style={{ background: '#FCE7F3', color: '#9D174D', height: 22 }}>SU:Media</span>, group: 'M23-DEV-01', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen">3 ч назад</span>, selected: false },
                  { init: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)', name: 'Елизавета Власова', email: 'e.vlasova@innopolis.ru', note: '', role: <span className="badge-mono">MEMBER</span>, dept: <span className="tag green" style={{ height: 22 }}>SU:Core</span>, group: 'B23-CS-03', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen">сегодня, 09:14</span>, selected: false },
                  { init: 'ТК', bg: 'linear-gradient(135deg,#a8dba8,#3da152)', name: 'Тимур Каримов', email: 't.karimov@innopolis.ru', note: '', role: <span className="badge-mono">MEMBER</span>, dept: <span className="tag green" style={{ height: 22 }}>SU:Core</span>, group: 'B22-AI-02', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen">вчера, 22:40</span>, selected: false },
                  { init: 'КЛ', bg: 'linear-gradient(135deg,#b9c8e0,#5481c5)', name: 'Камилла Латыпова', email: 'k.latypova@innopolis.ru', note: '', role: <span className="badge-mono">MEMBER</span>, dept: <span className="tag blue" style={{ height: 22 }}>SU:Active</span>, group: 'B21-IM-01', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen">вчера, 18:02</span>, selected: false },
                  { init: 'АС', bg: 'linear-gradient(135deg,#f1c9dc,#c2185b)', name: 'Айгуль Сафина', email: 'a.safina@innopolis.ru', note: '', role: <span className="badge-mono">CONTRIBUTOR</span>, dept: <span className="tag" style={{ background: '#FCE7F3', color: '#9D174D', height: 22 }}>SU:Media</span>, group: 'B22-CS-05', status: <span className="status-pill active"><span className="d"></span>Active</span>, seen: <span className="last-seen">3 дн. назад</span>, selected: false },
                  { init: 'МЯ', bg: 'linear-gradient(135deg,#c8d3e6,#7290c9)', name: 'Михаил Якушев', email: 'm.yakushev@innopolis.ru', note: '', role: <span className="badge-mono">MEMBER</span>, dept: <span className="tag blue" style={{ height: 22 }}>SU:Active</span>, group: 'B22-RO-03', status: <span className="status-pill invited"><span className="d"></span>Invited</span>, seen: <span className="last-seen" style={{ color: 'var(--muted-2)' }}>приглашение отправлено · 2 дн.</span>, selected: false },
                  { init: 'НП', bg: 'linear-gradient(135deg,#d4d4d8,#71717a)', name: 'Никита Прохоров', email: 'n.prokhorov@innopolis.ru', note: '', role: <span className="badge-mono">READ-ONLY</span>, dept: <span className="tag outline" style={{ height: 22 }}>— alumni —</span>, group: 'B20-CS-04', status: <span className="status-pill inactive"><span className="d"></span>Inactive</span>, seen: <span className="last-seen" style={{ color: 'var(--muted-2)' }}>не входил 47 дней</span>, selected: false },
                  { init: 'ВЛ', bg: 'linear-gradient(135deg,#fecaca,#dc2626)', name: 'Виктор Лисов', email: 'v.lisov@innopolis.ru', note: '', role: <span className="badge-mono">MEMBER</span>, dept: <span className="tag" style={{ background: '#FCE7F3', color: '#9D174D', height: 22 }}>SU:Media</span>, group: 'B23-DS-02', status: <span className="status-pill blocked"><span className="d"></span>Blocked</span>, seen: <span className="last-seen" style={{ color: 'var(--danger)' }}>блок · нарушение этики</span>, selected: false },
                ].map((row, i) => (
                  <tr key={i} className={row.selected ? 'selected' : ''}>
                    <td><span className={`tcheck${row.selected ? ' checked' : ''}`}></span></td>
                    <td>
                      <div className="acc-person">
                        <div className="avatar" style={{ background: row.bg }}>{row.init}</div>
                        <div className="info">
                          <span className="nm">{row.name}</span>
                          <span className="em">{row.email}{row.note && <span className="group">{row.note}</span>}</span>
                        </div>
                      </div>
                    </td>
                    <td>{row.role}</td>
                    <td>{row.dept}</td>
                    <td><span className="text-mono" style={{ color: 'var(--muted)' }}>{row.group}</span></td>
                    <td>{row.status}</td>
                    <td>{row.seen}</td>
                    <td>
                      <div className="row-actions">
                        <button><Icon id="i-eye" /></button>
                        <button><Icon id="i-edit" /></button>
                        <button className="danger"><Icon id="i-x" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="acc-foot">
              <span>Показаны 1–11 из 32</span>
              <div className="pager">
                <button><Icon id="i-chevron-l" /></button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button><Icon id="i-chevron-r" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending invites pane */}
      {tab === 'invites' && (
        <div className="acc-card">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: 16 }}>Pending invites · 4</h3>
              <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>Приглашения, которые ещё не приняты. Истекают автоматически через 14 дней.</p>
            </div>
            <button className="btn primary sm" style={{ marginLeft: 'auto' }}>
              <Icon id="i-plus" style={{ width: 12, height: 12 }} />Новое приглашение
            </button>
          </div>

          {[
            { email: 'm.yakushev@innopolis.ru', who: 'Михаил Якушев · кому: SU:Active', role: <span className="badge-mono blue">MEMBER</span>, dept: <span className="tag blue" style={{ height: 22 }}>SU:Active</span>, sent: '8 июня', expiry: 'через 12 дн.', expColor: 'var(--warn)' },
            { email: 'y.fedorova@innopolis.ru', who: 'Юлия Фёдорова · кому: SU:Media', role: <span className="badge-mono">CONTRIBUTOR</span>, dept: <span className="tag" style={{ background: '#FCE7F3', color: '#9D174D', height: 22 }}>SU:Media</span>, sent: '5 июня', expiry: 'через 3 дн.', expColor: 'var(--danger)' },
            { email: 'r.gilmanov@innopolis.ru', who: 'Руслан Гильманов · кому: SU:Core', role: <span className="badge-mono">MEMBER</span>, dept: <span className="tag green" style={{ height: 22 }}>SU:Core</span>, sent: '4 июня', expiry: 'через 2 дн.', expColor: 'var(--danger)' },
            { email: 'a.berezhnaya@innopolis.ru', who: 'Анна Бережная · кому: SU:Active', role: <span className="badge-mono">MEMBER</span>, dept: <span className="tag blue" style={{ height: 22 }}>SU:Active</span>, sent: '3 июня', expiry: 'завтра', expColor: 'var(--danger)' },
          ].map((inv, i) => (
            <div key={i} className="invite-row">
              <div>
                <div className="em">{inv.email}</div>
                <div className="who">{inv.who}</div>
              </div>
              <div>{inv.role}</div>
              <div>{inv.dept}</div>
              <div className="text-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>отправлено<br /><b style={{ color: 'var(--fg)' }}>{inv.sent}</b></div>
              <div className="text-mono" style={{ fontSize: 11, color: inv.expColor }}>истекает<br /><b>{inv.expiry}</b></div>
              <div className="row-actions">
                <button><Icon id="i-mail" /></button>
                <button className="danger"><Icon id="i-x" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roles pane */}
      {tab === 'roles' && (
        <>
          <div className="acc-card perm-card">
            <div className="perm-head">
              <div>
                <h3>Матрица прав доступа</h3>
                <p className="desc">Какая роль что может делать в портале. <b>F</b> — полный доступ, <b>R</b> — только чтение, <b>—</b> доступа нет.</p>
              </div>
              <div className="row gap-2">
                <button className="btn ghost sm"><Icon id="i-download" style={{ width: 13, height: 13 }} />Скачать как PDF</button>
                <button className="btn primary sm">Редактировать</button>
              </div>
            </div>

            <table className="perm-table">
              <thead>
                <tr>
                  <th>Раздел / действие</th>
                  <th>Super-admin</th>
                  <th>Dept lead</th>
                  <th>Member</th>
                  <th>Contributor</th>
                  <th>Read-only</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Новости и публикации', desc: 'Создавать, редактировать, публиковать посты на главной', perms: ['F','F','R','R','R'] },
                  { name: 'Members & Roadmap', desc: 'Изменять профили, состав департаментов, WYSIWYG roadmap', perms: ['F','F','R','—','R'] },
                  { name: 'Events', desc: 'Создавать ивенты, управлять регистрациями, отмечать прошедшие', perms: ['F','F','F','R','R'] },
                  { name: 'Questionnaires', desc: 'Создавать опросы, видеть результаты, выгружать XLSX', perms: ['F','F','F','R','—'] },
                  { name: 'Donations', desc: 'Создавать цели, отмечать транзакции, закрывать сборы', perms: ['F','R','R','R','R'] },
                  { name: 'SU:Core Board (Kanban)', desc: 'Внутренний backlog. Только Core имеет доступ.', perms: ['F','F','R','—','—'] },
                  { name: 'Account management', desc: 'Эта страница. Управление пользователями, инвайтами, ролями.', perms: ['F','—','—','—','—'] },
                  { name: 'Audit log', desc: 'История всех изменений (только просмотр, не редактируется)', perms: ['R','R','—','—','—'] },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div className="scope-name">{row.name}</div>
                      <div className="scope-desc">{row.desc}</div>
                    </td>
                    {row.perms.map((p, j) => (
                      <td key={j}>
                        <span className={`perm-cell${p === 'F' ? ' full' : p === 'R' ? ' read' : ' none'}`}>{p}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="danger-zone">
            <h4>Опасная зона</h4>
            <p className="desc">
              Действия ниже невозможно откатить. Подтверждение через email или второй super-admin.
              Делайте их только тогда, когда уверены — иначе можно потерять историю участников или заблокировать активную команду департамента.
            </p>
            <div className="row">
              <button className="btn secondary sm">Сбросить роли всем участникам</button>
              <button className="btn secondary sm">Архивировать ушедших &amp; alumni</button>
              <button className="btn danger sm">Передать super-admin другому участнику</button>
            </div>
          </div>
        </>
      )}

      {/* Audit log pane */}
      {tab === 'audit' && (
        <div className="acc-card">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: 16 }}>Audit log · последние действия</h3>
              <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>Все изменения ролей, инвайтов, блокировок. Виден только super-admin.</p>
            </div>
            <select className="select" style={{ marginLeft: 'auto', height: 32, width: 'auto', minWidth: 160, fontSize: 13, paddingRight: 28 }}>
              <option>Последние 7 дней</option>
              <option>Последние 30 дней</option>
              <option>Всё время</option>
            </select>
          </div>

          <table className="acc-table">
            <thead>
              <tr>
                <th style={{ width: 160 }}>Когда</th>
                <th>Кто</th>
                <th>Что</th>
                <th>Кого/Что затронуло</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="text-mono" style={{ color: 'var(--muted)' }}>сегодня · 10:22</span></td>
                <td><div className="acc-person"><div className="avatar sm" style={{ background: 'linear-gradient(135deg,#a3e0ad,#32b247)' }}>МР</div><span style={{ fontWeight: 500 }}>Мария Романова</span></div></td>
                <td>Пригласила нового участника <span className="badge-mono">CONTRIBUTOR</span></td>
                <td><span className="text-mono">y.fedorova@innopolis.ru</span> · SU:Media</td>
              </tr>
              <tr>
                <td><span className="text-mono" style={{ color: 'var(--muted)' }}>сегодня · 09:14</span></td>
                <td><div className="acc-person"><div className="avatar sm" style={{ background: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' }}>ДА</div><span style={{ fontWeight: 500 }}>Денис Алимов</span></div></td>
                <td>Изменил роль с <span className="badge-mono">MEMBER</span> на <span className="badge-mono blue">DEPT LEAD</span></td>
                <td>Алия Газизова · SU:Active</td>
              </tr>
              <tr>
                <td><span className="text-mono" style={{ color: 'var(--muted)' }}>вчера · 18:47</span></td>
                <td><div className="acc-person"><div className="avatar sm" style={{ background: 'linear-gradient(135deg,#a3e0ad,#32b247)' }}>МР</div><span style={{ fontWeight: 500 }}>Мария Романова</span></div></td>
                <td>Заблокировала участника · причина: <i style={{ color: 'var(--danger)' }}>нарушение этики</i></td>
                <td>Виктор Лисов · SU:Media</td>
              </tr>
              <tr>
                <td><span className="text-mono" style={{ color: 'var(--muted)' }}>вчера · 14:08</span></td>
                <td><div className="acc-person"><div className="avatar sm" style={{ background: 'linear-gradient(135deg,#f5b8d5,#db2777)' }}>ИС</div><span style={{ fontWeight: 500 }}>Илья Соколов</span></div></td>
                <td>Сбросил пароль и отправил magic-link</td>
                <td>Айгуль Сафина · SU:Media</td>
              </tr>
              <tr>
                <td><span className="text-mono" style={{ color: 'var(--muted)' }}>8 июня · 20:31</span></td>
                <td><div className="acc-person"><div className="avatar sm" style={{ background: 'linear-gradient(135deg,#a3e0ad,#32b247)' }}>МР</div><span style={{ fontWeight: 500 }}>Мария Романова</span></div></td>
                <td>Архивировала <span className="badge-mono">READ-ONLY</span> учётку (alumni)</td>
                <td>Никита Прохоров · B20-CS-04</td>
              </tr>
              <tr>
                <td><span className="text-mono" style={{ color: 'var(--muted)' }}>8 июня · 11:02</span></td>
                <td><div className="acc-person"><div className="avatar sm" style={{ background: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' }}>ДА</div><span style={{ fontWeight: 500 }}>Денис Алимов</span></div></td>
                <td>Обновил матрицу прав: <i>Donations</i> для Dept lead → R</td>
                <td>Системная настройка</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <footer className="text-muted" style={{ fontSize: 12, textAlign: 'center', padding: '18px 0 8px', marginTop: 18, borderTop: '1px solid var(--border)' }}>
        Admin-only · все действия логируются в audit · супер-админов всегда минимум двое
      </footer>
    </>
  )
}
