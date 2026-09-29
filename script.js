/* =========================================================
   LEADFINDER - SCRIPT COMPLETO
   Compatível com o index.html atual do GitHub
========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyBYCtd7kjuAOPEROpkZM3eDOpnCk4xg5kM",
  authDomain: "leadfinder-da5c6.firebaseapp.com",
  projectId: "leadfinder-da5c6",
  storageBucket: "leadfinder-da5c6.firebasestorage.app",
  messagingSenderId: "135285316125",
  appId: "1:135285316125:web:228528bb9f6c50e5b104f4",
  measurementId: "G-PB7GXC14WK"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);


/* =========================================================
   LINKS DOS PLANOS
========================================================= */

const CAKTO_LINKS = {
  PRO: "COLE_AQUI_SEU_LINK_DA_CAKTO_PRO",
  MAX: "COLE_AQUI_SEU_LINK_DA_CAKTO_MAX"
};


/* =========================================================
   SERVIÇOS
========================================================= */

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


/* =========================================================
   TIPOS
========================================================= */

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


/* =========================================================
   ESTADOS
========================================================= */

const states = [
  ["AC", "Acre"],
  ["AL", "Alagoas"],
  ["AP", "Amapá"],
  ["AM", "Amazonas"],
  ["BA", "Bahia"],
  ["CE", "Ceará"],
  ["DF", "Distrito Federal"],
  ["ES", "Espírito Santo"],
  ["GO", "Goiás"],
  ["MA", "Maranhão"],
  ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"],
  ["MG", "Minas Gerais"],
  ["PA", "Pará"],
  ["PB", "Paraíba"],
  ["PR", "Paraná"],
  ["PE", "Pernambuco"],
  ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"],
  ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"],
  ["RO", "Rondônia"],
  ["RR", "Roraima"],
  ["SC", "Santa Catarina"],
  ["SP", "São Paulo"],
  ["SE", "Sergipe"],
  ["TO", "Tocantins"]
];


/* =========================================================
   LEADS DEMO
========================================================= */

const demoLeads = [
  ["Burger House", "Hamburgueria", "11999990001"],
  ["Pizza do Bairro", "Pizzaria", "11988880002"],
  ["Café Brasil", "Cafeteria", "11977770003"],
  ["Barbearia Central", "Barbearia", "11966660004"],
  ["Studio Bella", "Salão de beleza", "11955550005"],
  ["Oficina Turbo", "Oficina", "11944440006"],
  ["Clínica Vida", "Clínica", "11933330007"],
  ["Casa do Açaí", "Restaurante", "11922220008"],
  ["Auto Center Sul", "Auto center", "11911110009"],
  ["Ponto da Moda", "Loja de roupas", "11900000010"],
  ["Imóveis Prime", "Imobiliária", "11999990011"],
  ["Pet Mundo", "Pet shop", "11988880012"],
  ["Padaria Avenida", "Padaria", "11977770013"],
  ["Academia Fit", "Academia", "11966660014"],
  ["Hotel Central", "Hotel", "11955550015"],
  ["Constrular", "Construtora", "11944440016"],
  ["Tech Mais", "Loja de eletrônicos", "11933330017"],
  ["Eventos Prime", "Eventos", "11922220018"],
  ["Contábil Fácil", "Contabilidade", "11911110019"],
  ["Foto & Arte", "Fotografia", "11900000020"]
];


/* =========================================================
   PLANOS
========================================================= */

const resultLimit = {
  FREE: 6,
  PRO: 15,
  MAX: 50
};


/* =========================================================
   ESTADO
========================================================= */

let credits = 30;
let currentPlan = "FREE";
let currentUser = null;


/* =========================================================
   ELEMENTOS DO HTML
========================================================= */

const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const typeSelect = document.getElementById("typeSelect");
const needSelect = document.getElementById("needSelect");
const results = document.getElementById("results");
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

  const element = document.getElementById("toast");

  if (!element) {
    console.log(message);
    return;
  }

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(window.leadfinderToast);

  window.leadfinderToast = setTimeout(() => {
    element.classList.remove("show");
  }, 3500);
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char])
  );
}


/* =========================================================
   SELECTS
========================================================= */

function initializeSelects() {

  if (typeSelect) {

    types.forEach(type => {

      typeSelect.add(
        new Option(type, type)
      );

    });

  }


  if (needSelect) {

    services.forEach(service => {

      needSelect.add(
        new Option(service, service)
      );

    });

  }


  if (stateSelect) {

    states.forEach(([uf, name]) => {

      stateSelect.add(
        new Option(name, uf)
      );

    });

  }


  const serviceTags =
    document.getElementById("serviceTags");

  if (serviceTags) {

    serviceTags.innerHTML =
      services
        .map(
          service =>
            `<span class="tag">${escapeHTML(service)}</span>`
        )
        .join("");

  }

}


