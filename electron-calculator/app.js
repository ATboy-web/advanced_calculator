// Advanced Calculator - Electron
const $ = id => document.getElementById(id);
const history = [];
let currentPanel = 'basic';

// ===== Multi-language Support (i18n) =====
const i18n = {
    currentLang: localStorage.getItem('calc-lang') || 'zh',
    
    translations: {
        zh: {
            // Header
            title: '高级计算器', mode: 'DEG',
            // Navigation tabs
            basic: '基础', scientific: '科学', graph: '绘图', equation: '方程',
            matrix: '矩阵', geometry: '几何', '3d': '3D', calculus: '微积分',
            statistics: '概率统计', numbertheory: '数论', algebra: '代数',
            appliedmath: '应用数学', fun: '趣味', converter: '转换', history: '历史',
            tutorial: '教程',
            // Basic calculator
            clear: 'AC', backspace: '⌫', percent: '%', divide: '÷', multiply: '×',
            subtract: '−', add: '+', negate: '±', equals: '=', decimal: '.',
            // Scientific calculator
            shift: '2nd', sin: 'sin', cos: 'cos', tan: 'tan', ln: 'ln', log: 'log',
            sqrt: '√', square: 'x²', power: 'x^y', reciprocal: '1/x', abs: '|x|',
            factorial: 'n!', exp: 'eˣ', ceil: '⌈x⌉', floor: '⌊x⌋',
            // Graph
            graphFunc: 'f(x) = sin(x)', plotBtn: '绘制图像', zoomIn: '+ 放大',
            zoomOut: '- 缩小', reset: '重置', graphHelp: '滚轮缩放 | 拖拽平移 | 双击重置',
            // Equation
            linear: '一元一次', quadratic: '一元二次', system: '二元一次', solve: '求解',
            eqResult: '输入系数后点击求解',
            // Matrix
            add: '加法', subtract: '减法', multiply: '乘法', determinant: '行列式',
            inverse: '逆矩阵', calculate: '计算',
            // Geometry
            circle: '圆', triangle: '三角形', rectangle: '矩形', ellipse: '椭圆',
            trapezoid: '梯形', polygon: '正多边形', sphere: '球体', cylinder: '圆柱体',
            cone: '圆锥体', torus: '圆环体',
            // 3D
            surface: '3D曲面', vector: '向量运算', distance: '两点距离',
            plane: '平面方程', line: '直线方程', curve3d: '参数曲线',
            // Calculus
            derivative: '导数', integral: '积分', limit: '极限', series: '级数',
            taylor: '泰勒展开',
            // Statistics
            combination: '组合', permutation: '排列', descriptive: '描述统计',
            binomial: '二项分布', normal: '正态分布', poisson: '泊松分布',
            // Number Theory
            prime: '素数检测', primeFactor: '素因数分解', gcd: 'GCD/LCM',
            modpow: '模幂运算', euler: '欧拉函数', fibonacci: '斐波那契',
            // Algebra
            cubic: '三次方程', polynomial: '多项式运算', set: '集合运算',
            logic: '逻辑运算', sequence: '数列求和',
            // Applied Math
            newton: '牛顿法', regression: '线性回归', interpolation: '拉格朗日插值',
            numericalIntegral: '数值积分', ode: '微分方程',
            // Fun
            relative: '亲戚计算', loan: '房贷车贷', interest: '年化收益',
            currency: '汇率计算', number: '大写数字', base: '进制计算',
            speed: '速度计算', bmi: 'BMI计算', tax: '个税计算',
            // Converter
            length: '长度', weight: '重量', temperature: '温度', area: '面积',
            volume: '体积', dataSize: '数据', from: '从', to: '到',
            // History
            noHistory: '暂无计算记录',
            // Tutorial
            tutorialTitle: '数学教程', tutorialDesc: '基于 MathWorld 数学百科的交互式学习教程',
            algebraTutorial: '代数入门', calculusTutorial: '微积分基础',
            geometryTutorial: '几何入门', probabilityTutorial: '概率基础',
            linearAlgebraTutorial: '线性代数', trigonometryTutorial: '三角函数',
            // Common
            input: '输入', result: '结果', error: '错误', formula: '公式',
            step: '步骤', example: '示例', explanation: '说明', practice: '练习',
            // Language
            lang: '语言', langZh: '中文', langEn: 'English', langJa: '日本語',
        },
        en: {
            // Header
            title: 'Advanced Calculator', mode: 'DEG',
            // Navigation tabs
            basic: 'Basic', scientific: 'Scientific', graph: 'Graph', equation: 'Equation',
            matrix: 'Matrix', geometry: 'Geometry', '3d': '3D', calculus: 'Calculus',
            statistics: 'Statistics', numbertheory: 'Number Theory', algebra: 'Algebra',
            appliedmath: 'Applied Math', fun: 'Fun', converter: 'Converter', history: 'History',
            tutorial: 'Tutorial',
            // Basic calculator
            clear: 'AC', backspace: '⌫', percent: '%', divide: '÷', multiply: '×',
            subtract: '−', add: '+', negate: '±', equals: '=', decimal: '.',
            // Scientific calculator
            shift: '2nd', sin: 'sin', cos: 'cos', tan: 'tan', ln: 'ln', log: 'log',
            sqrt: '√', square: 'x²', power: 'x^y', reciprocal: '1/x', abs: '|x|',
            factorial: 'n!', exp: 'eˣ', ceil: '⌈x⌉', floor: '⌊x⌋',
            // Graph
            graphFunc: 'f(x) = sin(x)', plotBtn: 'Plot Graph', zoomIn: '+ Zoom In',
            zoomOut: '- Zoom Out', reset: 'Reset', graphHelp: 'Scroll to zoom | Drag to pan | Double-click to reset',
            // Equation
            linear: 'Linear', quadratic: 'Quadratic', system: 'System of 2', solve: 'Solve',
            eqResult: 'Enter coefficients and click Solve',
            // Matrix
            add: 'Add', subtract: 'Subtract', multiply: 'Multiply', determinant: 'Determinant',
            inverse: 'Inverse', calculate: 'Calculate',
            // Geometry
            circle: 'Circle', triangle: 'Triangle', rectangle: 'Rectangle', ellipse: 'Ellipse',
            trapezoid: 'Trapezoid', polygon: 'Polygon', sphere: 'Sphere', cylinder: 'Cylinder',
            cone: 'Cone', torus: 'Torus',
            // 3D
            surface: '3D Surface', vector: 'Vector', distance: 'Distance',
            plane: 'Plane', line: 'Line', curve3d: 'Parametric Curve',
            // Calculus
            derivative: 'Derivative', integral: 'Integral', limit: 'Limit', series: 'Series',
            taylor: 'Taylor Expansion',
            // Statistics
            combination: 'Combination', permutation: 'Permutation', descriptive: 'Descriptive',
            binomial: 'Binomial', normal: 'Normal', poisson: 'Poisson',
            // Number Theory
            prime: 'Prime Test', primeFactor: 'Prime Factors', gcd: 'GCD/LCM',
            modpow: 'Modpow', euler: 'Euler φ', fibonacci: 'Fibonacci',
            // Algebra
            cubic: 'Cubic Eq', polynomial: 'Polynomial', set: 'Set Ops',
            logic: 'Logic', sequence: 'Sequence',
            // Applied Math
            newton: 'Newton Method', regression: 'Linear Regression', interpolation: 'Lagrange',
            numericalIntegral: 'Numerical Integral', ode: 'ODE',
            // Fun
            relative: 'Relative', loan: 'Loan', interest: 'Interest',
            currency: 'Currency', number: 'Chinese Number', base: 'Base Convert',
            speed: 'Speed', bmi: 'BMI', tax: 'Tax',
            // Converter
            length: 'Length', weight: 'Weight', temperature: 'Temperature', area: 'Area',
            volume: 'Volume', dataSize: 'Data', from: 'From', to: 'To',
            // History
            noHistory: 'No calculation history',
            // Tutorial
            tutorialTitle: 'Math Tutorials', tutorialDesc: 'Interactive learning based on MathWorld encyclopedia',
            algebraTutorial: 'Algebra Basics', calculusTutorial: 'Calculus Fundamentals',
            geometryTutorial: 'Geometry Intro', probabilityTutorial: 'Probability Basics',
            linearAlgebraTutorial: 'Linear Algebra', trigonometryTutorial: 'Trigonometry',
            // Common
            input: 'Input', result: 'Result', error: 'Error', formula: 'Formula',
            step: 'Step', example: 'Example', explanation: 'Explanation', practice: 'Practice',
            // Language
            lang: 'Language', langZh: '中文', langEn: 'English', langJa: '日本語',
        },
        ja: {
            // Header
            title: '高度電卓', mode: 'DEG',
            // Navigation tabs
            basic: '基本', scientific: '科学', graph: 'グラフ', equation: '方程式',
            matrix: '行列', geometry: '幾何', '3d': '3D', calculus: '微積分',
            statistics: '統計', numbertheory: '数論', algebra: '代数',
            appliedmath: '応用数学', fun: 'ファン', converter: '変換', history: '履歴',
            tutorial: 'チュートリアル',
            // Basic calculator
            clear: 'AC', backspace: '⌫', percent: '%', divide: '÷', multiply: '×',
            subtract: '−', add: '+', negate: '±', equals: '=', decimal: '.',
            // Scientific calculator
            shift: '2nd', sin: 'sin', cos: 'cos', tan: 'tan', ln: 'ln', log: 'log',
            sqrt: '√', square: 'x²', power: 'x^y', reciprocal: '1/x', abs: '|x|',
            factorial: 'n!', exp: 'eˣ', ceil: '⌈x⌉', floor: '⌊x⌋',
            // Graph
            graphFunc: 'f(x) = sin(x)', plotBtn: 'グラフ描画', zoomIn: '+ 拡大',
            zoomOut: '- 縮小', reset: 'リセット', graphHelp: 'スクロールで拡大 | ドラッグで移動 | ダブルクリックでリセット',
            // Equation
            linear: '一次方程式', quadratic: '二次方程式', system: '連立方程式', solve: '求解',
            eqResult: '係数を入力して求解をクリック',
            // Matrix
            add: '加算', subtract: '減算', multiply: '乗算', determinant: '行列式',
            inverse: '逆行列', calculate: '計算',
            // Geometry
            circle: '円', triangle: '三角形', rectangle: '長方形', ellipse: '楕円',
            trapezoid: '台形', polygon: '正多角形', sphere: '球', cylinder: '円柱',
            cone: '円錐', torus: 'トーラス',
            // 3D
            surface: '3D曲面', vector: 'ベクトル', distance: '距離',
            plane: '平面', line: '直線', curve3d: 'パラメトリック曲線',
            // Calculus
            derivative: '微分', integral: '積分', limit: '極限', series: '級数',
            taylor: 'テイラー展開',
            // Statistics
            combination: '組合せ', permutation: '順列', descriptive: '記述統計',
            binomial: '二項分布', normal: '正規分布', poisson: 'ポアソン分布',
            // Number Theory
            prime: '素数判定', primeFactor: '素因数分解', gcd: 'GCD/LCM',
            modpow: 'べき剰余', euler: 'オイラーφ', fibonacci: 'フィボナッチ',
            // Algebra
            cubic: '三次方程式', polynomial: '多項式', set: '集合演算',
            logic: '論理演算', sequence: '数列',
            // Applied Math
            newton: 'ニュートン法', regression: '線形回帰', interpolation: 'ラグランジュ',
            numericalIntegral: '数値積分', ode: '微分方程式',
            // Fun
            relative: '親戚計算', loan: 'ローン', interest: '利息',
            currency: '通貨', number: '大文字数字', base: '進数変換',
            speed: '速度', bmi: 'BMI', tax: '税金',
            // Converter
            length: '長さ', weight: '重さ', temperature: '温度', area: '面積',
            volume: '体積', dataSize: 'データ', from: 'から', to: 'まで',
            // History
            noHistory: '計算履歴がありません',
            // Tutorial
            tutorialTitle: '数学チュートリアル', tutorialDesc: 'MathWorld百科事典に基づくインタラクティブ学習',
            algebraTutorial: '代数の基礎', calculusTutorial: '微積分の基礎',
            geometryTutorial: '幾何学入門', probabilityTutorial: '確率の基礎',
            linearAlgebraTutorial: '線形代数', trigonometryTutorial: '三角関数',
            // Common
            input: '入力', result: '結果', error: 'エラー', formula: '公式',
            step: 'ステップ', example: '例', explanation: '説明', practice: '練習',
            // Language
            lang: '言語', langZh: '中文', langEn: 'English', langJa: '日本語',
        }
    },
    
    t(key) {
        return this.translations[this.currentLang]?.[key] || this.translations.zh[key] || key;
    },
    
    setLang(lang) {
        this.currentLang = lang;
        localStorage.setItem('calc-lang', lang);
        this.updateUI();
        document.documentElement.setAttribute('lang', lang);
    },
    
    updateUI() {
        // Update header title
        const title = document.querySelector('.header h1');
        if (title) title.textContent = this.t('title');
        
        // Update mode badge
        const modeLabel = $('modeLabel');
        if (modeLabel) modeLabel.textContent = this.t('mode');
        
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            const onclick = tab.getAttribute('onclick');
            if (onclick) {
                const match = onclick.match(/showPanel\('(\w+)'\)/);
                if (match) {
                    const key = match[1];
                    tab.textContent = this.t(key);
                }
            }
        });
        
        // Update nav items (sidebar)
        document.querySelectorAll('.nav-item').forEach(item => {
            const panel = item.dataset.panel;
            if (panel) {
                const emoji = item.querySelector('.emoji');
                const emojiText = emoji ? emoji.textContent + ' ' : '';
                item.innerHTML = emojiText + this.t(panel);
            }
        });
        
        // Update equation type buttons
        this.updateEqTypeButtons('equation', ['linear', 'quadratic', 'system']);
        this.updateEqTypeButtons('matrix', ['add', 'subtract', 'multiply', 'determinant', 'inverse']);
        this.updateEqTypeButtons('geometry', ['circle', 'triangle', 'rectangle', 'ellipse', 'trapezoid', 'polygon', 'sphere', 'cylinder', 'cone', 'torus']);
        this.updateEqTypeButtons('calculus', ['derivative', 'integral', 'limit', 'series', 'taylor']);
        this.updateEqTypeButtons('statistics', ['combination', 'permutation', 'descriptive', 'binomial', 'normal', 'poisson']);
        this.updateEqTypeButtons('numbertheory', ['prime', 'primeFactor', 'gcd', 'modpow', 'euler', 'fibonacci']);
        this.updateEqTypeButtons('algebra', ['cubic', 'polynomial', 'set', 'logic', 'sequence']);
        this.updateEqTypeButtons('appliedmath', ['newton', 'regression', 'interpolation', 'numericalIntegral', 'ode']);
        this.updateEqTypeButtons('fun', ['relative', 'loan', 'interest', 'currency', 'number', 'base', 'speed', 'bmi', 'tax']);
        
        // Update 3D type buttons
        const threeDButtons = document.querySelectorAll('#threeDTypeButtons button');
        const threeDKeys = ['surface', 'vector', 'distance', 'plane', 'line', 'curve3d'];
        threeDButtons.forEach((btn, i) => {
            if (threeDKeys[i]) btn.textContent = this.t(threeDKeys[i]);
        });
        
        // Update graph controls
        const graphFunc = $('graphFunc');
        if (graphFunc) graphFunc.placeholder = this.t('graphFunc');
        const plotBtn = document.querySelector('.graph-btn');
        if (plotBtn) plotBtn.textContent = this.t('plotBtn');
        const graphHelp = document.querySelector('.graph-info');
        if (graphHelp) graphHelp.textContent = this.t('graphHelp');
        
        // Update converter categories
        this.updateConvCategories();
        
        // Update history empty message
        const historyEmpty = document.querySelector('.history-empty');
        if (historyEmpty && history.length === 0) historyEmpty.textContent = this.t('noHistory');
        
        // Update tutorial panel if exists
        this.updateTutorialPanel();
        // Re-render tutorial content with new language
        if (currentPanel === 'tutorial') renderTutorial();
    },
    
    updateEqTypeButtons(panelId, keys) {
        const panel = $(panelId);
        if (!panel) return;
        const buttons = panel.querySelectorAll('.eq-type button');
        buttons.forEach((btn, i) => {
            if (keys[i]) btn.textContent = this.t(keys[i]);
        });
    },
    
    updateConvCategories() {
        const cats = Object.keys(convData);
        const container = $('convCats');
        if (!container) return;
        container.innerHTML = cats.map((c, i) => 
            `<button ${i===0?'class="active"':''} onclick="setConvCat('${c}',this)">${this.t(c.toLowerCase()) || c}</button>`
        ).join('');
    },
    
    updateTutorialPanel() {
        const tutorialBtns = document.querySelectorAll('#tutorial .eq-type button');
        const tutorialKeys = ['algebraTutorial', 'calculusTutorial', 'geometryTutorial', 'probabilityTutorial', 'linearAlgebraTutorial', 'trigonometryTutorial'];
        tutorialBtns.forEach((btn, i) => {
            if (tutorialKeys[i]) btn.textContent = this.t(tutorialKeys[i]);
        });
    }
};

// Language switcher function
function setLanguage(lang) {
    i18n.setLang(lang);
    const langBtn = $('langSelector');
    if (langBtn) {
        const langNames = { zh: '中文', en: 'EN', ja: '日本語' };
        langBtn.textContent = langNames[lang] || lang;
    }
    const menu = $('langMenu');
    if (menu) menu.classList.remove('show');
}

function toggleLangMenu() {
    const menu = $('langMenu');
    if (menu) menu.classList.toggle('show');
}
// Close lang menu on outside click
document.addEventListener('click', function(e) {
    const dd = document.querySelector('.lang-dropdown');
    if (dd && !dd.contains(e.target)) {
        const menu = $('langMenu');
        if (menu) menu.classList.remove('show');
    }
});

