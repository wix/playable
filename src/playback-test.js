import VideoPlayer from './index';
import { NativeEnvironmentSupport } from './utils/environment-detection';

describe('Playback e2e test', function () {
  this.timeout(10000);

  const formatsToTest = [
    { type: 'MP4', url: 'http://localhost:5000/assets/sample.mp4', supportedByEnv: NativeEnvironmentSupport.MP4 },
    { type: 'WEBM', url: 'http://localhost:5000/assets/sample.webm', supportedByEnv: NativeEnvironmentSupport.WEBM },
    { type: 'HLS', url: 'http://localhost:5000/assets/sample.m3u8', supportedByEnv: NativeEnvironmentSupport.HLS || NativeEnvironmentSupport.MSE }
    //{ type: 'DASH', url: 'http://localhost:5000/assets/sample.mpd', supportedByEnv: NativeEnvironmentSupport.DASH || NativeEnvironmentSupport.MSE }
  ];

  formatsToTest.forEach(formatToTest => {
    if (formatToTest.supportedByEnv) {
      it(`allows playback of ${formatToTest.type}`, function (done) {
        const player = VideoPlayer.create({});
        player.on(VideoPlayer.VIDEO_EVENTS.DURATION_UPDATED, newDuration => {
          if (newDuration > 0) {
            player.off(VideoPlayer.VIDEO_EVENTS.DURATION_UPDATED);
            done();
          }
        });
        player.setSrc(formatToTest.url);
      });
    }
  });
});
