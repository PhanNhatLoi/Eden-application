import {AppState, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import VideoPlayer from 'react-native-media-console';

import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route?: RouteProp<{
    params: {uri: string};
  }>;
};

const Playvideo = (props: Props) => {
  const {params} = props.route || {uri: ''};
  const appState = useRef(AppState.currentState);
  // event inactive and background app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        props.navigation.goBack();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <VideoPlayer
      showOnEnd
      source={{uri: params?.uri}}
      navigator={props.navigation}
    />
  );
};

export default Playvideo;

const styles = StyleSheet.create({});
