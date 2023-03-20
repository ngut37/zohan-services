import { hash } from 'bcrypt';

import { Staff } from '../staff';

export async function validatePassword(
  this: Staff,
  plainPassword: string,
): Promise<boolean> {
  const { salt, hash: hashedPassword } = this.password;
  let generatedHash = '';
  try {
    generatedHash = await hash(plainPassword, salt);
  } catch (error) {
    console.log(error);
  }
  return generatedHash === hashedPassword;
}
