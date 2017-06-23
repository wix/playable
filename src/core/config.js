import { iPhone, iPod, Android } from '../utils/device-detection';


export function getAnomalyBloodhoundConfig(params) {
  const { logger } = params;

  return logger;
}

export function getUIConfig(params) {
  const { size, controls, overlay, loader, screen, customUI = {} } = params;
  const config = {
    ...size,
    overlay,
    screen,
    customUI
  };

  if (iPhone || iPod || Android) {
    config.screen = {
      ...screen,
      indicateScreenClick: false,
      disableClickProcessing: true,
      nativeControls: true
    };
    config.loader = false;
    config.controls = false;
  } else {
    config.loader = loader;
    config.controls = controls;
  }

  return config;
}

export function getEngineConfig(params) {
  const { preload, autoPlay, loop, muted, volume, src, playInline } = params;

  return { preload, autoPlay, loop, muted, volume, src, playInline };
}

export function getFullScreenManagerConfig(params) {
  const { exitFullScreenOnEnd } = params;
  const config = {};

  if (exitFullScreenOnEnd !== void 0) {
    config.exitOnEnd = exitFullScreenOnEnd;
  }

  return config;
}

export default function convertParamsToConfig(params) {
  return {
    ui: getUIConfig(params),
    engine: getEngineConfig(params),
    anomalyBloodhound: getAnomalyBloodhoundConfig(params),
    fullScreenManager: getFullScreenManagerConfig(params)
  };
}

