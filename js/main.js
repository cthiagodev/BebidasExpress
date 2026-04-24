/* ============================================================
   Bebidas Express — Scripts
   ============================================================ */

const WHATSAPP_NUMBER = '5583900000000';

/* ── Estado do Carrinho ── */
let cart = [];

/* ── WhatsApp Links ── */
function initWhatsAppLinks() {
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    const msg = link.dataset.whatsapp || 'Olá! Quero fazer um pedido.';
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  });
}

/* ── Navbar cor fixa ── */
function initNavScroll() {
  // Cor fixa — sem alteração ao rolar
}

/* ── Carrinho: Renderizar ── */
function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const countEl  = document.getElementById('cartCount');
  const totalEl  = document.getElementById('cartTotal');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalVal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  countEl.textContent = totalQty;
  countEl.style.display = totalQty > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><span>🛒</span><p>Seu carrinho está vazio</p></div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  totalEl.textContent = `R$ ${totalVal.toFixed(2).replace('.', ',')}`;

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.icon}</div>
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

/* ── Adicionar ao Carrinho ── */
function addToCart(name, price, icon) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price: parseFloat(price), icon, qty: 1 });
  }
  renderCart();

  // Abre o sidebar automaticamente
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

/* ── Alterar quantidade ── */
function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  renderCart();
}

/* ── Sidebar Toggle ── */
function initCart() {
  const toggle  = document.getElementById('cartToggle');
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  const close   = document.getElementById('cartClose');

  function openCart()  { sidebar.classList.add('open'); overlay.classList.add('open'); }
  function closeCart() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }

  toggle.addEventListener('click', openCart);
  close.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  // Botões "Adicionar" nos cards
  document.querySelectorAll('.produto-card').forEach(card => {
    const btn = card.querySelector('.btn-add-cart');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(
        card.dataset.name,
        card.dataset.price,
        card.dataset.icon
      );
      // Feedback visual
      btn.textContent = '✓ Adicionado!';
      btn.style.background = '#25a244';
      setTimeout(() => {
        btn.textContent = '+ Adicionar';
        btn.style.background = '';
      }, 1200);
    });
  });

  // Checkout abre modal de endereço
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    closeCart();
    setTimeout(() => {
      document.getElementById('modalOverlay').classList.add('open');
    }, 300);
  });

  // Fechar modal
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('open');
  });
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay'))
      document.getElementById('modalOverlay').classList.remove('open');
  });

  // Máscara CEP
  document.getElementById('inputCep').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
    e.target.value = v;
  });

  // Enviar para WhatsApp
  document.getElementById('sendWhatsapp').addEventListener('click', () => {
    const endereco    = document.getElementById('inputEndereco').value.trim();
    const numero      = document.getElementById('inputNumero').value.trim();
    const cep         = document.getElementById('inputCep').value.trim();
    const complemento = document.getElementById('inputComplemento').value.trim();

    if (!endereco || !numero || !cep) {
      alert('Por favor, preencha o endereço, número e CEP.');
      return;
    }

    const totalVal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const itens = cart.map(i =>
      `${i.icon} ${i.qty}x ${i.name} — R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}`
    ).join('\n');

    const msg = [
      '🛒 *Novo Pedido — Bebidas Express*',
      '',
      '*Itens do pedido:*',
      itens,
      '',
      `*Total: R$ ${totalVal.toFixed(2).replace('.', ',')}*`,
      '',
      '*📍 Endereço de entrega:*',
      `${endereco}, nº ${numero}`,
      `CEP: ${cep}`,
      complemento ? `Complemento: ${complemento}` : '',
    ].filter(l => l !== undefined).join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

    // Limpar
    cart = [];
    renderCart();
    document.getElementById('modalOverlay').classList.remove('open');
    document.getElementById('inputEndereco').value = '';
    document.getElementById('inputNumero').value = '';
    document.getElementById('inputCep').value = '';
    document.getElementById('inputComplemento').value = '';
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.produto-card, .step, .diferencial');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* ── Smooth Scroll ── */
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
  initCart();
  renderCart();
  initScrollReveal();
  initSmoothScroll();
});