// Panel switching
function showPanel(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    // Support both old tab-style and new sidebar nav-item style
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
    $(name).classList.add('active');
    // Try old tab selector first, then new nav-item selector
    const tab = document.querySelector(`.tab[onclick="showPanel('${name}')"]`);
    if (tab) tab.classList.add('active');
    const navItem = document.querySelector(`.nav-item[data-panel="${name}"]`);
    if (navItem) navItem.classList.add('active');
    currentPanel = name;
    if (name === 'graph') { graphView.syncFromInputs(); drawGraph(); }
    if (name === 'converter') initConverter();
    if (name === 'equation') setEqType('linear', document.querySelector('.eq-type button'));
    if (name === 'matrix') updateMatrixInputs();
    if (name === 'geometry') updateGeometryInputs();
    if (name === '3d') update3DInputs();
    if (name === 'fun') updateFunInputs();
    if (name === 'calculus') updateCalculusInputs();
    if (name === 'statistics') updateStatInputs();
    if (name === 'numbertheory') updateNumTheoryInputs();
    if (name === 'algebra') updateAlgebraInputs();
    if (name === 'appliedmath') updateAppliedInputs();
    if (name === 'tutorial') setTutorialType('algebra');
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

// Graphing - with interactive zoom/pan
const graphView = {
    xMin: -10, xMax: 10, yMin: -5, yMax: 5,
    dragging: false, lastX: 0, lastY: 0,
    reset() {
        this.xMin = parseFloat($('xMin').value) || -10;
        this.xMax = parseFloat($('xMax').value) || 10;
        const yRange = (this.xMax - this.xMin) * 0.5;
        this.yMin = -yRange; this.yMax = yRange;
    },
    syncFromInputs() {
        this.xMin = parseFloat($('xMin').value) || -10;
        this.xMax = parseFloat($('xMax').value) || 10;
        const yRange = (this.xMax - this.xMin) * 0.5;
        this.yMin = -yRange; this.yMax = yRange;
    }
};

function drawGraph() {
    const canvas = $('graphCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = rect.width, H = rect.height;

    const expr = $('graphFunc').value.trim();
    const xMin = graphView.xMin, xMax = graphView.xMax;
    const yMin = graphView.yMin, yMax = graphView.yMax;

    // Determine current theme for colors
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bgColor = isDark ? '#0d1117' : '#f8f9fa';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
    const axisColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)';
    const labelColor = isDark ? 'rgba(150,180,220,0.8)' : 'rgba(60,80,120,0.85)';
    const dotColor = isDark ? 'rgba(100,150,220,0.6)' : 'rgba(60,100,180,0.5)';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // Calculate axis positions for label placement
    const axisX = (0 >= xMin && 0 <= xMax) ? toX(0) : null;
    const axisY = (0 >= yMin && 0 <= yMax) ? toY(0) : null;

    const xStep = getStep(xMax-xMin), yStep = getStep(yMax-yMin);
    const xDecimals = xStep < 1 ? Math.max(1, -Math.floor(Math.log10(xStep))) : 0;
    const yDecimals = yStep < 1 ? Math.max(1, -Math.floor(Math.log10(yStep))) : 0;

    // --- Draw vertical grid lines with numbers on them ---
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = gridColor;
    ctx.font = '11px sans-serif';
    for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
        if (Math.abs(x) < xStep * 0.001) continue; // skip 0, handled by axis
        const sx = toX(x);
        ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();

        // Place number ON the axis line (Y=0 line) or at top/bottom if no X axis visible
        const labelY = axisY !== null ? axisY : 14;
        ctx.fillStyle = labelColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = axisY !== null ? 'bottom' : 'top';
        ctx.fillText(x.toFixed(xDecimals), sx, labelY - 4);

        // Small dot at axis intersection
        if (axisY !== null) {
            ctx.fillStyle = dotColor;
            ctx.beginPath(); ctx.arc(sx, axisY, 2.5, 0, Math.PI*2); ctx.fill();
        }
    }

    // --- Draw horizontal grid lines with numbers on them ---
    for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
        if (Math.abs(y) < yStep * 0.001) continue; // skip 0
        const sy = toY(y);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();

        // Place number ON the axis line (X=0 line) or at left/right if no Y axis visible
        const labelX = axisX !== null ? axisX : 6;
        ctx.fillStyle = labelColor;
        ctx.textAlign = axisX !== null ? 'left' : 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(y.toFixed(yDecimals), labelX + 4, sy);

        // Small dot at axis intersection
        if (axisX !== null) {
            ctx.fillStyle = dotColor;
            ctx.beginPath(); ctx.arc(axisX, sy, 2.5, 0, Math.PI*2); ctx.fill();
        }
    }

    // --- Draw grid intersection dots ---
    ctx.fillStyle = dotColor;
    for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
        for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
            if (Math.abs(x) < xStep * 0.001 || Math.abs(y) < yStep * 0.001) continue;
            const sx = toX(x), sy = toY(y);
            ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI*2); ctx.fill();
        }
    }

    // --- Axes ---
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    if (axisX !== null) { ctx.beginPath(); ctx.moveTo(axisX, 0); ctx.lineTo(axisX, H); ctx.stroke(); }
    if (axisY !== null) { ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(W, axisY); ctx.stroke(); }

    // --- Origin label ---
    if (axisX !== null && axisY !== null) {
        ctx.fillStyle = labelColor;
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('0', axisX + 4, axisY - 4);
        // Origin dot
        ctx.fillStyle = dotColor;
        ctx.beginPath(); ctx.arc(axisX, axisY, 3, 0, Math.PI*2); ctx.fill();
    }

    // --- Function curves ---
    const funcs = expr.split(';').map(s=>s.trim()).filter(s=>s);
    const colors = ['#4fc3f7','#f87171','#34d399','#fb923c','#a78bfa','#f472b6'];
    funcs.forEach((fn, fi) => {
        ctx.strokeStyle = colors[fi % colors.length];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let started = false;
        const steps = W * 2;
        for (let i = 0; i <= steps; i++) {
            const x = xMin + (xMax-xMin)*i/steps;
            const y = evalFunc(fn, x);
            if (isFinite(y) && !isNaN(y)) {
                const sx=toX(x), sy=toY(y);
                if (!started) { ctx.moveTo(sx,sy); started=true; } else ctx.lineTo(sx,sy);
            } else started = false;
        }
        ctx.stroke();
    });

    // Info overlay
    const info = $('graphInfo');
    if (info) info.textContent = `x∈[${xMin.toFixed(1)}, ${xMax.toFixed(1)}]  y∈[${yMin.toFixed(1)}, ${yMax.toFixed(1)}] | 滚轮缩放 | 拖拽平移 | 双击重置`;

    function toX(x) { return (x-xMin)/(xMax-xMin)*W; }
    function toY(y) { return H-(y-yMin)/(yMax-yMin)*H; }
}

function graphZoom(factor) {
    const cx = (graphView.xMin + graphView.xMax) / 2;
    const cy = (graphView.yMin + graphView.yMax) / 2;
    const xHalf = (graphView.xMax - graphView.xMin) / 2 / factor;
    const yHalf = (graphView.yMax - graphView.yMin) / 2 / factor;
    graphView.xMin = cx - xHalf; graphView.xMax = cx + xHalf;
    graphView.yMin = cy - yHalf; graphView.yMax = cy + yHalf;
    drawGraph();
}

function graphReset() {
    graphView.reset();
    drawGraph();
    // Update info display
    const info = $('graphInfo');
    if(info) info.textContent = '滚轮缩放 | 拖拽平移 | 双击重置';
}

// Graph mouse interactions
(function initGraphInteractions() {
    const setup = () => {
        const canvas = $('graphCanvas');
        if (!canvas) return;
        // Mouse wheel zoom
        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const mx = (e.clientX - rect.left) / rect.width;
            const my = (e.clientY - rect.top) / rect.height;
            const x = graphView.xMin + (graphView.xMax - graphView.xMin) * mx;
            const y = graphView.yMax - (graphView.yMax - graphView.yMin) * my;
            const factor = e.deltaY < 0 ? 1.2 : 1/1.2;
            graphView.xMin = x - (x - graphView.xMin) / factor;
            graphView.xMax = x + (graphView.xMax - x) / factor;
            graphView.yMin = y - (y - graphView.yMin) / factor;
            graphView.yMax = y + (graphView.yMax - y) / factor;
            drawGraph();
        }, { passive: false });
        // Drag pan
        canvas.addEventListener('mousedown', e => {
            graphView.dragging = true;
            graphView.lastX = e.clientX;
            graphView.lastY = e.clientY;
            canvas.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', e => {
            if (!graphView.dragging) return;
            const rect = canvas.getBoundingClientRect();
            const dx = (e.clientX - graphView.lastX) / rect.width * (graphView.xMax - graphView.xMin);
            const dy = (e.clientY - graphView.lastY) / rect.height * (graphView.yMax - graphView.yMin);
            graphView.xMin -= dx; graphView.xMax -= dx;
            graphView.yMin += dy; graphView.yMax += dy;
            graphView.lastX = e.clientX;
            graphView.lastY = e.clientY;
            drawGraph();
        });
        window.addEventListener('mouseup', () => {
            graphView.dragging = false;
            if(canvas) canvas.style.cursor = 'crosshair';
        });
        // Double-click reset
        canvas.addEventListener('dblclick', () => graphReset());
        // Touch support
        let lastTouchDist = 0;
        canvas.addEventListener('touchstart', e => {
            if(e.touches.length === 1) {
                graphView.dragging = true;
                graphView.lastX = e.touches[0].clientX;
                graphView.lastY = e.touches[0].clientY;
            } else if(e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                lastTouchDist = Math.sqrt(dx*dx + dy*dy);
            }
            e.preventDefault();
        }, { passive: false });
        canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            if(e.touches.length === 1 && graphView.dragging) {
                const rect = canvas.getBoundingClientRect();
                const dx = (e.touches[0].clientX - graphView.lastX) / rect.width * (graphView.xMax - graphView.xMin);
                const dy = (e.touches[0].clientY - graphView.lastY) / rect.height * (graphView.yMax - graphView.yMin);
                graphView.xMin -= dx; graphView.xMax -= dx;
                graphView.yMin += dy; graphView.yMax += dy;
                graphView.lastX = e.touches[0].clientX;
                graphView.lastY = e.touches[0].clientY;
                drawGraph();
            } else if(e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if(lastTouchDist > 0) {
                    const factor = dist / lastTouchDist;
                    const cx = (graphView.xMin + graphView.xMax) / 2;
                    const cy = (graphView.yMin + graphView.yMax) / 2;
                    const xHalf = (graphView.xMax - graphView.xMin) / 2 / factor;
                    const yHalf = (graphView.yMax - graphView.yMin) / 2 / factor;
                    graphView.xMin = cx - xHalf; graphView.xMax = cx + xHalf;
                    graphView.yMin = cy - yHalf; graphView.yMax = cy + yHalf;
                    drawGraph();
                }
                lastTouchDist = dist;
            }
        }, { passive: false });
        canvas.addEventListener('touchend', () => { graphView.dragging = false; lastTouchDist = 0; });
    };
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
    else setup();
})();

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
    document.querySelectorAll('#equation .eq-type button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const c = $('eqInputs');
    if(type==='linear') c.innerHTML=`<div class="eq-input"><label>a (x的系数)</label><input id="eqA" value="2"><div class="input-desc">方程 ax + b = 0 中 x 的系数</div></div><div class="eq-input"><label>b (常数项)</label><input id="eqB" value="4"><div class="input-desc">方程 ax + b = 0 中的常数</div></div>`;
    else if(type==='quadratic') c.innerHTML=`<div class="eq-input"><label>a (x²系数)</label><input id="eqA" value="1"><div class="input-desc">二次项系数，不能为0</div></div><div class="eq-input"><label>b (x系数)</label><input id="eqB" value="-3"><div class="input-desc">一次项系数</div></div><div class="eq-input"><label>c (常数项)</label><input id="eqC" value="2"><div class="input-desc">方程 ax²+bx+c=0 中的常数</div></div>`;
    else c.innerHTML=`<div style="display:flex;gap:8px;margin-bottom:8px"><div class="eq-input" style="flex:1"><label>a₁</label><input id="eqA1" value="1"><div class="input-desc">第一个方程 x 系数</div></div><div class="eq-input" style="flex:1"><label>b₁</label><input id="eqB1" value="1"><div class="input-desc">第一个方程 y 系数</div></div><div class="eq-input" style="flex:1"><label>c₁</label><input id="eqC1" value="3"><div class="input-desc">第一个方程常数</div></div></div><div style="display:flex;gap:8px"><div class="eq-input" style="flex:1"><label>a₂</label><input id="eqA2" value="2"><div class="input-desc">第二个方程 x 系数</div></div><div class="eq-input" style="flex:1"><label>b₂</label><input id="eqB2" value="-1"><div class="input-desc">第二个方程 y 系数</div></div><div class="eq-input" style="flex:1"><label>c₂</label><input id="eqC2" value="1"><div class="input-desc">第二个方程常数</div></div></div>`;
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

// Init
window.addEventListener('resize', () => {
    if(currentPanel==='graph') drawGraph();
    if(currentPanel==='geometry') drawGeometry();
    if(currentPanel==='3d') {
        if (threeRenderer && threeCamera) {
            const container = $('threeDCanvas').parentElement;
            const rect = container.getBoundingClientRect();
            threeCamera.aspect = rect.width / 360;
            threeCamera.updateProjectionMatrix();
            threeRenderer.setSize(rect.width, 360);
        }
        draw3D();
    }
});

// Matrix Calculator
let matrixOp = 'add';
function setMatrixOp(op, btn) {
    matrixOp = op;
    document.querySelectorAll('#matrix .eq-type button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    updateMatrixInputs();
}

function updateMatrixInputs() {
    const container = $('matrixInputs');
    if (matrixOp === 'determinant' || matrixOp === 'inverse') {
        container.innerHTML = `
            <div class="matrix-label">矩阵 A (3×3)</div>
            <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr)">
                <input id="m11" value="1"><input id="m12" value="2"><input id="m13" value="3">
                <input id="m21" value="4"><input id="m22" value="5"><input id="m23" value="6">
                <input id="m31" value="7"><input id="m32" value="8"><input id="m33" value="10">
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="matrix-label">矩阵 A (2×2)</div>
            <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr)">
                <input id="a11" value="1"><input id="a12" value="2">
                <input id="a21" value="3"><input id="a22" value="4">
            </div>
            <div class="matrix-label">矩阵 B (2×2)</div>
            <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr)">
                <input id="b11" value="5"><input id="b12" value="6">
                <input id="b21" value="7"><input id="b22" value="8">
            </div>
        `;
    }
}

function calculateMatrix() {
    const result = $('matrixResult');
    try {
        if (matrixOp === 'add' || matrixOp === 'subtract') {
            const a = [[+$('a11').value, +$('a12').value], [+$('a21').value, +$('a22').value]];
            const b = [[+$('b11').value, +$('b12').value], [+$('b21').value, +$('b22').value]];
            const c = [[0,0],[0,0]];
            const op = matrixOp === 'add' ? '+' : '-';
            for(let i=0;i<2;i++) for(let j=0;j<2;j++) c[i][j] = matrixOp==='add' ? a[i][j]+b[i][j] : a[i][j]-b[i][j];
            result.innerHTML = `
                <div class="formula-box">矩阵${op}法: C = A ${op} B</div>
                <div class="process-box">逐元素计算: c[i][j] = a[i][j] ${op} b[i][j]</div>
                <div class="matrix-result">结果矩阵:\n${c[0][0]}  ${c[0][1]}\n${c[1][0]}  ${c[1][1]}</div>`;
        } else if (matrixOp === 'multiply') {
            const a = [[+$('a11').value, +$('a12').value], [+$('a21').value, +$('a22').value]];
            const b = [[+$('b11').value, +$('b12').value], [+$('b21').value, +$('b22').value]];
            const c = [[0,0],[0,0]];
            for(let i=0;i<2;i++) for(let j=0;j<2;j++) for(let k=0;k<2;k++) c[i][j] += a[i][k]*b[k][j];
            result.innerHTML = `
                <div class="formula-box">矩阵乘法: C[i][j] = Σ A[i][k] × B[k][j]</div>
                <div class="process-box">c[0][0] = ${a[0][0]}×${b[0][0]} + ${a[0][1]}×${b[1][0]} = ${c[0][0]}</div>
                <div class="matrix-result">结果矩阵:\n${c[0][0]}  ${c[0][1]}\n${c[1][0]}  ${c[1][1]}</div>`;
        } else if (matrixOp === 'determinant') {
            const m = [[+$('m11').value, +$('m12').value, +$('m13').value],
                       [+$('m21').value, +$('m22').value, +$('m23').value],
                       [+$('m31').value, +$('m32').value, +$('m33').value]];
            const cofactor00 = m[1][1]*m[2][2]-m[1][2]*m[2][1];
            const cofactor01 = m[1][0]*m[2][2]-m[1][2]*m[2][0];
            const cofactor02 = m[1][0]*m[2][1]-m[1][1]*m[2][0];
            const det = m[0][0]*cofactor00 - m[0][1]*cofactor01 + m[0][0]*cofactor02;
            result.innerHTML = `
                <div class="formula-box">行列式公式: |A| = a₁₁(a₂₂a₃₃-a₂₃a₃₂) - a₁₂(a₂₁a₃₃-a₂₃a₃₁) + a₁₃(a₂₁a₃₂-a₂₂a₃₁)</div>
                <div class="process-box">代入计算: det = ${m[0][0]}×${cofactor00} - ${m[0][1]}×${cofactor01} + ${m[0][2]}×${cofactor02} = ${det}</div>
                <div class="matrix-result">行列式 = ${det}</div>`;
        } else if (matrixOp === 'inverse') {
            const m = [[+$('m11').value, +$('m12').value, +$('m13').value],
                       [+$('m21').value, +$('m22').value, +$('m23').value],
                       [+$('m31').value, +$('m32').value, +$('m33').value]];
            const det = m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1]) -
                       m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0]) +
                       m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
            if (Math.abs(det) < 1e-10) {
                result.innerHTML = '<div class="formula-box">逆矩阵公式: A⁻¹ = adj(A) / |A|</div><div class="matrix-result">矩阵不可逆 (行列式为0)</div>';
                return;
            }
            const inv = [[0,0,0],[0,0,0],[0,0,0]];
            inv[0][0] = (m[1][1]*m[2][2]-m[1][2]*m[2][1])/det;
            inv[0][1] = (m[0][2]*m[2][1]-m[0][1]*m[2][2])/det;
            inv[0][2] = (m[0][1]*m[1][2]-m[0][2]*m[1][1])/det;
            inv[1][0] = (m[1][2]*m[2][0]-m[1][0]*m[2][2])/det;
            inv[1][1] = (m[0][0]*m[2][2]-m[0][2]*m[2][0])/det;
            inv[1][2] = (m[0][2]*m[1][0]-m[0][0]*m[1][2])/det;
            inv[2][0] = (m[1][0]*m[2][1]-m[1][1]*m[2][0])/det;
            inv[2][1] = (m[0][1]*m[2][0]-m[0][0]*m[2][1])/det;
            inv[2][2] = (m[0][0]*m[1][1]-m[0][1]*m[1][0])/det;
            result.innerHTML = `
                <div class="formula-box">逆矩阵: A⁻¹ = adj(A) / |A|</div>
                <div class="process-box">|A| = ${det.toFixed(4)}, 伴随矩阵除以行列式</div>
                <div class="matrix-result">逆矩阵:\n${inv[0][0].toFixed(4)}  ${inv[0][1].toFixed(4)}  ${inv[0][2].toFixed(4)}\n${inv[1][0].toFixed(4)}  ${inv[1][1].toFixed(4)}  ${inv[1][2].toFixed(4)}\n${inv[2][0].toFixed(4)}  ${inv[2][1].toFixed(4)}  ${inv[2][2].toFixed(4)}</div>`;
        }
    } catch(e) {
        result.textContent = '错误: ' + e.message;
    }
}

