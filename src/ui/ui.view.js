import $ from 'jbone';

import fullscreen from '../utils/fullscreen';

import styles from './ui.scss';


export default class PlayerUIView {
  constructor({ width, height, callbacks }) {
    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: styles['video-wrapper']
    });

    this.$innerWrapper = $('<div>', {
      class: styles['inner-wrapper']
    });

    if (width) {
      this.$node.css({
        width: `${width}px`
      });
    }

    if (height) {
      this.$node.css({
        height: `${height}px`
      });
    }

    this.$node.append(this.$innerWrapper);

    this._bindCallbacks();

    this._bindEvents();
  }

  _bindCallbacks() {
    this._toggleClassOnFullScreenChange = this._toggleClassOnFullScreenChange.bind(this);
  }

  _bindEvents() {
    document.addEventListener(fullscreen.raw.fullscreenchange, this._toggleClassOnFullScreenChange);
  }

  _toggleClassOnFullScreenChange() {
    this._setFullScreenStatus(fullscreen.isFullscreen);
    this._callbacks.onFullScreenStatusChange();
  }

  setWidth(width) {
    if (!width) {
      return;
    }

    this.$node
      .css({
        width: `${width}px`
      });
  }

  setHeight(height) {
    if (!height) {
      return;
    }

    this.$node
      .css({
        height: `${height}px`
      });
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  appendComponentNode(node) {
    this.$innerWrapper.append(node);
  }

  getNode() {
    return this.$node[0];
  }

  _setFullScreenStatus(isFullscreen) {
    this.$innerWrapper.toggleClass(styles.fullscreen, isFullscreen);
  }

  enterFullScreen() {
    fullscreen.request(this.$innerWrapper[0]);
    this._setFullScreenStatus(true);
  }

  exitFullScreen() {
    fullscreen.exit();
    this._setFullScreenStatus(false);
  }

  _unbindEvents() {
    document.removeEventListener(fullscreen.raw.fullscreenchange, this._toggleClassOnFullScreenChange);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}
