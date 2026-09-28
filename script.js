const API_BASE = ""; // Ex.: "http://localhost:8080"
const CAKTO_LINKS = {
  PRO: "COLE_AQUI_SEU_LINK_DA_CAKTO_PRO",
  MAX: "COLE_AQUI_SEU_LINK_DA_CAKTO_MAX"
};

const services = ["Sem site","Site desatualizado","Landing page","Loja virtual","Cardápio digital","Google/Maps","Identidade visual","Design","Redes sociais","Automação","Agendamento online","Sistema personalizado"];
const types = ["Hamburgueria","Pizzaria","Restaurante","Cafeteria","Bar","Padaria","Salão de beleza","Barbearia","Clínica","Dentista","Academia","Hotel","Pousada","Pet shop","Oficina","Auto center","Loja de roupas","Loja de eletrônicos","Mercado","Imobiliária","Escritório","Contabilidade","Advocacia","Escola","Curso","Fotografia","Eventos","Construtora","Prestador de serviços","Outro"];

const demoLeads = [
  ["Burger House","Hamburgueria","(11) 99999-0001"],["Pizza do Bairro","Pizzaria","(11) 98888-0002"],["Café Brasil","Cafeteria","(11) 97777-0003"],
  ["Barbearia Central","Barbearia","(11) 96666-0004"],["Studio Bella","Salão de beleza","(11) 95555-0005"],["Oficina Turbo","Oficina","(11) 94444-0006"],
  ["Clínica Vida","Clínica","(11) 93333-0007"],["Casa do Açaí","Restaurante","(11) 92222-0008"],["Auto Center Sul","Auto center","(11) 91111-0009"],
  ["Ponto da Moda","Loja de roupas","(11) 90000-0010"],["Imóveis Prime","Imobiliária","(11) 99999-0011"],["Pet Mundo","Pet shop","(11) 98888-0012"],
  ["Padaria Avenida","Padaria","(11) 97777-0013"],["Academia Fit","Academia","(11) 96666-0014"],["Hotel Central","Hotel","(11) 95555-0015"],
  ["Constrular","Construtora","(11) 94444-0016"],["Tech Mais","Loja de eletrônicos","(11) 93333-0017"],["Eventos Prime","Eventos","(11) 92222-0018"],
  ["Contábil Fácil","Contabilidade","(11) 91111-0019"],["Foto & Arte","Fotografia","(11) 90000-0020"],
  ["Sabor da Praça","Restaurante","(11) 99999-0021"],["Espaço Zen","Salão de beleza","(11) 98888-0022"],["Mercado União","Mercado","(11) 97777-0023"],
  ["Doce Café","Cafeteria","(11) 96666-0024"],["Burguer Mania","Hamburgueria","(11) 95555-0025"],["Pizzaria Itália","Pizzaria","(11) 94444-0026"],
  ["Clínica Mais","Clínica","(11) 93333-0027"],["Bar do Centro","Bar","(11) 92222-0028"],["Studio Hair","Salão de beleza","(11) 91111-0029"],
  ["Oficina Express","Oficina","(11) 90000-0030"],["Casa Pet","Pet shop","(11) 99999-0031"],["Moda Mix","Loja de roupas","(11) 98888-0032"],
  ["Pousada Sol","Pousada","(11) 97777-0033"],["Mercadinho São José","Mercado","(11) 96666-0034"],["Agência Local","Prestador de serviços","(11) 95555-0035"],
  ["Escola Futuro","Escola","(11) 94444-0036"],["Curso Pro","Curso","(11) 93333-0037"],["Imobiliária Norte","Imobiliária","(11) 92222-0038"],
  ["Barbearia Black","Barbearia","(11) 91111-0039"],["Restaurante Sabor","Restaurante","(11) 90000-0040"],["Açaí Top","Restaurante","(11) 99999-0041"],
  ["Padaria Real","Padaria","(11) 98888-0042"],["Hotel Plaza","Hotel","(11) 97777-0043"],["Fit Center","Academia","(11) 96666-0044"],
  ["Dent Care","Dentista","(11) 95555-0045"],["Advocacia Fácil","Advocacia","(11) 94444-0046"],["Agende Já","Prestador de serviços","(11) 93333-0047"],
  ["Design House","Design","(11) 92222-0048"],["Loja Popular","Loja de roupas","(11) 91111-0049"],["Móveis Brasil","Outro","(11) 90000-0050"]
];

let credits = Number(localStorage.getItem("lf_credits") ?? 30);
let currentPlan = localStorage.getItem("lf_plan") || "FREE";
const resultLimit = {FREE:6, PRO:15, MAX:50};

const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const typeSelect = document.getElementById("typeSelect");
const needSelect = document.getElementById("needSelect");
const results = document.getElementById("results");

document.getElementById("creditCount").textContent = credits;
types.forEach(x=>typeSelect.add(new Option(x,x)));
services.forEach(x=>needSelect.add(new Option(x,x)));
document.getElementById("serviceTags").innerHTML = services.map(x=>`<span class="tag">${x}</span>`).join("");

const states = [
["AC","Acre"],["AL","Alagoas"],["AP","Amapá"],["AM","Amazonas"],["BA","Bahia"],["CE","Ceará"],["DF","Distrito Federal"],["ES","Espírito Santo"],["GO","Goiás"],["MA","Maranhão"],["MT","Mato Grosso"],["MS","Mato Grosso do Sul"],["MG","Minas Gerais"],["PA","Pará"],["PB","Paraíba"],["PR","Paraná"],["PE","Pernambuco"],["PI","Piauí"],["RJ","Rio de Janeiro"],["RN","Rio Grande do Norte"],["RS","Rio Grande do Sul"],["RO","Rondônia"],["RR","Roraima"],["SC","Santa Catarina"],["SP","São Paulo"],["SE","Sergipe"],["TO","Tocantins"]
];
states.forEach(([uf,name])=>stateSelect.add(new Option(name,uf)));

