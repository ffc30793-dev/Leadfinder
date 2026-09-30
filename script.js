import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================
   FIREBASE
   Se der "api-key-not-valid", copie o firebaseConfig de novo em:
   Firebase Console > Configurações do projeto > Geral > Seus aplicativos > Web
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBYCtd7kjuAOPEROpkZM3eDOpnCk4xg5kM",
  authDomain: "leadfinder-da5c6.firebaseapp.com",
  projectId: "leadfinder-da5c6",
  storageBucket: "leadfinder-da5c6.firebasestorage.app",
  messagingSenderId: "135285316125",
  appId: "1:135285316125:web:228528bb9f6c50e5b104f4",
  measurementId: "G-PB7GXC14WK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* =========================
   DADOS
========================= */

const services = [
  "Sem site", "Site desatualizado", "Landing page", "Loja virtual",
  "Cardápio digital", "Google/Maps", "Identidade visual", "Design",
  "Redes sociais", "Automação", "Agendamento online", "Sistema personalizado"
];

const types = [
  "Hamburgueria", "Pizzaria", "Restaurante", "Cafeteria", "Bar", "Padaria",
  "Salão de beleza", "Barbearia", "Clínica", "Dentista", "Academia", "Hotel",
  "Pousada", "Pet shop", "Oficina", "Auto center", "Loja de roupas",
  "Loja de eletrônicos", "Mercado", "Imobiliária", "Escritório",
  "Contabilidade", "Advocacia", "Escola", "Curso", "Fotografia", "Eventos",
  "Construtora", "Prestador de serviços", "Outro"
];

const states = [
  ["AC","Acre"], ["AL","Alagoas"], ["AP","Amapá"], ["AM","Amazonas"],
  ["BA","Bahia"], ["CE","Ceará"], ["DF","Distrito Federal"],
  ["ES","Espírito Santo"], ["GO","Goiás"], ["MA","Maranhão"],
  ["MT","Mato Grosso"], ["MS","Mato Grosso do Sul"], ["MG","Minas Gerais"],
  ["PA","Pará"], ["PB","Paraíba"], ["PR","Paraná"], ["PE","Pernambuco"],
  ["PI","Piauí"], ["RJ","Rio de Janeiro"], ["RN","Rio Grande do Norte"],
  ["RS","Rio Grande do Sul"], ["RO","Rondônia"], ["RR","Roraima"],
  ["SC","Santa Catarina"], ["SP","São Paulo"], ["SE","Sergipe"],
  ["TO","Tocantins"]
];

const demoLeads = [
  ["Burger House","Hamburgueria","11999990001"],
  ["Pizza do Bairro","Pizzaria","11988880002"],
  ["Café Brasil","Cafeteria","11977770003"],
  ["Barbearia Central","Barbearia","11966660004"],
  ["Studio Bella","Salão de beleza","11955550005"],
  ["Oficina Turbo","Oficina","11944440006"],
  ["Clínica Vida","Clínica","11933330007"],
  ["Casa do Açaí","Restaurante","11922220008"],
  ["Auto Center Sul","Auto center","11911110009"],
  ["Ponto da Moda","Loja de roupas","11900000010"],
  ["Imóveis Prime","Imobiliária","11999990011"],
  ["Pet Mundo","Pet shop","11988880012"],
  ["Padaria Avenida","Padaria","11977770013"],
  ["Academia Fit","Academia","11966660014"],
  ["Hotel Central","Hotel","11955550015"],
  ["Constrular","Construtora","11944440016"],
  ["Tech Mais","Loja de eletrônicos","11933330017"],
  ["Eventos Prime","Eventos","11922220018"],
  ["Contábil Fácil","Contabilidade","11911110019"],
  ["Foto & Arte","Fotografia","11900000020"]
];


/* =========================
   ESTADO
========================= */

let currentUser = null;
let credits = 30;
let currentPlan = "FREE";
let registering = false; // evita corrida entre cadastro e onAuthStateChanged

const $ = id => document.getElementById(id);


/* =========================
   TOAST
========================= */

function toast(message) {
  const element = $("toast");
  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(window.__leadToast);
  window.__leadToast = setTimeout(() => {
    element.classList.remove("show");
  }, 3500);
}


/* =========================
   CRÉDITOS
========================= */

function updateCredits() {
  const element = $("creditCount");
  if (element) element.textContent = credits;
}


/* =========================
   INICIALIZAÇÃO
========================= */

function initializeLists() {
  const state = $("stateSelect");
  const type = $("typeSelect");
  const need = $("needSelect");
  const tags = $("serviceTags");

  states.forEach(([uf, name]) => state.add(new Option(name, uf)));
  types.forEach(item => type.add(new Option(item, item)));
  services.forEach(item => need.add(new Option(item, item)));

  tags.innerHTML = services
    .map(item => `<span class="tag">${item}</span>`)
    .join("");
}


/* =========================
   CIDADES
========================= */

