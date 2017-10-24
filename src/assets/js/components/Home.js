import $ from 'jquery';
import { TweenMax } from 'gsap';
import * as Components from './Component';

export default class Home extends Components.Component {
  constructor() {
    super();
    this.events();
  }

  events() {
  }
}

Components.Home = Home;
