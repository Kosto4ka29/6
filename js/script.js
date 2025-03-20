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
const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;

  // Usuwanie klasy 'active' ze wszystkich linków artykułów
  const activeLinks = document.querySelectorAll('.titles a.active');
  toggleActiveClass(activeLinks, 'active');

  // Dodawanie klasy 'active' do klikniętego linku
  clickedElement.classList.add('active');

  // Usuwanie klasy 'active' ze wszystkich artykułów
  const activeArticles = document.querySelectorAll('.post.active');
  toggleActiveClass(activeArticles, 'active');

  // Pobieranie atrybutu 'href' z klikniętego linku
  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);

  // Dodawanie klasy 'active' do odpowiedniego artykułu
  if (targetArticle) {
    targetArticle.classList.add('active');
  }
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(customSelector = '') {
  // Znalezienie artykułów pasujących do selektora
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  // Czyszczenie listy tytułów
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  // Tworzenie zmiennej HTML
  let html = '';

  // Iteracja po artykułach
  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
    html += linkHTML;
  }

  // Wstawianie wygenerowanego HTML do listy tytułów
  titleList.innerHTML = html;

  // Dodawanie nasłuchiwania na kliknięcia
  const links = titleList.querySelectorAll('a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

// Obsługa kliknięć w tagi
function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');

  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  toggleActiveClass(activeTags, 'active');

  const tagLinks = document.querySelectorAll(`a[href="${href}"]`);
  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }

  generateTitleLinks(`[data-tags~="${tag}"]`);
}

function addClickListenersToTags() {
  const tagLinks = document.querySelectorAll('.post-tags a');
  for (let tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();

// Dodawanie autorów do artykułów
const optArticleAuthorSelector = '.post-author';

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  
  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const author = article.getAttribute('data-author');
    
    if (authorWrapper && author) {
      authorWrapper.innerHTML = `<a href="#author-${author}">${author}</a>`;
    }
  }
}

// Obsługa kliknięć w autorów
function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  toggleActiveClass(activeAuthorLinks, 'active');

  const authorLinks = document.querySelectorAll(`a[href="${href}"]`);
  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }

  generateTitleLinks(`[data-author="${author}"]`);
}

function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll(`${optArticleAuthorSelector} a`);
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

// Generowanie autorów i przypisywanie nasłuchiwaczy
generateAuthors();
addClickListenersToAuthors();