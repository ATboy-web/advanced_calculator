/**
 * 数学工具函数
 * 从 app.js 中提取的纯数学逻辑，无 DOM 依赖
 */

/**
 * 阶乘
 * @param {number} n
 * @returns {number}
 */
export function fact(n) {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

/**
 * 误差函数 erf(x)
 * @param {number} x
 * @returns {number}
 */
export function erf(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1 / (1 + p * x);
    return sign * (1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
}

/**
 * 安全构建数学函数
 * 将用户输入的数学表达式转换为可执行函数
 *
 * @param {string} expr - 数学表达式，如 "sin(x) + x^2"
 * @returns {Function|null} (x, n) => number 或 null
 */
export function buildMathFunc(expr) {
    try {
        const safe = expr
            .replace(/\^/g, '**')
            .replace(/\bsin\b/g, 'Math.sin')
            .replace(/\bcos\b/g, 'Math.cos')
            .replace(/\btan\b/g, 'Math.tan')
            .replace(/\basin\b/g, 'Math.asin')
            .replace(/\bacos\b/g, 'Math.acos')
            .replace(/\batan\b/g, 'Math.atan')
            .replace(/\bsinh\b/g, 'Math.sinh')
            .replace(/\bcosh\b/g, 'Math.cosh')
            .replace(/\btanh\b/g, 'Math.tanh')
            .replace(/\bln\b/g, 'Math.log')
            .replace(/\blog\b/g, 'Math.log10')
            .replace(/\bsqrt\b/g, 'Math.sqrt')
            .replace(/\bcbrt\b/g, 'Math.cbrt')
            .replace(/\babs\b/g, 'Math.abs')
            .replace(/\bexp\b/g, 'Math.exp')
            .replace(/\bpi\b/gi, 'Math.PI')
            .replace(/\be\b(?![a-zA-Z])/g, 'Math.E')
            .replace(/\bn\b/g, '__n');
        return new Function('x', '__n', `return ${safe}`);
    } catch {
        return null;
    }
}

/**
 * 绘图用的函数解析（支持 x 和常用函数名）
 * @param {string} expr
 * @param {number} x
 * @returns {number}
 */
export function evalFunc(expr, x) {
    try {
        const e = expr
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/ln/g, 'Math.log')
            .replace(/log/g, 'Math.log10')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/abs/g, 'Math.abs')
            .replace(/exp/g, 'Math.exp')
            .replace(/pi/g, 'Math.PI')
            .replace(/e(?![xp])/g, 'Math.E');
        return new Function('x', `return ${e}`)(x);
    } catch {
        return NaN;
    }
}

/**
 * 数值导数（中心差分）
 * @param {Function} f - (x, n) => number
 * @param {number} x - 求导点
 * @param {number} [h=1e-8] - 步长
 * @returns {number}
 */
export function numericalDerivative(f, x, h = 1e-8) {
    return (f(x + h, 0) - f(x - h, 0)) / (2 * h);
}

/**
 * 迭代式高阶导数（有限差分表）
 * @param {Function} f
 * @param {number} x
 * @param {number} n - 阶数
 * @param {number} [h=1e-5]
 * @returns {number}
 */
export function numericalDerivativeN(f, x, n, h = 1e-5) {
    if (n === 0) return f(x, 0);
    if (n === 1) return numericalDerivative(f, x, h);
    const m = n + 2;
    const vals = [];
    for (let i = 0; i <= m; i++) {
        vals.push(f(x + (i - Math.floor(m / 2)) * h, 0));
    }
    for (let k = 1; k <= n; k++) {
        for (let i = 0; i < vals.length - 1; i++) {
            vals[i] = (vals[i + 1] - vals[i]) / h;
        }
        vals.pop();
    }
    return vals[0];
}

/**
 * 辛普森积分
 */
