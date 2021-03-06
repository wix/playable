import getQueriesForElement from './getQueriesForElement';

const DEFAULT_QUERY_PREFIX = 'data-playable';

class ElementQueries {
  private _element: HTMLElement;
  private _queryPrefix: string;
  private _queries: { mode: string; width: number }[];

  constructor(element: HTMLElement, { prefix = DEFAULT_QUERY_PREFIX } = {}) {
    this._element = element;
    this._queryPrefix = prefix;
    this._queries = [];
  }

  private _getQueryAttributeValue(mode: string, elementWidth: number) {
    return this._queries
      .filter(
        query =>
          query.mode === mode &&
          ((mode === 'max' && query.width >= elementWidth) ||
            (mode === 'min' && query.width <= elementWidth)),
      )
      .map(query => `${query.width}px`)
      .join(' ');
  }

  private _setQueryAttribute(mode: string, elementWidth: number) {
    const attributeName = this._queryPrefix
      ? `${this._queryPrefix}-${mode}-width`
      : `${mode}-width`;
    const attributeValue = this._getQueryAttributeValue(mode, elementWidth);

    if (attributeValue) {
      this._element.setAttribute(attributeName, attributeValue);
    } else {
      this._element.removeAttribute(attributeName);
    }
  }

  getQueries() {
    this._queries = getQueriesForElement(this._element, this._queryPrefix);
  }

  setWidth(width: number) {
    this._setQueryAttribute('min', width);
    this._setQueryAttribute('max', width);
  }

  destroy() {
    this._element = null;
  }
}

export default ElementQueries;
