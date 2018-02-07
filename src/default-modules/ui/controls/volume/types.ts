import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip';

type IVolumeViewStyles = {
  volumeControl: string;
  volumeInputBlock: string;
  isDragging: string;
  muteButton: string;
  icon: string;
  progressBar: string;
  volume: string;
  background: string;
  hitbox: string;
  hidden: string;
};

type IVolumeViewCallbacks = {
  onVolumeLevelChangeFromInput: Function;
  onVolumeLevelChangeFromWheel: Function;
  onToggleMuteClick: Function;
  onDragStart: Function;
  onDragEnd: Function;
};

type IVolumeViewConfig = {
  callbacks: IVolumeViewCallbacks;
  textMap: any;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

export { IVolumeViewStyles, IVolumeViewCallbacks, IVolumeViewConfig };