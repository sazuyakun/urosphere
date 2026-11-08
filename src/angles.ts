// The signed angle (radians) to turn from `from` to `to` the short way round,
// between -pi and pi.
export function shortestAngleDelta(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}
