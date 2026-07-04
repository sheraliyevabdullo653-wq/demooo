const { spawn } = require('child_process');
const path = require('path');

const BACKEND_DIR = path.join(__dirname, 'backend');
const BOT_DIR = path.join(__dirname, 'telegram-bot');

const processes = [];

function runProcess(command, args, cwd, prefix) {
  console.log(`[System] Starting ${prefix}...`);
  const child = spawn(command, args, { cwd, shell: true });
  processes.push(child);

  child.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.log(`[${prefix}] ${text}`);
  });

  child.stderr.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.error(`[${prefix} Error] ${text}`);
  });

  child.on('close', (code) => {
    console.log(`[System] ${prefix} exited with code ${code}`);
  });

  return child;
}

// Start API Server
runProcess('node', ['src/api-server.js'], BACKEND_DIR, 'API Server');

// Start Telegram Bot
runProcess('node', ['src/bot.js'], BOT_DIR, 'Telegram Bot');

function cleanup() {
  console.log('[System] Shutting down children processes...');
  for (const proc of processes) {
    try {
      proc.kill();
    } catch (e) {}
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});
