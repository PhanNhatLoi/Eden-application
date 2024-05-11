import * as React from 'react';

export const isReadyRef = React.createRef<boolean | null>();

export const navigationRef = React.createRef<any>();

export function navigate(name: string, params?: object | undefined) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
export function goBack() {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.goBack();
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
export function replace(name: String, params: object) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef?.current?.replace(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
export function push(name: String, params: object) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current?.push(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
export function getParent() {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current?.getParent();
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
export function dispatch(action: any) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(action);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
export function popToTop() {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.reset();
    console.log(
      '🚀 ~ file: RootNavigation.js ~ line 63 ~ popToTop ~ navigationRef.current',
      navigationRef.current,
    );
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
