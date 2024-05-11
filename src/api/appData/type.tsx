import {t} from 'i18next';
import React from 'react';
import {Text} from 'react-native';
import {statusSeason} from 'src/state/reducers/season/const';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
export type grossType = {
  id: number;
  value: number;
  unitName: string;
  unit?: string;
};

export type CropsType = {
  id: number;
  name: string;
};

export type OptionType = {value: number | null; label: string | null};

export const RenderStatusSeaSon = (
  status: string,
  fontSize?: number,
): React.ReactNode => {
  const fontSizeText = fontSize || 10;
  let color;
  switch (status) {
    case statusSeason.CULTIVATED:
      color = Colors.STATUS_SUCCESS_COLOR;
      break;
    case statusSeason.UNCULTIVATED:
      color = Colors.STATUS_DANGER_COLOR;
      break;
    case statusSeason.HARVESTED:
      color = Colors.STATUS_PRIMARY_COLOR;
      break;
  }
  return (
    <Text
      style={{
        ...styleSheet.linkTextStyle,
        color: color,
        flex: 1,
        fontSize: fontSizeText,
      }}>
      {t(status)}
    </Text>
  );
};
