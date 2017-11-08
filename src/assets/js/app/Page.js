import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import { TweenMax } from 'gsap';
import Trigger from './Trigger';
import Scroll from './Scroll';

import * as Components from '../components/Component';
import '../components/Home';

import Model from './Models';

import * as Templates from '../templates/Template';
import '../templates/Home';

const defaultUrl = window.location.pathname.replace(/\//g, '');
const timingIn = 1;
const timingOut = 0.4;

export default class Page {
  constructor() {
    this.$view = $('.main');

    this.components = [];
    this.templates = [];

    this.globalEvents();

    this.loadTemplate({ id: defaultUrl }).then(() => {
      this.loadComponent();
      this.loadPage();
      this.preLoad();
      this.trigger = new Trigger();
      this.scroll = new Scroll();
      Trigger.setHistory();
    });
  }

  globalEvents() {
    $(window).on('popstate', (e) => {
      if (history.length > 2 || document.referrer.length > 0) {
        this.pageTransition(e, true);
      }
    });
  }

  getTemplate(obj) {
    return new Promise((resolve) => {
      $.getJSON(obj.model, (data) => {
        this.template = new Templates[obj.name](obj.$el, data, obj.options);
      })
        .done(() => {
          const renderData = this.template.render();
          this.templates.push(this.template);
          resolve(renderData.v);
        })
        .fail(() => {
          console.log('error');
        });
    });
  }

  loadTemplate(options) {
    const $templates = this.$view.find('[data-template]');
    const id = options.id || '';

    return new Promise((resolve) => {
      if ($templates.length > 0) {
        for (let i = $templates.length - 1; i >= 0; i -= 1) {
          const $template = $templates.eq(i);
          const templateName = $template.data('template');

          TweenMax.set($template, { opacity: 0 });

          if (Templates[templateName] !== undefined) {
            const TempOptions = $template.data('options');

            const models = new Model({ slag: id });
            const tempModel = models[templateName]();

            this.getTemplate({
              $el: $template,
              name: templateName,
              options: TempOptions,
              model: tempModel,
            }).then((data) => {
              $template.html(data);
              TweenMax.to($template, timingIn, { opacity: 1 });

              if (i === $templates.length - 1) {
                resolve();
              }
            });
          } else {
            window.console.warn('There is no "%s" template!', templateName);
            if (i === $templates.length - 1) {
              resolve();
            }
          }
        }
      } else {
        resolve();
      }
    });
  }

  loadPage() {
    const pageName = this.$view.data('page');

    $('body').removeClass((index, className) => (className.match(/(^|\s)is-\S+/g) || []).join(' '));
    $('body').addClass(`is-${pageName.toLowerCase()}`);
  }

  loadComponent() {
    const $components = this.$view.parent().find('[data-component]');

    for (let i = $components.length - 1; i >= 0; i -= 1) {
      const $component = $components.eq(i);
      const componentName = $component.data('component');

      if (Components[componentName] !== undefined) {
        const options = $component.data('options');
        const component = new Components[componentName]($component, options);

        this.components.push(component);
      } else {
        window.console.warn('There is no "%s" component!', componentName);
      }
    }
  }

  loaderOut = () => (
    new Promise((resolve) => {
      TweenMax.to('.loader__name', timingOut, {
        autoAlpha: 0,
        y: '10%',
        onComplete: () => {
          resolve();
        },
      });
    })
  )

  pageTransition(e, back) {
    e.preventDefault();

    const event = (!back) ? e : '';
    const slag = (!back) ? e.currentTarget.getAttribute('href') : history.state.slag;

    slag.replace(/\//g, '');

    this.trigger.animateOut()
      .then(() => {
        if (!back) Trigger.setHistory(event);
        this.destroy();
        return this.trigger.load();
      })
      .then(() => {
        this.trigger.render();
        this.$view = $('.main');
        return this.loadTemplate({ id: slag });
      })
      .then(() => {
        this.loadPage();
        return this.preLoad();
      })
      .then(() => {
        this.loaderOut();
      })
      .catch((error) => {
        // console.log(error);
        console.log('Error!');
      });
  }

  onState() {
    let changed = false;

    for (const component of this.components) {
      const componentChanged = component.onState();
      if (!changed && !!componentChanged) {
        changed = true;
      }
    }

    return changed;
  }

  turnOff() {
    this.callAll('turnOff');
  }

  turnOn() {
    this.callAll('turnOn');
  }

  destroy() {
    this.callAll('destroy');
    this.components = [];
    Scroll.destroyScroll();

    TweenMax.killTweensOf(this.view);
    this.$view.off();
    this.$view = null;
    this.pageTitle = null;
  }

  callAll(fn, ...args) {
    for (const component of this.components) {
      if (typeof component[fn] === 'function') {
        component[fn].apply(component, [].slice.call(arguments, 1));
      }
    }
    for (const template of this.templates) {
      if (typeof template[fn] === 'function') {
        template[fn].apply(template, [].slice.call(arguments, 1));
      }
    }
  }

  preLoad() {
    const loadingImages = imagesLoaded(this.$view.find('.js-preload').toArray(), { background: true });
    let images = [];

    for (const component of this.components) {
      images = images.concat(component.preloadImages());
    }

    for (const url of images) {
      loadingImages.addBackground(url, null);
    }

    return new Promise((resolve) => {
      $('body').addClass('load-start');
      this.loader = loadingImages;
      this.loader.on('progress', () => {
        // const progress = (instance.progressedCount / instance.images.length) * 100;
        // this.layout(PageEvents.PROGRESS, progress);
      }).on('always', () => {
        $('.progress').addClass('load-completed');
        resolve(true);
      });
    });
  }
}
