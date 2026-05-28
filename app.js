/* ===================================================
   LEGO EduHub — script.js
   
   Содержание:
   1. Фиксация шапки при скролле (тень)
   2. Мобильное меню (гамбургер)
   3. Закрытие меню при клике по ссылке
   4. Активная ссылка навигации при скролле
   5. Добавление в корзину (toast-уведомление)
   6. Таймер обратного отсчёта
   7. Анимация появления секций при скролле (Intersection Observer)
=================================================== */


/* ===================================================
   LEGO EduHub — script.js
    
    Содержание:
    1. Фиксация шапки при скролле (тень)
    2. Мобильное меню (гамбургер)
    3. Закрытие меню при клике по ссылке
    4. Активная ссылка навигации при скролле
    5. Добавление в корзину (toast-уведомление)
    6. Таймер обратного отсчёта
    7. Анимация появления секций при скролле (Intersection Observer)
=================================================== */


/* ===================================================
   1. ШАПКА: добавляем тень при прокрутке страницы
=================================================== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


/* ===================================================
   2. МОБИЛЬНОЕ МЕНЮ (гамбургер)
=================================================== */
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });
}


/* ===================================================
   3. ЗАКРЫТИЕ МЕНЮ при клике по ссылке (для мобильных)
=================================================== */
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (nav) {
      nav.classList.remove('open');
    }
    if (burger) {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }
  });
});


/* ===================================================
   4. АКТИВНАЯ ССЫЛКА НАВИГАЦИИ при скролле
   Подсвечивает текущий раздел в меню
=================================================== */
const sections = document.querySelectorAll('section[id]');

// Функция, которая проверяет какой раздел виден на экране
function highlightNav() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    // Сначала пробуем стандартный вариант: ссылка вида '#id'
    let navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

    // Если не нашли — ищем среди всех навссылок варианты с именем файла или пути
    if (!navLink) {
      navLink = Array.from(navLinks).find(l => {
        const href = (l.getAttribute('href') || '').trim();
        if (!href) return false;
        if (href.includes(`#${sectionId}`)) return true;
        const base = href.split('?')[0].split('#')[0];
        if (base.endsWith(`${sectionId}.html`) || base === `${sectionId}.html`) return true;
        if (base === sectionId || base.endsWith(`/${sectionId}`)) return true;
        return false;
      });
    }

    // Условие подсветки:
    // - секция видна на странице (для длинных страниц), или
    // - текущий URL указывает на файл/хеш с именем секции
    const urlMatches = (window.location.hash === `#${sectionId}`)
      || window.location.pathname.endsWith(`/${sectionId}.html`)
      || window.location.pathname.endsWith(`${sectionId}.html`)
      || window.location.pathname === `/${sectionId}`
      || window.location.href.includes(`${sectionId}.html`);

    if (navLink) {
      if ((scrollY >= sectionTop && scrollY < sectionBottom) || urlMatches || window.location.hash === `#${sectionId}`) {
        navLinks.forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', highlightNav);
window.addEventListener('load', highlightNav);
window.addEventListener('popstate', highlightNav);
// Вызов сразу для случаев, когда скрипт подключён внизу и событие load уже произошло
setTimeout(highlightNav, 50);


/* ===================================================
   5. КОРЗИНА: кнопка "В корзину" + toast-уведомление
=================================================== */
const cartBtns  = document.querySelectorAll('.cart-btn');
const toast     = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const cartBadge = document.querySelector('.cart__badge');

let cartCount = cartBadge ? parseInt(cartBadge.textContent) || 0 : 0;
let toastTimer = null;

if (toast && toastText && cartBadge && cartBtns.length > 0) {
  cartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.getAttribute('data-product') || 'Товар';

      cartCount++;
      cartBadge.textContent = cartCount;

      cartBadge.style.transform = 'scale(1.5)';
      setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);

      toastText.textContent = `«${productName}» добавлен в корзину!`;
      toast.classList.add('show');

      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    });
  });
}


/* ===================================================
   6. ТАЙМЕР ОБРАТНОГО ОТСЧЁТА
    Считает до конкретной даты в будущем.
=================================================== */

const tDays  = document.getElementById('t-days');
const tHours = document.getElementById('t-hours');
const tMins  = document.getElementById('t-mins');
const tSecs  = document.getElementById('t-secs');

if (tDays && tHours && tMins && tSecs) {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 2);
  deadline.setHours(deadline.getHours() + 15, deadline.getMinutes() + 40, 0, 0);

  function updateTimer() {
    const now  = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
      tDays.textContent  = '00';
      tHours.textContent = '00';
      tMins.textContent  = '00';
      tSecs.textContent  = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    tDays.textContent  = pad(days);
    tHours.textContent = pad(hours);
    tMins.textContent  = pad(minutes);
    tSecs.textContent  = pad(seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}


/* ===================================================
   7. АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ при скролле
   Intersection Observer — современный и эффективный способ.
   Элементы «въезжают» снизу при прокрутке.
=================================================== */

// Добавляем начальный CSS-класс всем секциям и карточкам
const animatedEls = document.querySelectorAll(
  '.feature-card, .product-card, .hero__text, .events__text, section'
);

// Добавляем стиль для начального состояния (невидимые, смещённые вниз)
const style = document.createElement('style');
style.textContent = `
  .fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Добавляем класс fade-in-up всем целевым элементам
animatedEls.forEach((el, i) => {
  el.classList.add('fade-in-up');
  // Задержка для карточек в ряду — создаёт эффект "волны"
  if (el.classList.contains('feature-card') || el.classList.contains('product-card')) {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  }
});

// Создаём наблюдатель
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Элемент попал в зону видимости — показываем его
      entry.target.classList.add('visible');
      // Прекращаем наблюдение (анимация нужна только один раз)
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1, // элемент виден на 10% — запускаем анимацию
});

// Запускаем наблюдение для каждого элемента
animatedEls.forEach(el => observer.observe(el));


/* ===================================================
   Дополнительно: плавная прокрутка при клике
   на логотип (наверх страницы)
=================================================== */
document.querySelectorAll('a[href="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    // Предотвращаем дефолтный переход
    // (только для ссылок ведущих на "#", т.е. на верх страницы)
    if (anchor.closest('.logo')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