async function loadCities() {
  const state = $("stateSelect");
  const city = $("citySelect");

  city.disabled = true;

  if (!state.value) {
    city.innerHTML = "<option value=''>Selecione o estado primeiro</option>";
    return;
  }

  city.innerHTML = "<option value=''>Carregando cidades...</option>";

  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.value}/municipios?orderBy=nome`
    );

    if (!response.ok) throw new Error("Erro IBGE");

    const data = await response.json();

    city.innerHTML = "<option value=''>Selecione a cidade</option>";
    data.forEach(item => city.add(new Option(item.nome, item.nome)));
    city.disabled = false;

  } catch (error) {
    console.error(error);
    city.innerHTML = "<option value=''>Erro ao carregar cidades</option>";
    toast("Não foi possível carregar as cidades.");
  }
}


/* =========================
   MODAL
========================= */

function openAuth(mode) {
  const login = mode === "login";

  $("authModal").classList.add("show");
  $("authEyebrow").textContent = login ? "LOGIN" : "CRIAR CONTA";
  $("authTitle").textContent = login ? "Entrar" : "Criar conta";
  $("authSub").textContent = login
    ? "Entre na sua conta LeadFinder."
    : "Comece com 30 créditos grátis.";
  $("phoneLabel").style.display = login ? "none" : "block";
  $("phone").disabled = login;
  $("phone").required = !login;
  $("authSubmitText").textContent = login ? "Entrar" : "Criar conta";
  $("switchAuth").textContent = login
    ? "Ainda não tenho uma conta"
    : "Já tenho uma conta";
}

function closeAuth() {
  $("authModal").classList.remove("show");
}

function switchAuth() {
  const login = $("authTitle").textContent === "Entrar";
  openAuth(login ? "register" : "login");
}


/* =========================
   ERROS FIREBASE
========================= */

function firebaseError(error) {
  console.error(error);

  const code = error.code || "";

  if (code.startsWith("auth/api-key-not-valid")) {
    toast("Chave do Firebase (apiKey) inválida. Confira o firebaseConfig no script.js.");
    return;
  }

  const messages = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde.",
    "auth/network-request-failed": "Erro de conexão.",
    "auth/operation-not-allowed": "Ative E-mail/senha em Authentication no Firebase.",
    "auth/unauthorized-domain": "Adicione ffc30793-dev.github.io em Authentication > Configurações > Domínios autorizados.",
    "permission-denied": "O Firestore bloqueou o acesso (confira as regras).",
    "failed-precondition": "O Firestore ainda não foi configurado."
  };

  toast(messages[code] || error.message || "Não foi possível realizar a operação.");
}


/* =========================
   FIRESTORE
========================= */

// Só atualiza os créditos (plano e telefone não são mexidos pelo site)
async function saveCredits() {
  if (!currentUser) return false;

  try {
    await updateDoc(doc(db, "usuarios", currentUser.uid), {
      creditos: credits
    });
    return true;

  } catch (error) {
    firebaseError(error);
    return false;
  }
}

async function loadUser() {
  if (!currentUser) return;

  try {
    const reference = doc(db, "usuarios", currentUser.uid);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      credits = 30;
      currentPlan = "FREE";

      await setDoc(reference, {
        email: currentUser.email,
        telefone: "",
        creditos: 30,
        plano: "FREE",
        criadoEm: serverTimestamp()
      });

    } else {
      const data = snapshot.data();

      credits = typeof data.creditos === "number" ? data.creditos : 30;
      currentPlan = data.plano || "FREE";
    }

    updateCredits();

  } catch (error) {
    firebaseError(error);
  }
}


/* =========================
   LOGIN / CADASTRO
========================= */

$("authForm").addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("email").value.trim().toLowerCase();
  const password = $("password").value;
  const phone = $("phone").value.trim();
  const login = $("authTitle").textContent === "Entrar";

  if (password.length < 6) {
    toast("A senha precisa ter pelo menos 6 caracteres.");
    return;
  }

  if (!login && phone.replace(/\D/g, "").length < 10) {
    toast("Digite um celular válido com DDD.");
    return;
  }

  const button = $("authForm").querySelector("button[type='submit']");
  button.disabled = true;
  $("authSubmitText").textContent = "Aguarde...";

  try {
    if (login) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      currentUser = result.user;

      await loadUser();

      toast("Login realizado com sucesso!");
      closeAuth();

    } else {
      registering = true;

      const result = await createUserWithEmailAndPassword(auth, email, password);
      currentUser = result.user;

      credits = 30;
      currentPlan = "FREE";

      await setDoc(doc(db, "usuarios", currentUser.uid), {
        email,
        telefone: phone,
        creditos: 30,
        plano: "FREE",
        criadoEm: serverTimestamp()
      });

      updateCredits();

      toast("Conta criada! Você recebeu 30 créditos.");
      closeAuth();
    }

  } catch (error) {
    firebaseError(error);

  } finally {
    registering = false;
    button.disabled = false;
    $("authSubmitText").textContent = login ? "Entrar" : "Criar conta";
  }
});


/* =========================
   BUSCA
========================= */

async function searchLeads() {
  if (!currentUser) {
    toast("Faça login para realizar buscas.");
    openAuth("login");
    return;
  }

  if (credits < 6) {
    $("planos").scrollIntoView({ behavior: "smooth" });
    toast("Seus créditos acabaram.");
    return;
  }

  const state = $("stateSelect").value;
  const city = $("citySelect").value;
  const type = $("typeSelect").value;
  const need = $("needSelect").value;

  if (!state || !city || !type || !need) {
    toast("Preencha todos os campos.");
    return;
  }

  const oldCredits = credits;

  credits -= 6;
  updateCredits();

  if (!(await saveCredits())) {
    credits = oldCredits;
    updateCredits();
    return;
  }

  let limit = 6;
  if (currentPlan === "PRO") limit = 15;
  if (currentPlan === "MAX") limit = 50;

  renderResults(demoLeads.slice(0, limit), city, state);
}


/* =========================
   RESULTADOS
========================= */

function renderResults(leads, city, state) {
  $("resultsTitle").textContent = `Leads em ${city}`;
  $("resultCount").textContent = `${leads.length} leads`;

  $("results").innerHTML = leads
    .map((lead, index) => `
      <article class="result-card">

        <div>
          <h4>${lead[0]}</h4>

          <div class="result-meta">
            ${lead[1]} • ${city} - ${state}
            <br>
            ${lead[2]}
          </div>

          <div class="badges">
            <span class="badge green">Oportunidade</span>
            <span class="badge">Possível ausência de site</span>
          </div>
        </div>

        <div class="actions">
          <button class="icon-btn copy-btn" data-index="${index}">
            📋 Copiar
          </button>

          <button class="icon-btn whatsapp whatsapp-btn" data-index="${index}">
            WhatsApp
          </button>
        </div>

      </article>
    `)
    .join("");

  document.querySelectorAll(".copy-btn").forEach(button => {
    button.onclick = () => {
      const lead = leads[Number(button.dataset.index)];
      copyMessage(createMessage(lead[0]));
    };
  });

  document.querySelectorAll(".whatsapp-btn").forEach(button => {
    button.onclick = () => {
      const lead = leads[Number(button.dataset.index)];
      openWhatsApp(lead[2], createMessage(lead[0]));
    };
  });
}


/* =========================
   ABORDAGEM
========================= */

function createMessage(name) {
  if (currentPlan === "MAX") {
    return `Olá! Tudo bem? Conheci a ${name} e percebi uma oportunidade de melhorar a presença digital do negócio. Trabalho com criação de sites profissionais e posso preparar uma ideia personalizada para vocês. Posso te mostrar um exemplo sem compromisso?`;
  }

  if (currentPlan === "PRO") {
    return `Olá! Tudo bem? Conheci a ${name} e trabalho com criação de sites profissionais para empresas. Posso te mostrar uma ideia de site para o negócio, sem compromisso?`;
  }

  return `Olá! Tudo bem? Trabalho com criação de sites para empresas e gostaria de mostrar uma ideia para a ${name}. Posso te enviar um exemplo?`;
}


/* =========================
   COPIAR
========================= */

async function copyMessage(message) {
  try {
    await navigator.clipboard.writeText(message);
    toast("Mensagem copiada!");
  } catch {
    toast("Não foi possível copiar.");
  }
}


/* =========================
   WHATSAPP
========================= */

function openWhatsApp(phone, message) {
  const number = String(phone).replace(/\D/g, "");

  if (!number) {
    toast("Número não disponível.");
    return;
  }

  const url = `https://wa.me/55${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}


