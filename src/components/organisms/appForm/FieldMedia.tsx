import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';
import {FieldTitle} from '../../molecules';
import {ErrorMessage} from 'formik';
import ImageUpload from '../ui/Image/ImageUpload';

type FieldMediaProps = {
  isRequired?: boolean;
  name: string;
  title: string;
  subTitle: string;
  defaultUri?: string;
  onChange: (_: any) => void;
};

const FieldMedia = (props: FieldMediaProps) => {
  const {
    isRequired = false,
    subTitle,
    name,
    title,
    onChange = _ => {},
    defaultUri,
  } = props;
  return (
    <View style={styles.container}>
      <FieldTitle isRequired={isRequired} title={title} />
      <View style={styleSheet.center}>
        <ImageUpload
          defaultUri={defaultUri}
          onChange={onChange}
          width={158}
          height={158}
          shape="circle"
        />
        <Text style={styles.subtitle}>{subTitle}</Text>
      </View>
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name={name} />
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  subtitle: {
    ...styleSheet.textStyleBasic,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default FieldMedia;
