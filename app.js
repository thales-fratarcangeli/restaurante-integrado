'use strict';

// ===== NAVIGATION =====
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const screen = document.getElementById('screen-' + name);
  if (screen) screen.classList.add('active');
  const navItem = document.querySelector(`[data-screen="${name}"]`);
  if (navItem) navItem.classList.add('active');
  const labels = {
    dashboard: 'Dashboard', pdv: 'PDV / Caixa', pedidos: 'Pedidos',
    mesas: 'Mesas', cardapio: 'Cardápio', entregas: 'Entregas',
    clientes: 'Clientes', estoque: 'Estoque', financeiro: 'Financeiro',
    relatorios: 'Relatórios', configuracoes: 'Configurações'
  };
  document.getElementById('breadcrumb').textContent = labels[name] || name;
  if (name === 'relatorios') setTimeout(initRelCharts, 50);
  if (name === 'financeiro') setTimeout(initFinCharts, 50);
  if (name === 'mesas') buildMesas();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  document.getElementById('topbarTime').textContent =
    now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// ===== DATE =====
document.getElementById('dashDate').textContent = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// ===== TOAST =====
function showToast(msg, icon = '✓') {
  const t = document.getElementById('toast');
  t.innerHTML = `${icon} ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== MODALS =====
function showModal(id) {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById(id).classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
}

// ===== DASHBOARD CHARTS =====
function initDashCharts() {
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const receita = [3200, 2800, 4100, 3600, 4820, 5900, 5100];
  const pedidos = [98, 87, 120, 105, 143, 178, 155];

  const ctx1 = document.getElementById('chartReceita');
  if (!ctx1) return;
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Receita (R$)',
          data: receita,
          backgroundColor: 'rgba(249,115,22,.85)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Pedidos',
          data: pedidos,
          type: 'line',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,.1)',
          tension: .4,
          fill: true,
          yAxisID: 'y1',
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index' },
      plugins: { legend: { display: false } },
      scales: {
        y: { position: 'left', grid: { color: 'rgba(0,0,0,.05)' }, ticks: { callback: v => 'R$' + (v/1000).toFixed(1) + 'k' } },
        y1: { position: 'right', grid: { display: false } }
      }
    }
  });

  const catLabels = ['Lanches', 'Pizzas', 'Bebidas', 'Pratos', 'Sobremesas'];
  const catData = [32, 24, 18, 20, 6];
  const catColors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  const ctx2 = document.getElementById('chartCategoria');
  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{ data: catData, backgroundColor: catColors, borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: { legend: { display: false } }
    }
  });

  const legend = document.getElementById('donutLegend');
  catLabels.forEach((l, i) => {
    legend.innerHTML += `<div style="display:flex;align-items:center;gap:6px;font-size:.75rem">
      <div style="width:10px;height:10px;border-radius:2px;background:${catColors[i]};flex-shrink:0"></div>
      <span style="flex:1;color:#64748b">${l}</span>
      <strong>${catData[i]}%</strong>
    </div>`;
  });
}

// ===== PDV DATA =====
const pdvProducts = [
  { id: 1, name: 'X-Burguer Especial', price: 32.90, cat: 'lanches', emoji: '🍔' },
  { id: 2, name: 'X-Frango Crocante', price: 28.90, cat: 'lanches', emoji: '🍗' },
  { id: 3, name: 'X-Salada Fit', price: 25.90, cat: 'lanches', emoji: '🥗' },
  { id: 4, name: 'X-Bacon Duplo', price: 38.90, cat: 'lanches', emoji: '🥓' },
  { id: 5, name: 'Pizza Margherita', price: 42.00, cat: 'pizzas', emoji: '🍕' },
  { id: 6, name: 'Pizza Calabresa', price: 44.00, cat: 'pizzas', emoji: '🍕' },
  { id: 7, name: 'Pizza 4 Queijos', price: 48.00, cat: 'pizzas', emoji: '🧀' },
  { id: 8, name: 'Pizza Frango c/ Cat.', price: 46.00, cat: 'pizzas', emoji: '🍕' },
  { id: 9, name: 'Suco de Laranja', price: 9.90, cat: 'bebidas', emoji: '🍊' },
  { id: 10, name: 'Coca-Cola 600ml', price: 8.00, cat: 'bebidas', emoji: '🥤' },
  { id: 11, name: 'Cerveja Long Neck', price: 12.00, cat: 'bebidas', emoji: '🍺' },
  { id: 12, name: 'Água Mineral', price: 4.50, cat: 'bebidas', emoji: '💧' },
  { id: 13, name: 'Frango Grelhado', price: 36.00, cat: 'pratos', emoji: '🍽️' },
  { id: 14, name: 'Filé de Tilápia', price: 44.00, cat: 'pratos', emoji: '🐟' },
  { id: 15, name: 'Picanha na Brasa', price: 68.00, cat: 'pratos', emoji: '🥩' },
  { id: 16, name: 'Marmita Fitness', price: 28.00, cat: 'pratos', emoji: '📦' },
  { id: 17, name: 'Brownie', price: 12.00, cat: 'sobremesas', emoji: '🍫' },
  { id: 18, name: 'Sorvete 3 Bolas', price: 14.00, cat: 'sobremesas', emoji: '🍨' },
  { id: 19, name: 'Pudim', price: 10.00, cat: 'sobremesas', emoji: '🍮' },
  { id: 20, name: 'Açaí 500ml', price: 22.00, cat: 'sobremesas', emoji: '🫐' },
];

let cart = [];
let currentCat = 'all';

function buildPdvGrid(products) {
  const grid = document.getElementById('pdvGrid');
  if (!grid) return;
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'pdv-product-card';
    card.dataset.cat = p.cat;
    card.innerHTML = `
      <div class="pdv-prod-emoji">${p.emoji}</div>
      <div class="pdv-prod-name">${p.name}</div>
      <div class="pdv-prod-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
      <div class="pdv-prod-cat">${p.cat}</div>
    `;
    card.onclick = () => addToCart(p);
    grid.appendChild(card);
  });
}

function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCat = cat;
  const filtered = cat === 'all' ? pdvProducts : pdvProducts.filter(p => p.cat === cat);
  buildPdvGrid(filtered);
}

function filterPdvProducts() {
  const q = document.getElementById('pdvSearch').value.toLowerCase();
  const filtered = pdvProducts.filter(p =>
    (currentCat === 'all' || p.cat === currentCat) && p.name.toLowerCase().includes(q)
  );
  buildPdvGrid(filtered);
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  showToast(`${product.emoji} ${product.name} adicionado!`);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty"><i class="fa-solid fa-cart-shopping"></i><br>Nenhum item adicionado</p>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span style="font-size:1.2rem">${item.emoji}</span>
        <span class="ci-name" title="${item.name}">${item.name}</span>
        <div class="ci-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, +1)">+</button>
        </div>
        <span class="ci-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
        <i class="fa-solid fa-xmark ci-remove" onclick="removeFromCart(${item.id})"></i>
      </div>
    `).join('');
  }
  updateCartTotals();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function updateCartTotals() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = sub * 0.1;
  const total = sub + tax;
  const fmt = v => 'R$ ' + v.toFixed(2).replace('.', ',');
  const el = id => document.getElementById(id);
  if (el('cartSubtotal')) el('cartSubtotal').textContent = fmt(sub);
  if (el('cartTax')) el('cartTax').textContent = fmt(tax);
  if (el('cartTotal')) el('cartTotal').textContent = fmt(total);
}

