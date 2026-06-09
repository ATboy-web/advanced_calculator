// ===== Statistics & Probability =====
const statistics = {
    type: 'combination',
    setType(t, btn) {
        this.type = t;
        document.querySelectorAll('#panel-statistics .eq-type button').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderInputs();
    },
    renderInputs() {
        const el = document.getElementById('statInputs');
        if (!el) return;
        const inputs = {
            combination: [{ id: 'sn', label: 'n', ph: '10' }, { id: 'sr', label: 'r', ph: '3' }],
            permutation: [{ id: 'sn', label: 'n', ph: '10' }, { id: 'sr', label: 'r', ph: '3' }],
            descriptive: [{ id: 'sdata', label: '数据(逗号分隔)', ph: '1,2,3,4,5,6,7,8,9,10', wide: true }],
            binomial: [{ id: 'sn', label: 'n(试验次数)', ph: '10' }, { id: 'sp', label: 'p(概率)', ph: '0.5' }, { id: 'sk', label: 'k(成功次数)', ph: '5' }],
            normal: [{ id: 'smu', label: 'μ(均值)', ph: '0' }, { id: 'ssigma', label: 'σ(标准差)', ph: '1' }, { id: 'sx', label: 'x', ph: '1.96' }],
            poisson: [{ id: 'slambda', label: 'λ', ph: '3' }, { id: 'sk', label: 'k', ph: '2' }]
        };
        el.innerHTML = (inputs[this.type] || []).map(i =>
            `<div class="eq-input${i.wide ? ' wide' : ''}"><label>${i.label}</label><input id="${i.id}" placeholder="${i.ph}"></div>`
        ).join('');
    },
    fact(n) { if (n < 0 || n > 170 || n !== Math.floor(n)) return NaN; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
    perm(n, r) { return this.fact(n) / this.fact(n - r); },
    comb(n, r) {
        if (r > n / 2) r = n - r;
        let v = 1; for (let i = 0; i < r; i++) v = v * (n - i) / (i + 1);
        return v;
    },
    erf(x) {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const sign = x < 0 ? -1 : 1; x = Math.abs(x);
        const t = 1 / (1 + p * x);
        return sign * (1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
    },
    normCDF(x, mu, sigma) { return 0.5 * (1 + this.erf((x - mu) / (sigma * Math.sqrt(2)))); },
    binPMF(n, k, p) { return this.comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); },
    poisPMF(lam, k) { return Math.exp(-lam) * Math.pow(lam, k) / this.fact(k); },
    calculate() {
        const g = id => parseFloat(document.getElementById(id)?.value || '0');
        const el = document.getElementById('statResult');
        if (!el) return;
        let r = '';
        try {
            switch (this.type) {
                case 'combination': {
                    const n = g('sn'), rv = g('sr');
                    r = `C(${n},${rv}) = ${this.comb(n, rv)}\nP(${n},${rv}) = ${this.perm(n, rv)}`;
                    break;
                }
                case 'permutation': {
                    const n = g('sn'), rv = g('sr');
                    r = `P(${n},${rv}) = ${this.perm(n, rv)}\nn! = ${this.fact(n)}`;
                    break;
                }
                case 'descriptive': {
                    const data = document.getElementById('sdata')?.value.split(',').map(Number).filter(x => !isNaN(x)).sort((a, b) => a - b);
                    if (!data.length) { r = '请输入有效数据'; break; }
                    const n = data.length, sum = data.reduce((a, b) => a + b, 0), mean = sum / n;
                    const median = n % 2 ? data[Math.floor(n / 2)] : (data[n / 2 - 1] + data[n / 2]) / 2;
                    const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
                    r = `样本数 n = ${n}\n总和 = ${sum.toFixed(4)}\n均值 = ${mean.toFixed(4)}\n中位数 = ${median.toFixed(4)}\n最小值 = ${data[0]}\n最大值 = ${data[n - 1]}\n方差 = ${variance.toFixed(4)}\n标准差 = ${Math.sqrt(variance).toFixed(4)}`;
                    break;
                }
                case 'binomial': {
                    const n = g('sn'), p = g('sp'), k = g('sk');
                    const pmf = this.binPMF(n, k, p);
                    let cdf = 0; for (let i = 0; i <= k; i++) cdf += this.binPMF(n, i, p);
                    r = `P(X=${k}) = ${pmf.toFixed(6)}\nP(X≤${k}) = ${cdf.toFixed(6)}\nE(X) = np = ${(n * p).toFixed(4)}\nVar(X) = np(1-p) = ${(n * p * (1 - p)).toFixed(4)}`;
                    break;
                }
                case 'normal': {
                    const mu = g('smu'), sigma = g('ssigma'), x = g('sx');
                    const cdf = this.normCDF(x, mu, sigma), z = (x - mu) / sigma;
                    r = `Z = ${z.toFixed(4)}\nP(X≤${x}) = ${cdf.toFixed(6)}\nP(X>${x}) = ${(1 - cdf).toFixed(6)}`;
                    break;
                }
                case 'poisson': {
                    const lam = g('slambda'), k = g('sk');
                    const pmf = this.poisPMF(lam, k);
                    let cdf = 0; for (let i = 0; i <= k; i++) cdf += this.poisPMF(lam, i);
                    r = `P(X=${k}) = ${pmf.toFixed(6)}\nP(X≤${k}) = ${cdf.toFixed(6)}\nE(X) = Var(X) = λ = ${lam}`;
                    break;
                }
            }
        } catch (e) { r = '错误: ' + e.message; }
        el.textContent = r;
        el.style.display = 'block';
    }
};
