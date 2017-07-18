import VIDEO_EVENTS from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import View from './overlay.view';


const DEFAULT_CONFIG = {
  poster: false
};

export default class Overlay {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config'];

  constructor({ config, eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this.isHidden = false;
    this.isContentHidden = false;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config.ui.overlay
    };

    this._bindEvents();
    this._initUI(this.config.poster);
  }

  get node() {
    return this.view.getNode();
  }

  _initUI(src) {
    const { view } = this.config;
    const config = {
      callbacks: {
        onPlayClick: this._playVideo
      },
      src
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new this.constructor.View(config);
    }
  }

  _bindEvents() {
    this._playVideo = this._playVideo.bind(this);

    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus, this);
  }

  _updatePlayingStatus({ nextState }) {
    if (nextState === this._engine.STATES.PLAY_REQUESTED) {
      this._hideContent();
    } else if (nextState === this._engine.STATES.ENDED) {
      this._showContent();
    }
  }

  _playVideo() {
    this._engine.play();
    this._hideContent();

    this._eventEmitter.emit(UI_EVENTS.PLAY_OVERLAY_TRIGGERED);
  }

  _hideContent() {
    this.isContentHidden = true;
    this.view.hide();
  }

  _showContent() {
    this.isContentHidden = false;
    this.view.show();
  }

  setBackgroundSrc(src) {
    this.view.setBackgroundSrc(src);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus, this);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
  }
}