function selectPay(btn) {
  document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function finalizarVenda() {
  if (cart.length === 0) { showToast('⚠️ Carrinho vazio!'); return; }
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = sub * 1.1;
  document.getElementById('vendaTotalModal').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  showModal('vendaModal');
  cart = [];
  renderCart();
}

function limparCarrinho() {
  cart = [];
  renderCart();
  showToast('🗑️ Carrinho limpo');
}

// ===== KANBAN / PEDIDOS =====
const pedidosData = [
  { id: '#1042', mesa: 'Mesa 7', tipo: 'mesa', itens: 'X-Burguer x2, Coca x1', total: 'R$ 73,80', status: 'novo', time: '2min' },
  { id: '#1043', mesa: 'Mesa 12', tipo: 'mesa', itens: 'Pizza Margherita x1', total: 'R$ 42,00', status: 'novo', time: '5min' },
  { id: '#1044', mesa: 'Delivery — Carlos M.', tipo: 'delivery', itens: 'Frango x1, Suco x2', total: 'R$ 55,80', status: 'novo', time: '7min' },
  { id: '#1039', mesa: 'Mesa 3', tipo: 'mesa', itens: 'Picanha x2, Cerveja x3', total: 'R$ 172,00', status: 'prep', time: '18min' },
  { id: '#1040', mesa: 'Delivery — Ana P.', tipo: 'delivery', itens: 'X-Bacon x1, Brownie x2', total: 'R$ 62,90', status: 'prep', time: '22min' },
  { id: '#1037', mesa: 'Mesa 8', tipo: 'mesa', itens: 'Filé Tilápia x2, Suco x2', total: 'R$ 107,80', status: 'prep', time: '25min' },
  { id: '#1035', mesa: 'Mesa 5', tipo: 'mesa', itens: 'Marmita x3', total: 'R$ 84,00', status: 'prep', time: '31min' },
  { id: '#1038', mesa: 'Delivery — João S.', tipo: 'delivery', itens: 'Pizza Calabresa x1', total: 'R$ 44,00', status: 'prep', time: '28min' },
  { id: '#1036', mesa: 'Mesa 2', tipo: 'mesa', itens: 'X-Frango x2', total: 'R$ 57,80', status: 'pronto', time: '35min' },
  { id: '#1034', mesa: 'Delivery — Maria R.', tipo: 'delivery', itens: 'Açaí x2, Brownie x1', total: 'R$ 56,00', status: 'pronto', time: '38min' },
  { id: '#1033', mesa: 'Mesa 9', tipo: 'mesa', itens: 'Frango x1', total: 'R$ 36,00', status: 'entregue', time: '42min' },
  { id: '#1032', mesa: 'Delivery — Pedro L.', tipo: 'delivery', itens: 'X-Burguer x3', total: 'R$ 98,70', status: 'entregue', time: '55min' },
];

function buildKanban() {
  const cols = { novo: 'kNovos', prep: 'kPrep', pronto: 'kPronto', entregue: 'kEntregue' };
  Object.values(cols).forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = ''; });
  pedidosData.forEach(p => {
    const colId = cols[p.status];
    const col = document.getElementById(colId);
    if (!col) return;
    const card = document.createElement('div');
    card.className = 'kanban-card';
    const nextActions = {
      novo: ['Aceitar', 'Cancelar'],
      prep: ['Pronto', 'Detalhes'],
      pronto: ['Entregue', 'Detalhes'],
      entregue: ['Detalhes', 'Imprimir']
    };
    const actions = nextActions[p.status] || [];
    card.innerHTML = `
      <div class="kc-header">
        <span class="kc-id">${p.id}</span>
        <span class="kc-time"><i class="fa-solid fa-clock"></i> ${p.time}</span>
      </div>
      <div style="font-size:.82rem;font-weight:600;margin-bottom:4px">${p.mesa}</div>
      <div class="kc-items">${p.itens}</div>
      <div class="kc-footer">
        <span class="kc-type ${p.tipo}">${p.tipo === 'mesa' ? '🪑 Mesa' : '🛵 Delivery'}</span>
        <span class="kc-total">${p.total}</span>
      </div>
      <div class="kc-actions">
        ${actions.map(a => `<button onclick="showToast('${a}: ${p.id}')">${a}</button>`).join('')}
      </div>
    `;
    col.appendChild(card);
  });
}

