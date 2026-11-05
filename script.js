// ===== Configuração =====
// Número que recebe os pedidos (somente dígitos, com DDI e DDD).
const WHATSAPP = '5586999212786';
const FUSO = 'America/Fortaleza';

// Horários: dia da semana (0 = domingo) → [abre, fecha] em horas
const HORARIOS = {
  0: null,
  1: [7, 19], 2: [7, 19], 3: [7, 19], 4: [7, 19], 5: [7, 19],
  6: [8, 14],
};

const CARDAPIO = {
  cafes: [
    { id: 'coado', nome: 'Café coado', desc: 'Coado na hora, grão da semana.', preco: 7 },
    { id: 'espresso', nome: 'Espresso', desc: 'Curto e encorpado.', preco: 6 },
    { id: 'capuccino', nome: 'Capuccino da casa', desc: 'Espresso, leite vaporizado e canela.', preco: 12 },
    { id: 'latte', nome: 'Latte', desc: 'Espresso com bastante leite cremoso.', preco: 11 },
    { id: 'mocha', nome: 'Mocha', desc: 'Espresso, chocolate e leite.', preco: 13 },
  ],
  gelados: [
    { id: 'cold-brew', nome: 'Cold brew', desc: 'Extraído a frio por 16 horas.', preco: 13 },
    { id: 'frappe', nome: 'Frappé de café', desc: 'Café batido com gelo e leite.', preco: 15 },
    { id: 'tonica', nome: 'Café tônica', desc: 'Espresso sobre água tônica e laranja.', preco: 14 },
    { id: 'cajuina', nome: 'Cajuína gelada', desc: 'Para quem não quer café.', preco: 8 },
  ],
  salgados: [
    { id: 'pao-queijo', nome: 'Pão de queijo', desc: 'Porção com 6 unidades.', preco: 10 },
    { id: 'misto', nome: 'Misto quente', desc: 'No pão de forma da casa.', preco: 12 },
    { id: 'tapioca', nome: 'Tapioca de queijo coalho', desc: 'Com manteiga da terra.', preco: 14 },
    { id: 'croissant', nome: 'Croissant recheado', desc: 'Presunto e queijo.', preco: 15 },
  ],
  doces: [
    { id: 'bolo-milho', nome: 'Bolo de milho', desc: 'Fatia, receita da avó.', preco: 9 },
    { id: 'brownie', nome: 'Brownie', desc: 'Com nozes, servido morno.', preco: 11 },
    { id: 'cookie', nome: 'Cookie de chocolate', desc: 'Crocante por fora, macio por dentro.', preco: 8 },
    { id: 'torta-limao', nome: 'Torta de limão', desc: 'Fatia com merengue maçaricado.', preco: 12 },
  ],
};

const real = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const todosItens = Object.values(CARDAPIO).flat();
const pedido = new Map(); // id → quantidade

// ===== Aberto agora =====
function agoraNoFuso() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(new Date());
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const get = (t) => partes.find((p) => p.type === t).value;
  return { dia: dias[get('weekday')], hora: Number(get('hour')) % 24 + Number(get('minute')) / 60 };
}

function proximaAbertura(dia) {
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (HORARIOS[d]) {
      const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      return `${i === 1 ? 'amanhã' : nomes[d]} às ${HORARIOS[d][0]}h`;
    }
  }
  return '';
}

function atualizarStatus() {
  const { dia, hora } = agoraNoFuso();
  const h = HORARIOS[dia];
  const el = document.querySelector('[data-status]');
  const texto = document.querySelector('[data-status-texto]');
  const aberto = h && hora >= h[0] && hora < h[1];

  el.classList.toggle('is-aberto', !!aberto);
  el.classList.toggle('is-fechado', !aberto);
  if (aberto) {
    texto.innerHTML = `Aberto <span class="status__detalhe">até ${h[1]}h</span>`;
  } else if (h && hora < h[0]) {
    texto.innerHTML = `Fechado <span class="status__detalhe">· abre hoje às ${h[0]}h</span>`;
  } else {
    texto.innerHTML = `Fechado <span class="status__detalhe">· abre ${proximaAbertura(dia)}</span>`;
  }

  document.querySelectorAll('.horarios tr').forEach((tr) => {
    tr.classList.toggle('is-hoje', tr.dataset.dias.split(',').map(Number).includes(dia));
  });
}
atualizarStatus();
setInterval(atualizarStatus, 60 * 1000);

