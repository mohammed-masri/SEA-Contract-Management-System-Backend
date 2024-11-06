import * as bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword: string) =>
  await bcrypt.hash(plainPassword, 10);

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  const isCorrect = await bcrypt.compare(plainPassword, hashedPassword);

  return isCorrect;
};
