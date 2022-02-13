import { hash } from 'bcrypt';

import { CompanyUser } from '../company-user';

export async function validatePassword(
  this: CompanyUser,
  plainPassword: string,
): Promise<boolean> {
  const { salt, hash: hashedPassword } = this.password;
  let generatedHash = '';
  try {
    generatedHash = await hash(plainPassword, salt);
  } catch (e) {
    console.log(e);
  }
  return generatedHash === hashedPassword;
}
