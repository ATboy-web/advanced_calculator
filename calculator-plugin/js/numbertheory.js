// ===== Number Theory =====
const numbertheory = {
    type: 'prime',
    setType(t, btn) {
        this.type = t;
        document.querySelectorAll('#panel-numbertheory .eq-type button').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderInputs();
    },
    renderInputs() {
        const el = document.getElementById('ntInputs');
        if (!el) return;
        const inputs = {
            prime: [{ id: 'nt_n', label: 'n', ph: '17' }],
            primeFactor: [{ id: 'nt_n', label: 'n', ph: '360' }],
            gcd: [{ id: 'nt_a', label: 'a', ph: '12' }, { id: 'nt_b', label: 'b', ph: '18' }],
            modpow: [{ id: 'nt_base', label: '底数', ph: '2' }, { id: 'nt_exp', label: '指数', ph: '10' }, { id: 'nt_mod', label: '模数', ph: '1000' }],
            euler: [{ id: 'nt_n', label: 'n', ph: '12' }],
            fibonacci: [{ id: 'nt_n', label: 'n', ph: '10' }]
        };
        el.innerHTML = (inputs[this.type] || []).map(i =>
            `<div class="eq-input"><label>${i.label}</label><input id="${i.id}" placeholder="${i.ph}"></div>`
        ).join('');
    },
    isPrime(n) {
        if (n < 2) return false;
        if (n < 4) return true;
        if (n % 2 === 0 || n % 3 === 0) return false;
        for (let i = 5; i * i <= n; i += 6) if (n % i === 0 || n % (i + 2) === 0) return false;
        return true;
    },
    primeFactors(n) {
        const factors = [];
        for (let d = 2; d * d <= n; d++) { while (n % d === 0) { factors.push(d); n /= d; } }
        if (n > 1) factors.push(n);
        return factors;
    },
    gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return Math.abs(a); },
    lcm(a, b) { return Math.abs(a * b) / this.gcd(a, b); },
    eulerPhi(n) {
        let result = n;
        for (let d = 2; d * d <= n; d++) {
            if (n % d === 0) { while (n % d === 0) n /= d; result -= result / d; }
        }
        if (n > 1) result -= result / n;
        return Math.round(result);
    },
    modpow(base, exp, mod) {
        let result = 1; base = base % mod;
        while (exp > 0) { if (exp % 2 === 1) result = (result * base) % mod; exp = Math.floor(exp / 2); base = (base * base) % mod; }
        return result;
    },
    fibonacci(n) {
        if (n <= 0) return 0;
        if (n === 1) return 1;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) { [a, b] = [b, a + b]; }
        return b;
    },
    calculate() {
        const g = id => parseInt(document.getElementById(id)?.value || '0');
        const el = document.getElementById('ntResult');
        if (!el) return;
        let r = '';
        try {
            switch (this.type) {
                case 'prime': {
                    const n = g('nt_n');
                    r = this.isPrime(n) ? `${n} 是素数` : `${n} 不是素数\n分解: ${this.primeFactors(n).join(' × ')}`;
                    break;
                }
                case 'primeFactor': {
                    const n = g('nt_n'), factors = this.primeFactors(n);
                    const counts = {};
                    factors.forEach(f => counts[f] = (counts[f] || 0) + 1);
                    r = `${n} = ` + Object.entries(counts).map(([k, v]) => v > 1 ? `${k}^${v}` : k).join(' × ');
                    break;
                }
                case 'gcd': {
                    const a = g('nt_a'), b = g('nt_b');
                    r = `GCD(${a},${b}) = ${this.gcd(a, b)}\nLCM(${a},${b}) = ${this.lcm(a, b)}`;
                    break;
                }
                case 'modpow': {
                    const base = g('nt_base'), exp = g('nt_exp'), mod = g('nt_mod');
                    r = `${base}^${exp} mod ${mod} = ${this.modpow(base, exp, mod)}`;
                    break;
                }
                case 'euler': {
                    const n = g('nt_n');
                    r = `φ(${n}) = ${this.eulerPhi(n)}`;
                    break;
                }
                case 'fibonacci': {
                    const n = g('nt_n');
                    const seq = [];
                    for (let i = 0; i <= Math.min(n, 25); i++) seq.push(this.fibonacci(i));
                    r = `F(${n}) = ${this.fibonacci(n)}\n前 ${Math.min(n + 1, 26)} 项:\n${seq.join(', ')}`;
                    break;
                }
            }
        } catch (e) { r = '错误: ' + e.message; }
        el.textContent = r;
        el.style.display = 'block';
    }
};
