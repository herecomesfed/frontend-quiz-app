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
const selectWarning = document.querySelector(".select-warning");
const playAgainButton = document.querySelector(".play-again");
const topBarSubject = document.querySelector(".topbar-subject");

// Result Page
const resultContainer = document.querySelector(".score-container");

const switcher = document.querySelector(".switcher");

// Public Variables
let currentStep;
let currentSub;
let score = 0;
let errorExist = false;
let answerChecked = false;
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

    // Load The First Page
    await loadFrontPage(quizzes);

    // Choose the subject of quiz
    await chooseSubject(quizzes);

    // Select Answer
    await selectAnswer();

    // Submit Answer
    await submitAnswer();

    // Play Again
    await handlePlayAgain();
  } catch (err) {
    console.error(err);
  }
};

loadData();

// Load Title and Subjects
const loadFrontPage = function (subject) {
  subject.forEach((s, i) => {
    //prettier-ignore
    const frontPageMarkup = `
      <div class="subjects__subject" data-subject="${i}" tabindex="0">
        <div class="subject-icon ${s.title.toLowerCase()}-color">
          <img src="${s.icon}" alt="${s.title}">
        </div>
        <p class="subject-text">${s.title}</p>
      </div>`;
    subjectsContainer.insertAdjacentHTML("beforeend", frontPageMarkup);
  });
};

// Determine argument
const chooseSubject = function (subject) {
  // Handler Function
  const handleChooseSubject = function (e) {
    const actualSubject = e.target.closest(".subjects__subject");
    if (actualSubject) {
      currentSub = subject[actualSubject.getAttribute("data-subject")];
      loadQuiz(currentSub);
    }
  };

  // Select Subject With Click
  subjectsContainer.addEventListener("click", handleChooseSubject);

  // Select Subject With Enter
  subjectsContainer.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChooseSubject(e);
  });
};

// Load Quiz Based On Argument
const loadQuiz = function () {
  // Set attribute in body
  document.body.dataset.page = "quiz-page";

  // Set the current step
  currentStep = 0;

  generateTopBarSubject();

  // Quiz Markup
  generateQuizMarkup();

  // Set Progress Bar
  updateProgressBar();
};

// Generate TopBar Subject
const generateTopBarSubject = function () {
  const topBarSubjectMarkup = `
    <div class="subject-icon ${currentSub.title.toLowerCase()}-color">
      <img src="${currentSub.icon}" alt="${currentSub.title}" />
      </div>
    <p class="subject-text">${currentSub.title}</p>
  `;

  topBarSubject.insertAdjacentHTML("beforeend", topBarSubjectMarkup);
};

// Generate Quiz Markup
const generateQuizMarkup = function () {
  // Append Question
  // prettier-ignore
  const questionMarkup = `
      <p class="question-number">Question ${currentStep + 1} of 10</p>
      <h3 class="question">${currentSub.questions[currentStep].question.replace(/</g,"&lt;")}</h3>
      `;
  questionContainer.insertAdjacentHTML("beforeend", questionMarkup);

  const answers = currentSub.questions[currentStep].options;
  // Append Answers
  answers.forEach((o, i) => {
    // prettier-ignore
    const answerMarkup = `
      <li class="subjects__subject" data-answer="${o.replace(/</g,"&lt;")}" tabindex="0">
        <p class="subject-icon">${String.fromCharCode(65 + i)}</p>
        <p class="subject-text">${o.replace(/</g, "&lt;")}</p>
      </li>
    `;

    answerContainer.insertAdjacentHTML("beforeend", answerMarkup);
  });
};

const editSubmitText = function (text) {
  submitAnswerButton.firstElementChild.textContent = text;
};
// Submit answer
const submitAnswer = function () {
  submitAnswerButton.addEventListener("click", function () {
    const allAnswers = document.querySelectorAll(".subjects__subject");
    const selectedAnswer = document.querySelector(".subjects__subject.active");

    if (!selectedAnswer) {
      generateError();
      return;
    }

    if (!answerChecked) {
      checkAnswer(selectedAnswer, allAnswers);
      return;
    }

    if (answerChecked) {
      answerChecked = false;
      currentStep++;
      const lastStep = currentStep > currentSub?.questions.length - 1;
      loadResultPage(lastStep);
      if (lastStep) return;
      questionContainer.innerHTML = answerContainer.innerHTML = "";
      generateQuizMarkup();
      updateProgressBar();
      loadResultPage();
      editSubmitText("Submit Answer");
    }
  });
};

const checkAnswer = function (selectedAnswer, allAnswers, lastStep) {
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
  editSubmitText("Next Question");
  answerChecked = true;
};

// Select answer

const selectAnswer = function () {
  answerContainer.addEventListener("click", (e) => {
    if (answerChecked) return;
    handleSelectAnswer(e);
  });
  answerContainer.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSelectAnswer(e);
  });

  const handleSelectAnswer = function (e) {
    const currentAnswer = e.target.closest(".subjects__subject");
    if (currentAnswer) {
      document
        .querySelectorAll(".subjects__subject")
        .forEach((s) => s.classList.remove("active"));
      currentAnswer.classList.add("active");
      removeError();
    }
  };
};

// ProgressBar
const updateProgressBar = function () {
  const ProgressBar = document.querySelector(".progress-bar__intern");

  ProgressBar.style.width = `${(currentStep + 1) * 10}%`;
};

// Load Result Page
const loadResultPage = function (lastStep) {
  if (lastStep) {
    document.body.dataset.page = "result-page";
    const resultMarkup = `
    <div class="topbar-subject result-subject">
                <div class="subject-icon ${currentSub.title.toLowerCase()}-color">
                  <img
                    src=${currentSub.icon}
                    alt="${currentSub.title}"
                  />
                </div>
                <p class="subject-text">${currentSub.title}</p>
              </div>

              <p class="score-container__score">${score}</p>
              <p class="score-container__maximum">out of 10</p>
    `;
    resultContainer.insertAdjacentHTML("beforeend", resultMarkup);
    return;
  }
};

const handlePlayAgain = function () {
  playAgainButton.addEventListener("click", function () {
    document.body.dataset.page = "front-page";
    score = 0;
    topBarSubject.innerHTML = "";
    questionContainer.innerHTML = "";
    answerContainer.innerHTML = "";
    resultContainer.innerHTML = "";
    editSubmitText("Submit Answer");
  });
};

const handleSwitchMode = function () {
  document.body.dataset.screen === "light"
    ? (document.body.dataset.screen = "dark")
    : (document.body.dataset.screen = "light");
};

switcher.addEventListener("click", handleSwitchMode);

const generateError = function () {
  selectWarning.style.display = "block";
  errorExist = true;
};

const removeError = function () {
  if (errorExist) {
    selectWarning.style.display = "none";
    errorExist = false;
  }
};
