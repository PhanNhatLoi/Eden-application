import * as React from 'react';
import {ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
import {IMAGE} from 'src/assets';
import {Colors} from 'src/styles';

type BackgroundProps = {
  children?: React.ReactNode;
  withoutHeader?: Boolean;
};

const Background = (props: BackgroundProps) => {
  const {children = null, withoutHeader = false} = props;
  if (withoutHeader) {
    return (
      <View style={{backgroundColor: Colors.WHITE, height: '100%'}}>
        <ImageBackground source={IMAGE.APP_BACKGROUND} style={styles.container}>
          <SafeAreaView style={styles.container}>{children}</SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
  return (
    <View style={{backgroundColor: Colors.WHITE, height: '100%'}}>
      <ImageBackground source={IMAGE.APP_BACKGROUND} style={styles.container}>
        <SafeAreaView style={styles.top} />
        <SafeAreaView style={styles.container}>{children}</SafeAreaView>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.WHITE,
  },
  top: {
    flex: 0,
    backgroundColor: Colors.WHITE,
  },
});

export default Background;