function filterPedidos(status, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  showToast('Filtro: ' + (status === 'todos' ? 'Todos os pedidos' : status));
}

// ===== MESAS =====
const mesasData = [
  { num: 1, status: 'free', pax: 4 },
  { num: 2, status: 'occ', pax: 2, cliente: 'Casal Silva', tempo: '45min', total: 'R$ 57,80' },
  { num: 3, status: 'occ', pax: 6, cliente: 'Família Souza', tempo: '1h12min', total: 'R$ 142,00' },
  { num: 4, status: 'free', pax: 4 },
  { num: 5, status: 'res', pax: 4, cliente: 'Carlos M.', horario: '19:00' },
  { num: 6, status: 'occ', pax: 3, cliente: 'Turma Dev', tempo: '22min', total: 'R$ 87,40' },
  { num: 7, status: 'occ', pax: 2, cliente: 'Mesa 7', tempo: '8min', total: 'R$ 73,80' },
  { num: 8, status: 'res', pax: 6, cliente: 'Família Silva', horario: '20:00' },
  { num: 9, status: 'occ', pax: 4, cliente: 'Grupo Amigos', tempo: '55min', total: 'R$ 208,00' },
  { num: 10, status: 'free', pax: 2 },
  { num: 11, status: 'free', pax: 4 },
  { num: 12, status: 'occ', pax: 1, cliente: 'Sr. Oliveira', tempo: '5min', total: 'R$ 28,00' },
  { num: 13, status: 'free', pax: 6 },
  { num: 14, status: 'occ', pax: 2, cliente: 'Casal Pereira', tempo: '38min', total: 'R$ 96,00' },
  { num: 15, status: 'free', pax: 4 },
  { num: 16, status: 'occ', pax: 5, cliente: 'Aniversário', tempo: '1h05min', total: 'R$ 312,00' },
  { num: 17, status: 'free', pax: 4 },
  { num: 18, status: 'occ', pax: 3, cliente: 'Almoço Executivo', tempo: '32min', total: 'R$ 107,80' },
  { num: 19, status: 'res', pax: 2, cliente: 'Amanda R.', horario: '21:30' },
  { num: 20, status: 'free', pax: 4 },
  { num: 21, status: 'occ', pax: 4, cliente: 'Reunião', tempo: '1h40min', total: 'R$ 178,00' },
  { num: 22, status: 'free', pax: 2 },
  { num: 23, status: 'occ', pax: 2, cliente: 'Casal Torres', tempo: '18min', total: 'R$ 44,00' },
  { num: 24, status: 'free', pax: 6 },
];

