export const formatDecimal = (number: string | number): string => {
  const numberFormat = new Intl.NumberFormat('de-DE');
  return Number(number)
    ? numberFormat.format(Number(number)).toString()
    : Number(number) === 0
    ? (number && number.toString()) || ''
    : '';
};
