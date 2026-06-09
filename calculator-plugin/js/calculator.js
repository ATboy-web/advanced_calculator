// ===== Calculator Engine =====
const calc = {
    display: '', memory: 0, newNumber: true, degMode: true, shiftMode: false,
    
    append(v) {
        if (this.newNumber && /[0-9.]/.test(v)) { this.display = v; this.newNumber = false; }
        else { this.display += v; }
        this.updateDisplay();
    },
    updateDisplay() { const el = document.getElementById('display'); if (el) el.value = this.display || '0'; },
    clear() { this.display = ''; this.newNumber = true; this.updateDisplay(); },
    backspace() { this.display = this.display.slice(0, -1); this.updateDisplay(); },
    negate() {
        if (!this.display) return;
        const v = parseFloat(this.display);
        this.display = String(-v);
        this.updateDisplay();
    },
    percent() {
        if (!this.display) return;
        this.display = String(parseFloat(this.display) / 100);
        this.updateDisplay();
    },
    calculate() {
        try {
            let expr = this.display.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            expr = expr.replace(/π/g, `(${Math.PI})`).replace(/e(?![xp])/g, `(${Math.E})`);
            const fn = new Function(`"use strict"; return (${expr})`);
            const result = fn();
            if (typeof result !== 'number' || !isFinite(result)) throw new Error('Invalid');
            this.history.push({ expr: this.display, result });
            this.display = String(parseFloat(result.toFixed(10)));
            this.newNumber = true;
            this.updateDisplay();
        } catch (e) { this.display = '错误'; this.newNumber = true; this.updateDisplay(); }
    },
    history: [],
    
    // Scientific functions
    toRad(d) { return this.degMode ? d * Math.PI / 180 : d; },
    fromRad(r) { return this.degMode ? r * 180 / Math.PI : r; },
    fact(n) { if (n < 0 || n > 170 || n !== Math.floor(n)) return NaN; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
    
    sciFunc(fn) {
        const v = parseFloat(this.display || '0');
        let r;
        switch (fn) {
            case 'sin': r = Math.sin(this.toRad(v)); break;
            case 'cos': r = Math.cos(this.toRad(v)); break;
            case 'tan': r = Math.tan(this.toRad(v)); break;
            case 'asin': r = this.fromRad(Math.asin(v)); break;
            case 'acos': r = this.fromRad(Math.acos(v)); break;
            case 'atan': r = this.fromRad(Math.atan(v)); break;
            case 'ln': r = Math.log(v); break;
            case 'log': r = Math.log10(v); break;
            case 'sqrt': r = Math.sqrt(v); break;
            case 'square': r = v * v; break;
            case 'cube': r = v * v * v; break;
            case 'reciprocal': r = 1 / v; break;
            case 'abs': r = Math.abs(v); break;
            case 'factorial': r = this.fact(v); break;
            case 'exp': r = Math.exp(v); break;
            case 'ceil': r = Math.ceil(v); break;
            case 'floor': r = Math.floor(v); break;
            case '10x': r = Math.pow(10, v); break;
            case '2x': r = Math.pow(2, v); break;
            case 'ex': r = Math.exp(v); break;
            default: r = v;
        }
        this.display = String(parseFloat(r.toFixed(10)));
        this.newNumber = true;
        this.updateDisplay();
    },
    
    toggleShift() {
        this.shiftMode = !this.shiftMode;
        const btns = document.querySelectorAll('.shift-dependent');
        btns.forEach(b => {
            const normal = b.getAttribute('data-normal');
            const shifted = b.getAttribute('data-shifted');
            if (normal && shifted) b.textContent = this.shiftMode ? shifted : normal;
        });
    }
};
