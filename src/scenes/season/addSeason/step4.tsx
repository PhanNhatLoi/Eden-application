// import * as React from 'react';
// import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {useTranslation} from 'react-i18next';
// import {styleSheet} from 'src/styles/styleSheet';
// import {ErrorMessage, Formik} from 'formik';
// import * as yup from 'yup';
// import {SCREEN} from 'src/help';
// import {FieldTitle, StepButton} from 'src/components/molecules';
// import {SEASON} from 'src/api/season/type.d';
// import {
//   FieldTextInputWithUnit,
//   ScrollViewKeyboardAvoidView,
// } from 'src/components/organisms';
// import MultipeClassifications from '../components/MultipeClassification';
// import Octicons from 'react-native-vector-icons/Octicons';
// import {Colors} from 'src/styles';
// import {last} from 'lodash';

// type Step4Props = {
//   onSubmit?: (value: {
//     seedDensity: {value: number | null; unitId: number | null};
//     classifications: SEASON.Request.Classifications[];
//   }) => void;
//   value: SEASON.Request.Season;
//   onSave: (value: {
//     seedDensity: {value: number; unitId: number | null};
//     classifications: SEASON.Request.Classifications[];
//   }) => void;
// };

// const Step4 = (props: Step4Props) => {
//   const {onSubmit = _ => {}, value, onSave} = props;
//   const {t} = useTranslation();
//   const defaultClassification: SEASON.Request.Classifications = {
//     typeId: null,
//     value: null,
//   };
//   const schema = yup.object().shape({
//     value: yup
//       .number()
//       .moreThan(0, t('more_than_value_0').toString())
//       .required(() => t('required_field')),
//     unitId: yup.string().required(() => t('required_field')),
//     classificationsSumValue: yup
//       .number()
//       .max(100, t('maximum_value_').toString() + '100%')
//       .min(100, t('value_is_').toString() + '100%'),
//   });

//   const sumValue = (
//     classifications: SEASON.Request.Classifications[],
//     index: number,
//   ): number => {
//     if (classifications.length === 0) return 0;
//     if (index === classifications.length - 1)
//       return classifications[classifications.length - 1]?.value || 0;
//     return (
//       sumValue(classifications, index + 1) +
//       (classifications[index]?.value || 0)
//     );
//   };

//   return (
//     <Formik
//       initialValues={{
//         value: value.seedDensity.value || '',
//         unitId: value.seedDensity.unitId || null,
//         classifications: (value.classifications.length &&
//           value.classifications) || [defaultClassification],
//         classificationsSumValue: sumValue(value.classifications, 0),
//       }}
//       onSubmit={values => {
//         onSubmit({
//           seedDensity: {
//             value: (values.unitId && Number(values.value)) || null,
//             unitId: (values.unitId && Number(values.unitId)) || null,
//           },
//           classifications: values.classifications,
//         });
//       }}
//       validationSchema={schema}>
//       {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
//         <>
//           <ScrollViewKeyboardAvoidView
//             scrollViewProps={{
//               style: styles.container,
//             }}
//             onContentSizeChange={(w, h, ref) => {
//               ref?.scrollToEnd();
//             }}
//             bottomButton={
//               <>
//                 {last(values.classifications)?.typeId &&
//                 last(values.classifications)?.value &&
//                 values.classificationsSumValue < 100 ? (
//                   <View
//                     style={{
//                       alignItems: 'flex-end',
//                       width: '100%',
//                       paddingHorizontal: 20,
//                     }}>
//                     <TouchableOpacity
//                       onPress={() => {
//                         setFieldValue('classifications', [
//                           ...values.classifications,
//                           defaultClassification,
//                         ]);
//                       }}>
//                       <Octicons
//                         name="diff-added"
//                         size={25}
//                         color={Colors.GRAY_DARK}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   values.classifications.length > 1 && (
//                     <View
//                       style={{
//                         alignItems: 'flex-end',
//                         width: '100%',
//                         paddingHorizontal: 20,
//                       }}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           setFieldValue(
//                             'classifications',
//                             values.classifications.filter(
//                               f => f !== last(values.classifications),
//                             ),
//                           );
//                         }}>
//                         <Octicons
//                           name="diff-removed"
//                           size={25}
//                           color={Colors.GRAY_DARK}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   )
//                 )}
//                 <StepButton
//                   subTitile={t('addSeason4Info')}
//                   disableLeft={false}
//                   disableRight={false}
//                   onPressRight={handleSubmit}
//                   onPressLeft={() =>
//                     onSave({
//                       seedDensity: {
//                         value: Number(values.value),
//                         unitId:
//                           (values.unitId && Number(values.unitId)) || null,
//                       },
//                       classifications: values.classifications,
//                     })
//                   }
//                 />
//               </>
//             }>
//             <FieldTextInputWithUnit
//               title={t('classDistributionDensity')}
//               name="value"
//               unit="DENSITY"
//               autoFocus={!values.value}
//               defaultUnitValue={value.seedDensity.unitId || undefined}
//               onChangeUnit={unit => setFieldValue('unitId', unit)}
//               textInputProps={{
//                 onChangeText: handleChange('value'),
//                 placeholder: t('classDistributionDensity').toString(),
//                 keyboardType: 'decimal-pad',
//                 defaultValue:
//                   (values.value && values.value.toString()) || undefined,
//               }}
//             />
//             <View>
//               <FieldTitle title={t('allotment')} isRequired={true} />
//               <MultipeClassifications
//                 totalValue={values.classificationsSumValue}
//                 data={values.classifications}
//                 onChangeItem={items => {
//                   setFieldValue('classifications', items);
//                   let classificationsSumValue = 0;
//                   items.map(m => {
//                     if (m.value) classificationsSumValue += m.value;
//                   });
//                   setFieldValue(
//                     'classificationsSumValue',
//                     classificationsSumValue,
//                   );
//                 }}
//               />
//               <View
//                 style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                 <Text style={styleSheet.errorTextStyle}>
//                   <ErrorMessage name="classificationsSumValue" />
//                 </Text>
//               </View>
//             </View>
//           </ScrollViewKeyboardAvoidView>
//         </>
//       )}
//     </Formik>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingTop: 15,
//     flex: 1,
//   },
//   filedText: {
//     ...styleSheet.filedText,
//     // width: SCREEN.width - 40 - 100 - 10,
//     marginRight: 10,
//   },
//   filedTextUnit: {
//     ...styleSheet.filedText,
//     width: 100,
//   },
//   dropDownContainerStyle: {
//     ...styleSheet.filedText,
//     width: 100,
//     height: 150,
//   },
//   bottomTab: {
//     width: SCREEN.width,
//     alignItems: 'center',
//   },
// });

// export default Step4;
