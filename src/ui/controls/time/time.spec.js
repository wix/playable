import EventEmitter from 'eventemitter3';

import { expect } from 'chai';
import sinon from 'sinon';

import TimeControl from './time.controler';
import Engine from '../../../playback-engine/playback-engine';
import { formatTime } from './time.view';
import { VIDEO_EVENTS } from '../../../constants';


describe('TimeControl', () => {
  let control = {};
  let engine = {};
  let eventEmitter = {};
  let config = {};

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config
    });
    control = new TimeControl({
      engine,
      eventEmitter
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('formatTime', () => {
    it('should return valid string', () => {
      expect(formatTime(NaN)).to.be.equal('00:00');
      expect(formatTime(Infinity)).to.be.equal('00:00');
      expect(formatTime(0)).to.be.equal('00:00');
      expect(formatTime(-10)).to.be.equal('23:59:50');
      expect(formatTime(10)).to.be.equal('00:10');
      expect(formatTime(110)).to.be.equal('01:50');
      expect(formatTime(11100)).to.be.equal('03:05:00');
    });
  });

  describe('API', () => {
    it('should have method for setting current time', () => {
      const spy = sinon.spy(control.view, 'setState');
      expect(control.setCurrentTime).to.exist;
      control.setCurrentTime();
      expect(spy.called).to.be.true;
    });

    it('should have method for setting duration time', () => {
      const spy = sinon.spy(control.view, 'setState');
      expect(control.setDurationTime).to.exist;
      control.setDurationTime();
      expect(spy.called).to.be.true;
    });

    it('should have method for showing whole view', () => {
      expect(control.show).to.exist;
      control.show();
      expect(control.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).to.exist;
      control.hide();
      expect(control.isHidden).to.be.true;
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
      const spy = sinon.spy(control, '_toggleIntervalUpdates');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
    });

    it('should call callback on seek', () => {
      const spy = sinon.spy(control, '_updateCurrentTime');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, { nextState: control._engine.STATES.SEEK_IN_PROGRESS});
      expect(spy.called).to.be.true;
    });

    it('should call callback on duration update', () => {
      const spy = sinon.spy(control, '_updateDurationTime');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED);
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should toggle interval updates', () => {
      const startSpy = sinon.spy(control, '_startIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: engine.STATES.PLAYING });
      expect(startSpy.called).to.be.true;

      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._toggleIntervalUpdates({ nextState: engine.STATES.PAUSED });
      expect(stopSpy.called).to.be.true;
    });

    it('should start interval updates', () => {
      const spy = sinon.spy(global, 'setInterval');
      const stopSpy = sinon.spy(control, '_stopIntervalUpdates');
      control._startIntervalUpdates();
      expect(spy.calledWith(control._updateCurrentTime)).to.be.true;
      expect(stopSpy.called).to.be.false;
      control._startIntervalUpdates();
      expect(stopSpy.called).to.be.true;

      spy.restore();
    })
  });

  describe('View', () => {
    it('should have method for setting state', () => {
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
