import { Icon } from '../components/Icon'

export default function DonationsPage() {
  return (
    <>
      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Поддержка</span>
          <h1>Donations</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>
            Студсовет существует на взносы студентов и партнёров.
          </p>
        </div>
      </div>

      <div className="donate-static">
        <div className="col gap-6">
          <div className="card card-body">
            <h2 style={{ marginBottom: 16 }}>На что идут средства</h2>
            <ul className="donate-list">
              <li>Печатные материалы — плакаты, брошюры, баннеры для мероприятий</li>
              <li>Telegram-бот студсовета и инфраструктура SU Portal</li>
              <li>Видеооборудование для съёмки ивентов</li>
              <li>Инвентарь и расходники для мероприятий (гирлянды, реквизит, звук)</li>
              <li>Мерч студсовета</li>
              <li>Призы для победителей хакатонов и турниров</li>
              <li>Аренда оборудования для концертов и кино-вечеров</li>
            </ul>
            <p className="donate-note">
              Деньги поступают напрямую в студсовет. Крупные траты публикуем в нашем Telegram-канале.
            </p>
          </div>

          <div className="card card-body">
            <h2 style={{ marginBottom: 16, fontSize: 16 }}>Что купили в 2026</h2>
            <div className="col" style={{ gap: 12 }}>
              {[
                { label: 'Проектор и экран для Movie Night', value: '₽ 18 400' },
                { label: 'Гребные лодки · аренда на сезон', value: '₽ 12 000' },
                { label: 'Полиграфия Welcome Week + мерч', value: '₽ 9 300' },
                { label: 'Призовой фонд Innopolis Open 2026', value: '₽ 21 800' },
              ].map(item => (
                <div key={item.label} className="row sb" style={{ fontSize: 13, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span className="text-muted">{item.label}</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="donate-cta-simple">
          <div className="row gap-2" style={{ justifyContent: 'center' }}>
            <Icon id="i-heart" style={{ width: 18, height: 18, color: 'var(--accent)' }} />
            <h3>Поддержать студсовет</h3>
          </div>
          <div className="qr-placeholder">QR</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', maxWidth: 220 }}>
            Отсканируйте QR-код или нажмите кнопку ниже
          </p>
          <a
            className="btn primary"
            style={{ width: '100%', justifyContent: 'center' }}
            href="https://www.tbank.ru"
            target="_blank"
            rel="noopener noreferrer"
          >
            Перейти к сбору <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
          </a>
          <p style={{ fontSize: 11, color: 'var(--muted-2)', textAlign: 'center' }}>
            Сбор через T-Bank · безопасно
          </p>
        </div>
      </div>
    </>
  )
}
