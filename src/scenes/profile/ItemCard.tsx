import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import IconAnt from 'react-native-vector-icons/AntDesign';

export type itemType = {
  id: number;
  title: string;
  label: string;
  onPress: () => void;
  disable?: boolean;
  loading?: boolean;
};

const renderItem = ({item}: {item: itemType}) => {
  return item.disable ? (
    <View style={styles.cardItem}>
      <View style={styles.itemContent}>
        <Text style={styleSheet.textStyleBasic}>{item.title}</Text>
        <Text style={{...styleSheet.textStyleBasic, color: Colors.GRAY_DARK}}>
          {item.label}
        </Text>
      </View>
    </View>
  ) : (
    <TouchableOpacity
      disabled={item.loading}
      style={styles.cardItem}
      onPress={item.onPress}>
      <View style={styles.itemContent}>
        <Text style={styleSheet.textStyleBasic}>{item.title}</Text>
        {item.loading ? (
          <ActivityIndicator color={Colors.SYS_BUTTON} />
        ) : (
          <Text
            numberOfLines={1}
            style={[styleSheet.textStyleBold, {maxWidth: '50%'}]}>
            {item.label}
          </Text>
        )}
      </View>
      {/* <Image source={ICON['arrow_r']} /> */}
      <IconAnt name="right" size={20} color={Colors.BLACK} />
    </TouchableOpacity>
  );
};

export default renderItem;
const styles = StyleSheet.create({
  cardItem: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopColor: Colors.GRAY_LIGHT,
    borderTopWidth: 0.5,
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
});
