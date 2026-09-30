/* =====================================================================
   LeadSites — configuração
   ===================================================================== */
const CONFIG = {
  // Coloque aqui a URL do seu backend quando tiver a API de leads.
  // Vazio = modo demonstração (leads fictícios).
  API_URL: '',
  COST_PER_SEARCH: 6,
  CAKTO: {
    pro: 'https://pay.cakto.com.br/SEU_LINK_PRO',
    max: 'https://pay.cakto.com.br/SEU_LINK_MAX'
  }
};

const PLANS = {
  free: { name: 'Free', price: 0,     credits: 30,  leads: 6,  msg: 'Abordagem simples',
          perks: ['<b>30 créditos</b> grátis', '<b>6 lugares</b> por busca', 'Mensagem de abordagem simples', 'Botão de WhatsApp direto'] },
  pro:  { name: 'Pro',  price: 19.9,  credits: 100, leads: 15, msg: 'Abordagem melhorada',
          perks: ['<b>100 créditos</b>', '<b>15 lugares</b> por busca', 'Mensagem de abordagem melhorada', 'Botão de WhatsApp direto'] },
  max:  { name: 'Max',  price: 30,    credits: 300, leads: 50, msg: 'Melhor abordagem',
          perks: ['<b>300 créditos</b>', '<b>50 lugares</b> por busca', 'Melhor mensagem de abordagem', 'Botão de WhatsApp direto'] }
};

const STATES = [
  ['AC','Acre',68],['AL','Alagoas',82],['AP','Amapá',96],['AM','Amazonas',92],['BA','Bahia',71],['CE','Ceará',85],
  ['DF','Distrito Federal',61],['ES','Espírito Santo',27],['GO','Goiás',62],['MA','Maranhão',98],['MT','Mato Grosso',65],
  ['MS','Mato Grosso do Sul',67],['MG','Minas Gerais',31],['PA','Pará',91],['PB','Paraíba',83],['PR','Paraná',41],
  ['PE','Pernambuco',81],['PI','Piauí',86],['RJ','Rio de Janeiro',21],['RN','Rio Grande do Norte',84],
  ['RS','Rio Grande do Sul',51],['RO','Rondônia',69],['RR','Roraima',95],['SC','Santa Catarina',48],
  ['SP','São Paulo',11],['SE','Sergipe',79],['TO','Tocantins',63]
];

// Lista reserva, usada só se a API do IBGE não responder.
const FALLBACK_CITIES = {
  AC:['Rio Branco','Cruzeiro do Sul','Sena Madureira','Tarauacá','Feijó'],
  AL:['Maceió','Arapiraca','Rio Largo','Palmeira dos Índios','União dos Palmares'],
  AP:['Macapá','Santana','Laranjal do Jari','Oiapoque','Mazagão'],
  AM:['Manaus','Parintins','Itacoatiara','Manacapuru','Coari'],
  BA:['Salvador','Feira de Santana','Vitória da Conquista','Camaçari','Ilhéus','Juazeiro','Porto Seguro'],
  CE:['Fortaleza','Caucaia','Juazeiro do Norte','Sobral','Maracanaú'],
  DF:['Brasília','Taguatinga','Ceilândia','Samambaia','Gama'],
  ES:['Vitória','Vila Velha','Serra','Cariacica','Linhares'],
  GO:['Goiânia','Aparecida de Goiânia','Anápolis','Rio Verde','Luziânia'],
  MA:['São Luís','Imperatriz','Caxias','Timon','Codó'],
  MT:['Cuiabá','Várzea Grande','Rondonópolis','Sinop','Tangará da Serra'],
  MS:['Campo Grande','Dourados','Três Lagoas','Corumbá','Ponta Porã'],
  MG:['Belo Horizonte','Uberlândia','Contagem','Juiz de Fora','Betim','Montes Claros'],
  PA:['Belém','Ananindeua','Santarém','Marabá','Castanhal'],
  PB:['João Pessoa','Campina Grande','Santa Rita','Patos','Bayeux'],
  PR:['Curitiba','Londrina','Maringá','Ponta Grossa','Cascavel','Foz do Iguaçu'],
  PE:['Recife','Jaboatão dos Guararapes','Olinda','Caruaru','Petrolina'],
  PI:['Teresina','Parnaíba','Picos','Piripiri','Floriano'],
  RJ:['Rio de Janeiro','Niterói','Duque de Caxias','Nova Iguaçu','Campos dos Goytacazes','Petrópolis'],
  RN:['Natal','Mossoró','Parnamirim','São Gonçalo do Amarante','Caicó'],
  RS:['Porto Alegre','Caxias do Sul','Pelotas','Canoas','Santa Maria'],
  RO:['Porto Velho','Ji-Paraná','Ariquemes','Vilhena','Cacoal'],
  RR:['Boa Vista','Rorainópolis','Caracaraí','Pacaraima','Cantá'],
  SC:['Florianópolis','Joinville','Blumenau','Itajaí','Chapecó'],
  SP:['São Paulo','Campinas','Guarulhos','Santos','Ribeirão Preto','Sorocaba','São José dos Campos'],
  SE:['Aracaju','Nossa Senhora do Socorro','Lagarto','Itabaiana','Estância'],
  TO:['Palmas','Araguaína','Gurupi','Porto Nacional','Paraíso do Tocantins']
};

