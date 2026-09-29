const CAKTO_LINKS = {
  PRO: "COLE_AQUI_SEU_LINK_DA_CAKTO_PRO",
  MAX: "COLE_AQUI_SEU_LINK_DA_CAKTO_MAX"
};

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
  MAX: 50
};

let credits = 30;
let currentPlan = "FREE";
let currentUser = null;

const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const typeSelect = document.getElementById("typeSelect");
const needSelect = document.getElementById("needSelect");
const results = document.getElementById("results");

types.forEach(type => {
  typeSelect.add(new Option(type, type));
});

services.forEach(service => {
  needSelect.add(new Option(service, service));
});

states.forEach(([uf, name]) => {
  stateSelect.add(new Option(name, uf));
});

document.getElementById("serviceTags").innerHTML =
  services.map(service => `<span class="tag">${service}</span>`).join("");

stateSelect.addEventListener("change", loadCities);

document.getElementById("searchBtn")
  .addEventListener("click", searchLeads);

async function loadCities() {

  citySelect.disabled = true;

  citySelect.innerHTML =
    "<option>Carregando cidades...</option>";

  if (!stateSelect.value) {

    citySelect.innerHTML =
      "<option>Selecione o estado primeiro</option>";

    return;
  }

  try {

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateSelect.value}/municipios?orderBy=nome`
    );

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

    console.error(error);

    citySelect.innerHTML =
      "<option>Erro ao carregar cidades</option>";

    toast(
      "Não foi possível carregar as cidades."
    );
  }
}


/* =========================
   FIREBASE
========================= */

async function authFunctions() {

  return await import(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js"
  );
}

async function firestoreFunctions() {

  return await import(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"
  );
}


/* =========================
   AUTENTICAÇÃO
========================= */

document
  .getElementById("authForm")
  .addEventListener("submit", async event => {

    event.preventDefault();

    const email =
      document.getElementById("email")
        .value
        .trim();

    const password =
      document.getElementById("password")
        .value;

    const phone =
      document.getElementById("phone")
        .value
        .trim();

    const isLogin =
      document
        .getElementById("authTitle")
        .textContent
        .includes("Entrar");

    try {

      const {
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        updateProfile
      } = await authFunctions();

      const {
        doc,
        setDoc,
        serverTimestamp
      } = await firestoreFunctions();

      const auth =
        window.firebaseAuth;

      const db =
        window.firebaseDb;

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
            email:
              currentUser.email,

            telefone:
              phone,

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
      }

    } catch (error) {

      console.error(error);

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
          "Senha incorreta."
      };

      toast(
        messages[error.code] ||
        "Não foi possível realizar a operação."
      );

    }

  });


/* =========================
   CARREGAR USUÁRIO
========================= */

async function loadUserData() {

  if (!currentUser) return;

  try {

    const {
      doc,
      getDoc
    } = await firestoreFunctions();

    const snapshot =
      await getDoc(
        doc(
          window.firebaseDb,
          "usuarios",
          currentUser.uid
        )
      );

    if (!snapshot.exists()) {

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

    console.error(
      "Erro ao carregar usuário:",
      error
    );
  }
}


/* =========================
   SALVAR CRÉDITOS
========================= */

async function saveUserData() {

  if (!currentUser) return;

  try {

    const {
      doc,
      updateDoc
    } = await firestoreFunctions();

    await updateDoc(
      doc(
        window.firebaseDb,
        "usuarios",
        currentUser.uid
      ),
      {
        creditos:
          credits,

        plano:
          currentPlan
      }
    );

  } catch (error) {

    console.error(
      "Erro ao salvar créditos:",
      error
    );
  }
}


/* =========================
   ESTADO DO LOGIN
========================= */

async function initializeAuth() {

  try {

    const {
      onAuthStateChanged
    } = await authFunctions();

    onAuthStateChanged(
      window.firebaseAuth,
      async user => {

        currentUser =
          user;

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

  } catch (error) {

    console.error(
      "Erro no Firebase:",
      error
    );
  }
}


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

  credits -= 6;

  updateCredits();

  await saveUserData();


  const leads =
    demoLeads.slice(
      0,
      resultLimit[currentPlan]
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
    leads.map(
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


            <div class="actions">

              <button
                class="icon-btn"
                onclick='copyMessage(${JSON.stringify(message)})'>

                📋 Copiar

              </button>


              <button
                class="icon-btn whatsapp"
                onclick='openWhatsApp(${JSON.stringify(phone)}, ${JSON.stringify(message)})'>

                WhatsApp

              </button>

            </div>

          </article>

        `;
      }
    )
    .join("");
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

  window.open(
    `https://wa.me/55${number}?text=${encodeURIComponent(message)}`,
    "_blank"
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

  } catch {

    toast(
      "Não foi possível copiar."
    );
  }
}


/* =========================
   PLANOS
========================= */

function checkout(plan) {

  const link =
    CAKTO_LINKS[plan];

  if (
    !link ||
    link.includes("COLE_AQUI")
  ) {

    toast(
      `O link da Cakto do plano ${plan} ainda não foi configurado.`
    );

    return;
  }

  window.location.href =
    link;
}


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
   LOGIN MODAL
========================= */

const modal =
  document.getElementById(
    "authModal"
  );


function openAuth(mode) {

  modal.classList.add(
    "show"
  );

  setAuthMode(mode);
}


function closeAuth() {

  modal.classList.remove(
    "show"
  );
}


function setAuthMode(mode) {

  const login =
    mode === "login";


  document.getElementById(
    "authEyebrow"
  ).textContent =
    login
      ? "LOGIN"
      : "CRIAR CONTA";


  document.getElementById(
    "authTitle"
  ).textContent =
    login
      ? "Entrar"
      : "Criar conta";


  document.getElementById(
    "authSub"
  ).textContent =
    login
      ? "Entre na sua conta LeadFinder."
      : "Comece com 30 créditos grátis.";


  const phone =
    document.getElementById(
      "phone"
    );

  phone.style.display =
    login
      ? "none"
      : "block";


  phone.required =
    !login;


  document.getElementById(
    "switchAuth"
  ).textContent =
    login
      ? "Ainda não tenho uma conta"
      : "Já tenho uma conta";


  document.getElementById(
    "switchAuth"
  ).onclick =
    () =>
      setAuthMode(
        login
          ? "register"
          : "login"
      );
}


/* =========================
   UTILITÁRIOS
========================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  ).replace(
    /[&<>"']/g,
    char => ({

      "&":
        "&amp;",

      "<":
        "&lt;",

      ">":
        "&gt;",

      '"':
        "&quot;",

      "'":
        "&#039;"

    }[char])
  );
}


function toast(message) {

  const element =
    document.getElementById(
      "toast"
    );

  element.textContent =
    message;

  element.classList.add(
    "show"
  );

  setTimeout(
    () => {

      element.classList.remove(
        "show"
      );

    },
    3000
  );
}


/* =========================
   INICIALIZAÇÃO
========================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      initializeAuth,
      500
    );

  }
);


window.openAuth =
  openAuth;

window.closeAuth =
  closeAuth;

window.checkout =
  checkout;

window.copyMessage =
  copyMessage;

window.openWhatsApp =
  openWhatsApp;
