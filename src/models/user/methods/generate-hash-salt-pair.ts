import { genSalt, hash } from 'bcrypt';

import { User } from '../user';

export async function assignHashSaltPair(
  this: User,
  plainPassword: string,
): Promise<void> {
  try {
    const salt = await genSalt();
    const hashedPassword = await hash(plainPassword, salt);

    this.password = { hash: hashedPassword, salt };
  } catch (e) {
    console.error(e);
  }
}
