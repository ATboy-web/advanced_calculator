# 分支保护规则设置指南

## 方法一：通过 GitHub 网页界面设置（推荐）

### 步骤：

1. **进入仓库设置**
   - 访问: https://github.com/ATboy-web/advanced_calculator/settings
   - 点击左侧菜单的 **Branches**

2. **添加分支保护规则**
   - 点击 **Add branch ruleset** 或 **Add rule**
   - Branch name pattern: `master`

3. **配置保护规则**

   #### ✅ 规则集名称
   ```
   Master Branch Protection
   ```

   #### ✅ 限制推送
   - [x] Restrict pushes
   - [x] Restrict deletions

   #### ✅ 要求 Pull Request
   - [x] Require a pull request before merging
   - Required approving reviews: `1`
   - [x] Dismiss stale pull request approvals when new commits are pushed
   - [x] Require review from Code Owners

   #### ✅ 要求状态检查
   - [x] Require status checks to pass before merging
   - [x] Require branches to be up to date before merging
   - Status checks that are required:
     - `CI / lint-and-test`
     - `CI / security-check`

   #### ✅ 其他设置
   - [x] Do not allow bypassing the above settings
   - [x] Require linear history
   - [x] Require conversation resolution before merging

4. **保存规则**
   - 点击 **Create** 或 **Save changes**

---

## 方法二：使用 GitHub CLI

```bash
# 安装 GitHub CLI (如果未安装)
# Windows: winget install GitHub.cli
# Mac: brew install gh

# 登录
gh auth login

# 创建分支保护规则
gh api repos/ATboy-web/advanced_calculator/branches/master/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI / lint-and-test","CI / security-check"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

---

## 方法三：使用 Node.js 脚本

```bash
# 设置环境变量
export GITHUB_TOKEN="your_new_token_here"

# 运行脚本
node setup-branch-protection.js
```

---

## 保护规则说明

| 规则 | 说明 |
|------|------|
| **Require PR** | 所有更改必须通过 Pull Request |
| **Require Reviews** | 至少需要 1 个代码审查批准 |
| **Dismiss Stale Reviews** | 新提交后需要重新审查 |
| **Require Code Owner Review** | 需要代码所有者审查 |
| **Require Status Checks** | CI 测试必须通过 |
| **Branch Up to Date** | 分支必须与主分支同步 |
| **No Force Push** | 禁止强制推送 |
| **No Deletion** | 禁止删除分支 |
| **Conversation Resolution** | 所有对话必须解决 |

---

## 验证设置

设置完成后，可以通过以下方式验证：

1. 尝试直接推送到 master - 应该被拒绝
2. 创建 PR 并检查是否需要审查
3. 查看 GitHub 仓库设置页面确认规则已生效

---

## 注意事项

- 仓库所有者默认可以绕过保护规则（除非设置了 enforce_admins）
- 建议为 `main` 或 `develop` 分支也设置保护规则
- 定期审查和更新保护规则以适应项目需求
