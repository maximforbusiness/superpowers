#!/bin/bash

# СРАЗУ ЖЕ сохраняем код завершения предыдущей команды
EXIT_CODE=$?

LOG_FILE="$HOME/.claude/logs/audit_log.jsonl"
PLUGIN_TMP_DIR="$HOME/.claude/plugins/superpowers/tmp"
EVENT_TMP_FILE="$PLUGIN_TMP_DIR/claude_event.tmp"

# Проверяем, существует ли временный файл
if [ ! -f "$EVENT_TMP_FILE" ]; then
  # Если файла нет, значит pre-command хук не сработал. Просто выходим.
  exit $EXIT_CODE
fi

# Читаем EVENT_ID и время старта из временного файла
EVENT_ID=$(head -n 1 "$EVENT_TMP_FILE")
START_TIME_S=$(tail -n 1 "$EVENT_TMP_FILE")
rm "$EVENT_TMP_FILE" # И сразу удаляем его

# Собираем данные о результате
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
COMMAND="$CLAUDE_COMMAND"
TOKENS_USED=${CLAUDE_TOKENS_USED:-0} # По умолчанию 0, если переменная не задана

# Вычисляем длительность
END_TIME_S=$(date +%s)
DURATION=$((END_TIME_S - START_TIME_S))

# Определяем статус
if [ $EXIT_CODE -eq 0 ]; then
  STATUS="success"
else
  STATUS="failure"
fi

# Формируем JSON и записываем в лог
cat <<EOF >> "$LOG_FILE"
{
  "timestamp": "$TIMESTAMP",
  "event_type": "command_end",
  "event_id": "$EVENT_ID",
  "command": "$COMMAND",
  "result": {
    "exit_code": $EXIT_CODE,
    "status": "$STATUS",
    "duration_s": $DURATION,
    "tokens_used": $TOKENS_USED
  }
}
EOF

# Возвращаем исходный код завершения, чтобы не нарушать работу других хуков
exit $EXIT_CODE
