/**
 * DOM 操作工具
 */

/**
 * 获取元素的快捷方式
 * @param {string} id
 * @returns {HTMLElement}
 */
export const $ = (id) => document.getElementById(id);

/**
 * 防抖函数
 * @param {Function} fn
 * @param {number} delay - 毫秒
 * @returns {Function}
 */
export function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * 安全地设置元素 innerHTML
 * 用于计算器结果区域（内容由代码控制，非用户输入）
 * @param {string} id
 * @param {string} html
 */
export function setResultHTML(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
}

/**
 * 安全地设置元素 textContent
 * @param {string} id
 * @param {string} text
 */
export function setResultText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
}

/**
 * 获取输入框数值
 * @param {string} id
 * @param {number} [defaultValue=0]
 * @returns {number}
 */
export function getInputValue(id, defaultValue = 0) {
    const el = $(id);
    if (!el) return defaultValue;
    const v = parseFloat(el.value);
    return isNaN(v) ? defaultValue : v;
}

/**
 * 获取输入框文本
 * @param {string} id
 * @param {string} [defaultValue='']
 * @returns {string}
 */
export function getInputText(id, defaultValue = '') {
    const el = $(id);
    return el ? el.value.trim() : defaultValue;
}
