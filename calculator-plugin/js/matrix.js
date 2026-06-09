// ===== Matrix Operations =====
const matrix = {
    op: 'add', size: 2,
    setOp(o, btn) {
        this.op = o;
        this.size = (o === 'determinant' || o === 'inverse') ? 3 : 2;
        document.querySelectorAll('#panel-matrix .eq-type button').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderInputs();
    },
    renderInputs() {
        const el = document.getElementById('matrixInputs');
        if (!el) return;
        const s = this.size;
        let html = '<div class="matrix-grid">';
        if (this.op === 'add' || this.op === 'subtract' || this.op === 'multiply') {
            ['A', 'B'].forEach(m => {
                html += `<div class="matrix-label">矩阵 ${m}</div><div class="matrix-matrix">`;
                for (let i = 0; i < s; i++) {
                    html += '<div class="matrix-row">';
                    for (let j = 0; j < s; j++) html += `<input id="m${m}${i}${j}" class="matrix-cell" placeholder="0">`;
                    html += '</div>';
                }
                html += '</div>';
            });
        } else {
            html += `<div class="matrix-label">矩阵 A</div><div class="matrix-matrix">`;
            for (let i = 0; i < 3; i++) {
                html += '<div class="matrix-row">';
                for (let j = 0; j < 3; j++) html += `<input id="mA${i}${j}" class="matrix-cell" placeholder="0">`;
                html += '</div>';
            }
            html += '</div>';
        }
        html += '</div>';
        el.innerHTML = html;
    },
    calculate() {
        const g = id => parseFloat(document.getElementById(id)?.value || '0');
        const el = document.getElementById('matrixResult');
        if (!el) return;
        const s = this.size;
        let r = '';
        try {
            if (this.op === 'add') {
                const c = [];
                for (let i = 0; i < s; i++) { c[i] = []; for (let j = 0; j < s; j++) c[i][j] = g(`mA${i}${j}`) + g(`mB${i}${j}`); }
                r = this.formatMatrix(c);
            } else if (this.op === 'subtract') {
                const c = [];
                for (let i = 0; i < s; i++) { c[i] = []; for (let j = 0; j < s; j++) c[i][j] = g(`mA${i}${j}`) - g(`mB${i}${j}`); }
                r = this.formatMatrix(c);
            } else if (this.op === 'multiply') {
                const c = [];
                for (let i = 0; i < s; i++) { c[i] = []; for (let j = 0; j < s; j++) { c[i][j] = 0; for (let k = 0; k < s; k++) c[i][j] += g(`mA${i}${k}`) * g(`mB${k}${j}`); } }
                r = this.formatMatrix(c);
            } else if (this.op === 'determinant') {
                const a = [];
                for (let i = 0; i < 3; i++) { a[i] = []; for (let j = 0; j < 3; j++) a[i][j] = g(`mA${i}${j}`); }
                const det = a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
                          - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
                          + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
                r = `det(A) = ${det.toFixed(6)}`;
            } else if (this.op === 'inverse') {
                const a = [];
                for (let i = 0; i < 3; i++) { a[i] = []; for (let j = 0; j < 3; j++) a[i][j] = g(`mA${i}${j}`); }
                const det = a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
                          - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
                          + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
                if (Math.abs(det) < 1e-10) { r = '矩阵不可逆 (det ≈ 0)'; }
                else {
                    const adj = [
                        [(a[1][1]*a[2][2]-a[1][2]*a[2][1]), -(a[0][1]*a[2][2]-a[0][2]*a[2][1]), (a[0][1]*a[1][2]-a[0][2]*a[1][1])],
                        [-(a[1][0]*a[2][2]-a[1][2]*a[2][0]), (a[0][0]*a[2][2]-a[0][2]*a[2][0]), -(a[0][0]*a[1][2]-a[0][2]*a[1][0])],
                        [(a[1][0]*a[2][1]-a[1][1]*a[2][0]), -(a[0][0]*a[2][1]-a[0][1]*a[2][0]), (a[0][0]*a[1][1]-a[0][1]*a[1][0])]
                    ];
                    const inv = adj.map(row => row.map(v => v / det));
                    r = 'A⁻¹ =\n' + this.formatMatrix(inv);
                }
            }
        } catch (e) { r = '错误: ' + e.message; }
        el.textContent = r;
        el.style.display = 'block';
    },
    formatMatrix(m) { return m.map(row => row.map(v => v.toFixed(4).padStart(10)).join('  ')).join('\n'); }
};
