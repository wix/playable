import { ElementQueries } from 'css-element-queries';
import focusWithin from 'ally.js/src/style/focus-within';
//import focusSource from 'ally.js/src/style/focus-source';

import publicAPI from '../../utils/public-api-decorator';

import { UI_EVENTS } from '../../constants/index';

import View from './root-container.view';


export const DEFAULT_CONFIG = {
  fillAllSpace: false,
  overlay: false,
  loadingCover: false,
  customUI: {}
};

class RootContainer {
  static dependencies = ['engine', 'eventEmitter', 'config'];

  constructor({ engine, eventEmitter, config }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config.ui
    };
    this.isHidden = false;

    this._initUI();
    this._initCustomUI();

    this._bindEvents();
  }

  @publicAPI()
  get node() {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.view.setFullScreenStatus, this.view);
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.view.setFullScreenStatus, this.view);
  }

  _initUI() {
    const { width, height, fillAllSpace } = this.config;

    const config = {
      width,
      height,
      fillAllSpace
    };

    this.view = new View(config);
  }

  _initCustomUI() {
    this.customComponents = {};
    const keys = Object.keys(this.config.customUI);

    keys.forEach(key => {
      const component = new this.config.customUI[key]({
        engine: this._engine,
        eventEmitter: this._eventEmitter,
        ui: this
      });

      this.customComponents[key] = component;

      this.view.appendComponentNode(component.getNode());
    });
  }

  appendComponentNode(node) {
    this.view.appendComponentNode(node);
  }

  @publicAPI()
  attachToElement(node) {
    if (!this._disengageFocusWithin) {
      this._disengageFocusWithin = focusWithin();
    }

    node.appendChild(this.node);
    ElementQueries.init();
  }

  @publicAPI()
  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  @publicAPI()
  show() {
    this.isHidden = false;
    this.view.show();
  }

  @publicAPI()
  setWidth(width) {
    this.view.setWidth(width);
  }

  @publicAPI()
  setHeight(height) {
    this.view.setHeight(height);
  }

  @publicAPI()
  getWidth() {
    return this.view.getWidth();
  }

  @publicAPI()
  getHeight() {
    return this.view.getHeight();
  }

  @publicAPI()
  setFillAllSpace(flag) {
    this.view.setFillAllSpaceFlag(flag);
  }

  destroy() {
    this._unbindEvents();

    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this.config;

    //this._disengageFocusWithin && this._disengageFocusWithin();
  }
}

export default RootContainer;