import {Platform, useWindowDimensions} from 'react-native';

export const colors = {
  panel: 'rgba(0, 35, 68, 0.94)',
  panelDeep: 'rgba(0, 22, 43, 0.96)',
  border: 'rgba(173, 218, 255, 0.36)',
  text: '#ffffff',
  muted: 'rgba(232, 244, 255, 0.72)',
  green: '#15ff35',
  greenDark: '#119a46',
  red: '#ff2525',
  input: '#09599f',
  shadow: 'rgba(0, 0, 0, 0.34)',
};

export function useScreenMetrics() {
  const {width, height} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const gutter = compact ? 14 : 18;
  const top = Platform.OS === 'android' ? 30 : compact ? 44 : 72;
  const bottom = Platform.OS === 'android' ? 30 : 20;
  const headerHeight = compact ? 62 : 74;
  const navHeight = compact ? 62 : 68;
  const navWidth = Math.min(width - gutter * 4, compact ? 304 : 320);

  return {
    width,
    height,
    compact,
    gutter,
    top,
    bottom,
    headerHeight,
    navHeight,
    navWidth,
  };
}
