import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {NEWS} from 'src/api/news/type.d';
import {getNews} from 'src/api/news/actions';
import {SCREEN} from 'src/help';
import ImageUri from 'src/components/organisms/ui/Image/ImageUri';
import {Colors} from 'src/styles';
import {Image} from 'react-native';
import {ICON} from 'src/assets';
import {boxShadow} from 'src/styles/mixins';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import SearchText from 'src/components/organisms/fields/searchText';
import {RouteProp} from '@react-navigation/native';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Props = {
  route?: RouteProp<{
    params: {
      title: 'news' | 'video';
    };
  }>;
};

const News = (props: Props) => {
  const {t} = useTranslation();
  const [news, setNews] = useState<NEWS.Response.News[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const {} = props;
  const {params} = props.route || {};

  useEffect(() => {
    setLoading(true);
    getNews({type: params?.title})
      .then(res => {
        setNews(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({item}: {item: NEWS.Response.News}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          RootNavigation.navigate(
            item.type === 'news'
              ? SCREEN_NAME.NEWS_DETAILS
              : SCREEN_NAME.PLAY_VIDEO,
            {id: item.id},
          )
        }>
        <ImageUri uri={item.image} style={styles.image} />
        {item.type === 'video' && (
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: SCREEN.width - 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={ICON['play']} style={{height: 64, width: 64}} />
          </View>
        )}
        <View style={styles.imageContent}>
          <Text
            style={[
              styleSheet.textStyleBold,
              {color: Colors.WHITE, marginBottom: 15, width: '100%'},
            ]}>
            {item.title}
          </Text>
          <Text style={[styleSheet.textStyleBasic, {color: Colors.WHITE}]}>
            {new Date(item.createDate).toLocaleDateString('vi-VN')}
            {item.time && '- ' + item.time + 's'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemCard = ({item}: {item: NEWS.Response.News}) => {
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() =>
          RootNavigation.navigate(SCREEN_NAME.NEWS_DETAILS, {id: item.id})
        }>
        <View style={styles.itemCardContent}>
          <ImageUri uri={item.image} style={styles.itemCardImage} />
          {item.type === 'video' && (
            <View
              style={{
                position: 'absolute',
                height: 90,
                width: 90,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={ICON['play']} style={{height: 30, width: 30}} />
            </View>
          )}
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Text numberOfLines={3} style={styleSheet.textStyleBold}>
              {item.title}
            </Text>
            <Text style={styleSheet.textStyleBasic}>
              {new Date(item.createDate).toLocaleDateString('vi-VN')}{' '}
              {item.time && '- ' + item.time + 's'}
            </Text>
          </View>
        </View>
        <IconFigma name="arrow_r" />
      </TouchableOpacity>
    );
  };
  return (
    <AppContainer
      title={t(params?.title || '')}
      headerRight={
        <TouchableOpacity
          disabled
          // onPress={() => setIsVisible(true)}
          style={{
            alignItems: 'center',
            width: 30,
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Icon name="search1" size={20} />
        </TouchableOpacity>
      }>
      <ScrollViewKeyboardAvoidView
        scrollViewProps={{
          style: styles.container,
        }}>
        {loading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: SCREEN.height - 150,
            }}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <Text style={[styleSheet.textStyleBold, {marginBottom: 15}]}>
              {t('outstanding')}
            </Text>
            <FlatList
              horizontal
              data={news}
              renderItem={renderItem}
              pagingEnabled
            />
            <Text style={[styleSheet.textStyleBold, {marginVertical: 15}]}>
              {t('lasted')}
            </Text>
            {news
              .filter(f => f.title?.includes(searchKey))
              .map((m, i) => {
                return <ItemCard item={m} key={i} />;
              })}
          </>
        )}
      </ScrollViewKeyboardAvoidView>
      <CustomModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onBackdropPressOnclose
        justifyContent="flex-start">
        <SearchText autoFocus onChangeText={val => setSearchKey(val)} />
      </CustomModal>
    </AppContainer>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingTop: 20,
    width: '100%',
  },
  item: {
    width: SCREEN.width - 20,
    position: 'relative',
    height: SCREEN.width - 40,
  },
  image: {
    position: 'absolute',
    height: SCREEN.width - 40,
    width: SCREEN.width - 40,
    padding: 20,
    borderRadius: 8,
  },
  imageContent: {
    height: '100%',
    justifyContent: 'flex-end',
    padding: 15,
    flexWrap: 'wrap',
    width: SCREEN.width - 60,
  },
  itemCard: {
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    marginRight: 20,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.GRAY_03,
    ...boxShadow(Colors.BLACK),
    ...styleSheet.listSpace,
  },
  itemCardImage: {
    height: 90,
    width: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  itemCardContent: {
    flex: 1,
    flexDirection: 'row',
  },
});
