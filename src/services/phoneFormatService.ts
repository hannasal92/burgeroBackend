export function formatPhoneNumber(localNumber: any) {
  if (!localNumber) return "";
  // Remove leading 0 and add +972
  if (localNumber.startsWith("0")) {
    return "+972" + localNumber.slice(1);
  }
  return localNumber; // already in correct format
}


