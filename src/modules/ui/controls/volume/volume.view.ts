import { TextLabel } from '../../../../constants';

import { ITooltipReference, ITooltipService } from '../../core/tooltip/types';
import { controlTemplate } from './templates';

import View from '../../core/view';
import { IView } from '../../core/types';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import {
  IVolumeViewStyles,
  IVolumeViewCallbacks,
  IVolumeViewConfig,
} from './types';
import { ITextMap } from '../../../text-map/types';

import volumeViewTheme from './volume.theme';
import styles from './volume.scss';

const DATA_IS_MUTED = 'data-playable-is-muted';
const DATA_VOLUME = 'data-playable-volume-percent';

const MAX_VOLUME_ICON_RANGE = 50;

const getPercentBasedOnXPosition = (
  event: MouseEvent,
  element: HTMLElement,
) => {
  const boundingRect = element.getBoundingClientRect();
  const positionX = event.clientX;

  if (positionX < boundingRect.left) {
    return 0;
  }

  if (positionX > boundingRect.left + boundingRect.width) {
    return 100;
  }

  return ((event.clientX - boundingRect.left) / boundingRect.width) * 100;
};

class VolumeView extends View<IVolumeViewStyles>
  implements IView<IVolumeViewStyles> {
  private _callbacks: IVolumeViewCallbacks;
  private _textMap: ITextMap;
  private _tooltipService: ITooltipService;
  private _muteToggleTooltipReference: ITooltipReference;

  private _$rootElement: HTMLElement;
  private _$muteToggle: HTMLElement;
  private _$volumeContainer: HTMLElement;
  private _$volume: HTMLElement;
  private _$hitbox: HTMLElement;

  private _isDragging: boolean;

  constructor(config: IVolumeViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;

    this._textMap = textMap;
    this._tooltipService = tooltipService;

    this._bindCallbacks();
    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      controlTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {
          muteLabel: this._textMap.get(TextLabel.MUTE_CONTROL_LABEL),
          volumeLabel: this._textMap.get(TextLabel.VOLUME_CONTROL_LABEL),
        },
      }),
    );

    this._$muteToggle = getElementByHook(this._$rootElement, 'mute-button');
    this._$volumeContainer = getElementByHook(
      this._$rootElement,
      'volume-input-block',
    );
    this._$hitbox = getElementByHook(this._$rootElement, 'volume-hitbox');
    this._$volume = getElementByHook(this._$rootElement, 'volume-input');

    this._muteToggleTooltipReference = this._tooltipService.createReference(
      this._$muteToggle,
      {
        text: this._textMap.get(TextLabel.MUTE_CONTROL_TOOLTIP),
      },
    );
  }

  private _bindCallbacks() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
    this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
    this._setVolumeByWheel = this._setVolumeByWheel.bind(this);
    this._setVolumeByClick = this._setVolumeByClick.bind(this);
    this._setVolumeByDrag = this._setVolumeByDrag.bind(this);
  }

  private _bindEvents() {
    this._$hitbox.addEventListener('wheel', this._setVolumeByWheel);
    this._$hitbox.addEventListener('mousedown', this._startDragOnMouseDown);
    window.addEventListener('mousemove', this._setVolumeByDrag);
    window.addEventListener('mouseup', this._stopDragOnMouseUp);

    this._$muteToggle.addEventListener('click', this._onButtonClick);
  }

  private _unbindEvents() {
    this._$hitbox.removeEventListener('wheel', this._setVolumeByWheel);
    this._$hitbox.removeEventListener('mousedown', this._startDragOnMouseDown);
    window.removeEventListener('mousemove', this._setVolumeByDrag);
    window.removeEventListener('mouseup', this._stopDragOnMouseUp);

    this._$muteToggle.removeEventListener('click', this._onButtonClick);
  }

  private _startDragOnMouseDown(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }
    this._setVolumeByClick(event);
    this._startDrag();
  }

  private _stopDragOnMouseUp(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    this._stopDrag();
  }

  private _setVolumeByClick(event: MouseEvent) {
    this._$volumeContainer.focus();
    const percent = getPercentBasedOnXPosition(event, this._$hitbox);
    this._callbacks.onVolumeLevelChangeFromInput(percent);
  }

  private _setVolumeByDrag(event: MouseEvent) {
    const percent = getPercentBasedOnXPosition(event, this._$hitbox);
    if (this._isDragging) {
      this._callbacks.onVolumeLevelChangeFromInput(percent);
    }
  }

  private _setVolumeByWheel(e: WheelEvent) {
    e.preventDefault();
    const value = e.deltaX || e.deltaY * -1;

    if (!value) {
      return;
    }

    this._callbacks.onVolumeLevelChangeFromWheel(value);
  }

  private _startDrag() {
    this._isDragging = true;
    this._$rootElement.classList.add(this.styleNames.isDragging);
    this._callbacks.onDragStart();
  }

  private _stopDrag() {
    if (this._isDragging) {
      this._isDragging = false;
      this._$rootElement.classList.remove(this.styleNames.isDragging);
      this._callbacks.onDragEnd();
    }
  }

  private _setVolumeDOMAttributes(percent: number) {
    this._$volumeContainer.setAttribute('value', String(percent));
    this._$volumeContainer.setAttribute(
      'aria-valuetext',
      this._textMap.get(TextLabel.VOLUME_CONTROL_VALUE, { percent }),
    );
    this._$volumeContainer.setAttribute('aria-valuenow', String(percent));

    this._$volume.setAttribute('style', `width:${percent}%;`);

    this._$rootElement.setAttribute(DATA_VOLUME, String(percent));

    this._$muteToggle.classList.remove(this.styleNames.volume0);
    this._$muteToggle.classList.remove(this.styleNames.volume50);
    this._$muteToggle.classList.remove(this.styleNames.volume100);

    if (percent >= MAX_VOLUME_ICON_RANGE) {
      this._$muteToggle.classList.add(this.styleNames.volume100);
    } else if (percent > 0) {
      this._$muteToggle.classList.add(this.styleNames.volume50);
    } else {
      this._$muteToggle.classList.add(this.styleNames.volume0);
    }
  }

  private _onButtonClick() {
    this._$muteToggle.focus();
    this._callbacks.onToggleMuteClick();
  }

  setVolume(volume: number) {
    this._setVolumeDOMAttributes(volume);
  }

  setMute(isMuted: boolean) {
    this._setMuteDOMAttributes(isMuted);
  }

  private _setMuteDOMAttributes(isMuted: boolean) {
    if (isMuted) {
      this._$muteToggle.classList.add(this.styleNames.muted);
    } else {
      this._$muteToggle.classList.remove(this.styleNames.muted);
    }

    this._$muteToggle.setAttribute(
      'aria-label',
      isMuted
        ? this._textMap.get(TextLabel.UNMUTE_CONTROL_LABEL)
        : this._textMap.get(TextLabel.MUTE_CONTROL_LABEL),
    );
    this._muteToggleTooltipReference.setText(
      isMuted
        ? this._textMap.get(TextLabel.UNMUTE_CONTROL_TOOLTIP)
        : this._textMap.get(TextLabel.MUTE_CONTROL_TOOLTIP),
    );

    this._$rootElement.setAttribute(DATA_IS_MUTED, String(isMuted));
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  getElement() {
    return this._$rootElement;
  }

  getButtonElement() {
    return this._$muteToggle;
  }

  getInputElement() {
    return this._$volumeContainer;
  }

  destroy() {
    this._unbindEvents();

    this._muteToggleTooltipReference.destroy();

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$muteToggle = null;
    this._$rootElement = null;
  }
}

VolumeView.setTheme(volumeViewTheme);
VolumeView.extendStyleNames(styles);

export default VolumeView;
