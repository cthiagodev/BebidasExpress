/* ============================================================
   Bebidas Express — Scripts
   ============================================================ */

/* ── Número do WhatsApp (edite aqui) ── */
const WHATSAPP_NUMBER = '5583900000000';

/* ── Atualiza todos os links de WhatsApp dinamicamente ── */
function initWhatsAppLinks() {
  const links = document.querySelectorAll('[data-whatsapp]');
  links.forEach(link => {
    const msg = link.dataset.whatsapp || 'Olá! Quero fazer um pedido.';
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  });
}

/* ── Navbar: cor fixa, sem mudança ao rolar ── */
function initNavScroll() {
  // Cor fixa — sem alteração ao rolar
}

/* ── Animação de entrada ao rolar (Intersection Observer) ── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.produto-card, .step, .diferencial, .stat-item'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* ── Smooth scroll para links internos ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initNavScroll();
  initScrollReveal();
  initSmoothScroll();
});