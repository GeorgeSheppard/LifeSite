/**
 * Distribution function that picks a number between min and max and makes n twice as likely as n+1
 * @param min
 * @param max 
 * @returns 
 */
export function weightedRandom(min: number, max: number) {
  return Math.round(max / (Math.random() * max + min));
}