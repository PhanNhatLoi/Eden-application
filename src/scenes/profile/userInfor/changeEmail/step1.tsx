import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {Colors} from 'src/styles';
import {ChangeEmailBodyRequest} from 'src/api/auth/type';

type Props = {
  value: ChangeEmailBodyRequest;
  onSubmit?: (value: {timeCount: number}) => void;
};
const Step1 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styleSheet.textStyleBasic}>{t('email_address')}</Text>
        <Text style={styleSheet.textStyleBasic}>{value.email}</Text>
      </View>

      <SpinButton
        isLoading={loading}
        title={t('change_email')}
        colorSpiner={Colors.SYS_BUTTON}
        buttonProps={{
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              // hard cdoe sent otp change phone or email
              setLoading(false);
              onSubmit({timeCount: 295}); // hard code timeCount otp
            }, 1000);
          },
          style: styleSheet.buttonPrimaryStyle,
        }}
        titleProps={{
          style: styleSheet.buttonPrimaryText,
        }}
      />
    </View>
  );
};

export default Step1;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 45,
  },
  container: {
    padding: 20,
  },
});
