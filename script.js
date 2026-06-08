const WHATSAPP_NUMBER = "5591992221950";
const DEFAULT_MESSAGE =
  "Olá, Tia Maria! Vim pela página das Aulas de Apoio e gostaria de saber qual o melhor acompanhamento para meu filho/minha filha.";

const whatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

document.querySelectorAll("[data-whatsapp-default]").forEach((link) => {
  link.href = whatsappUrl(DEFAULT_MESSAGE);
});

document.getElementById("current-year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const willOpen = !mainNav.classList.contains("open");
  mainNav.classList.toggle("open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  document.body.classList.toggle("menu-open", willOpen);
});

mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const form = document.getElementById("lead-form");
const steps = [...document.querySelectorAll(".form-step")];
const nextButton = document.getElementById("next-step");
const previousButton = document.getElementById("prev-step");
const submitButton = document.getElementById("submit-form");
const progressBar = document.getElementById("progress-bar");
const stepNumber = document.getElementById("step-number");
const stepTitle = document.getElementById("step-title");
const recommendation = document.getElementById("recommendation");
const resultPackage = document.getElementById("result-package");
const resultMessage = document.getElementById("result-message");
const resultWhatsapp = document.getElementById("result-whatsapp");
const restartButton = document.getElementById("restart-form");
const stepTitles = ["Sobre você", "Sobre a criança", "Necessidades", "Preferências"];
let currentStep = 0;

function updateStep() {
  steps.forEach((step, index) => step.classList.toggle("active", index === currentStep));
  previousButton.hidden = currentStep === 0;
  nextButton.hidden = currentStep === steps.length - 1;
  submitButton.hidden = currentStep !== steps.length - 1;
  progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  stepNumber.textContent = currentStep + 1;
  stepTitle.textContent = stepTitles[currentStep];
}

function setFieldError(field, message) {
  const wrapper = field.closest(".field");
  if (!wrapper) return;
  wrapper.classList.toggle("invalid", Boolean(message));
  const error = wrapper.querySelector(".field-error");
  if (error) error.textContent = message;
}

function validateField(field) {
  let message = "";
  const value = field.value.trim();

  if (field.required && !value) {
    message = "Preencha este campo para continuar.";
  } else if (field.type === "email" && value && !field.validity.valid) {
    message = "Digite um e-mail válido.";
  } else if (field.name === "whatsapp" && value.replace(/\D/g, "").length < 10) {
    message = "Digite um WhatsApp com DDD.";
  } else if (field.name === "idade" && value && (Number(value) < 3 || Number(value) > 12)) {
    message = "Informe uma idade entre 3 e 12 anos.";
  }

  setFieldError(field, message);
  return !message;
}

function validateGroup(group) {
  const inputs = [...group.querySelectorAll("input")];
  const isChecked = inputs.some((input) => input.checked);
  const error = group.nextElementSibling;
  if (error?.classList.contains("group-error")) {
    error.textContent = isChecked ? "" : "Escolha pelo menos uma opção.";
  }
  return isChecked;
}

function validateCurrentStep() {
  const step = steps[currentStep];
  const fields = [...step.querySelectorAll("input[required], select[required], textarea[required]")];
  const groups = [...step.querySelectorAll("[data-required-group]")];
  const fieldResults = fields.map(validateField);
  const groupResults = groups.map(validateGroup);
  const isValid = [...fieldResults, ...groupResults].every(Boolean);

  if (!isValid) {
    const firstInvalid =
      step.querySelector(".invalid input, .invalid select, .invalid textarea") ||
      step.querySelector("[data-required-group]");
    firstInvalid?.focus();
  }

  return isValid;
}

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;
  currentStep += 1;
  updateStep();
  document.querySelector(".form-card").scrollIntoView({ behavior: "smooth", block: "center" });
});

previousButton.addEventListener("click", () => {
  currentStep -= 1;
  updateStep();
});

form.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.matches("[required]")) validateField(field);
    const group = field.closest("[data-required-group]");
    if (group) validateGroup(group);
  });
});

const recurringTerms = [
  "recorrente",
  "sempre",
  "contínua",
  "continua",
  "muita dificuldade",
  "não consegue",
  "nao consegue",
  "baixo desempenho",
  "inseguro",
  "insegura",
];

