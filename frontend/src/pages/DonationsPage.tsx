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
              <li>Telegram-бот студсовета</li>
              <li>Видеооборудование для съёмки ивентов</li>
              <li>Инвентарь и расходники для мероприятий</li>
              <li>Мерч студсовета</li>
            </ul>
            <p className="donate-note">
              Деньги поступают напрямую в студсовет. Крупные траты публикуем в нашем Telegram-канале.
            </p>
          </div>

          <div className="card card-body">
            <div className="row gap-3 mb-4">
              <Icon id="i-shield" style={{ width: 16, height: 16, color: 'var(--accent)' }} />
              <h3 style={{ fontSize: 15 }}>Прозрачность</h3>
            </div>
            <div className="col" style={{ gap: 12 }}>
              {[
                { label: 'Собрано в этом году', value: '₽ 84 200' },
                { label: 'Потрачено', value: '₽ 61 500' },
                { label: 'Донаторов', value: '138 чел.' },
              ].map(item => (
                <div key={item.label} className="row sb" style={{ fontSize: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span className="text-muted">{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.value}</span>
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
