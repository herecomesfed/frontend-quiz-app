# Frontend Mentor - Frontend quiz app solution

This is a solution to the [Frontend quiz app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/frontend-quiz-app-BE7xkzXQnU). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Select a quiz subject
- Select a single answer from each question from a choice of four
- See an error message when trying to submit an answer without making a selection
- See if they have made a correct or incorrect choice when they submit an answer
- Move on to the next question after seeing the question result
- See a completed state with the score after the final question
- Play again to choose another subject
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Navigate the entire app only using their keyboard
- **Bonus**: Change the app's theme between light and dark

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [Github](https://github.com/herecomesfed/frontend-quiz-app)
- Live Site URL: [Live Link](https://herecomesfed.github.io/frontend-quiz-app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Vanilla Javascript ES6+
- Mobile-first workflow

### What I learned

In this challenge, I aimed to find a robust solution using Vanilla JS to push my boundaries in a demanding front-end application.

I'll' keep refactoring this code and I'll try to add some new features.

I successfully tackled the issue of instances of '<' in the text, ensuring they were not interpreted as HTML tags by using `replace(/</g, "&lt;")`

At first, I was uncertain about how to approach the problem since I am currently studying Regex and needed to conduct research. I am pleased with the final outcome.

```js
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
```

### Continued development

I want to use this project as a benchmark to remake it in React, both to master it and to add some new features.

## Author

- Website - [Federico Graziani](https://grazianifederico.it)
- Frontend Mentor - [@herecomesfed](https://www.frontendmentor.io/profile/herecomesfed)
- Linkedin - [Federico Graziani](https://www.linkedin.com/in/federico-graziani)

## Acknowledgments

I want to express my heartfelt thanks to my colleague Davide, who tested and had fun with the quiz. 😅
