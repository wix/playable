interface IPreviewFullSize {
  getElement(): HTMLElement;

  showAt(second: number): void;
  hide(): void;

  destroy(): void;
}

export { IPreviewFullSize };