# IDOL 公会战交互原型

静态站点部署在 GitHub Pages：

https://wxmlife.github.io/guild-war-game-wireframes-v2-site/

## 发布

macOS 下双击项目根目录中的 `发布.command`。首次运行会在浏览器完成 GitHub 登录，并创建公开仓库 `wxmlife/guild-war-game-wireframes-v2-site`；之后会重建、验证、提交并推送改动。推送后由 GitHub Actions 自动部署到 Pages。

需要安装 Git、Node.js 20+ 和 GitHub CLI。脚本使用 GitHub CLI 的系统登录凭据，不在项目文件中保存 token。项目原有的 `origin` 远程保持不变，公开仓库使用单独的 `github` 远程。

发布构建会运行 `node build.cjs` 和 `node verify.cjs`。GitHub Actions 同样从源文件构建 `out/` 并部署，不依赖本机生成产物是否最新。