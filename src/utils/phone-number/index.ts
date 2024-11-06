export const normalizePhoneNumber = (
  phoneNumber: string | undefined | null,
) => {
  if (!phoneNumber) return null;

  return phoneNumber.replace(/^00/, '+');
};
