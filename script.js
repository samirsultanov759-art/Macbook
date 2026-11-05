const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

addEventListener('error', e => { 
  if(e.target.tagName === 'IMG') e.target.style.display = 'none'; 
}, true);

const word = 'MACLINE';
const tw = $('#type');
const lb = $('#lbar i');
const lp = $('#lpct');
let i = 0, p = 0;

const ti = setInterval(() => { 
  tw.textContent = word.slice(0, ++i); 
  if (i >= word.length) clearInterval(ti); 
}, 110);

const pi = setInterval(() => {
  p = Math.min(100, p + Math.random() * 16);
  lb.style.width = p + '%';
  lp.textContent = Math.round(p) + '%';
  if (p >= 100) { 
    clearInterval(pi); 
    setTimeout(() => $('#loader').classList.add('done'), 350); 
  }
}, 140);

const words = 'Kuch. Tezlik. Go‘zallik.'.split(' ');
$('#heroTitle').innerHTML = words.map((w, k) => 
  `<span class="w ${k === 2 ? 'grad' : ''}" style="animation-delay:${.9 + k * .18}s">${w}</span>`
).join(' ');

const items = 'N1 ULTRA CHIP|22 SOAT BATAREYA|120 HZ EKRAN|980 GRAMM|WI-FI 7|2 YIL KAFOLAT'.split('|');
$('#mq').innerHTML = (items.concat(items)).map(t => `<span><b>${t}</b></span>`).join('');

addEventListener('scroll', () => $('#nav').classList.toggle('sc', scrollY > 40));

const io = new IntersectionObserver(es => es.forEach(e => { 
  if (e.isIntersecting) { 
    e.target.classList.add('on'); 
    io.unobserve(e.target); 
  } 
}), { threshold: .12 });

$$('.reveal').forEach(el => io.observe(el));

const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  co.unobserve(e.target);
  const b = e.target, n = +b.dataset.n, t0 = performance.now();
  (function f(t) {
    const k = Math.min(1, (t - t0) / 1600);
    b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(f);
  })(t0);
}), { threshold: .6 });

$$('.stat b').forEach(b => co.observe(b));

$$('.qa button').forEach(b => b.addEventListener('click', () => {
  const q = b.parentElement;
  const a = q.querySelector('.a');
  const open = q.classList.contains('open');

  $$('.qa').forEach(x => { 
    x.classList.remove('open'); 
    x.querySelector('.a').style.maxHeight = 0; 
  });

  if (!open) { 
    q.classList.add('open'); 
    a.style.maxHeight = a.scrollHeight + 'px'; 
  }
}));

const cart = new Map();
const dialog = $('#cart');
const count = $('#cartCount');
const list = $('#cartItems');
const total = $('#cartTotal');
const money = n => n.toLocaleString('uz-UZ') + " so'm";

function renderCart() {
  let sum = 0, qty = 0;
  list.replaceChildren();

  cart.forEach((item, id) => {
    sum += item.price * item.qty;
    qty += item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.img}" alt="">
      <div>
        <h3>${item.name}</h3>
        <p>${item.spec}</p>
        <b>${money(item.price)}</b>
        <div class="qty">
          <button data-id="${id}" data-step="-1" aria-label="Kamaytirish">−</button>
          <span>${item.qty}</span>
          <button data-id="${id}" data-step="1" aria-label="Ko‘paytirish">+</button>
          <button data-id="${id}" data-step="0" aria-label="Olib tashlash">🗑️</button>
        </div>
      </div>`;
    list.append(row);
  });

  count.textContent = qty;
  total.textContent = money(sum);
  $('#cartEmpty').hidden = cart.size > 0;
  $('#cartSummary').hidden = cart.size === 0;
}

$('#cartOpen').onclick = () => dialog.showModal();
$('#cartClose').onclick = () => dialog.close();
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

const toast = $('#toast');
let tt;

$$('.buy').forEach(b => b.onclick = () => {
  const c = b.closest('.card');
  const id = c.dataset.id;
  const item = cart.get(id);

  if (item) {
    item.qty++;
  } else {
    cart.set(id, { 
      name: c.querySelector('h3').textContent, 
      spec: c.querySelector('.spec').textContent, 
      price: Number(c.dataset.price), 
      img: c.querySelector('img').getAttribute('src'), 
      qty: 1 
    });
  }

  renderCart();
  
  toast.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => toast.classList.remove('show'), 2200);
});

list.onclick = e => {
  const b = e.target.closest('button');
  if (!b) return;
  const item = cart.get(b.dataset.id);
  if (!item) return;

  const step = Number(b.dataset.step);
  item.qty += step;

  if (step === 0 || item.qty < 1) {
    cart.delete(b.dataset.id);
  }

  renderCart();
};

renderCart();