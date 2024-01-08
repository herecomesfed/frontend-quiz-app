"use strict";

// Variables Declare
const subjectsContainer = document.querySelector(".subjects");
const leftCol = document.querySelector(".left-col");
const rightCol = document.querySelector(".right-col");

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

// const loadQuiz = function (currentSub) {
//   const appContainer = document.querySelector(".app-container");
//   appContainer.innerHTML = "";
//   let currentTab = 0;
//   currentSub.questions.forEach((q, i) => {
//     const html = `<div class="app-container__wrapper option ${
//       i === 0 ? "active" : ""
//     }">
//     <div class="col-50 left-col">
//     <p>Pick a subject to get started</p>
//       <h2>${q.question}</h2>
//     </div>
//     <div class="col-50 right-col">
//     <div class="subjects">
//       ${q.options.forEach((o) => {
//         console.log(o);
//         `<div class="subjects__subject">
//                     <p class="subject-text">${o}</p>
//                   </div>`;
//       })}
//       </div>
//     </div>
//   </div>`;
//     appContainer.insertAdjacentHTML("beforeend", html);
//   });
// };

const loadQuiz = function (currentSub) {
  // Load Question
  leftCol.innerHTML = "";
  const leftColMarkup = `
  <h3>${currentSub.questions[0].question}</h3>
  `;
  leftCol.insertAdjacentHTML("beforeend", leftColMarkup);

  // Load Answer
  rightCol.innerHTML = "";
  currentSub.questions[0].options.forEach((o) => {
    const rightColMarkup = `
    <div class="subjects__subject">
      <p class="subject-text">${o}</p>
    </div>`;

    rightCol.insertAdjacentHTML("beforeend", rightColMarkup);
  });
};
