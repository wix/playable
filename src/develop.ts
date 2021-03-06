import {
  create,
  MEDIA_STREAM_TYPES,
  PRELOAD_TYPES,
  registerModule,
  registerPlaybackAdapter,
} from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';
import Subtitles from './modules/ui/subtitles/subtitles';
import ChromecastButton from './modules/ui/controls/chromecast/chromecast';
import ChromecastManager from './modules/chromecast-manager/chromecast-manager';

const DEFAULT_URLS: any = {
  DASH: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  HLS:
    'https://files.wixstatic.com/files/video/64b2fa_039e5c16db504dbaad166ba28d377744/repackage/hls',
  MP4:
    'https://storage.googleapis.com/video-player-media-server-static/test2.mp4',
  'MP4-VERTICAL':
    'https://storage.googleapis.com/video-player-media-server-static/videoplayback.mp4',
  /**
   * start LIVE media
   *
   * Flow:
   * go to https://video-player-media-server-dot-wixgamma.appspot.com
   * click START
   */
  LIVE:
    'https://video-player-media-server-dot-wixgamma.appspot.com/live/stream/manifest.m3u8',
};

registerModule('subtitles', Subtitles);
registerModule('chromecastManager', ChromecastManager);
registerModule('chromecastButton', ChromecastButton);

registerPlaybackAdapter(HLSAdapter);
registerPlaybackAdapter(DASHAdapter);
const config = {
  framesCount: 178,
  qualities: [
    {
      spriteUrlMask:
        'https://storage.googleapis.com/video-player-media-server-static/thumbnails/low_rez_sprite_%d.jpg',
      frameSize: { width: 90, height: 45 },
      framesInSprite: { vert: 10, horz: 10 },
    },
    {
      spriteUrlMask:
        'https://storage.googleapis.com/video-player-media-server-static/thumbnails/high_rez_sprite_%d.jpg',
      frameSize: { width: 180, height: 90 },
      framesInSprite: { vert: 5, horz: 5 },
    },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  const player = create({
    preload: PRELOAD_TYPES.METADATA,
    width: 600,
    height: 350,
    playsinline: true,
    rtl: false,
  });
  player.showLogo();

  Object.defineProperty(window, 'player', {
    value: player,
  });

  const selectVideo = (type: MEDIA_STREAM_TYPES, url?: string) => {
    player.setSrc({
      type,
      url: url || DEFAULT_URLS[type],
    });
    player.setTitle(`${type} format`);
  };

  selectVideo(MEDIA_STREAM_TYPES.HLS);

  document.getElementById('types').addEventListener('click', event => {
    const { type } = (event.target as any).dataset;
    if (!type) {
      return;
    }
    if (type === 'MP4-VERTICAL' || type === 'LIVE') {
      player.setSrc({
        type: type === 'LIVE' ? MEDIA_STREAM_TYPES.HLS : MEDIA_STREAM_TYPES.MP4,
        url: DEFAULT_URLS[type],
      });
      player.setTitle(`${type}`);
    } else {
      selectVideo(type);
    }
  });

  document.getElementById('theme-switcher').addEventListener('click', event => {
    const { color } = (event.target as any).dataset;
    if (!color) {
      return;
    }

    player.updateTheme({ progressColor: color, color });
  });

  document
    .getElementById('progress-bar-modes')
    .addEventListener('click', event => {
      const { mode } = (event.target as any).dataset;
      if (!mode) {
        return;
      }

      if (mode === 'REGULAR') {
        player.seekOnProgressDrag();
      } else if (mode === 'PREVIEW') {
        player.showPreviewOnProgressDrag();
      }
    });

  Array.from(document.querySelectorAll('[name="direction"]')).forEach(
    (radioInput: HTMLElement) => {
      radioInput.addEventListener('change', e => {
        player.setRtl((e.target as any).value === 'rtl');
      });
    },
  );

  player.attachToElement(document.getElementById('player-wrapper'));
  player.setFramesMap(config);
  player.showLiveIndicator();
});
