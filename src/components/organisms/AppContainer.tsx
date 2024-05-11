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
import * as RootNavigation from 'src/navigations/root-navigator';
import {IMAGE} from 'src/assets';
import {SCREEN} from 'src/help';
import Spiner from './ui/Spiner';
type AppContainerProps = {
  children?: React.ReactNode;
  headerRight?: React.ReactNode;
  title?: String | React.ReactNode;
  showBackBtn?: Boolean;
  borderBottom?: boolean;
  onGoBack?: () => void;
};

const AppContainer = (props: AppContainerProps) => {
  const {
    showBackBtn = true,
    children = null,
    title = '',
    headerRight = null,
    borderBottom = true,
    onGoBack = () => {
      RootNavigation.goBack();
    },
  } = props;

  return (
    <Background>
      {/* <Spiner loading={true} /> */}
      {/* <ImageBackground
        source={IMAGE.APP_BACKGROUND}
        style={{flex: 1, height: SCREEN.height + 100}}> */}
      <View style={styles.header}>
        {showBackBtn ? (
          <TouchableOpacity onPress={onGoBack}>
            <MaterialIcons name="west" size={30} color={Colors.BLACK_ARROW} />
          </TouchableOpacity>
        ) : (
          <View style={{width: 30}}></View>
        )}

        <Text style={styles.titleHeader}>{title}</Text>
        {headerRight ? headerRight : <View style={{width: 30}}></View>}
      </View>
      {borderBottom && <View style={styles.line}></View>}
      {children}
      {/* </ImageBackground> */}
    </Background>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
  },
  line: {
    borderTopColor: Colors.GRAY_LINE,
    borderTopWidth: 1,
  },
  titleHeader: {
    ...styleSheet.textStyleBold,
    fontSize: 16,
  },
});

export default AppContainer;
