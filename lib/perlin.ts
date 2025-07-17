interface Grad {
  x: number;
  y: number;
  z: number;
  dot2(x: number, y: number): number;
  dot3(x: number, y: number, z: number): number;
}

export class PerlinNoise {
  private grad3: Grad[] = [
    { x: 1, y: 1, z: 0 },
    { x: -1, y: 1, z: 0 },
    { x: 1, y: -1, z: 0 },
    { x: -1, y: -1, z: 0 },
    { x: 1, y: 0, z: 1 },
    { x: -1, y: 0, z: 1 },
    { x: 1, y: 0, z: -1 },
    { x: -1, y: 0, z: -1 },
    { x: 0, y: 1, z: 1 },
    { x: 0, y: -1, z: 1 },
    { x: 0, y: 1, z: -1 },
    { x: 0, y: -1, z: -1 },
  ].map((g) => ({
    x: g.x,
    y: g.y,
    z: g.z,
    dot2: (x: number, y: number) => g.x * x + g.y * y,
    dot3: (x: number, y: number, z: number) => g.x * x + g.y * y + g.z * z,
  }));

  private p: number[] = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];

  private perm: number[] = new Array(512);
  private gradP: Grad[] = new Array(512);

  constructor(seed: number = 0) {
    this.seed(seed);
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
  }

  public seed(seed: number): void {
    if (seed > 0 && seed < 1) {
      seed *= 65536;
    }
    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (let i = 0; i < 256; i++) {
      const v =
        i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }

  public perlin1(x: number): number {
    const X = Math.floor(x) & 255;
    x -= Math.floor(x);

    const n0 = this.gradP[X + this.perm[0]].dot2(x, 0);
    const n1 = this.gradP[X + 1 + this.perm[0]].dot2(x - 1, 0);

    return this.lerp(n0, n1, this.fade(x));
  }

  public perlin2(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);

    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);

    const u = this.fade(x);
    return this.lerp(
      this.lerp(n00, n10, u),
      this.lerp(n01, n11, u),
      this.fade(y),
    );
  }

  public perlin3(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const n000 = this.gradP[X + this.perm[Y + this.perm[Z]]].dot3(x, y, z);
    const n001 = this.gradP[X + this.perm[Y + this.perm[Z + 1]]].dot3(
      x,
      y,
      z - 1,
    );
    const n010 = this.gradP[X + this.perm[Y + 1 + this.perm[Z]]].dot3(
      x,
      y - 1,
      z,
    );
    const n011 = this.gradP[X + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(
      x,
      y - 1,
      z - 1,
    );
    const n100 = this.gradP[X + 1 + this.perm[Y + this.perm[Z]]].dot3(
      x - 1,
      y,
      z,
    );
    const n101 = this.gradP[X + 1 + this.perm[Y + this.perm[Z + 1]]].dot3(
      x - 1,
      y,
      z - 1,
    );
    const n110 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z]]].dot3(
      x - 1,
      y - 1,
      z,
    );
    const n111 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(
      x - 1,
      y - 1,
      z - 1,
    );

    const x0 = this.lerp(n000, n100, u);
    const x1 = this.lerp(n010, n110, u);
    const x2 = this.lerp(n001, n101, u);
    const x3 = this.lerp(n011, n111, u);

    const y0 = this.lerp(x0, x1, v);
    const y1 = this.lerp(x2, x3, v);

    return this.lerp(y0, y1, w);
  }
}
