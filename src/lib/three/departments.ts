import { keplerSpeed, type OrbitSpec } from './math';

/** The six departments, in orbit order from the inside out. Accents are the spec values. */
export type DepartmentId = 'media' | 'academy' | 'club' | 'labs' | 'mazal' | 'commune';

export interface DepartmentBody {
  readonly id: DepartmentId;
  /** Brand accent (spec section 2). Commune is strictly white. */
  readonly accent: string;
  readonly orbit: OrbitSpec;
}

const SPEED_SCALE = 1.1;
const MINOR_RATIO = 0.8;

function orbit(semiMajor: number, tiltX: number, tiltZ: number, phase: number): OrbitSpec {
  return {
    semiMajor,
    semiMinor: semiMajor * MINOR_RATIO,
    tiltX,
    tiltZ,
    phase,
    angularSpeed: keplerSpeed(semiMajor, SPEED_SCALE),
  };
}

export const DEPARTMENT_BODIES: readonly DepartmentBody[] = [
  { id: 'media', accent: '#b0e62f', orbit: orbit(3.4, 0.35, 0.15, 0) },
  { id: 'academy', accent: '#C8F048', orbit: orbit(4.2, -0.5, 0.3, 1.1) },
  { id: 'club', accent: '#c6f24e', orbit: orbit(5.0, 0.8, -0.25, 2.2) },
  { id: 'labs', accent: '#caf14a', orbit: orbit(5.8, -0.2, 0.5, 3.4) },
  { id: 'mazal', accent: '#C0F030', orbit: orbit(6.6, 0.55, -0.45, 4.5) },
  { id: 'commune', accent: '#ffffff', orbit: orbit(7.4, -0.7, 0.1, 5.6) },
];

export function departmentIndex(id: string): number {
  return DEPARTMENT_BODIES.findIndex((body) => body.id === id);
}