// ===== Cardápio =====
const lista = document.querySelector('[data-itens]');
const abas = document.querySelectorAll('.aba');

function mostrarCategoria(cat) {
  lista.innerHTML = CARDAPIO[cat].map((item) => `
    <li class="item">
      <h3 class="item__nome">${item.nome}</h3>
      <p class="item__desc">${item.desc}</p>
      <div class="item__lado">
        <span class="item__preco">${real(item.preco)}</span>
        <button class="item__add${pedido.has(item.id) ? ' is-adicionado' : ''}" data-add="${item.id}">
          ${pedido.has(item.id) ? `No pedido (${pedido.get(item.id)})` : 'Adicionar'}
        </button>
      </div>
    </li>`).join('');
}

abas.forEach((aba) => {
  aba.addEventListener('click', () => {
    abas.forEach((a) => a.setAttribute('aria-selected', String(a === aba)));
    mostrarCategoria(aba.dataset.categoria);
  });
});

lista.addEventListener('click', (e) => {
  const botao = e.target.closest('[data-add]');
  if (!botao) return;
  const id = botao.dataset.add;
  pedido.set(id, (pedido.get(id) || 0) + 1);
  atualizarPedido();
});

// ===== Pedido =====
const caixa = document.querySelector('[data-pedido]');
const abrir = document.querySelector('[data-pedido-abrir]');
const painel = document.querySelector('[data-pedido-lista]');
const linhas = document.querySelector('[data-pedido-itens]');
const enviar = document.querySelector('[data-pedido-enviar]');

function atualizarPedido() {
  const itens = [...pedido].map(([id, qtd]) => ({ ...todosItens.find((i) => i.id === id), qtd }));
  const qtdTotal = itens.reduce((s, i) => s + i.qtd, 0);
  const total = itens.reduce((s, i) => s + i.qtd * i.preco, 0);

  caixa.hidden = qtdTotal === 0;
  document.body.classList.toggle('tem-pedido', qtdTotal > 0);
  if (qtdTotal === 0) { painel.hidden = true; abrir.setAttribute('aria-expanded', 'false'); }

  document.querySelector('[data-pedido-qtd]').textContent = `${qtdTotal} ${qtdTotal === 1 ? 'item' : 'itens'}`;
  document.querySelector('[data-pedido-total]').textContent = real(total);

  linhas.innerHTML = itens.map((i) => `
    <li class="pedido__linha">
      <span>${i.nome}</span>
      <span class="qtd">
        <button data-menos="${i.id}" aria-label="Remover um ${i.nome}">−</button>
        <span>${i.qtd}</span>
        <button data-mais="${i.id}" aria-label="Adicionar um ${i.nome}">+</button>
      </span>
      <strong>${real(i.qtd * i.preco)}</strong>
    </li>`).join('');

  const mensagem = [
    'Olá! Quero fazer um pedido:',
    '',
    ...itens.map((i) => `${i.qtd}x ${i.nome} (${real(i.qtd * i.preco)})`),
    '',
    `Total: ${real(total)}`,
  ].join('\n');
  enviar.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

  const abaAtiva = document.querySelector('.aba[aria-selected="true"]');
  mostrarCategoria(abaAtiva.dataset.categoria);
}

abrir.addEventListener('click', () => {
  const aberto = painel.hidden;
  painel.hidden = !aberto;
  abrir.setAttribute('aria-expanded', String(aberto));
});

linhas.addEventListener('click', (e) => {
  const mais = e.target.closest('[data-mais]');
  const menos = e.target.closest('[data-menos]');
  if (mais) pedido.set(mais.dataset.mais, pedido.get(mais.dataset.mais) + 1);
  if (menos) {
    const id = menos.dataset.menos;
    const q = pedido.get(id) - 1;
    q > 0 ? pedido.set(id, q) : pedido.delete(id);
  }
  if (mais || menos) atualizarPedido();
});

document.querySelector('[data-pedido-limpar]').addEventListener('click', () => {
  pedido.clear();
  atualizarPedido();
});

mostrarCategoria('cafes');
