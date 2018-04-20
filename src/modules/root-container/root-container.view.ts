import htmlToElement from '../ui/core/htmlToElement';

import { containerTemplate } from './templates';

import View from '../ui/core/view';

import styles from './root-container.scss';

class RootContainerView extends View {
  private _width: number;
  private _height: number;
  private _$node: HTMLElement;
  private _callbacks: any;

  constructor(config) {
    super();
    const { width, height, fillAllSpace, callbacks } = config;
    this._callbacks = callbacks;
    this._$node = htmlToElement(containerTemplate({ styles: this.styleNames }));

    this.setFillAllSpaceFlag(fillAllSpace);

    this.setWidth(width);
    this.setHeight(height);

    this._bindEvents();
  }

  _bindEvents() {
    this._$node.addEventListener('mouseenter', this._callbacks.onMouseEnter);
    this._$node.addEventListener('mousemove', this._callbacks.onMouseMove);
    this._$node.addEventListener('mouseleave', this._callbacks.onMouseLeave);
  }

  _unbindEvents() {
    this._$node.removeEventListener('mouseenter', this._callbacks.onMouseEnter);
    this._$node.removeEventListener('mousemove', this._callbacks.onMouseMove);
    this._$node.removeEventListener('mouseleave', this._callbacks.onMouseLeave);
  }

  setWidth(width) {
    if (!width) {
      return;
    }

    this._width = width;

    this._$node.style.width = `${this._width}px`;
  }

  setHeight(height) {
    if (!height) {
      return;
    }

    this._height = height;

    this._$node.style.height = `${this._height}px`;
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  show() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  hide() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  appendComponentNode(node) {
    this._$node.appendChild(node);
  }

  getNode() {
    return this._$node;
  }

  setFullScreenStatus(isFullScreen) {
    if (isFullScreen) {
      this._$node.setAttribute('data-in-full-screen', 'true');
      this._$node.classList.add(this.styleNames.fullScreen);
    } else {
      this._$node.setAttribute('data-in-full-screen', 'false');
      this._$node.classList.remove(this.styleNames.fullScreen);
    }
  }

  setFillAllSpaceFlag(isFillAllSpace = false) {
    if (isFillAllSpace) {
      this._$node.classList.add(this.styleNames.fillAllSpace);
    } else {
      this._$node.classList.remove(this.styleNames.fillAllSpace);
    }
  }

  destroy() {
    this._unbindEvents();
    this._callbacks = null;

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
  }
}

RootContainerView.extendStyleNames(styles);

export default RootContainerView;