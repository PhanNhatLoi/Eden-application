/*eslint-disable */
import {t} from 'i18next';
import * as yup from 'yup';

/** Regex Validation **/
export const isPhone =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
export const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;
export const isEmailOrPhone =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$|^[A-Z0-9._%-]+[+\w-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;
export const isPassword = /^(?!.* )/i;

/** Validation */
export const emailValidate = yup
  .string()
  .email(t('email_invalid').toString())
  .min(3, t('min_3_syms').toString())
  .max(50, t('max_50_syms').toString())
  .required(t('required_field').toString());
export const phoneValidate = yup
  .string()
  .matches(isPhone, t('Phone_number_is_not_valid').toString()) // "phone_invalid"
  .required(t('required_field').toString())
  .typeError(t('phone_invalid').toString());

export const phoneValidateWithCountryCode = yup
  .string()
  .length(9, t('Phone_number_is_not_valid').toString())
  .required(t('required_field').toString())
  .typeError(t('phone_invalid').toString());
export const phoneValidateNotRequired = yup
  .string()
  .matches(isPhone, t('Phone_number_is_not_valid').toString())
  .typeError(t('phone_invalid').toString());
export const passwordValidate = yup
  .string()
  .min(6, t('min_6_syms').toString())
  .max(50, t('max_50_syms').toString())
  .required(t('required_field').toString());
export const confirmPasswordValidate = yup
  .string()
  .required(t('required_field').toString())
  .when('password', {
    is: (val: string) => (val && val.length > 0 ? true : false),
    then: () =>
      yup.string().oneOf([yup.ref('password')], t('pass_not_match').toString()),
  });

export const otpValidate = yup
  .string()
  .length(6, t('exact_6_syms').toString())
  .required(t('required_field').toString());
export const requiredFieldValidate = yup
  .string()
  .required(t('required_field').toString());
export const arrayPhoneValidate = yup
  .array()
  .of(phoneValidate)
  .min(1, t('min_invite').toString());

export const arrayImagesValidate = yup
  .array()
  // .of(requiredFieldValidate)
  .min(1, t('min_image_upload').toString());

export const arrayValidateWithMessage = (message: string) =>
  yup.array().min(1, message);
