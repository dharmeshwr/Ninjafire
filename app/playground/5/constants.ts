export const ANIMATION_OPTIONS = [
  { label: "Off", value: "off" },
  { label: "X-axis", value: "xaxis" },
  { label: "Y-axis", value: "yaxis" },
  { label: "Diagonal", value: "diagonal" },
  { label: "3D", value: "3d" },
] as const;

export const DEFAULT_CONFIG = {
  scale: 0.001,
  cellSize: 40,
  radius: 5,
  showGrid: false,
  animated: ANIMATION_OPTIONS[0].value,
  fieldSpeed: 0.0005,
  particleSpeed: 5,
  showParticles: true,
  particleCount: 100,
} as const;

export const GRID_COLOR = "#ebddb244";
export const ARROW_COLOR = "#ebddb2";
export const PARTICLE_COLOR = "#ffffff";
