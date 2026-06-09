// ===== Geometry Calculations =====
const geometry = {
    type: 'circle',
    setType(t, btn) {
        this.type = t;
        document.querySelectorAll('#panel-geometry .eq-type button').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderInputs();
    },
    renderInputs() {
        const el = document.getElementById('geoInputs');
        if (!el) return;
        const inputs = {
            circle: [{ id: 'gr', label: '半径 r', ph: '5' }],
            triangle: [{ id: 'ga', label: '边 a', ph: '3' }, { id: 'gb', label: '边 b', ph: '4' }, { id: 'gc', label: '边 c', ph: '5' }],
            rectangle: [{ id: 'gl', label: '长', ph: '6' }, { id: 'gw', label: '宽', ph: '4' }],
            ellipse: [{ id: 'ga', label: '半长轴 a', ph: '5' }, { id: 'gb', label: '半短轴 b', ph: '3' }],
            trapezoid: [{ id: 'ga', label: '上底 a', ph: '3' }, { id: 'gb', label: '下底 b', ph: '5' }, { id: 'gh', label: '高 h', ph: '4' }, { id: 'gc', label: '腰 c', ph: '3' }],
            polygon: [{ id: 'gn', label: '边数 n', ph: '6' }, { id: 'ga', label: '边长 a', ph: '5' }],
            sphere: [{ id: 'gr', label: '半径 r', ph: '5' }],
            cylinder: [{ id: 'gr', label: '半径 r', ph: '3' }, { id: 'gh', label: '高 h', ph: '10' }],
            cone: [{ id: 'gr', label: '半径 r', ph: '3' }, { id: 'gh', label: '高 h', ph: '8' }],
            torus: [{ id: 'gR', label: '大半径 R', ph: '5' }, { id: 'gr', label: '小半径 r', ph: '2' }]
        };
        el.innerHTML = (inputs[this.type] || []).map(i =>
            `<div class="eq-input"><label>${i.label}</label><input id="${i.id}" placeholder="${i.ph}"></div>`
        ).join('');
    },
    calculate() {
        const g = id => parseFloat(document.getElementById(id)?.value || '0');
        const el = document.getElementById('geoResult');
        if (!el) return;
        let r = '';
        try {
            switch (this.type) {
                case 'circle': {
                    const rv = g('gr'); r = `面积 = πr² = ${(Math.PI * rv * rv).toFixed(4)}\n周长 = 2πr = ${(2 * Math.PI * rv).toFixed(4)}`; break;
                }
                case 'triangle': {
                    const a = g('ga'), b = g('gb'), c = g('gc'), s = (a + b + c) / 2;
                    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
                    r = `面积 = √(s(s-a)(s-b)(s-c)) = ${area.toFixed(4)}\n周长 = ${a + b + c}\n半周长 s = ${s}`;
                    break;
                }
                case 'rectangle': {
                    const l = g('gl'), w = g('gw');
                    r = `面积 = l×w = ${(l * w).toFixed(4)}\n周长 = 2(l+w) = ${(2 * (l + w)).toFixed(4)}\n对角线 = √(l²+w²) = ${Math.sqrt(l * l + w * w).toFixed(4)}`;
                    break;
                }
                case 'ellipse': {
                    const a = g('ga'), b = g('gb');
                    const h = ((a - b) / (a + b)) ** 2, circ = Math.PI * (a + b) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
                    const c = Math.sqrt(Math.abs(a * a - b * b));
                    r = `面积 = πab = ${(Math.PI * a * b).toFixed(4)}\n周长 ≈ ${circ.toFixed(4)}\n焦距 c = ${c.toFixed(4)}\n离心率 e = ${(c / Math.max(a, b)).toFixed(4)}`;
                    break;
                }
                case 'trapezoid': {
                    const a = g('ga'), b = g('gb'), h = g('gh'), c = g('gc');
                    r = `面积 = (a+b)h/2 = ${((a + b) * h / 2).toFixed(4)}\n周长 = ${a + b + 2 * c}\n中位线 = ${(a + b) / 2}`;
                    break;
                }
                case 'polygon': {
                    const n = g('gn'), a = g('ga');
                    const area = n * a * a / (4 * Math.tan(Math.PI / n));
                    r = `面积 = ${area.toFixed(4)}\n周长 = ${n * a}\n内角 = ${((n - 2) * 180 / n).toFixed(2)}°\n外接圆 R = ${(a / (2 * Math.sin(Math.PI / n))).toFixed(4)}\n内切圆 r = ${(a / (2 * Math.tan(Math.PI / n))).toFixed(4)}`;
                    break;
                }
                case 'sphere': {
                    const rv = g('gr');
                    r = `体积 = 4/3·πr³ = ${(4 / 3 * Math.PI * rv ** 3).toFixed(4)}\n表面积 = 4πr² = ${(4 * Math.PI * rv * rv).toFixed(4)}`;
                    break;
                }
                case 'cylinder': {
                    const rv = g('gr'), h = g('gh');
                    r = `体积 = πr²h = ${(Math.PI * rv * rv * h).toFixed(4)}\n侧面积 = 2πrh = ${(2 * Math.PI * rv * h).toFixed(4)}\n总表面积 = 2πr(r+h) = ${(2 * Math.PI * rv * (rv + h)).toFixed(4)}`;
                    break;
                }
                case 'cone': {
                    const rv = g('gr'), h = g('gh'), l = Math.sqrt(rv * rv + h * h);
                    r = `体积 = 1/3·πr²h = ${(Math.PI * rv * rv * h / 3).toFixed(4)}\n母线 l = ${l.toFixed(4)}\n侧面积 = πrl = ${(Math.PI * rv * l).toFixed(4)}\n总表面积 = πr(r+l) = ${(Math.PI * rv * (rv + l)).toFixed(4)}`;
                    break;
                }
                case 'torus': {
                    const R = g('gR'), rv = g('gr');
                    r = `体积 = 2π²Rr² = ${(2 * Math.PI * Math.PI * R * rv * rv).toFixed(4)}\n表面积 = 4π²Rr = ${(4 * Math.PI * Math.PI * R * rv).toFixed(4)}`;
                    break;
                }
            }
        } catch (e) { r = '错误: ' + e.message; }
        el.textContent = r;
        el.style.display = 'block';
    }
};
