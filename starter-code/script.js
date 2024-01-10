"use strict";

// Variables Declare
const subjectsContainer = document.querySelector(".subjects");
const quizContainer = document.querySelector(".app-container__quiz");
const questionContainer = document.querySelector(
  ".app-container__quiz .question-wrapper"
);
const answerContainer = document.querySelector(".app-container__quiz .options");
let currentStep;

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
  } catch (err) {
    console.error(err);
  }
};

loadData();

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

const chooseSubject = function (subject) {
  subjectsContainer.addEventListener("click", function (e) {
    if (e.target.closest(".subjects__subject")) {
      const currentSub = subject[e.target.getAttribute("data-subject")];
      console.log(currentSub);

      loadQuiz(currentSub);
    }
  });
};

const loadQuiz = function (currentSub) {
  // Set attribute in body
  document.body.dataset.page = "quiz-page";

  // Set the current step
  currentStep = 0;
  // Append Question
  const questionMarkup = `
              <p class="question-number">Question ${currentStep + 1} of 10</p>
              <h3 class="question">${
                currentSub.questions[currentStep].question
              }</h3>
  `;
  questionContainer.insertAdjacentHTML("beforeend", questionMarkup);

  // Append Answers
  currentSub.questions[currentStep].options.forEach((o, i) => {
    const answerMarkup = `
        <div class="subjects__subject">
          <p class="subject-icon">${String.fromCharCode(65 + i)}</p>
          <p class="subject-text">${o}</p>
        </div>
  `;

    answerContainer.insertAdjacentHTML("beforeend", answerMarkup);
  });
};