/* =========================================================
   CARREGAR CIDADES IBGE
========================================================= */

async function loadCities() {

  if (!stateSelect || !citySelect) {
    return;
  }

  citySelect.disabled = true;

  citySelect.innerHTML =
    "<option>Carregando cidades...</option>";


  if (!stateSelect.value) {

    citySelect.innerHTML =
      "<option value=''>Selecione o estado primeiro</option>";

    return;
  }


  try {

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateSelect.value}/municipios?orderBy=nome`
    );


    if (!response.ok) {
      throw new Error(
        `Erro HTTP ${response.status}`
      );
    }


    const cities = await response.json();


    citySelect.innerHTML =
      '<option value="">Selecione a cidade</option>';


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

    console.error(
      "Erro ao carregar cidades:",
      error
    );

    citySelect.innerHTML =
      "<option value=''>Erro ao carregar cidades</option>";

    toast(
      "Não foi possível carregar as cidades."
    );

  }

}


/* =========================================================
   MODAL
========================================================= */

function openAuth(mode = "login") {

  if (!authModal) {
    return;
  }

  authModal.classList.add("show");

  setAuthMode(mode);
}


function closeAuth() {

  if (!authModal) {
    return;
  }

  authModal.classList.remove("show");
}


function setAuthMode(mode) {

  const isLogin =
    mode === "login";


  const eyebrow =
    document.getElementById("authEyebrow");

  const title =
    document.getElementById("authTitle");

  const sub =
    document.getElementById("authSub");

  const phone =
    document.getElementById("phone");

  const phoneLabel =
    document.getElementById("phoneLabel");

  const switchAuth =
    document.getElementById("switchAuth");

  const submitText =
    document.getElementById("authSubmitText");


  if (eyebrow) {

    eyebrow.textContent =
      isLogin
        ? "LOGIN"
        : "CRIAR CONTA";

  }


  if (title) {

    title.textContent =
      isLogin
        ? "Entrar"
        : "Criar conta";

  }


  if (sub) {

    sub.textContent =
      isLogin
        ? "Entre na sua conta LeadFinder."
        : "Comece com 30 créditos grátis.";

  }


  if (phone) {

    phone.style.display =
      isLogin
        ? "none"
        : "block";

    phone.required =
      !isLogin;

    phone.disabled =
      isLogin;

  }


  if (phoneLabel) {

    phoneLabel.style.display =
      isLogin
        ? "none"
        : "block";

  }


  if (submitText) {

    submitText.textContent =
      isLogin
        ? "Entrar"
        : "Criar conta";

  }


  if (switchAuth) {

    switchAuth.textContent =
      isLogin
        ? "Ainda não tenho uma conta"
        : "Já tenho uma conta";


    switchAuth.onclick = () => {

      setAuthMode(
        isLogin
          ? "register"
          : "login"
      );

    };

  }

}


/* =========================================================
   LOADING DO FORMULÁRIO
========================================================= */

function setAuthLoading(loading) {

  const button =
    authForm?.querySelector(
      'button[type="submit"]'
    );

  const text =
    document.getElementById(
      "authSubmitText"
    );


  if (!button) {
    return;
  }


  button.disabled = loading;


  if (text && !loading) {

    const title =
      document.getElementById(
        "authTitle"
      );

    text.textContent =
      title?.textContent.includes("Entrar")
        ? "Entrar"
        : "Criar conta";

  }


  if (text && loading) {

    text.textContent =
      "Aguarde...";

  }

}


/* =========================================================
   ERROS FIREBASE
========================================================= */

function firebaseError(error) {

  console.error(
    "Firebase:",
    error
  );


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

    "auth/too-many-requests":
      "Muitas tentativas. Aguarde alguns minutos.",

    "auth/network-request-failed":
      "Erro de internet. Verifique sua conexão.",

    "auth/operation-not-allowed":
      "O login por e-mail ainda não está ativado no Firebase.",

    "auth/unauthorized-domain":
      "O domínio do GitHub Pages não está autorizado no Firebase.",

    "auth/app-not-authorized":
      "Este domínio não está autorizado no Firebase.",

    "auth/invalid-api-key":
      "A chave do Firebase está inválida.",

    "permission-denied":
      "O Firestore bloqueou o acesso. Verifique as regras do banco.",

    "failed-precondition":
      "O Firestore ainda não está configurado.",

    "unavailable":
      "O Firebase está temporariamente indisponível."
  };


  toast(
    messages[code] ||
    error?.message ||
    "Não foi possível realizar a operação."
  );

}


/* =========================================================
   CRIAR CONTA / LOGIN
========================================================= */

if (authForm) {

  authForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const email =
        document
          .getElementById("email")
          ?.value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById("password")
          ?.value;


      const phone =
        document
          .getElementById("phone")
          ?.value
          .trim();


      const authTitle =
        document.getElementById(
          "authTitle"
        );


      const isLogin =
        authTitle?.textContent
          .trim()
          .toLowerCase()
          .includes("entrar");


      if (!email) {

        toast(
          "Digite seu e-mail."
        );

        return;

      }


      if (!password || password.length < 6) {

        toast(
          "A senha precisa ter pelo menos 6 caracteres."
        );

        return;

      }


      if (!isLogin && !phone) {

        toast(
          "Digite seu número de celular."
        );

        return;

      }


      setAuthLoading(true);


      try {

        /* =========================
           LOGIN
        ========================= */

        if (isLogin) {

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


          return;

        }


        /* =========================
           CRIAR CONTA
        ========================= */

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        currentUser =
          credential.user;


        /* =========================
           TELEFONE NO PERFIL
        ========================= */

        if (phone) {

          try {

            await updateProfile(
              currentUser,
              {
                displayName: phone
              }
            );

          } catch (error) {

            console.warn(
              "Perfil não atualizado:",
              error
            );

          }

        }


        /* =========================
           FIRESTORE
        ========================= */

        await setDoc(
          doc(
            db,
            "usuarios",
            currentUser.uid
          ),
          {
            email:
              currentUser.email,

            telefone:
              phone || "",

            plano:
              "FREE",

            creditos:
              30,

            criadoEm:
              serverTimestamp()
          }
        );


        credits = 30;
        currentPlan = "FREE";


        updateCredits();


        toast(
          "Conta criada! Você recebeu 30 créditos."
        );


        closeAuth();


      } catch (error) {

        firebaseError(error);

      } finally {

        setAuthLoading(false);

      }

    }
  );

}


/* =========================================================
   CARREGAR USUÁRIO
========================================================= */

async function loadUserData() {

  if (!currentUser) {
    return;
  }


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
          email:
            currentUser.email,

          telefone:
            currentUser.displayName || "",

          plano:
            "FREE",

          creditos:
            30,

          criadoEm:
            serverTimestamp()
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
      typeof data.creditos === "number"
        ? data.creditos
        : 30;


    currentPlan =
      data.plano || "FREE";


    updateCredits();


  } catch (error) {

    firebaseError(error);

  }

}


/* =========================================================
   SALVAR USUÁRIO
========================================================= */

async function saveUserData() {

  if (!currentUser) {
    return false;
  }


  try {

    await setDoc(
      doc(
        db,
        "usuarios",
        currentUser.uid
      ),
      {
        email:
          currentUser.email,

        creditos:
          credits,

        plano:
          currentPlan
      },
      {
        merge: true
      }
    );


    return true;


  } catch (error) {

    firebaseError(error);

    return false;

  }

}


/* =========================================================
   CRÉDITOS
========================================================= */

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


/* =========================================================
   BUSCAR LEADS
========================================================= */

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
    !stateSelect?.value ||
    !citySelect?.value ||
    !typeSelect?.value ||
    !needSelect?.value
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


  const limit =
    resultLimit[currentPlan] || 6;


  const leads =
    demoLeads.slice(
      0,
      limit
    );


  renderResults(
    leads,
    {
      state:
        stateSelect.value,

      city:
        citySelect.value,

      type:
        typeSelect.value,

      need:
        needSelect.value
    }
  );


  if (credits < 6) {

    setTimeout(
      showPlans,
      500
    );

  }

}


/* =========================================================
   RESULTADOS
========================================================= */

function renderResults(
  leads,
  filters
) {

  const resultCount =
    document.getElementById(
      "resultCount"
    );


  const resultsTitle =
    document.getElementById(
      "resultsTitle"
    );


  if (resultCount) {

    resultCount.textContent =
      `${leads.length} leads`;

  }


  if (resultsTitle) {

    resultsTitle.textContent =
      `Leads em ${filters.city}`;

  }


  if (!results) {
    return;
  }


  results.innerHTML =
    leads
      .map(lead => {

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

            <div>

              <h4>
                            
