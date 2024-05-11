import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'src/styles';
import {t} from 'i18next';
import {styleSheet} from 'src/styles/styleSheet';

type Props = {
  leftTitle: string;
  onBack: any;
};

const BackButton = (props: Props) => {
  return (
    <View style={styles.topButton}>
      <TouchableOpacity style={styles.action} onPress={props.onBack}>
        <Icon name="west" size={30} color={Colors.BLACK} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={props.onBack}>
        <Text style={styleSheet.linkTextStyle}>{t(props.leftTitle)}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  topButton: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '7%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {height: '100%', width: '20%', justifyContent: 'center'},
});
