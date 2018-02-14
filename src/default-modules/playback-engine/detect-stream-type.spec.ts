import 'jsdom-global';
import { expect } from 'chai';
import { getStreamType } from './detect-stream-type';
import { MEDIA_STREAM_TYPES } from '../../constants/media-stream';

describe('Stream type auto detection', function() {
  const testURL = 'http://mocked-domain.com/some/internalPath/';
  const formatsToTest = [
    { type: MEDIA_STREAM_TYPES.MP4, fileName: 'video.mp4' },
    { type: MEDIA_STREAM_TYPES.WEBM, fileName: 'video.webm' },
    { type: MEDIA_STREAM_TYPES.HLS, fileName: 'video.m3u8' },
    { type: MEDIA_STREAM_TYPES.DASH, fileName: 'video.mpd' },
  ];

  formatsToTest.forEach(formatToTest => {
    it(`should detect ${formatToTest.type} URLs`, function() {
      const URL = testURL + formatToTest.fileName;

      expect(getStreamType(URL)).to.equal(formatToTest.type);
    });
  });

  describe('when recieve ULR', () => {
    const mp4URL = testURL + 'video.mp4';
    const queryParam = '?data=true';
    const fragment = '#sectionOnPage';

    it('should detect type even if it has query params', () => {
      expect(getStreamType(mp4URL + queryParam)).to.equal(
        MEDIA_STREAM_TYPES.MP4,
      );
    });

    it('should detect type even if it has fragments', () => {
      expect(getStreamType(mp4URL + fragment)).to.equal(MEDIA_STREAM_TYPES.MP4);
    });

    it('should detect type even if it has fragments and params', () => {
      expect(getStreamType(mp4URL + queryParam + fragment)).to.equal(
        MEDIA_STREAM_TYPES.MP4,
      );
    });
  });

  it("should throw error if can't parse url", () => {
    expect(getStreamType('test.url')).to.equal(false);
  });
});