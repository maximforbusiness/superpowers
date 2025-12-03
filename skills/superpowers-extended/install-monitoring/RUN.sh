#!/bin/bash

# Абсолютный путь к директории плагина, где бы он ни был установлен
PLUGIN_ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

# Каталог, где лежат хуки внутри плагина
PLUGIN_HOOK_DIR="$PLUGIN_ROOT_DIR/monitoring/hooks"

# Целевая директория для хуков Claude Code
CLAUDE_HOOK_DIR="$HOME/.claude/hooks"

echo "Начинаю установку системы мониторинга..."

# 1. Создаем целевую директорию, если она не существует
mkdir -p "$CLAUDE_HOOK_DIR"
echo "Проверено/создано: $CLAUDE_HOOK_DIR"

# 2. Создаем или обновляем символические ссылки для хуков
# Флаг -f (force) перезапишет существующие ссылки, что полезно при обновлениях
ln -sf "$PLUGIN_HOOK_DIR/pre-command.sh" "$CLAUDE_HOOK_DIR/pre-command.sh"
echo "Создана/обновлена ссылка для pre-command.sh"

ln -sf "$PLUGIN_HOOK_DIR/post-command.sh" "$CLAUDE_HOOK_DIR/post-command.sh"
echo "Создана/обновлена ссылка для post-command.sh"

echo ""
echo "✅ Система мониторинга успешно установлена!"
echo "Логи будут записываться в файл: $HOME/.claude/logs/audit_log.jsonl"
echo "Хуки активируются при следующем вызове любой команды."
