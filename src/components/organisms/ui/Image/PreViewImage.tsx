/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  ImageURISource,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useRef} from 'react';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'src/styles';
import {SCREEN} from 'src/help';
import {padding} from 'src/styles/mixins';
import {
  HandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  gestureHandlerRootHOC,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {MEDIA_API} from 'src/config';
import {IMAGE} from 'src/assets';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

type Props = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  route?: RouteProp<{
    params: {
      image: ImageURISource;
      ImagePropsTextContent?: React.ReactNode;
    };
  }>;
  navigation: NavigationProp<ParamListBase>;
};

type pointerTransFormType = {
  maxTransformX: number;
  maxTransformY: number;
  newTranslateX: number;
  newTranslateY: number;
  baseTranslateX: number;
  baseTranslateY: number;
};

type translateType = {
  newTranslateX: number;
  newTranslateY: number;
};

//init params
let _lastScale = 1;
let _lastTransformX = 1;
let _lastTransformY = 1;

let _widthImage = 0;
let _heightImage = 0;

const ImagePreview = (props: Props) => {
  const {navigation} = props;
  const params = props.route?.params || {
    image: {uri: ''},
  };
  const ImagePropsTextContent = props.route?.params.ImagePropsTextContent || (
    <></>
  );
  const uri = params.image.uri?.includes('https://')
    ? params.image.uri
    : MEDIA_API + params.image.uri;
  if (!params.image.width || !params.image.height) {
    // image.uri &&
    //   Image.getSize(uri, (width: number, height: number) => {
    //     _widthImage = width * (SCREEN.width / width);
    //     _heightImage = height * (SCREEN.width / width);
    //   });
  } else {
    _widthImage = params.image.width;
    _heightImage = params.image.height;
  }

  //scale state
  const _baseScale = new Animated.Value(1);
  const _pinchScale = new Animated.Value(1);
  const _scale = Animated.multiply(_baseScale, _pinchScale);

  //translate state
  const _baseTranslateX = new Animated.Value(1);
  const _baseTranslateY = new Animated.Value(1);
  const _panTranslateX = new Animated.Value(1);
  const _panTranslateY = new Animated.Value(1);
  const _translateX = Animated.add(_baseTranslateX, _panTranslateX);
  const _translateY = Animated.add(_baseTranslateY, _panTranslateY);

  const pointerTransForm = (
    newTranslate: translateType,
  ): pointerTransFormType => {
    const maxTransformX = _widthImage
      ? (_lastScale * _widthImage - SCREEN.width) / 2.0
      : 0;
    const maxTransformY = _heightImage
      ? (_lastScale * _heightImage - SCREEN.height) / 2.0
      : 0;
    const baseTranslateX =
      maxTransformX < 0
        ? 1
        : Math.abs(newTranslate.newTranslateX) > maxTransformX
        ? newTranslate.newTranslateX > 1
          ? maxTransformX
          : -maxTransformX
        : newTranslate.newTranslateX;

    const baseTranslateY =
      maxTransformY < 0
        ? 1
        : Math.abs(newTranslate.newTranslateY) > maxTransformY
        ? newTranslate.newTranslateY > 1
          ? maxTransformY
          : -maxTransformY
        : newTranslate.newTranslateY;

    return {
      maxTransformX: maxTransformX,
      maxTransformY: maxTransformY,
      newTranslateX: newTranslate.newTranslateX,
      newTranslateY: newTranslate.newTranslateY,
      baseTranslateX: baseTranslateX,
      baseTranslateY: baseTranslateY,
    };
  };

  const getTranslate = (
    event?: HandlerStateChangeEvent<PanGestureHandlerEventPayload>,
  ): translateType => {
    const newTranslateX =
      _lastTransformX + (event ? event.nativeEvent.translationX : 0);
    const newTranslateY =
      _lastTransformY + (event ? event.nativeEvent.translationY : 0);
    return {
      newTranslateX: newTranslateX,
      newTranslateY: newTranslateY,
    };
  };

  //doubleTap state
  const doubleTapRef = useRef(null);

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {},
      },
    ],
    {
      useNativeDriver: true,
      listener: (
        event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>,
      ) => {
        if (
          event.nativeEvent.scale * _lastScale <= 5 &&
          event.nativeEvent.scale * _lastScale >= 1
        )
          _pinchScale.setValue(event.nativeEvent.scale);
      },
    },
  );

  const onZoomStateChange = (
    event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>,
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastScale =
        _lastScale * event.nativeEvent.scale < 1
          ? 1
          : _lastScale * event.nativeEvent.scale > 5
          ? 5
          : _lastScale * event.nativeEvent.scale;
      _baseScale.setValue(_lastScale);
      _pinchScale.setValue(1);
      handleTranslate();
    }
  };

  const onDoubleTapEvent = (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>,
  ) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      _lastScale = 1;
      _baseScale.setValue(_lastScale);
      _pinchScale.setValue(1);
      handleTranslate();
    }
  };

  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          // translationX: _panTranslateX,
          // translationY: _panTranslateY,
        },
      },
    ],
    {
      useNativeDriver: true,
      listener: (
        event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>,
      ) => {
        const newTranslate = getTranslate(event);
        const pointer = pointerTransForm(newTranslate);
        if (Math.abs(pointer.newTranslateX) < pointer.maxTransformX)
          _panTranslateX.setValue(event.nativeEvent.translationX);
        if (Math.abs(pointer.newTranslateY) < pointer.maxTransformY)
          _panTranslateY.setValue(event.nativeEvent.translationY);
      },
    },
  );

  const onFocusStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      handleTranslate(event);
    }
  };

  const handleTranslate = (
    event?: HandlerStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    const newTranslate = getTranslate(event);
    const poiter = pointerTransForm(newTranslate);
    _lastTransformX = poiter.baseTranslateX;
    _lastTransformY = poiter.baseTranslateY;
    _baseTranslateX.setValue(_lastTransformX);
    _panTranslateX.setValue(1);
    _baseTranslateY.setValue(_lastTransformY);
    _panTranslateY.setValue(1);
  };

  const GestureHandlerRootHOC = gestureHandlerRootHOC(() => (
    <PinchGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onZoomStateChange}>
      <Animated.View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={onPanGestureEvent}
          onHandlerStateChange={onFocusStateChange}
          minPointers={1}
          maxPointers={1}>
          <Animated.View
            style={{
              transform: [
                {
                  translateX: _translateX,
                },
                {
                  translateY: _translateY,
                },
              ],
            }}>
            <TapGestureHandler
              ref={doubleTapRef}
              onHandlerStateChange={onDoubleTapEvent}
              numberOfTaps={2}>
              <Animated.Image
                source={
                  params.image.uri
                    ? {
                        uri: uri,
                      }
                    : IMAGE.DEFAULT_IMAGE
                }
                style={{
                  width: _widthImage,
                  height: _heightImage,
                  transform: [{perspective: 200}, {scale: _scale}],
                }}
                resizeMode="contain"
              />
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  ));
  // console.log(uri, 123);

  return (
    <View style={{backgroundColor: Colors.BLACK_05, height: '100%'}}>
      {params.image && <GestureHandlerRootHOC />}

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButton}>
        <MaterialIcons name="west" size={30} color={Colors.WHITE} />
      </TouchableOpacity>
      <View style={styles.bottomContent}>{ImagePropsTextContent}</View>
    </View>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 0,
    margin: 0,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0, 0.8)',
    borderRadius: 8,
  },
  bottomContent: {
    bottom: 20,
    width: '100%',
    backgroundColor: 'rgba(0,0,0, 0.8)',
    ...padding(0, 25, 0, 10),
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
