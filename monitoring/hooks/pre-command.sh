#!/bin/bash

# Путь к лог-файлу
LOG_FILE="$HOME/.claude/logs/audit_log.jsonl"
mkdir -p "$(dirname "$LOG_FILE")" # Создаем директорию, если ее нет

# Генерируем уникальный ID для события и сохраняем его для post-command хука
EVENT_ID=$(uuidgen)
START_TIME_S=$(date +%s)
# Используем директорию, специфичную для плагина, чтобы избежать конфликтов
PLUGIN_TMP_DIR="$HOME/.claude/plugins/superpowers/tmp"
mkdir -p "$PLUGIN_TMP_DIR"
echo "$EVENT_ID" > "$PLUGIN_TMP_DIR/claude_event.tmp"
echo "$START_TIME_S" >> "$PLUGIN_TMP_DIR/claude_event.tmp"

# Собираем контекст
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CWD=$(pwd)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "not a git repo")
GIT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "not a git repo")
COMMAND="$CLAUDE_COMMAND"

# Формируем JSON и записываем в лог
cat <<EOF >> "$LOG_FILE"
{
  "timestamp": "$TIMESTAMP",
  "event_type": "command_start",
  "event_id": "$EVENT_ID",
  "command": "$COMMAND",
  "context": {
    "cwd": "$CWD",
    "git_branch": "$GIT_BRANCH",
    "git_commit": "$GIT_COMMIT"
  }
}
EOF
