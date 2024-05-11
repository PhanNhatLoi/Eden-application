type formatPhoneType = {
  value: string;
  label: string;
  labelHidden: string;
};
export const formatPhoneNumner = (phone: string): formatPhoneType => {
  let newPhone = phone.split(' ').join('').replace('+', '');
  if (newPhone[0] === '8' && newPhone[1] === '4') newPhone = newPhone.slice(2);
  if (newPhone[0] === '0') newPhone = newPhone.slice(1);
  return {
    value: '0' + newPhone,
    label: '+ 84 ' + newPhone,
    labelHidden: '+ 84 ' + newPhone[0] + ' *** ' + newPhone.slice(5),
  };
};
