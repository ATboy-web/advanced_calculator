import { describe, it, expect } from 'vitest';
import {
    fact, fmt, erf, gcd, lcm,
    isPrime, primeFactors, eulerPhi,
    fibonacci, perm, comb,
    binPMF, normCDF, poisPMF,
    horner, solveCubic, modpow
} from '../../src/js/utils/math.js';

describe('fmt — 数值格式化', () => {
    it('NaN 返回 "错误"', () => {
        expect(fmt(NaN)).toBe('错误');
    });

    it('Infinity 返回 "∞"', () => {
        expect(fmt(Infinity)).toBe('∞');
    });

    it('-Infinity 返回 "∞"', () => {
        expect(fmt(-Infinity)).toBe('∞');
    });

    it('整数保持原样', () => {
        expect(fmt(42)).toBe('42');
        expect(fmt(-100)).toBe('-100');
        expect(fmt(0)).toBe('0');
    });

    it('浮点数使用 12 位有效数字', () => {
        expect(fmt(0.1 + 0.2)).toBe('0.3');
        expect(fmt(Math.PI)).toBe('3.14159265359');
    });
});

describe('fact — 阶乘', () => {
    it('0! = 1', () => expect(fact(0)).toBe(1));
    it('1! = 1', () => expect(fact(1)).toBe(1));
    it('5! = 120', () => expect(fact(5)).toBe(120));
    it('10! = 3628800', () => expect(fact(10)).toBe(3628800));
    it('负数返回 NaN', () => expect(fact(-1)).toBeNaN());
    it('非整数返回 NaN', () => expect(fact(1.5)).toBeNaN());
    it('大于 170 返回 Infinity', () => expect(fact(171)).toBe(Infinity));
});

describe('gcd / lcm', () => {
    it('gcd(48, 18) = 6', () => expect(gcd(48, 18)).toBe(6));
    it('gcd(0, 5) = 5', () => expect(gcd(0, 5)).toBe(5));
    it('gcd(7, 13) = 1', () => expect(gcd(7, 13)).toBe(1));
    it('lcm(4, 6) = 12', () => expect(lcm(4, 6)).toBe(12));
    it('lcm(3, 7) = 21', () => expect(lcm(3, 7)).toBe(21));
});

describe('isPrime — 素数检测', () => {
    it('0, 1 不是素数', () => {
        expect(isPrime(0)).toBe(false);
        expect(isPrime(1)).toBe(false);
    });
    it('2, 3, 5, 7 是素数', () => {
        expect(isPrime(2)).toBe(true);
        expect(isPrime(3)).toBe(true);
        expect(isPrime(5)).toBe(true);
        expect(isPrime(7)).toBe(true);
    });
    it('4, 6, 8, 9 不是素数', () => {
        expect(isPrime(4)).toBe(false);
        expect(isPrime(6)).toBe(false);
        expect(isPrime(8)).toBe(false);
        expect(isPrime(9)).toBe(false);
    });
    it('997 是素数', () => expect(isPrime(997)).toBe(true));
    it('1000 不是素数', () => expect(isPrime(1000)).toBe(false));
});

describe('primeFactors — 素因数分解', () => {
    it('360 = 2×2×2×3×3×5', () => {
        expect(primeFactors(360)).toEqual([2, 2, 2, 3, 3, 5]);
    });
    it('13 = 13', () => {
        expect(primeFactors(13)).toEqual([13]);
    });
    it('1 = []', () => {
        expect(primeFactors(1)).toEqual([]);
    });
});

describe('fibonacci', () => {
    it('F(0)=0, F(1)=1, F(2)=1', () => {
        expect(fibonacci(0)).toBe(0);
        expect(fibonacci(1)).toBe(1);
        expect(fibonacci(2)).toBe(1);
    });
    it('F(10)=55', () => expect(fibonacci(10)).toBe(55));
    it('F(20)=6765', () => expect(fibonacci(20)).toBe(6765));
});

describe('perm / comb — 排列组合', () => {
    it('P(10,3) = 720', () => expect(perm(10, 3)).toBe(720));
    it('P(5,5) = 120', () => expect(perm(5, 5)).toBe(120));
    it('C(10,3) = 120', () => expect(comb(10, 3)).toBe(120));
    it('C(5,0) = 1', () => expect(comb(5, 0)).toBe(1));
    it('C(5,5) = 1', () => expect(comb(5, 5)).toBe(1));
    it('C(10,7) = C(10,3) = 120', () => expect(comb(10, 7)).toBe(120));
});

describe('eulerPhi — 欧拉函数', () => {
    it('φ(1)=1', () => expect(eulerPhi(1)).toBe(1));
    it('φ(12)=4', () => expect(eulerPhi(12)).toBe(4));
    it('φ(7)=6 (素数)', () => expect(eulerPhi(7)).toBe(6));
});

describe('modpow — 模幂运算', () => {
    it('2^10 mod 1000 = 24', () => expect(modpow(2, 10, 1000)).toBe(24));
    it('3^13 mod 7 = 3', () => expect(modpow(3, 13, 7)).toBe(3));
});

describe('horner — 多项式求值', () => {
    it('P(x)=x²-3x+2, P(2)=0', () => {
        expect(horner([1, -3, 2], 2)).toBeCloseTo(0);
    });
    it('P(x)=x³-6x²+11x-6, P(1)=0', () => {
        expect(horner([1, -6, 11, -6], 1)).toBeCloseTo(0);
    });
});

describe('solveCubic — 三次方程', () => {
    it('x³-6x²+11x-6=0 的根为 1,2,3', () => {
        const roots = solveCubic(1, -6, 11, -6);
        expect(roots.length).toBe(3);
        const sorted = roots.sort((a, b) => a - b);
        expect(sorted[0]).toBeCloseTo(1);
        expect(sorted[1]).toBeCloseTo(2);
        expect(sorted[2]).toBeCloseTo(3);
    });
});

describe('erf — 误差函数', () => {
    it('erf(0) = 0', () => expect(erf(0)).toBeCloseTo(0));
    it('erf(1) ≈ 0.8427', () => expect(erf(1)).toBeCloseTo(0.8427, 3));
    it('erf(-1) = -erf(1)', () => expect(erf(-1)).toBeCloseTo(-erf(1)));
});

describe('normCDF — 正态分布 CDF', () => {
    it('标准正态 P(X≤0) = 0.5', () => {
        expect(normCDF(0, 0, 1)).toBeCloseTo(0.5);
    });
    it('标准正态 P(X≤1.96) ≈ 0.975', () => {
        expect(normCDF(1.96, 0, 1)).toBeCloseTo(0.975, 2);
    });
});
