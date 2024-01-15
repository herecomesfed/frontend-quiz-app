"use strict";

// Variables Declare
// Front Page
const subjectsContainer = document.querySelector(".subjects");
const quizContainer = document.querySelector(".app-container__quiz");

// Quiz Page
const questionContainer = document.querySelector(
  ".app-container__quiz .question-wrapper"
);
const answerContainer = document.querySelector(".app-container__quiz .options");
const submitAnswerButton = document.querySelector(".submit-wrapper__submit");
const topBarSubject = document.querySelector(".topbar-subject");

// Public Variables
let currentStep;
let currentSub;
let score = 0;

//Async Function
const loadData = async function () {
  try {
    const res = await fetch("data.json");

    if (!res.ok) {
      throw new Error("Ops! Something Went Wrong");
    }

    // Convert Data to Json
    const data = await res.json();
    const { quizzes } = data;
    console.log(quizzes);

    // Load The First Page
    await loadFrontPage(quizzes);

    // Choose the subject of quiz
    await chooseSubject(quizzes);

    // Submit Answer
    await submitAnswer();
  } catch (err) {
    console.error(err);
  }
};

loadData();

// Load Title and Subjects
const loadFrontPage = function (subject) {
  subject.forEach((s, i) => {
    const html = `<div class="subjects__subject" data-subject="${i}">
                    <div class="subject-icon ${s.title.toLowerCase()}-color"><img src="${
      s.icon
    }" alt="${s.title}"></div>
                    <p class="subject-text">${s.title}</p>
                  </div>`;
    subjectsContainer.insertAdjacentHTML("beforeend", html);
  });
};

// Determine argument
const chooseSubject = function (subject) {
  subjectsContainer.addEventListener("click", function (e) {
    if (e.target.closest(".subjects__subject")) {
      currentSub = subject[e.target.getAttribute("data-subject")];
      console.log(currentSub);

      loadQuiz(currentSub);
    }
  });
};

// Load Quiz Based On Argument
const loadQuiz = function (currentSub) {
  // Set attribute in body
  document.body.dataset.page = "quiz-page";

  // Set the current step
  currentStep = 0;

  generateTopBarSubject(currentSub);

  // Quiz Markup
  generateQuizMarkup(currentSub, currentStep);

  // Set Progress Bar
  updateProgressBar();
};

// Generate TopBar Subject
const generateTopBarSubject = function (currentSub) {
  const topBarSubjectMarkup = `
    <div class="subject-icon ${currentSub.title.toLowerCase()}-color">
      <img src="${currentSub.icon}" alt="${currentSub.title}" />
      </div>
    <p class="subject-text">${currentSub.title}</p>
  `;

  topBarSubject.insertAdjacentHTML("beforeend", topBarSubjectMarkup);
};

// Generate Quiz Markup
const generateQuizMarkup = function (currentSub, currentStep) {
  // Append Question
  const questionMarkup = `
<p class="question-number">Question ${currentStep + 1} of 10</p>
<h3 class="question">${currentSub.questions[currentStep].question.replace(
    /</g,
    "&lt;"
  )}</h3>
`;
  questionContainer.insertAdjacentHTML("beforeend", questionMarkup);

  const answers = currentSub.questions[currentStep].options;
  // Append Answers
  answers.forEach((o, i) => {
    const answerMarkup = `
<div class="subjects__subject" data-answer="${o.replace(/</g, "&lt;")}">
<p class="subject-icon">${String.fromCharCode(65 + i)}</p>
<p class="subject-text">${o.replace(/</g, "&lt;")}</p>
</div>
`;

    answerContainer.insertAdjacentHTML("beforeend", answerMarkup);
  });
};

// Submit answer
const submitAnswer = function () {
  let selectWarningExist = false;
  submitAnswerButton.addEventListener("click", function () {
    const allAnswers = document.querySelectorAll(".subjects__subject");
    const selectedAnswer = document.querySelector(".subjects__subject.active");
    // if (currentStep > currentSub.questions.length - 1) return;

    if (!selectedAnswer) {
      console.log("Seleziona!!");
      const selectWarning = `
        <div class="select-warning">
          <img src="./assets/images/icon-error.svg" alt="Error" />
          <p>Please select an answer</p>
        </div>
      `;
      !selectWarningExist
        ? submitAnswerButton.insertAdjacentHTML("beforeend", selectWarning)
        : "";
      selectWarningExist = true;
      return;
    }

    checkAnswer(selectedAnswer, allAnswers);

    setTimeout(() => {
      if (currentStep > currentSub.questions.length - 2) {
        document.body.dataset.page = "result-page";
        return;
      }
      currentStep++;
      questionContainer.innerHTML = answerContainer.innerHTML = "";
      generateQuizMarkup(currentSub, currentStep);
      updateProgressBar();
      loadResultPage();
    }, 1000);
  });
};

const checkAnswer = function (selectedAnswer, allAnswers) {
  if (
    selectedAnswer.dataset.answer.startsWith(
      currentSub.questions[currentStep].answer
    )
  ) {
    selectedAnswer.classList.add("correct");
    score++;
  } else {
    selectedAnswer.classList.add("wrong");
    Array.from(allAnswers)
      .find(
        (a) => a.dataset.answer === currentSub.questions[currentStep].answer
      )
      .classList.add("correct");
  }
};

// Select answer

answerContainer.addEventListener("click", function (e) {
  if (e.target.closest(".subjects__subject")) {
    document
      .querySelectorAll(".subjects__subject")
      .forEach((s) => s.classList.remove("active"));
    e.target.classList.add("active");
  }
});

const selectedAnswer = function (e) {};

// ProgressBar
const updateProgressBar = function () {
  const ProgressBar = document.querySelector(".progress-bar__intern");

  ProgressBar.style.width = `${(currentStep + 1) * 10}%`;
};

// Load Result Page
const loadResultPage = function () {
  if (currentStep === currentSub.questions.length) {
    document.body.dataset.page = "result-page";
  }
};
