import React, {useEffect} from 'react';
import notifee, {
  AndroidImportance,
  EventDetail,
  EventType,
} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

const FCMlisteners = () => {
  const resetBadgeCount = async () => {
    //set badge 0
    await notifee.setBadgeCount(0);
  };

  useEffect(() => {
    resetBadgeCount();
    const getPermisstion = async () => {
      // Register the device with FCM
      // await messaging().registerDeviceForRemoteMessages();
      //get token device
      await messaging().getToken();
      // console.debug('token:', token);

      // get permisstion
      await notifee.requestPermission();
      // Create a channel (required for Android)
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };
    getPermisstion();
  }, []);

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        console.log(
          '🚀 ~ file: FCMlisteners.tsx:43 ~ FCMlisteners ~ notification:',
          notification,
        );
        //to do
      }
    });

  const onDisplayNotification = async (title?: string, body?: string) => {
    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  //listen notification on open app
  messaging().onMessage(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      onDisplayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
      );
      // Alert.alert(remoteMessage.notification.title);
    },
  );

  const backgroundEvent = async () => {
    await notifee.onBackgroundEvent(
      async (props: {type: EventType; detail: EventDetail}) => {
        const {notification, pressAction} = props.detail;

        if (props.type === EventType.DISMISSED) {
          console.debug('DISMISSED');
        }
        // Check if the user pressed the "Mark as read" action
        if (
          props.type === EventType.ACTION_PRESS &&
          pressAction?.id === 'mark-as-read'
        ) {
          // Remove the notification
          await notifee.cancelNotification(notification?.id || '');
        }
      },
    );
  };
  backgroundEvent();

  return <></>;
};

export default FCMlisteners;

//register background handler
export const backgroundMessageHandler = () =>
  messaging().setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log(
        '🚀 ~ file: FCMlisteners.tsx:106 ~ remoteMessage:',
        remoteMessage,
      );
      // await notifee.displayNotification()
      // Increment the count by 1
      await notifee
        .incrementBadgeCount()
        .then(
          async () =>
            await notifee
              .getBadgeCount()
              .then((count: number) =>
                console.log('Badge count incremented by 1 to: ', count),
              ),
        );
    },
  );
