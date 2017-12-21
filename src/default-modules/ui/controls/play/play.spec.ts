import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../../testkit';

import { VIDEO_EVENTS, STATES } from '../../../../constants/index';

describe('PlayControl', () => {
  let testkit;
  let control;
  let eventEmitter;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    eventEmitter = testkit.getModule('eventEmitter');
    control = testkit.getModule('playControl');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exist;
      expect(control.view).to.exist;
    });
  });

  describe('API', () => {
    it('should have method for setting playback status', () => {
      const spy = sinon.spy(control.view, 'setState');
      expect(control.setControlStatus).to.exist;
      control.setControlStatus();
      expect(spy.called).to.be.true;
    });

    it('should have method for destroying', () => {
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).to.exist;
      control.destroy();
      expect(control.view).to.not.exist;
      expect(control._eventEmitter).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(control, '_updatePlayingStatus');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should change view based on playback status', () => {
      const spy = sinon.spy(control, 'setControlStatus');
      control._updatePlayingStatus({ nextState: STATES.PLAYING });
      expect(spy.calledWith(true)).to.be.true;
      control._updatePlayingStatus({ nextState: STATES.PAUSED });
      expect(spy.calledWith(false)).to.be.true;
    });

    it('should change playback status', () => {
      const playSpy = sinon.spy(control._engine, 'play');
      const pauseSpy = sinon.spy(control._engine, 'pause');
      control._playVideo();
      expect(playSpy.called).to.be.true;
      control._pauseVideo();
      expect(pauseSpy.called).to.be.true;
    });
  });

  describe('View', () => {
    it('should react on play/pause icon click', () => {
      const toggleSpy = sinon.spy(control, '_togglePlayback');
      control._bindCallbacks();
      control._initUI();

      control.view.$playbackControl.trigger('click');
      expect(toggleSpy.called).to.be.true;
    });

    it('should have method for setting current time', () => {
      expect(control.view.setState).to.exist;
    });

    it('should have method for showing itself', () => {
      expect(control.view.show).to.exist;
    });

    it('should have method for hidding itself', () => {
      expect(control.view.hide).to.exist;
    });

    it('should have method gettind root node', () => {
      expect(control.view.getNode).to.exist;
    });

    it('should have method for destroying', () => {
      expect(control.view.destroy).to.exist;
    });
  });
});