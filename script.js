// ==========================================================================
// FINA FLOR FLORICULTURA — SCRIPT INTERATIVO (CARROSSEL, MENU & FORMULÁRIO)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MENU MOBILE RESPONSIVO EM 'X' ---
  const burger = document.getElementById('burger');
  const navWrapper = document.getElementById('navWrapper');

  if (burger && navWrapper) {
    burger.addEventListener('click', () => {
      const isActive = navWrapper.classList.toggle('active');
      burger.classList.toggle('active', isActive);
      burger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navWrapper.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navWrapper.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 2. CARROSSEL DE AVALIAÇÕES ---
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('revPrevBtn');
  const nextBtn = document.getElementById('revNextBtn');
  const dotsContainer = document.getElementById('reviewsDots');

  if (track) {
    const cards = Array.from(track.querySelectorAll('.review-card'));
    let currentIdx = 0;

    if (dotsContainer && dotsContainer.children.length === 0) {
      cards.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          scrollToIndex(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

    function scrollToIndex(index) {
      if (cards.length === 0) return;
      if (index < 0) index = 0;
      if (index >= cards.length) index = cards.length - 1;
      currentIdx = index;

      cards[currentIdx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });

      if (dots.length > 0) {
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
      }
    }

    function updateActiveDotOnScroll() {
      if (cards.length === 0) return;
      const trackRect = track.getBoundingClientRect();
      let closestIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const diff = Math.abs(cardRect.left - trackRect.left);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      currentIdx = closestIdx;
      if (dots.length > 0) {
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
      }
    }

    track.addEventListener('scroll', updateActiveDotOnScroll, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollToIndex(currentIdx - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollToIndex(currentIdx + 1);
      });
    }

    let autoTimer = setInterval(() => {
      let nextIdx = (currentIdx + 1) % cards.length;
      scrollToIndex(nextIdx);
    }, 6000);

    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true });
  }

  // --- 3. FORMULÁRIO DE MONTE SEU ARRANJO ---
  const customForm = document.getElementById('customForm');
  if (customForm) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ocasion = document.getElementById('fOcasion').value;
      const budget = document.getElementById('fBudget').value;
      const message = document.getElementById('fMessage').value.trim();

      let text = `Olá, Fina Flor! Gostaria de montar um pedido personalizado pelo site:

`;
      text += `🌸 *Ocasião:* ${ocasion}
`;
      text += `💰 *Orçamento:* ${budget}
`;
      if (message) {
        text += `📝 *Observações:* ${message}
`;
      }
      text += `
Poderiam me enviar algumas sugestões de buquês/cestas?`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=5527999709043&text=${encodedText}`;
      window.open(whatsappUrl, '_blank');
    });
  }

});
