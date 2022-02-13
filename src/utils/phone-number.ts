export const formatPhoneNumber = (phoneNumber: string) => {
  const formattedPhoneNumber = phoneNumber.trim().replace(/\s/g, '');

  return formattedPhoneNumber;
};