// Geometry Tools
let geometryType = 'circle';
function setGeometryType(type, btn) {
    geometryType = type;
    document.querySelectorAll('#geometry .eq-type button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    updateGeometryInputs();
}

function updateGeometryInputs() {
    const container = $('geometryInputs');
    switch(geometryType) {
        case 'circle':
            container.innerHTML = `
                <div class="eq-input"><label>半径 (r)</label><input id="geoRadius" value="5"><div class="input-desc">圆的半径长度，单位任意</div></div>
            `;
            break;
        case 'triangle':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>边长 a</label><input id="geoA" value="3"><div class="input-desc">对角A的边长</div></div>
                    <div class="eq-input" style="flex:1"><label>边长 b</label><input id="geoB" value="4"><div class="input-desc">对角B的边长</div></div>
                    <div class="eq-input" style="flex:1"><label>边长 c</label><input id="geoC" value="5"><div class="input-desc">对角C的边长</div></div>
                </div>
                <div class="input-desc">需满足三角不等式: 任意两边之和大于第三边</div>
            `;
            break;
        case 'rectangle':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>长度</label><input id="geoLength" value="10"><div class="input-desc">矩形的长</div></div>
                    <div class="eq-input" style="flex:1"><label>宽度</label><input id="geoWidth" value="5"><div class="input-desc">矩形的宽</div></div>
                </div>
            `;
            break;
        case 'ellipse':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>半长轴 (a)</label><input id="geoA" value="6"><div class="input-desc">椭圆X方向半径</div></div>
                    <div class="eq-input" style="flex:1"><label>半短轴 (b)</label><input id="geoB" value="4"><div class="input-desc">椭圆Y方向半径</div></div>
                </div>
            `;
            break;
        case 'trapezoid':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>上底 (a)</label><input id="geoA" value="4"><div class="input-desc">梯形上边长度</div></div>
                    <div class="eq-input" style="flex:1"><label>下底 (b)</label><input id="geoB" value="8"><div class="input-desc">梯形下边长度</div></div>
                    <div class="eq-input" style="flex:1"><label>高 (h)</label><input id="geoHeight" value="5"><div class="input-desc">上下底之间的距离</div></div>
                    <div class="eq-input" style="flex:1"><label>腰 (c)</label><input id="geoC" value="5"><div class="input-desc">等腰梯形的腰长</div></div>
                </div>
            `;
            break;
        case 'polygon':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>边数 (n)</label><input id="geoN" value="6"><div class="input-desc">正多边形的边数 (≥3)</div></div>
                    <div class="eq-input" style="flex:1"><label>边长 (a)</label><input id="geoA" value="5"><div class="input-desc">每条边的长度</div></div>
                </div>
            `;
            break;
        case 'sphere':
            container.innerHTML = `
                <div class="eq-input"><label>半径 (r)</label><input id="geoRadius" value="5"><div class="input-desc">球心到球面的距离</div></div>
            `;
            break;
        case 'cylinder':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>底面半径 (r)</label><input id="geoRadius" value="3"><div class="input-desc">圆形底面的半径</div></div>
                    <div class="eq-input" style="flex:1"><label>高度 (h)</label><input id="geoHeight" value="10"><div class="input-desc">圆柱体的高度</div></div>
                </div>
            `;
            break;
        case 'cone':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>底面半径 (r)</label><input id="geoRadius" value="3"><div class="input-desc">圆形底面的半径</div></div>
                    <div class="eq-input" style="flex:1"><label>高度 (h)</label><input id="geoHeight" value="8"><div class="input-desc">顶点到底面的距离</div></div>
                </div>
                <div class="input-desc">母线长 l = √(r²+h²) 将自动计算</div>
            `;
            break;
        case 'torus':
            container.innerHTML = `
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>大半径 (R)</label><input id="geoR" value="5"><div class="input-desc">圆环中心到管中心的距离</div></div>
                    <div class="eq-input" style="flex:1"><label>小半径 (r)</label><input id="geoRadius" value="2"><div class="input-desc">管的半径</div></div>
                </div>
            `;
            break;
    }
    setTimeout(drawGeometry, 50);
}

function drawGeometry() {
    const canvas = $('geometryCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = 220 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = rect.width, H = 220;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';

    switch(geometryType) {
        case 'circle': {
            const r = +($('geoRadius') ? $('geoRadius').value : 5);
            const cx = W/2, cy = H/2, maxR = Math.min(W, H)/2 - 40;
            const sc = maxR / Math.max(r, 1), dr = r * sc;
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, dr, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.12)'; ctx.fill();
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5; ctx.setLineDash([5,5]);
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+dr, cy); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = '#f87171'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
            ctx.font = '13px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`r = ${r}`, cx+dr/2, cy-12);
            ctx.fillStyle = '#f87171'; ctx.fillText('O', cx-14, cy+16);
            // Draw diameter
            ctx.strokeStyle = 'rgba(251,146,60,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
            ctx.beginPath(); ctx.moveTo(cx-dr, cy); ctx.lineTo(cx+dr, cy); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = '#fb923c'; ctx.font = '11px sans-serif';
            ctx.fillText(`d = ${2*r}`, cx, cy+dr+20);
            break;
        }
        case 'triangle': {
            const a = +($('geoA') ? $('geoA').value : 3);
            const b = +($('geoB') ? $('geoB').value : 4);
            const c = +($('geoC') ? $('geoC').value : 5);
            // Calculate triangle vertices using law of cosines
            const cosA = (b*b + c*c - a*a) / (2*b*c);
            const sinA = Math.sqrt(1 - cosA*cosA);
            const sc = Math.min(W-80, H-60) / Math.max(a, b, c, 1);
            const ax = W/2 - (c*sc)/2, ay = H/2 + 30;
            const bx = ax + c*sc, by = ay;
            const cx2 = ax + b*sc*cosA, cy2 = ay - b*sc*sinA;
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx2, cy2); ctx.closePath(); ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.1)'; ctx.fill();
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`a = ${a}`, (bx+cx2)/2+18, (by+cy2)/2);
            ctx.fillText(`b = ${b}`, (ax+cx2)/2-18, (ay+cy2)/2);
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`c = ${c}`, (ax+bx)/2, ay+18);
            // Right angle mark for 3-4-5
            if(Math.abs(a*a+b*b-c*c)<0.01 || Math.abs(a*a+c*c-b*b)<0.01 || Math.abs(b*b+c*c-a*a)<0.01) {
                const s = 10;
                ctx.strokeStyle = 'rgba(248,113,113,0.6)'; ctx.lineWidth = 1;
                ctx.strokeRect(cx2, cy2, s, s);
            }
            break;
        }
        case 'rectangle': {
            const l = +($('geoLength') ? $('geoLength').value : 10);
            const w = +($('geoWidth') ? $('geoWidth').value : 5);
            const sc = Math.min((W-80)/l, (H-60)/w);
            const rw = l*sc, rh = w*sc;
            const rx = (W-rw)/2, ry = (H-rh)/2;
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.strokeRect(rx, ry, rw, rh);
            ctx.fillStyle = 'rgba(79,195,247,0.1)'; ctx.fillRect(rx, ry, rw, rh);
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`长度 = ${l}`, W/2, ry-10);
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`宽度 = ${w}`, rx-30, H/2);
            // Diagonal
            ctx.strokeStyle = 'rgba(248,113,113,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx+rw, ry+rh); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = '#f87171'; ctx.font = '11px sans-serif';
            ctx.fillText(`对角线 = ${fmt(Math.sqrt(l*l+w*w))}`, W/2+rw/4, H/2+rh/4-10);
            break;
        }
        case 'sphere': {
            const r = +($('geoRadius') ? $('geoRadius').value : 5);
            const cx = W/2, cy = H/2, maxR = Math.min(W, H)/2 - 40;
            const sc = maxR / Math.max(r, 1), dr = r * sc;
            // Outer circle
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, dr, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.08)'; ctx.fill();
            // Latitude ellipses
            for(let i=-2;i<=2;i++) {
                const yOff = i*dr/3, latR = Math.sqrt(dr*dr - yOff*yOff);
                ctx.strokeStyle = 'rgba(99,102,241,0.3)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.ellipse(cx, cy+yOff, latR, latR*0.3, 0, 0, Math.PI*2); ctx.stroke();
            }
            // Longitude ellipses
            for(let i=0;i<4;i++) {
                const angle = i*Math.PI/4;
                ctx.strokeStyle = 'rgba(99,102,241,0.3)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.ellipse(cx, cy, dr*Math.abs(Math.cos(angle)), dr, 0, 0, Math.PI*2); ctx.stroke();
            }
            // Radius
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+dr, cy); ctx.stroke(); ctx.setLineDash([]);
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`r = ${r}`, cx+dr/2, cy-12);
            break;
        }
        case 'cylinder': {
            const r = +($('geoRadius') ? $('geoRadius').value : 3);
            const h = +($('geoHeight') ? $('geoHeight').value : 10);
            const sc = Math.min((W-80)/(r*2+20), (H-80)/(h+r*0.5));
            const ew = r*sc, eh = ew*0.4, bh = h*sc;
            const cx = W/2, topY = (H-bh-eh)/2, botY = topY+bh;
            // Body sides
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx-ew, topY+eh/2); ctx.lineTo(cx-ew, botY+eh/2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx+ew, topY+eh/2); ctx.lineTo(cx+ew, botY+eh/2); ctx.stroke();
            // Top ellipse
            ctx.beginPath(); ctx.ellipse(cx, topY, ew, eh, 0, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.08)'; ctx.fill();
            // Bottom ellipse
            ctx.beginPath(); ctx.ellipse(cx, botY, ew, eh, 0, 0, Math.PI*2); ctx.stroke();
            // Height line
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.moveTo(cx+ew+15, topY+eh/2); ctx.lineTo(cx+ew+15, botY+eh/2); ctx.stroke(); ctx.setLineDash([]);
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`h = ${h}`, cx+ew+35, (topY+botY)/2+eh/2);
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`r = ${r}`, cx, topY-10);
            break;
        }
        case 'ellipse': {
            const a = +($('geoA') ? $('geoA').value : 6);
            const b = +($('geoB') ? $('geoB').value : 4);
            const cx = W/2, cy = H/2;
            const maxR = Math.min(W, H)/2 - 50;
            const sc = maxR / Math.max(a, b);
            const ea = a*sc, eb = b*sc;
            // Draw ellipse
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.ellipse(cx, cy, ea, eb, 0, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.12)'; ctx.fill();
            // Draw axes
            ctx.strokeStyle = 'rgba(52,211,153,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
            // Semi-major axis (horizontal)
            ctx.beginPath(); ctx.moveTo(cx-ea, cy); ctx.lineTo(cx+ea, cy); ctx.stroke();
            // Semi-minor axis (vertical)
            ctx.beginPath(); ctx.moveTo(cx, cy-eb); ctx.lineTo(cx, cy+eb); ctx.stroke();
            ctx.setLineDash([]);
            // Center point
            ctx.fillStyle = '#f87171'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
            // Labels
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`a = ${a}`, cx+ea/2, cy-8);
            ctx.fillText(`b = ${b}`, cx+14, cy-eb/2);
            ctx.fillStyle = '#f87171'; ctx.fillText('O', cx-14, cy+16);
            // Foci
            const c = Math.sqrt(a*a - b*b);
            if (c > 0) {
                const fc = c * sc;
                ctx.fillStyle = '#fb923c';
                ctx.beginPath(); ctx.arc(cx-fc, cy, 3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx+fc, cy, 3, 0, Math.PI*2); ctx.fill();
                ctx.fillText(`c = ${fmt(c)}`, cx, cy+eb+18);
            }
            break;
        }
        case 'trapezoid': {
            const a = +($('geoA') ? $('geoA').value : 4); // top
            const b = +($('geoB') ? $('geoB').value : 8); // bottom
            const h = +($('geoHeight') ? $('geoHeight').value : 5);
            const sc = Math.min((W-100)/Math.max(a,b), (H-80)/h);
            const topW = a*sc, botW = b*sc, hh = h*sc;
            const cx = W/2, botY = H/2 + hh/2, topY = H/2 - hh/2;
            const leftBot = cx-botW/2, rightBot = cx+botW/2;
            const leftTop = cx-topW/2, rightTop = cx+topW/2;
            // Draw trapezoid
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(leftBot, botY); ctx.lineTo(rightBot, botY);
            ctx.lineTo(rightTop, topY); ctx.lineTo(leftTop, topY);
            ctx.closePath(); ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.12)'; ctx.fill();
            // Height line
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.moveTo(cx, botY); ctx.lineTo(cx, topY); ctx.stroke(); ctx.setLineDash([]);
            // Labels
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`上底 = ${a}`, cx, topY-10);
            ctx.fillStyle = '#f87171';
            ctx.fillText(`下底 = ${b}`, cx, botY+18);
            ctx.fillStyle = '#34d399';
            ctx.fillText(`高 = ${h}`, cx+15, (topY+botY)/2);
            break;
        }
        case 'polygon': {
            const n = +($('geoN') ? $('geoN').value : 6);
            const a = +($('geoA') ? $('geoA').value : 5);
            if (n < 3) break;
            const cx = W/2, cy = H/2;
            const R = a / (2 * Math.sin(Math.PI/n));
            const sc = (Math.min(W, H)/2 - 50) / R;
            const dr = R * sc;
            // Draw polygon
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const angle = (i * 2 * Math.PI / n) - Math.PI/2;
                const px = cx + dr * Math.cos(angle);
                const py = cy + dr * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.12)'; ctx.fill();
            // Draw radius
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + dr, cy - dr * Math.tan(Math.PI/2 - Math.PI/n)); ctx.stroke();
            ctx.setLineDash([]);
            // Center
            ctx.fillStyle = '#f87171'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
            // Labels
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`n = ${n}边`, cx, cy-dr-15);
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`边长 = ${a}`, cx, cy+dr+20);
            ctx.fillStyle = '#f87171';
            const circumR = a / (2 * Math.sin(Math.PI/n));
            ctx.fillText(`R = ${fmt(circumR)}`, cx+20, cy-10);
            break;
        }
        case 'cone': {
            const r = +($('geoRadius') ? $('geoRadius').value : 3);
            const h = +($('geoHeight') ? $('geoHeight').value : 8);
            const sc = Math.min((W-80)/(r*2+20), (H-80)/(h+r*0.5));
            const ew = r*sc, eh = ew*0.4, bh = h*sc;
            const cx = W/2, topY = (H-bh-eh)/2, botY = topY+bh;
            // Body sides (to apex)
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx-ew, botY+eh/2); ctx.lineTo(cx, topY); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx+ew, botY+eh/2); ctx.lineTo(cx, topY); ctx.stroke();
            // Bottom ellipse
            ctx.beginPath(); ctx.ellipse(cx, botY, ew, eh, 0, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(79,195,247,0.08)'; ctx.fill();
            // Height line
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, botY); ctx.stroke(); ctx.setLineDash([]);
            // Slant height
            ctx.strokeStyle = 'rgba(251,146,60,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
            ctx.beginPath(); ctx.moveTo(cx+ew, botY+eh/2); ctx.lineTo(cx, topY); ctx.stroke(); ctx.setLineDash([]);
            // Apex point
            ctx.fillStyle = '#f87171'; ctx.beginPath(); ctx.arc(cx, topY, 3, 0, Math.PI*2); ctx.fill();
            // Labels
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#34d399';
            ctx.fillText(`h = ${h}`, cx+20, (topY+botY)/2+eh/2);
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`r = ${r}`, cx-ew-20, botY+eh/2+5);
            const l = Math.sqrt(r*r + h*h);
            ctx.fillStyle = '#f87171';
            ctx.fillText(`l = ${fmt(l)}`, cx+ew/2+10, (topY+botY)/2-10);
            break;
        }
        case 'torus': {
            const R = +($('geoR') ? $('geoR').value : 5);
            const r = +($('geoRadius') ? $('geoRadius').value : 2);
            const cx = W/2, cy = H/2;
            const maxR = Math.min(W, H)/2 - 40;
            const sc = maxR / (R + r);
            const dR = R*sc, dr = r*sc;
            // Outer circle
            ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, dR+dr, 0, Math.PI*2); ctx.stroke();
            // Inner circle
            ctx.beginPath(); ctx.arc(cx, cy, dR-dr, 0, Math.PI*2); ctx.stroke();
            // Fill between circles
            ctx.fillStyle = 'rgba(79,195,247,0.08)';
            ctx.beginPath(); ctx.arc(cx, cy, dR+dr, 0, Math.PI*2);
            ctx.arc(cx, cy, dR-dr, 0, Math.PI*2, true); ctx.fill();
            // Center line
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.arc(cx, cy, dR, 0, Math.PI*2); ctx.stroke();
            ctx.setLineDash([]);
            // R radius
            ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]);
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+dR, cy); ctx.stroke(); ctx.setLineDash([]);
            // r indicator
            ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(cx+dR-dr, cy); ctx.lineTo(cx+dR+dr, cy); ctx.stroke();
            // Center
            ctx.fillStyle = '#f87171'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
            // Labels
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`R = ${R}`, cx+dR/2, cy-12);
            ctx.fillStyle = '#f87171';
            ctx.fillText(`r = ${r}`, cx+dR, cy+dr+18);
            ctx.fillStyle = '#34d399';
            ctx.fillText('中心圆', cx, cy-dR-dr-12);
            break;
        }
    }
}

function calculateGeometry() {
    const result = $('geometryResult');
    try {
        switch(geometryType) {
            case 'circle': {
                const r = +$('geoRadius').value;
                const area = Math.PI * r * r;
                const circumference = 2 * Math.PI * r;
                result.innerHTML = `
                    <div class="geometry-formula">面积 = π × r² = ${fmt(area)}</div>
                    <div class="geometry-formula">周长 = 2 × π × r = ${fmt(circumference)}</div>
                `;
                break;
            }
            case 'triangle': {
                const a = +$('geoA').value, b = +$('geoB').value, c = +$('geoC').value;
                const s = (a + b + c) / 2;
                const area = Math.sqrt(s * (s-a) * (s-b) * (s-c));
                const perimeter = a + b + c;
                result.innerHTML = `
                    <div class="geometry-formula">面积 = √(s(s-a)(s-b)(s-c)) = ${fmt(area)}</div>
                    <div class="geometry-formula">周长 = a + b + c = ${fmt(perimeter)}</div>
                    <div class="geometry-formula">半周长 s = ${fmt(s)}</div>
                `;
                break;
            }
            case 'rectangle': {
                const l = +$('geoLength').value, w = +$('geoWidth').value;
                const area = l * w;
                const perimeter = 2 * (l + w);
                result.innerHTML = `
                    <div class="geometry-formula">面积 = 长 × 宽 = ${fmt(area)}</div>
                    <div class="geometry-formula">周长 = 2 × (长 + 宽) = ${fmt(perimeter)}</div>
                `;
                break;
            }
            case 'sphere': {
                const r = +$('geoRadius').value;
                const volume = (4/3) * Math.PI * r * r * r;
                const surfaceArea = 4 * Math.PI * r * r;
                result.innerHTML = `
                    <div class="geometry-formula">体积 = (4/3) × π × r³ = ${fmt(volume)}</div>
                    <div class="geometry-formula">表面积 = 4 × π × r² = ${fmt(surfaceArea)}</div>
                `;
                break;
            }
            case 'cylinder': {
                const r = +$('geoRadius').value, h = +$('geoHeight').value;
                const volume = Math.PI * r * r * h;
                const lateralArea = 2 * Math.PI * r * h;
                const totalArea = lateralArea + 2 * Math.PI * r * r;
                result.innerHTML = `
                    <div class="geometry-formula">体积 = π × r² × h = ${fmt(volume)}</div>
                    <div class="geometry-formula">侧面积 = 2 × π × r × h = ${fmt(lateralArea)}</div>
                    <div class="geometry-formula">总表面积 = 2πr(r + h) = ${fmt(totalArea)}</div>
                `;
                break;
            }
            case 'ellipse': {
                const a = +$('geoA').value, b = +$('geoB').value;
                const area = Math.PI * a * b;
                const c = Math.sqrt(Math.abs(a*a - b*b));
                const eccentricity = c / Math.max(a, b);
                // Ramanujan approximation for perimeter
                const h = ((a-b)/(a+b)) * ((a-b)/(a+b));
                const perimeter = Math.PI * (a + b) * (1 + 3*h / (10 + Math.sqrt(4 - 3*h)));
                result.innerHTML = `
                    <div class="geometry-formula">面积 = π × a × b = ${fmt(area)}</div>
                    <div class="geometry-formula">周长 ≈ π(a+b)(1 + 3h/(10+√(4-3h))) ≈ ${fmt(perimeter)}</div>
                    <div class="geometry-formula">焦距 c = √(a²-b²) = ${fmt(c)}</div>
                    <div class="geometry-formula">离心率 e = c/a = ${fmt(eccentricity)}</div>
                `;
                break;
            }
            case 'trapezoid': {
                const a = +$('geoA').value, b = +$('geoB').value, h = +$('geoHeight').value, c = +$('geoC').value;
                const area = (a + b) * h / 2;
                const perimeter = a + b + 2 * c;
                result.innerHTML = `
                    <div class="geometry-formula">面积 = (上底 + 下底) × 高 / 2 = ${fmt(area)}</div>
                    <div class="geometry-formula">周长 = a + b + 2c = ${fmt(perimeter)}</div>
                    <div class="geometry-formula">中位线 = (a + b) / 2 = ${fmt((a+b)/2)}</div>
                `;
                break;
            }
            case 'polygon': {
                const n = +$('geoN').value, a = +$('geoA').value;
                if (n < 3) { result.textContent = '边数必须≥3'; break; }
                const area = (n * a * a) / (4 * Math.tan(Math.PI/n));
                const perimeter = n * a;
                const interiorAngle = (n - 2) * 180 / n;
                const circumR = a / (2 * Math.sin(Math.PI/n));
                const inR = a / (2 * Math.tan(Math.PI/n));
                result.innerHTML = `
                    <div class="geometry-formula">面积 = (n × a²) / (4 × tan(π/n)) = ${fmt(area)}</div>
                    <div class="geometry-formula">周长 = n × a = ${fmt(perimeter)}</div>
                    <div class="geometry-formula">内角 = (n-2) × 180° / n = ${fmt(interiorAngle)}°</div>
                    <div class="geometry-formula">外接圆半径 R = a/(2sin(π/n)) = ${fmt(circumR)}</div>
                    <div class="geometry-formula">内切圆半径 r = a/(2tan(π/n)) = ${fmt(inR)}</div>
                `;
                break;
            }
            case 'cone': {
                const r = +$('geoRadius').value, h = +$('geoHeight').value;
                const l = Math.sqrt(r*r + h*h);
                const volume = Math.PI * r * r * h / 3;
                const lateralArea = Math.PI * r * l;
                const baseArea = Math.PI * r * r;
                const totalArea = lateralArea + baseArea;
                result.innerHTML = `
                    <div class="geometry-formula">体积 = (1/3)πr²h = ${fmt(volume)}</div>
                    <div class="geometry-formula">母线长 l = √(r²+h²) = ${fmt(l)}</div>
                    <div class="geometry-formula">侧面积 = πrl = ${fmt(lateralArea)}</div>
                    <div class="geometry-formula">底面积 = πr² = ${fmt(baseArea)}</div>
                    <div class="geometry-formula">总表面积 = πr(r+l) = ${fmt(totalArea)}</div>
                `;
                break;
            }
            case 'torus': {
                const R = +$('geoR').value, r = +$('geoRadius').value;
                const volume = 2 * Math.PI * Math.PI * R * r * r;
                const area = 4 * Math.PI * Math.PI * R * r;
                result.innerHTML = `
                    <div class="geometry-formula">体积 = 2π²Rr² = ${fmt(volume)}</div>
                    <div class="geometry-formula">表面积 = 4π²Rr = ${fmt(area)}</div>
                    <div class="geometry-formula">大半径 R = ${R}, 小半径 r = ${r}</div>
                `;
                break;
            }
        }
    } catch(e) {
        result.textContent = '错误: ' + e.message;
    }
    drawGeometry();
}

// 3D Calculator - Three.js powered
let threeDType = 'surface';
let threeScene = null, threeCamera = null, threeRenderer = null, threeControls = null;
let threeAnimId = null;

function set3DType(type, btn) {
    threeDType = type;
    document.querySelectorAll('#3d .eq-type button').forEach(b=>b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    else {
        const targetBtn = document.querySelector('#3d .eq-type button[data-3dtype="'+type+'"]');
        if (targetBtn) targetBtn.classList.add('active');
    }
    update3DInputs();
}

// Event delegation for 3D type buttons
// Note: OrbitControls only listens on the canvas element, not on the document,
// so it does NOT interfere with button clicks. A simple click handler is sufficient.
(function init3DButtons() {
    const container = document.getElementById('threeDTypeButtons');
    if (!container) return;
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-3dtype]');
        if (!btn) return;
        const type = btn.getAttribute('data-3dtype');
        if (type) set3DType(type, btn);
    });
})();

function update3DInputs() {
    const container = $('3dInputs');
    switch(threeDType) {
        case 'surface':
            container.innerHTML = `
                <div class="three-d-controls">
                    <label>z = f(x,y) =</label>
                    <input id="surfaceExpr" type="text" value="sin(sqrt(x^2+y^2))" placeholder="例: x^2-y^2, sin(x)*cos(y)">
                </div>
                <div class="three-d-controls">
                    <label>x范围:</label>
                    <input id="surfXMin" type="text" value="-5" style="width:60px;flex:none">
                    <label>~</label>
                    <input id="surfXMax" type="text" value="5" style="width:60px;flex:none">
                    <label>y范围:</label>
                    <input id="surfYMin" type="text" value="-5" style="width:60px;flex:none">
                    <label>~</label>
                    <input id="surfYMax" type="text" value="5" style="width:60px;flex:none">
                    <label>精度:</label>
                    <input id="surfRes" type="text" value="50" style="width:50px;flex:none">
                </div>
                <div class="input-desc">支持: sin, cos, tan, exp, log, sqrt, abs, pi, e, ^幂运算</div>
            `;
            break;
        case 'curve3d':
            container.innerHTML = `
                <div class="three-d-controls">
                    <label>x(t) =</label>
                    <input id="curveX" type="text" value="cos(t)" placeholder="x关于t的函数">
                </div>
                <div class="three-d-controls">
                    <label>y(t) =</label>
                    <input id="curveY" type="text" value="sin(t)" placeholder="y关于t的函数">
                </div>
                <div class="three-d-controls">
                    <label>z(t) =</label>
                    <input id="curveZ" type="text" value="t/6" placeholder="z关于t的函数">
                </div>
                <div class="three-d-controls">
                    <label>t范围:</label>
                    <input id="curveTMin" type="text" value="0" style="width:60px;flex:none">
                    <label>~</label>
                    <input id="curveTMax" type="text" value="12" style="width:60px;flex:none">
                </div>
                <div class="input-desc">输入关于参数t的函数表达式，t从最小值到最大值</div>
            `;
            break;
        case 'vector':
            container.innerHTML = `
                <div class="matrix-label">向量 A (从原点出发)</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>x₁</label><input id="ax" value="1"><div class="input-desc">X分量</div></div>
                    <div class="eq-input" style="flex:1"><label>y₁</label><input id="ay" value="2"><div class="input-desc">Y分量</div></div>
                    <div class="eq-input" style="flex:1"><label>z₁</label><input id="az" value="3"><div class="input-desc">Z分量</div></div>
                </div>
                <div class="matrix-label">向量 B (从原点出发)</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>x₂</label><input id="bx" value="4"><div class="input-desc">X分量</div></div>
                    <div class="eq-input" style="flex:1"><label>y₂</label><input id="by" value="5"><div class="input-desc">Y分量</div></div>
                    <div class="eq-input" style="flex:1"><label>z₂</label><input id="bz" value="6"><div class="input-desc">Z分量</div></div>
                </div>
            `;
            break;
        case 'distance':
            container.innerHTML = `
                <div class="matrix-label">点 A 的坐标</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>x₁</label><input id="p1x" value="1"><div class="input-desc">X坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>y₁</label><input id="p1y" value="2"><div class="input-desc">Y坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>z₁</label><input id="p1z" value="3"><div class="input-desc">Z坐标</div></div>
                </div>
                <div class="matrix-label">点 B 的坐标</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>x₂</label><input id="p2x" value="4"><div class="input-desc">X坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>y₂</label><input id="p2y" value="5"><div class="input-desc">Y坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>z₂</label><input id="p2z" value="6"><div class="input-desc">Z坐标</div></div>
                </div>
            `;
            break;
        case 'plane':
            container.innerHTML = `
                <div class="matrix-label">平面方程: ax + by + cz = d</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>a (法向量x)</label><input id="planeA" value="1"><div class="input-desc">法向量X分量</div></div>
                    <div class="eq-input" style="flex:1"><label>b (法向量y)</label><input id="planeB" value="2"><div class="input-desc">法向量Y分量</div></div>
                    <div class="eq-input" style="flex:1"><label>c (法向量z)</label><input id="planeC" value="3"><div class="input-desc">法向量Z分量</div></div>
                    <div class="eq-input" style="flex:1"><label>d (常数)</label><input id="planeD" value="6"><div class="input-desc">方程右侧常数</div></div>
                </div>
                <div class="matrix-label">待检测的点坐标</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>x</label><input id="pointX" value="1"><div class="input-desc">点的X坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>y</label><input id="pointY" value="1"><div class="input-desc">点的Y坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>z</label><input id="pointZ" value="1"><div class="input-desc">点的Z坐标</div></div>
                </div>
            `;
            break;
        case 'line':
            container.innerHTML = `
                <div class="matrix-label">直线上一点 P₀</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>x₀</label><input id="lineX" value="1"><div class="input-desc">点的X坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>y₀</label><input id="lineY" value="2"><div class="input-desc">点的Y坐标</div></div>
                    <div class="eq-input" style="flex:1"><label>z₀</label><input id="lineZ" value="3"><div class="input-desc">点的Z坐标</div></div>
                </div>
                <div class="matrix-label">方向向量 d</div>
                <div style="display:flex;gap:8px">
                    <div class="eq-input" style="flex:1"><label>dx</label><input id="dirX" value="4"><div class="input-desc">X方向分量</div></div>
                    <div class="eq-input" style="flex:1"><label>dy</label><input id="dirY" value="5"><div class="input-desc">Y方向分量</div></div>
                    <div class="eq-input" style="flex:1"><label>dz</label><input id="dirZ" value="6"><div class="input-desc">Z方向分量</div></div>
                </div>
            `;
            break;
    }
    // Add input event listeners for auto-update
    attach3DInputListeners();
    setTimeout(draw3D, 50);
}

function attach3DInputListeners() {
    const container = $('3dInputs');
    if (!container) return;
    // Add input/change event listeners to all inputs and selects
    container.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', debounce(draw3D, 300));
        input.addEventListener('change', debounce(draw3D, 300));
    });
}

// Debounce helper
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function initThreeJS() {
    if (threeRenderer) return true; // already initialized
    const canvas = $('threeDCanvas');
    if (!canvas || typeof THREE === 'undefined') {
        // Fallback: use 2D canvas if Three.js not loaded
        draw3DFallback();
        return false;
    }
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const W = rect.width, H = 360;
    
    threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(0x0d1117);
    threeScene.fog = new THREE.Fog(0x0d1117, 15, 30);
    
    threeCamera = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
    threeCamera.position.set(6, 5, 8);
    threeCamera.lookAt(0, 0, 0);
    
    threeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    threeRenderer.setSize(W, H);
    threeRenderer.setPixelRatio(devicePixelRatio);
    
    if (THREE.OrbitControls) {
        threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
        threeControls.enableDamping = true;
        threeControls.dampingFactor = 0.08;
        threeControls.target.set(0, 0, 0);
    }
    
    // Lights
    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    threeScene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 8, 5);
    threeScene.add(dirLight);
    const pointLight = new THREE.PointLight(0x6366f1, 0.4, 20);
    pointLight.position.set(-3, 5, -3);
    threeScene.add(pointLight);
    
    // Axes helper
    const axesHelper = new THREE.AxesHelper(3);
    threeScene.add(axesHelper);
    
    // Grid
    const gridHelper = new THREE.GridHelper(6, 6, 0x30363d, 0x1a1f27);
    threeScene.add(gridHelper);
    
    // Axis labels with sprites
    ['X', 'Y', 'Z'].forEach((label, i) => {
        const sprite = makeTextSprite(label, ['#f87171','#34d399','#4fc3f7'][i]);
        const pos = [3.3, 0, 0]; if(i===1) pos.splice(0,3,0,3.3,0); if(i===2) pos.splice(0,3,0,0,3.3);
        sprite.position.set(...pos);
        threeScene.add(sprite);
    });
    
    return true;
}

function makeTextSprite(text, color) {
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 64; canvas2d.height = 64;
    const ctx2 = canvas2d.getContext('2d');
    ctx2.font = 'Bold 40px Arial';
    ctx2.fillStyle = color;
    ctx2.textAlign = 'center';
    ctx2.fillText(text, 32, 44);
    const texture = new THREE.CanvasTexture(canvas2d);
    const mat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.5, 0.5, 0.5);
    return sprite;
}

function clearThreeScene() {
    if (!threeScene) return;
    const toRemove = [];
    threeScene.traverse(obj => {
        if (obj !== threeScene && !(obj instanceof THREE.Light) && !(obj instanceof THREE.AxesHelper) && !(obj instanceof THREE.GridHelper)) {
            toRemove.push(obj);
        }
    });
    // Also remove axis labels
    toRemove.forEach(obj => {
        if (obj.parent === threeScene) {
            threeScene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (obj.material.map) obj.material.map.dispose();
                obj.material.dispose();
            }
        }
    });
}

function animate3D() {
    if (!threeRenderer || !threeScene || !threeCamera) return;
    threeAnimId = requestAnimationFrame(animate3D);
    if (threeControls) threeControls.update();
    threeRenderer.render(threeScene, threeCamera);
}

function draw3D() {
    const canvas = $('threeDCanvas');
    if (!canvas) return;
    
    // Try Three.js first
    if (typeof THREE !== 'undefined') {
        if (!initThreeJS()) return; // fallback
        clearThreeScene();
        
        switch(threeDType) {
            case 'surface': drawSurface3D(); break;
            case 'curve3d': drawCurve3D(); break;
            case 'vector': drawVector3D(); break;
            case 'distance': drawDistance3D(); break;
            case 'plane': drawPlane3D(); break;
            case 'line': drawLine3D(); break;
        }
        
        if (threeAnimId) cancelAnimationFrame(threeAnimId);
        animate3D();
    } else {
        draw3DFallback();
    }
}

function drawSurface3D() {
    try {
        const expr = $('surfaceExpr').value.trim();
        const xMin = parseFloat($('surfXMin').value) || -5;
        const xMax = parseFloat($('surfXMax').value) || 5;
        const yMin = parseFloat($('surfYMin').value) || -5;
        const yMax = parseFloat($('surfYMax').value) || 5;
        const res = Math.min(parseInt($('surfRes').value) || 50, 100);
        
        const fn = buildMathFunc(expr);
        const geometry = new THREE.PlaneGeometry(xMax-xMin, yMax-yMin, res, res);
        const positions = geometry.attributes.position;
        const colors = [];
        let zMin = Infinity, zMax = -Infinity;
        
        // Calculate z values
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i) + (xMax+xMin)/2;
            const y = positions.getY(i) + (yMax+yMin)/2;
            let z;
            try { z = fn(x, y); } catch(e) { z = 0; }
            if (!isFinite(z)) z = 0;
            positions.setZ(i, z);
            if (z < zMin) zMin = z;
            if (z > zMax) zMax = z;
        }
        
        // Color based on height
        const zRange = zMax - zMin || 1;
        for (let i = 0; i < positions.count; i++) {
            const z = positions.getZ(i);
            const t = (z - zMin) / zRange;
            const color = new THREE.Color();
            color.setHSL(0.6 - t * 0.6, 0.8, 0.3 + t * 0.4);
            colors.push(color.r, color.g, color.b);
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            shininess: 30,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        // Rotate to correct orientation (PlaneGeometry is in XY, we want XZ)
        mesh.rotation.x = -Math.PI / 2;
        threeScene.add(mesh);
        
        // Add wireframe overlay
        const wireMat = new THREE.MeshBasicMaterial({ 
            color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.15 
        });
        const wireMesh = new THREE.Mesh(geometry.clone(), wireMat);
        wireMesh.rotation.x = -Math.PI / 2;
        threeScene.add(wireMesh);
        
        // Adjust camera
        threeCamera.position.set(
            (xMax-xMin)*0.8, Math.max((zMax-zMin)*0.8, 3), (yMax-yMin)*0.8
        );
        threeCamera.lookAt(0, (zMin+zMax)/2, 0);
        if (threeControls) threeControls.target.set(0, (zMin+zMax)/2, 0);
        
    } catch(e) {
        show3DError('曲面表达式错误: ' + e.message);
    }
}

function drawCurve3D() {
    try {
        const exprX = $('curveX').value.trim();
        const exprY = $('curveY').value.trim();
        const exprZ = $('curveZ').value.trim();
        const tMin = parseFloat($('curveTMin').value) || 0;
        const tMax = parseFloat($('curveTMax').value) || 12;
        
        const fnX = buildMathFunc('0+' + exprX);
        const fnY = buildMathFunc('0+' + exprY);
        const fnZ = buildMathFunc('0+' + exprZ);
        
        const points = [];
        const steps = 500;
        for (let i = 0; i <= steps; i++) {
            const t = tMin + (tMax - tMin) * i / steps;
            try {
                const x = fnX(t, 0); const y = fnY(t, 0); const z = fnZ(t, 0);
                if (isFinite(x) && isFinite(y) && isFinite(z)) {
                    points.push(new THREE.Vector3(x, z, y)); // swap y/z for correct orientation
                }
            } catch(e) {}
        }
        
        if (points.length < 2) { show3DError('无法生成曲线点'); return; }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, points.length * 2, 0.05, 8, false);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x22d3ee, shininess: 60, emissive: 0x113344 
        });
        const mesh = new THREE.Mesh(geometry, material);
        threeScene.add(mesh);
        
        // Start and end points
        const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const startSphere = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x34d399, emissive: 0x113322 }));
        startSphere.position.copy(points[0]);
        threeScene.add(startSphere);
        const endSphere = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0xf87171, emissive: 0x331122 }));
        endSphere.position.copy(points[points.length-1]);
        threeScene.add(endSphere);
        
        // Adjust camera
        const box = new THREE.Box3().setFromPoints(points);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        threeCamera.position.set(center.x + maxDim, center.y + maxDim, center.z + maxDim);
        threeCamera.lookAt(center);
        if (threeControls) threeControls.target.copy(center);
        
    } catch(e) {
        show3DError('参数曲线错误: ' + e.message);
    }
}

function drawVector3D() {
    const ax=+$('ax').value, ay=+$('ay').value, az=+$('az').value;
    const bx=+$('bx').value, by=+$('by').value, bz=+$('bz').value;
    
    // Vector A
    const dirA = new THREE.Vector3(ax, az, ay); // swap y/z
    const arrowA = new THREE.ArrowHelper(dirA.clone().normalize(), new THREE.Vector3(0,0,0), dirA.length(), 0xf87171, 0.2, 0.1);
    threeScene.add(arrowA);
    
    // Vector B
    const dirB = new THREE.Vector3(bx, bz, by);
    const arrowB = new THREE.ArrowHelper(dirB.clone().normalize(), new THREE.Vector3(0,0,0), dirB.length(), 0x34d399, 0.2, 0.1);
    threeScene.add(arrowB);
    
    // Cross product visualization
    const cross = new THREE.Vector3().crossVectors(dirA, dirB);
    if (cross.length() > 0.01) {
        const arrowC = new THREE.ArrowHelper(cross.clone().normalize(), new THREE.Vector3(0,0,0), cross.length() * 0.7, 0xfb923c, 0.15, 0.08);
        threeScene.add(arrowC);
    }
    
    // Label sprites
    const labelA = makeTextSprite(`A(${ax},${ay},${az})`, '#f87171');
    labelA.position.set(ax*1.1, az*1.1+0.3, ay*1.1);
    threeScene.add(labelA);
    const labelB = makeTextSprite(`B(${bx},${by},${bz})`, '#34d399');
    labelB.position.set(bx*1.1, bz*1.1+0.3, by*1.1);
    threeScene.add(labelB);
}

function drawDistance3D() {
    const x1=+$('p1x').value, y1=+$('p1y').value, z1=+$('p1z').value;
    const x2=+$('p2x').value, y2=+$('p2y').value, z2=+$('p2z').value;
    
    // Points
    const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const sphereA = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0xf87171, emissive: 0x331122 }));
    sphereA.position.set(x1, z1, y1);
    threeScene.add(sphereA);
    const sphereB = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x34d399, emissive: 0x113322 }));
    sphereB.position.set(x2, z2, y2);
    threeScene.add(sphereB);
    
    // Dashed line
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, z1, y1), new THREE.Vector3(x2, z2, y2)
    ]);
    const lineMat = new THREE.LineDashedMaterial({ color: 0xfb923c, dashSize: 0.2, gapSize: 0.1 });
    const line = new THREE.Line(lineGeo, lineMat);
    line.computeLineDistances();
    threeScene.add(line);
    
    // Labels
    const labelA = makeTextSprite(`A(${x1},${y1},${z1})`, '#f87171');
    labelA.position.set(x1, z1+0.4, y1);
    threeScene.add(labelA);
    const labelB = makeTextSprite(`B(${x2},${y2},${z2})`, '#34d399');
    labelB.position.set(x2, z2+0.4, y2);
    threeScene.add(labelB);
}

function drawPlane3D() {
    const a=+$('planeA').value, b=+$('planeB').value, c=+$('planeC').value, d=+$('planeD').value;
    
    // Create plane geometry
    const size = 5;
    const planeGeo = new THREE.PlaneGeometry(size*2, size*2, 20, 20);
    const normal = new THREE.Vector3(a, c, b).normalize();
    
    // Orient plane
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    planeGeo.applyQuaternion(quaternion);
    
    // Offset by d
    const dist = d / Math.sqrt(a*a+b*b+c*c);
    planeGeo.translate(normal.x*dist, normal.y*dist, normal.z*dist);
    
    const planeMat = new THREE.MeshPhongMaterial({ 
        color: 0x6366f1, side: THREE.DoubleSide, transparent: true, opacity: 0.35,
        shininess: 40
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    threeScene.add(planeMesh);
    
    // Wireframe
    const wireMat = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.3 
    });
    const wireMesh = new THREE.Mesh(planeGeo.clone(), wireMat);
    threeScene.add(wireMesh);
    
    // Normal vector
    const arrowN = new THREE.ArrowHelper(normal, 
        new THREE.Vector3(normal.x*dist, normal.y*dist, normal.z*dist), 
        2, 0xf87171, 0.2, 0.1);
    threeScene.add(arrowN);
    
    // Point
    const px=+$('pointX').value, py=+$('pointY').value, pz=+$('pointZ').value;
    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pointMesh = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x34d399, emissive: 0x113322 }));
    pointMesh.position.set(px, pz, py);
    threeScene.add(pointMesh);
}

function drawLine3D() {
    const lx=+$('lineX').value, ly=+$('lineY').value, lz=+$('lineZ').value;
    const dx=+$('dirX').value, dy=+$('dirY').value, dz=+$('dirZ').value;
    
    // Line
    const len = 6;
    const points = [
        new THREE.Vector3(lx-dx*len, lz-dz*len, ly-dy*len),
        new THREE.Vector3(lx+dx*len, lz+dz*len, ly+dy*len)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4fc3f7, linewidth: 2 });
    const line = new THREE.Line(lineGeo, lineMat);
    threeScene.add(line);
    
    // Point on line
    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pointMesh = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0xf87171, emissive: 0x331122 }));
    pointMesh.position.set(lx, lz, ly);
    threeScene.add(pointMesh);
    
    // Direction arrow
    const dir = new THREE.Vector3(dx, dz, dy).normalize();
    const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(lx, lz, ly), 2, 0x34d399, 0.2, 0.1);
    threeScene.add(arrow);
}

function show3DError(msg) {
    if (threeAnimId) cancelAnimationFrame(threeAnimId);
    const canvas = $('threeDCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = 360 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, rect.width, 360);
    ctx.fillStyle = '#f87171';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(msg, rect.width/2, 180);
}

// Fallback 2D canvas when Three.js not loaded
function draw3DFallback() {
    const canvas = $('threeDCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = 360 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = rect.width, H = 360;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);
    
    ctx.fillStyle = '#8b949e';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('正在加载3D引擎...', W/2, H/2-20);
    ctx.fillText('请确保网络连接正常 (需要加载Three.js)', W/2, H/2+10);
    ctx.fillStyle = '#6366f1';
    ctx.font = '12px sans-serif';
    ctx.fillText('如果无法加载，请检查网络或使用离线版本', W/2, H/2+40);
}

function calculate3D() {
    const result = $('3dResult');
    try {
        switch(threeDType) {
            case 'surface': {
                const expr = $('surfaceExpr').value.trim();
                result.innerHTML = `
                    <div class="formula-box"><div class="formula-title">曲面方程</div>z = f(x, y) = ${expr}</div>
                    <div class="process-box">
                        <div class="step">x范围: [${$('surfXMin').value}, ${$('surfXMax').value}]</div>
                        <div class="step">y范围: [${$('surfYMin').value}, ${$('surfYMax').value}]</div>
                        <div class="step">网格精度: ${$('surfRes').value}×${$('surfRes').value}</div>
                        <div class="step">鼠标拖拽旋转视角，滚轮缩放，右键平移</div>
                    </div>`;
                break;
            }
            case 'curve3d': {
                const exprX = $('curveX').value, exprY = $('curveY').value, exprZ = $('curveZ').value;
                result.innerHTML = `
                    <div class="formula-box"><div class="formula-title">参数方程</div>
                    x(t) = ${exprX}<br>y(t) = ${exprY}<br>z(t) = ${exprZ}<br>
                    t ∈ [${$('curveTMin').value}, ${$('curveTMax').value}]</div>
                    <div class="process-box"><div class="step">绿色球: 起点 (t=${$('curveTMin').value}) | 红色球: 终点 (t=${$('curveTMax').value})</div></div>`;
                break;
            }
            case 'vector': {
                const ax=+$('ax').value, ay=+$('ay').value, az=+$('az').value;
                const bx=+$('bx').value, by=+$('by').value, bz=+$('bz').value;
                const dot = ax*bx + ay*by + az*bz;
                const cross = [ay*bz-az*by, az*bx-ax*bz, ax*by-ay*bx];
                const magA = Math.sqrt(ax*ax+ay*ay+az*az);
                const magB = Math.sqrt(bx*bx+by*by+bz*bz);
                const cosAngle = dot/(magA*magB);
                const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180/Math.PI;
                result.innerHTML = `
                    <div class="formula-box"><div class="formula-title">向量运算公式</div>
                    点积: A·B = x₁x₂ + y₁y₂ + z₁z₂ = ${ax}×${bx} + ${ay}×${by} + ${az}×${bz}<br>
                    叉积: A×B = (y₁z₂-z₁y₂, z₁x₂-x₁z₂, x₁y₂-y₁x₂)<br>
                    夹角: cosθ = (A·B) / (|A|×|B|)</div>
                    <div class="process-box">
                        <div class="step">点积 (A·B) = <strong>${fmt(dot)}</strong></div>
                        <div class="step">叉积 (A×B) = <strong>(${fmt(cross[0])}, ${fmt(cross[1])}, ${fmt(cross[2])})</strong></div>
                        <div class="step">|A| = √(${ax}²+${ay}²+${az}²) = <strong>${fmt(magA)}</strong></div>
                        <div class="step">|B| = √(${bx}²+${by}²+${bz}²) = <strong>${fmt(magB)}</strong></div>
                        <div class="step">cosθ = ${fmt(dot)} / (${fmt(magA)}×${fmt(magB)}) = ${fmt(cosAngle)}</div>
                        <div class="step">夹角 θ = <strong>${fmt(angle)}°</strong></div>
                    </div>`;
                break;
            }
            case 'distance': {
                const x1=+$('p1x').value, y1=+$('p1y').value, z1=+$('p1z').value;
                const x2=+$('p2x').value, y2=+$('p2y').value, z2=+$('p2z').value;
                const dx=x2-x1, dy=y2-y1, dz=z2-z1;
                const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
                const mid = [(x1+x2)/2, (y1+y2)/2, (z1+z2)/2];
                result.innerHTML = `
                    <div class="formula-box"><div class="formula-title">三维距离公式</div>
                    d = √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)<br>
                    = √((${x2}-${x1})² + (${y2}-${y1})² + (${z2}-${z1})²)<br>
                    = √(${dx}² + ${dy}² + ${dz}²) = √(${dx*dx+dy*dy+dz*dz})</div>
                    <div class="process-box">
                        <div class="step">距离 = <strong>${fmt(dist)}</strong></div>
                        <div class="step">中点 = (${fmt(mid[0])}, ${fmt(mid[1])}, ${fmt(mid[2])})</div>
                    </div>`;
                break;
            }
            case 'plane': {
                const a=+$('planeA').value, b=+$('planeB').value, c=+$('planeC').value, d=+$('planeD').value;
                const x=+$('pointX').value, y=+$('pointY').value, z=+$('pointZ').value;
                const n = Math.sqrt(a*a+b*b+c*c);
                const dist = Math.abs(a*x+b*y+c*z-d)/n;
                const val = a*x+b*y+c*z;
                const side = val > d ? '上方' : val < d ? '下方' : '在平面上';
                result.innerHTML = `
                    <div class="formula-box"><div class="formula-title">点到平面距离公式</div>
                    d = |ax₀+by₀+cz₀-d| / √(a²+b²+c²)<br>
                    = |${a}×${x}+${b}×${y}+${c}×${z}-${d}| / √(${a*a+b*b+c*c})<br>
                    = |${fmt(val)}-${d}| / ${fmt(n)} = ${fmt(Math.abs(val-d))} / ${fmt(n)}</div>
                    <div class="process-box">
                        <div class="step">法向量 n = <strong>(${a}, ${b}, ${c})</strong>, |n| = ${fmt(n)}</div>
                        <div class="step">点到平面距离 = <strong>${fmt(dist)}</strong></div>
                        <div class="step">点在平面${side} (代入值=${fmt(val)}, d=${d})</div>
                    </div>`;
                break;
            }
            case 'line': {
                const x0=+$('lineX').value, y0=+$('lineY').value, z0=+$('lineZ').value;
                const dx=+$('dirX').value, dy=+$('dirY').value, dz=+$('dirZ').value;
                const dirMag = Math.sqrt(dx*dx+dy*dy+dz*dz);
                result.innerHTML = `
                    <div class="formula-box"><div class="formula-title">直线参数方程</div>
                    x = x₀ + dx·t = ${x0} + (${dx})t<br>
                    y = y₀ + dy·t = ${y0} + (${dy})t<br>
                    z = z₀ + dz·t = ${z0} + (${dz})t</div>
                    <div class="process-box">
                        <div class="step">直线上一点 P₀ = <strong>(${x0}, ${y0}, ${z0})</strong></div>
                        <div class="step">方向向量 d = <strong>(${dx}, ${dy}, ${dz})</strong></div>
                        <div class="step">|d| = √(${dx}²+${dy}²+${dz}²) = <strong>${fmt(dirMag)}</strong></div>
                        <div class="step">单位方向向量 d̂ = (${fmt(dx/dirMag)}, ${fmt(dy/dirMag)}, ${fmt(dz/dirMag)})</div>
                    </div>`;
                break;
            }
        }
    } catch(e) {
        result.innerHTML = `<div style="color:var(--red)">错误: ${e.message}</div>`;
    }
    draw3D();
}

// Fun Calculators
let funType = 'relative';
function setFunType(type, btn) {
    funType = type;
    document.querySelectorAll('#fun .eq-type button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    updateFunInputs();
}

function updateFunInputs() {
    const container = $('funInputs');
    switch(funType) {
        case 'relative':
            container.innerHTML = `
                <div class="matrix-label">亲戚关系链 (支持多层: 自己→父亲→母亲→...)</div>
                <div class="relation-chain" id="relChain">
                    <span style="color:var(--primary);font-weight:600">自己</span>
                    <span class="relation-arrow">→</span>
                    <select class="rel-step" data-step="0">
                        <option value="father">的父亲</option>
                        <option value="mother">的母亲</option>
                        <option value="brother">的兄弟</option>
                        <option value="sister">的姐妹</option>
                        <option value="son">的儿子</option>
                        <option value="daughter">的女儿</option>
                        <option value="husband">的丈夫</option>
                        <option value="wife">的妻子</option>
                    </select>
                </div>
                <div class="relation-btns">
                    <button onclick="addRelStep()">+ 添加关系</button>
                    <button onclick="removeRelStep()">- 移除最后</button>
                </div>
            `;
            break;
        case 'loan':
            container.innerHTML = `
                <div class="eq-input"><label>贷款金额 (万元)</label><input id="loanAmount" value="100"></div>
                <div class="eq-input"><label>年利率 (%)</label><input id="loanRate" value="4.9"></div>
                <div class="eq-input"><label>贷款年限 (年)</label><input id="loanYears" value="30"></div>
                <div class="eq-input"><label>还款方式</label><select id="loanType">
                    <option value="equal">等额本息</option>
                    <option value="principal">等额本金</option>
                </select></div>
            `;
            break;
        case 'interest':
            container.innerHTML = `
                <div class="eq-input"><label>本金 (元)</label><input id="principal" value="10000"></div>
                <div class="eq-input"><label>年化收益率 (%)</label><input id="annualRate" value="5"></div>
                <div class="eq-input"><label>投资期限 (年)</label><input id="investYears" value="3"></div>
                <div class="eq-input"><label>复利频率</label><select id="compoundFreq">
                    <option value="1">年复利</option>
                    <option value="4">季复利</option>
                    <option value="12">月复利</option>
                    <option value="365">日复利</option>
                </select></div>
            `;
            break;
        case 'currency':
            container.innerHTML = `
                <div class="eq-input"><label>金额</label><input id="currencyAmount" value="1000"></div>
                <div class="eq-input"><label>从</label><select id="currencyFrom">
                    <option value="CNY">人民币 (CNY)</option>
                    <option value="USD">美元 (USD)</option>
                    <option value="EUR">欧元 (EUR)</option>
                    <option value="GBP">英镑 (GBP)</option>
                    <option value="JPY">日元 (JPY)</option>
                    <option value="KRW">韩元 (KRW)</option>
                    <option value="HKD">港币 (HKD)</option>
                    <option value="TWD">新台币 (TWD)</option>
                </select></div>
                <div class="eq-input"><label>到</label><select id="currencyTo">
                    <option value="USD">美元 (USD)</option>
                    <option value="CNY">人民币 (CNY)</option>
                    <option value="EUR">欧元 (EUR)</option>
                    <option value="GBP">英镑 (GBP)</option>
                    <option value="JPY">日元 (JPY)</option>
                    <option value="KRW">韩元 (KRW)</option>
                    <option value="HKD">港币 (HKD)</option>
                    <option value="TWD">新台币 (TWD)</option>
                </select></div>
            `;
            break;
        case 'number':
            container.innerHTML = `
                <div class="eq-input"><label>数字</label><input id="numberInput" value="1234567890"></div>
            `;
            break;
        case 'base':
            container.innerHTML = `
                <div class="eq-input"><label>数字</label><input id="baseNumber" value="255"></div>
                <div class="eq-input"><label>从</label><select id="baseFrom">
                    <option value="10">十进制</option>
                    <option value="2">二进制</option>
                    <option value="8">八进制</option>
                    <option value="16">十六进制</option>
                </select></div>
                <div class="eq-input"><label>到</label><select id="baseTo">
                    <option value="2">二进制</option>
                    <option value="10">十进制</option>
                    <option value="8">八进制</option>
                    <option value="16">十六进制</option>
                </select></div>
            `;
            break;
        case 'speed':
            container.innerHTML = `
                <div class="eq-input"><label>速度值</label><input id="speedValue" value="100"></div>
                <div class="eq-input"><label>从</label><select id="speedFrom">
                    <option value="kmh">千米/时 (km/h)</option>
                    <option value="ms">米/秒 (m/s)</option>
                    <option value="mph">英里/时 (mph)</option>
                    <option value="knot">节 (knot)</option>
                    <option value="mach">马赫 (Mach)</option>
                </select></div>
                <div class="eq-input"><label>到</label><select id="speedTo">
                    <option value="ms">米/秒 (m/s)</option>
                    <option value="kmh">千米/时 (km/h)</option>
                    <option value="mph">英里/时 (mph)</option>
                    <option value="knot">节 (knot)</option>
                    <option value="mach">马赫 (Mach)</option>
                </select></div>
            `;
            break;
        case 'bmi':
            container.innerHTML = `
                <div class="eq-input"><label>身高 (厘米)</label><input id="height" value="170"></div>
                <div class="eq-input"><label>体重 (公斤)</label><input id="weight" value="65"></div>
            `;
            break;
        case 'tax':
            container.innerHTML = `
                <div class="eq-input"><label>月收入 (元)</label><input id="taxIncome" value="15000"></div>
                <div class="eq-input"><label>五险一金 (元/月)</label><input id="taxInsurance" value="3000"></div>
                <div class="eq-input"><label>专项附加扣除 (元/月)</label><input id="taxSpecial" value="0"></div>
                <div class="eq-input"><label>起征点 (元/月)</label><input id="taxThreshold" value="5000"></div>
            `;
            break;
    }
}

function calculateFun() {
    const result = $('funResult');
    try {
        switch(funType) {
            case 'relative': {
                const chain = [];
                document.querySelectorAll('.rel-step').forEach(s => chain.push(s.value));
                const relation = resolveRelChain(chain);
                result.innerHTML = `<div class="fun-result">${relation.path}</div><div class="fun-result" style="color:var(--orange);font-size:22px">称呼: ${relation.name}</div>`;
                break;
            }
            case 'loan': {
                const amount = +$('loanAmount').value * 10000;
                const rate = +$('loanRate').value / 100;
                const years = +$('loanYears').value;
                const type = $('loanType').value;
                
                if (type === 'equal') {
                    const monthlyRate = rate / 12;
                    const months = years * 12;
                    const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
                    const totalPayment = monthlyPayment * months;
                    const totalInterest = totalPayment - amount;
                    
                    result.innerHTML = `
                        <div class="fun-formula">等额本息还款</div>
                        <div class="fun-result">每月还款: ${fmt(monthlyPayment)} 元</div>
                        <div class="fun-result">总还款额: ${fmt(totalPayment)} 元</div>
                        <div class="fun-result">总利息: ${fmt(totalInterest)} 元</div>
                    `;
                } else {
                    const monthlyRate = rate / 12;
                    const months = years * 12;
                    const monthlyPrincipal = amount / months;
                    let totalInterest = 0;
                    let firstMonthPayment = 0;
                    
                    for (let i = 0; i < months; i++) {
                        const interest = (amount - monthlyPrincipal * i) * monthlyRate;
                        totalInterest += interest;
                        if (i === 0) firstMonthPayment = monthlyPrincipal + interest;
                    }
                    
                    const lastMonthPayment = monthlyPrincipal + monthlyPrincipal * monthlyRate;
                    const totalPayment = amount + totalInterest;
                    
                    result.innerHTML = `
                        <div class="fun-formula">等额本金还款</div>
                        <div class="fun-result">首月还款: ${fmt(firstMonthPayment)} 元</div>
                        <div class="fun-result">末月还款: ${fmt(lastMonthPayment)} 元</div>
                        <div class="fun-result">总还款额: ${fmt(totalPayment)} 元</div>
                        <div class="fun-result">总利息: ${fmt(totalInterest)} 元</div>
                    `;
                }
                break;
            }
            case 'interest': {
                const principal = +$('principal').value;
                const rate = +$('annualRate').value / 100;
                const years = +$('investYears').value;
                const freq = +$('compoundFreq').value;
                
                const amount = principal * Math.pow(1 + rate / freq, freq * years);
                const interest = amount - principal;
                const effectiveRate = (Math.pow(1 + rate / freq, freq) - 1) * 100;
                
                result.innerHTML = `
                    <div class="fun-formula">复利计算公式: A = P × (1 + r/n)^(nt)</div>
                    <div class="fun-result">最终金额: ${fmt(amount)} 元</div>
                    <div class="fun-result">收益: ${fmt(interest)} 元</div>
                    <div class="fun-result">实际年化收益率: ${fmt(effectiveRate)}%</div>
                `;
                break;
            }
            case 'currency': {
                const amount = +$('currencyAmount').value;
                const from = $('currencyFrom').value;
                const to = $('currencyTo').value;
                
                const rates = {
                    'CNY': 1,
                    'USD': 7.2,
                    'EUR': 7.8,
                    'GBP': 9.1,
                    'JPY': 0.048,
                    'KRW': 0.0053,
                    'HKD': 0.92,
                    'TWD': 0.22
                };
                
                const resultAmount = amount * rates[from] / rates[to];
                
                result.innerHTML = `
                    <div class="fun-formula">汇率计算 (参考汇率)</div>
                    <div class="fun-result">${amount} ${from} = ${fmt(resultAmount)} ${to}</div>
                    <div class="fun-result">1 ${from} = ${fmt(rates[from] / rates[to])} ${to}</div>
                `;
                break;
            }
            case 'number': {
                const number = $('numberInput').value;
                const chinese = convertToChinese(number);
                result.innerHTML = `
                    <div class="fun-formula">大写数字转换</div>
                    <div class="fun-result">${chinese}</div>
                `;
                break;
            }
            case 'base': {
                const number = $('baseNumber').value;
                const from = +$('baseFrom').value;
                const to = +$('baseTo').value;
                
                let decimal;
                if (from === 10) decimal = parseInt(number);
                else if (from === 2) decimal = parseInt(number, 2);
                else if (from === 8) decimal = parseInt(number, 8);
                else if (from === 16) decimal = parseInt(number, 16);
                
                let resultNumber;
                if (to === 10) resultNumber = decimal.toString();
                else if (to === 2) resultNumber = decimal.toString(2);
                else if (to === 8) resultNumber = decimal.toString(8);
                else if (to === 16) resultNumber = decimal.toString(16).toUpperCase();
                
                result.innerHTML = `
                    <div class="fun-formula">进制转换</div>
                    <div class="fun-result">${number} (${from}进制) = ${resultNumber} (${to}进制)</div>
                `;
                break;
            }
            case 'speed': {
                const value = +$('speedValue').value;
                const from = $('speedFrom').value;
                const to = $('speedTo').value;
                
                const toMs = {
                    'kmh': 1/3.6,
                    'ms': 1,
                    'mph': 0.44704,
                    'knot': 0.514444,
                    'mach': 340.3
                };
                
                const msValue = value * toMs[from];
                const resultValue = msValue / toMs[to];
                
                result.innerHTML = `
                    <div class="fun-formula">速度单位转换</div>
                    <div class="fun-result">${value} ${from} = ${fmt(resultValue)} ${to}</div>
                    <div class="fun-result">${value} ${from} = ${fmt(msValue)} m/s</div>
                `;
                break;
            }
            case 'bmi': {
                const height = +$('height').value / 100;
                const weight = +$('weight').value;
                const bmi = weight / (height * height);
                
                let category;
                if (bmi < 18.5) category = '偏瘦';
                else if (bmi < 24) category = '正常';
                else if (bmi < 28) category = '偏胖';
                else category = '肥胖';
                
                result.innerHTML = `
                    <div class="fun-formula">BMI = 体重(kg) / 身高(m)²</div>
                    <div class="fun-result">BMI: ${fmt(bmi)}</div>
                    <div class="fun-result">分类: ${category}</div>
                    <div class="fun-result">正常范围: 18.5 - 24</div>
                `;
                break;
            }
            case 'tax': {
                const monthlyIncome = +$('taxIncome').value;
                const insurance = +$('taxInsurance').value;
                const specialDeduction = +$('taxSpecial').value;
                const threshold = +$('taxThreshold').value;
                
                // 应纳税所得额 = 月收入 - 五险一金 - 起征点 - 专项附加扣除
                const taxableIncome = Math.max(0, monthlyIncome - insurance - threshold - specialDeduction);
                
                // 中国个人所得税税率表 (月度)
                const brackets = [
                    { limit: 3000, rate: 0.03, deduction: 0 },
                    { limit: 12000, rate: 0.10, deduction: 210 },
                    { limit: 25000, rate: 0.20, deduction: 1410 },
                    { limit: 35000, rate: 0.25, deduction: 2660 },
                    { limit: 55000, rate: 0.30, deduction: 4410 },
                    { limit: 80000, rate: 0.35, deduction: 7160 },
                    { limit: Infinity, rate: 0.45, deduction: 15160 }
                ];
                
                let tax = 0;
                let bracketInfo = '';
                
                if (taxableIncome <= 0) {
                    tax = 0;
                    bracketInfo = '无需纳税';
                } else {
                    for (const bracket of brackets) {
                        if (taxableIncome <= bracket.limit) {
                            tax = taxableIncome * bracket.rate - bracket.deduction;
                            bracketInfo = `税率: ${fmt(bracket.rate * 100)}%，速算扣除: ${bracket.deduction} 元`;
                            break;
                        }
                    }
                }
                
                tax = Math.max(0, tax);
                const afterTaxIncome = monthlyIncome - insurance - tax;
                const annualTax = tax * 12;
                const annualIncome = afterTaxIncome * 12;
                
                result.innerHTML = `
                    <div class="fun-formula">个人所得税计算 (中国大陆)</div>
                    <div class="fun-result">应纳税所得额: ${fmt(taxableIncome)} 元/月</div>
                    <div class="fun-result">${bracketInfo}</div>
                    <div class="fun-result">应缴个税: ${fmt(tax)} 元/月</div>
                    <div class="fun-result">实发工资: ${fmt(afterTaxIncome)} 元/月</div>
                    <div class="fun-result">年缴个税: ${fmt(annualTax)} 元</div>
                    <div class="fun-result">年实发收入: ${fmt(annualIncome)} 元</div>
                `;
                break;
            }
        }
    } catch(e) { result.textContent = '错误: ' + e.message; }
}

// Multi-step relative chain calculator
const relNames = {
    'father': '父亲', 'mother': '母亲', 'brother': '兄弟', 'sister': '姐妹',
    'son': '儿子', 'daughter': '女儿', 'husband': '丈夫', 'wife': '妻子'
};

const relChainMap = {
    'self-father': { next: 'father', name: '父亲' },
    'self-mother': { next: 'mother', name: '母亲' },
    'self-brother': { next: 'brother', name: '兄弟' },
    'self-sister': { next: 'sister', name: '姐妹' },
    'self-son': { next: 'son', name: '儿子' },
    'self-daughter': { next: 'daughter', name: '女儿' },
    'self-husband': { next: 'husband', name: '丈夫' },
    'self-wife': { next: 'wife', name: '妻子' },
    'father-father': { next: 'father', name: '祖父(爷爷)' },
    'father-mother': { next: 'mother', name: '祖母(奶奶)' },
    'father-brother': { next: 'uncle', name: '伯父/叔父' },
    'father-sister': { next: 'aunt', name: '姑姑' },
    'father-son': { next: 'brother', name: '兄弟' },
    'father-daughter': { next: 'sister', name: '姐妹' },
    'father-wife': { next: 'mother', name: '继母' },
    'mother-father': { next: 'father', name: '外祖父(外公)' },
    'mother-mother': { next: 'mother', name: '外祖母(外婆)' },
    'mother-brother': { next: 'uncle', name: '舅舅' },
    'mother-sister': { next: 'aunt', name: '姨妈' },
    'mother-son': { next: 'brother', name: '兄弟' },
    'mother-daughter': { next: 'sister', name: '姐妹' },
    'mother-husband': { next: 'father', name: '继父' },
    'brother-father': { next: 'father', name: '父亲' },
    'brother-mother': { next: 'mother', name: '母亲' },
    'brother-brother': { next: 'brother', name: '兄弟' },
    'brother-sister': { next: 'sister', name: '姐妹' },
    'brother-son': { next: 'nephew', name: '侄子' },
    'brother-daughter': { next: 'niece', name: '侄女' },
    'brother-wife': { next: 'sister_in_law', name: '嫂子/弟媳' },
    'sister-father': { next: 'father', name: '父亲' },
    'sister-mother': { next: 'mother', name: '母亲' },
    'sister-brother': { next: 'brother', name: '兄弟' },
    'sister-sister': { next: 'sister', name: '姐妹' },
    'sister-son': { next: 'nephew', name: '外甥' },
    'sister-daughter': { next: 'niece', name: '外甥女' },
    'sister-husband': { next: 'brother_in_law', name: '姐夫/妹夫' },
    'son-father': { next: 'self', name: '自己' },
    'son-mother': { next: 'wife', name: '妻子' },
    'son-brother': { next: 'son', name: '儿子' },
    'son-sister': { next: 'daughter', name: '女儿' },
    'son-son': { next: 'grandson', name: '孙子' },
    'son-daughter': { next: 'granddaughter', name: '孙女' },
    'son-wife': { next: 'daughter_in_law', name: '儿媳' },
    'daughter-father': { next: 'self', name: '自己' },
    'daughter-mother': { next: 'wife', name: '妻子' },
    'daughter-brother': { next: 'son', name: '儿子' },
    'daughter-sister': { next: 'daughter', name: '女儿' },
    'daughter-son': { next: 'grandson', name: '外孙' },
    'daughter-daughter': { next: 'granddaughter', name: '外孙女' },
    'daughter-husband': { next: 'son_in_law', name: '女婿' },
    'husband-father': { next: 'father', name: '公公' },
    'husband-mother': { next: 'mother', name: '婆婆' },
    'husband-brother': { next: 'brother', name: '大伯/小叔' },
    'husband-sister': { next: 'sister', name: '姑子' },
    'husband-son': { next: 'son', name: '儿子' },
    'husband-daughter': { next: 'daughter', name: '女儿' },
    'wife-father': { next: 'father', name: '岳父' },
    'wife-mother': { next: 'mother', name: '岳母' },
    'wife-brother': { next: 'brother', name: '大舅/小舅' },
    'wife-sister': { next: 'sister', name: '大姨/小姨' },
    'wife-son': { next: 'son', name: '儿子' },
    'wife-daughter': { next: 'daughter', name: '女儿' },
    // Extended relations
    'uncle-son': { next: 'cousin', name: '堂兄弟' },
    'uncle-daughter': { next: 'cousin', name: '堂姐妹' },
    'aunt-son': { next: 'cousin', name: '表兄弟' },
    'aunt-daughter': { next: 'cousin', name: '表姐妹' },
    'uncle-father': { next: 'grandfather', name: '祖父' },
    'uncle-mother': { next: 'grandmother', name: '祖母' },
    'aunt-father': { next: 'grandfather', name: '祖父/外祖父' },
    'aunt-mother': { next: 'grandmother', name: '祖母/外祖母' },
    'nephew-father': { next: 'brother', name: '兄弟' },
    'nephew-mother': { next: 'sister_in_law', name: '嫂子/弟媳' },
    'niece-father': { next: 'brother', name: '兄弟' },
    'niece-mother': { next: 'sister_in_law', name: '嫂子/弟媳' },
    'grandson-father': { next: 'son', name: '儿子' },
    'grandson-mother': { next: 'daughter_in_law', name: '儿媳' },
    'granddaughter-father': { next: 'son', name: '儿子' },
    'granddaughter-mother': { next: 'daughter_in_law', name: '儿媳' },
    'cousin-father': { next: 'uncle', name: '伯父/叔父/舅舅' },
    'cousin-mother': { next: 'aunt', name: '姑姑/姨妈' },
    'cousin-son': { next: 'nephew', name: '侄子/外甥' },
    'cousin-daughter': { next: 'niece', name: '侄女/外甥女' },
    // Additional mappings for nephew/niece siblings
    'nephew-brother': { next: 'nephew', name: '外甥' },
    'nephew-sister': { next: 'niece', name: '外甥女' },
    'niece-brother': { next: 'nephew', name: '外甥' },
    'niece-sister': { next: 'niece', name: '外甥女' },
    // Grandchildren siblings
    'grandson-brother': { next: 'grandson', name: '孙子/外孙' },
    'grandson-sister': { next: 'granddaughter', name: '孙女/外孙女' },
    'granddaughter-brother': { next: 'grandson', name: '孙子/外孙' },
    'granddaughter-sister': { next: 'granddaughter', name: '孙女/外孙女' },
    // In-law relations
    'son_in_law-father': { next: 'father', name: '亲家公' },
    'son_in_law-mother': { next: 'mother', name: '亲家母' },
    'daughter_in_law-father': { next: 'father', name: '亲家公' },
    'daughter_in_law-mother': { next: 'mother', name: '亲家母' },
    // Spouse siblings
    'brother_in_law-wife': { next: 'sister', name: '姐妹' },
    'sister_in_law-husband': { next: 'brother', name: '兄弟' },
};

function resolveRelChain(chain) {
    let current = 'self';
    const pathParts = ['自己'];
    for (const rel of chain) {
        const key = `${current}-${rel}`;
        const mapping = relChainMap[key];
        if (mapping) {
            current = mapping.next;
            pathParts.push(mapping.name);
        } else {
            pathParts.push(`的${relNames[rel] || rel}(?)`);
            current = 'unknown';
        }
    }
    return {
        path: pathParts.join(' → '),
        name: pathParts[pathParts.length - 1]
    };
}

function addRelStep() {
    const chain = $('relChain');
    if (!chain) return;
    const steps = chain.querySelectorAll('.rel-step');
    if (steps.length >= 8) return; // max 8 steps
    const arrow = document.createElement('span');
    arrow.className = 'relation-arrow';
    arrow.textContent = '→';
    chain.appendChild(arrow);
    const sel = document.createElement('select');
    sel.className = 'rel-step';
    sel.dataset.step = steps.length;
    sel.innerHTML = `
        <option value="father">的父亲</option>
        <option value="mother">的母亲</option>
        <option value="brother">的兄弟</option>
        <option value="sister">的姐妹</option>
        <option value="son">的儿子</option>
        <option value="daughter">的女儿</option>
        <option value="husband">的丈夫</option>
        <option value="wife">的妻子</option>
    `;
    chain.appendChild(sel);
}

function removeRelStep() {
    const chain = $('relChain');
    if (!chain) return;
    const steps = chain.querySelectorAll('.rel-step');
    if (steps.length <= 1) return;
    // Remove last select and its preceding arrow
    const lastSel = steps[steps.length - 1];
    const prevArrow = lastSel.previousElementSibling;
    if (prevArrow && prevArrow.classList.contains('relation-arrow')) prevArrow.remove();
    lastSel.remove();
}

function convertToChinese(number) {
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
            if (digit === 0) { hasZero = true; }
            else {
                if (hasZero) { groupStr += '零'; hasZero = false; }
                groupStr += digits[digit] + units[unitIndex];
            }
        }
        if (groupStr) result += groupStr + bigUnits[groups.length - 1 - i];
    }
    if (!result) result = '零';
    if (decPart) {
        result += '点';
        for (let i = 0; i < decPart.length; i++) result += digits[parseInt(decPart[i])];
    }
    return result + '元整';
}

// ============================================================
//  Math helper: buildMathFunc — 安全构建数学函数
// ============================================================
function buildMathFunc(expr) {
    try {
        // 先替换函数名，避免 e 被误替换
        const safe = expr.replace(/\^/g, '**')
            .replace(/\bsin\b/g,'Math.sin').replace(/\bcos\b/g,'Math.cos')
            .replace(/\btan\b/g,'Math.tan').replace(/\basin\b/g,'Math.asin')
            .replace(/\bacos\b/g,'Math.acos').replace(/\batan\b/g,'Math.atan')
            .replace(/\bsinh\b/g,'Math.sinh').replace(/\bcosh\b/g,'Math.cosh')
            .replace(/\btanh\b/g,'Math.tanh').replace(/\bln\b/g,'Math.log')
            .replace(/\blog\b/g,'Math.log10').replace(/\bsqrt\b/g,'Math.sqrt')
            .replace(/\bcbrt\b/g,'Math.cbrt').replace(/\babs\b/g,'Math.abs')
            .replace(/\bexp\b/g,'Math.exp').replace(/\bpi\b/gi,'Math.PI')
            .replace(/\be\b(?![a-zA-Z])/g,'Math.E').replace(/\bn\b/g,'__n');
        return new Function('x','__n', `return ${safe}`);
    } catch { return null; }
}

// ============================================================
//  微积分计算器 (Calculus) — 参考 mathworld.net.cn
// ============================================================
let calculusType = 'derivative';
function setCalculusType(type, btn) {
    calculusType = type;
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateCalculusInputs();
}
function updateCalculusInputs() {
    const c = $('calculusInputs');
    switch (calculusType) {
        case 'derivative':
            c.innerHTML = `<div class="eq-input"><label>函数 f(x)</label><input id="derivFunc" value="x^3+2*x^2-5*x+1"><div class="input-desc">支持 +,-,*,/,^, sin,cos,tan,ln,log,sqrt,abs,exp,pi</div></div><div class="eq-input"><label>求导点 x₀ (留空=表达式)</label><input id="derivPoint" value=""><div class="input-desc">输入具体x值求数值导数，留空则给出符号表达式</div></div><div class="eq-input"><label>导数阶数</label><input id="derivOrder" value="1" type="number" min="1" max="10"><div class="input-desc">1=一阶导数，2=二阶导数...</div></div>`; break;
        case 'integral':
            c.innerHTML = `<div class="eq-input"><label>被积函数 f(x)</label><input id="integFunc" value="x^2"><div class="input-desc">支持 +,-,*,/,^, sin,cos,tan,ln,log,sqrt,exp,pi</div></div><div class="eq-input"><label>积分下限 a</label><input id="integA" value="0"></div><div class="eq-input"><label>积分上限 b</label><input id="integB" value="1"></div><div class="eq-input"><label>数值方法</label><select id="integMethod"><option value="simpson">辛普森法(精度高)</option><option value="trapezoid">梯形法(速度快)</option></select></div>`; break;
        case 'limit':
            c.innerHTML = `<div class="eq-input"><label>函数 f(x)</label><input id="limFunc" value="sin(x)/x"><div class="input-desc">支持 +,-,*,/,^, sin,cos,tan,ln,log,sqrt,exp,pi</div></div><div class="eq-input"><label>趋向点 x₀</label><input id="limPoint" value="0"><div class="input-desc">x趋向的值，可输入 inf 或 -inf 表示无穷</div></div>`; break;
        case 'series':
            c.innerHTML = `<div class="eq-input"><label>通项公式 a(n)</label><input id="seriesTerm" value="1/n^2"><div class="input-desc">用n表示项数，如 1/n^2, (-1)^n/n, 1/n!</div></div><div class="eq-input"><label>起始项 n</label><input id="seriesStart" value="1"><div class="input-desc">通常从n=1开始</div></div><div class="eq-input"><label>累加项数 N</label><input id="seriesN" value="1000"><div class="input-desc">累加前N项，越大越精确</div></div>`; break;
        case 'taylor':
            c.innerHTML = `<div class="eq-input"><label>函数 f(x)</label><input id="taylorFunc" value="sin(x)"><div class="input-desc">支持 +,-,*,/,^, sin,cos,tan,ln,log,sqrt,exp</div></div><div class="eq-input"><label>展开中心 x₀</label><input id="taylorCenter" value="0"><div class="input-desc">通常为0(麦克劳林展开)，也可为其他值</div></div><div class="eq-input"><label>展开阶数 n</label><input id="taylorOrder" value="8" type="number" min="1" max="20"><div class="input-desc">阶数越高，近似越精确</div></div>`; break;
    }
}

function numericalDerivative(f, x, h) {
    h = h || 1e-8;
    return (f(x+h,0) - f(x-h,0)) / (2*h);
}
// 迭代式高阶导数 (避免递归栈溢出)
function numericalDerivativeN(f, x, n, h) {
    h = h || 1e-5;
    if (n === 0) return f(x,0);
    if (n === 1) return numericalDerivative(f, x, h);
    // 使用有限差分表计算高阶导数
    const m = n + 2;
    const vals = [];
    for (let i = 0; i <= m; i++) {
        vals.push(f(x + (i - Math.floor(m/2)) * h, 0));
    }
    for (let k = 1; k <= n; k++) {
        for (let i = 0; i < vals.length - 1; i++) {
            vals[i] = (vals[i+1] - vals[i]) / h;
        }
        vals.pop();
    }
    return vals[0];
}
function simpsonIntegral(f, a, b, n) {
    n = n||10000; if(n%2)n++;
    const h=(b-a)/n; let s=f(a,0)+f(b,0);
    for(let i=1;i<n;i++) s+=f(a+i*h,0)*(i%2===0?2:4);
    return (h/3)*s;
}
function trapezoidIntegral(f, a, b, n) {
    n=n||10000; const h=(b-a)/n; let s=(f(a,0)+f(b,0))/2;
    for(let i=1;i<n;i++) s+=f(a+i*h,0);
    return h*s;
}
function erf(x) {
    const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
    const sign=x<0?-1:1; x=Math.abs(x); const t=1/(1+p*x);
    return sign*(1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x));
}
function taylorCoeffs(f, x0, n) {
    const c=[];
    for(let k=0;k<=n;k++) c.push(numericalDerivativeN(f,x0,k,1e-4)/fact(k));
    return c;
}

function calculateCalculus() {
    const r=$('calculusResult');
    try {
        switch(calculusType) {
            case 'derivative': {
                const expr=$('derivFunc').value.trim(), pt=$('derivPoint').value.trim(), order=parseInt($('derivOrder').value)||1;
                const f=buildMathFunc(expr);
                if(!f){r.textContent='无法解析';return;}
                let h=`<div class="calculus-formula">f(x) = ${expr}</div>`;
                if(pt!==''){const x0=parseFloat(pt),val=numericalDerivativeN(f,x0,order,1e-4);h+=`<div class="fun-result">f${'\u2032'.repeat(order)}(${fmt(x0)}) = ${fmt(val)}</div>`;}
                h+=`<div class="calculus-step">常用导数 (MathWorld):</div><div class="calculus-formula">d/dx[xⁿ]=nxⁿ⁻¹, d/dx[sin x]=cos x, d/dx[cos x]=-sin x\nd/dx[eˣ]=eˣ, d/dx[ln x]=1/x, d/dx[tan x]=sec²x\nd/dx[arcsin x]=1/√(1-x²), d/dx[arctan x]=1/(1+x²)</div>`;
                r.innerHTML=h; break;
            }
            case 'integral': {
                const expr=$('integFunc').value.trim(),a=parseFloat($('integA').value),b=parseFloat($('integB').value),m=$('integMethod').value;
                const f=buildMathFunc(expr);
                if(!f){r.textContent='无法解析';return;}
                const val=(m==='simpson'?simpsonIntegral:trapezoidIntegral)(f,a,b);
                r.innerHTML=`<div class="calculus-formula">∫[${a},${b}] ${expr} dx</div><div class="fun-result">积分值 ≈ ${fmt(val)}</div><div class="calculus-step">常用不定积分 (MathWorld):</div><div class="calculus-formula">∫xⁿdx=xⁿ⁺¹/(n+1)+C, ∫1/x dx=ln|x|+C\n∫sin x dx=-cos x+C, ∫cos x dx=sin x+C\n∫eˣdx=eˣ+C, ∫1/(1+x²)dx=arctan x+C\n∫1/√(1-x²)dx=arcsin x+C</div>`; break;
            }
            case 'limit': {
                const expr=$('limFunc').value.trim(),x0=parseFloat($('limPoint').value);
                const f=buildMathFunc(expr);
                if(!f){r.textContent='无法解析';return;}
                const left=f(x0-1e-10,0),right=f(x0+1e-10,0);
                const val=Math.abs(left-right)<1e-6?(left+right)/2:NaN;
                r.innerHTML=`<div class="calculus-formula">lim(x→${x0}) ${expr}</div><div class="fun-result">极限值 ≈ ${isFinite(val)?fmt(val):(isNaN(val)?'不存在':'±∞')}</div><div class="calculus-step">常用极限 (MathWorld):</div><div class="calculus-formula">lim(x→0) sin(x)/x = 1\nlim(x→∞) (1+1/x)ˣ = e\nlim(x→0) (eˣ-1)/x = 1\nlim(x→0) (1-cos x)/x² = 1/2\nlim(x→0) ln(1+x)/x = 1</div>`; break;
            }
        case 'series': {
            const termExpr=$('seriesTerm').value.trim(),start=parseInt($('seriesStart').value)||1,N=Math.min(parseInt($('seriesN').value)||1000,100000);
            const f=buildMathFunc(termExpr);
            if(!f){r.textContent='无法解析通项';return;}
            let sum=0;
            for(let n=start;n<start+N;n++){const v=f(0,n);if(!isFinite(v))break;sum+=v;}
                r.innerHTML=`<div class="calculus-formula">Σ a(n), n=${start}..${start+N-1}, a(n)=${termExpr}</div><div class="fun-result">部分和 ≈ ${fmt(sum)}</div><div class="calculus-step">著名级数 (MathWorld):</div><div class="calculus-formula">几何级数: Σrⁿ=1/(1-r), |r|&lt;1\n巴塞尔问题: Σ1/n² = π²/6 ≈ ${fmt(Math.PI*Math.PI/6)}\n交错调和: Σ(-1)ⁿ⁺¹/n = ln2 ≈ ${fmt(Math.LN2)}\n莱布尼茨: Σ(-1)ⁿ/(2n+1) = π/4 ≈ ${fmt(Math.PI/4)}</div>`; break;
            }
            case 'taylor': {
                const expr=$('taylorFunc').value.trim(),center=parseFloat($('taylorCenter').value)||0,order=Math.min(parseInt($('taylorOrder').value)||8,20);
                const f=buildMathFunc(expr);
                if(!f){r.textContent='无法解析';return;}
                const coeffs=taylorCoeffs(f,center,order);
                let poly='';
                for(let k=0;k<=order;k++){const c=coeffs[k];if(Math.abs(c)<1e-12)continue;const sign=c>=0&&poly?'+':'';const xp=k===0?'':k===1?`(x-${center})`:`(x-${center})^${k}`;poly+=sign+fmt(c)+xp;}
                r.innerHTML=`<div class="calculus-formula">f(x) ≈ ${poly||'0'}</div><div class="calculus-formula">展开中心 x₀=${center}, 阶数=${order}</div><div class="calculus-step">常用泰勒展开 (MathWorld):</div><div class="calculus-formula">eˣ = Σ xⁿ/n! = 1+x+x²/2!+...\nsin(x) = x-x³/3!+x⁵/5!-...\ncos(x) = 1-x²/2!+x⁴/4!-...\nln(1+x) = x-x²/2+x³/3-...\n1/(1-x) = 1+x+x²+x³+...</div>`; break;
            }
        }
    } catch(e){r.textContent='错误: '+e.message;}
}

// ============================================================
//  概率统计计算器 (Probability & Statistics)
// ============================================================
let statType='combination';
function setStatType(t,btn){statType=t;btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');updateStatInputs();}
function updateStatInputs(){
    const c=$('statInputs');
    switch(statType){
        case 'combination':c.innerHTML=`<div class="eq-input"><label>n (总数)</label><input id="combN" value="10"><div class="input-desc">从n个元素中选取</div></div><div class="eq-input"><label>r (选取数)</label><input id="combR" value="3"><div class="input-desc">选取r个元素，不考虑顺序</div></div>`;break;
        case 'permutation':c.innerHTML=`<div class="eq-input"><label>n (总数)</label><input id="permN" value="10"><div class="input-desc">从n个元素中选取</div></div><div class="eq-input"><label>r (选取数)</label><input id="permR" value="3"><div class="input-desc">选取r个元素，考虑顺序</div></div>`;break;
        case 'descriptive':c.innerHTML=`<div class="eq-input"><label>数据集 (逗号分隔)</label><input id="descData" value="2,4,4,4,5,5,7,9"><div class="input-desc">输入数字，用逗号分隔，如: 1,2,3,4,5</div></div>`;break;
        case 'binomial':c.innerHTML=`<div class="eq-input"><label>n (试验次数)</label><input id="binN" value="10"><div class="input-desc">独立重复试验的总次数</div></div><div class="eq-input"><label>p (成功概率)</label><input id="binP" value="0.5"><div class="input-desc">每次试验成功的概率，0到1之间</div></div><div class="eq-input"><label>k (成功次数)</label><input id="binK" value="5"><div class="input-desc">恰好成功k次的概率</div></div>`;break;
        case 'normal':c.innerHTML=`<div class="eq-input"><label>μ (均值)</label><input id="normMu" value="0"><div class="input-desc">正态分布的期望值/中心位置</div></div><div class="eq-input"><label>σ (标准差)</label><input id="normSig" value="1"><div class="input-desc">标准差，必须为正数，越大分布越分散</div></div><div class="eq-input"><label>x (计算点)</label><input id="normX" value="1.96"><div class="input-desc">计算 P(X≤x) 的值</div></div>`;break;
        case 'poisson':c.innerHTML=`<div class="eq-input"><label>λ (平均发生率)</label><input id="poisL" value="3"><div class="input-desc">单位时间内平均发生次数</div></div><div class="eq-input"><label>k (发生次数)</label><input id="poisK" value="2"><div class="input-desc">恰好发生k次的概率</div></div>`;break;
    }
}
function perm(n,r){if(r>n)return 0;let v=1;for(let i=0;i<r;i++)v*=(n-i);return v;}
function comb(n,r){if(r>n)return 0;if(r>n/2)r=n-r;let v=1;for(let i=0;i<r;i++)v=v*(n-i)/(i+1);return Math.round(v);}
function binPMF(n,k,p){return comb(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
function normCDF(x,m,s){const z=(x-m)/s;return 0.5*(1+erf(z/Math.sqrt(2)));}
function poisPMF(l,k){return Math.exp(-l)*Math.pow(l,k)/fact(k);}

function calculateStat(){
    const r=$('statResult');
    try{
        switch(statType){
            case 'combination':{const n=+$('combN').value,r2=+$('combR').value;r.innerHTML=`<div class="fun-result">C(${n},${r2}) = ${comb(n,r2)}</div><div class="fun-result">P(${n},${r2}) = ${perm(n,r2)}</div>`;break;}
            case 'permutation':{const n=+$('permN').value,r2=+$('permR').value;r.innerHTML=`<div class="fun-result">P(${n},${r2}) = ${perm(n,r2)}</div><div class="fun-result">${n}! = ${fmt(fact(n))}</div>`;break;}
            case 'descriptive':{const data=$('descData').value.split(',').map(s=>+s.trim()).filter(v=>!isNaN(v));if(!data.length){r.textContent='请输入有效数据';return;}const n=data.length,su=data.reduce((a,b)=>a+b,0),mean=su/n;const sorted=[...data].sort((a,b)=>a-b);const med=n%2===0?(sorted[n/2-1]+sorted[n/2])/2:sorted[n>>1];const vari=data.reduce((s,v)=>s+(v-mean)**2,0)/n;const sd=Math.sqrt(vari);r.innerHTML=`<table class="stat-table"><tr><th>统计量</th><th>值</th></tr><tr><td>均值</td><td>${fmt(mean)}</td></tr><tr><td>中位数</td><td>${fmt(med)}</td></tr><tr><td>最小值</td><td>${fmt(sorted[0])}</td></tr><tr><td>最大值</td><td>${fmt(sorted[n-1])}</td></tr><tr><td>方差</td><td>${fmt(vari)}</td></tr><tr><td>标准差</td><td>${fmt(sd)}</td></tr><tr><td>总和</td><td>${fmt(su)}</td></tr></table>`;break;}
            case 'binomial':{const n=+$('binN').value,p=+$('binP').value,k=+$('binK').value;const pmf=binPMF(n,k,p);let cdf=0;for(let i=0;i<=k;i++)cdf+=binPMF(n,i,p);r.innerHTML=`<div class="calculus-formula">X~B(${n},${p})</div><div class="fun-result">P(X=${k}) = ${fmt(pmf)}</div><div class="fun-result">P(X≤${k}) = ${fmt(cdf)}</div><div class="fun-result">E(X)=${fmt(n*p)}, Var=${fmt(n*p*(1-p))}</div>`;break;}
            case 'normal':{const m=+$('normMu').value,s=+$('normSig').value,x=+$('normX').value;const cdf=normCDF(x,m,s);r.innerHTML=`<div class="calculus-formula">X~N(${m},${s}²)</div><div class="fun-result">P(X≤${x}) = ${fmt(cdf)}</div><div class="fun-result">P(X>${x}) = ${fmt(1-cdf)}</div><div class="fun-result">Z = ${fmt((x-m)/s)}</div>`;break;}
            case 'poisson':{const l=+$('poisL').value,k=+$('poisK').value;let cdf=0;for(let i=0;i<=k;i++)cdf+=poisPMF(l,i);r.innerHTML=`<div class="calculus-formula">X~Poisson(λ=${l})</div><div class="fun-result">P(X=${k}) = ${fmt(poisPMF(l,k))}</div><div class="fun-result">P(X≤${k}) = ${fmt(cdf)}</div><div class="fun-result">E(X)=Var(X)=${fmt(l)}</div>`;break;}
        }
    }catch(e){r.textContent='错误: '+e.message;}
}

// ============================================================
//  数论计算器 (Number Theory)
// ============================================================
let numTheoryType='prime';
function setNumTheoryType(t,btn){numTheoryType=t;btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');updateNumTheoryInputs();}
function updateNumTheoryInputs(){
    const c=$('numTheoryInputs');
    switch(numTheoryType){
        case 'prime':c.innerHTML=`<div class="eq-input"><label>检测数字</label><input id="ntPrime" value="997"><div class="input-desc">判断该数是否为素数(只能被1和自身整除)</div></div>`;break;
        case 'primeFactor':c.innerHTML=`<div class="eq-input"><label>分解数字</label><input id="ntFactor" value="360"><div class="input-desc">将该数分解为素因数的乘积</div></div>`;break;
        case 'gcd':c.innerHTML=`<div class="eq-input"><label>数字 a</label><input id="ntA" value="48"><div class="input-desc">第一个正整数</div></div><div class="eq-input"><label>数字 b</label><input id="ntB" value="18"><div class="input-desc">第二个正整数</div></div>`;break;
        case 'modpow':c.innerHTML=`<div class="eq-input"><label>底数 a</label><input id="ntBase" value="2"><div class="input-desc">计算 a^b mod m</div></div><div class="eq-input"><label>指数 b</label><input id="ntExp" value="10"><div class="input-desc">指数，非负整数</div></div><div class="eq-input"><label>模数 m</label><input id="ntMod" value="1000"><div class="input-desc">取模的除数，正整数</div></div>`;break;
        case 'euler':c.innerHTML=`<div class="eq-input"><label>数字 n</label><input id="ntEuler" value="12"><div class="input-desc">计算 φ(n)：小于n且与n互素的正整数个数</div></div>`;break;
        case 'fibonacci':c.innerHTML=`<div class="eq-input"><label>项数 n</label><input id="ntFib" value="20"><div class="input-desc">计算第n个斐波那契数 F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)</div></div>`;break;
    }
}
function isPrime(n){if(n<2)return false;if(n<4)return true;if(n%2===0||n%3===0)return false;for(let i=5;i*i<=n;i+=6)if(n%i===0||n%(i+2)===0)return false;return true;}
function primeFactors(n){const f=[];let d=2;while(d*d<=n){while(n%d===0){f.push(d);n/=d;}d++;}if(n>1)f.push(n);return f;}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;}
function lcm(a,b){return Math.abs(a*b)/gcd(a,b);}
function eulerPhi(n){let r=n;for(let p=2;p*p<=n;p++){if(n%p===0){while(n%p===0)n/=p;r-=r/p;}}if(n>1)r-=r/n;return Math.round(r);}
function modpow(base,exp,mod){let r=1;base%=mod;while(exp>0){if(exp%2===1)r=(r*base)%mod;base=(base*base)%mod;exp=Math.floor(exp/2);}return r;}
function fibonacci(n){if(n<=0)return 0;if(n===1)return 1;let a=0,b=1;for(let i=2;i<=n;i++){[a,b]=[b,a+b];}return b;}

function calculateNumTheory(){
    const r=$('numTheoryResult');
    try{
        switch(numTheoryType){
            case 'prime':{const n=+$('ntPrime').value;const ip=isPrime(n);r.innerHTML=`<div class="nt-result">${n} 是${ip?'<span style="color:var(--green)">素数</span>':'合数'}</div>`;if(!ip){const f=primeFactors(n);r.innerHTML+=`<div class="nt-result">${n} = ${f.join(' × ')}</div>`;}break;}
            case 'primeFactor':{const n=+$('ntFactor').value;const f=primeFactors(n);const ct={};f.forEach(p=>ct[p]=(ct[p]||0)+1);const ex=Object.entries(ct).map(([p,e])=>e===1?p:`${p}^${e}`).join(' × ');r.innerHTML=`<div class="nt-result">${n} = ${ex}</div>`;break;}
            case 'gcd':{const a=+$('ntA').value,b=+$('ntB').value;r.innerHTML=`<div class="nt-result">GCD(${a},${b}) = ${gcd(a,b)}</div><div class="nt-result">LCM(${a},${b}) = ${fmt(lcm(a,b))}</div>`;break;}
            case 'modpow':{const a=+$('ntBase').value,b=+$('ntExp').value,m=+$('ntMod').value;r.innerHTML=`<div class="nt-result">${a}^${b} mod ${m} = ${modpow(a,b,m)}</div>`;break;}
            case 'euler':{const n=+$('ntEuler').value;r.innerHTML=`<div class="nt-result">φ(${n}) = ${eulerPhi(n)}</div>`;break;}
            case 'fibonacci':{const n=+$('ntFib').value;const seq=[];for(let i=0;i<=Math.min(n,25);i++)seq.push(fibonacci(i));r.innerHTML=`<div class="nt-result">F(${n}) = ${fmt(fibonacci(n))}</div><div class="nt-result">${n>25?'前26项':''}: ${seq.map(v=>fmt(v)).join(', ')}</div>`;break;}
        }
    }catch(e){r.textContent='错误: '+e.message;}
}

// ============================================================
//  代数扩展计算器 (Algebra Extended)
// ============================================================
let algebraType='cubic';
function setAlgebraType(t,btn){algebraType=t;btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');updateAlgebraInputs();}
function updateAlgebraInputs(){
    const c=$('algebraInputs');
    switch(algebraType){
        case 'cubic':c.innerHTML=`<div class="eq-input"><label>a (x³系数)</label><input id="algA" value="1"><div class="input-desc">三次项系数，不能为0</div></div><div class="eq-input"><label>b (x²系数)</label><input id="algB" value="-6"><div class="input-desc">二次项系数</div></div><div class="eq-input"><label>c (x系数)</label><input id="algC" value="11"><div class="input-desc">一次项系数</div></div><div class="eq-input"><label>d (常数项)</label><input id="algD" value="-6"><div class="input-desc">方程右侧常数</div></div>`;break;
        case 'polynomial':c.innerHTML=`<div class="eq-input"><label>系数 (高次在前)</label><input id="polyC" value="1,-6,11,-6"><div class="input-desc">用逗号分隔，从最高次到常数项</div></div><div class="eq-input"><label>求值点 x</label><input id="polyX" value="2"><div class="input-desc">代入求值的x值</div></div>`;break;
        case 'set':c.innerHTML=`<div class="eq-input"><label>集合 A</label><input id="setA" value="1,2,3,4,5"><div class="input-desc">用逗号分隔的元素</div></div><div class="eq-input"><label>集合 B</label><input id="setB" value="3,4,5,6,7"><div class="input-desc">用逗号分隔的元素</div></div>`;break;
        case 'logic':c.innerHTML=`<div class="eq-input"><label>命题 P</label><select id="lP"><option value="1">真</option><option value="0">假</option></select><div class="input-desc">选择命题P的真值</div></div><div class="eq-input"><label>命题 Q</label><select id="lQ"><option value="1">真</option><option value="0">假</option></select><div class="input-desc">选择命题Q的真值</div></div>`;break;
        case 'sequence':c.innerHTML=`<div class="eq-input"><label>类型</label><select id="seqT"><option value="arith">等差数列</option><option value="geo">等比数列</option></select><div class="input-desc">选择数列类型</div></div><div class="eq-input"><label>首项 a₁</label><input id="seqA1" value="1"><div class="input-desc">数列的第一项</div></div><div class="eq-input"><label>公差/公比</label><input id="seqD" value="2"><div class="input-desc">等差为d，等比为q</div></div><div class="eq-input"><label>项数 n</label><input id="seqN" value="10"><div class="input-desc">要求的项数</div></div>`;break;
    }
}
function horner(coeff,x){let r=0;for(let i=0;i<coeff.length;i++)r=r*x+coeff[i];return r;}
function solveCubic(a,b,c,d){
    if(a===0)return[];
    const p=(3*a*c-b*b)/(3*a*a),q=(2*b*b*b-9*a*b*c+27*a*a*d)/(27*a*a*a);
    const disc=q*q/4+p*p*p/27;const roots=[];
    if(disc>0){const u=Math.cbrt(-q/2+Math.sqrt(disc)),v=Math.cbrt(-q/2-Math.sqrt(disc));roots.push(u+v-b/(3*a));}
    else if(Math.abs(disc)<1e-15){roots.push(3*q/p-b/(3*a));roots.push(-3*q/(2*p)-b/(3*a));}
    else{const r=Math.sqrt(-p*p*p/27),theta=Math.acos(-q/(2*r));for(let k=0;k<3;k++)roots.push(2*Math.cbrt(r)*Math.cos((theta+2*Math.PI*k)/3)-b/(3*a));}
    return roots;
}
function calculateAlgebra(){
    const r=$('algebraResult');
    try{
        switch(algebraType){
            case 'cubic':{const a=+$('algA').value,b=+$('algB').value,c=+$('algC').value,d=+$('algD').value;const roots=solveCubic(a,b,c,d);r.innerHTML=`<div class="algebra-poly">${a}x³+${b}x²+${c}x+${d}=0</div>`;roots.forEach((x,i)=>r.innerHTML+=`<div class="fun-result">x${i+1} = ${fmt(x)}</div>`);break;}
            case 'polynomial':{const coeff=$('polyC').value.split(',').map(s=>+s.trim());const x=+$('polyX').value;const v=horner(coeff,x);r.innerHTML=`<div class="fun-result">P(${x}) = ${fmt(v)}</div>`;break;}
            case 'set':{const a=new Set($('setA').value.split(',').map(s=>s.trim()));const b=new Set($('setB').value.split(',').map(s=>s.trim()));const u=new Set([...a,...b]);const inter=[...a].filter(x=>b.has(x));const diff=[...a].filter(x=>!b.has(x));r.innerHTML=`<div class="fun-result">A∪B={${[...u].join(',')}}</div><div class="fun-result">A∩B={${inter.join(',')}}</div><div class="fun-result">A-B={${diff.join(',')}}</div>`;break;}
            case 'logic':{const P=!!+$('lP').value,Q=!!+$('lQ').value;r.innerHTML=`<table class="stat-table"><tr><th>运算</th><th>结果</th></tr><tr><td>P∧Q</td><td>${P&&Q?'真':'假'}</td></tr><tr><td>P∨Q</td><td>${P||Q?'真':'假'}</td></tr><tr><td>¬P</td><td>${!P?'真':'假'}</td></tr><tr><td>P→Q</td><td>${!P||Q?'真':'假'}</td></tr><tr><td>P↔Q</td><td>${P===Q?'真':'假'}</td></tr></table>`;break;}
            case 'sequence':{const t=$('seqT').value,a1=+$('seqA1').value,d=+$('seqD').value,n=+$('seqN').value;if(t==='arith'){const an=a1+(n-1)*d,s=n*(a1+an)/2;r.innerHTML=`<div class="fun-result">aₙ=${fmt(an)}, Sₙ=${fmt(s)}</div>`;}else{const an=a1*Math.pow(d,n-1),s=Math.abs(d-1)<1e-15?n*a1:a1*(1-Math.pow(d,n))/(1-d);r.innerHTML=`<div class="fun-result">aₙ=${fmt(an)}, Sₙ=${fmt(s)}</div>`;}break;}
        }
    }catch(e){r.textContent='错误: '+e.message;}
}

// ============================================================
//  应用数学计算器 (Applied Math)
// ============================================================
let appliedType='newton';
function setAppliedType(t,btn){appliedType=t;btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');updateAppliedInputs();}
function updateAppliedInputs(){
    const c=$('appliedInputs');
    switch(appliedType){
        case 'newton':c.innerHTML=`<div class="eq-input"><label>f(x)</label><input id="nFunc" value="x^3-2*x-5"></div><div class="eq-input"><label>x₀</label><input id="nX0" value="2"></div><div class="eq-input"><label>最大迭代</label><input id="nMax" value="20"></div>`;break;
        case 'regression':c.innerHTML=`<div class="eq-input"><label>x 数据</label><input id="rX" value="1,2,3,4,5"></div><div class="eq-input"><label>y 数据</label><input id="rY" value="2.1,3.9,6.2,7.8,10.1"></div>`;break;
        case 'interpolation':c.innerHTML=`<div class="eq-input"><label>x 坐标</label><input id="iX" value="0,1,2,3"></div><div class="eq-input"><label>y 坐标</label><input id="iY" value="1,2,5,10"></div><div class="eq-input"><label>插值点</label><input id="iP" value="1.5"></div>`;break;
        case 'numericalIntegral':c.innerHTML=`<div class="eq-input"><label>f(x)</label><input id="niFunc" value="exp(-x^2)"></div><div class="eq-input"><label>a</label><input id="niA" value="0"></div><div class="eq-input"><label>b</label><input id="niB" value="1"></div>`;break;
        case 'ode':c.innerHTML=`<div class="eq-input"><label>dy/dx=f(x,y)</label><input id="odeF" value="-2*y+x"></div><div class="eq-input"><label>x₀</label><input id="odeX0" value="0"></div><div class="eq-input"><label>y₀</label><input id="odeY0" value="1"></div><div class="eq-input"><label>h</label><input id="odeH" value="0.1"></div><div class="eq-input"><label>步数</label><input id="odeN" value="10"></div>`;break;
    }
}
function calculateApplied(){
    const r=$('appliedResult');
    try{
        switch(appliedType){
            case 'newton':{
                const expr=$('nFunc').value.trim();let x=+$('nX0').value;const maxI=+$('nMax').value;
                const f=buildMathFunc(expr);if(!f){r.textContent='无法解析';return;}
                let rows='';let found=false;
                for(let i=0;i<maxI;i++){
                    const fx=f(x,0),fpx=numericalDerivative(f,x);
                    if(Math.abs(fpx)<1e-15)break;
                    const xn=x-fx/fpx;
                    rows+=`<tr><td>${i}</td><td>${fmt(x)}</td><td>${fmt(fx)}</td><td>${fmt(xn)}</td></tr>`;
                    if(Math.abs(xn-x)<1e-12){x=xn;found=true;break;}
                    x=xn;
                }
                r.innerHTML=`<div class="fun-result">根 ≈ ${fmt(x)}${found?' (已收敛)':''}</div><table class="iteration-table"><tr><th>迭代</th><th>xₙ</th><th>f(xₙ)</th><th>xₙ₊₁</th></tr>${rows}</table><div class="calculus-step">牛顿法: xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)</div>`;break;
            }
            case 'regression':{
                const xs=$('rX').value.split(',').map(s=>+s.trim()),ys=$('rY').value.split(',').map(s=>+s.trim());
                if(xs.length!==ys.length||xs.length<2){r.textContent='数据长度需一致';return;}
                const n=xs.length,sx=xs.reduce((a,b)=>a+b,0),sy=ys.reduce((a,b)=>a+b,0);
                const sxx=xs.reduce((a,x)=>a+x*x,0),sxy=xs.reduce((a,x,i)=>a+x*ys[i],0);
                const b=(n*sxy-sx*sy)/(n*sxx-sx*sx),a=(sy-b*sx)/n;
                const ym=sy/n,ssTot=ys.reduce((s,y)=>s+(y-ym)**2,0),ssRes=ys.reduce((s,y,i)=>s+(y-(a+b*xs[i]))**2,0);
                const r2=1-ssRes/ssTot;
                r.innerHTML=`<div class="calculus-formula">y = ${fmt(b)}x + ${fmt(a)}</div><div class="fun-result">R² = ${fmt(r2)}</div><div class="fun-result">斜率 = ${fmt(b)}, 截距 = ${fmt(a)}</div>`;break;
            }
            case 'interpolation':{
                const xs=$('iX').value.split(',').map(s=>+s.trim()),ys=$('iY').value.split(',').map(s=>+s.trim());
                const xp=+$('iP').value;const n=xs.length;let yp=0;
                for(let i=0;i<n;i++){let li=1;for(let j=0;j<n;j++){if(i!==j)li*=(xp-xs[j])/(xs[i]-xs[j]);}yp+=ys[i]*li;}
                r.innerHTML=`<div class="calculus-formula">拉格朗日插值</div><div class="fun-result">L(${xp}) = ${fmt(yp)}</div>`;break;
            }
            case 'numericalIntegral':{
                const expr=$('niFunc').value.trim(),a=+$('niA').value,b=+$('niB').value;
                const f=buildMathFunc(expr);if(!f){r.textContent='无法解析';return;}
                const val=simpsonIntegral(f,a,b);
                r.innerHTML=`<div class="calculus-formula">∫[${a},${b}] ${expr} dx</div><div class="fun-result">≈ ${fmt(val)}</div>`;break;
            }
            case 'ode':{
                const expr=$('odeF').value.trim(),x0=+$('odeX0').value,y0=+$('odeY0').value,h=+$('odeH').value,n=+$('odeN').value;
                // ODE 需要特殊的函数构建 (x,y) 而不是 (x,n)
                try {
                    const safe = expr.replace(/\^/g, '**')
                        .replace(/\bsin\b/g,'Math.sin').replace(/\bcos\b/g,'Math.cos')
                        .replace(/\btan\b/g,'Math.tan').replace(/\bln\b/g,'Math.log')
                        .replace(/\blog\b/g,'Math.log10').replace(/\bsqrt\b/g,'Math.sqrt')
                        .replace(/\babs\b/g,'Math.abs').replace(/\bexp\b/g,'Math.exp')
                        .replace(/\bpi\b/gi,'Math.PI');
                    var f = new Function('x','y', `return ${safe}`);
                } catch(e2){r.textContent='无法解析';return;}
                let rows='';let x=x0,y=y0;
                for(let i=0;i<=n;i++){
                    rows+=`<tr><td>${i}</td><td>${fmt(x)}</td><td>${fmt(y)}</td></tr>`;
                    const k1=f(x,y);const k2=f(x+h/2,y+h*k1/2);
                    const k3=f(x+h/2,y+h*k2/2);const k4=f(x+h,y+h*k3);
                    y=y+h*(k1+2*k2+2*k3+k4)/6;x=x+h;
                }
                r.innerHTML=`<div class="fun-result">y(${fmt(x0+n*h)}) ≈ ${fmt(y)}</div><table class="iteration-table"><tr><th>步</th><th>x</th><th>y</th></tr>${rows}</table><div class="calculus-step">龙格-库塔法 (RK4)</div>`;break;
            }
        }
    }catch(e){r.textContent='错误: '+e.message;}
}

// ===== Math Tutorial System =====
// Based on MathWorld (mathworld.net.cn)
const tutorialData = {
    algebra: [
        {
            title: { zh: '韦达定理', en: "Vieta's Formulas", ja: 'ヴィエタの公式' },
            formula: 'x₁ + x₂ = -b/a\nx₁ · x₂ = c/a',
            explanation: { zh: '一元二次方程 ax²+bx+c=0 的两根之和为 -b/a，两根之积为 c/a。', en: 'For ax²+bx+c=0: sum=-b/a, product=c/a.', ja: '二次方程式: 和=-b/a、積=c/a。' },
            example: { zh: 'x²-5x+6=0 → 和=5, 积=6, 解为2和3', en: 'x²-5x+6=0 → sum=5, prod=6, roots 2&3', ja: 'x²-5x+6=0 → 和=5, 積=6, 解2と3' },
            practice: { zh: '已知 2x²-8x+6=0，求两根之和与积', en: 'Given 2x²-8x+6=0, find sum/product', ja: '2x²-8x+6=0 で和と積を' },
            inputs: [
                { id:'tut_a', label:{zh:'系数 a',en:'a',ja:'係数a'}, ph:'2' },
                { id:'tut_b', label:{zh:'系数 b',en:'b',ja:'係数b'}, ph:'-8' },
                { id:'tut_c', label:{zh:'系数 c',en:'c',ja:'係数c'}, ph:'6' }
            ],
            solve(v) {
                const a=+v.tut_a, b=+v.tut_b, c=+v.tut_c;
                if(!a) return 'a ≠ 0';
                const d=b*b-4*a*c;
                let r=`和=${(-b/a).toFixed(4)} 积=${(c/a).toFixed(4)}`;
                if(d>=0){const x1=(-b+Math.sqrt(d))/(2*a),x2=(-b-Math.sqrt(d))/(2*a);r+=`\nx₁=${x1.toFixed(4)}, x₂=${x2.toFixed(4)}`;}
                return r;
            }
        },
        {
            title: { zh: '因式分解', en: 'Factoring', ja: '因数分解' },
            formula: 'ax²+bx+c = a(x-x₁)(x-x₂)',
            explanation: { zh: '二次多项式分解为两个一次因式的乘积。', en: 'Decompose quadratic into linear factors.', ja: '二次多項式を一次因数の積に分解。' },
            example: { zh: 'x²-5x+6 = (x-2)(x-3)', en: 'x²-5x+6 = (x-2)(x-3)', ja: 'x²-5x+6 = (x-2)(x-3)' },
            practice: { zh: '因式分解 x²+3x-10', en: 'Factor x²+3x-10', ja: '因数分解 x²+3x-10' },
            inputs: [
                { id:'tut_fa', label:{zh:'系数 a',en:'a',ja:'係数a'}, ph:'1' },
                { id:'tut_fb', label:{zh:'系数 b',en:'b',ja:'係数b'}, ph:'3' },
                { id:'tut_fc', label:{zh:'系数 c',en:'c',ja:'係数c'}, ph:'-10' }
            ],
            solve(v) {
                const a=+v.tut_fa, b=+v.tut_fb, c=+v.tut_fc;
                if(!a) return 'a ≠ 0';
                const d=b*b-4*a*c;
                if(d<0) return '判别式<0';
                const x1=(-b+Math.sqrt(d))/(2*a), x2=(-b-Math.sqrt(d))/(2*a);
                return `=(x${x1>=0?'-':'+'}${Math.abs(x1).toFixed(4)})(x${x2>=0?'-':'+'}${Math.abs(x2).toFixed(4)})`;
            }
        }
    ],
    calculus: [
        {
            title: { zh: '导数的定义', en: 'Derivative Definition', ja: '微分の定義' },
            formula: "f'(x) = lim[h→0] (f(x+h)-f(x))/h",
            explanation: { zh: '导数是函数瞬时变化率，几何上是切线斜率。', en: 'Derivative = instantaneous rate of change.', ja: '微分は瞬間変化率、接線の傾き。' },
            example: { zh: 'f(x)=x², f\'(3)=6', en: 'f(x)=x², f\'(3)=6', ja: 'f(x)=x², f\'(3)=6' },
            practice: { zh: '求 f(x)=x³ 在 x=2 的导数', en: 'Find f\'(2) for f(x)=x³', ja: 'f(x)=x³ の x=2 での微分' },
            inputs: [
                { id:'tut_df', label:{zh:'函数 f(x)',en:'f(x)',ja:'関数f(x)'}, ph:'x^3' },
                { id:'tut_dx', label:{zh:'求导点 x₀',en:'x₀',ja:'微分点x₀'}, ph:'2' }
            ],
            solve(v) {
                const x0=+v.tut_dx; if(isNaN(x0)) return '无效';
                try{
                    const s=(v.tut_df||'x^2').replace(/\^/g,'**').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan').replace(/ln/g,'Math.log').replace(/log/g,'Math.log10').replace(/sqrt/g,'Math.sqrt').replace(/exp/g,'Math.exp');
                    const f=new Function('x','return '+s), h=1e-7, d=(f(x0+h)-f(x0-h))/(2*h);
                    return `f(${x0})=${f(x0).toFixed(6)}\nf'(${x0})≈${d.toFixed(6)}`;
                }catch(e){return '错误: '+e.message;}
            }
        },
        {
            title: { zh: '定积分(数值)', en: 'Definite Integral', ja: '定積分' },
            formula: '∫[a,b] f(x)dx',
            explanation: { zh: '用梯形法数值近似计算定积分。', en: 'Trapezoidal rule numerical approximation.', ja: '台形公式による数値近似。' },
            example: { zh: '∫[0,2] x²dx = 8/3 ≈ 2.6667', en: '∫[0,2] x²dx = 8/3 ≈ 2.6667', ja: '∫[0,2] x²dx ≈ 2.6667' },
            practice: { zh: '计算 ∫[1,3](2x+1)dx', en: 'Evaluate ∫[1,3](2x+1)dx', ja: '∫[1,3](2x+1)dx を計算' },
            inputs: [
                { id:'tut_if', label:{zh:'f(x)',en:'f(x)',ja:'f(x)'}, ph:'x^2' },
                { id:'tut_ia', label:{zh:'下限 a',en:'a',ja:'下限a'}, ph:'0' },
                { id:'tut_ib', label:{zh:'上限 b',en:'b',ja:'上限b'}, ph:'2' }
            ],
            solve(v) {
                const a=+v.tut_ia, b=+v.tut_ib;
                if(isNaN(a)||isNaN(b)) return '无效';
                try{
                    const s=(v.tut_if||'x^2').replace(/\^/g,'**').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan').replace(/ln/g,'Math.log').replace(/log/g,'Math.log10').replace(/sqrt/g,'Math.sqrt').replace(/exp/g,'Math.exp');
                    const f=new Function('x','return '+s), n=10000, h=(b-a)/n;
                    let sum=f(a)+f(b); for(let i=1;i<n;i++) sum+=2*f(a+i*h);
                    return `∫[${a},${b}] ≈ ${((h/2)*sum).toFixed(6)}`;
                }catch(e){return '错误: '+e.message;}
            }
        }
    ],
    geometry: [
        {
            title: { zh: '勾股定理', en: 'Pythagorean Theorem', ja: 'ピタゴラスの定理' },
            formula: 'a² + b² = c²',
            explanation: { zh: '直角三角形，两直角边平方和等于斜边平方。', en: 'Right triangle: a²+b²=c².', ja: '直角三角形: a²+b²=c²。' },
            example: { zh: 'a=3, b=4 → c=5', en: 'a=3, b=4 → c=5', ja: 'a=3, b=4 → c=5' },
            practice: { zh: '求 a=5, b=12 的斜边', en: 'Find c for a=5, b=12', ja: 'a=5, b=12 で c' },
            inputs: [
                { id:'tut_pa', label:{zh:'边 a',en:'a',ja:'辺a'}, ph:'3' },
                { id:'tut_pb', label:{zh:'边 b',en:'b',ja:'辺b'}, ph:'4' }
            ],
            solve(v) {
                const a=+v.tut_pa, b=+v.tut_pb;
                if(isNaN(a)||isNaN(b)) return '无效';
                return `c=√(${a}²+${b}²)=${Math.sqrt(a*a+b*b).toFixed(4)}\n面积=½·${a}·${b}=${(a*b/2).toFixed(4)}`;
            }
        },
        {
            title: { zh: '圆的面积与周长', en: 'Circle: Area & Circumference', ja: '円の面積と周長' },
            formula: '面积=πr²  周长=2πr',
            explanation: { zh: '圆面积=πr²，周长=2πr。', en: 'Area=πr², Circ=2πr.', ja: '面積=πr², 周長=2πr。' },
            example: { zh: 'r=5 → 面积≈78.54, 周长≈31.42', en: 'r=5 → area≈78.54, circ≈31.42', ja: 'r=5 → 面積≈78.54' },
            practice: { zh: '求 r=7 的面积和周长', en: 'Find area and circ for r=7', ja: 'r=7 の面積と周長' },
            inputs: [{ id:'tut_cr', label:{zh:'半径 r',en:'r',ja:'半径r'}, ph:'5' }],
            solve(v) {
                const r=+v.tut_cr; if(isNaN(r)||r<=0) return '请输入正数';
                return `面积=π·${r}²=${(r*r*Math.PI).toFixed(4)}\n周长=2π·${r}=${(2*r*Math.PI).toFixed(4)}`;
            }
        }
    ],
    probability: [
        {
            title: { zh: '古典概型', en: 'Classical Probability', ja: '古典的確率' },
            formula: 'P(A) = m/n',
            explanation: { zh: '等可能事件: P(A)=有利数/总数。', en: 'P(A)=favorable/total.', ja: 'P(A)=有利/全体。' },
            example: { zh: '骰子偶数: P=3/6=50%', en: 'Die even: P=3/6=50%', ja: '偶数: P=3/6=50%' },
            practice: { zh: '5红3蓝，取到红球的概率', en: '5 red 3 blue: P(red)?', ja: '赤5青3: 赤の確率?' },
            inputs: [
                { id:'tut_pm', label:{zh:'有利数 m',en:'m',ja:'有利m'}, ph:'5' },
                { id:'tut_pn', label:{zh:'总数 n',en:'n',ja:'全体n'}, ph:'8' }
            ],
            solve(v) {
                const m=+v.tut_pm, n=+v.tut_pn;
                if(isNaN(m)||isNaN(n)||n<=0||m<0||m>n) return '0≤m≤n';
                return `P=${m}/${n}=${(m/n*100).toFixed(2)}%`;
            }
        }
    ],
    linearAlgebra: [
        {
            title: { zh: '矩阵乘法', en: 'Matrix Multiplication', ja: '行列の積' },
            formula: 'C[i][j] = Σ A[i][k]·B[k][j]',
            explanation: { zh: '矩阵乘法要求 A 列数 = B 行数。', en: 'A cols = B rows required.', ja: 'A列数=B行数が必要。' },
            example: { zh: '使用"矩阵"面板实际操作', en: 'Use Matrix panel for practice', ja: '行列パネルで実践' },
            practice: { zh: '使用"矩阵"面板进行计算', en: 'Use Matrix panel', ja: '行列パネルで計算' },
            inputs: [],
            solve() { return '请使用"矩阵"面板进行矩阵运算练习。'; }
        }
    ],
    trigonometry: [
        {
            title: { zh: '三角函数基本关系', en: 'Trig Identities', ja: '三角恒等式' },
            formula: 'sin²θ+cos²θ=1\ntanθ=sinθ/cosθ',
            explanation: { zh: '三角函数的勾股恒等式。', en: 'Pythagorean trig identity.', ja: 'ピタゴラスの恒等式。' },
            example: { zh: 'sin²30°+cos²30°=0.25+0.75=1', en: 'sin²30°+cos²30°=0.25+0.75=1', ja: 'sin²30°+cos²30°=1' },
            practice: { zh: '输入角度计算三角函数', en: 'Enter angle for trig values', ja: '角度で三角関数' },
            inputs: [{ id:'tut_tri', label:{zh:'角度(度)',en:'Angle(°)',ja:'角度(度)'}, ph:'45' }],
            solve(v) {
                const d=+v.tut_tri; if(isNaN(d)) return '无效';
                const r=d*Math.PI/180;
                return `sin${d}°=${Math.sin(r).toFixed(6)}\ncos${d}°=${Math.cos(r).toFixed(6)}\ntan${d}°=${Math.tan(r).toFixed(6)}\n验证 sin²+cos²=${(Math.sin(r)**2+Math.cos(r)**2).toFixed(10)}`;
            }
        }
    ]
};

