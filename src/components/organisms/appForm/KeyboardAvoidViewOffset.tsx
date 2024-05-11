import React, {useEffect, useRef} from 'react';
import {Platform, ScrollView, Keyboard, Animated} from 'react-native';

const KeyboardAvoidViewOffset = (props: any) => {
  const {
    mainView = () => {},
    buttonView = () => {},
    animatedHeight = 0,
    styles = {},
  } = props;
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      e => {
        console.log(e.endCoordinates.height);
        moveView(1, -e.endCoordinates.height);
      },
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        moveView(0, 0);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const scrollAnimatedValue = useRef(new Animated.Value(0)).current;
  const buttonAnimatedValue = useRef(new Animated.Value(0)).current;

  const moveView = (x: number, heightKeybroad: number) => {
    Animated.timing(scrollAnimatedValue, {
      toValue: x,
      duration: 300,
      useNativeDriver: true,
    }).start();
    {
      Animated.timing(buttonAnimatedValue, {
        toValue: heightKeybroad,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const yVal = scrollAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, animatedHeight],
  });
  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
    ],
  };
  const animButtonStyle = {
    transform: [
      {
        translateY: buttonAnimatedValue,
      },
    ],
  };
  return (
    <>
      <ScrollView
        style={{flex: 1, paddingHorizontal: 15, ...styles}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View style={{flex: 1, alignItems: 'center', ...animStyle}}>
          {mainView && mainView()}
        </Animated.View>
      </ScrollView>
      <Animated.View style={{alignItems: 'center', ...animButtonStyle}}>
        {buttonView && buttonView()}
      </Animated.View>
    </>
  );
};
export default KeyboardAvoidViewOffset;