function buildMesas() {
  const grid = document.getElementById('mesasGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const icons = { free: '🪑', occ: '👥', res: '📅' };
  const statusLabels = { free: 'Livre', occ: 'Ocupada', res: 'Reservada' };
  mesasData.forEach(m => {
    const card = document.createElement('div');
    card.className = `mesa-card ${m.status}`;
    card.innerHTML = `
      <div class="mesa-icon">${icons[m.status]}</div>
      <div class="mesa-num">Mesa ${m.num}</div>
      <div class="mesa-status">${statusLabels[m.status]}</div>
      <div class="mesa-pax"><i class="fa-solid fa-user"></i> ${m.pax} lugares</div>
    `;
    card.onclick = () => showMesaDetail(m);
    grid.appendChild(card);
  });

  // Populate reserva modal mesa select
  const sel = document.getElementById('reservaMesa');
  if (sel) {
    sel.innerHTML = mesasData.map(m => `<option value="${m.num}">Mesa ${m.num}</option>`).join('');
  }
}

function showMesaDetail(m) {
  const card = document.getElementById('mesaDetailCard');
  if (!card) return;
  const statusLabels = { free: 'Livre', occ: 'Ocupada', res: 'Reservada' };
  const statusColors = { free: '#16a34a', occ: '#f97316', res: '#2563eb' };
  if (m.status === 'free') {
    card.innerHTML = `<div style="padding:20px">
      <h4 style="margin-bottom:12px">Mesa ${m.num}</h4>
      <div style="margin-bottom:8px"><span class="status-badge done">Livre</span></div>
      <p style="font-size:.82rem;color:#64748b;margin-bottom:16px">${m.pax} lugares disponíveis</p>
      <button class="btn btn-primary btn-block" onclick="showModal('reservaModal')"><i class="fa-solid fa-calendar-plus"></i> Fazer Reserva</button>
      <button class="btn btn-outline btn-block" style="margin-top:8px" onclick="showToast('Mesa ${m.num} aberta no PDV')"><i class="fa-solid fa-receipt"></i> Abrir Comanda</button>
    </div>`;
  } else if (m.status === 'occ') {
    card.innerHTML = `<div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h4>Mesa ${m.num}</h4>
        <span class="status-badge prep">Ocupada</span>
      </div>
      <p style="font-size:.88rem;font-weight:600;margin-bottom:4px">${m.cliente}</p>
      <p style="font-size:.78rem;color:#64748b;margin-bottom:12px"><i class="fa-solid fa-clock"></i> ${m.tempo} — ${m.pax} pessoas</p>
      <div style="background:#f8fafc;border-radius:8px;padding:12px;margin-bottom:12px">
        <p style="font-size:.78rem;color:#64748b">Total atual</p>
        <p style="font-size:1.4rem;font-weight:800;color:#f97316">${m.total}</p>
      </div>
      <button class="btn btn-primary btn-block" onclick="showToast('Comanda ${m.num} aberta')"><i class="fa-solid fa-receipt"></i> Ver Comanda</button>
      <button class="btn btn-success btn-block" style="margin-top:8px" onclick="showToast('Mesa ${m.num} fechada')"><i class="fa-solid fa-cash-register"></i> Fechar Mesa</button>
    </div>`;
  } else {
    card.innerHTML = `<div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h4>Mesa ${m.num}</h4>
        <span class="status-badge prep">Reservada</span>
      </div>
      <p style="font-size:.88rem;font-weight:600;margin-bottom:4px">${m.cliente}</p>
      <p style="font-size:.78rem;color:#64748b;margin-bottom:4px"><i class="fa-solid fa-clock"></i> ${m.horario} — ${m.pax} pessoas</p>
      <button class="btn btn-outline btn-block" style="margin-top:12px" onclick="showToast('Reserva cancelada')"><i class="fa-solid fa-xmark"></i> Cancelar Reserva</button>
    </div>`;
  }
}

// ===== CARDÁPIO =====
const cardapioProducts = [
  { name: 'X-Burguer Especial', cat: 'Lanches', price: 32.90, cost: 12.00, emoji: '🍔', desc: 'Pão brioche, hambúrguer 180g, queijo, alface, tomate', ativo: true },
  { name: 'X-Frango Crocante', cat: 'Lanches', price: 28.90, cost: 10.00, emoji: '🍗', desc: 'Frango empanado, queijo, maionese especial', ativo: true },
  { name: 'X-Bacon Duplo', cat: 'Lanches', price: 38.90, cost: 15.00, emoji: '🥓', desc: 'Dois hambúrgueres, bacon, queijo duplo', ativo: true },
  { name: 'Pizza Margherita', cat: 'Pizzas', price: 42.00, cost: 16.00, emoji: '🍕', desc: 'Molho de tomate, mussarela, manjericão', ativo: true },
  { name: 'Pizza Calabresa', cat: 'Pizzas', price: 44.00, cost: 17.00, emoji: '🍕', desc: 'Calabresa, cebola, azeitona, orégano', ativo: true },
  { name: 'Pizza 4 Queijos', cat: 'Pizzas', price: 48.00, cost: 20.00, emoji: '🧀', desc: 'Mussarela, gorgonzola, catupiry, parmesão', ativo: true },
  { name: 'Suco de Laranja', cat: 'Bebidas', price: 9.90, cost: 2.50, emoji: '🍊', desc: 'Suco natural 400ml', ativo: true },
  { name: 'Coca-Cola 600ml', cat: 'Bebidas', price: 8.00, cost: 3.00, emoji: '🥤', desc: 'Refrigerante 600ml gelado', ativo: true },
  { name: 'Cerveja Long Neck', cat: 'Bebidas', price: 12.00, cost: 4.50, emoji: '🍺', desc: 'Long neck 355ml bem gelada', ativo: true },
  { name: 'Frango Grelhado', cat: 'Pratos', price: 36.00, cost: 14.00, emoji: '🍽️', desc: 'Frango grelhado, arroz, feijão, salada', ativo: true },
  { name: 'Picanha na Brasa', cat: 'Pratos', price: 68.00, cost: 28.00, emoji: '🥩', desc: '300g de picanha, farofa, vinagrete', ativo: true },
  { name: 'Brownie', cat: 'Sobremesas', price: 12.00, cost: 4.00, emoji: '🍫', desc: 'Brownie de chocolate com sorvete', ativo: true },
  { name: 'Sorvete 3 Bolas', cat: 'Sobremesas', price: 14.00, cost: 5.00, emoji: '🍨', desc: 'Sabores: chocolate, morango, creme', ativo: false },
];

function buildCardapio() {
  const grid = document.getElementById('cardapioGrid');
  if (!grid) return;
  grid.innerHTML = cardapioProducts.map(p => `
    <div class="produto-card">
      <div class="produto-img">${p.emoji}</div>
      <div class="produto-body">
        <div class="produto-name">${p.name}</div>
        <div class="produto-desc">${p.desc}</div>
        <div class="produto-footer">
          <span class="produto-price">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
          <div class="produto-actions">
            <span class="produto-toggle ${p.ativo ? 'on' : 'off'}">${p.ativo ? 'Ativo' : 'Inativo'}</span>
            <button class="btn btn-sm btn-outline" onclick="showModal('produtoModal')" style="padding:3px 8px"><i class="fa-solid fa-pen"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function selectCardapioCat(el, cat) {
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active-cat'));
  el.classList.add('active-cat');
  showToast(`Categoria: ${cat}`);
}

// ===== ENTREGAS =====
const entregasData = [
  { id: '#1041', cliente: 'João Silva', addr: 'Rua das Rosas, 45 — Jardins', total: 'R$ 54,50', entregador: 'Marcos R.', tempo: '12min', status: 'aguardando' },
  { id: '#1044', cliente: 'Carlos Mendes', addr: 'Av. Paulista, 900 — Bela Vista', total: 'R$ 55,80', entregador: 'Pendente', tempo: '18min', status: 'aguardando' },
  { id: '#1038', cliente: 'Maria Lima', addr: 'Rua Augusta, 200 — Consolação', total: 'R$ 44,00', entregador: 'Pedro L.', tempo: '28min', status: 'transito' },
  { id: '#1040', cliente: 'Ana Paula', addr: 'Rua Oscar Freire, 78 — Pinheiros', total: 'R$ 62,90', entregador: 'Carla S.', tempo: '22min', status: 'transito' },
  { id: '#1036', cliente: 'Roberto Costa', addr: 'Rua Pamplona, 15 — Bela Vista', total: 'R$ 98,70', entregador: 'Marcos R.', tempo: '45min', status: 'transito' },
  { id: '#1033', cliente: 'Patrícia Nunes', addr: 'Al. Santos, 350 — Cerqueira César', total: 'R$ 36,00', entregador: 'Pedro L.', tempo: '55min', status: 'entregue' },
  { id: '#1032', cliente: 'Lucas Ferreira', addr: 'Rua Bela Cintra, 90', total: 'R$ 78,20', entregador: 'Carla S.', tempo: '1h10min', status: 'entregue' },
];

let currentEntregaFilter = 'aguardando';

function buildEntregas(filter) {
  const list = document.getElementById('entregasList');
  if (!list) return;
  const filtered = entregasData.filter(e => e.status === filter);
  if (filtered.length === 0) {
    list.innerHTML = '<p style="text-align:center;padding:30px;color:#64748b;font-size:.85rem">Nenhuma entrega neste status</p>';
    return;
  }
  list.innerHTML = filtered.map(e => `
    <div class="entrega-card">
      <div class="ec-header">
        <span class="ec-id">${e.id}</span>
        <span class="ec-time"><i class="fa-solid fa-clock"></i> ${e.tempo}</span>
      </div>
      <div class="ec-cliente"><strong>${e.cliente}</strong></div>
      <div class="ec-addr"><i class="fa-solid fa-location-dot" style="color:#f97316"></i>${e.addr}</div>
      <div class="ec-footer">
        <span class="ec-entregador"><i class="fa-solid fa-motorcycle"></i> ${e.entregador}</span>
        <span class="ec-total">${e.total}</span>
      </div>
      ${filter === 'aguardando' ? `<button class="btn btn-primary btn-block" style="margin-top:10px" onclick="showToast('Entregador atribuído!')"><i class="fa-solid fa-motorcycle"></i> Despachar</button>` : ''}
    </div>
  `).join('');
}

function filterEntregas(filter, btn) {
  document.querySelectorAll('.etab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentEntregaFilter = filter;
  buildEntregas(filter);
}

function buildMapPins() {
  const pins = document.getElementById('mapPins');
  if (!pins) return;
  const positions = [
    { label: '#1038', x: 30, y: 40, color: '#f97316' },
    { label: '#1040', x: 55, y: 25, color: '#8b5cf6' },
    { label: '#1036', x: 70, y: 60, color: '#3b82f6' },
    { label: 'Restaurante', x: 50, y: 50, color: '#10b981' },
  ];
  pins.innerHTML = positions.map(p => `
    <div class="map-pin" style="left:${p.x}%;top:${p.y}%">
      <div class="map-pin-dot" style="background:${p.color}">${p.label === 'Restaurante' ? '🏠' : '🛵'}</div>
      <div class="map-pin-label">${p.label}</div>
    </div>
  `).join('');
}

// ===== CLIENTES =====
const clientesData = [
  { name: 'João Silva', phone: '(11) 9 8765-4321', total: 'R$ 428,50', pedidos: 12, ultima: '06/06/2026', nivel: 'VIP' },
  { name: 'Maria Oliveira', phone: '(11) 9 9876-5432', total: 'R$ 312,00', pedidos: 8, ultima: '05/06/2026', nivel: 'Frequente' },
  { name: 'Carlos Santos', phone: '(11) 9 7654-3210', total: 'R$ 189,90', pedidos: 5, ultima: '04/06/2026', nivel: 'Normal' },
  { name: 'Ana Paula', phone: '(11) 9 5432-1098', total: 'R$ 654,00', pedidos: 18, ultima: '06/06/2026', nivel: 'VIP' },
  { name: 'Roberto Costa', phone: '(11) 9 4321-0987', total: 'R$ 98,70', pedidos: 3, ultima: '01/06/2026', nivel: 'Normal' },
  { name: 'Patricia Nunes', phone: '(11) 9 3210-9876', total: 'R$ 276,50', pedidos: 7, ultima: '03/06/2026', nivel: 'Frequente' },
  { name: 'Lucas Ferreira', phone: '(11) 9 2109-8765', total: 'R$ 542,00', pedidos: 15, ultima: '06/06/2026', nivel: 'VIP' },
  { name: 'Juliana Martins', phone: '(11) 9 1098-7654', total: 'R$ 134,50', pedidos: 4, ultima: '02/06/2026', nivel: 'Normal' },
];

function buildClientesTable() {
  const tbody = document.getElementById('clientesTable');
  if (!tbody) return;
  const nivelClass = { VIP: 'nivel-vip', Frequente: 'nivel-freq', Normal: 'nivel-normal' };
  const nivelIcon = { VIP: '⭐', Frequente: '🔵', Normal: '⚪' };
  tbody.innerHTML = clientesData.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.phone}</td>
      <td><strong style="color:#f97316">${c.total}</strong></td>
      <td>${c.pedidos}</td>
      <td>${c.ultima}</td>
      <td><span class="nivel-badge ${nivelClass[c.nivel]}">${nivelIcon[c.nivel]} ${c.nivel}</span></td>
      <td><button class="btn btn-sm btn-outline" onclick="showToast('Abrindo perfil...')"><i class="fa-solid fa-eye"></i></button></td>
    </tr>
  `).join('');
}

// ===== ESTOQUE =====
const estoqueData = [
  { name: 'Carne Bovina', cat: 'Carnes', qtde: 15, min: 10, un: 'kg', custo: 42.00, val: '15/06/2026', status: 'ok' },
  { name: 'Frango', cat: 'Carnes', qtde: 8, min: 10, un: 'kg', custo: 18.00, val: '12/06/2026', status: 'low' },
  { name: 'Queijo Mussarela', cat: 'Frios', qtde: 2, min: 5, un: 'kg', custo: 32.00, val: '10/06/2026', status: 'crit' },
  { name: 'Bacon', cat: 'Frios', qtde: 4, min: 3, un: 'kg', custo: 38.00, val: '14/06/2026', status: 'ok' },
  { name: 'Alface', cat: 'Hortifrúti', qtde: 12, min: 8, un: 'un', custo: 2.50, val: '08/06/2026', status: 'ok' },
  { name: 'Tomate', cat: 'Hortifrúti', qtde: 5, min: 10, un: 'kg', custo: 5.00, val: '09/06/2026', status: 'low' },
  { name: 'Coca-Cola 2L', cat: 'Bebidas', qtde: 48, min: 24, un: 'un', custo: 6.50, val: '31/12/2026', status: 'ok' },
  { name: 'Cerveja Long Neck', cat: 'Bebidas', qtde: 1, min: 24, un: 'un', custo: 3.80, val: '31/12/2026', status: 'crit' },
  { name: 'Farinha de Trigo', cat: 'Secos', qtde: 20, min: 10, un: 'kg', custo: 4.80, val: '30/09/2026', status: 'ok' },
  { name: 'Azeite Extra Virgem', cat: 'Secos', qtde: 3, min: 5, un: 'L', custo: 28.00, val: '31/12/2026', status: 'low' },
  { name: 'Embalagem Delivery', cat: 'Embalagens', qtde: 200, min: 100, un: 'un', custo: 0.80, val: '—', status: 'ok' },
  { name: 'Caixa Pizza G', cat: 'Embalagens', qtde: 1, min: 30, un: 'un', custo: 1.20, val: '—', status: 'crit' },
];

function buildEstoqueTable() {
  const tbody = document.getElementById('estoqueTable');
  if (!tbody) return;
  tbody.innerHTML = estoqueData.map(i => `
    <tr>
      <td><strong>${i.name}</strong></td>
      <td>${i.cat}</td>
      <td class="${i.status === 'crit' ? 'stock-critical' : i.status === 'low' ? 'stock-low' : 'stock-ok'}">${i.qtde}</td>
      <td>${i.min}</td>
      <td>${i.un}</td>
      <td>R$ ${i.custo.toFixed(2).replace('.', ',')}</td>
      <td>${i.val}</td>
      <td><span class="stock-status ${i.status}">${i.status === 'ok' ? '✓ Normal' : i.status === 'low' ? '⚠ Baixo' : '🔴 Crítico'}</span></td>
    </tr>
  `).join('');
}

// ===== FINANCEIRO =====
const lancamentosData = [
  { tipo: 'receita', desc: 'Venda Mesa 7', cat: 'Vendas', valor: 73.80, data: '06/06' },
  { tipo: 'receita', desc: 'Delivery #1038', cat: 'Vendas', valor: 44.00, data: '06/06' },
  { tipo: 'despesa', desc: 'Reposição Carnes', cat: 'Fornecedores', valor: 420.00, data: '06/06' },
  { tipo: 'receita', desc: 'Venda Mesa 9', cat: 'Vendas', valor: 208.00, data: '06/06' },
  { tipo: 'despesa', desc: 'Salário Semanal', cat: 'Folha', valor: 1840.00, data: '05/06' },
  { tipo: 'receita', desc: 'Delivery #1040', cat: 'Vendas', valor: 62.90, data: '05/06' },
  { tipo: 'despesa', desc: 'Gás de Cozinha', cat: 'Utilidades', valor: 280.00, data: '04/06' },
];

function buildLancamentos() {
  const list = document.getElementById('lancamentosList');
  if (!list) return;
  list.innerHTML = lancamentosData.map(l => `
    <div class="lancamento-item">
      <div class="lanc-icon ${l.tipo}"><i class="fa-solid fa-${l.tipo === 'receita' ? 'arrow-down' : 'arrow-up'}"></i></div>
      <div class="lanc-desc">
        <strong>${l.desc}</strong>
        <small>${l.cat} — ${l.data}</small>
      </div>
      <span class="lanc-valor ${l.tipo === 'receita' ? 'rec' : 'desp'}">${l.tipo === 'receita' ? '+' : '-'}R$ ${l.valor.toFixed(2).replace('.', ',')}</span>
    </div>
  `).join('');
}

function initFinCharts() {
  const ctx = document.getElementById('chartFluxo');
  if (!ctx || ctx.dataset.built) return;
  ctx.dataset.built = '1';
  const days = Array.from({length: 6}, (_, i) => `0${i+1}/06`);
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        { label: 'Receitas', data: [4200, 3800, 5100, 4600, 6200, 4820], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', fill: true, tension: .4, pointRadius: 4, pointBackgroundColor: '#10b981' },
        { label: 'Despesas', data: [2800, 3100, 2600, 3400, 2900, 3200], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.1)', fill: true, tension: .4, pointRadius: 4, pointBackgroundColor: '#ef4444' },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { ticks: { callback: v => 'R$' + (v/1000).toFixed(1) + 'k' } } }
    }
  });
}

