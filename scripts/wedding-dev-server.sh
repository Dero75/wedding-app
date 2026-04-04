#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT=5001
PID_FILE="/tmp/wedding-dev-server.pid"
LOG_FILE="/tmp/wedding-dev.log"
START_CMD="corepack pnpm --filter @workspace/wedding dev"

is_pid_running() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

listener_pids() {
  lsof -tiTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true
}

wait_for_port() {
  local timeout_steps=40
  for _ in $(seq 1 "${timeout_steps}"); do
    if [[ -n "$(listener_pids)" ]]; then
      return 0
    fi
    sleep 0.25
  done
  return 1
}

start_server() {
  if [[ -n "$(listener_pids)" ]]; then
    echo "wedding-dev: already running on port ${PORT}"
    return 0
  fi

  if [[ -f "${PID_FILE}" ]]; then
    local stale_pid
    stale_pid="$(cat "${PID_FILE}" 2>/dev/null || true)"
    if [[ -n "${stale_pid}" ]] && is_pid_running "${stale_pid}"; then
      echo "wedding-dev: process ${stale_pid} alive but port ${PORT} closed, forcing restart"
      stop_server
    else
      rm -f "${PID_FILE}"
    fi
  fi

  python3 - "$ROOT_DIR" "$LOG_FILE" "$START_CMD" "$PID_FILE" <<'PY'
import shlex
import subprocess
import sys

root_dir, log_file, start_cmd, pid_file = sys.argv[1:]
launcher = f"""
cd {shlex.quote(root_dir)} || exit 1
while true; do
  {start_cmd}
  code=$?
  echo "[\\$(date '+%Y-%m-%d %H:%M:%S')] wedding-dev exited with code \\${{code}}, restarting in 1s" >>{shlex.quote(log_file)}
  sleep 1
done
"""

with open(log_file, "ab", buffering=0) as log:
  process = subprocess.Popen(
    ["bash", "-lc", launcher],
    stdin=subprocess.DEVNULL,
    stdout=log,
    stderr=log,
    start_new_session=True,
  )

with open(pid_file, "w", encoding="utf-8") as pid:
  pid.write(str(process.pid))
PY

  if wait_for_port; then
    echo "wedding-dev: started on http://localhost:${PORT}"
    return 0
  fi

  echo "wedding-dev: failed to start" >&2
  tail -n 60 "${LOG_FILE}" 2>/dev/null || true
  return 1
}

stop_server() {
  local stopped=0

  if [[ -f "${PID_FILE}" ]]; then
    local pid
    pid="$(cat "${PID_FILE}" 2>/dev/null || true)"
    if [[ -n "${pid}" ]] && is_pid_running "${pid}"; then
      kill "${pid}" 2>/dev/null || true
      sleep 0.5
      if is_pid_running "${pid}"; then
        kill -9 "${pid}" 2>/dev/null || true
      fi
      stopped=1
    fi
    rm -f "${PID_FILE}"
  fi

  local pids
  pids="$(listener_pids)"
  if [[ -n "${pids}" ]]; then
    # shellcheck disable=SC2086
    kill ${pids} 2>/dev/null || true
    sleep 0.5
    pids="$(listener_pids)"
    if [[ -n "${pids}" ]]; then
      # shellcheck disable=SC2086
      kill -9 ${pids} 2>/dev/null || true
    fi
    stopped=1
  fi

  if [[ "${stopped}" -eq 1 ]]; then
    echo "wedding-dev: stopped"
  else
    echo "wedding-dev: already stopped"
  fi
}

status_server() {
  local supervisor_pid=""
  if [[ -f "${PID_FILE}" ]]; then
    supervisor_pid="$(cat "${PID_FILE}" 2>/dev/null || true)"
  fi

  if [[ -n "${supervisor_pid}" ]] && ! is_pid_running "${supervisor_pid}"; then
    rm -f "${PID_FILE}"
    supervisor_pid=""
  fi

  local pids
  pids="$(listener_pids)"
  if [[ -n "${pids}" ]] && [[ -n "${supervisor_pid}" ]]; then
    echo "wedding-dev: running on port ${PORT} (server pid: ${pids//$'\n'/, }, supervisor pid: ${supervisor_pid})"
    exit 0
  fi

  if [[ -n "${pids}" ]]; then
    echo "wedding-dev: running on port ${PORT} (server pid: ${pids//$'\n'/, }, supervisor missing)"
    exit 0
  fi

  echo "wedding-dev: not running"
  exit 1
}

case "${1:-}" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    start_server
    ;;
  status)
    status_server
    ;;
  ensure)
    start_server
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|ensure}" >&2
    exit 2
    ;;
esac
