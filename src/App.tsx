import { useEffect, useMemo, useState } from 'react';
import {
  Accessibility,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  Contrast,
  Eye,
  FileText,
  Headphones,
  Mail,
  Menu,
  MapPinned,
  MousePointerClick,
  Pause,
  Phone,
  Play,
  Route,
  TextCursorInput,
  X,
  ZoomIn,
} from 'lucide-react';
import { CampusMap } from './components/CampusMap';
import {
  Building,
  BuildingId,
  admissionDocuments,
  admissionSteps,
  buildings,
  contacts,
  equipment,
  faqs,
  navItems,
  news,
  routes,
  supportCards,
  videoTranscript,
  visitChecklist,
} from './data/content';

type ColorScheme = 'brand' | 'white' | 'black' | 'blue' | 'beige' | 'green';

const colorSchemes: Array<{ id: ColorScheme; label: string }> = [
  { id: 'brand', label: 'ДВГУПС' },
  { id: 'white', label: 'Черным по белому' },
  { id: 'black', label: 'Белым по черному' },
  { id: 'blue', label: 'Синим по голубому' },
  { id: 'beige', label: 'Коричневым по бежевому' },
  { id: 'green', label: 'Зеленым по серому' },
];

const equipmentIcons = {
  vision: Eye,
  mobility: Accessibility,
  hearing: Headphones,
  safety: CheckCircle2,
};

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('brand');
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBuildingId, setActiveBuildingId] = useState<BuildingId>('1');
  const [hoveredBuildingId, setHoveredBuildingId] = useState<BuildingId | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const activeBuilding = useMemo(
    () => buildings.find((building) => building.id === activeBuildingId) ?? buildings[0],
    [activeBuildingId],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.scheme = colorScheme;
    root.dataset.text = largeText ? 'large' : 'normal';
    root.dataset.motion = reduceMotion ? 'reduced' : 'full';
  }, [colorScheme, largeText, reduceMotion]);

  useEffect(() => {
    if (!selectedBuilding) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedBuilding(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedBuilding]);

  const selectBuilding = (building: Building) => {
    setActiveBuildingId(building.id);
    setSelectedBuilding(building);
  };

  const activeSchemeIndex = Math.max(
    0,
    colorSchemes.findIndex((scheme) => scheme.id === colorScheme),
  );
  const activeScheme = colorSchemes[activeSchemeIndex] ?? colorSchemes[0];
  const switchColorScheme = () => {
    const nextIndex = (activeSchemeIndex + 1) % colorSchemes.length;
    setColorScheme(colorSchemes[nextIndex].id);
  };

  return (
    <>
      <a className="skipLink" href="#main">
        Перейти к содержимому
      </a>
      <header className="siteHeader">
        <div className="headerTop">
          <a className="brand" href="#main" aria-label="ДВГУПС доступная среда, на главную">
            <span className="brandMark" aria-hidden="true">
              <img src="media/dvgups-logo.png" alt="" />
            </span>
            <span>
              <strong>ДВГУПС</strong>
              <small>Доступная среда кампуса</small>
            </span>
          </a>

          <button
            type="button"
            className="menuToggle"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={22} />
            <span>Меню</span>
          </button>

          <nav id="main-navigation" className={`nav ${menuOpen ? 'isOpen' : ''}`} aria-label="Основные разделы">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="accessPanel" aria-label="Настройки доступности">
          <button
            type="button"
            className="toolButton schemeButton"
            aria-label={`Цветовая схема ${activeSchemeIndex + 1} из ${colorSchemes.length}: ${activeScheme.label}`}
            title={`Текущая схема: ${activeScheme.label}`}
            onClick={switchColorScheme}
          >
            <Contrast size={18} />
            <span className={`schemeSwatch ${activeScheme.id}`} aria-hidden="true" />
            <span>{`Цвета ${activeSchemeIndex + 1}/${colorSchemes.length}`}</span>
          </button>
          <button type="button" className="toolButton" aria-pressed={largeText} onClick={() => setLargeText(!largeText)}>
            <ZoomIn size={18} />
            <span>{largeText ? 'Обычный текст' : 'Крупный текст'}</span>
          </button>
          <button
            type="button"
            className="toolButton"
            aria-pressed={reduceMotion}
            aria-label={
              reduceMotion
                ? 'Движение снижено. Нажмите, чтобы вернуть плавные переходы'
                : 'Меньше движения. Отключает плавный скролл и анимационные переходы'
            }
            title={reduceMotion ? 'Плавные переходы отключены' : 'Отключить плавный скролл и анимационные переходы'}
            onClick={() => setReduceMotion(!reduceMotion)}
          >
            <Pause size={18} />
            <span>{reduceMotion ? 'Движение снижено' : 'Меньше движения'}</span>
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero sectionBand" id="about">
          <div className="heroContent">
            <div className="heroCopy">
              <span className="eyebrow">Хабаровск, ул. Серышева, 47</span>
              <h1>ДВГУПС: карта доступной среды</h1>
              <p>
                Полезный навигатор для студентов, абитуриентов и гостей с инвалидностью и ОВЗ: точная схема корпусов,
                маршруты, оборудование, видео-паспорт, поступление и контакты.
              </p>
              <div className="heroActions">
                <a className="primaryAction" href="#campus">
                  <MapPinned size={20} />
                  Открыть карту
                </a>
                <a className="secondaryAction" href="#video-passport">
                  <Play size={20} />
                  Видео-паспорт
                </a>
              </div>
            </div>
            <div className="heroPanel" aria-label="Ключевая информация">
              <div>
                <strong>10</strong>
                <span>объектов на интерактивной карте</span>
              </div>
              <div>
                <strong>8</strong>
                <span>мест на спецпарковке</span>
              </div>
              <div>
                <strong>1</strong>
                <span>аудитория с адаптированным оборудованием</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sectionBand newsBand" id="news">
          <div className="sectionHeader">
            <span className="eyebrow">Новости</span>
            <h2>Коротко о важном</h2>
            <a href="https://dvgups.ru/" target="_blank" rel="noreferrer">
              Все новости ДВГУПС
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="newsGrid">
            {news.map((item) => (
              <article className="newsCard" key={item.title}>
                <span>{item.tag}</span>
                <time>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sectionBand campusBand" id="campus">
          <div className="sectionHeader">
            <span className="eyebrow">Карта</span>
            <h2>Корпуса и доступные объекты</h2>
            <p>Наведите курсор, выберите объект из списка или используйте клавиатуру. По клику откроется описание, маршрут и место для медиа.</p>
          </div>
          <div className="campusLayout">
            <CampusMap
              buildings={buildings}
              activeId={hoveredBuildingId ?? activeBuildingId}
              onHover={setHoveredBuildingId}
              onLeave={() => setHoveredBuildingId(null)}
              onSelect={selectBuilding}
            />
            <aside className="buildingInfo" aria-live="polite">
              <span className="buildingBadge">Объект {activeBuilding.id}</span>
              <h3>{activeBuilding.title}</h3>
              <p>{activeBuilding.short}</p>
              <dl className="buildingMeta">
                <div>
                  <dt>Назначение</dt>
                  <dd>{activeBuilding.purpose}</dd>
                </div>
                <div>
                  <dt>Маршрут</dt>
                  <dd>{activeBuilding.route}</dd>
                </div>
              </dl>
              <button type="button" className="primaryAction" onClick={() => setSelectedBuilding(activeBuilding)}>
                <MousePointerClick size={20} />
                Подробнее
              </button>
            </aside>
          </div>

          <div className="objectList" aria-label="Список объектов на карте">
            {buildings.map((building) => (
              <button
                type="button"
                key={building.id}
                className={building.id === activeBuildingId ? 'isActive' : ''}
                onMouseEnter={() => setHoveredBuildingId(building.id)}
                onMouseLeave={() => setHoveredBuildingId(null)}
                onFocus={() => setHoveredBuildingId(building.id)}
                onBlur={() => setHoveredBuildingId(null)}
                onClick={() => selectBuilding(building)}
              >
                <span>{building.id}</span>
                {building.title}
              </button>
            ))}
          </div>
        </section>

        <section className="sectionBand routesBand" id="routes">
          <div className="sectionHeader">
            <span className="eyebrow">Маршруты</span>
            <h2>Как пройти по кампусу</h2>
            <p>Основные входы, парковка и центральные переходы кампуса собраны в понятные сценарии движения.</p>
          </div>
          <div className="infoGrid">
            {routes.map((route) => (
              <article className="infoCard" key={route.title}>
                <Route size={26} />
                <span>{route.meta}</span>
                <h3>{route.title}</h3>
                <p>{route.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sectionBand supportBand" id="support">
          <div className="sectionHeader">
            <span className="eyebrow">Помощь</span>
            <h2>Как получить сопровождение</h2>
            <p>Раздел помогает понять, что сделать до визита, у входа и внутри корпуса.</p>
          </div>
          <div className="splitLayout">
            <div className="infoGrid compact">
              {supportCards.map((card) => (
                <article className="infoCard" key={card.title}>
                  <Accessibility size={26} />
                  <span>{card.meta}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
            <div className="checkPanel">
              <div className="documentsTitle">
                <ClipboardCheck size={24} />
                <h3>Памятка перед посещением</h3>
              </div>
              <ul>
                {visitChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="sectionBand videoBand" id="video-passport">
          <div className="sectionHeader">
            <span className="eyebrow">Видео-паспорт</span>
            <h2>Паспорт доступности для студентов с инвалидностью и ОВЗ</h2>
            <p>
              Короткий видеообзор показывает входные группы, маршруты, навигацию, санитарные помещения и оборудование
              специализированной аудитории.
            </p>
          </div>
          <div className="videoPassport">
            <div className="videoFrame">
              <video
                  controls
                  preload="metadata"
                  poster="media/video-passport-poster.svg"
                  src="media/accessibility-passport.mp4"
              ></video>
            </div>
          </div>
          <details className="transcriptBox" open>
            <summary>Текстовая расшифровка видео-паспорта</summary>
            {videoTranscript.map((paragraph, index) => (
              <p key={`${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </details>
        </section>

        <section className="sectionBand equipmentBand" id="equipment">
          <div className="sectionHeader">
            <span className="eyebrow">Оборудование</span>
            <h2>Специальные средства обучения</h2>
            <p>Оборудование помогает работать с учебными материалами, ориентироваться и получать сигналы оповещения.</p>
          </div>
          <div className="equipmentGrid">
            {equipment.map((item) => {
              const Icon = equipmentIcons[item.group];
              return (
                <article className="equipmentItem" key={item.title}>
                  <span className={`equipmentIcon ${item.group}`}>
                    <Icon size={22} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="sectionBand admissionBand" id="admission">
          <div className="sectionHeader">
            <span className="eyebrow">Поступление</span>
            <h2>Правила и документы</h2>
            <a href="https://abiturient.dvgups.ru/pri-spec-och" target="_blank" rel="noreferrer">
              Страница абитуриента
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="admissionLayout">
            <div className="timeline">
              {admissionSteps.map((step, index) => (
                <div className="timelineItem" key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <div className="documentsBox">
              <div className="documentsTitle">
                <FileText size={24} />
                <h3>Документы</h3>
              </div>
              <ul>
                {admissionDocuments.map((document) => (
                  <li key={document}>{document}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="sectionBand faqBand" id="faq">
          <div className="sectionHeader">
            <span className="eyebrow">FAQ</span>
            <h2>Частые вопросы</h2>
            <p>Короткие ответы для первого знакомства с доступной средой и поступлением.</p>
          </div>
          <div className="faqList">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>
                  <CircleHelp size={22} />
                  {item.question}
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sectionBand contactsBand" id="contacts">
          <div className="sectionHeader">
            <span className="eyebrow">Контакты</span>
            <h2>Куда обратиться</h2>
            <p>Контактные данные взяты с официального сайта университета.</p>
          </div>
          <div className="contactsGrid">
            {contacts.map((contact) => (
              <article className="contactCard" key={contact.title}>
                <Building2 size={24} />
                <h3>{contact.title}</h3>
                <p>{contact.address}</p>
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>
                  <Phone size={18} />
                  {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Mail size={18} />
                  {contact.email}
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer" aria-label="Дополнительная информация">
        <div className="footerBrand">
          <span className="brandMark" aria-hidden="true">
            <img src="media/dvgups-logo.png" alt="" />
          </span>
          <div>
            <strong>ДВГУПС</strong>
            <p>Доступная среда кампуса.</p>
          </div>
        </div>
        <div className="footerContacts">
          <a href="https://dvgups.ru/sveden/objects" target="_blank" rel="noreferrer">
            Сведения о доступной среде
          </a>
          <a href="tel:+74212407321">+7 (4212) 40-73-21</a>
          <a href="mailto:root@festu.khv.ru">root@festu.khv.ru</a>
        </div>
      </footer>

      {selectedBuilding && (
        <div className="modalOverlay" role="presentation" onMouseDown={() => setSelectedBuilding(null)}>
          <section
            className="buildingModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="buildingDialogTitle"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="closeButton" type="button" onClick={() => setSelectedBuilding(null)} aria-label="Закрыть">
              <X size={24} />
            </button>
            <span className="buildingBadge">Объект {selectedBuilding.id}</span>
            <h2 id="buildingDialogTitle">{selectedBuilding.title}</h2>
            {selectedBuilding.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="modalColumns">
              <div>
                <h3>Назначение</h3>
                <p>{selectedBuilding.purpose}</p>
                <h3>Маршрут</h3>
                <p>{selectedBuilding.route}</p>
                <h3>Доступность</h3>
                <ul>
                  {selectedBuilding.accessibility.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={`mediaPlaceholder ${selectedBuilding.mediaVideo || selectedBuilding.mediaImage ? 'hasMedia' : ''}`}>
                {selectedBuilding.mediaVideo ? (
                    <video className="modalMediaVideo" controls preload="metadata" src={selectedBuilding.mediaVideo}>
                      Ваш браузер не поддерживает видео.
                    </video>
                ) : selectedBuilding.mediaImage ? (
                    <img className="modalMediaImage" src={selectedBuilding.mediaImage} alt={selectedBuilding.mediaHint} />
                ) : (
                    <>
                      <TextCursorInput size={30} />
                      <strong>Место для фото или видео</strong>
                      <span>{selectedBuilding.mediaHint}</span>
                    </>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
