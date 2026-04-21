import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/portfolio.css";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Вайбкодинг-проекты — Елена Сидоренко" },
      { name: "description", content: "T&D-методолог — не только проектирую обучение, но и создаю цифровые инструменты для него" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap" },
    ],
  }),
});

function PortfolioPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Intersection observer for reveal animations
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    el.querySelectorAll('.reveal').forEach(r => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  // Escape key for lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const hashPassword = useCallback(async (pw: string) => {
    const data = new TextEncoder().encode(pw);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  const checkPassword = useCallback(async () => {
    const pw = pwRef.current?.value.trim() || '';
    const hash = await hashPassword(pw);
    if (hash === 'ab780348c44733fb0ceb90b0d9cc3f0b606946914481e488cb5773c5e32af14c') {
      setUnlocked(true);
      setPwError(false);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  }, [hashPassword]);

  const scrollToKanban = useCallback(() => {
    document.getElementById('kanban')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const openLightbox = useCallback((src: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxSrc(src);
  }, []);

  const ThumbWithImage = ({ src }: { src: string }) => (
    <div
      className="k-card-thumb"
      style={{ backgroundImage: `url('${src}')`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'none' }}
      onClick={(e) => openLightbox(src, e)}
    />
  );

  const ThumbPlaceholder = () => (
    <div className="k-card-thumb">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
      <span>скриншот</span>
    </div>
  );

  return (
    <div className="portfolio-page" ref={pageRef}>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Вайбкодинг-проекты</div>
          <h1>Цифровая мастерская<br/><em>Елены Сидоренко</em></h1>
          <p className="hero-sub">T&D-методолог — не только проектирую обучение, но и создаю цифровые инструменты для него</p>
          <button className="hero-cta" onClick={scrollToKanban}>
            Смотреть проекты
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar reveal">
        <div className="stat"><div className="stat-num">9</div><div className="stat-label">проектов</div></div>
        <div className="stat"><div className="stat-num">3</div><div className="stat-label">категории</div></div>
      </div>

      {/* Kanban */}
      <section className="kanban-section" id="kanban">
        <div className="kanban">
          {/* Column 1: Инфраструктура */}
          <div className="col reveal">
            <div className="col-head ch-infra">
              <div className="col-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg></div>
              <div className="col-info"><div className="col-label">Инфраструктура</div><div className="col-sublabel">Методическая база</div></div>
              <div className="col-count">3</div>
            </div>
            <div className="col-body cb-infra">
              <a href="https://sev-umm.lovable.app" className="k-card" target="_blank" rel="noopener noreferrer">
                <ThumbWithImage src="img/registry.png" />
                <div className="k-card-head"><div className="k-card-name">Реестр учебно-методических материалов</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Каталог образовательных решений. Перед разработкой новой программы — быстрая проверка: есть ли уже решение с нужным содержательным ядром.</div>
                <span className="k-card-tag kt-infra">платформа</span>
              </a>
              <a href="https://sev-library.lovable.app" className="k-card" target="_blank" rel="noopener noreferrer">
                <ThumbWithImage src="img/library.png" />
                <div className="k-card-head"><div className="k-card-name">Библиотека активностей для тренера</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Структурированная коллекция тренерских активностей — разминки, упражнения, рефлексии. Быстрый подбор по цели, формату, размеру группы.</div>
                <span className="k-card-tag kt-infra">инструмент</span>
              </a>
              <a href="#" className="k-card" aria-disabled="true" onClick={(e) => e.preventDefault()}>
                <ThumbWithImage src="img/schedule.png" />
                <div className="k-card-head"><div className="k-card-name">Расписание центра</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Единое расписание T&amp;D-центра: фильтры по сотрудникам, типам событий, локациям и датам. Графики Ганта в двух разрезах — по сотрудникам и по событиям.</div>
                <span className="k-card-tag kt-infra">платформа</span>
              </a>
            </div>
          </div>

          {/* Column 2: Развитие навыков */}
          <div className="col reveal">
            <div className="col-head ch-skills">
              <div className="col-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 3 2 5.5 4 7.5L12 22l3-5.5c2-2 4-4.5 4-7.5a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></div>
              <div className="col-info"><div className="col-label">Развитие навыков</div><div className="col-sublabel">Тренажёры мышления</div></div>
              <div className="col-count">2</div>
            </div>
            <div className="col-body cb-skills">
              <a href="https://sevtrain.lovable.app" className="k-card" target="_blank" rel="noopener noreferrer">
                <ThumbWithImage src="img/train.png" />
                <div className="k-card-head"><div className="k-card-name">Великое ограбление почтового поезда</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Браузерный тренажёр аналитического мышления. Расследуй знаменитое ограбление: анализируй улики, строй логические цепочки, проверяй гипотезы.</div>
                <span className="k-card-tag kt-skills">тренажёр</span>
              </a>
              <a href="https://sev-mystery.lovable.app" className="k-card" target="_blank" rel="noopener noreferrer">
                <ThumbWithImage src="img/mecenat.png" />
                <div className="k-card-head"><div className="k-card-name">Загадка мецената</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Браузерный тренажёр креативного мышления. Россия, 1888 год. Меценат Корзинкин готовит четыре серии испытаний. 4 серии × 3 задания, ~45 минут, 3 варианта контента для повторных прохождений.</div>
                <span className="k-card-tag kt-skills">тренажёр</span>
              </a>
            </div>
          </div>

          {/* Column 3: Автоматизация */}
          <div className="col reveal">
            <div className="col-head ch-auto">
              <div className="col-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
              <div className="col-info"><div className="col-label">Автоматизация</div><div className="col-sublabel">Ускорение разработки</div></div>
              <div className="col-count">3</div>
            </div>
            <div className="col-body cb-auto">
              <a href="https://sev-prompt.lovable.app" className="k-card" target="_blank" rel="noopener noreferrer">
                <ThumbWithImage src="img/promtoteka.png" />
                <div className="k-card-head"><div className="k-card-name">Промтотека</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Единая платформа с библиотеками промтов для корпоративных задач. Первая библиотека — «Разработка обучения» по модели ADDIE, 48 промтов.</div>
                <span className="k-card-tag kt-auto">платформа</span>
              </a>
              <a href="https://sev-calculator-t2m.lovable.app" className="k-card" target="_blank" rel="noopener noreferrer">
                <ThumbWithImage src="img/t2m.png" />
                <div className="k-card-head"><div className="k-card-name">Калькулятор T2M</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Интерактивный калькулятор Time-to-Market. Позволяет увидеть, за счёт чего можно сократить время разработки образовательного продукта при помощи ИИ.</div>
                <span className="k-card-tag kt-auto">инструмент</span>
              </a>
              <a href="#" className="k-card" aria-disabled="true" onClick={(e) => e.preventDefault()}>
                <ThumbPlaceholder />
                <div className="k-card-head"><div className="k-card-name">Генерация кейсов</div><span className="k-card-arrow">→</span></div>
                <div className="k-card-desc">Автоматическая генерация учебных кейсов на основе поиска актуальных новостей в области железнодорожного транспорта по всему миру. Свежая фактура для тренингов и разборов — без ручного мониторинга.</div>
                <span className="k-card-tag kt-auto">инструмент</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Closed projects */}
      <section className="closed-section reveal open" id="closed-section">
        <div className="closed-trigger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span className="closed-trigger-text">Проекты в разработке</span>
          <svg className="closed-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <div className="closed-body" id="closed-projects-body">
          {!unlocked && (
            <div className="closed-pw">
              <input
                type="password"
                ref={pwRef}
                placeholder="Введите пароль"
                style={pwError ? { borderColor: '#CF3B5F' } : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') checkPassword();
                }}
              />
              <button type="button" onClick={() => {
                void checkPassword();
              }}>Войти</button>
            </div>
          )}
          {pwError && <div className="closed-pw-error" style={{ display: 'block' }}>Неверный пароль</div>}
          <div className={`closed-projects${unlocked ? ' unlocked' : ''}`}>
            <a href="#" className="k-card" target="_blank" rel="noopener noreferrer">
              <ThumbPlaceholder />
              <div className="k-card-head"><div className="k-card-name">Портфолио</div><span className="k-card-arrow">→</span></div>
              <div className="k-card-desc">Лендинг-портфолио с подстраницами кейсов.</div>
              <span className="k-card-tag" style={{ background: 'rgba(83,53,49,0.1)', color: 'var(--cocoa)' }}>сайт</span>
            </a>
            <a href="#" className="k-card" target="_blank" rel="noopener noreferrer">
              <ThumbPlaceholder />
              <div className="k-card-head"><div className="k-card-name">Сайт TeamLab</div><span className="k-card-arrow">→</span></div>
              <div className="k-card-desc">4 HTML-страницы с единой дизайн-системой.</div>
              <span className="k-card-tag" style={{ background: 'rgba(83,53,49,0.1)', color: 'var(--cocoa)' }}>сайт</span>
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about reveal">
        <div className="about-photo">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="photo-hint">фото</span>
        </div>
        <div className="about-text">
          <h2>Об авторе</h2>
          <p><strong>Елена Сидоренко</strong> — T&D-методолог. Создаю не только программы развития, но и цифровые инструменты для их поддержки — через вайбкодинг, нейросети и продуктовый подход к образованию.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="portfolio-footer">
        <p><a href="tel:+79262582905">8 926 258 29 05</a> · <a href="mailto:sev1coaching@gmail.com">sev1coaching@gmail.com</a></p>
        <p style={{ marginTop: '0.4rem' }}>© 2026 Елена Сидоренко</p>
      </footer>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="lightbox active" onClick={(e) => { if (e.target === e.currentTarget) setLightboxSrc(null); }}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>×</button>
          <img src={lightboxSrc} alt="Превью проекта" />
        </div>
      )}
    </div>
  );
}
