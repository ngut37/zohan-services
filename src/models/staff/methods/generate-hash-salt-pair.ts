import { genSalt, hash } from 'bcrypt';

import { Staff } from '../staff';

export async function assignHashSaltPair(
  this: Staff,
  plainPassword: string,
): Promise<void> {
  try {
    const salt = await genSalt();
    const hashedPassword = await hash(plainPassword, salt);

    this.password = { hash: hashedPassword, salt };
  } catch (error) {
    console.error(error);
  }
}
