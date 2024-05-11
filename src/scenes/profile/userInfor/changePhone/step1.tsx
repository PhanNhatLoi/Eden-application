import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {formatPhoneNumner} from 'src/help/formatPhone';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {Colors} from 'src/styles';
import {ChangePhoneBodyRequest} from 'src/api/auth/type';

type Props = {
  value: ChangePhoneBodyRequest;
  onSubmit?: (value: {timeCount: number}) => void;
};
const Step1 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styleSheet.textStyleBasic}>{t('phone_number')}</Text>
        <Text style={styleSheet.textStyleBasic}>
          {formatPhoneNumner(value.phone).label}
        </Text>
      </View>

      <SpinButton
        isLoading={loading}
        title={t('change_phone_number')}
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
          style: styleSheet.buttonDefaultStyle,
        }}
        titleProps={{
          style: styleSheet.buttonDefaultText,
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
