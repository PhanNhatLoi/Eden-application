// import {
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {RouteProp} from '@react-navigation/native';
// import {AppContainer} from 'src/components/organisms';
// import Icon from 'react-native-vector-icons/AntDesign';
// import {useTranslation} from 'react-i18next';
// import {getNewsDetails} from 'src/api/news/actions';
// import {NEWS} from 'src/api/news/type.d';
// import {Colors} from 'src/styles';
// import ImageUri from 'src/components/organisms/ui/Image/ImageUri';
// import {SCREEN} from 'src/help';
// import {padding} from 'src/styles/mixins';
// import {styleSheet} from 'src/styles/styleSheet';
// import {WebView} from 'react-native-webview';

// type Props = {
//   route?: RouteProp<{
//     params: {
//       id: number;
//     };
//   }>;
// };
// const NewsDetails = (props: Props) => {
//   const {t} = useTranslation();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadingContent, setLoadingContent] = useState<boolean>(false);
//   const [news, setNews] = useState<NEWS.Response.News>();
//   const {params} = props.route || {};

//   useEffect(() => {
//     setLoading(true);
//     params?.id &&
//       getNewsDetails(params?.id)
//         .then(res => {
//           setNews(res);
//         })
//         .catch(err => console.log(err))
//         .finally(() => setLoading(false));
//   }, []);
//   return (
//     <AppContainer
//       title={t('news')}
//       // headerRight={
//       //   <TouchableOpacity
//       //     style={{
//       //       alignItems: 'center',
//       //       width: 30,
//       //       justifyContent: 'center',
//       //       marginTop: 10,
//       //     }}>
//       //     <Icon name="search1" size={20} />
//       //   </TouchableOpacity>
//       // }
//     >
//       {loading ? (
//         <View style={styles.container}>
//           <ActivityIndicator color={Colors.SYS_BUTTON} />
//         </View>
//       ) : (
//         <View>
//           <ImageUri
//             uri={news?.image}
//             style={{width: SCREEN.width, height: SCREEN.height * 0.3}}
//             resizeMode="cover"
//           />
//           <View style={styles.content}>
//             <View>
//               <Text style={[styleSheet.textStyleBold, {marginBottom: 10}]}>
//                 {news?.title}
//               </Text>
//               <Text
//                 style={[
//                   styleSheet.textStyleBasic,
//                   {marginBottom: 10, fontSize: 10},
//                 ]}>
//                 {(news &&
//                   new Date(news.createDate).toLocaleDateString('vi-VN')) ||
//                   t('no_data')}
//               </Text>
//             </View>
//             <ScrollView
//               contentContainerStyle={{
//                 height: SCREEN.height * 0.55,
//                 justifyContent: 'center',
//               }}>
//               {loadingContent && (
//                 <ActivityIndicator color={Colors.SYS_BUTTON} />
//               )}
//               <WebView
//                 onLoadStart={() => setLoadingContent(true)}
//                 onLoadEnd={() => setLoadingContent(false)}
//                 source={{
//                   html: `<div style="font-size: 45; text-align:justify">${news?.content}<div>`,
//                 }}
//               />
//             </ScrollView>
//           </View>
//         </View>
//       )}
//     </AppContainer>
//   );
// };

// export default NewsDetails;

// const styles = StyleSheet.create({
//   container: {
//     height: '100%',
//     paddingHorizontal: 20,
//     justifyContent: 'center',
//   },
//   content: {
//     borderRadius: 8,
//     marginHorizontal: 20,
//     backgroundColor: Colors.WHITE,
//     ...padding(15, 30, 20, 20),
//     width: SCREEN.width - 40,
//     top: SCREEN.height * 0.22,
//     position: 'absolute',
//   },
// });

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const NewsDetails = () => {
  return (
    <View>
      <Text>NewsDetails</Text>
    </View>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({});
