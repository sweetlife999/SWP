import { useState } from 'react'
import { Icon } from '../components/Icon'

export default function DonationsPage() {
  const [goalSeg, setGoalSeg] = useState(0)
  const [txSeg, setTxSeg] = useState(0)
  const [donateAmount, setDonateAmount] = useState(1)

  const goalSegLabels = ['Активные', 'Завершённые', 'Все']
  const txSegLabels = ['Все', 'Расходы', 'Доходы']
  const quickAmounts = ['₽ 200', '₽ 500', '₽ 1,000', '₽ 2,500', '₽ 5,000', 'другая']

  return (
    <>

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Прозрачные финансы</span>
          <h1>Donations</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Цели студсовета, прогресс сборов и публичные траты. Никакой кассы под столом — каждая копейка с чеком.</p>
        </div>
        <div className="row gap-2">
          <button className="btn secondary"><Icon id="i-download" style={{ width: 14, height: 14 }} />Отчёт за квартал</button>
          <button className="btn primary"><Icon id="i-heart" style={{ width: 14, height: 14 }} />Поддержать</button>
        </div>
      </div>

      {/* Summary band */}
      <section className="summary">
        <div className="stat-card lead">
          <span className="label">Собрано за 2026 год</span>
          <div className="stat-row">
            <span className="value">₽ 847 200</span>
            <span className="delta">+18% vs 2025</span>
          </div>
          <span className="sub">237 студентов сделали хотя бы один взнос · средний чек ₽ 3,580</span>
        </div>
        <div className="stat-card">
          <span className="label">Активные цели</span>
          <div className="stat-row">
            <span className="value">5</span>
            <span className="delta">3 заканчиваются</span>
          </div>
          <span className="sub">Открытые сборы с публичным прогрессом</span>
        </div>
        <div className="stat-card">
          <span className="label">Транзакции расходов</span>
          <div className="stat-row">
            <span className="value">94</span>
          </div>
          <span className="sub">Опубликованных трат с чеками за этот квартал</span>
        </div>
      </section>

      <div className="layout-grid">

        <section>
          {/* Active goals */}
          <div className="row sb mb-4">
            <h2 style={{ fontSize: 18 }}>Активные цели <span className="text-muted text-mono" style={{ fontSize: 12, marginLeft: 6 }}>05</span></h2>
            <div className="seg">
              {goalSegLabels.map((l, i) => (
                <button key={i} className={goalSeg === i ? 'active' : ''} onClick={() => setGoalSeg(i)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="goals-grid">

            <article className="goal-card featured">
              <header className="gc-head">
                <div style={{ flex: 1 }}>
                  <div className="gc-meta">
                    <span className="tag blue"><span className="dot"></span>SU:Active</span>
                    <span className="tag outline"><Icon id="i-clock" style={{ width: 11, height: 11 }} />осталось 11 дней</span>
                    <span className="tag green"><span className="dot"></span>Featured</span>
                  </div>
                  <h3>Спортинвентарь для лагеря Summer Days</h3>
                  <p className="gc-desc">Гребные лодки в аренду, мячи, пляжный волейбол, BBQ-инвентарь и шатры на 60 человек для финального weekend-а Summer Days. Деньги напрямую идут в SU:Active.</p>
                </div>
                <span className="tag purple" style={{ flexShrink: 0 }}>сезонная</span>
              </header>
              <div className="gc-progress">
                <div className="row sb">
                  <div>
                    <div className="amount">₽ 64,200</div>
                    <span className="of">из ₽ 100,000</span>
                  </div>
                  <span className="pct">64%</span>
                </div>
                <div className="progress lg"><div className="bar" style={{ width: '64%' }}></div></div>
              </div>
              <footer className="gc-foot">
                <div className="supporters">
                  <div className="avatars">
                    <div className="avatar sm" style={{ background: '#a8c0e0' }}>АГ</div>
                    <div className="avatar sm" style={{ background: '#b9c8e0' }}>КЛ</div>
                    <div className="avatar sm" style={{ background: '#c8d3e6' }}>ИС</div>
                    <div className="avatar sm" style={{ background: '#9eb6db' }}>МЯ</div>
                  </div>
                  <span>87 студентов поддержали</span>
                </div>
                <button className="btn primary sm">Поддержать <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></button>
              </footer>
            </article>

            <article className="goal-card">
              <header className="gc-head">
                <div style={{ flex: 1 }}>
                  <div className="gc-meta">
                    <span className="tag purple"><span className="dot"></span>SU:Media</span>
                    <span className="tag outline">долгосрочная</span>
                  </div>
                  <h3>Видеооборудование для репортажей</h3>
                  <p className="gc-desc">Свет, петличный микрофон, gimbal для съёмок ивентов и интервью. Сейчас всё снимаем на одолженный набор.</p>
                </div>
              </header>
              <div className="gc-progress">
                <div className="row sb">
                  <div>
                    <span className="amount">₽ 38,600</span>
                    <span className="of">из ₽ 120,000</span>
                  </div>
                  <span className="pct">32%</span>
                </div>
                <div className="progress lg"><div className="bar" style={{ width: '32%' }}></div></div>
              </div>
              <footer className="gc-foot">
                <div className="supporters">
                  <div className="avatars">
                    <div className="avatar sm" style={{ background: '#e0a8c8' }}>АЛ</div>
                    <div className="avatar sm" style={{ background: '#e6b9d3' }}>ПК</div>
                    <div className="avatar sm" style={{ background: '#dbb3d8' }}>ОН</div>
                  </div>
                  <span>42 студента</span>
                </div>
                <button className="btn secondary sm">Поддержать</button>
              </footer>
            </article>

            <article className="goal-card">
              <header className="gc-head">
                <div style={{ flex: 1 }}>
                  <div className="gc-meta">
                    <span className="tag green"><span className="dot"></span>SU:Core</span>
                    <span className="tag yellow"><Icon id="i-clock" style={{ width: 11, height: 11 }} />осталось 16 ч</span>
                  </div>
                  <h3>Мерч студсовета — осенняя серия</h3>
                  <p className="gc-desc">Худи + тоут + стикерпак с переработанной айдентикой SU. Финал сбора через 16 часов, дальше — производственный заказ.</p>
                </div>
              </header>
              <div className="gc-progress">
                <div className="row sb">
                  <div>
                    <span className="amount">₽ 184,500</span>
                    <span className="of">из ₽ 200,000</span>
                  </div>
                  <span className="pct">92%</span>
                </div>
                <div className="progress lg"><div className="bar" style={{ width: '92%' }}></div></div>
              </div>
              <footer className="gc-foot">
                <div className="supporters">
                  <div className="avatars">
                    <div className="avatar sm" style={{ background: '#a3e0ad' }}>МР</div>
                    <div className="avatar sm" style={{ background: '#a8c0e0' }}>АГ</div>
                    <div className="avatar sm" style={{ background: '#e0a8c8' }}>АЛ</div>
                  </div>
                  <span>148 студентов</span>
                </div>
                <button className="btn primary sm">Завершить <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></button>
              </footer>
            </article>

            <article className="goal-card">
              <header className="gc-head">
                <div style={{ flex: 1 }}>
                  <div className="gc-meta">
                    <span className="tag green"><span className="dot"></span>SU:Core</span>
                    <span className="tag outline">регулярная</span>
                  </div>
                  <h3>Кофе и снэки на общих собраниях</h3>
                  <p className="gc-desc">Кварталный сбор: кофе, чай, печеньки, фрукты для двух open-meeting в месяц. Хватает примерно на 80 встреч.</p>
                </div>
              </header>
              <div className="gc-progress">
                <div className="row sb">
                  <div>
                    <span className="amount">₽ 8,400</span>
                    <span className="of">из ₽ 12,000 (Q3)</span>
                  </div>
                  <span className="pct">70%</span>
                </div>
                <div className="progress lg"><div className="bar" style={{ width: '70%' }}></div></div>
              </div>
              <footer className="gc-foot">
                <div className="supporters">
                  <span>23 регулярных донора</span>
                </div>
                <button className="btn secondary sm">+ ₽ 200</button>
              </footer>
            </article>

            <article className="goal-card completed">
              <header className="gc-head">
                <div style={{ flex: 1 }}>
                  <div className="gc-meta">
                    <span className="tag green"><Icon id="i-check" style={{ width: 11, height: 11 }} />Цель достигнута</span>
                    <span className="tag outline">апрель 2026</span>
                  </div>
                  <h3>Innopolis Open 2026 — призовой фонд</h3>
                  <p className="gc-desc">Призовой фонд для весеннего внутреннего хакатона. Закрыли за 9 дней при поддержке двух партнёров.</p>
                </div>
              </header>
              <div className="gc-progress">
                <div className="row sb">
                  <div>
                    <span className="amount">₽ 450,000</span>
                    <span className="of">из ₽ 450,000</span>
                  </div>
                  <span className="pct">100%</span>
                </div>
                <div className="progress lg"><div className="bar" style={{ width: '100%' }}></div></div>
              </div>
              <footer className="gc-foot">
                <div className="supporters">
                  <span>312 студентов · 2 партнёра</span>
                </div>
                <button className="btn ghost sm">Отчёт <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></button>
              </footer>
            </article>

          </div>

          {/* Transactions */}
          <div className="tx-card">
            <header className="tx-head">
              <div>
                <h3>Публичные транзакции</h3>
                <span className="text-muted" style={{ fontSize: 12 }}>Все траты студсовета с чеками. Доходы — суммой за день.</span>
              </div>
              <div className="tx-controls">
                <div className="seg">
                  {txSegLabels.map((l, i) => (
                    <button key={i} className={txSeg === i ? 'active' : ''} onClick={() => setTxSeg(i)}>{l}</button>
                  ))}
                </div>
                <div className="input-group" style={{ width: 200 }}>
                  <Icon id="i-search" className="ic" />
                  <input placeholder="Найти по описанию" />
                </div>
                <button className="btn secondary"><Icon id="i-download" style={{ width: 14, height: 14 }} />Export .xlsx</button>
              </div>
            </header>

            <table className="tx-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Категория · описание</th>
                  <th>Цель</th>
                  <th style={{ textAlign: 'right' }}>Сумма</th>
                  <th>Чек</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-mono text-muted">08.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic"><Icon id="i-coin" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Доходы за день</span><span className="sub">23 донат-перевода</span></div>
                    </div>
                  </td>
                  <td><span className="tag green"><span className="dot"></span>Мерч серия</span></td>
                  <td style={{ textAlign: 'right' }} className="amount inflow">+ ₽ 18,400</td>
                  <td><span className="ref">сводка</span></td>
                </tr>
                <tr>
                  <td className="text-mono text-muted">07.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic blue"><Icon id="i-camera" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Печать материалов</span><span className="sub">плакаты Summer Days, 60 шт A3</span></div>
                    </div>
                  </td>
                  <td><span className="tag blue"><span className="dot"></span>Summer Days</span></td>
                  <td style={{ textAlign: 'right' }} className="amount outflow">− ₽ 3,150</td>
                  <td><a className="ref" href="#">PDF-018</a></td>
                </tr>
                <tr>
                  <td className="text-mono text-muted">07.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic yellow"><Icon id="i-coin" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Снэки + кофе</span><span className="sub">для open meeting 04.06</span></div>
                    </div>
                  </td>
                  <td><span className="tag outline">Регулярные</span></td>
                  <td style={{ textAlign: 'right' }} className="amount outflow">− ₽ 1,840</td>
                  <td><a className="ref" href="#">PDF-017</a></td>
                </tr>
                <tr>
                  <td className="text-mono text-muted">05.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic purple"><Icon id="i-mic" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Аренда звукового оборудования</span><span className="sub">stand-up evening 14.06</span></div>
                    </div>
                  </td>
                  <td><span className="tag blue"><span className="dot"></span>Open Mic</span></td>
                  <td style={{ textAlign: 'right' }} className="amount outflow">− ₽ 9,000</td>
                  <td><a className="ref" href="#">PDF-016</a></td>
                </tr>
                <tr>
                  <td className="text-mono text-muted">04.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic"><Icon id="i-coin" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Доходы за день</span><span className="sub">17 донат-переводов</span></div>
                    </div>
                  </td>
                  <td><span className="tag green"><span className="dot"></span>Несколько целей</span></td>
                  <td style={{ textAlign: 'right' }} className="amount inflow">+ ₽ 12,650</td>
                  <td><span className="ref">сводка</span></td>
                </tr>
                <tr>
                  <td className="text-mono text-muted">03.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic blue"><Icon id="i-image" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Дизайн мерча</span><span className="sub">оплата фрилансера, осенняя серия</span></div>
                    </div>
                  </td>
                  <td><span className="tag green"><span className="dot"></span>Мерч серия</span></td>
                  <td style={{ textAlign: 'right' }} className="amount outflow">− ₽ 22,000</td>
                  <td><a className="ref" href="#">PDF-015</a></td>
                </tr>
                <tr>
                  <td className="text-mono text-muted">02.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic red"><Icon id="i-mail" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Хостинг + домен SU Portal</span><span className="sub">Yandex Cloud + .ru, годовая оплата</span></div>
                    </div>
                  </td>
                  <td><span className="tag green"><span className="dot"></span>Регулярные</span></td>
                  <td style={{ textAlign: 'right' }} className="amount outflow">− ₽ 14,400</td>
                  <td><a className="ref" href="#">PDF-014</a></td>
                </tr>
                <tr>
                  <td className="text-mono text-muted">01.06.2026</td>
                  <td>
                    <div className="cell-cat">
                      <div className="ic yellow"><Icon id="i-flag" style={{ width: 16, height: 16 }} /></div>
                      <div className="label-stack"><span className="name">Призы Innopolis Open 2026</span><span className="sub">подарочные карты, призовой фонд</span></div>
                    </div>
                  </td>
                  <td><span className="tag green"><span className="dot"></span>IU Open 2026</span></td>
                  <td style={{ textAlign: 'right' }} className="amount outflow">− ₽ 320,000</td>
                  <td><a className="ref" href="#">PDF-013</a></td>
                </tr>
              </tbody>
            </table>

            <div className="row sb" style={{ padding: '14px 22px', background: 'var(--surface-2)', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>
              <span>Показано 8 из 94 за этот квартал</span>
              <button className="btn ghost sm">Показать все <Icon id="i-chevron-d" style={{ width: 12, height: 12 }} /></button>
            </div>
          </div>

        </section>

        {/* Side: donate CTA + report */}
        <aside className="col gap-6">

          <div className="donate-cta">
            <h4><Icon id="i-heart" style={{ width: 16, height: 16 }} />Поддержать SU</h4>
            <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Выберите цель и сумму. Перевод через СБП или ЮMoney, чек прилетит на почту.</p>

            <div className="field">
              <label>Цель</label>
              <select className="select">
                <option>Спортинвентарь для Summer Days</option>
                <option>Видеооборудование SU:Media</option>
                <option>Кофе и снэки на собраниях</option>
                <option>Мерч серия</option>
                <option>На усмотрение SU</option>
              </select>
            </div>

            <div className="field">
              <label>Сумма</label>
              <div className="quick-amounts">
                {quickAmounts.map((a, i) => (
                  <button key={i} className={donateAmount === i ? 'active' : ''} onClick={() => setDonateAmount(i)}>{a}</button>
                ))}
              </div>
            </div>

            <label className="checkbox" style={{ fontSize: 13 }}>
              <input type="checkbox" />
              <span className="box"><Icon id="i-check" style={{ width: 12, height: 12, color: '#fff' }} /></span>
              Указать публично в списке доноров
            </label>

            <button className="btn primary lg">Перевести ₽ 500 <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></button>
            <span className="text-muted" style={{ fontSize: 11, textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>СБП · ЮMONEY · КАРТА · MIR PAY</span>
          </div>

          <div className="report-card">
            <h4>Финансовый отчёт</h4>
            <div className="item">
              <div className="ic"><Icon id="i-download" style={{ width: 14, height: 14 }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>Отчёт Q1 2026 · PDF</div>
                <span className="text-muted">8 стр · опубликован 12 апр</span>
              </div>
            </div>
            <div className="item">
              <div className="ic"><Icon id="i-download" style={{ width: 14, height: 14 }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>Отчёт 2025 · итоговый</div>
                <span className="text-muted">16 стр · публичный аудит</span>
              </div>
            </div>
            <div className="item">
              <div className="ic"><Icon id="i-eye" style={{ width: 14, height: 14 }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>Дашборд расходов</div>
                <span className="text-muted">обновляется ежедневно</span>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </>
  )
}