const SEGMENTS = [
  'Hamburgueria','Pizzaria','Restaurante','Lanchonete','Açaí e sorveteria','Padaria','Cafeteria','Bar e petiscaria',
  'Barbearia','Salão de beleza','Clínica de estética','Studio de unhas','Academia','Clínica odontológica','Clínica médica',
  'Psicólogo','Fisioterapia','Pet shop','Clínica veterinária','Oficina mecânica','Lava jato','Auto peças','Loja de roupas',
  'Loja de calçados','Loja de celulares','Mercadinho','Farmácia','Floricultura','Papelaria','Loja de móveis',
  'Escritório de advocacia','Contabilidade','Imobiliária','Autoescola','Escola de idiomas','Studio de tatuagem',
  'Pousada e hotel','Buffet e eventos','Fotógrafo','Construtora e reformas'
];

const ISSUES = [
  ['nosite','Sem site','não tem site','Sem site'],
  ['old','Site desatualizado','tem um site desatualizado','Site desatualizado'],
  ['design','Design ruim','tem um site com o visual pouco profissional','Design ruim'],
  ['slow','Site lento','tem um site que demora para abrir no celular','Site lento'],
  ['menu','Sem cardápio ou catálogo online','não tem cardápio ou catálogo online','Sem catálogo online'],
  ['gmb','Sem Google Meu Negócio','não aparece direito no Google Maps','Sem Google Meu Negócio']
];

const SERVICES = [
  'Criação de site','Redesign de site','Loja virtual','Cardápio digital','Landing page','Google Meu Negócio'
];

/* =====================================================================
   Utilitários e "banco de dados" (localStorage)
   Para produção, troque este bloco por chamadas ao seu backend.
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl = n => n === 0 ? 'R$ 0' : 'R$ ' + n.toFixed(2).replace('.', ',');

const db = {
  get(k, d) { try { const v = localStorage.getItem('ls_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ls_' + k, JSON.stringify(v)); } catch {} }
};

async function hashPass(text) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('leadsites::' + text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let h = 5381; for (const c of 'leadsites::' + text) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
    return 'x' + h;
  }
}

function toast(msg) {
  const box = $('#toast'), d = document.createElement('div');
  d.textContent = msg; box.appendChild(d);
  setTimeout(() => d.remove(), 2800);
}

/* =====================================================================
   Navegação entre telas
   ===================================================================== */
let user = null;

function show(view) {
  ['landing', 'auth', 'app'].forEach(v => $('#view-' + v).classList.toggle('hidden', v !== view));
  window.scrollTo(0, 0);
}

function showTab(tab) {
  $('#form-login').classList.toggle('hidden', tab !== 'login');
  $('#form-register').classList.toggle('hidden', tab !== 'register');
  $('#tab-login').classList.toggle('on', tab === 'login');
  $('#tab-register').classList.toggle('on', tab === 'register');
  $('#login-err').textContent = ''; $('#register-err').textContent = '';
}

