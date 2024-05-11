import {StyleSheet} from 'react-native';
import {Colors} from 'src/styles';
import {SCREEN} from 'src/help';
import {styleSheet} from 'src/styles/styleSheet';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
  },
  content: {
    paddingBottom: 20,
    width: '100%',
  },
  fieldTitle: {
    ...styleSheet.textStyleBasic,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },

  textCancle: {
    ...styleSheet.textStyleBold,
    fontSize: 16,
    color: Colors.CANCLE_BUTTON,
  },
  dot: {
    color: Colors.RED,
  },
  filedText: {
    ...styleSheet.textStyleBasic,
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderRadius: 8,
    width: SCREEN.width - 40,
    height: 100,
    marginTop: 10,
    borderColor: Colors.GRAY_MEDIUM,
    textAlignVertical: 'top',
  },
  filedTextUnit: {
    ...styleSheet.filedText,
    width: 100,
  },
  dropDownContainerStyle: {
    ...styleSheet.filedText,
    width: 100,
    height: 150,
  },
});
