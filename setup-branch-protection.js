#!/usr/bin/env node

/**
 * GitHub 分支保护规则设置脚本
 * 
 * 使用方法:
 *   1. 设置环境变量: export GITHUB_TOKEN="your_token"
 *   2. 运行脚本: node setup-branch-protection.js
 * 
 * 或者直接运行（会提示输入 token）:
 *   node setup-branch-protection.js
 */

const https = require('https');
const readline = require('readline');

// 配置
const CONFIG = {
  owner: 'ATboy-web',
  repo: 'advanced_calculator',
  branch: 'master'
};

// 分支保护规则
const PROTECTION_RULES = {
  // 状态检查要求
  required_status_checks: {
    strict: true,  // 分支必须与主分支同步
    contexts: [
      'CI / lint-and-test',
      'CI / security-check'
    ]
  },
  
  // 强制管理员遵守规则
  enforce_admins: true,
  
  // Pull Request 审查要求
  required_pull_request_reviews: {
    required_approving_review_count: 1,  // 至少需要 1 个批准
    dismiss_stale_reviews: true,  // 新提交后需要重新审查
    require_code_owner_reviews: true  // 需要代码所有者审查
  },
  
  // 推送限制（null 表示不限制特定用户）
  restrictions: null,
  
  // 安全设置
  allow_force_pushes: false,  // 禁止强制推送
  allow_deletions: false,  // 禁止删除分支
  block_creations: false,  // 不阻止创建分支
  required_conversation_resolution: true  // 所有对话必须解决
};

// 获取 GitHub Token
async function getToken() {
  // 优先使用环境变量
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }
  
  // 交互式输入
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('请输入 GitHub Token (ghp_xxxx): ', (token) => {
      rl.close();
      resolve(token.trim());
    });
  });
}

// 发送 API 请求
function makeRequest(token, path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Advanced-Calculator-Bot',
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 检查当前保护状态
async function checkProtection(token) {
  console.log('\n📋 检查当前分支保护状态...');
  
  const result = await makeRequest(
    token,
    `/repos/${CONFIG.owner}/${CONFIG.repo}/branches/${CONFIG.branch}/protection`,
    'GET'
  );
  
  if (result.statusCode === 200) {
    console.log('✅ 分支已有保护规则');
    return true;
  } else if (result.statusCode === 404) {
    console.log('ℹ️  分支暂无保护规则');
    return false;
  } else {
    console.log(`⚠️  无法检查状态 (HTTP ${result.statusCode})`);
    return false;
  }
}

// 设置分支保护规则
async function setProtection(token) {
  console.log('\n🔒 设置分支保护规则...');
  console.log(`   仓库: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`   分支: ${CONFIG.branch}`);
  
  const result = await makeRequest(
    token,
    `/repos/${CONFIG.owner}/${CONFIG.repo}/branches/${CONFIG.branch}/protection`,
    'PUT',
    PROTECTION_RULES
  );
  
  if (result.statusCode === 200) {
    console.log('\n✅ 分支保护规则设置成功！');
    console.log('\n📋 已启用的保护规则:');
    console.log('   ✓ 要求 Pull Request 才能合并');
    console.log('   ✓ 至少需要 1 个代码审查批准');
    console.log('   ✓ 新提交后需要重新审查');
    console.log('   ✓ 需要代码所有者审查');
    console.log('   ✓ 要求状态检查通过 (CI)');
    console.log('   ✓ 分支必须与主分支同步');
    console.log('   ✓ 禁止强制推送');
    console.log('   ✓ 禁止删除分支');
    console.log('   ✓ 所有对话必须解决');
    return true;
  } else {
    console.log(`\n❌ 设置失败 (HTTP ${result.statusCode})`);
    if (result.data && result.data.message) {
      console.log(`   错误信息: ${result.data.message}`);
    }
    return false;
  }
}

// 主函数
async function main() {
  console.log('========================================');
  console.log('  GitHub 分支保护规则设置工具');
  console.log('========================================');
  
  try {
    // 获取 Token
    const token = await getToken();
    
    if (!token) {
      console.log('\n❌ 未提供 Token，退出');
      process.exit(1);
    }
    
    // 验证 Token
    console.log('\n🔑 验证 Token...');
    const userResult = await makeRequest(token, '/user', 'GET');
    
    if (userResult.statusCode !== 200) {
      console.log('❌ Token 无效或已过期');
      console.log('   请访问 https://github.com/settings/tokens 创建新 token');
      console.log   console.log('   所需权限: repo (Full control of private repositories)');
      process.exit(1);
    }
    
    console.log(`✅ 已认证用户: ${userResult.data.login}`);
    
    // 检查当前状态
    await checkProtection(token);
    
    // 设置保护规则
    const success = await setProtection(token);
    
    if (success) {
      console.log('\n🎉 设置完成！');
      console.log('\n📝 下一步:');
      console.log('   1. 尝试直接推送到 master - 应该被拒绝');
      console.log('   2. 创建 PR 并检查是否需要审查');
      console.log('   3. 查看仓库设置确认规则已生效');
      console.log(`\n🔗 仓库设置: https://github.com/${CONFIG.owner}/${CONFIG.repo}/settings/branches`);
    }
    
  } catch (error) {
    console.error('\n❌ 发生错误:', error.message);
    process.exit(1);
  }
}

// 运行
main();
