// ===== Math Tutorial System =====
const tutorial = {
    type: 'algebra',
    idx: 0,
    data: {
        algebra: [
            {
                title:{zh:'韦达定理',en:"Vieta's Formulas",hi:'विएटा सूत्र',es:'Fórmulas de Vieta'},
                formula:'x₁+x₂=-b/a\nx₁·x₂=c/a',
                explanation:{zh:'一元二次方程 ax²+bx+c=0 的两根之和为-b/a，之积为c/a。',en:'For ax²+bx+c=0: sum=-b/a, product=c/a.',hi:'ax²+bx+c=0: योग=-b/a, गुणनफल=c/a।',es:'Para ax²+bx+c=0: suma=-b/a, producto=c/a.'},
                example:{zh:'x²-5x+6=0 → 和=5, 积=6',en:'x²-5x+6=0 → sum=5, prod=6',hi:'x²-5x+6=0 → योग=5, गुणनफल=6',es:'x²-5x+6=0 → suma=5, prod=6'},
                practice:{zh:'已知2x²-8x+6=0，求两根之和与积',en:'Given 2x²-8x+6=0, find sum/product',hi:'2x²-8x+6=0, योग/गुणनफल ज्ञात करें',es:'Dados 2x²-8x+6=0, hallar suma/producto'},
                inputs:[{id:'ta',label:{zh:'a',en:'a',hi:'a',es:'a'},ph:'2'},{id:'tb',label:{zh:'b',en:'b',hi:'b',es:'b'},ph:'-8'},{id:'tc',label:{zh:'c',en:'c',hi:'c',es:'c'},ph:'6'}],
                solve(v){const a=+v.ta,b=+v.tb,c=+v.tc;if(!a)return'a≠0';return`和=${(-b/a).toFixed(4)} 积=${(c/a).toFixed(4)}`;}
            },
            {
                title:{zh:'因式分解',en:'Factoring',hi:'गुणनखंडन',es:'Factorización'},
                formula:'ax²+bx+c = a(x-x₁)(x-x₂)',
                explanation:{zh:'二次多项式分解为两个一次因式。',en:'Decompose quadratic into linear factors.',hi:'द्विघात बहुपद को रैखिक गुणनखंडों में विघटित करें।',es:'Descomponer cuadrática en factores lineales.'},
                example:{zh:'x²-5x+6=(x-2)(x-3)',en:'x²-5x+6=(x-2)(x-3)',hi:'x²-5x+6=(x-2)(x-3)',es:'x²-5x+6=(x-2)(x-3)'},
                practice:{zh:'因式分解x²+3x-10',en:'Factor x²+3x-10',hi:'x²+3x-10 का गुणनखंडन',es:'Factorizar x²+3x-10'},
                inputs:[{id:'fa',label:{zh:'a',en:'a',hi:'a',es:'a'},ph:'1'},{id:'fb',label:{zh:'b',en:'b',hi:'b',es:'b'},ph:'3'},{id:'fc',label:{zh:'c',en:'c',hi:'c',es:'c'},ph:'-10'}],
                solve(v){const a=+v.fa,b=+v.fb,c=+v.fc;if(!a)return'a≠0';const d=b*b-4*a*c;if(d<0)return'Δ<0';const x1=(-b+Math.sqrt(d))/(2*a),x2=(-b-Math.sqrt(d))/(2*a);return`=(x${x1>=0?'-':'+'}${Math.abs(x1).toFixed(4)})(x${x2>=0?'-':'+'}${Math.abs(x2).toFixed(4)})`;}
            }
        ],
        calculus: [
            {
                title:{zh:'导数的定义',en:'Derivative Definition',hi:'अवकलज की परिभाषा',es:'Definición de Derivada'},
                formula:"f'(x) = lim[h→0] (f(x+h)-f(x))/h",
                explanation:{zh:'导数是函数瞬时变化率，几何上是切线斜率。',en:'Derivative = instantaneous rate of change.',hi:'अवकलज = तात्कालिक परिवर्तन दर।',es:'Derivada = tasa de cambio instantánea.'},
                example:{zh:"f(x)=x², f'(3)=6",en:"f(x)=x², f'(3)=6",hi:"f(x)=x², f'(3)=6",es:"f(x)=x², f'(3)=6"},
                practice:{zh:'求f(x)=x³在x=2的导数',en:"Find f'(2) for f(x)=x³",hi:"f(x)=x³ के लिए f'(2)",es:"Hallar f'(2) para f(x)=x³"},
                inputs:[{id:'df',label:{zh:'f(x)',en:'f(x)',hi:'f(x)',es:'f(x)'},ph:'x^3'},{id:'dx',label:{zh:'x₀',en:'x₀',hi:'x₀',es:'x₀'},ph:'2'}],
                solve(v){const x0=+v.dx;if(isNaN(x0))return'无效';try{const s=(v.df||'x^2').replace(/\^/g,'**').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan').replace(/ln/g,'Math.log').replace(/sqrt/g,'Math.sqrt');const f=new Function('x','return '+s),h=1e-7,d=(f(x0+h)-f(x0-h))/(2*h);return`f(${x0})=${f(x0).toFixed(6)}\nf'(${x0})≈${d.toFixed(6)}`}catch(e){return'错误: '+e.message}}
            },
            {
                title:{zh:'定积分(数值)',en:'Definite Integral',hi:'निश्चित समाकलन',es:'Integral Definida'},
                formula:'∫[a,b] f(x)dx',
                explanation:{zh:'用梯形法数值近似计算定积分。',en:'Trapezoidal rule numerical approximation.',hi:'समलंब नियम संख्यात्मक सन्निकटन।',es:'Aproximación numérica por regla trapezoidal.'},
                example:{zh:'∫[0,2]x²dx = 8/3 ≈ 2.6667',en:'∫[0,2]x²dx = 8/3 ≈ 2.6667',hi:'∫[0,2]x²dx = 8/3 ≈ 2.6667',es:'∫[0,2]x²dx = 8/3 ≈ 2.6667'},
                practice:{zh:'计算∫[1,3](2x+1)dx',en:'Evaluate ∫[1,3](2x+1)dx',hi:'∫[1,3](2x+1)dx का मूल्यांकन',es:'Evaluar ∫[1,3](2x+1)dx'},
                inputs:[{id:'ifn',label:{zh:'f(x)',en:'f(x)',hi:'f(x)',es:'f(x)'},ph:'x^2'},{id:'ia',label:{zh:'a',en:'a',hi:'a',es:'a'},ph:'0'},{id:'ib',label:{zh:'b',en:'b',hi:'b',es:'b'},ph:'2'}],
                solve(v){const a=+v.ia,b=+v.ib;if(isNaN(a)||isNaN(b))return'无效';try{const s=(v.ifn||'x^2').replace(/\^/g,'**').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan').replace(/ln/g,'Math.log').replace(/sqrt/g,'Math.sqrt');const f=new Function('x','return '+s),n=10000,h=(b-a)/n;let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=2*f(a+i*h);return`∫[${a},${b}] ≈ ${((h/2)*sum).toFixed(6)}`}catch(e){return'错误: '+e.message}}
            }
        ],
        geometry: [
            {
                title:{zh:'勾股定理',en:'Pythagorean Theorem',hi:'पाइथागोरस प्रमेय',es:'Teorema de Pitágoras'},
                formula:'a² + b² = c²',
                explanation:{zh:'直角三角形两直角边平方和等于斜边平方。',en:'Right triangle: a²+b²=c².',hi:'समकोण त्रिभुज: a²+b²=c²।',es:'Triángulo rectángulo: a²+b²=c².'},
                example:{zh:'a=3, b=4 → c=5',en:'a=3, b=4 → c=5',hi:'a=3, b=4 → c=5',es:'a=3, b=4 → c=5'},
                practice:{zh:'求a=5, b=12的斜边',en:'Find c for a=5, b=12',hi:'a=5, b=12 के लिए c',es:'Hallar c para a=5, b=12'},
                inputs:[{id:'pa',label:{zh:'a',en:'a',hi:'a',es:'a'},ph:'5'},{id:'pb',label:{zh:'b',en:'b',hi:'b',es:'b'},ph:'12'}],
                solve(v){const a=+v.pa,b=+v.pb;return`c=√(${a}²+${b}²)=${Math.sqrt(a*a+b*b).toFixed(4)}\n面积=½·${a}·${b}=${(a*b/2).toFixed(4)}`}
            },
            {
                title:{zh:'圆的面积与周长',en:'Circle: Area & Circumference',hi:'वृत्त: क्षेत्रफल और परिधि',es:'Círculo: Área y Circunferencia'},
                formula:'面积=πr²  周长=2πr',
                explanation:{zh:'圆面积=πr²，周长=2πr。',en:'Area=πr², Circ=2πr.',hi:'क्षेत्रफल=πr², परिधि=2πr।',es:'Área=πr², Circ=2πr.'},
                example:{zh:'r=5 → 面积≈78.54, 周长≈31.42',en:'r=5 → area≈78.54, circ≈31.42',hi:'r=5 → क्षेत्रफल≈78.54, परिधि≈31.42',es:'r=5 → área≈78.54, circ≈31.42'},
                practice:{zh:'求r=7的面积和周长',en:'Find area and circ for r=7',hi:'r=7 के लिए क्षेत्रफल और परिधि',es:'Hallar área y circ para r=7'},
                inputs:[{id:'cr',label:{zh:'r',en:'r',hi:'r',es:'r'},ph:'5'}],
                solve(v){const r=+v.cr;if(isNaN(r)||r<=0)return'请输入正数';return`面积=π·${r}²=${(r*r*Math.PI).toFixed(4)}\n周长=2π·${r}=${(2*r*Math.PI).toFixed(4)}`}
            }
        ],
        probability: [
            {
                title:{zh:'古典概型',en:'Classical Probability',hi:'शास्त्रीय प्रायिकता',es:'Probabilidad Clásica'},
                formula:'P(A) = m/n',
                explanation:{zh:'等可能事件: P(A)=有利数/总数。',en:'P(A)=favorable/total.',hi:'P(A)=अनुकूल/कुल।',es:'P(A)=favorable/total.'},
                example:{zh:'骰子偶数: P=3/6=50%',en:'Die even: P=3/6=50%',hi:'पासा सम: P=3/6=50%',es:'Dado par: P=3/6=50%'},
                practice:{zh:'5红3蓝，取到红球的概率',en:'5 red 3 blue: P(red)?',hi:'5 लाल 3 नीली: P(लाल)?',es:'5 rojas 3 azules: ¿P(roja)?'},
                inputs:[{id:'pm',label:{zh:'m',en:'m',hi:'m',es:'m'},ph:'5'},{id:'pn',label:{zh:'n',en:'n',hi:'n',es:'n'},ph:'8'}],
                solve(v){const m=+v.pm,n=+v.pn;if(isNaN(m)||isNaN(n)||n<=0||m<0||m>n)return'0≤m≤n';return`P=${m}/${n}=${(m/n*100).toFixed(2)}%`}
            }
        ],
        linearAlgebra: [
            {
                title:{zh:'矩阵乘法',en:'Matrix Multiplication',hi:'मैट्रिक्स गुणन',es:'Multiplicación de Matrices'},
                formula:'C[i][j] = Σ A[i][k]·B[k][j]',
                explanation:{zh:'矩阵乘法要求A列数=B行数。',en:'A cols = B rows required.',hi:'A स्तंभ = B पंक्ति आवश्यक।',es:'Se requiere cols A = filas B.'},
                example:{zh:'使用"矩阵"面板操作',en:'Use Matrix panel for practice',hi:'अभ्यास के लिए मैट्रिक्स पैनल',es:'Usar panel Matriz para practicar'},
                practice:{zh:'使用"矩阵"面板进行计算',en:'Use Matrix panel',hi:'मैट्रिक्स पैनल का उपयोग करें',es:'Usar panel Matriz'},
                inputs:[],
                solve(){return'请使用"矩阵"面板进行矩阵运算练习。'}
            }
        ],
        trigonometry: [
            {
                title:{zh:'三角函数基本关系',en:'Trig Identities',hi:'त्रिकोणमितीय सर्वसमिकाएं',es:'Identidades Trigonométricas'},
                formula:'sin²θ+cos²θ=1\ntanθ=sinθ/cosθ',
                explanation:{zh:'三角函数的勾股恒等式。',en:'Pythagorean trig identity.',hi:'पाइथागोरस त्रिकोणमितीय सर्वसमिका।',es:'Identidad trigonométrica pitagórica.'},
                example:{zh:'sin²30°+cos²30°=1',en:'sin²30°+cos²30°=1',hi:'sin²30°+cos²30°=1',es:'sin²30°+cos²30°=1'},
                practice:{zh:'输入角度计算三角函数',en:'Enter angle for trig values',hi:'त्रिकोणमितीय मानों के लिए कोण',es:'Ingrese ángulo para valores trigonométricos'},
                inputs:[{id:'tri',label:{zh:'角度(°)',en:'Angle(°)',hi:'कोण(°)',es:'Ángulo(°)'},ph:'45'}],
                solve(v){const d=+v.tri;if(isNaN(d))return'无效';const r=d*Math.PI/180;return`sin${d}°=${Math.sin(r).toFixed(6)}\ncos${d}°=${Math.cos(r).toFixed(6)}\ntan${d}°=${Math.tan(r).toFixed(6)}\nsin²+cos²=${(Math.sin(r)**2+Math.cos(r)**2).toFixed(10)}`}
            }
        ]
    },
    setType(t) {
        this.type = t; this.idx = 0;
        document.querySelectorAll('#panel-tutorial .eq-type button').forEach(b => b.classList.remove('active'));
        document.querySelector(`#panel-tutorial [data-tut="${t}"]`)?.classList.add('active');
        this.render();
    },
    render() {
        const el = document.getElementById('tutorialContent');
        if (!el) return;
        const lessons = this.data[this.type];
        if (!lessons?.length) { el.innerHTML = '<div class="history-empty">暂无内容</div>'; return; }
        const L = lessons[this.idx];
        const lang = i18n.currentLang;
        const t = k => (L[k]?.[lang]) || (L[k]?.zh) || '';
        let html = `<div class="tutorial-lesson">
            <div class="tutorial-nav">${lessons.map((_, i) => `<button class="${i === this.idx ? 'active' : ''}" onclick="tutorial.idx=${i};tutorial.render()">${i + 1}</button>`).join('')}
            <span class="tutorial-count">${this.idx + 1}/${lessons.length}</span></div>
            <h3 class="tutorial-title">${t('title')}</h3>
            <div class="formula-box"><div class="formula-title">${i18n.t('formula')}</div><pre>${L.formula}</pre></div>
            <div class="process-box"><div class="step">${t('explanation')}</div></div>
            <div class="formula-box"><div class="formula-title">${i18n.t('example')}</div><pre>${t('example')}</pre></div>
            <div class="calculus-step">${i18n.t('practice')}: ${t('practice')}</div>`;
        if (L.inputs?.length) {
            html += '<div class="tutorial-inputs">';
            L.inputs.forEach(inp => { html += `<div class="eq-input"><label>${inp.label[lang] || inp.label.zh || ''}</label><input id="${inp.id}" placeholder="${inp.ph || ''}"></div>`; });
            html += `<button class="action-btn" onclick="tutorial.solvePractice()">${i18n.t('solve')}</button></div>`;
        }
        html += '<div class="eq-result" id="tutorialResult" style="display:none"></div></div>';
        el.innerHTML = html;
    },
    solvePractice() {
        const lessons = this.data[this.type];
        const L = lessons[this.idx];
        if (!L?.solve) return;
        const v = {};
        L.inputs.forEach(inp => { v[inp.id] = document.getElementById(inp.id)?.value || ''; });
        const el = document.getElementById('tutorialResult');
        if (el) { el.textContent = L.solve(v); el.style.display = 'block'; }
    }
};
