// Advanced Calculator - PWA
const $ = id => document.getElementById(id);
const history = [];
let currentPanel = 'basic';

// Panel switching
function showPanel(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    $(name).classList.add('active');
    document.querySelector(`.tab[onclick="showPanel('${name}')"]`).classList.add('active');
    currentPanel = name;
    if (name === 'graph') drawGraph();
    if (name === 'converter') initConverter();
    if (name === 'equation') setEqType('linear', document.querySelector('.eq-type button'));
}

// Calculator state
const calc = {
    expr: '', display: '0', pendingOp: '', pendingVal: 0, newInput: true,
    shifted: false, deg: true, bracketCount: 0,

    update(exprId, resultId) {
        $(exprId).textContent = this.expr;
        $(resultId).textContent = this.display;
    },

    digit(d) {
        if (this.newInput) { this.display = d === '.' ? '0.' : d; this.newInput = false; }
        else { if (d === '.' && this.display.includes('.')) return; this.display += d; }
        if (this.display.length > 1 && this.display.startsWith('0') && !this.display.startsWith('0.'))
            this.display = this.display.replace(/^0+/, '') || '0';
        this.syncDisplay();
    },

    dot() {
        if (this.newInput) { this.display = '0.'; this.newInput = false; }
        else if (!this.display.includes('.')) this.display += '.';
        this.syncDisplay();
    },

    op(o) {
        if (!this.newInput) this.calcIntermediate();
        this.pendingOp = o;
        this.expr = this.display + ' ' + ({'/':'÷','*':'×','-':'−','+':'+','^':'^'}[o]||o) + ' ';
        this.newInput = true;
        this.syncDisplay();
    },

    calcIntermediate() {
        const v = parseFloat(this.display);
        if (this.pendingOp) {
            this.pendingVal = {'+':this.pendingVal+v,'-':this.pendingVal-v,'*':this.pendingVal*v,
                '/':v?this.pendingVal/v:NaN,'^':Math.pow(this.pendingVal,v)}[this.pendingOp] ?? v;
        } else this.pendingVal = v;
    },

    equals() {
        if (!this.newInput) this.calcIntermediate();
        const fullExpr = this.expr + this.display;
        const result = this.fmt(this.pendingVal);
        history.unshift({ expr: fullExpr, result, time: new Date() });
        if (history.length > 50) history.pop();
        this.display = result;
        this.expr = '';
        this.pendingOp = '';
        this.newInput = true;
        this.syncDisplay();
        if (currentPanel === 'history') renderHistory();
    },

    clear() { this.expr=''; this.display='0'; this.pendingOp=''; this.pendingVal=0; this.newInput=true; this.bracketCount=0; this.syncDisplay(); },
    backspace() { if (!this.newInput) this.display = this.display.length>1?this.display.slice(0,-1):'0'; this.syncDisplay(); },
    percent() { this.display = this.fmt(parseFloat(this.display)/100); this.newInput=true; this.syncDisplay(); },
    negate() { if (this.display!=='0') this.display = this.display.startsWith('-')?this.display.slice(1):'-'+this.display; this.syncDisplay(); },

    paren(p) {
        if (p==='(') { if (!this.newInput) this.expr+=this.display+'× '; this.expr+='('; this.bracketCount++; this.newInput=true; }
        else if (p===')'&&this.bracketCount>0) { this.expr+=this.display+')'; this.bracketCount--; this.newInput=true; }
        this.syncDisplay();
    },

    func(fn) {
        const v = parseFloat(this.display);
        let result;
        if (this.shifted) {
            fn = {sin:'asin',cos:'acos',tan:'atan',ln:'exp',log:'10^'}[fn]||fn;
            this.shifted=false; $('btnShift').textContent='2nd';
        }
        const rad = this.deg ? Math.PI/180 : 1;
        switch(fn) {
            case 'sin': result=Math.sin(v*rad); break; case 'cos': result=Math.cos(v*rad); break;
            case 'tan': result=Math.tan(v*rad); break;
            case 'asin': result=Math.asin(v)/rad; break; case 'acos': result=Math.acos(v)/rad; break;
            case 'atan': result=Math.atan(v)/rad; break;
            case 'sinh': result=Math.sinh(v); break; case 'cosh': result=Math.cosh(v); break;
            case 'tanh': result=Math.tanh(v); break;
            case 'ln': result=Math.log(v); break; case 'log': result=Math.log10(v); break;
            case 'sqrt': result=Math.sqrt(v); break; case 'cbrt': result=Math.cbrt(v); break;
            case 'abs': result=Math.abs(v); break; case 'ceil': result=Math.ceil(v); break;
            case 'floor': result=Math.floor(v); break; case 'exp': result=Math.exp(v); break;
            case '10^': result=Math.pow(10,v); break; default: result=v;
        }
        this.expr = `${fn}(${this.display})`;
        this.display = this.fmt(result);
        this.newInput = true;
        this.syncDisplay();
    },

    square() { const v=parseFloat(this.display); this.expr=`(${this.display})²`; this.display=this.fmt(v*v); this.newInput=true; this.syncDisplay(); },
    reciprocal() { const v=parseFloat(this.display); this.expr=`1/(${this.display})`; this.display=this.fmt(v?1/v:NaN); this.newInput=true; this.syncDisplay(); },
    factorial() { const v=parseFloat(this.display); this.expr=`${this.display}!`; this.display=this.fmt(fact(v)); this.newInput=true; this.syncDisplay(); },
    exp() { const v=parseFloat(this.display); this.expr=`e^(${this.display})`; this.display=this.fmt(Math.exp(v)); this.newInput=true; this.syncDisplay(); },

    insertConst(c) {
        this.display = c==='π'?Math.PI.toString():Math.E.toString();
        this.newInput=false; this.syncDisplay();
    },

    toggleShift() { this.shifted=!this.shifted; $('btnShift').textContent=this.shifted?'2nd':'2nd'; },
    toggleAngle() { this.deg=!this.deg; $('btnAngle').textContent=this.deg?'DEG':'RAD'; $('modeLabel').textContent=this.deg?'DEG':'RAD'; },

    syncDisplay() {
        const eId = currentPanel==='scientific'?'sciExpr':'basicExpr';
        const rId = currentPanel==='scientific'?'sciResult':'basicResult';
        this.update(eId, rId);
    },

    fmt(v) {
        if (isNaN(v)) return '错误';
        if (!isFinite(v)) return '∞';
        if (v===Math.floor(v)&&Math.abs(v)<1e15) return v.toString();
        return parseFloat(v.toPrecision(12)).toString();
    }
};

