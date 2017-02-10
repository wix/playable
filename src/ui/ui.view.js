import $ from 'jbone';

import styles from './ui.scss';


export default class PlayerUIView {
  constructor(width, height) {
    this.$node = $('<div>', {
      width,
      height,
      class: styles['video-wrapper']
    }).css({
      width: `${width}px`,
      height: `${height}px`
    });
  }
}