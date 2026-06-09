// ===== Fun Tools =====
const fun = {
    type: 'loan',
    setType(t, btn) {
        this.type = t;
        document.querySelectorAll('#panel-fun .eq-type button').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderInputs();
    },
    renderInputs() {
        const el = document.getElementById('funInputs');
        if (!el) return;
        const inputs = {
            loan: [
                { id: 'f_amount', label: '贷款金额(万元)', ph: '100' },
                { id: 'f_rate', label: '年利率(%)', ph: '4.9' },
                { id: 'f_years', label: '贷款年限', ph: '30' },
                { id: 'f_type', label: '还款方式', ph: '等额本息', options: ['等额本息', '等额本金'] }
            ],
            interest: [
                { id: 'f_principal', label: '本金', ph: '10000' },
                { id: 'f_annualRate', label: '年化收益率(%)', ph: '5' },
                { id: 'f_investYears', label: '投资年限', ph: '10' },
                { id: 'f_compound', label: '复利频率', ph: '年', options: ['年', '季', '月', '日'] }
            ],
            currency: [
                { id: 'f_amount', label: '金额', ph: '1000' },
                { id: 'f_from', label: '源货币', ph: 'CNY', options: ['CNY', 'USD', 'EUR', 'GBP', 'JPY', 'KRW', 'HKD', 'TWD'] },
                { id: 'f_to', label: '目标货币', ph: 'USD', options: ['CNY', 'USD', 'EUR', 'GBP', 'JPY', 'KRW', 'HKD', 'TWD'] }
            ],
            number: [{ id: 'f_num', label: '数字', ph: '12345.67' }],
            base: [
                { id: 'f_num', label: '数值', ph: '255' },
                { id: 'f_from', label: '源进制', ph: '10', options: ['10', '2', '8', '16'] },
                { id: 'f_to', label: '目标进制', ph: '16', options: ['10', '2', '8', '16'] }
            ],
            speed: [
                { id: 'f_val', label: '数值', ph: '100' },
                { id: 'f_from', label: '源单位', ph: 'km/h', options: ['m/s', 'km/h', 'mph', 'knot', 'Mach'] },
                { id: 'f_to', label: '目标单位', ph: 'm/s', options: ['m/s', 'km/h', 'mph', 'knot', 'Mach'] }
            ],
            bmi: [
                { id: 'f_height', label: '身高(cm)', ph: '170' },
                { id: 'f_weight', label: '体重(kg)', ph: '65' }
            ],
            tax: [
                { id: 'f_income', label: '月收入(元)', ph: '20000' },
                { id: 'f_insurance', label: '五险一金(元)', ph: '3000' },
                { id: 'f_deduction', label: '专项附加扣除(元)', ph: '1000' },
                { id: 'f_threshold', label: '起征点(元)', ph: '5000' }
            ]
        };
        el.innerHTML = (inputs[this.type] || []).map(i => {
            if (i.options) {
                return `<div class="eq-input"><label>${i.label}</label><select id="${i.id}">${i.options.map(o => `<option value="${o}" ${o === i.ph ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
            }
            return `<div class="eq-input"><label>${i.label}</label><input id="${i.id}" placeholder="${i.ph}"></div>`;
        }).join('');
    },
    calculate() {
        const g = id => document.getElementById(id)?.value || '';
        const gn = id => parseFloat(g(id) || '0');
        const el = document.getElementById('funResult');
        if (!el) return;
        let r = '';
        try {
            switch (this.type) {
                case 'loan': {
                    const P = gn('f_amount') * 10000, rate = gn('f_rate') / 100, years = gn('f_years');
                    const n = years * 12, mr = rate / 12;
                    if (g('f_type') === '等额本息') {
                        const M = P * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1);
                        r = `月供: ${M.toFixed(2)} 元\n总还款: ${(M * n).toFixed(2)} 元\n总利息: ${(M * n - P).toFixed(2)} 元`;
                    } else {
                        const monthlyP = P / n;
                        let totalInterest = 0;
                        for (let i = 0; i < n; i++) totalInterest += (P - monthlyP * i) * mr;
                        const firstMonth = monthlyP + P * mr;
                        const lastMonth = monthlyP + monthlyP * mr;
                        r = `首月: ${firstMonth.toFixed(2)} 元\n末月: ${lastMonth.toFixed(2)} 元\n总还款: ${(P + totalInterest).toFixed(2)} 元\n总利息: ${totalInterest.toFixed(2)} 元`;
                    }
                    break;
                }
                case 'interest': {
                    const P = gn('f_principal'), rate = gn('f_annualRate') / 100, years = gn('f_investYears');
                    const freqMap = { '年': 1, '季': 4, '月': 12, '日': 365 };
                    const n = freqMap[g('f_compound')] || 1;
                    const A = P * Math.pow(1 + rate / n, n * years);
                    const realRate = Math.pow(1 + rate / n, n) - 1;
                    r = `终值: ${A.toFixed(2)} 元\n收益: ${(A - P).toFixed(2)} 元\n实际年化: ${(realRate * 100).toFixed(4)}%`;
                    break;
                }
                case 'currency': {
                    const rates = { CNY: 1, USD: 7.2, EUR: 7.8, GBP: 9.1, JPY: 0.048, KRW: 0.0053, HKD: 0.92, TWD: 0.22 };
                    const amount = gn('f_amount'), from = g('f_from'), to = g('f_to');
                    const result = amount * rates[from] / rates[to];
                    r = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
                    break;
                }
                case 'number': {
                    const num = parseFloat(g('f_num'));
                    r = `大写: ${this.toChineseNumber(num)}`;
                    break;
                }
                case 'base': {
                    const num = g('f_num'), from = parseInt(g('f_from')), to = parseInt(g('f_to'));
                    const decimal = parseInt(num, from);
                    r = `${num} (${from}进制) = ${decimal.toString(to).toUpperCase()} (${to}进制)`;
                    break;
                }
                case 'speed': {
                    const factors = { 'm/s': 1, 'km/h': 1 / 3.6, 'mph': 0.44704, 'knot': 0.514444, 'Mach': 340.3 };
                    const val = gn('f_val'), from = g('f_from'), to = g('f_to');
                    const result = val * factors[from] / factors[to];
                    r = `${val} ${from} = ${result.toFixed(6)} ${to}`;
                    break;
                }
                case 'bmi': {
                    const h = gn('f_height') / 100, w = gn('f_weight');
                    const bmi = w / (h * h);
                    let cat = bmi < 18.5 ? '偏瘦' : bmi < 24 ? '正常' : bmi < 28 ? '偏胖' : '肥胖';
                    r = `BMI = ${bmi.toFixed(2)}\n分类: ${cat}\n正常范围: 18.5 - 24`;
                    break;
                }
                case 'tax': {
                    const income = gn('f_income'), insurance = gn('f_insurance'), deduction = gn('f_deduction'), threshold = gn('f_threshold');
                    const taxable = Math.max(0, income - insurance - threshold - deduction);
                    const brackets = [[3000, 0.03, 0], [12000, 0.10, 210], [25000, 0.20, 1410], [35000, 0.25, 2660], [55000, 0.30, 4410], [80000, 0.35, 7160], [Infinity, 0.45, 15160]];
                    let tax = 0;
                    for (const [limit, rate, quick] of brackets) {
                        if (taxable <= limit) { tax = taxable * rate - quick; break; }
                    }
                    r = `应纳税所得额: ${taxable.toFixed(2)} 元\n月个税: ${Math.max(0, tax).toFixed(2)} 元\n年个税: ${(Math.max(0, tax) * 12).toFixed(2)} 元\n税后收入: ${(income - insurance - Math.max(0, tax)).toFixed(2)} 元`;
                    break;
                }
            }
        } catch (e) { r = '错误: ' + e.message; }
        el.textContent = r;
        el.style.display = 'block';
    },
    toChineseNumber(num) {
        const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        const units = ['', '拾', '佰', '仟'];
        const bigUnits = ['', '万', '亿', '万亿'];
        if (num === 0) return '零元整';
        const negative = num < 0;
        num = Math.abs(num);
        const [intPart, decPart] = num.toFixed(2).split('.');
        let result = '';
        const groups = [];
        for (let i = intPart.length; i > 0; i -= 4) groups.unshift(intPart.slice(Math.max(0, i - 4), i));
        groups.forEach((group, gi) => {
            let groupStr = '';
            let zeroFlag = false;
            for (let i = 0; i < group.length; i++) {
                const d = parseInt(group[i]);
                const unitIdx = group.length - 1 - i;
                if (d === 0) { zeroFlag = true; }
                else {
                    if (zeroFlag) { groupStr += '零'; zeroFlag = false; }
                    groupStr += digits[d] + units[unitIdx];
                }
            }
            if (groupStr) result += groupStr + bigUnits[groups.length - 1 - gi];
        });
        result += '元';
        const jiao = parseInt(decPart[0]), fen = parseInt(decPart[1]);
        if (jiao === 0 && fen === 0) { result += '整'; }
        else {
            if (jiao > 0) result += digits[jiao] + '角';
            if (fen > 0) result += digits[fen] + '分';
        }
        return (negative ? '负' : '') + result;
    }
};
