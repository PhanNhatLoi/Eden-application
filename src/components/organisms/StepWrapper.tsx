import * as React from 'react';
import Background from '../molecules/Background';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';
type StepObj = {
  title?: String;
  content: React.ReactNode;
};
type StepWrapperProps = {
  headerRight?: React.ReactNode;
  showBackBtn?: Boolean;
  stepList: StepObj[];
  step: number;
  onGoBack?: () => void;
};

const StepWrapper = (props: StepWrapperProps) => {
  const {
    showBackBtn = true,
    headerRight = null,
    stepList = [],
    step = 0,
    onGoBack = () => {},
  } = props;
  if (stepList[step]?.title) {
    return (
      <Background>
        <View style={styles.header}>
          {showBackBtn ? (
            <TouchableOpacity onPress={onGoBack}>
              <MaterialIcons name="west" size={30} color={Colors.BLACK} />
            </TouchableOpacity>
          ) : (
            <MaterialIcons name="west" size={30} color={Colors.WHITE} />
          )}
          <Text style={styles.titleHeader}>{stepList[step]?.title}</Text>
          {headerRight ? (
            headerRight
          ) : (
            <MaterialIcons name="west" size={30} color={Colors.WHITE} />
          )}
        </View>
        <ScrollView contentContainerStyle={styles.children}>
          {stepList[step].content}
        </ScrollView>
      </Background>
    );
  } else {
    return (
      <Background withoutHeader={true}>
        <ScrollView contentContainerStyle={styles.children}>
          {stepList[step].content}
        </ScrollView>
      </Background>
    );
  }
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
    paddingBottom: 15,
  },
  children: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 15 : 0,
  },
  titleHeader: {
    ...styleSheet.textStyleBasic,
    fontSize: 16,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
});

export default StepWrapper;