stateSelect.addEventListener("change", async ()=>{
  citySelect.disabled=true; citySelect.innerHTML="<option>Carregando cidades...</option>";
  try{
    const r=await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateSelect.value}/municipios?orderBy=nome`);
    const cities=await r.json();
    citySelect.innerHTML='<option value="">Selecione a cidade</option>';
    cities.forEach(c=>citySelect.add(new Option(c.nome,c.nome)));
    citySelect.disabled=false;
  }catch(e){
    citySelect.innerHTML='<option value="">Não foi possível carregar</option>';
    toast("Não foi possível carregar as cidades.");
  }
});

document.getElementById("searchBtn").addEventListener("click", searchLeads);

async function searchLeads(){
  if(credits<6){ showPlans(); return; }
  if(!stateSelect.value || !citySelect.value || !typeSelect.value || !needSelect.value){toast("Preencha estado, cidade, estabelecimento e serviço.");return;}
  credits-=6; localStorage.setItem("lf_credits",credits); document.getElementById("creditCount").textContent=credits;
  const payload={state:stateSelect.value,city:citySelect.value,type:typeSelect.value,need:needSelect.value,plan:currentPlan};
  let data=null;
  try{
    const r=await fetch(`${API_BASE}/api/leads/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    if(r.ok) data=await r.json();
  }catch(e){}
  const list=(data?.leads?.length?data.leads:demoLeads).slice(0,resultLimit[currentPlan]||6);
  renderResults(list,payload);
  if(credits<6) setTimeout(showPlans,500);
}

function renderResults(list,payload){
  document.getElementById("resultCount").textContent=`${list.length} leads`;
  document.getElementById("resultsTitle").textContent=`Leads em ${payload.city}`;
  results.innerHTML=list.map((l,i)=>{
    const [name,type,phone]=Array.isArray(l)?l:[l.name,l.type||payload.type,l.phone||""];
    const msg=buildMessage(name,payload);
    return `<article class="result-card">
      <div><h4>${esc(name)}</h4><div class="result-meta">${esc(type)} • ${esc(payload.city)} - ${esc(payload.state)}<br>${esc(phone||"Telefone não informado")}</div>
      <div class="badges"><span class="badge green">Possível oportunidade</span><span class="badge">Sem site — validar</span></div></div>
      <div class="actions">
        <button class="icon-btn" onclick='copyMessage(${JSON.stringify(msg)})'>Copiar abordagem</button>
        <button class="icon-btn whatsapp" onclick='openWhatsApp(${JSON.stringify(phone)},${JSON.stringify(msg)})'>WhatsApp</button>
      </div>
    </article>`;
  }).join("");
}

function buildMessage(name,payload){
  if(currentPlan==="MAX") return `Olá! Tudo bem? Vi a ${name} e percebi uma oportunidade de melhorar a presença digital do negócio. Trabalho com criação de sites profissionais e posso montar uma proposta personalizada para vocês. Posso te mostrar um exemplo sem compromisso?`;
  if(currentPlan==="PRO") return `Olá! Tudo bem? Conheci a ${name} e trabalho com criação de sites profissionais. Posso te mostrar uma ideia de site para o negócio, sem compromisso?`;
  return `Olá! Tudo bem? Trabalho com criação de sites para empresas e gostaria de mostrar uma ideia para a ${name}. Posso te enviar um exemplo?`;
}
function openWhatsApp(phone,msg){const p=(phone||"").replace(/\D/g,""); if(!p){toast("Este lead não tem telefone disponível.");return} window.open(`https://wa.me/55${p}?text=${encodeURIComponent(msg)}`,"_blank")}
async function copyMessage(msg){try{await navigator.clipboard.writeText(msg);toast("Abordagem copiada!")}catch(e){toast("Não foi possível copiar automaticamente.")}}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function showPlans(){document.getElementById("planos").scrollIntoView({behavior:"smooth"});toast("Seus créditos acabaram. Escolha um plano para continuar.")}
function checkout(plan){const link=CAKTO_LINKS[plan]; if(!link || link.startsWith("COLE_AQUI")){toast(`Configure o link da Cakto do plano ${plan} no script.js.`);return} window.location.href=link}

const modal=document.getElementById("authModal");
function openAuth(mode){modal.classList.add("show");setAuthMode(mode)}
function closeAuth(){modal.classList.remove("show")}
function setAuthMode(mode){
  const login=mode==="login";
  document.getElementById("authEyebrow").textContent=login?"LOGIN":"CRIAR CONTA";
  document.getElementById("authTitle").textContent=login?"Entrar no LeadFinder":"Criar conta";
  document.getElementById("authSub").textContent=login?"Acesse sua conta.":"Comece com 30 créditos grátis.";
  document.getElementById("phone").style.display=login?"none":"block";
  document.getElementById("switchAuth").textContent=login?"Ainda não tenho conta":"Já tenho uma conta";
  document.getElementById("switchAuth").onclick=()=>setAuthMode(login?"register":"login");
}
document.getElementById("authForm").addEventListener("submit",e=>{e.preventDefault();toast("Conta salva nesta demonstração. Para produção, conecte o backend/banco.");closeAuth()});
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2800)}
window.addEventListener("keydown",e=>{if(e.key==="Escape")closeAuth()});
