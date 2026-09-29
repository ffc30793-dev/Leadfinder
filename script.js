import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
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
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBYCtd7kjuAOPEROpkZM3eDOpCk4xg5kM",
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
   CONFIGURAÇÃO
========================= */

const services = [
  "Sem site",
  "Site desatualizado",
  "Landing page",
  "Loja virtual",
  "Cardápio digital",
  "Google/Maps",
  "Identidade visual",
  "Design",
  "Redes sociais",
  "Automação",
  "Agendamento online",
  "Sistema personalizado"
];

const types = [
  "Hamburgueria",
  "Pizzaria",
  "Restaurante",
  "Cafeteria",
  "Bar",
  "Padaria",
  "Salão de beleza",
  "Barbearia",
  "Clínica",
  "Dentista",
  "Academia",
  "Hotel",
  "Pousada",
  "Pet shop",
  "Oficina",
  "Auto center",
  "Loja de roupas",
  "Loja de eletrônicos",
  "Mercado",
  "Imobiliária",
  "Escritório",
  "Contabilidade",
  "Advocacia",
  "Escola",
  "Curso",
  "Fotografia",
  "Eventos",
  "Construtora",
  "Prestador de serviços",
  "Outro"
];

const states = [
  ["AC","Acre"],
  ["AL","Alagoas"],
  ["AP","Amapá"],
  ["AM","Amazonas"],
  ["BA","Bahia"],
  ["CE","Ceará"],
  ["DF","Distrito Federal"],
  ["ES","Espírito Santo"],
  ["GO","Goiás"],
  ["MA","Maranhão"],
  ["MT","Mato Grosso"],
  ["MS","Mato Grosso do Sul"],
  ["MG","Minas Gerais"],
  ["PA","Pará"],
  ["PB","Paraíba"],
  ["PR","Paraná"],
  ["PE","Pernambuco"],
  ["PI","Piauí"],
  ["RJ","Rio de Janeiro"],
  ["RN","Rio Grande do Norte"],
  ["RS","Rio Grande do Sul"],
  ["RO","Rondônia"],
  ["RR","Roraima"],
  ["SC","Santa Catarina"],
  ["SP","São Paulo"],
  ["SE","Sergipe"],
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

const resultLimit = {
  FREE: 6,
  PRO: 15,
  MAX: 20
};


/* =========================
   ESTADO
========================= */

let credits = 30;
let currentPlan = "FREE";
let currentUser = null;
let authMode = "register";


/* =========================
   ELEMENTOS
========================= */

const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const typeSelect = document.getElementById("typeSelect");
const needSelect = document.getElementById("needSelect");
const results = document.getElementById("results");

const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");

const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");

const authTitle = document.getElementById("authTitle");
const authEyebrow = document.getElementById("authEyebrow");
const authSub = document.getElementById("authSub");
const authSubmitText = document.getElementById("authSubmitText");
const switchAuth = document.getElementById("switchAuth");
const phoneLabel = document.getElementById("phoneLabel");


/* =========================
   SELECTS
========================= */

types.forEach(type => {
  typeSelect.add(
    new Option(type, type)
  );
});

services.forEach(service => {
  needSelect.add(
    new Option(service, service)
  );
});

states.forEach(([uf, name]) => {
  stateSelect.add(
    new Option(name, uf)
  );
});

document.getElementById("serviceTags").innerHTML =
  services
    .map(
      service =>
        `<span class="tag">${escapeHTML(service)}</span>`
    )
    .join("");


/* =========================
   CIDADES
========================= */

stateSelect.addEventListener(
  "change",
  loadCities
);

async function loadCities() {

  citySelect.disabled = true;

  citySelect.innerHTML =
    `<option value="">Carregando cidades...</option>`;

  if (!stateSelect.value) {

    citySelect.innerHTML =
      `<option value="">Selecione o estado primeiro</option>`;

    return;
  }

  try {

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateSelect.value}/municipios?orderBy=nome`
    );

    if (!response.ok) {
      throw new Error("Erro na API do IBGE");
    }

    const cities = await response.json();

    citySelect.innerHTML =
      `<option value="">Selecione a cidade</option>`;

    cities.forEach(city => {

      citySelect.add(
        new Option(
          city.nome,
          city.nome
        )
      );

    });

    citySelect.disabled = false;

  } catch (error) {

    console.error(error);

    citySelect.innerHTML =
      `<option value="">Erro ao carregar cidades</option>`;

    toast(
      "Não foi possível carregar as cidades."
    );
  }
}


/* =========================
   AUTENTICAÇÃO
========================= */

document
  .getElementById("loginBtn")
  .addEventListener(
    "click",
    () => openAuth("login")
  );

document
  .getElementById("registerBtn")
  .addEventListener(
    "click",
    () => openAuth("register")
  );

document
  .getElementById("freeBtn")
  .addEventListener(
    "click",
    () => openAuth("register")
  );

document
  .getElementById("closeAuth")
  .addEventListener(
    "click",
    closeAuth
  );

switchAuth.addEventListener(
  "click",
  () => {

    setAuthMode(
      authMode === "login"
        ? "register"
        : "login"
    );

  }
);


authForm.addEventListener(
  "submit",
  handleAuth
);


async function handleAuth(event) {

  event.preventDefault();

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  const phone =
    phoneInput.value.trim();


  if (!email || !password) {

    toast(
      "Preencha e-mail e senha."
    );

    return;
  }


  if (
    authMode === "register" &&
    password.length < 6
  ) {

    toast(
      "A senha precisa ter pelo menos 6 caracteres."
    );

    return;
  }


  setAuthLoading(true);


  try {

    if (authMode === "login") {

      const credential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      currentUser =
        credential.user;

      await loadUserData();

      toast(
        "Login realizado com sucesso!"
      );

      closeAuth();

    } else {

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      currentUser =
        credential.user;


      if (phone) {

        await updateProfile(
          currentUser,
          {
            displayName: phone
          }
        );
      }


      await setDoc(
        doc(
          db,
          "usuarios",
          currentUser.uid
        ),
        {
          email: currentUser.email,

          telefone: phone,

          plano: "FREE",

          creditos: 30,

          criadoEm: serverTimestamp()
        }
      );


      credits = 30;
      currentPlan = "FREE";


      updateCredits();


      toast(
        "Conta criada com sucesso! Você recebeu 30 créditos."
      );


      closeAuth();
    }

  } catch (error) {

    console.error(
      "ERRO FIREBASE:",
      error
    );

    handleFirebaseError(error);

  } finally {

    setAuthLoading(false);

  }
}


/* =========================
   ERROS FIREBASE
========================= */

function handleFirebaseError(error) {

  const code =
    error?.code || "";

  const messages = {

    "auth/email-already-in-use":
      "Este e-mail já está cadastrado.",

    "auth/invalid-email":
      "Digite um e-mail válido.",

    "auth/weak-password":
      "A senha precisa ter pelo menos 6 caracteres.",

    "auth/invalid-credential":
      "E-mail ou senha incorretos.",

    "auth/user-not-found":
      "Usuário não encontrado.",

    "auth/wrong-password":
      "Senha incorreta.",

    "auth/operation-not-allowed":
      "O login por e-mail e senha não está ativado no Firebase.",

    "auth/network-request-failed":
      "Erro de conexão. Verifique sua internet.",

    "permission-denied":
      "O Firebase bloqueou o acesso ao banco. Verifique as regras do Firestore."
  };


  toast(
    messages[code] ||
    `Erro: ${code || "Não foi possível realizar a operação."}`
  );
}


/* =========================
   LOADING
========================= */

function setAuthLoading(loading) {

  const button =
    authForm.querySelector(
      "button[type='submit']"
    );

  if (!button) return;

  button.disabled =
    loading;

  authSubmitText.textContent =
    loading
      ? "Processando..."
      : authMode === "login"
        ? "Entrar"
        : "Criar conta";
}


/* =========================
   CARREGAR USUÁRIO
========================= */

async function loadUserData() {

  if (!currentUser) return;

  try {

    const userRef =
      doc(
        db,
        "usuarios",
        currentUser.uid
      );

    const snapshot =
      await getDoc(userRef);


    if (!snapshot.exists()) {

      await setDoc(
        userRef,
        {
          email: currentUser.email,

          plano: "FREE",

          creditos: 30,

          criadoEm: serverTimestamp()
        },
        {
          merge: true
        }
      );

      credits = 30;
      currentPlan = "FREE";

      updateCredits();

      return;
    }


    const data =
      snapshot.data();


    credits =
      Number.isFinite(
        data.creditos
      )
        ? data.creditos
        : 30;


    currentPlan =
      data.plano || "FREE";


    updateCredits();

  } catch (error) {

    console.error(
      "Erro ao carregar usuário:",
      error
    );

    toast(
      "Não foi possível carregar seus dados."
    );
  }
}


/* =========================
   SALVAR DADOS
========================= */

async function saveUserData() {

  if (!currentUser) return false;

  try {

    await updateDoc(
      doc(
        db,
        "usuarios",
        currentUser.uid
      ),
      {
        creditos: credits,
        plano: currentPlan
      }
    );

    return true;

  } catch (error) {

    console.error(
      "Erro ao salvar:",
      error
    );

    toast(
      "Não foi possível salvar seus créditos."
    );

    return false;
  }
}


/* =========================
   LOGIN AUTOMÁTICO
========================= */

onAuthStateChanged(
  auth,
  async user => {

    currentUser = user;

    if (user) {

      await loadUserData();

      console.log(
        "Usuário conectado:",
        user.email
      );

    } else {

      credits = 30;
      currentPlan = "FREE";

      updateCredits();
    }

  }
);


/* =========================
   CRÉDITOS
========================= */

function updateCredits() {

  const element =
    document.getElementById(
      "creditCount"
    );

  if (element) {

    element.textContent =
      credits;
  }
}


/* =========================
   BUSCAR LEADS
========================= */

document
  .getElementById("searchBtn")
  .addEventListener(
    "click",
    searchLeads
  );


async function searchLeads() {

  if (!currentUser) {

    toast(
      "Faça login para realizar buscas."
    );

    openAuth("login");

    return;
  }


  if (credits < 6) {

    showPlans();

    return;
  }


  if (
    !stateSelect.value ||
    !citySelect.value ||
    !typeSelect.value ||
    !needSelect.value
  ) {

    toast(
      "Preencha todos os campos."
    );

    return;
  }


  const oldCredits =
    credits;

  credits -= 6;

  updateCredits();


  const saved =
    await saveUserData();


  if (!saved) {

    credits =
      oldCredits;

    updateCredits();

    return;
  }


  const leads =
    demoLeads.slice(
      0,
      resultLimit[currentPlan] ||
      6
    );


  renderResults(
    leads,
    {
      state: stateSelect.value,
      city: citySelect.value,
      type: typeSelect.value,
      need: needSelect.value
    }
  );


  toast(
    `${leads.length} leads encontrados.`
  );


  if (credits < 6) {

    setTimeout(
      showPlans,
      800
    );
  }
}


/* =========================
   RESULTADOS
========================= */

function renderResults(
  leads,
  filters
) {

  document.getElementById(
    "resultCount"
  ).textContent =
    `${leads.length} leads`;


  document.getElementById(
    "resultsTitle"
  ).textContent =
    `Leads em ${filters.city}`;


  results.innerHTML =
    leads
      .map(
        lead => {

          const name =
            lead[0];

          const type =
            lead[1];

          const phone =
            lead[2];


          const message =
            createApproach(
              name,
              filters
            );


          return `
            <article class="result-card">

              <div class="result-main">

                <div class="avatar">
                  ${escapeHTML(
                    getInitials(name)
                  )}
                </div>

                <div>

                  <h4>
                    ${escapeHTML(name)}
                  </h4>

                  <div class="result-meta">

                    ${escapeHTML(type)}
                    •
                    ${escapeHTML(filters.city)}
                    -
                    ${escapeHTML(filters.state)}

                    <br>

                    ${escapeHTML(phone)}

                  </div>

                  <div class="badges">

                    <span class="badge green">
                      Oportunidade
                    </span>

                    <span class="badge">
                      Possível ausência de site
                    </span>

                  </div>

                </div>

              </div>

              <div class="actions">

                <button
                  class="icon-btn"
                  data-copy="${encodeURIComponent(message)}">

                  📋 Copiar

                </button>

                <button
                  class="icon-btn whatsapp"
                  data-phone="${escapeHTML(phone)}"
                  data-message="${encodeURIComponent(message)}">

                  WhatsApp

                </button>

              </div>

            </article>
          `;
        }
      )
      .join("");


  results
    .querySelectorAll("[data-copy]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          copyMessage(
            decodeURIComponent(
              button.dataset.copy
            )
          );

        }
      );

    });


  results
    .querySelectorAll("[data-phone]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openWhatsApp(
            button.dataset.phone,
            decodeURIComponent(
              button.dataset.message
            )
          );

        }
      );

    });
}


/* =========================
   ABORDAGEM
========================= */

function createApproach(
  name,
  filters
) {

  if (currentPlan === "MAX") {

    return `Olá! Tudo bem? Conheci a ${name} e percebi uma oportunidade de melhorar a presença digital do negócio. Trabalho com criação de sites profissionais e posso preparar uma ideia personalizada para vocês. Posso te mostrar um exemplo sem compromisso?`;
  }


  if (currentPlan === "PRO") {

    return `Olá! Tudo bem? Conheci a ${name} e trabalho com criação de sites profissionais para empresas. Posso te mostrar uma ideia de site para o negócio, sem compromisso?`;
  }


  return `Olá! Tudo bem? Trabalho com criação de sites para empresas e gostaria de mostrar uma ideia para a ${name}. Posso te enviar um exemplo?`;
}


/* =========================
   WHATSAPP
========================= */

function openWhatsApp(
  phone,
  message
) {

  const number =
    String(phone)
      .replace(/\D/g, "");


  if (!number) {

    toast(
      "Número não disponível."
    );

    return;
  }


  const url =
    `https://wa.me/55${number}?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}


/* =========================
   COPIAR
========================= */

async function copyMessage(
  message
) {

  try {

    await navigator.clipboard
      .writeText(message);

    toast(
      "Mensagem copiada!"
    );

  } catch (error) {

    console.error(error);

    toast(
      "Não foi possível copiar."
    );
  }
}


/* =========================
   PLANOS
========================= */

document
  .getElementById("proBtn")
  .addEventListener(
    "click",
    () => {

      toast(
        "Pagamento será configurado posteriormente."
      );

    }
  );


document
  .getElementById("maxBtn")
  .addEventListener(
    "click",
    () => {

      toast(
        "Pagamento será configurado posteriormente."
      );

    }
  );


function showPlans() {

  document
    .getElementById("planos")
    .scrollIntoView({
      behavior: "smooth"
    });

  toast(
    "Seus créditos acabaram. Escolha um plano."
  );
}


/* =========================
   MODAL
========================= */

function openAuth(mode) {

  authModal.classList.add(
    "show"
  );

  setAuthMode(mode);

  setTimeout(
    () => emailInput.focus(),
    100
  );
}


function closeAuth() {

  authModal.classList.remove(
    "show"
  );

  authForm.reset();

  setAuthLoading(false);
}


function setAuthMode(mode) {

  authMode =
    mode === "login"
      ? "login"
      : "register";


  const login =
    authMode === "login";


  authEyebrow.textContent =
    login
      ? "LOGIN"
      : "CRIAR CONTA";


  authTitle.textContent =
    login
      ? "Entrar"
      : "Criar conta";


  authSub.textContent =
    login
      ? "Entre na sua conta LeadFinder."
      : "Comece com 30 créditos grátis.";


  phoneLabel.style.display =
    login
      ? "none"
      : "block";


  phoneInput.required =
    !login;


  switchAuth.textContent =
    login
      ? "Ainda não tenho uma conta"
      : "Já tenho uma conta";


  authSubmitText.textContent =
    login
      ? "Entrar"
      : "Criar conta";
}


/* =========================
   BOTÕES HERO
========================= */

document
  .getElementById("startBtn")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById("ferramenta")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );


document
  .getElementById("howBtn")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById("como-funciona")
        .scrollIntoView({
         