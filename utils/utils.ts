export function isEmpty(o: object) {
  const keys = Object.keys(o);
  if (keys.length <= 0) return true;
  return false;
}
