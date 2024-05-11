import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import React from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {Skeleton} from '@rneui/base';
import {IMAGE} from 'src/assets';

type Props = {
  height?: number | string;
  avatar?: boolean;
};

const SkeletonCard = (props: Props) => {
  const {height = 100, avatar = false} = props;

  const styles = StyleSheet.create({
    container: {
      height: height,
      // borderRadius: 8,
      // borderColor: Colors.GRAY_03,
      backgroundColor: Colors.WHITE,
      // borderWidth: 1,
      width: '100%',
      padding: 10,
      flexDirection: 'row',
    },
    row: {
      flexDirection: 'row',
    },
  });
  const linearGradient = () => {
    return (
      <ImageBackground
        style={{height: '100%'}}
        source={IMAGE['LinearGradientWhite']}></ImageBackground>
    );
  };

  return (
    <View style={styles.container}>
      {avatar && (
        <View style={{marginRight: 10}}>
          <Skeleton
            circle
            LinearGradientComponent={linearGradient}
            animation="wave"
          />
        </View>
      )}
      <View style={{flex: 1}}>
        <View style={{width: '90%', marginVertical: 2}}>
          <Skeleton
            LinearGradientComponent={linearGradient}
            animation="wave"
            height={20}
            style={{backgroundColor: Colors.GRAY_02}}
          />
        </View>
        <View style={{width: '70%', marginVertical: 2}}>
          <Skeleton
            LinearGradientComponent={linearGradient}
            animation="wave"
            style={{backgroundColor: Colors.GRAY_02}}
          />
        </View>
        <View style={{width: '80%', marginTop: 15}}>
          <Skeleton
            LinearGradientComponent={linearGradient}
            animation="wave"
            style={{backgroundColor: Colors.GRAY_02}}
          />
        </View>
        <View style={{width: '85%', marginVertical: 2}}>
          <Skeleton
            LinearGradientComponent={linearGradient}
            animation="wave"
            style={{backgroundColor: Colors.GRAY_02}}
          />
        </View>
        <View style={{width: '50%', marginVertical: 2}}>
          <Skeleton
            LinearGradientComponent={linearGradient}
            animation="wave"
            height={15}
            style={{backgroundColor: Colors.GRAY_02}}
          />
        </View>
      </View>
    </View>
  );
};
export default SkeletonCard;
