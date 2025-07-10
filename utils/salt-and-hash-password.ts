import bcrypt from 'bcryptjs';

export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Strong but reasonably fast
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
