const menu=document.querySelector('.menu');const nav=document.querySelector('.site-header nav');if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))})}
const deck=document.querySelector('.presentation');const slides=[...document.querySelectorAll('.slide')];const controls=document.querySelector('.slide-controls');if(deck&&controls&&slides.length){slides.forEach((s,i)=>s.id=`slide-${i+1}`);const counter=controls.querySelector('b');const prev=controls.querySelector('[data-dir="-1"]');const next=controls.querySelector('[data-dir="1"]');const titles=slides.map((s,i)=>s.querySelector('h2')?.textContent.trim()||s.querySelector('h1')?.textContent.trim()||`Slide ${i+1}`);const go=i=>slides[Math.max(0,Math.min(slides.length-1,i))].scrollIntoView({behavior:'smooth'});const overview=document.createElement('div');overview.className='deck-overview';overview.innerHTML=`<div class="overview-panel"><div class="overview-head"><span>Содержание</span><button type="button" aria-label="Закрыть">×</button></div><div class="overview-grid">${titles.map((t,i)=>`<button type="button" data-slide="${i}"><small>${String(i+1).padStart(2,'0')}</small><span>${t}</span></button>`).join('')}</div></div>`;document.body.append(overview);const openOverview=document.createElement('button');openOverview.type='button';openOverview.className='overview-toggle';openOverview.textContent='☷';openOverview.title='Все слайды';controls.prepend(openOverview);const fullscreen=document.createElement('button');fullscreen.type='button';fullscreen.className='fullscreen-toggle';fullscreen.textContent='⛶';fullscreen.title='На весь экран';controls.append(fullscreen);const dots=document.createElement('nav');dots.className='deck-dots';dots.setAttribute('aria-label','Навигация по слайдам');dots.innerHTML=titles.map((t,i)=>`<button type="button" data-slide="${i}" title="${t.replaceAll('"','&quot;')}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');deck.append(dots);const cover=slides[0].querySelector('.slide-copy');if(cover&&slides.length>1){const map=document.createElement('div');map.className='cover-map';map.innerHTML=titles.slice(1).map((t,i)=>`<button type="button" data-slide="${i+1}"><small>${String(i+1).padStart(2,'0')}</small><span>${t}</span><b>↗</b></button>`).join('');cover.append(map)}const current=()=>Math.max(0,Number(counter.textContent)-1);const update=()=>{let best=0,dist=Infinity;slides.forEach((s,i)=>{const d=Math.abs(s.offsetTop-deck.scrollTop);if(d<dist){dist=d;best=i}});counter.textContent=best+1;dots.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===best));prev.disabled=best===0;next.disabled=best===slides.length-1;deck.style.setProperty('--deck-progress',`${(best+1)/slides.length*100}%`)};const clickSlide=e=>{const b=e.target.closest('[data-slide]');if(!b)return;overview.classList.remove('open');go(Number(b.dataset.slide))};controls.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!b.dataset.dir)return;go(current()+Number(b.dataset.dir))});dots.addEventListener('click',clickSlide);overview.addEventListener('click',e=>{if(e.target===overview||e.target.closest('.overview-head button'))overview.classList.remove('open');else clickSlide(e)});cover?.addEventListener('click',clickSlide);openOverview.addEventListener('click',()=>overview.classList.add('open'));fullscreen.addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.());deck.addEventListener('scroll',update,{passive:true});document.addEventListener('keydown',e=>{if(e.key==='Escape')overview.classList.remove('open');if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='PageDown')go(current()+1);if(e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='PageUp')go(current()-1);if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1)});let touchY=0;deck.addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});deck.addEventListener('touchend',e=>{const dy=touchY-e.changedTouches[0].clientY;if(Math.abs(dy)>55)go(current()+(dy>0?1:-1))},{passive:true});update()}
const progress=document.querySelector('.reading-progress');if(progress){const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'};addEventListener('scroll',updateProgress,{passive:true});updateProgress()}
const themeOrder=['light','dark','sky'];const savedTheme=localStorage.getItem('drevo-theme');const fallbackTheme=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.dataset.theme=themeOrder.includes(savedTheme)?savedTheme:fallbackTheme;const languageBox=document.querySelector('.languages');if(languageBox){const themeButton=document.createElement('button');themeButton.className='theme-toggle';themeButton.type='button';const themeNames={ru:{light:'Светлая',sky:'Звёздная',dark:'Тёмная'},uk:{light:'Світла',sky:'Зоряна',dark:'Темна'},en:{light:'Light',sky:'Starry',dark:'Dark'},fr:{light:'Claire',sky:'Étoilée',dark:'Sombre'},de:{light:'Hell',sky:'Sternenhimmel',dark:'Dunkel'}};const icons={light:'☀',sky:'✦',dark:'☾'};const paintTheme=()=>{const theme=document.documentElement.dataset.theme;const names=themeNames[document.documentElement.lang]||themeNames.ru;themeButton.textContent=icons[theme];themeButton.setAttribute('aria-label',names[theme]+' — '+(document.documentElement.lang==='ru'?'переключить тему':'switch theme'));themeButton.title=names[theme]};paintTheme();themeButton.addEventListener('click',()=>{const current=themeOrder.indexOf(document.documentElement.dataset.theme);const next=themeOrder[(current+1)%themeOrder.length];document.documentElement.dataset.theme=next;localStorage.setItem('drevo-theme',next);paintTheme()});languageBox.before(themeButton)}
const introCopy=document.querySelector('#about .intro-copy');if(introCopy&&introCopy.children.length>2){const words={ru:['Развернуть статью','Свернуть статью'],uk:['Розгорнути статтю','Згорнути статтю'],en:['Read full article','Collapse article'],fr:["Lire l’article complet","Réduire l’article"],de:['Artikel vollständig lesen','Artikel einklappen']};const labels=words[document.documentElement.lang]||words.ru;const shell=document.createElement('div');shell.className='intro-article-shell collapsed';introCopy.before(shell);shell.append(introCopy);const button=document.createElement('button');button.type='button';button.className='intro-toggle';button.setAttribute('aria-expanded','false');button.textContent=labels[0]+' ↓';shell.append(button);button.addEventListener('click',()=>{const collapsed=shell.classList.toggle('collapsed');button.setAttribute('aria-expanded',String(!collapsed));button.textContent=(collapsed?labels[0]+' ↓':labels[1]+' ↑');if(collapsed)shell.scrollIntoView({behavior:'smooth',block:'center'})})}

/* Contextual article links for the interactive presentation. */
if(deck&&slides.length){
  const lang=document.documentElement.lang||'ru';
  const ui={ru:{related:'Связанные главы',open:'Открыть статью',explore:'Исследовать материалы'},uk:{related:'Пов’язані розділи',open:'Відкрити статтю',explore:'Дослідити матеріали'},en:{related:'Related chapters',open:'Open article',explore:'Explore materials'},fr:{related:'Chapitres associés',open:'Ouvrir l’article',explore:'Explorer les ressources'},de:{related:'Passende Kapitel',open:'Artikel öffnen',explore:'Materialien entdecken'}}[lang]||{};
  const names={
    cosmic:{ru:'Космическая Вера',uk:'Космічна Віра',en:'Cosmic Faith',fr:'Foi cosmique',de:'Kosmischer Glaube'},
    system:{ru:'Система DREVO',uk:'Система DREVO',en:'DREVO System',fr:'Système DREVO',de:'DREVO-System'},
    spiritual:{ru:'Основы духовного понимания',uk:'Основи духовного розуміння',en:'Foundations of spiritual understanding',fr:'Fondements de la compréhension spirituelle',de:'Grundlagen spirituellen Verständnisses'},
    faith:{ru:'Почему это называется Верой',uk:'Чому це називається Вірою',en:'Why it is called Faith',fr:'Pourquoi cela s’appelle la Foi',de:'Warum es Glaube heißt'},
    research:{ru:'Исследования человека',uk:'Дослідження людини',en:'Human research',fr:'Recherche sur l’être humain',de:'Forschung über den Menschen'},
    awareness:{ru:'Осознанность',uk:'Усвідомленість',en:'Awareness',fr:'Conscience',de:'Achtsamkeit'},
    nature:{ru:'Гармония с природой',uk:'Гармонія з природою',en:'Harmony with nature',fr:'Harmonie avec la nature',de:'Harmonie mit der Natur'},
    love:{ru:'Любовь',uk:'Любов',en:'Love',fr:'Amour',de:'Liebe'},
    conscience:{ru:'Совесть',uk:'Совість',en:'Conscience',fr:'Conscience morale',de:'Gewissen'},
    values:{ru:'Ценности',uk:'Цінності',en:'Values',fr:'Valeurs',de:'Werte'},
    responsibility:{ru:'Ответственность',uk:'Відповідальність',en:'Responsibility',fr:'Responsabilité',de:'Verantwortung'},
    justice:{ru:'Справедливость',uk:'Справедливість',en:'Justice',fr:'Justice',de:'Gerechtigkeit'},
    harmony:{ru:'Гармония жизни',uk:'Гармонія життя',en:'Harmony of life',fr:'Harmonie de la vie',de:'Harmonie des Lebens'},
    practice:{ru:'Практическое применение DREVO',uk:'Практичне застосування DREVO',en:'Practical application of DREVO',fr:'Application pratique de DREVO',de:'Praktische Anwendung von DREVO'},
    community:{ru:'Практика гармоничного сообщества',uk:'Практика гармонійної спільноти',en:'Practice for a harmonious community',fr:'Pratique d’une communauté harmonieuse',de:'Praxis einer harmonischen Gemeinschaft'}
  };
  const pointNames={
    life:{ru:'Жизнь',uk:'Життя',en:'Life',fr:'Vie',de:'Leben'},
    person:{ru:'Живой человек',uk:'Жива людина',en:'Living person',fr:'Être humain vivant',de:'Lebendiger Mensch'},
    development:{ru:'Личностное развитие',uk:'Особистісний розвиток',en:'Personal development',fr:'Développement personnel',de:'Persönliche Entwicklung'},
    soul:{ru:'Душа и духовный человек',uk:'Душа і духовна людина',en:'Soul and spiritual person',fr:'Âme et personne spirituelle',de:'Seele und geistiger Mensch'},
    culture:{ru:'Культура',uk:'Культура',en:'Culture',fr:'Culture',de:'Kultur'},
    truth:{ru:'Истина',uk:'Істина',en:'Truth',fr:'Vérité',de:'Wahrheit'},
    freedom:{ru:'Вольный человек',uk:'Вільна людина',en:'Free person',fr:'Personne libre',de:'Freier Mensch'},
    creation:{ru:'Творчество',uk:'Творчість',en:'Creativity',fr:'Créativité',de:'Kreativität'},
    society:{ru:'Гармоничное сообщество',uk:'Гармонійна спільнота',en:'Harmonious community',fr:'Communauté harmonieuse',de:'Harmonische Gemeinschaft'},
    knowledge:{ru:'Знание и исследование',uk:'Знання і дослідження',en:'Knowledge and research',fr:'Connaissance et recherche',de:'Wissen und Forschung'},
    harmonyCore:{ru:'Гармония',uk:'Гармонія',en:'Harmony',fr:'Harmonie',de:'Harmonie'}
  };
  Object.assign(names,pointNames);
  const title=k=>names[k]?.[lang]||names[k]?.ru||k;
  const resources=[
    [],
    [['cosmic-faith.html','cosmic'],['system.html','system'],['hl-02-ii-основы-духовного-понимания.html','spiritual']],
    [['faith.html','faith'],['research.html','research'],['vi-23-вера.html','faith'],['vi-31-осознанность.html','awareness']],
    [['cosmic-faith.html','cosmic'],['vii-08-гармония-с-природой.html','nature'],['hl-08-viii-гармония-с-природой.html','nature']],
    [['vi-08-любовь.html','love'],['vi-13-совесть.html','conscience'],['vii-13-ценности.html','values'],['vii-25-ответственность.html','responsibility'],['vii-14-справедливость.html','justice']],
    [['harmony-life.html','harmony'],['hl-16-практическое-применение-концепции-древо.html','practice'],['vi-32-практическое-применение-концепции-древо.html','practice'],['vii-42-практическое-применение-концепции-гармонии-в-рамках-проект.html','community']]
  ];
  const cover=slides[0].querySelector('.slide-copy');
  if(cover){
    const portals=document.createElement('nav');portals.className='cover-portals';portals.setAttribute('aria-label',ui.explore);
    portals.innerHTML=[['cosmic-faith.html','cosmic'],['volume-1.html','spiritual'],['volume-2.html','values'],['harmony-life.html','harmony']].map(([href,key])=>`<a href="${href}"><span>${title(key)}</span><b>↗</b></a>`).join('');
    const map=cover.querySelector('.cover-map');map?map.before(portals):cover.append(portals);
  }
  slides.slice(1).forEach((slide,i)=>{
    const inner=slide.querySelector('.slide-inner');if(!inner)return;
    const content=document.createElement('div');content.className='slide-content';
    [...inner.children].forEach(child=>content.append(child));inner.append(content);inner.classList.add('with-resources');
    const aside=document.createElement('aside');aside.className='slide-resources';aside.innerHTML=`<span>${ui.related}</span>${resources[i+1].map(([href,key],j)=>`<a href="${href}" title="${ui.open}: ${title(key)}"><small>${String(j+1).padStart(2,'0')}</small><strong>${title(key)}</strong><b>↗</b></a>`).join('')}`;inner.append(aside);
  });
  const pointResources=[
    [],
    [['cosmic-faith.html','cosmic'],null,['vii-06-живой-человек.html','person'],['vii-08-гармония-с-природой.html','nature'],['vii-25-ответственность.html','responsibility'],['hl-11-xi-личностное-развитие.html','development'],['vii-13-ценности.html','values']],
    [['faith.html','faith'],null,['vi-04-душа.html','soul'],['vi-23-вера.html','faith'],['vii-08-гармония-с-природой.html','nature'],['vi-28-культура.html','culture'],['research.html','knowledge'],['hl-11-xi-личностное-развитие.html','development'],['vi-31-осознанность.html','awareness']],
    [['cosmic-faith.html','cosmic'],null,['laws.html','system'],['research.html','research'],['faith.html','faith'],['research.html','knowledge'],['vi-08-любовь.html','love'],['vii-08-гармония-с-природой.html','nature'],['system.html','system']],
    [['vii-13-ценности.html','values'],['vii-06-живой-человек.html','life'],['vi-08-любовь.html','love'],['vi-13-совесть.html','conscience'],['vii-17-истина.html','truth'],['vii-37-вольный-человек.html','freedom'],['vii-25-ответственность.html','responsibility'],['vii-14-справедливость.html','justice'],['research.html','knowledge'],['vi-25-творчество.html','creation'],['vi-09-гармония.html','harmonyCore'],['vi-12-гармоничное-сообщество.html','society']],
    [['harmony-life.html','harmony']]
  ];
  slides.slice(1).forEach((slide,i)=>{
    const points=[...slide.querySelectorAll('.slide-points>p')];
    points.forEach((point,j)=>{
      const target=pointResources[i+1]?.[j];if(!target)return;
      const [href,key]=target;const link=document.createElement('a');link.className='slide-point-link';link.href=href;link.title=`${ui.open}: ${title(key)}`;
      const copy=document.createElement('span');while(point.firstChild)copy.append(point.firstChild);link.append(copy);
      const arrow=document.createElement('b');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(arrow);point.append(link);point.classList.add('is-interactive');
    });
  });
}

if(languageBox){
  const languageLabels={ru:'Выбрать язык',uk:'Обрати мову',en:'Choose language',fr:'Choisir la langue',de:'Sprache wählen'};
  const languageToggle=document.createElement('button');languageToggle.type='button';languageToggle.className='language-toggle';languageToggle.setAttribute('aria-expanded','false');languageToggle.setAttribute('aria-label',languageLabels[document.documentElement.lang]||languageLabels.ru);
  const activeLanguage=languageBox.querySelector('a.active')?.textContent.trim()||document.documentElement.lang.toUpperCase();languageToggle.innerHTML=`<span>${activeLanguage}</span><b aria-hidden="true">⌄</b>`;languageBox.before(languageToggle);
  const closeLanguages=()=>{languageBox.classList.remove('open');languageToggle.setAttribute('aria-expanded','false')};
  languageToggle.addEventListener('click',e=>{e.stopPropagation();const open=languageBox.classList.toggle('open');languageToggle.setAttribute('aria-expanded',String(open));if(open&&nav){nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}});
  document.addEventListener('click',e=>{if(!languageBox.contains(e.target)&&e.target!==languageToggle)closeLanguages()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLanguages()});
  menu?.addEventListener('click',closeLanguages);
  addEventListener('resize',()=>{if(innerWidth>400)closeLanguages()},{passive:true});
}

const sectionToggles=document.querySelectorAll('.toc-section-toggle');
sectionToggles.forEach(sectionToggle=>sectionToggle.addEventListener('click',()=>{
  const sectionBox=sectionToggle.closest('.toc-section');
  const list=sectionBox?.querySelector('.toc-section-list');
  const collapsed=sectionBox?.classList.toggle('collapsed');
  sectionToggle.setAttribute('aria-expanded',String(!collapsed));
  if(!collapsed&&list){const active=list.querySelector('a.active');if(active)list.scrollTop=Math.max(0,active.offsetTop-list.offsetTop-list.clientHeight/2)}
}));
