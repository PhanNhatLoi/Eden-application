import {
  ActivityIndicator,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SCREEN} from 'src/help';
import SearchText from '../fields/searchText';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';

type Props = {
  children: React.ReactNode;
  scrollViewProps?: ScrollViewProps;
  bottomButton?: React.ReactNode;
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  headerHeight?: number;
  onContentSizeChange?: (w: number, h: number, ref?: ScrollView | null) => void;
  searchButton?: {
    placehoder?: string;
    onChangeText: (val: string) => void;
  };
  fixedButton?: {
    button: React.ReactNode;
    top?: number;
    bottom?: number;
    rigth?: number;
    left?: number;
  };
  typeKeyBoard?: 'number' | 'text';
  loading?: boolean; // animation loading form when didmount components
};
const ScrollViewKeyboardAvoidView = (props: Props) => {
  const {
    children,
    scrollViewProps = {},
    bottomButton = <></>,
    keyboardShouldPersistTaps = 'handled',
    headerHeight = 60,
    onContentSizeChange = () => {},
    searchButton,
    fixedButton,
    loading = false,
  } = props;

  const defaultHeight = SCREEN.height - headerHeight;
  const [screenHeight, setScreenHeight] = React.useState<number>(defaultHeight);
  const [scrollViewRef, setScrollViewRef] = React.useState<ScrollView | null>();

  const {t} = useTranslation();

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      e => {
        setScreenHeight(defaultHeight - e.endCoordinates.height);
      },
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setScreenHeight(defaultHeight);
      },
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        height: screenHeight,
      }}>
      {searchButton && (
        <View style={{marginVertical: 10, paddingHorizontal: 20}}>
          <SearchText
            placeholder={t(searchButton.placehoder || 'search').toString()}
            onChangeText={value => {
              searchButton.onChangeText(value);
            }}
          />
        </View>
      )}

      <ScrollView
        ref={ref => {
          setScrollViewRef(ref);
        }}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...scrollViewProps}
        onContentSizeChange={(w: number, h: number) => {
          onContentSizeChange(w, h, scrollViewRef);
        }}>
        {loading ? (
          <View
            style={{
              height: screenHeight,
              width: SCREEN.width - 40,
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={40} color={Colors.SYS_BUTTON} />
          </View>
        ) : (
          children
        )}
      </ScrollView>

      {bottomButton}
      {fixedButton && (
        <View
          style={{
            position: 'absolute',
            top: fixedButton.top,
            bottom: fixedButton.bottom,
            right: fixedButton.rigth,
            left: fixedButton.left,
          }}>
          {fixedButton.button}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScrollViewKeyboardAvoidView;

const styles = StyleSheet.create({});
