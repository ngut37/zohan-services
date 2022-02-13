import { hash } from 'bcrypt';

import { User } from '../user';

export async function validatePassword(
  this: User,
  plainPassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  const { salt, hash: hashedPassword } = this.password;
  let generatedHash = '';
  try {
    generatedHash = await hash(plainPassword, salt);
  } catch (e) {
    console.log(e);
  }
  return generatedHash === hashedPassword;
}
