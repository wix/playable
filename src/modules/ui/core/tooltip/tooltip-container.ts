import { tooltipContainerTemplate } from './templates';
import htmlToElement from '../htmlToElement';
import Tooltip from './tooltip';
import Stylable from '../stylable';

import {
  ITooltipPosition,
  ITooltipPositionFunction,
  ITooltipPositionPlacement,
} from './types';

import styles from './tooltip-container.scss';

interface ITooltipContainer {
  node: HTMLElement;
  getTooltipPositionStyles(
    position: ITooltipPosition,
  ): { [ket: string]: string | number };
  destroy(): void;
}

class TooltipContainer extends Stylable implements ITooltipContainer {
  private _tooltip: Tooltip;
  private _$rootElement: HTMLElement;

  constructor(tooltip: Tooltip) {
    super();

    this._tooltip = tooltip;
    this._initDOM();
  }

  get node(): HTMLElement {
    return this._$rootElement;
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      tooltipContainerTemplate({
        styles: this.styleNames,
      }),
    );
    this._$rootElement.appendChild(this._tooltip.node);
  }

  getTooltipPositionStyles(
    position: ITooltipPosition | ITooltipPositionFunction,
  ) {
    if (typeof position === 'function') {
      position = position(this._$rootElement);
    }

    if (position.placement === ITooltipPositionPlacement.TOP) {
      return {
        left: `${this._getTooltipLeftX(position.x)}px`,
        top: 0,
        bottom: 'initial',
      };
    }

    return {
      left: `${this._getTooltipLeftX(position.x)}px`,
      top: 'initial',
      bottom: 0,
    };
  }

  destroy() {
    this._tooltip = null;
    this._$rootElement = null;
  }

  private _getTooltipLeftX(tooltipCenterX: number) {
    const tooltipRect = this._tooltip.node.getBoundingClientRect();
    const tooltipContainerRect = this._$rootElement.getBoundingClientRect();

    let tooltipLeftX = tooltipCenterX - tooltipRect.width / 2;

    // ensure `x` is in range of placeholder rect
    tooltipLeftX = Math.max(tooltipLeftX, 0);
    tooltipLeftX = Math.min(
      tooltipLeftX,
      tooltipContainerRect.width - tooltipRect.width,
    );

    return tooltipLeftX;
  }
}

TooltipContainer.extendStyleNames(styles);

export { ITooltipContainer };
export default TooltipContainer;
