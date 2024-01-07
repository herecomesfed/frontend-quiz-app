const subjectsContainer = document.querySelector(".subjects");
const loadData = async function () {
  try {
    const res = await fetch("data.json");

    if (!res.ok) {
      throw new Error("Ops! Something Went Wrong");
    }

    const data = await res.json();
    const { quizzes } = data;
    console.log(quizzes);
    await loadFrontPage(quizzes);
    await loadSubject(quizzes);
  } catch (err) {
    console.error(err);
  }
};

loadData();

const loadFrontPage = function (subject) {
  subject.forEach((s, i) => {
    const html = `<div class="subjects__subject" data-subject="${i}">
                    <div class="subject-icon"><img src="${s.icon}" alt="${s.title}"></div>
                    <p class="subject-text">${s.title}</p>
                  </div>`;
    subjectsContainer.insertAdjacentHTML("beforeend", html);
  });
};

const loadSubject = function (subject) {
  subjectsContainer.addEventListener("click", function (e) {
    if (e.target.closest(".subjects__subject")) {
      console.log(subject[e.target.getAttribute("data-subject")]);
    }
  });
};
