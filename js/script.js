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
  optTitleListSelector = '.titles',
  optArticleAuthorSelector = '.post-author'; // Nowa stała dla autorów

// Funkcja generująca tytuły artykułów
function generateTitleLinks(customSelector = '') {
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = ''; // Czyszczenie listy tytułów

  let html = ''; // Zmienna do przechowywania HTML

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
    html += linkHTML;
  }

  titleList.innerHTML = html; // Wstawianie wygenerowanego HTML do listy tytułów

  // Dodawanie nasłuchiwania na kliknięcia
  const links = titleList.querySelectorAll('a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

// Funkcja generująca tagi
function generateTags() {
  let allTags = {}; // Obiekt do zliczania wystąpień tagów

  const articles = document.querySelectorAll(optArticleSelector); // Znajdź wszystkie artykuły

  for (let article of articles) {
    const tagsWrapper = article.querySelector('.post-tags .list'); // Wrapper tagów
    let html = ''; // Zmienna do przechowywania HTML

    const articleTags = article.getAttribute('data-tags'); // Pobierz tagi
    const articleTagsArray = articleTags.split(' '); // Podziel tagi na tablicę

    for (let tag of articleTagsArray) {
      const tagLinkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`; // Generowanie HTML linku

      // Zliczanie wystąpień tagów
      if (!allTags[tag]) {
        allTags[tag] = 1; // Jeśli tag nie istnieje, ustaw licznik na 1
      } else {
        allTags[tag]++; // Jeśli tag istnieje, zwiększ licznik
      }

      html += tagLinkHTML; // Dodaj link do HTML
    }

    tagsWrapper.innerHTML = html; // Wstaw HTML do wrappera tagów
  }

  // Generowanie chmury tagów
  generateTagCloud(allTags);
}

// Funkcja generująca chmurę tagów
function generateTagCloud(allTags) {
  const tagList = document.querySelector('.tags.list'); // Znajdź listę tagów w prawej kolumnie
  let allTagsHTML = ''; // Zmienna do przechowywania HTML chmury tagów

  for (let tag in allTags) {
    const tagCount = allTags[tag];
    const tagClass = calculateTagClass(tagCount); // Oblicz klasę rozmiaru tagu

    // Generowanie HTML dla tagu
    allTagsHTML += `<li><a href="#tag-${tag}" class="tag-size-${tagClass}">${tag} (${tagCount})</a></li>`;
  }

  tagList.innerHTML = allTagsHTML; // Wstaw HTML do listy tagów
}