export function simpsonIntegral(f, a, b, n = 10000) {
    if (n % 2) n++;
    const h = (b - a) / n;
    let s = f(a, 0) + f(b, 0);
    for (let i = 1; i < n; i++) {
        s += f(a + i * h, 0) * (i % 2 === 0 ? 2 : 4);
    }
    return (h / 3) * s;
}

/**
 * 梯形积分
 */
export function trapezoidIntegral(f, a, b, n = 10000) {
    const h = (b - a) / n;
    let s = (f(a, 0) + f(b, 0)) / 2;
    for (let i = 1; i < n; i++) {
        s += f(a + i * h, 0);
    }
    return h * s;
}

/**
 * 排列数 P(n, r)
 */
export function perm(n, r) {
    if (r > n) return 0;
    let v = 1;
    for (let i = 0; i < r; i++) v *= (n - i);
    return v;
}

/**
 * 组合数 C(n, r)
 */
export function comb(n, r) {
    if (r > n) return 0;
    if (r > n / 2) r = n - r;
    let v = 1;
    for (let i = 0; i < r; i++) v = v * (n - i) / (i + 1);
    return Math.round(v);
}

/**
 * 二项分布 PMF
 */
export function binPMF(n, k, p) {
    return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * 正态分布 CDF
 */
export function normCDF(x, m, s) {
    const z = (x - m) / s;
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

/**
 * 泊松分布 PMF
 */
export function poisPMF(l, k) {
    return Math.exp(-l) * Math.pow(l, k) / fact(k);
}

/**
 * GCD 最大公约数
 */
export function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

/**
 * LCM 最小公倍数
 */
export function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

/**
 * 素数检测
 */
export function isPrime(n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

/**
 * 素因数分解
 */
export function primeFactors(n) {
    const f = [];
    let d = 2;
    while (d * d <= n) {
        while (n % d === 0) {
            f.push(d);
            n /= d;
        }
        d++;
    }
    if (n > 1) f.push(n);
    return f;
}

/**
 * 欧拉函数 φ(n)
 */
export function eulerPhi(n) {
    let r = n;
    for (let p = 2; p * p <= n; p++) {
        if (n % p === 0) {
            while (n % p === 0) n /= p;
            r -= r / p;
        }
    }
    if (n > 1) r -= r / n;
    return Math.round(r);
}

/**
 * 模幂运算
 */
export function modpow(base, exp, mod) {
    let r = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 === 1) r = (r * base) % mod;
        base = (base * base) % mod;
        exp = Math.floor(exp / 2);
    }
    return r;
}

/**
 * 斐波那契数列
 */
export function fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

/**
 * Horner 法求多项式值
 */
export function horner(coeff, x) {
    let r = 0;
    for (let i = 0; i < coeff.length; i++) {
        r = r * x + coeff[i];
    }
    return r;
}

/**
 * 三次方程求解（Cardano 公式）
 */
export function solveCubic(a, b, c, d) {
    if (a === 0) return [];
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    const disc = q * q / 4 + p * p * p / 27;
    const roots = [];

    if (disc > 0) {
        const u = Math.cbrt(-q / 2 + Math.sqrt(disc));
        const v = Math.cbrt(-q / 2 - Math.sqrt(disc));
        roots.push(u + v - b / (3 * a));
    } else if (Math.abs(disc) < 1e-15) {
        roots.push(3 * q / p - b / (3 * a));
        roots.push(-3 * q / (2 * p) - b / (3 * a));
    } else {
        const r = Math.sqrt(-p * p * p / 27);
        const theta = Math.acos(-q / (2 * r));
        for (let k = 0; k < 3; k++) {
            roots.push(2 * Math.cbrt(r) * Math.cos((theta + 2 * Math.PI * k) / 3) - b / (3 * a));
        }
    }
    return roots;
}

/**
 * 泰勒展开系数
 */
export function taylorCoeffs(f, x0, n) {
    const c = [];
    for (let k = 0; k <= n; k++) {
        c.push(numericalDerivativeN(f, x0, k, 1e-4) / fact(k));
    }
    return c;
}