function initRelCharts() {
  const ctx30 = document.getElementById('chartRel30');
  if (ctx30 && !ctx30.dataset.built) {
    ctx30.dataset.built = '1';
    const labels = Array.from({length: 30}, (_, i) => i + 1);
    const data = labels.map(() => Math.floor(2500 + Math.random() * 5000));
    new Chart(ctx30, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: 'Receita', data, borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,.1)', fill: true, tension: .4, pointRadius: 2 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'R$' + (v/1000).toFixed(1) + 'k' } } } }
    });
  }

  const ctxPag = document.getElementById('chartPagamentos');
  if (ctxPag && !ctxPag.dataset.built) {
    ctxPag.dataset.built = '1';
    new Chart(ctxPag, {
      type: 'doughnut',
      data: {
        labels: ['PIX', 'Crédito', 'Débito', 'Dinheiro'],
        datasets: [{ data: [38, 28, 22, 12], backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'], borderWidth: 2, borderColor: '#fff' }]
      },
      options: { responsive: true, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
    });
  }

  const ctxH = document.getElementById('chartHoras');
  if (ctxH && !ctxH.dataset.built) {
    ctxH.dataset.built = '1';
    const hours = ['10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h'];
    new Chart(ctxH, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [{ label: 'Pedidos', data: [4, 12, 28, 32, 18, 9, 11, 14, 22, 30, 35, 28, 15], backgroundColor: 'rgba(249,115,22,.8)', borderRadius: 6 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }
}

// ===== CONFIGURAÇÕES =====
function showConfig(btn, panelId) {
  document.querySelectorAll('.cfg-nav').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cfg-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

// ===== INIT =====
function init() {
  buildPdvGrid(pdvProducts);
  buildKanban();
  buildCardapio();
  buildEntregas('aguardando');
  buildMapPins();
  buildClientesTable();
  buildEstoqueTable();
  buildLancamentos();
  buildMesas();
  initDashCharts();
}

document.addEventListener('DOMContentLoaded', init);