document.addEventListener('click', e => {
  const go = e.target.closest('[data-go]');
  if (go) {
    const t = go.dataset.go;
    if (t === 'landing') return show('landing');
    if (user) return enterApp();
    show('auth'); showTab(t); return;
  }
  const tab = e.target.closest('[data-tab]');
  if (tab) return showTab(tab.dataset.tab);
  const act = e.target.closest('[data-action]');
  if (!act) return;
  const a = act.dataset.action;
  if (a === 'plans') openModal();
  else if (a === 'closeModal') closeModal();
  else if (a === 'logout') logout();
  else if (a === 'copy') copyMsg(act.dataset.i);
  else if (a === 'wa') openWhats(act.dataset.i);
  else if (a === 'activate') activatePlan(act.dataset.plan);
});
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* =====================================================================
   Cadastro e login
   ===================================================================== */
const maskPhone = v => {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2, v.length > 10 ? 7 : 6)}-${v.slice(v.length > 10 ? 7 : 6)}`;
  if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
  return v;
};
$('#r-phone').addEventListener('input', e => e.target.value = maskPhone(e.target.value));

$('#form-register').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#register-err');
  const name = $('#r-name').value.trim();
  const email = $('#r-email').value.trim().toLowerCase();
  const phone = $('#r-phone').value.replace(/\D/g, '');
  const pass = $('#r-pass').value;
  if (name.length < 2) return err.textContent = 'Digite seu nome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err.textContent = 'Digite um e-mail válido.';
  if (phone.length < 10) return err.textContent = 'Digite o celular com DDD.';
  if (pass.length < 6) return err.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
  const users = db.get('users', {});
  if (users[email]) return err.textContent = 'Este e-mail já tem conta. Use a aba Entrar.';
  users[email] = { name, email, phone, pass: await hashPass(pass), plan: 'free', credits: PLANS.free.credits, searches: 0, created: Date.now() };
  db.set('users', users); db.set('session', email);
  user = users[email];
  toast('Conta criada! Você ganhou 30 créditos.');
  enterApp();
});

$('#form-login').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#login-err');
  const email = $('#l-email').value.trim().toLowerCase();
  const u = db.get('users', {})[email];
  if (!u || u.pass !== await hashPass($('#l-pass').value)) return err.textContent = 'E-mail ou senha incorretos.';
  db.set('session', email); user = u; enterApp();
});

function logout() { db.set('session', null); user = null; show('landing'); }

function saveUser() {
  const users = db.get('users', {}); users[user.email] = user; db.set('users', users);
}

/* =====================================================================
   Plataforma
   ===================================================================== */
let lastLeads = [];
let cityCache = {};

function enterApp() {
  show('app');
  $('#userName').textContent = user.name.split(' ')[0];
  $('#demoNote').classList.toggle('hidden', !!CONFIG.API_URL);
  refreshCredits();
}

function refreshCredits() {
  const p = PLANS[user.plan];
  $('#planName').textContent = p.name;
  $('#creditsNum').textContent = user.credits;
  $('#creditsBar').style.width = Math.min(100, user.credits / p.credits * 100) + '%';
  const blocked = user.credits < CONFIG.COST_PER_SEARCH;
  $('#locked').classList.toggle('hidden', !blocked);
  $('#btnSearch').textContent = blocked ? 'Créditos esgotados' : 'Buscar leads';
  $('#searchInfo').textContent = blocked
    ? 'Assine um plano para liberar as buscas.'
    : `Cada busca gasta ${CONFIG.COST_PER_SEARCH} créditos e mostra até ${p.leads} lugares. Você tem ${Math.floor(user.credits / CONFIG.COST_PER_SEARCH)} busca(s).`;
}

function fillFilters() {
  $('#uf').innerHTML = '<option value="">Selecione o estado</option>' + STATES.map(s => `<option value="${s[0]}">${s[1]} (${s[0]})</option>`).join('');
  $('#segment').innerHTML = '<option value="">Selecione o tipo de negócio</option>' + SEGMENTS.map(s => `<option>${s}</option>`).join('');
  $('#service').innerHTML = SERVICES.map(s => `<option>${s}</option>`).join('');
  $('#issues').innerHTML = ISSUES.map((x, i) => `<input type="radio" name="issue" id="is-${x[0]}" value="${x[0]}" ${i === 0 ? 'checked' : ''}><label for="is-${x[0]}">${x[1]}</label>`).join('');
}

$('#uf').addEventListener('change', async e => {
  const uf = e.target.value, sel = $('#city');
  if (!uf) { sel.disabled = true; sel.innerHTML = '<option>Escolha o estado primeiro</option>'; return; }
  sel.disabled = true; sel.innerHTML = '<option>Carregando cidades...</option>';
  let list = cityCache[uf];
  if (!list) {
    try {
      const r = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
      if (!r.ok) throw 0;
      list = (await r.json()).map(c => c.nome);
    } catch {
      list = FALLBACK_CITIES[uf];
      toast('Sem conexão com o IBGE. Mostrando as principais cidades.');
    }
    cityCache[uf] = list;
  }
  sel.innerHTML = '<option value="">Selecione a cidade</option>' + list.map(c => `<option>${esc(c)}</option>`).join('');
  sel.disabled = false;
});

/* ---------- mensagens de abordagem por plano ---------- */
function buildMessage(l, plan, service, issue) {
  const s = service.toLowerCase();
  if (plan === 'max') {
    return `Olá, tudo bem? Aqui é ${user.name.split(' ')[0]}. Encontrei a ${l.name} pesquisando ${l.segment.toLowerCase()} em ${l.city} e vi que vocês têm ${l.reviews} avaliações com nota ${l.rating.toFixed(1).replace('.', ',')}, um resultado que poucos conseguem. Notei que ${issue.toLowerCase()}, e isso faz clientes que pesquisam no Google irem para o concorrente.\n\nTrabalho com ${s} e já preparei uma ideia de como a ${l.name} ficaria online. Posso te mandar um exemplo, sem compromisso, ainda hoje? Se gostar, conversamos sobre valores.`;
  }
  if (plan === 'pro') {
    return `Olá, tudo bem? Aqui é ${user.name.split(' ')[0]}. Vi a ${l.name} aqui em ${l.city} e percebi que ${issue.toLowerCase()}. Muitos clientes procuram ${l.segment.toLowerCase()} pelo Google antes de ir ao local, e ter um bom site ajuda a atrair mais gente.\n\nEu faço ${s} e posso te mostrar como ficaria para o seu negócio. Posso te enviar um exemplo?`;
  }
  return `Olá, tudo bem? Vi a ${l.name} aqui em ${l.city} e percebi que ${issue.toLowerCase()}. Eu faço ${s}. Posso te mostrar um exemplo?`;
}

/* ---------- geração de leads de demonstração ---------- */
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function demoLeads(f, limit) {
  const r = rng(f.city.length * 977 + f.segment.length * 131 + user.searches * 7919 + Date.now() % 1000);
  const pick = a => a[Math.floor(r() * a.length)];
  const suffix = ['Sabor & Cia','do Zé','Premium','Central','da Vila','Top','Real','Bom Gosto','do Bairro','Express','Nova Era','Vip','Família','Gold','Ponto Certo','Dois Irmãos','Estrela','Elite','Mania','Bela Vista','Popular','Flor de Lis','Santa Luzia','Sol Nascente','Master'];
  const streets = ['Rua das Flores','Av. Brasil','Rua São José','Av. Central','Rua 7 de Setembro','Rua Sete','Av. Getúlio Vargas','Rua da Paz','Rua Dom Pedro II','Av. Principal'];
  const hoods = ['Centro','Jardim América','Vila Nova','São Francisco','Boa Vista','Alto da Colina','Santa Rita','Novo Horizonte'];
  const ddd = STATES.find(s => s[0] === f.uf)[2];
  const used = new Set(), out = [];
  const base = f.segment.split(' ')[0].replace(/^(Clínica|Loja|Studio|Escritório)$/, f.segment.split(' ').slice(0, 2).join(' '));
  while (out.length < limit) {
    const name = `${base} ${pick(suffix)}`;
    if (used.has(name)) { if (used.size > suffix.length - 1) used.clear(); continue; }
    used.add(name);
    const num = String(Math.floor(r() * 90000000) + 10000000);
    out.push({
      name, segment: f.segment, city: f.city, uf: f.uf,
      address: `${pick(streets)}, ${Math.floor(r() * 900) + 10} - ${pick(hoods)}, ${f.city} - ${f.uf}`,
      phone: `(${ddd}) 9${num.slice(0, 4)}-${num.slice(4)}`,
      whatsapp: `55${ddd}9${num}`,
      rating: 3.6 + r() * 1.3, reviews: Math.floor(r() * 400) + 8
    });
  }
  return out;
}

/* ---------- busca ---------- */
async function fetchLeads(f, limit) {
  if (!CONFIG.API_URL) { await new Promise(r => setTimeout(r, 2200)); return demoLeads(f, limit); }
  // Contrato esperado do seu backend: POST /api/leads -> [{name,address,phone,whatsapp,rating,reviews}]
  const res = await fetch(CONFIG.API_URL + '/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...f, limit, email: user.email })
  });
  if (!res.ok) throw new Error('Falha na API');
  const data = await res.json();
  return data.map(d => ({ segment: f.segment, city: f.city, uf: f.uf, rating: 4, reviews: 0, ...d }));
}

$('#btnSearch').addEventListener('click', async () => {
  if (user.credits < CONFIG.COST_PER_SEARCH) return openModal();
  const f = { uf: $('#uf').value, city: $('#city').value, segment: $('#segment').value, service: $('#service').value, issue: $('#issues input:checked').value };
  if (!f.uf || !f.city || !f.segment) return toast('Escolha estado, cidade e tipo de negócio.');
  const plan = PLANS[user.plan], btn = $('#btnSearch'), box = $('#results');
  btn.disabled = true;
  box.innerHTML = '<div class="scan"><div class="radar"></div><p>Buscando negócios em ' + esc(f.city) + '...</p></div>';
  try {
    const leads = await fetchLeads(f, plan.leads);
    user.credits -= CONFIG.COST_PER_SEARCH; user.searches++; saveUser();
    const issue = ISSUES.find(i => i[0] === f.issue);
    lastLeads = leads.slice(0, plan.leads).map(l => ({ ...l, issueTag: issue[3], msg: buildMessage(l, user.plan, f.service, issue[2]) }));
    renderLeads(f);
  } catch {
    box.innerHTML = '<div class="empty">Não foi possível buscar agora. Seus créditos não foram gastos. Tente de novo.</div>';
  }
  btn.disabled = false;
  refreshCredits();
  if (user.credits < CONFIG.COST_PER_SEARCH) setTimeout(openModal, 1800);
});

function renderLeads(f) {
  const box = $('#results');
  if (!lastLeads.length) { box.innerHTML = '<div class="empty">Nenhum lugar encontrado com esses filtros. Tente outra cidade ou outro problema.</div>'; return; }
  box.innerHTML = `
    <div class="results-head"><h2>${lastLeads.length} lugares em ${esc(f.city)} - ${esc(f.uf)}</h2><span class="tag cy">Gastou ${CONFIG.COST_PER_SEARCH} créditos</span></div>
    <div class="leads">${lastLeads.map((l, i) => `
      <article class="lead" style="animation-delay:${i * 60}ms">
        <div class="tags"><span class="tag cy">${esc(l.segment)}</span><span class="tag">${esc(l.issueTag)}</span></div>
        <h3>${esc(l.name)}</h3>
        <div class="meta">
          <span>📍 ${esc(l.address || '')}</span>
          <span>📞 ${esc(l.phone || 'Sem telefone')}</span>
          <span><span class="stars">★</span> ${l.rating.toFixed(1).replace('.', ',')} · ${l.reviews} avaliações</span>
        </div>
        <textarea id="msg-${i}" aria-label="Mensagem de abordagem para ${esc(l.name)}">${esc(l.msg)}</textarea>
        <div class="acts">
          <button class="btn btn-wa btn-sm" data-action="wa" data-i="${i}">WhatsApp</button>
          <button class="btn btn-ghost btn-sm" data-action="copy" data-i="${i}">Copiar mensagem</button>
        </div>
      </article>`).join('')}</div>`;
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function copyMsg(i) {
  const t = $('#msg-' + i).value;
  try { await navigator.clipboard.writeText(t); }
  catch { const ta = $('#msg-' + i); ta.select(); document.execCommand('copy'); }
  toast('Mensagem copiada!');
}
function openWhats(i) {
  const l = lastLeads[i];
  if (!l.whatsapp) return toast('Este lugar não tem WhatsApp.');
  window.open(`https://wa.me/${l.whatsapp}?text=${encodeURIComponent($('#msg-' + i).value)}`, '_blank', 'noopener');
}

/* =====================================================================
   Planos e pagamento (Cakto)
   ===================================================================== */
function plansHTML(mode) {
  return Object.entries(PLANS).map(([id, p]) => {
    const cls
