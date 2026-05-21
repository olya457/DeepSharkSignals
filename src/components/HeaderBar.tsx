import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, useScreenMetrics} from '../theme';

type Props = {
  title: string;
  icon?: string;
  onBack?: () => void;
};

export function HeaderBar({
  title,
  icon = '📦',
  onBack,
}: Props): React.JSX.Element {
  const metrics = useScreenMetrics();

  return (
    <View
      style={[
        styles.header,
        {
          height: metrics.headerHeight,
          marginHorizontal: metrics.gutter,
        },
      ]}>
      <Pressable
        onPress={onBack}
        disabled={!onBack}
        hitSlop={14}
        style={styles.iconBox}>
        <Text style={[styles.icon, onBack && styles.back]}>
          {onBack ? '←' : icon}
        </Text>
      </Pressable>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  iconBox: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    marginRight: 14,
    width: 36,
  },
  icon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  back: {
    fontSize: 32,
    lineHeight: 34,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
  },
});
