import $ from 'jquery';
import { TweenMax } from 'gsap';

import * as Components from './Component';

export default class Home extends Components.Component {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;
    this.romans = new Map([[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]);
    this.events();
  }

  events() {
    this.$view.find('.article-list__item a').on('mouseover', this.standOut);
    this.$view.find('.article-list').on('mouseleave', this.initialiseList);
    this.$view.find('.js-roman-converter').on('change', this.converter);
  }

  standOut = (e) => {
    e.preventDefault();

    const $tar = $(e.currentTarget).parent();
    const $parent = $tar.parents('.article-list');
    const $all = $parent.children();
    const $rest = $all.not($tar);

    TweenMax.to($tar, 0.6, { opacity: 1 });
    TweenMax.to($rest, 0.6, { opacity: 0.2 });
  }

  initialiseList = () => {
    TweenMax.to('.article-list__item', 0.6, { opacity: 1 });
  }

  converter = (e) => {
    const tar = e.currentTarget;

    const val = tar.value;

    const value = (!isNaN(val)) ? this.toRoman(val) : this.fromRoman(val);

    $('.js-roman-result').html(value);
  }

  fromRoman = (str) => {
    let result = 0;
    let string = str;

    const decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    const rules = { M: 3, C: 3, D: 1, L: 1, X: 3, V: 1, I: 3 };

    const eachString = string.split('');
    let invalid = false;

    Object.keys(rules).forEach((key) => {
      const letterNum = eachString.filter(entry => (entry === key)).length;

      if (letterNum > rules[key]) {
        return null;
      }
    });

    // for (const key in rules) {
    //   const letterNum = eachString.filter(entry => (entry === key)).length;

    //   if (letterNum > rules[key]) {
    //     invalid = true;
    //   }
    // }

    for (let i = 0; i <= decimal.length; i += 1) {
      while (string.indexOf(roman[i]) === 0) {
        result += decimal[i];
        string = string.replace(roman[i], '');
      }
    }

    result = (string) ? null : result;

    return result;
  }
  toRoman = (val) => {
    let result = '';
    let num = val;

    this.romans.forEach((obj, key) => {
      const q = (num / key) | 0;
      if (q > 0) {
        result += obj.repeat(q);
        num -= key * q;
      }
    });

    return result;
  }
}

Components.Home = Home;
