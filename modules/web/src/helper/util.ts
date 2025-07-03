export function convertKiToGTM(input: string): string {
  const GIGA = 1024 * 1024;
  const TERA = 1024 * 1024 * 1024;
  const MEGA = 1024;

  const value = parseInt(input.replace(/[^0-9]/g, ""), 10);

  if (value >= TERA) {
    return (value / TERA).toFixed(2) + "Ti";
  } else if (value >= GIGA) {
    return (value / GIGA).toFixed(2) + "Gi";
  } else if (value >= MEGA) {
    return (value / MEGA).toFixed(2) + "Mi";
  } else {
    return input;
  }
}
