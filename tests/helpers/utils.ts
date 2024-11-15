export function convertStringToNumber(stringText: string) {
  return Number(stringText.replace(/[^0-9.-]+/g, ''));
}
