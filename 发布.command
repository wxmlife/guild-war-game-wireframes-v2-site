#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"
REPO_NAME="guild-war-game-wireframes-v2-site"

fail() {
  printf '\n发布未完成：%s\n' "$1"
  read -r -p '按回车关闭窗口...' _
  exit 1
}

command -v git >/dev/null 2>&1 || fail '未找到 Git。请先安装 Xcode Command Line Tools。'
command -v node >/dev/null 2>&1 || fail '未找到 Node.js。请先安装 Node.js 20 或更高版本。'
command -v gh >/dev/null 2>&1 || fail '未找到 GitHub CLI（gh）。请先安装 GitHub CLI。'

if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  printf '需要登录 GitHub，将打开浏览器完成授权。\n'
  gh auth login --hostname github.com --git-protocol https --web || fail 'GitHub 登录失败。'
fi

printf '构建并验证静态站点...\n'
node build.cjs || fail '站点构建失败。'
node verify.cjs || fail '站点验证失败。'

git add -A
if ! git diff --cached --quiet; then
  git commit -m "Publish site update" || fail 'Git 提交失败。'
fi

GH_USER="$(gh api user --jq .login)" || fail '无法读取当前 GitHub 用户。'
REPO="${GH_USER}/${REPO_NAME}"
REPO_URL="https://github.com/${REPO}.git"

if gh repo view "$REPO" >/dev/null 2>&1; then
  CURRENT_URL="$(git remote get-url github 2>/dev/null || true)"
  if [[ -n "$CURRENT_URL" && "$CURRENT_URL" != "$REPO_URL" ]]; then
    fail "github 远程已指向其他地址：${CURRENT_URL}"
  fi
  if [[ -z "$CURRENT_URL" ]]; then
    git remote add github "$REPO_URL" || fail '添加 GitHub 远程失败。'
  fi
else
  gh repo create "$REPO" --public --description 'IDOL 公会战交互原型静态站点' || fail '创建公开 GitHub 仓库失败。'
  git remote add github "$REPO_URL" || fail '添加 GitHub 远程失败。'
fi

if ! gh api "repos/${REPO}/pages" >/dev/null 2>&1; then
  gh api --method POST "repos/${REPO}/pages" --field build_type=workflow >/dev/null || fail '启用 GitHub Pages 失败，请检查仓库权限。'
fi

git push -u github main || fail '推送失败。'

printf '\n代码已推送，GitHub Actions 正在发布。\n'
printf '站点地址：https://%s.github.io/%s/\n' "$GH_USER" "$REPO_NAME"
printf '发布状态：https://github.com/%s/actions\n' "$REPO"
read -r -p '按回车关闭窗口...'