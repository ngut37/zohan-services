export const generateEmailRegex = (email: string): RegExp => {
  const sanitizedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const optionalCharactersEmail = sanitizedEmail
    .replace(/\\\.(?=.*?@)/g, '\\.?')
    .replace(/\\\+(?=.*?@)/g, '\\+?');

  return new RegExp(`^${optionalCharactersEmail}$`, 'ig');
};
