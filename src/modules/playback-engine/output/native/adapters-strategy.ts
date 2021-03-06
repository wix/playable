import { IEventEmitter } from '../../../event-emitter/types';

import { VideoEvent, Error } from '../../../../constants';

import { resolveAdapters } from '../../utils/adapters-resolver';
import { getStreamType } from '../../utils/detect-stream-type';

import { IPlaybackAdapter, IPlaybackAdapterClass } from './adapters/types';
import { PlayableMediaSource, IPlayableSource } from '../../types';

export default class AdaptersStrategy {
  private _video: HTMLVideoElement;
  private _eventEmitter: IEventEmitter;
  private _playableAdapters: IPlaybackAdapter[];
  private _availableAdapters: IPlaybackAdapter[];
  private _attachedAdapter: IPlaybackAdapter;

  constructor(
    eventEmitter: IEventEmitter,
    video: HTMLVideoElement,
    playbackAdapters: IPlaybackAdapterClass[] = [],
  ) {
    this._video = video;
    this._eventEmitter = eventEmitter;
    this._playableAdapters = [];
    this._availableAdapters = [];
    this._attachedAdapter = null;

    playbackAdapters.forEach(
      adapter =>
        adapter.isSupported() &&
        this._availableAdapters.push(new adapter(eventEmitter)),
    );
  }

  private _autoDetectSourceTypes(
    mediaSources: Array<IPlayableSource | string>,
  ): IPlayableSource[] {
    return mediaSources.map((mediaSource: IPlayableSource | string) => {
      if (typeof mediaSource === 'string') {
        const type = getStreamType(mediaSource);
        if (!type) {
          this._eventEmitter.emitAsync(VideoEvent.ERROR, {
            errorType: Error.SRC_PARSE,
            streamSrc: mediaSource,
          });
        }
        return { url: mediaSource, type };
      }

      return mediaSource;
    });
  }

  private _resolvePlayableAdapters(src: PlayableMediaSource) {
    if (!src) {
      this._playableAdapters = [];
      return;
    }

    const mediaSources = [].concat(src);
    const mediaStreams = this._autoDetectSourceTypes(mediaSources);
    this._playableAdapters = resolveAdapters(
      mediaStreams,
      this._availableAdapters,
    );
  }

  private _connectAdapterToVideo() {
    if (this._playableAdapters.length > 0) {
      // Use the first PlayableStream for now
      // Later, we can use the others as fallback
      this._attachedAdapter = this._playableAdapters[0];
      this._attachedAdapter.attach(this._video);
    }
  }

  private _detachCurrentAdapter() {
    if (this._attachedAdapter) {
      this._attachedAdapter.detach();
      this._attachedAdapter = null;
    }
  }

  get attachedAdapter() {
    return this._attachedAdapter;
  }

  connectAdapter(src: PlayableMediaSource) {
    this._detachCurrentAdapter();
    this._resolvePlayableAdapters(src);
    this._connectAdapterToVideo();
  }

  destroy() {
    this._detachCurrentAdapter();
  }
}