function fact(n) { if(n<0||n!==Math.floor(n)) return NaN; if(n>170) return Infinity; let r=1; for(let i=2;i<=n;i++) r*=i; return r; }

// Graphing
function drawGraph() {
    const canvas = $('graphCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = rect.width, H = rect.height;

    const expr = $('graphFunc').value.trim();
    const xMin = parseFloat($('xMin').value)||-10, xMax = parseFloat($('xMax').value)||10;
    const yMin = -5, yMax = 5;

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.5;
    const xStep = getStep(xMax-xMin), yStep = getStep(yMax-yMin);
    for(let x=Math.ceil(xMin/xStep)*xStep; x<=xMax; x+=xStep) { const sx=toX(x); ctx.beginPath(); ctx.moveTo(sx,0); ctx.lineTo(sx,H); ctx.stroke(); }
    for(let y=Math.ceil(yMin/yStep)*yStep; y<=yMax; y+=yStep) { const sy=toY(y); ctx.beginPath(); ctx.moveTo(0,sy); ctx.lineTo(W,sy); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    if(xMin<=0&&xMax>=0) { const sx=toX(0); ctx.beginPath(); ctx.moveTo(sx,0); ctx.lineTo(sx,H); ctx.stroke(); }
    if(yMin<=0&&yMax>=0) { const sy=toY(0); ctx.beginPath(); ctx.moveTo(0,sy); ctx.lineTo(W,sy); ctx.stroke(); }

    // Function
    if (!expr) return;
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    const steps = W * 2;
    for(let i=0; i<=steps; i++) {
        const x = xMin + (xMax-xMin)*i/steps;
        const y = evalFunc(expr, x);
        if (isFinite(y) && !isNaN(y)) {
            const sx=toX(x), sy=toY(y);
            if(!started) { ctx.moveTo(sx,sy); started=true; } else ctx.lineTo(sx,sy);
        } else started=false;
    }
    ctx.stroke();

    function toX(x) { return (x-xMin)/(xMax-xMin)*W; }
    function toY(y) { return H-(y-yMin)/(yMax-yMin)*H; }
}

function evalFunc(expr, x) {
    try {
        const e = expr.replace(/\^/g,'**').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos')
            .replace(/tan/g,'Math.tan').replace(/ln/g,'Math.log').replace(/log/g,'Math.log10')
            .replace(/sqrt/g,'Math.sqrt').replace(/abs/g,'Math.abs').replace(/exp/g,'Math.exp')
            .replace(/pi/g,'Math.PI').replace(/e(?![xp])/g,'Math.E');
        return new Function('x', `return ${e}`)(x);
    } catch { return NaN; }
}

function getStep(range) { const r=range/8; let p=1; while(p*10<r) p*=10; while(p>r) p/=10; if(r/p>=5) return p*5; if(r/p>=2) return p*2; return p; }

// Equation Solver
let eqType = 'linear';
function setEqType(type, btn) {
    eqType = type;
    document.querySelectorAll('.eq-type button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const c = $('eqInputs');
    if(type==='linear') c.innerHTML=`<div class="eq-input"><label>a</label><input id="eqA" value="2"></div><div class="eq-input"><label>b</label><input id="eqB" value="4"></div>`;
    else if(type==='quadratic') c.innerHTML=`<div class="eq-input"><label>a</label><input id="eqA" value="1"></div><div class="eq-input"><label>b</label><input id="eqB" value="-3"></div><div class="eq-input"><label>c</label><input id="eqC" value="2"></div>`;
    else c.innerHTML=`<div style="display:flex;gap:8px;margin-bottom:8px"><div class="eq-input" style="flex:1"><label>a1</label><input id="eqA1" value="1"></div><div class="eq-input" style="flex:1"><label>b1</label><input id="eqB1" value="1"></div><div class="eq-input" style="flex:1"><label>c1</label><input id="eqC1" value="3"></div></div><div style="display:flex;gap:8px"><div class="eq-input" style="flex:1"><label>a2</label><input id="eqA2" value="2"></div><div class="eq-input" style="flex:1"><label>b2</label><input id="eqB2" value="-1"></div><div class="eq-input" style="flex:1"><label>c2</label><input id="eqC2" value="1"></div></div>`;
}

function solveEquation() {
    const r = $('eqResult');
    try {
        if(eqType==='linear') {
            const a=+$('eqA').value, b=+$('eqB').value;
            r.innerHTML = a===0 ? (b===0?'无穷多解':'无解') : `方程 ${a}x + ${b} = 0<br><b>x = ${fmt(-b/a)}</b>`;
        } else if(eqType==='quadratic') {
            const a=+$('eqA').value, b=+$('eqB').value, c=+$('eqC').value;
            const d=b*b-4*a*c;
            if(d<0) { const re=-b/(2*a), im=Math.sqrt(-d)/(2*a); r.innerHTML=`Δ = ${fmt(d)} < 0<br><b>x₁ = ${fmt(re)} + ${fmt(im)}i</b><br><b>x₂ = ${fmt(re)} - ${fmt(im)}i</b>`; }
            else if(d===0) { r.innerHTML=`Δ = 0<br><b>x = ${fmt(-b/(2*a))}</b>`; }
            else { r.innerHTML=`Δ = ${fmt(d)}<br><b>x₁ = ${fmt((-b+Math.sqrt(d))/(2*a))}</b><br><b>x₂ = ${fmt((-b-Math.sqrt(d))/(2*a))}</b>`; }
        } else {
            const a1=+$('eqA1').value,b1=+$('eqB1').value,c1=+$('eqC1').value;
            const a2=+$('eqA2').value,b2=+$('eqB2').value,c2=+$('eqC2').value;
            const det=a1*b2-a2*b1;
            if(Math.abs(det)<1e-15) { r.innerHTML='无解或无穷多解'; return; }
            r.innerHTML=`<b>x = ${fmt((c1*b2-c2*b1)/det)}</b><br><b>y = ${fmt((a1*c2-a2*c1)/det)}</b>`;
        }
    } catch(e) { r.textContent='错误: '+e.message; }
}

// Unit Converter
const convData = {
    '长度': {'米':1,'千米':1000,'厘米':0.01,'毫米':0.001,'英里':1609.344,'英尺':0.3048,'英寸':0.0254},
    '重量': {'千克':1,'克':0.001,'吨':1000,'磅':0.453592,'盎司':0.0283495},
    '温度': null, '面积': {'平方米':1,'平方千米':1e6,'公顷':10000,'英亩':4046.86,'平方英尺':0.092903},
    '体积': {'升':1,'毫升':0.001,'立方米':1000,'加仑':3.78541},
    '速度': {'米/秒':1,'千米/时':0.277778,'英里/时':0.44704,'节':0.514444},
    '数据': {'B':1,'KB':1024,'MB':1048576,'GB':1073741824,'TB':1099511627776},
    '进制': null
};
let convCat = '长度';
function initConverter() {
    const cats = $('convCats');
    cats.innerHTML = Object.keys(convData).map(c=>`<button class="${c===convCat?'active':''}" onclick="setConvCat('${c}',this)">${c}</button>`).join('');
    loadConvUnits();
}
function setConvCat(c, btn) { convCat=c; document.querySelectorAll('.conv-category button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); loadConvUnits(); }
function loadConvUnits() {
    const u = convData[convCat];
    if(!u) { $('convFromUnit').innerHTML=$('convToUnit').innerHTML='<option>十进制</option><option>二进制</option><option>八进制</option><option>十六进制</option>'; return; }
    const keys = Object.keys(u);
    $('convFromUnit').innerHTML = keys.map(k=>`<option>${k}</option>`).join('');
    $('convToUnit').innerHTML = keys.map(k=>`<option>${k}</option>`).join('');
    if(keys.length>1) $('convToUnit').selectedIndex=1;
    doConvert();
}
function doConvert() {
    const v = parseFloat($('convFrom').value);
    if(convCat==='温度') { $('convTo').value=fmt(convertTemp(v,$('convFromUnit').selectedIndex,$('convToUnit').selectedIndex)); return; }
    if(convCat==='进制') { $('convTo').value=convertBase($('convFrom').value,$('convFromUnit').selectedIndex,$('convToUnit').selectedIndex); return; }
    const u=convData[convCat], keys=Object.keys(u), fi=$('convFromUnit').selectedIndex, ti=$('convToUnit').selectedIndex;
    $('convTo').value=fmt(v*u[keys[fi]]/u[keys[ti]]);
}
function convertTemp(v,f,t) { const c=[v,(v-32)*5/9,v-273.15][f]; return [c,c*9/5+32,c+273.15][t]; }
function convertBase(v,f,t) { const bf=[10,2,8,16][f], bt=[10,2,8,16][t]; try { return parseInt(v,bf).toString(bt).toUpperCase(); } catch { return '错误'; } }
function swapConv() { const f=$('convFromUnit'),t=$('convToUnit'),i=f.selectedIndex; f.selectedIndex=t.selectedIndex; t.selectedIndex=i; doConvert(); }

// History
function renderHistory() {
    const el = $('historyList');
    if(!history.length) { el.innerHTML='<div class="history-empty">暂无计算记录</div>'; return; }
    el.innerHTML = history.map(h=>`<div class="history-item" onclick="useHistory('${h.result}')"><div class="h-expr">${h.expr}</div><div class="h-result">${h.result}</div><div class="h-time">${h.time.toLocaleTimeString()}</div></div>`).join('');
}
function useHistory(v) { calc.display=v; calc.newInput=true; showPanel('basic'); calc.syncDisplay(); }

// fmt is already defined in calc object, use calc.fmt or the global one below
function fmt(v) { if(isNaN(v)) return '错误'; if(!isFinite(v)) return '∞'; if(v===Math.floor(v)&&Math.abs(v)<1e15) return v.toString(); return parseFloat(v.toPrecision(12)).toString(); }

// Keyboard support
document.addEventListener('keydown', e => {
    if(currentPanel!=='basic'&&currentPanel!=='scientific') return;
    const k = e.key;
    if('0123456789'.includes(k)) calc.digit(k);
    else if(k==='.') calc.dot();
    else if(k==='+'||k==='-'||k==='*'||k==='/') calc.op(k);
    else if(k==='Enter'||k==='=') calc.equals();
    else if(k==='Backspace') calc.backspace();
    else if(k==='Escape'||k==='c'||k==='C') calc.clear();
    else if(k==='%') calc.percent();
    else if(k==='(') calc.paren('(');
    else if(k===')') calc.paren(')');
});

// PWA Register
if('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js').catch(()=>{}); }

// Init
window.addEventListener('resize', () => { if(currentPanel==='graph') drawGraph(); });
