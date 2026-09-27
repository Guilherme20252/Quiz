/* ===========================================================
   1) MENU MOBILE (adaptado do NavBar-main)
=========================================================== */
class MobileNavbar {
  constructor(mobileMenuSelector, navListSelector) {
    this.mobileMenu = document.querySelector(mobileMenuSelector);
    this.navList = document.querySelector(navListSelector);
    this.activeClass = "active";
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.mobileMenu.classList.toggle(this.activeClass);
    this.navList.classList.toggle(this.activeClass);
  }

  init() {
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
    return this;
  }

  close() {
    this.mobileMenu.classList.remove(this.activeClass);
    this.navList.classList.remove(this.activeClass);
  }
}

const mobileNavbar = new MobileNavbar(".mobile-menu", ".nav-list").init();

/* ===========================================================
   2) TROCA DE SEÇÕES (SPA simples)
=========================================================== */
const navButtons = document.querySelectorAll(".nav-list button");
const views = document.querySelectorAll(".view");

function showView(id) {
  views.forEach((v) => v.classList.remove("active"));
  navButtons.forEach((b) => b.classList.remove("active"));

  document.getElementById(id).classList.add("active");
  document.querySelector(`.nav-list button[data-target="${id}"]`)?.classList.add("active");

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  mobileNavbar.close();

  if (id === "recorde") renderRecorde();
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => showView(btn.dataset.target));
});

document.querySelectorAll("[data-goto]").forEach((el) => {
  el.addEventListener("click", () => showView(el.dataset.goto));
});

/* ===========================================================
   3) GABARITO E CORREÇÃO DO QUIZ
=========================================================== */
const TOTAL_PERGUNTAS = 8;

function normaliza(txt) {
  return (txt || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos
}

function corrigirQuiz() {
  let acertos = 0;
  const marcar = (elId, ok, msgCerta, msgErrada) => {
    const card = document.getElementById(elId);
    const feedback = card.querySelector(".feedback");
    card.classList.remove("correct", "wrong");
    card.classList.add(ok ? "correct" : "wrong");
    feedback.textContent = ok ? msgCerta : msgErrada;
    feedback.classList.add("show");
    if (ok) acertos++;
  };

  // Pergunta 1 - múltipla escolha (radio)
  const p1 = document.querySelector('input[name="pergunta1"]:checked');
  marcar("card-p1", p1?.value === "HTML", "Certa resposta!", "Resposta correta: HTML");

  // Pergunta 2 - texto (domínio)
  const p2 = normaliza(document.getElementById("p2").value);
  marcar("card-p2", p2 === "dominio", "Certa resposta!", 'Resposta correta: "domínio"');

  // Pergunta 3 - senha forte (heurística: 8+ caracteres, maiúscula, minúscula e número)
  const p3 = document.getElementById("p3").value;
  const senhaForte = p3.length >= 8 && /[A-Z]/.test(p3) && /[a-z]/.test(p3) && /[0-9]/.test(p3);
  marcar("card-p3", senhaForte, "Boa, essa senha é considerada forte!", "Uma senha forte tem 8+ caracteres, maiúsculas, minúsculas e números.");

  // Pergunta 4 - data (ano de 1991)
  const p4 = document.getElementById("p4").value;
  const anoCerto = p4 && new Date(p4).getUTCFullYear() === 1991;
  marcar("card-p4", anoCerto, "Certa resposta! O HTML foi lançado em 1991.", "Resposta correta: 1991");

  // Pergunta 5 - seleção múltipla (JavaScript e Java)
  const marcados = Array.from(document.querySelectorAll('input[name="pergunta5"]:checked')).map((i) => i.value);
  const certos5 = ["Javascript", "Java"];
  const p5ok = marcados.length === certos5.length && certos5.every((v) => marcados.includes(v));
  marcar("card-p5", p5ok, "Certa resposta!", "Resposta correta: JavaScript e Java");

  // Pergunta 6 - upload de arquivo .html
  const p6files = document.getElementById("p6").files;
  const p6ok = p6files.length > 0 && p6files[0].name.toLowerCase().endsWith(".html");
  marcar("card-p6", p6ok, "Arquivo .html recebido!", "O arquivo precisa ter extensão .html");

  // Pergunta 7 - select
  const p7 = document.getElementById("p7").value;
  marcar("card-p7", p7 === "type", "Certa resposta!", "Resposta correta: type");

  // Pergunta 8 - trecho de código
  const p8 = normaliza(document.getElementById("p8").value);
  marcar("card-p8", p8 === "ola, mundo!" || p8 === "ola mundo!" || p8 === "ola, mundo", "Certa resposta!", 'Resposta correta: "Olá, mundo!"');

  mostrarResultado(acertos);
  salvarRecorde(acertos);
}

function avaliacao(score) {
  if (score <= 2) return "Não foi dessa vez! Bora estudar um pouco mais.";
  if (score <= 4) return "Pratique mais, você já está no caminho certo!";
  if (score <= 6) return "Boa! Mandou bem nessa rodada.";
  if (score === 7) return "Muito bom, quase perfeito!";
  return "Parabéns, você acertou tudo!";
}

function mostrarResultado(score) {
  const box = document.getElementById("resultado-quiz");
  box.querySelector(".score").textContent = `${score} / ${TOTAL_PERGUNTAS}`;
  box.querySelector(".msg").textContent = avaliacao(score);
  box.classList.add("show");
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.getElementById("btn-corrigir").addEventListener("click", corrigirQuiz);
document.getElementById("btn-refazer").addEventListener("click", () => {
  document.getElementById("quiz-form").reset();
  document.querySelectorAll(".question-card").forEach((c) => c.classList.remove("correct", "wrong"));
  document.querySelectorAll(".feedback").forEach((f) => f.classList.remove("show"));
  document.getElementById("resultado-quiz").classList.remove("show");
});

/* ===========================================================
   4) RECORDE (localStorage)
=========================================================== */
const STORAGE_KEY = "quizProgramadores.recorde";

function lerRecorde() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { melhor: 0, ultima: null, tentativas: 0 };
  } catch (e) {
    return { melhor: 0, ultima: null, tentativas: 0 };
  }
}

function salvarRecorde(pontuacao) {
  const dados = lerRecorde();
  dados.melhor = Math.max(dados.melhor, pontuacao);
  dados.ultima = pontuacao;
  dados.tentativas += 1;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (e) {
    /* localStorage indisponível: segue sem salvar */
  }
}

function renderRecorde() {
  const dados = lerRecorde();
  document.getElementById("stat-melhor").textContent = `${dados.melhor} / ${TOTAL_PERGUNTAS}`;
  document.getElementById("stat-ultima").textContent = dados.ultima === null ? "—" : `${dados.ultima} / ${TOTAL_PERGUNTAS}`;
  document.getElementById("stat-tentativas").textContent = dados.tentativas;
}

document.getElementById("btn-zerar-recorde").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderRecorde();
});

/* ===========================================================
   5) INÍCIO
=========================================================== */
showView("inicio");
