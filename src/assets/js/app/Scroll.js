import $ from 'jquery';
import { TweenMax, Circ, Sine } from 'gsap';
import classie from 'classie';
import Hanlder from './Handler';

export default class Scroll extends Hanlder {
  static destroyScroll(events) {
    $(window).off('scroll', Scroll.onScroll);

    Scroll.cache = {};
    Scroll.destroy();

    if (events) {
      for (let i = 0; i < events.length; i += 1) {
        $(window).off('scroll', events[i]);
      }
    }
  }
  constructor(props) {
    super(props);

    this.cache = {};
    this.render();
  }
  render() {
    this.saveAnimationCache();
    $(window).on('scroll', this.onScroll);
  }
  saveAnimationCache() {
    const animations = [];
    $('[data-animation]').each((i, element) => {
      const $el = $(element);
      animations.push({
        el: element,
        start: $el.data('start') || 0.1,
        y: $el.offset().top,
        height: $el.height(),
        done: $el.hasClass('is-passed'),
        type: $el.data('animation'),
        delay: $el.data('delay') || null,
      });
    });

    this.cache.animations = animations;

    this.onScroll();
  }
  onScroll = () => {
    const st = $(window).scrollTop();

    if (this.cache.animations && this.cache.animations.length > 0) {
      for (let i = 0; i < this.cache.animations.length; i += 1) {
        const item = this.cache.animations[i];
        const itemY = !this.ignoreCache ? item.y : $(item.el).offset().top;
        const yBottom = st + ((1 - item.start) * window.innerHeight);
        const itemHeight = !this.ignoreCache ? item.height : $(item.el).height();

        if (!item.done && itemY <= yBottom && itemY + itemHeight >= st) {
          classie.add(item.el, 'is-passed');
          this.animation(item);

          item.done = true;
        }
      }
    }
  }
  animation = (item) => {
    switch (item.type) {
      case 'fadeIn':
        TweenMax.killTweensOf(item.el, { opacity: true, y: true });
        TweenMax.fromTo(item.el, 1, { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: Sine.easeOut, delay: 0.1 });
        break;

      case 'titleRight':
        TweenMax.killTweensOf(item.el, { opacity: true, x: true });
        TweenMax.fromTo(item.el, 1, { opacity: 0, x: 40 },
          { opacity: 1,
            x: 0,
            ease: Circ.easeOut,
            delay: 0.1,
          });
        classie.add(item.el, 'is-animated');

        break;

      case 'titleLeft':
        TweenMax.killTweensOf(item.el, { opacity: true, x: true });
        TweenMax.fromTo(item.el, 1, { opacity: 0, x: -40 },
          { opacity: 1,
            x: 0,
            ease: Circ.easeOut,
            delay: 0.1,
          });
        classie.add(item.el, 'is-animated');

        break;

      default:
        console.warn(`animation type "${item.type}"" does not exist`);
        break;
    }
  }
}
