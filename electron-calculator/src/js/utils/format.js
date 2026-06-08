/**
 * 格式化工具函数
 */

/**
 * 格式化数值为可读字符串
 * - NaN → '错误'
 * - Infinity → '∞'
 * - 整数且范围合理 → 原样
 * - 其他 → 12 位有效数字
 *
 * @param {number} v
 * @returns {string}
 */
export function fmt(v) {
    if (isNaN(v)) return '错误';
    if (!isFinite(v)) return '∞';
    if (v === Math.floor(v) && Math.abs(v) < 1e15) {
        return v.toString();
    }
    return parseFloat(v.toPrecision(12)).toString();
}

/**
 * 格式化时间
 * @param {Date} date
 * @returns {string}
 */
export function formatTime(date) {
    return date.toLocaleTimeString();
}

/**
 * 数字转中文大写
 * @param {string|number} number
 * @returns {string}
 */
export function convertToChinese(number) {
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const bigUnits = ['', '万', '亿', '万亿'];
    const numStr = number.toString();
    const parts = numStr.split('.');
    const intPart = parts[0];
    const decPart = parts[1] || '';

    let result = '';
    const groups = [];
    for (let i = intPart.length; i > 0; i -= 4) {
        groups.unshift(intPart.substring(Math.max(0, i - 4), i));
    }

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        let groupStr = '';
        let hasZero = false;
        for (let j = 0; j < group.length; j++) {
            const digit = parseInt(group[j]);
            const unitIndex = group.length - 1 - j;
            if (digit === 0) {
                hasZero = true;
            } else {
                if (hasZero) {
                    groupStr += '零';
                    hasZero = false;
                }
                groupStr += digits[digit] + units[unitIndex];
            }
        }
        if (groupStr) {
            result += groupStr + bigUnits[groups.length - 1 - i];
        }
    }

    if (!result) result = '零';
    if (decPart) {
        result += '点';
        for (let i = 0; i < decPart.length; i++) {
            result += digits[parseInt(decPart[i])];
        }
    }
    return result + '元整';
}