const complexNeeds = [
  "Alfabetização e leitura",
  "Reforço em Matemática",
  "Autonomia e confiança",
  "Atenção e concentração",
];

function getRecommendation(data) {
  const frequency = data.get("frequencia");
  const needs = data.getAll("necessidades");
  const description = data.get("dificuldade").toLowerCase();
  const hasRecurringDifficulty = recurringTerms.some((term) => description.includes(term));
  const complexNeedCount = needs.filter((need) => complexNeeds.includes(need)).length;

  if (
    frequency === "3 vezes por semana" ||
    needs.length >= 5 ||
    (hasRecurringDifficulty && complexNeedCount >= 2)
  ) {
    return {
      package: "Evolução Completa",
      message:
        "Pelo que você contou, o Pacote Evolução Completa pode ser o mais adequado. Ele inclui diagnóstico inicial, plano individual, acompanhamento contínuo, relatório mensal e foco na evolução da criança.",
    };
  }

  if (
    frequency === "2 vezes por semana" ||
    hasRecurringDifficulty ||
    needs.some((need) =>
      [
        "Reforço em Português",
        "Reforço em Matemática",
        "Rotina de estudos",
        "Alfabetização e leitura",
        "Escrita e interpretação",
        "Atenção e concentração",
      ].includes(need),
    )
  ) {
    return {
      package: "Acompanhamento Escolar",
      message:
        "Pelo que você contou, o Pacote Acompanhamento Escolar parece o mais indicado. Ele ajuda a criar rotina, reforçar as matérias e acompanhar a evolução da criança semanalmente.",
    };
  }

  if (
    ["1 vez por semana", "Aula avulsa"].includes(frequency) ||
    needs.some((need) => ["Apoio nas tarefas escolares", "Revisão para provas"].includes(need))
  ) {
    return {
      package: "Apoio Essencial",
      message:
        "Pelo que você contou, o Pacote Apoio Essencial pode ser um bom começo. Ele é indicado para apoio pontual, tarefas escolares e reforços específicos.",
    };
  }

  return {
    package: "Conversa de orientação",
    message:
      "Pelo que você contou, o ideal é conversar rapidamente com a Tia Maria para entender melhor o momento da criança e indicar o formato mais adequado.",
  };
}

function buildLeadMessage(data, suggestedPackage) {
  return `Olá, Tia Maria! Preenchi o formulário da página e gostaria de conversar sobre o melhor acompanhamento.

Responsável: ${data.get("responsavel")}
Criança: ${data.get("crianca")}
Idade: ${data.get("idade")}
Série: ${data.get("serie")}
Necessidade principal: ${data.getAll("necessidades").join(", ")}
Modalidade desejada: ${data.get("modalidade")}
Frequência desejada: ${data.get("frequencia")}
Melhor horário: ${data.getAll("horarios").join(", ")}
Pacote sugerido pela página: ${suggestedPackage}

Podemos conversar?`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

  const data = new FormData(form);
  const result = getRecommendation(data);
  resultPackage.textContent = result.package;
  resultMessage.textContent = result.message;
  resultWhatsapp.href = whatsappUrl(buildLeadMessage(data, result.package));

  form.hidden = true;
  document.querySelector(".progress-track").hidden = true;
  document.querySelector(".form-step-label").hidden = true;
  recommendation.hidden = false;
  recommendation.scrollIntoView({ behavior: "smooth", block: "center" });
});

restartButton.addEventListener("click", () => {
  recommendation.hidden = true;
  form.hidden = false;
  document.querySelector(".progress-track").hidden = false;
  document.querySelector(".form-step-label").hidden = false;
  currentStep = 0;
  updateStep();
});

document.querySelectorAll(".package-select").forEach((button) => {
  button.addEventListener("click", () => {
    const packageName = button.dataset.package;
    const packageFrequency = {
      "Apoio Essencial": "1 vez por semana",
      "Acompanhamento Escolar": "2 vezes por semana",
      "Evolução Completa": "3 vezes por semana",
    }[packageName];

    const option = form.querySelector(`input[name="frequencia"][value="${packageFrequency}"]`);
    if (option) option.checked = true;
    document.getElementById("formulario").scrollIntoView({ behavior: "smooth" });
  });
});

updateStep();
