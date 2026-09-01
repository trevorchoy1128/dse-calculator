/* FMLA:23 條內置公式(手冊 E-58~61)
   每條:{no, name, vars:[顯示名], calc(v,u) → [[結果名, 值], ...]} */
const FMLA = (() => {
  const PI = Engine.PI;
  const G_ACC = 9.80665;            // 標準重力加速度
  const EPS0 = 8.854187817e-12;     // 電常數 ε0
  const R_GAS = 8.314472;           // 氣體常數
  const ERR = () => new Engine.CalcError('Math ERROR');
  const r15 = Engine.r15;
  const rad = (x, u) => u === 'R' ? x : u === 'G' ? x * PI / 200 : x * PI / 180;

  // Hastings 估算:標準常態分佈
  function P_of(x) {
    if (x < 0 || x >= 1e50) throw ERR();
    const z = Math.exp(-x * x / 2) / Math.sqrt(2 * PI);
    const t = 1 / (1 + 0.2316419 * x);
    const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return r15(1 - z * poly);
  }

  return [
    { no: 1, name: 'QuadEquation', vars: ['a', 'b', 'c'],
      calc: v => {
        if (v.a === 0) throw ERR();
        const D = v.b * v.b - 4 * v.a * v.c;
        if (D < 0) throw ERR();
        const s = Math.sqrt(D);
        return [['x1', r15((-v.b + s) / (2 * v.a))], ['x2', r15((-v.b - s) / (2 * v.a))]];
      } },
    { no: 2, name: 'CosineTheorem', vars: ['b', 'c', 'θ'],
      calc: (v, u) => {
        if (v.b <= 0 || v.c <= 0) throw ERR();
        const a2 = v.b * v.b + v.c * v.c - 2 * v.b * v.c * Math.cos(rad(v['θ'], u));
        if (a2 < 0) throw ERR();
        return [['a', r15(Math.sqrt(a2))]];
      } },
    { no: 3, name: 'HeronFormula', vars: ['a', 'b', 'c'],
      calc: v => {
        if (!(v.a + v.b > v.c && v.b + v.c > v.a && v.c + v.a > v.b) || v.a <= 0 || v.b <= 0 || v.c <= 0) throw ERR();
        const s = (v.a + v.b + v.c) / 2;
        return [['S', r15(Math.sqrt(s * (s - v.a) * (s - v.b) * (s - v.c)))]];
      } },
    { no: 4, name: 'P(x)', vars: ['x'], calc: v => [['P', P_of(Math.abs(v.x))]] },
    { no: 5, name: 'Q(x)', vars: ['x'], calc: v => [['Q', r15(P_of(Math.abs(v.x)) - 0.5)]] },
    { no: 6, name: 'CoulombsLaw', vars: ['Q', 'q', 'r'],
      calc: v => {
        if (v.r <= 0) throw ERR();
        return [['F', r15(v.Q * v.q / (4 * PI * EPS0 * v.r * v.r))]];
      } },
    { no: 7, name: 'Resistance', vars: ['ρ', 'l', 'S'],
      calc: v => {
        if (v['ρ'] <= 0 || v.l <= 0 || v.S <= 0) throw ERR();
        return [['R', r15(v['ρ'] * v.l / v.S)]];
      } },
    { no: 8, name: 'MagneticForce', vars: ['I', 'B', 'l', 'θ'],
      calc: (v, u) => {
        if (v.l <= 0) throw ERR();
        return [['F', r15(v.I * v.B * v.l * Math.sin(rad(v['θ'], u)))]];
      } },
    { no: 9, name: 'RC Circuit', vars: ['V', 't', 'C', 'R'],
      calc: v => {
        if (v.C <= 0 || v.R <= 0 || v.t <= 0) throw ERR();
        return [['VR', r15(v.V * Math.exp(-v.t / (v.C * v.R)))]];
      } },
    { no: 10, name: 'VoltageGain', vars: ["E'", 'E'],
      calc: v => {
        if (v.E === 0 || v["E'"] / v.E <= 0) throw ERR();
        return [['G', r15(20 * Math.log10(v["E'"] / v.E))]];
      } },
    { no: 11, name: 'LRC Series', vars: ['R', 'f', 'L', 'C'],
      calc: v => {
        if (v.R <= 0 || v.f <= 0 || v.L <= 0 || v.C <= 0) throw ERR();
        const x = 2 * PI * v.f * v.L - 1 / (2 * PI * v.f * v.C);
        return [['Z', r15(Math.sqrt(v.R * v.R + x * x))]];
      } },
    { no: 12, name: 'LRC Parallel', vars: ['R', 'f', 'L', 'C'],
      calc: v => {
        if (v.R <= 0 || v.f <= 0 || v.L <= 0 || v.C <= 0) throw ERR();
        const x = 2 * PI * v.f * v.C - 1 / (2 * PI * v.f * v.L);
        return [['Z', r15(1 / Math.sqrt(1 / (v.R * v.R) + x * x))]];
      } },
    { no: 13, name: 'Oscillation', vars: ['L', 'C'],
      calc: v => {
        if (v.L <= 0 || v.C <= 0) throw ERR();
        return [['f1', r15(1 / (2 * PI * Math.sqrt(v.L * v.C)))]];
      } },
    { no: 14, name: 'DistanceDrop', vars: ['v1', 't'],
      calc: v => {
        if (v.t <= 0) throw ERR();
        return [['S', r15(v.v1 * v.t + G_ACC * v.t * v.t / 2)]];
      } },
    { no: 15, name: 'Pendulum', vars: ['l'],
      calc: v => {
        if (v.l <= 0) throw ERR();
        return [['T', r15(2 * PI * Math.sqrt(v.l / G_ACC))]];
      } },
    { no: 16, name: 'SpringPendul', vars: ['m', 'k'],
      calc: v => {
        if (v.m <= 0 || v.k <= 0) throw ERR();
        return [['T', r15(2 * PI * Math.sqrt(v.m / v.k))]];
      } },
    { no: 17, name: 'Doppler', vars: ['f1', 'v', 'v1', 'u'],
      calc: v => {
        if (v.v === v.v1 || v.f1 <= 0 || (v.v - v.u) / (v.v - v.v1) <= 0) throw ERR();
        return [['f', r15(v.f1 * (v.v - v.u) / (v.v - v.v1))]];
      } },
    { no: 18, name: 'IdealGas', vars: ['n', 'T', 'V'],
      calc: v => {
        if (v.n <= 0 || v.T <= 0 || v.V <= 0) throw ERR();
        return [['P', r15(v.n * R_GAS * v.T / v.V)]];
      } },
    { no: 19, name: 'Centrifugal', vars: ['m', 'v', 'r'],
      calc: v => {
        if (v.m <= 0 || v.v <= 0 || v.r <= 0) throw ERR();
        return [['F', r15(v.m * v.v * v.v / v.r)]];
      } },
    { no: 20, name: 'ElasticEnergy', vars: ['K', 'x'],
      calc: v => {
        if (v.K <= 0 || v.x <= 0) throw ERR();
        return [['U', r15(v.K * v.x * v.x / 2)]];
      } },
    { no: 21, name: 'Bernoulli', vars: ['v', 'z', 'ρ', 'P'],
      calc: v => {
        if (v.v <= 0 || v.z <= 0 || v['ρ'] <= 0 || v.P <= 0) throw ERR();
        return [['C', r15(v.v * v.v / 2 + G_ACC * v.z + v.P / v['ρ'])]];
      } },
    { no: 22, name: 'Stadia(h)', vars: ['K', 'C', 'l', 'θ'],
      calc: (v, u) => {
        if (v.l <= 0) throw ERR();
        const th = rad(v['θ'], u);
        return [['h', r15(v.K * v.l * Math.sin(2 * th) / 2 + v.C * Math.sin(th))]];
      } },
    { no: 23, name: 'Stadia(S)', vars: ['K', 'C', 'l', 'θ'],
      calc: (v, u) => {
        if (v.l <= 0) throw ERR();
        const th = rad(v['θ'], u);
        const c = Math.cos(th);
        return [['S', r15(v.K * v.l * c * c + v.C * c)]];
      } },
  ];
})();
