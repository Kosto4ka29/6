'use strict';
/* global Handlebars */

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink:Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink:Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  listAuthor:Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
};

const opts={
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  TitleListSelector: '.titles',
  ArticleTagsSelector:'.post-tags .list',
  ArticleAuthorSelector:'.post-author',
  TagsListSelector:'.tags.list',
  CloudClassCount:5,
  CloudClassPrevix:'tag-size-',
  AuthorListSelector:'.list.authors',
};

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement=this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks=document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /*[DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles=document.querySelectorAll('.post.active');

  for (let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector= clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle=document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
};

function generateTitleLinks(customSelector =''){

  /* remove contents of titleList */
  const titleList=document.querySelector(opts.TitleListSelector);

  titleList.innerHTML='';

  /* for each article */

  const articles=document.querySelectorAll(opts.ArticleSelector+customSelector);

  let html='';

  for (let article of articles){
    /* get the article id */

    const articleId=article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle =article.querySelector(opts.TitleSelector).innerHTML;

    /* create HTML of the link */

    //const linkHTML='<li><a href="#'+ articleId+'"><span>'+ articleTitle+'</span></a></li>';

    const linkHTMLData={id:articleId, title:articleTitle};
    const linkHTML=templates.articleLink(linkHTMLData);

    /* insert link into titleList */

    html+= linkHTML;
  }

  titleList.innerHTML=html;

  const links=document.querySelectorAll('.titles a');

  for (let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){

  const params={
    max:0,
    min:999999
  };

  for (let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag]>params.max){
      params.max=tags[tag];
    }
    if(tags[tag]<params.min){
      params.min=tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount=count-params.min;
  const normalizedMax=params.max-params.min;
  const percentage=normalizedCount/normalizedMax;

  const classNumber=Math.floor(percentage*(opts.CloudClassCount-1)+1);

  return opts.CloudClassPrevix+classNumber;
}


function generateTags(){
  /* find all articles */
  const articles=document.querySelectorAll(opts.ArticleSelector);

  let allTags={};
  /* START LOOP: for every article: */

  for (let article of articles){

    /* find tags wrapper */
    const tagsWraper=article.querySelector(opts.ArticleTagsSelector);

    /* make html variable with empty string */
    let html='';

    /* get tags from data-tags attribute */
    const articleTags=article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray=articleTags.split(' ');

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray){
      /* generate HTML of the link */
      //const HTMLlink=`<li><a href="#tag-${tag}">${tag} </a></li> `;

      const linkHTMLData = {tag: tag};
      const HTMLlink = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */
      html=html+HTMLlink;

      /* check if thislink is NOT already in allTags */
      if(!allTags[tag]){
        /* add generate code to allTags array */
        allTags[tag]=1;
      } else {
        allTags[tag]++;
      }
    }

    tagsWraper.innerHTML=html;

    const tagsParams=calculateTagsParams(allTags);
    /* [NEW] create variable for all links html code */

    const allTagsData={tags:[]};
    /*start loop: for each tag in alltags:*/
    for (let tag in allTags){
      allTagsData.tags.push({
        tag:tag,
        count:allTags[tag],
        className:calculateTagClass(allTags[tag],tagsParams)
      });

    }
    /*end loop: for each tag in allTags */

    /* add html from allTagsHTML to tagList */
    const tagList=document.querySelector(opts.TagsListSelector);

    tagList.innerHTML=templates.tagCloudLink(allTagsData);
  }
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement=this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href=clickedElement.getAttribute('href');
  //console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag= href.replace('#tag-', '');
  //console.log(tag);

  /* find all tag links with class active */
  const activeTags=document.querySelectorAll('a.active[href^="#tag"]');

  /* START LOOP: for each active tag link */
  for (let tag of activeTags){
    /* remove class active */
    tag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks=document.querySelectorAll('a[href="'+ href +'"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks){
    /* add class active */
    tagLink.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks(`[data-tags~=${tag}]`);
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks=document.querySelectorAll('.post-tags a, .tags a');

  /* START LOOP: for each link */
  for (let tagLink of tagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

//--------------------------------------

function generateAuthors(){
  //found all articles
  const articles= document.querySelectorAll(opts.ArticleSelector);

  let allAuthors={};

  //for each article found author wrappper

  for( let article of articles){
    const authorWrapper=article.querySelector(opts.ArticleAuthorSelector);

    let html='';

    const author=article.getAttribute('data-author');
    //console.log(linkHTML);

    const linkHTMLData={author:author};
    const linkHTML=templates.authorLink(linkHTMLData);

    html=html+linkHTML;
    authorWrapper.innerHTML=html;

    if(!Object.prototype.hasOwnProperty.call(allAuthors, author)){
      allAuthors[author]=1;
    } else {
      allAuthors[author]++
    }
  }

  const authorListWrapper=document.querySelector(opts.AuthorListSelector);

  const allAuthorData={author:[]};

  for (let author in allAuthors){
    allAuthorData.author.push({
      author:author});
  }

  authorListWrapper.innerHTML=templates.listAuthor(allAuthorData);

}

generateAuthors();

function authorClickHandler(event){
  event.preventDefault();

  const clickedElement=this;

  //get href from clickedElement
  const href=clickedElement.getAttribute('href');

  const author=href.replace('#author-','');

  //find all author with class active
  const activeAuthors=document.querySelectorAll('a.active[href^="#author"]');

  for (let activeAuthor of activeAuthors){
    activeAuthor.classList.remove('active');
  }

  //find all links where href atrribiute=href constant
  const authorLinks=document.querySelectorAll(`a[href="${href}"]`);

  for (let authorLink of authorLinks){
    authorLink.classList.add('active');
  }

  generateTitleLinks(`[data-author="${author}"]`);

}

function addClickListenersToAuthors(){
  const authorLinks=document.querySelectorAll('.post-author a, .authors a');

  for (let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }

}
addClickListenersToAuthors();