import * as React from 'react';
import Background from '../molecules/Background';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';
import {IMAGE} from 'src/assets';

type StepObj = {
  title?: String;
  content: React.ReactNode;
  bottomButton?: any;
};
type StepWrapperProps = {
  headerRight?: React.ReactNode;
  showBackBtn?: Boolean;
  headerContent?: React.ReactNode;
  stepList: StepObj[];
  step: number;
  onGoBack?: () => void;
  showHeader?: boolean;
  heightHeader?: number;
  hiddenHeaderLine?: boolean;
};

const StepWrapperL = (props: StepWrapperProps) => {
  const {
    showBackBtn = true,
    headerRight = null,
    headerContent,
    stepList = [],
    step = 0,
    showHeader = true,
    onGoBack = () => {},
    heightHeader = 40,
    hiddenHeaderLine = false,
  } = props;

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderBottomColor: Colors.GRAY_LINE,
      borderBottomWidth: hiddenHeaderLine ? 0 : 0.5,
      height: 50,
    },
    children: {
      // flex: 1,
      // paddingBottom: Platform.OS === 'android' ? 15 : 0,
    },
    titleHeader: {
      ...styleSheet.textStyleBold,
      fontSize: 16,
    },
    bottomTab: {
      width: SCREEN.width,
      alignItems: 'center',
    },
  });
  if (stepList[step]?.title) {
    return (
      <Background>
        {/* <ImageBackground
          source={IMAGE.APP_BACKGROUND}
          style={{flex: 1, height: SCREEN.height}}> */}
        <View style={{width: '100%', height: SCREEN.height}}>
          {showHeader && (
            <View style={styles.header}>
              {showBackBtn ? (
                <TouchableOpacity onPress={onGoBack}>
                  <MaterialIcons
                    name="west"
                    size={30}
                    color={Colors.BLACK_ARROW}
                  />
                </TouchableOpacity>
              ) : (
                <View style={{width: 30}}></View>
              )}
              <Text style={styles.titleHeader}>{stepList[step]?.title}</Text>
              {headerRight ? headerRight : <View style={{width: 30}}></View>}
            </View>
          )}
          {headerContent}
          {stepList[step].content}
          {/* </ImageBackground> */}
        </View>
      </Background>
    );
  } else {
    return (
      <Background withoutHeader={true}>
        <ImageBackground
          source={IMAGE.APP_BACKGROUND}
          style={{flex: 1, height: SCREEN.height}}>
          {stepList[step].content}
        </ImageBackground>
      </Background>
    );
  }
};

export default StepWrapperL;
