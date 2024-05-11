import * as React from 'react';
import {Animated, ViewStyle} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
type SwipeableViewProps = {
  children: React.ReactNode;
  swipeViewStyle?: ViewStyle;
  swipeChildren: React.ReactNode;
  onPressSwipeView?: () => void;
};

const SwipeableView = (props: SwipeableViewProps) => {
  const {children, swipeViewStyle, swipeChildren, onPressSwipeView} = props;
  const swipRef = React.useRef(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const opacity = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton
        style={swipeViewStyle}
        onPress={() => {
          onPressSwipeView?.();
          (swipRef?.current as any)?.close();
        }}>
        <Animated.View style={{opacity}}>{swipeChildren}</Animated.View>
      </RectButton>
    );
  };
  return (
    <Swipeable ref={swipRef} renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  );
};
export default SwipeableView;