/* =========================
   BOTÕES
========================= */

$("loginBtn").onclick = () => openAuth("login");
$("registerBtn").onclick = () => openAuth("register");

$("startBtn").onclick = () =>
  $("ferramenta").scrollIntoView({ behavior: "smooth" });

$("howBtn").onclick = () =>
  $("como-funciona").scrollIntoView({ behavior: "smooth" });

$("freeBtn").onclick = () => openAuth("register");

$("proBtn").onclick = () =>
  toast("O link de pagamento do PRO ainda não foi configurado.");

$("maxBtn").onclick = () =>
  toast("O link de pagamento do MAX ainda não foi configurado.");

$("closeAuth").onclick = closeAuth;
$("switchAuth").onclick = switchAuth;
$("searchBtn").onclick = searchLeads;
$("stateSelect").onchange = loadCities;


/* =========================
   FECHAR MODAL
========================= */

$("authModal").onclick = event => {
  if (event.target === $("authModal")) closeAuth();
};

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeAuth();
});


/* =========================
   FIREBASE AUTH
========================= */

onAuthStateChanged(auth, async user => {
  currentUser = user;

  // Durante o cadastro, o próprio submit grava o documento
  if (registering) return;

  if (user) {
    await loadUser();
  } else {
    credits = 30;
    currentPlan = "FREE";
    updateCredits();
  }
});


/* =========================
   START
========================= */

initializeLists();
updateCredits();

console.log("LeadFinder iniciado corretamente.");
      
