// ===== Equation Solver =====
const equation = {
    type: 'linear',
    setType(t, btn) {
        this.type = t;
        document.querySelectorAll('#panel-equation .eq-type button').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderInputs();
    },
    renderInputs() {
        const el = document.getElementById('eqInputs');
        if (!el) return;
        const t = i18n.t;
        const html = {
            linear: `<div class="eq-input"><label>a</label><input id="eq_a" placeholder="2"></div>
                     <div class="eq-input"><label>b</label><input id="eq_b" placeholder="3"></div>
                     <div class="eq-desc">ax + b = 0</div>`,
            quadratic: `<div class="eq-input"><label>a</label><input id="eq_a" placeholder="1"></div>
                        <div class="eq-input"><label>b</label><input id="eq_b" placeholder="-5"></div>
                        <div class="eq-input"><label>c</label><input id="eq_c" placeholder="6"></div>
                        <div class="eq-desc">ax² + bx + c = 0</div>`,
            system: `<div class="eq-row"><div class="eq-input"><label>a₁</label><input id="eq_a1" placeholder="2"></div>
                     <div class="eq-input"><label>b₁</label><input id="eq_b1" placeholder="3"></div>
                     <div class="eq-input"><label>c₁</label><input id="eq_c1" placeholder="8"></div></div>
                     <div class="eq-row"><div class="eq-input"><label>a₂</label><input id="eq_a2" placeholder="1"></div>
                     <div class="eq-input"><label>b₂</label><input id="eq_b2" placeholder="-1"></div>
                     <div class="eq-input"><label>c₂</label><input id="eq_c2" placeholder="1"></div></div>
                     <div class="eq-desc">a₁x + b₁y = c₁ ; a₂x + b₂y = c₂</div>`
        };
        el.innerHTML = html[this.type] || '';
    },
    solve() {
        const g = id => parseFloat(document.getElementById(id)?.value || '0');
        const el = document.getElementById('eqResult');
        if (!el) return;
        let r = '';
        try {
            if (this.type === 'linear') {
                const a = g('eq_a'), b = g('eq_b');
                if (a === 0) r = b === 0 ? '无穷多解' : '无解';
                else r = `x = ${(-b / a).toFixed(6)}`;
            } else if (this.type === 'quadratic') {
                const a = g('eq_a'), b = g('eq_b'), c = g('eq_c');
                if (a === 0) { r = 'a ≠ 0'; }
                else {
                    const d = b * b - 4 * a * c;
                    if (d < 0) {
                        const re = -b / (2 * a), im = Math.sqrt(-d) / (2 * a);
                        r = `Δ = ${d.toFixed(4)}\nx₁ = ${re.toFixed(4)} + ${im.toFixed(4)}i\nx₂ = ${re.toFixed(4)} - ${im.toFixed(4)}i`;
                    } else if (d === 0) {
                        r = `Δ = 0\nx = ${(-b / (2 * a)).toFixed(6)}`;
                    } else {
                        const x1 = (-b + Math.sqrt(d)) / (2 * a), x2 = (-b - Math.sqrt(d)) / (2 * a);
                        r = `Δ = ${d.toFixed(4)}\nx₁ = ${x1.toFixed(6)}\nx₂ = ${x2.toFixed(6)}`;
                    }
                }
            } else if (this.type === 'system') {
                const a1 = g('eq_a1'), b1 = g('eq_b1'), c1 = g('eq_c1');
                const a2 = g('eq_a2'), b2 = g('eq_b2'), c2 = g('eq_c2');
                const det = a1 * b2 - a2 * b1;
                if (Math.abs(det) < 1e-10) r = '方程组无唯一解';
                else {
                    const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det;
                    r = `x = ${x.toFixed(6)}\ny = ${y.toFixed(6)}`;
                }
            }
        } catch (e) { r = '错误: ' + e.message; }
        el.textContent = r;
        el.style.display = 'block';
    }
};
