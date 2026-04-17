type VecLike = { x: number; y: number } | ArrayLike<number>;

export default class Vector2 {
  private _v: Float32Array;

  constructor(x: number = 0, y: number = 0) {
    this._v = new Float32Array(2);
    this._v[0] = x;
    this._v[1] = y;
  }

  get x(): number {
    return this._v[0];
  }

  set x(val: number) {
    this._v[0] = val;
  }

  get y(): number {
    return this._v[1];
  }

  set y(val: number) {
    this._v[1] = val;
  }

  add(v: Vector2): this {
    this._v[0] += v.x;
    this._v[1] += v.y;
    return this;
  }

  scale(s: number): this {
    this._v[0] *= s;
    this._v[1] *= s;
    return this;
  }

  length(): number {
    return Math.hypot(this._v[0], this._v[1]);
  }

  normalize(): this {
    const len = this.length();
    if (len !== 0) {
      this.scale(1 / len);
    }
    return this;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  toArray(): Float32Array {
    return this._v;
  }

  // --------- Static helpers ---------

  static fromPoints(a: VecLike, b: VecLike): Vector2 {
    const ax = "x" in a ? a.x : a[0];
    const ay = "y" in a ? a.y : a[1];
    const bx = "x" in b ? b.x : b[0];
    const by = "y" in b ? b.y : b[1];

    return new Vector2(bx - ax, by - ay);
  }

  static distance(a: VecLike, b: VecLike): number {
    const dx = ("x" in b ? b.x : b[0]) - ("x" in a ? a.x : a[0]);
    const dy = ("y" in b ? b.y : b[1]) - ("y" in a ? a.y : a[1]);
    return Math.hypot(dx, dy);
  }
}
