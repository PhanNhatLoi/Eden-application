import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {useTranslation} from 'react-i18next';

type InfoLineProps = {
  title?: React.ReactNode;
  info?: React.ReactNode;
  icon?: React.ReactNode;
};

const InfoLine = (props: InfoLineProps) => {
  const {title, info, icon} = props;
  const {t} = useTranslation();

  return (
    <View style={styles.row}>
      <Text style={styles.infoGrKey}>
        {title}
        {info ? ':' : null}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        {info ? (
          <Text style={styles.infoGrValue}>
            {icon}
            <View style={{width: 5}}></View>
            <Text>{info}</Text>
          </Text>
        ) : (
          <Text
            style={[
              styleSheet.textStyleBasic,
              {color: Colors.GRAY_04, fontStyle: 'italic', fontSize: 12},
            ]}>
            {t('no_data')}
          </Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    ...styleSheet.row,
    justifyContent: 'space-between',
    width: SCREEN.width - 40,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  top: {
    flex: 0,
    backgroundColor: Colors.WHITE,
  },
  infoGrKey: {
    ...styleSheet.textStyleBasic,
    color: Colors.GRAY_04,
    maxWidth: 200,
    fontSize: 12,
    textAlign: 'right',
  },
  infoGrValue: {
    ...styleSheet.textStyleBasic,
    maxWidth: 200,
    fontSize: 12,
    textAlign: 'right',
  },
});

export default InfoLine;
