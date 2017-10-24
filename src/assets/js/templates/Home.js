import { html, escape, raw } from 'es6-string-html-template';
import * as Templates from './Template';

export default class Home extends Templates.Template {
  constructor(template, data, options) {
    super(template, data, options);
    this.data = data;
  }

  render() {
    return html`
      ${this.data.map(article => html`
      <div class="article-list__item js-article-item" data-title="${article.title}" data-date="${article.date}">
        <a class="u-grid-link js-ajax-trigger" href="${article.url}" data-name="${article.title}">${article.title}</a>
        <figure class="article-list__image"><img src="${article.image}" alt="${article.title}"></figure>
        <h3 class="article-list__title">${article.title}</h3>
      </div>
      `)}
    `;
  }
}

Templates.Home = Home;
