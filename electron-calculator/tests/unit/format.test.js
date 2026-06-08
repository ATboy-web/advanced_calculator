import { describe, it, expect } from 'vitest';
import { fmt, convertToChinese } from '../../src/js/utils/format.js';

describe('fmt — 格式化', () => {
    it('正常数字', () => {
        expect(fmt(123)).toBe('123');
    });

    it('NaN', () => {
        expect(fmt(NaN)).toBe('错误');
    });

    it('Infinity', () => {
        expect(fmt(Infinity)).toBe('∞');
    });

    it('小数精度', () => {
        expect(fmt(0.1 + 0.2)).toBe('0.3');
    });
});

describe('convertToChinese — 大写数字', () => {
    it('整数', () => {
        const result = convertToChinese('1234');
        expect(result).toContain('壹');
        expect(result).toContain('贰');
        expect(result).toContain('叁');
        expect(result).toContain('肆');
    });

    it('零', () => {
        const result = convertToChinese('1001');
        expect(result).toContain('零');
    });

    it('结尾带元整', () => {
        expect(convertToChinese('100')).toContain('元整');
    });
});
