import { MediaStreamTypes } from 'vidi';

import Player from './player';
import UI_EVENTS from './constants/events/ui';
import VIDEO_EVENTS from './constants/events/video';
import DefaultControls from './ui/controls/default-controls';
import Overlay from './ui/overlay/overlay.controler';
import Loader from './ui/loader/loader.controler';

const DefaultComponents = {
  Overlay,
  Loader
};

export {
  DefaultComponents,
  DefaultControls,
  UI_EVENTS,
  VIDEO_EVENTS,
  MediaStreamTypes,
  Player
};

export default {
  DefaultComponents,
  DefaultControls,
  UI_EVENTS,
  VIDEO_EVENTS,
  MediaStreamTypes,
  Player
};