let currentTutorialType = 'algebra';
let currentTutorialIdx = 0;

function setTutorialType(type, btn) {
    currentTutorialType = type;
    currentTutorialIdx = 0;
    document.querySelectorAll('#tutorial .eq-type button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderTutorial();
}

function renderTutorial() {
    const el = $('tutorialContent');
    if (!el) return;
    const lessons = tutorialData[currentTutorialType];
    if (!lessons || !lessons.length) { el.innerHTML = '<div class="history-empty">暂无内容</div>'; return; }
    const L = lessons[currentTutorialIdx];
    const lang = i18n.currentLang;
    const t = k => (L[k] && L[k][lang]) || (L[k] && L[k].zh) || '';
    let html = `<div class="tutorial-lesson">
        <div class="tutorial-nav">${lessons.map((_,i)=>`<button class="${i===currentTutorialIdx?'active':''}" onclick="currentTutorialIdx=${i};renderTutorial()">${i+1}</button>`).join('')}
        <span class="tutorial-count">${currentTutorialIdx+1}/${lessons.length}</span></div>
        <h3 class="tutorial-title">${t('title')}</h3>
        <div class="formula-box"><div class="formula-title">${i18n.t('formula')}</div><pre>${L.formula}</pre></div>
        <div class="process-box"><div class="step">${t('explanation')}</div></div>
        <div class="formula-box"><div class="formula-title">${i18n.t('example')}</div><pre>${t('example')}</pre></div>
        <div class="calculus-step">${i18n.t('practice')}: ${t('practice')}</div>`;
    if (L.inputs && L.inputs.length) {
        html += '<div class="tutorial-inputs">';
        L.inputs.forEach(inp => {
            html += `<div class="eq-input"><label>${inp.label[lang]||inp.label.zh||''}</label><input id="${inp.id}" placeholder="${inp.ph||''}"></div>`;
        });
        html += `<button class="action-btn" onclick="solveTutorial()">${i18n.t('solve')}</button></div>`;
    }
    html += '<div class="eq-result" id="tutorialResult" style="display:none"></div></div>';
    el.innerHTML = html;
}

function solveTutorial() {
    const L = (tutorialData[currentTutorialType] || [])[currentTutorialIdx];
    if (!L || !L.solve) return;
    const vals = {};
    if (L.inputs) L.inputs.forEach(inp => { vals[inp.id] = ($(inp.id)||{}).value||''; });
    const r = $('tutorialResult');
    if (r) { r.style.display = 'block'; r.textContent = L.solve(vals); }
}