// In App.js in a new project
import * as React from 'react';
import AppNavigator from './app-navigator';
import AuthNavigator from './auth-navigator';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import {RootState} from 'src/state/store';
import {isReadyRef, navigationRef} from './root-navigator';

function ContainNavigator() {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [isLogin, setIsLogin] = React.useState<boolean>(false);
  React.useEffect(() => {
    setIsLogin(Boolean(token));
  }, [token]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        RNBootSplash.hide();
        isReadyRef.current = true;
      }}>
      {/* {isLogin ? <AppNavigator /> : <AuthNavigator />} */}
      <AppNavigator />
    </NavigationContainer>
  );
}

export default ContainNavigator;
