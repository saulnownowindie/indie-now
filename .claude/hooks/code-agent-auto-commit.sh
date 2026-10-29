#!/usr/bin/env bash
set -euo pipefail

WORKTREE="${CLAUDE_PROJECT_DIR:-$PWD}"
cac run --tool claude --worktree "$WORKTREE" --config "/home/saul/.config/code-agent-auto-commit/config.json" --event-stdin || true
