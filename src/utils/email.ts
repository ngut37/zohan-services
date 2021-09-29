export const periodsInEmailOptionalRegex = (email: string): RegExp => {
  const matchDotsRegex = new RegExp(/\.(?=.*?@\w*\.\w*)/g);
  const stringifiedRegex = email.replace(matchDotsRegex, '(.)?');

  return new RegExp(stringifiedRegex, 'ig');
};

export const generateEmailRegex = (email: string): RegExp => {
  const isGmail = /@gmail\.com/gi.test(email);
  if (isGmail) return periodsInEmailOptionalRegex(email);
  return new RegExp(`^${email}$`, 'ig');
};
