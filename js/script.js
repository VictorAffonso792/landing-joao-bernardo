/* ===== CARROSSEL DE DEPOIMENTOS ===== */
var currentIndex = 0;

function getVisibleCount() {
  return window.innerWidth <= 768 ? 1 : 3;
}

function getGapWidth() {
  return window.innerWidth <= 768 ? 16 : 24;
}

function updateCarousel() {
  var track = document.getElementById('carouselTrack');
  var cards = document.querySelectorAll('.test-card');
  if (!track || cards.length === 0) return;

  var visibleCount = getVisibleCount();
  
  // Limita o currentIndex para não estourar a visualização dos últimos cards
  var maxIndex = cards.length - visibleCount;
  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }
  if (currentIndex < 0) {
    currentIndex = 0;
  }

  var cardWidth = cards[0].offsetWidth;
  var gap = getGapWidth();
  var offset = currentIndex * (cardWidth + gap);
  
  track.style.transform = 'translateX(-' + offset + 'px)';

  // Atualizar classe active nos dots
  var dots = document.querySelectorAll('.carousel-dot');
  dots.forEach(function(dot, idx) {
    dot.classList.toggle('active', idx === currentIndex);
  });
}

function setupCarouselDots() {
  var dotsContainer = document.getElementById('carouselDots');
  var cards = document.querySelectorAll('.test-card');
  if (!dotsContainer || cards.length === 0) return;

  dotsContainer.innerHTML = '';
  var visibleCount = getVisibleCount();
  var totalDots = cards.length - visibleCount + 1;

  for (var i = 0; i < totalDots; i++) {
    var dot = document.createElement('button');
    dot.className = 'carousel-dot';
    if (i === currentIndex) dot.className += ' active';
    dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
    (function(index) {
      dot.addEventListener('click', function() {
        currentIndex = index;
        updateCarousel();
      });
    })(i);
    dotsContainer.appendChild(dot);
  }
}

function moveNext() {
  var cards = document.querySelectorAll('.test-card');
  var visibleCount = getVisibleCount();
  if (cards.length === 0) return;

  if (currentIndex + visibleCount >= cards.length) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }
  updateCarousel();
}

function movePrev() {
  var cards = document.querySelectorAll('.test-card');
  var visibleCount = getVisibleCount();
  if (cards.length === 0) return;

  if (currentIndex <= 0) {
    currentIndex = cards.length - visibleCount;
  } else {
    currentIndex--;
  }
  updateCarousel();
}

/* ===== FORMULÁRIO — TOGGLE DE SITUAÇÃO ===== */
function selectToggle(el) {
  el.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  el.classList.add('active');
}

/* ===== FORMULÁRIO — ENVIO PARA WHATSAPP ===== */
function enviarWhatsApp() {
  var nome     = document.getElementById('f-nome').value.trim();
  var nasc     = document.getElementById('f-nasc').value;
  var cidade   = document.getElementById('f-cidade').value.trim();
  var situacao = document.querySelector('.toggle-btn.active')
                   ? document.querySelector('.toggle-btn.active').textContent.trim()
                   : '';
  var assunto  = document.getElementById('f-assunto').value;
  var msg      = document.getElementById('f-msg').value.trim();

  if (!nome)    { alert('Por favor, informe seu nome completo.'); return; }
  if (!assunto) { alert('Por favor, selecione o assunto.'); return; }

  var texto = '\uD83D\uDC4B *Olá, Dr. João! Gostaria de iniciar um atendimento.*\n\n';
  texto += '*Nome:* ' + nome + '\n';
  if (nasc)     texto += '*Nascimento:* ' + nasc + '\n';
  if (cidade)   texto += '*Cidade:* ' + cidade + '\n';
  if (situacao) texto += '*Situação:* ' + situacao + '\n';
  texto += '*Assunto:* ' + assunto + '\n';
  if (msg)      texto += '*Detalhes:* ' + msg + '\n';

  var url = 'https://wa.me/5511917275963?text=' + encodeURIComponent(texto);
  window.open(url, '_blank');
}

/* ===== INICIALIZAÇÃO ===== */
document.addEventListener('DOMContentLoaded', function() {
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', movePrev);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', moveNext);
  }

  setupCarouselDots();
  // Aguarda um pequeno delay para garantir que o layout renderizou para a medição da largura
  setTimeout(updateCarousel, 100);

  window.addEventListener('resize', function() {
    setupCarouselDots();
    updateCarousel();
  });
});