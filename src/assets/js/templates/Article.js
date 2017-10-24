import { html, escape, raw } from 'es6-string-html-template';
import * as Templates from './Template';

export default class Article extends Templates.Template {
  constructor(template, data, options) {
    super(template, data, options);
    this.data = data;
  }

  render() {
    return html`
      <div class="article">
        <div class="article__image">
          <img src="${this.data.thumbnail.url}" alt="${this.data.title}">
        </div>
        <div class="article__text">
          <h3>${this.data.title}</h3>
        </div>
        <div class="gallery">
          ${this.data.images.map((image, i) => html`
            <div class="gallery__image gallery__image--${image.position} gallery__image--${image.size} js-image-modal" data-src="${image.url}" data-id="${i + 1}" />
          `)}
        </div>
      </div>
    `;
  }
}

Templates.Article = Article;
