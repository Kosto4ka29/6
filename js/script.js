/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
'use strict';

// Utility function to toggle 'active' class
function toggleActiveClass(elements, className) {
  for (let element of elements) {
    element.classList.remove(className);
  }
}

// Obsługa kliknięć w tytuły artykułów
const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');
  toggleActiveClass(activeLinks, 'active');
  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.post.active');
  toggleActiveClass(activeArticles, 'active');

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  if (targetArticle) {
    targetArticle.classList.add('active');
  }
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleAuthorSelector = '.post-author';

// Generowanie listy tytułów artykułów
function generateTitleLinks(customSelector = '') {
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  const titleList = document.querySelector(optTitleListSelector);
  if (!titleList) {
    console.error('Nie znaleziono elementu .titles');
    return;
  }
  titleList.innerHTML = '';

  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector)?.innerHTML;
    if (!articleTitle) continue;
    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
    html += linkHTML;
  }

  titleList.innerHTML = html;

  const links = titleList.querySelectorAll('a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

// Generowanie listy tagów
function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const tagsWrapper = article.querySelector('.post-tags .list');
    if (!tagsWrapper) continue;

    let html = '';
    const articleTags = article.getAttribute('data-tags');
    if (!articleTags) continue;

    const articleTagsArray = articleTags.split(' ');

    for (let tag of articleTagsArray) {
      const tagLinkHTML = `<li><a href="#tag-${tag}">${tag}</a></li> `;
      allTags[tag] = (allTags[tag] || 0) + 1;
      html += tagLinkHTML;
    }

    tagsWrapper.innerHTML = html.trim();
  }

  generateTagCloud(allTags);
}

// Generowanie chmury tagów
function generateTagCloud(allTags) {
  const tagList = document.querySelector('.tags.list');
  if (!tagList) {
    console.error('Nie znaleziono elementu .tags.list');
    return;
  }

  let allTagsHTML = '';

  for (let tag in allTags) {
    const tagCount = allTags[tag];
    const tagClass = calculateTagClass(tagCount);
    allTagsHTML += `<li><a href="#tag-${tag}" class="tag-size-${tagClass}">${tag} (${tagCount})</a></li> `;
  }

  tagList.innerHTML = allTagsHTML.trim();
}

// Obliczanie rozmiaru tagu
function calculateTagClass(count) {
  const maxCount = Math.max(...Object.values(allTags));
  const minCount = Math.min(...Object.values(allTags));
  const tagLevels = 5;
  if (maxCount === minCount) return tagLevels;
  return Math.ceil(((count - minCount) / (maxCount - minCount)) * (tagLevels - 1) + 1);
}

// Generowanie autorów
function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    if (!authorWrapper) continue;

    const authorName = article.getAttribute('data-author');
    if (!authorName) continue;

    const authorLinkHTML = `<a href="#author-${authorName}">${authorName}</a>`;
    authorWrapper.innerHTML = `By: ${authorLinkHTML}`;

    allAuthors[authorName] = (allAuthors[authorName] || 0) + 1;
  }

  generateAuthorList(allAuthors);
}

// Generowanie listy autorów
function generateAuthorList(allAuthors) {
  const authorList = document.querySelector('.authors.list');
  if (!authorList) {
    console.error('Nie znaleziono elementu .authors.list');
    return;
  }

  let allAuthorsHTML = '';

  for (let author in allAuthors) {
    allAuthorsHTML += `<li><a href="#author-${author}">${author} (${allAuthors[author]})</a></li>`;
  }

  authorList.innerHTML = allAuthorsHTML.trim();
}

// Obsługa kliknięć w autorów
function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  
  generateTitleLinks(`[data-author="${author}"]`);
}

// Dodawanie obsługi kliknięć do autorów
function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll('.authors.list a, .post-author a');
  for (let link of authorLinks) {
    link.addEventListener('click', authorClickHandler);
  }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function () {
  generateTitleLinks();
  generateTags();
  generateAuthors();
  addClickListenersToAuthors();
});
