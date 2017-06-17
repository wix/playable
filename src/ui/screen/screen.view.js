import $ from 'jbone';

import styles from './screen.scss';


export default class ScreenView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor({ callbacks, nativeControls, indicateScreenClick }) {
    this._nativeControls = nativeControls;
    this._indicateScreenClick = indicateScreenClick;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['screen-block'],
      tabIndex: 0
    });

    if (this._indicateScreenClick) {
      this.$iconContainer = $('<div>', {
        class: `${this.styleNames['icon-container']}`
      });

      this.$icon = $('<div>', {
        class: `${this.styleNames.icon}`
      });
      this.$icon.html(
        `<svg class="${this.styleNames['svg-play']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 14"><path fill="#FFF" fill-rule="evenodd" d="M.079 0L0 14l10.5-7.181z"/></svg>` +
        `<svg class="${this.styleNames['svg-pause']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path fill="#FFF" fill-rule="evenodd" d="M7 0h3v14H7V0zM0 0h3v14H0V0z"/></svg>`
      );

      this.$iconContainer.append(this.$icon);

      this.$node.append(this.$iconContainer);
    }

    this._bindEvents();
  }

  _bindEvents() {
    this.$node[0].addEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].addEventListener('keydown', this._callbacks.onWrapperKeyPress);
  }

  focusOnNode() {
    this.$node[0].focus();
  }

  get styleNames() {
    return this.constructor._styles;
  }

  activatePlayIcon() {
    this.$icon.toggleClass(this.styleNames.pause, false);
    this.$icon.toggleClass(this.styleNames.play, true);
  }

  activatePauseIcon() {
    this.$icon.toggleClass(this.styleNames.play, false);
    this.$icon.toggleClass(this.styleNames.pause, true);
  }

  deactivateIcon() {
    this.$icon.toggleClass(this.styleNames.play, false);
    this.$icon.toggleClass(this.styleNames.pause, false);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  appendPlaybackViewNode(node) {
    this.$node.append(node);
    if (this._nativeControls) {
      node.setAttribute('controls', 'true');
    }
  }

  _unbindEvents() {
    this.$node[0].removeEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].removeEventListener('keypress', this._callbacks.onWrapperKeyPress);
  }

  appendComponentNode(node) {
    this.$node.append(node);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}
