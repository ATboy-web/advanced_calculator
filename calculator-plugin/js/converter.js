// ===== Unit Converter =====
const converter = {
    cat: 'length',
    convData: {
        length: { '米':1,'千米':1000,'厘米':0.01,'毫米':0.001,'英里':1609.344,'英尺':0.3048,'英寸':0.0254,'海里':1852,'码':0.9144 },
        weight: { '千克':1,'克':0.001,'吨':1000,'磅':0.453592,'盎司':0.0283495,'斤':0.5,'两':0.05 },
        temperature: null,
        area: { '平方米':1,'平方千米':1e6,'公顷':10000,'英亩':4046.86,'平方英尺':0.092903,'平方英寸':0.00064516 },
        volume: { '升':1,'毫升':0.001,'立方米':1000,'加仑':3.78541,'立方英尺':28.3168,'杯':0.236588 },
        dataSize: { 'B':1,'KB':1024,'MB':1048576,'GB':1073741824,'TB':1099511627776,'PB':1125899906842624 },
        speed: { '米/秒':1,'千米/时':0.277778,'英里/时':0.44704,'节':0.514444,'马赫':340.3 },
        base: null
    },
    setCat(c, btn) {
        this.cat = c;
        document.querySelectorAll('#panel-converter .eq-type button').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderUnits();
    },
    renderUnits() {
        const fromEl = document.getElementById('convFrom');
        const toEl = document.getElementById('convTo');
        if (!fromEl || !toEl) return;
        const units = this.getUnits();
        fromEl.innerHTML = units.map((u, i) => `<option value="${i}" ${i === 0 ? 'selected' : ''}>${u}</option>`).join('');
        toEl.innerHTML = units.map((u, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${u}</option>`).join('');
    },
    getUnits() {
        if (this.cat === 'temperature') return ['摄氏度 °C', '华氏度 °F', '开尔文 K'];
        if (this.cat === 'base') return ['十进制', '二进制', '八进制', '十六进制'];
        return Object.keys(this.convData[this.cat] || {});
    },
    swap() {
        const fromEl = document.getElementById('convFrom');
        const toEl = document.getElementById('convTo');
        if (fromEl && toEl) { const tmp = fromEl.value; fromEl.value = toEl.value; toEl.value = tmp; }
    },
    convert() {
        const v = parseFloat(document.getElementById('convValue')?.value || '0');
        const fi = parseInt(document.getElementById('convFrom')?.value || '0');
        const ti = parseInt(document.getElementById('convTo')?.value || '0');
        const el = document.getElementById('convResult');
        if (!el) return;
        let r = '';
        try {
            if (this.cat === 'temperature') {
                const temps = ['°C', '°F', 'K'];
                let celsius = v;
                if (fi === 1) celsius = (v - 32) * 5 / 9;
                else if (fi === 2) celsius = v - 273.15;
                let result = celsius;
                if (ti === 1) result = celsius * 9 / 5 + 32;
                else if (ti === 2) result = celsius + 273.15;
                r = `${v} ${temps[fi]} = ${result.toFixed(4)} ${temps[ti]}`;
            } else if (this.cat === 'base') {
                const bases = [10, 2, 8, 16];
                const labels = ['十进制', '二进制', '八进制', '十六进制'];
                const inputStr = document.getElementById('convValue')?.value || '0';
                const decimal = parseInt(inputStr, bases[fi]);
                let result;
                if (ti === 0) result = decimal.toString(10);
                else if (ti === 1) result = decimal.toString(2);
                else if (ti === 2) result = decimal.toString(8);
                else result = decimal.toString(16).toUpperCase();
                r = `${inputStr} (${labels[fi]}) = ${result} (${labels[ti]})`;
            } else {
                const data = this.convData[this.cat];
                const units = Object.keys(data);
                const fromFactor = data[units[fi]], toFactor = data[units[ti]];
                const result = v * fromFactor / toFactor;
                r = `${v} ${units[fi]} = ${result.toFixed(6)} ${units[ti]}`;
            }
        } catch (e) { r = '错误: ' + e.message; }
        el.textContent = r;
        el.style.display = 'block';
    }
};
