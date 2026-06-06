// 检查 app.js 语法是否正确
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');

try {
    const code = fs.readFileSync(appJsPath, 'utf8');
    
    // 尝试解析 JavaScript
    new Function(code);
    
    console.log('✓ app.js 语法检查通过！');
    console.log(`  文件大小: ${(code.length / 1024).toFixed(1)} KB`);
    console.log(`  总行数: ${code.split('\n').length}`);
    
    // 统计函数数量
    const functions = code.match(/function\s+\w+/g);
    if (functions) {
        console.log(`  函数数量: ${functions.length}`);
    }
    
} catch (error) {
    console.error('✗ app.js 语法错误！');
    console.error(`  错误: ${error.message}`);
    
    // 尝试定位错误行
    const match = error.message.match(/line (\d+)/i);
    if (match) {
        const lineNum = parseInt(match[1]);
        const lines = fs.readFileSync(appJsPath, 'utf8').split('\n');
        console.log(`\n  错误位置 (第 ${lineNum} 行):`);
        for (let i = Math.max(0, lineNum - 3); i < Math.min(lines.length, lineNum + 2); i++) {
            const marker = i === lineNum - 1 ? '>>>' : '   ';
            console.log(`  ${marker} ${i + 1}: ${lines[i]}`);
        }
    }
}
