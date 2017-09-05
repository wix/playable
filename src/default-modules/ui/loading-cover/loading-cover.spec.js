import 'jsdom-global/register';
import { expect } from 'chai';
import sinon from 'sinon';

import Engine, { STATES } from '../../playback-engine/playback-engine';
import EventEmitter from '../../event-emitter/event-emitter';
import LoadingCover from './loading-cover.controler';
import RootContainer from '../../root-container/root-container.controler';

import { VIDEO_EVENTS, UI_EVENTS } from '../../../constants/index';


describe('LoadingCover', () => {
  let loadingCover;
  let engine;
  let eventEmitter;
  let config;
  let emitSpy;
  let controls;
  let rootContainer;

  beforeEach(() => {
    config = {
      ui: {}
    };

    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config
    });

    controls = {
      _hideContent: sinon.spy()
    };

    rootContainer = new RootContainer({
      eventEmitter,
      engine,
      config
    });

    loadingCover = new LoadingCover({
      engine,
      config,
      eventEmitter,
      rootContainer,
      controls
    });

    emitSpy = sinon.spy(eventEmitter, 'emit');
  });

  afterEach(() => {
    eventEmitter.emit.restore();
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(loadingCover).to.exists;
      expect(loadingCover.view).to.exists;
    });
  });

  describe('instance', () => {
    describe('public API', () => {
      it('should have method for getting view node', () => {
        const getNodeSpy = sinon.spy(loadingCover.view, 'getNode');
        loadingCover.node;
        expect(getNodeSpy.called).to.be.true;
      });

      it('should have method for setting cover', () => {
        const url = 'url';
        const setCoverSpy = sinon.spy(loadingCover.view, 'setCover');
        loadingCover.setLoadingCover(url);
        expect(setCoverSpy.calledWith(url)).to.be.true;
      });

      it('should have method for showing loader', () => {
        const showSpy = sinon.spy(loadingCover.view, 'show');
        loadingCover.show();
        expect(emitSpy.calledWith(UI_EVENTS.LOADING_COVER_SHOW_TRIGGERED)).to.be.true;
        expect(showSpy.called).to.be.true;
        expect(loadingCover.isHidden).to.be.false;
      });

      it('should have method for hidding loader', () => {
        loadingCover.show();
        const hideSpy = sinon.spy(loadingCover.view, 'hide');
        loadingCover.hide();
        expect(emitSpy.calledWith(UI_EVENTS.LOADING_COVER_HIDE_TRIGGERED)).to.be.true;
        expect(hideSpy.called).to.be.true;
        expect(loadingCover.isHidden).to.be.true;
      });
    });

    describe('reaction to event', () => {
      it('should be proper if event is VIDEO_EVENTS.UPLOAD_SUSPEND', () => {
        loadingCover.show();
        eventEmitter.emit(VIDEO_EVENTS.UPLOAD_SUSPEND);
        expect(loadingCover.isHidden).to.be.true;
      });

      describe('signifying state change', () => {
        let showSpy;
        let hideSpy;

        beforeEach(() => {
          showSpy = sinon.spy(loadingCover, 'show');
          hideSpy  = sinon.spy(loadingCover, 'hide');
        });

        afterEach(() => {
          loadingCover.show.restore();
          loadingCover.hide.restore();
        });

        it('should be proper if next state is STATES.LOAD_STARTED', () => {
          engine.setPreload('none');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.LOAD_STARTED
          });

          expect(showSpy.called).to.be.false;

          engine.setPreload('auto');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.LOAD_STARTED
          });

          expect(showSpy.called).to.be.true;
        });

        it('should be proper if next state is STATES.WAITING', () => {
          engine._stateEngine._isMetadataLoaded = true;
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.WAITING
          });

          expect(showSpy.called).to.be.false;

          engine._stateEngine._isMetadataLoaded = false;
          engine.setPreload('auto');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.WAITING
          });

          expect(showSpy.called).to.be.true;
        });

        it('should be proper if next state is STATES.READY_TO_PLAY', () => {
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.READY_TO_PLAY
          });

          expect(hideSpy.called).to.be.true;
        });
      });
    });
  });
});