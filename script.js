// ==========================================================================
// FINA FLOR FLORICULTURA — SCRIPT INTERATIVO (CARROSSEL, MENU & MONTADOR)
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

  // --- 3. MONTADOR INTERATIVO DE PRESENTE (NATUREZA EM FLORES STYLE) ---
  const giftForm = document.getElementById('giftBuilderForm');

  if (giftForm) {
    // Interatividade nos passos (seleção de cards de opção)
    const steps = ['step-ocasiao', 'step-flores', 'step-adicionais'];

    steps.forEach(stepId => {
      const stepEl = document.getElementById(stepId);
      if (!stepEl) return;

      const cards = stepEl.querySelectorAll('.option-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          if (stepId === 'step-adicionais') {
            // Passo 3 permite múltipla seleção ou desmarcar
            card.classList.toggle('selected');
          } else {
            // Passos 1 e 2 são seleção única
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
          }
        });
      });
    });

    // Envio do formulário montado no WhatsApp
    giftForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Pegar Ocasião
      const ocasiaoCard = document.querySelector('#step-ocasiao .option-card.selected');
      const ocasiaoVal = ocasiaoCard ? ocasiaoCard.getAttribute('data-value') : 'Aniversário';

      // Pegar Estilo
      const estiloCard = document.querySelector('#step-flores .option-card.selected');
      const estiloVal = estiloCard ? estiloCard.getAttribute('data-value') : 'Buquê de Rosas Vermelhas';

      // Pegar Adicionais
      const adicionaisCards = document.querySelectorAll('#step-adicionais .option-card.selected');
      const adicionaisList = Array.from(adicionaisCards).map(c => c.getAttribute('data-value'));
      const adicionaisVal = adicionaisList.length > 0 ? adicionaisList.join(', ') : 'Nenhum adicional selecionado';

      // Pegar Campos
      const nomeVal = document.getElementById('builder-nome').value.trim() || 'Cliente Fina Flor';
      const entregaVal = document.getElementById('builder-entrega').value;
      const obsVal = document.getElementById('builder-obs').value.trim();

      // Montar Mensagem Formatada
      let msg = `Olá, equipe Fina Flor! Gostaria de fazer um pedido personalizado pelo site:

`;
      msg += `👤 *Solicitante:* ${nomeVal}
`;
      msg += `🌸 *Ocasião:* ${ocasiaoVal}
`;
      msg += `💐 *Estilo do Presente:* ${estiloVal}
`;
      msg += `🎁 *Acompanhamentos:* ${adicionaisVal}
`;
      msg += `📍 *Modalidade:* ${entregaVal}
`;
      if (obsVal) {
        msg += `📝 *Mensagem / Observações:* ${obsVal}
`;
      }
      msg += `
Poderiam me informar a disponibilidade e prazo de entrega?`;

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=5527999709043&text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

});
