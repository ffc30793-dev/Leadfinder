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

/* =========================
ELEMENTOS
========================= */

const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const typeSelect = document.getElementById("typeSelect");
const needSelect = document.getElementById("needSelect");
const results = document.getElementById("results");

/* =========================
PREPARAR SELECTS
========================= */

if (typeSelect) {
types.forEach(type => {
typeSelect.add(new Option(type, type));
});
}

if (needSelect) {
services.forEach(service => {
needSelect.add(new Option(service, service));
});
}

if (stateSelect) {
states.forEach(([uf, name]) => {
stateSelect.add(new Option(name, uf));
});
}

const serviceTags = document.getElementById("serviceTags");

if (serviceTags) {
serviceTags.innerHTML =
services
.map(service => "<span class="tag">${escapeHTML(service)}</span>")
.join("");
}

/* =========================
EVENTOS
========================= */

if (stateSelect) {
stateSelect.addEventListener("change", loadCities);
}

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
searchBtn.addEventListener("click", searchLeads);
}

/* =========================
CIDADES - IBGE
========================= */

async function loadCities() {

if (!citySelect || !stateSelect) {
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
  throw new Error("Erro HTTP " + response.status);
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
VERIFICAR FIREBASE
========================= */

function firebaseReady() {

if (!window.firebaseAuth) {

console.error(
  "Firebase Auth não foi inicializado."
);

toast(
  "Firebase Auth não foi inicializado."
);

return false;

}

if (!window.firebaseDb) {

console.error(
  "Firebase Firestore não foi inicializado."
);

toast(
  "Firebase Firestore não foi inicializado."
);

return false;

}

return true;
}

/* =========================
AUTENTICAÇÃO
========================= */

const authForm =
document.getElementById("authForm");

if (authForm) {

authForm.addEventListener(
"submit",
async event => {

  event.preventDefault();

  if (!firebaseReady()) {
    return;
  }

  const email =
    document
      .getElementById("email")
      .value
      .trim()
      .toLowerCase();

  const password =
    document
      .getElementById("password")
      .value;

  const phoneElement =
    document.getElementById("phone");

  const phone =
    phoneElement
      ? phoneElement.value.trim()
      : "";

  const authTitle =
    document.getElementById("authTitle");

  const isLogin =
    authTitle &&
    authTitle.textContent
      .trim()
      .toLowerCase()
      .includes("entrar");

  if (!email) {

    toast(
      "Digite seu e-mail."
    );

    return;
  }

  if (password.length < 6) {

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

  try {

    const {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      updateProfile
    } = await authFunctions();

    const {
      doc,
      setDoc,
      getDoc,
      serverTimestamp
    } = await firestoreFunctions();

    const auth =
      window.firebaseAuth;

    const db =
      window.firebaseDb;


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
       TELEFONE
    ========================= */

    if (
      phone &&
      currentUser
    ) {

      try {

        await updateProfile(
          currentUser,
          {
            displayName: phone
          }
        );

      } catch (profileError) {

        console.warn(
          "Não foi possível salvar o telefone no perfil:",
          profileError
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

    currentPlan =
      "FREE";

    updateCredits();

    toast(
      "Conta criada! Você recebeu 30 créditos."
    );

    closeAuth();

  } catch (error) {

    console.error(
      "ERRO COMPLETO DO FIREBASE:",
      error
    );

    handleFirebaseError(
      error
    );
  }

}

);
}

/* =========================
ERROS FIREBASE
========================= */

function handleFirebaseError(error) {

const code =
error &&
error.code
? error.code
: "";

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
  "Muitas tentativas. Aguarde um pouco e tente novamente.",

"auth/network-request-failed":
  "Erro de conexão. Verifique sua internet.",

"auth/operation-not-allowed":
  "Login por e-mail e senha não está ativado no Firebase.",

"auth/admin-restricted-operation":
  "Esta operação está bloqueada pelas configurações do Firebase.",

"auth/invalid-api-key":
  "A chave da API do Firebase está inválida.",

"auth/app-not-authorized":
  "Este domínio não está autorizado no Firebase.",

"auth/unauthorized-domain":
  "O domínio deste site não está autorizado no Firebase.",

"permission-denied":
  "O Firestore recusou o acesso. Verifique as regras do banco.",

"failed-precondition":
  "O Firebase precisa de uma configuração adicional.",

"unavailable":
  "O Firebase está temporariamente indisponível."

};

const message =
messages[code];

if (message) {

toast(message);

} else {

toast(
  "Erro: " +
  (
    error?.message ||
    "Não foi possível realizar a operação."
  )
);

}
}

/* =========================
CARREGAR USUÁRIO
========================= */

async function loadUserData() {

if (
!currentUser ||
!window.firebaseDb
) {
return;
}

try {

const {
  doc,
  getDoc
} = await firestoreFunctions();

const userRef =
  doc(
    window.firebaseDb,
    "usuarios",
    currentUser.uid
  );

const snapshot =
  await getDoc(userRef);

if (!snapshot.exists()) {

  /*
   * Caso o usuário exista no Authentication
   * mas ainda não tenha documento no Firestore,
   * criamos automaticamente.
   */

  const {
    setDoc,
    serverTimestamp
  } = await firestoreFunctions();

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
    }
  );

  credits = 30;

  currentPlan =
    "FREE";

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

console.error(
  "Erro ao carregar usuário:",
  error
);

handleFirebaseError(
  error
);

}
}

/* =========================
SALVAR CRÉDITOS
========================= */

async function saveUserData() {

if (
!currentUser ||
!window.firebaseDb
) {
return false;
}

try {

const {
  doc,
  setDoc
} = await firestoreFunctions();

await setDoc(
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
  },
  {
    merge: true
  }
);

return true;

} catch (error) {

console.error(
  "Erro ao salvar créditos:",
  error
);

handleFirebaseError(
  error
);

return false;

}
}

/* =========================
ESTADO DO LOGIN
========================= */

async function initializeAuth() {

if (!firebaseReady()) {
return;
}

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

      currentPlan =
        "FREE";

      updateCredits();
    }

  }
);

} catch (error) {

console.error(
  "Erro ao inicializar autenticação:",
  error
);

handleFirebaseError(
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

openAuth(
  "login"
);

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

const previousCredits =
credits;

credits -= 6;

updateCredits();

const saved =
await saveUserData();

if (!saved) {

/*
 * Se não conseguiu salvar no banco,
 * devolvemos os créditos para evitar
 * cobrança indevida.
 */

credits =
  previousCredits;

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

return "Olá! Tudo bem? Trabalho com criação de sites para empresas e gostaria de mostrar uma ideia para a ${name}. Posso te enviar um exemplo?";
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
"https://wa.me/55${number}?text=${encodeURIComponent(message)}",
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

const planos =
document.getElementById(
"planos"
);

if (planos) {

planos.scrollIntoView({
  behavior: "smooth"
});

}

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

if (!modal) {
return;
}

modal.classList.add(
"show"
);

setAuthMode(
mode
);
}

function closeAuth() {

if (!modal) {
return;
}

modal.classList.remove(
"show"
);
}

function setAuthMode(mode) {

const login =
mode === "login";

const eyebrow =
document.getElementById(
"authEyebrow"
);

const title =
document.getElementById(
"authTitle"
);

const sub =
document.getElementById(
"authSub"
);

const phone =
document.getElementById(
"phone"
);

const switchAuth =
document.getElementById(
"switchAuth"
);

if (eyebrow) {

eyebrow.textContent =
  login
    ? "LOGIN"
    : "CRIAR CONTA";

}

if (title) {

title.textContent =
  login
    ? "Entrar"
    : "Criar conta";

}

if (sub) {

sub.textContent =
  login
    ? "Entre na sua conta LeadFinder."
    : "Comece com 30 créditos grátis.";

}

if (phone) {

phone.style.display =
  login
    ? "none"
    : "block";

phone.required =
  !login;

phone.disabled =
  login;

}

if (switchAuth) {

switchAuth.textContent =
  login
    ? "Ainda não tenho uma conta"
    : "Já tenho uma conta";


switchAuth.onclick =
  () =>
    setAuthMode(
      login
        ? "register"
        : "login"
    );

}
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

if (!element) {

console.log(
  message
);

return;

}

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

/*
 * O Firebase é inicializado pelo
 * bloco <script type="module"> do HTML.
 *
 * Esperamos um pouco para garantir
 * que window.firebaseAuth e
 * window.firebaseDb já existam.
 */

setTimeout(
  initializeAuth,
  800
);

}
);

/* =========================
FUNÇÕES GLOBAIS
========================= */

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

window.searchLeads =
searchLeads;
