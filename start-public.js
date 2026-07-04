const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const FRONTEND_PORT = 5173;
const BACKEND_PORT = 3001;

const FRONTEND_DIR = path.join(__dirname, 'frontend');
const BACKEND_DIR = path.join(__dirname, 'backend');
const BOT_DIR = path.join(__dirname, 'telegram-bot');

const FRONTEND_ENV = path.join(FRONTEND_DIR, '.env');
const BACKEND_ENV = path.join(BACKEND_DIR, '.env');
const BOT_ENV = path.join(BOT_DIR, '.env');

// Helper to update env files
function updateEnvFile(filePath, key, value) {
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }
  const lines = content.split(/\r?\n/);
  let keyFound = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith(`${key}=`)) {
      lines[i] = `${key}=${value}`;
      keyFound = true;
      break;
    }
  }
  if (!keyFound) {
    lines.push(`${key}=${value}`);
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

// Fetch public IP address
function getPublicIP() {
  return new Promise((resolve) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', () => resolve('Aniqlab bo\'lmadi'));
  });
}

// Start tunnel
function startTunnel(port, name) {
  return new Promise((resolve, reject) => {
    console.log(`[Tunnel] ${name} uchun tunnel ishga tushirilmoqda (Port: ${port})...`);
    const child = spawn('npx', ['localtunnel', '--port', port.toString()], { shell: true });
    let resolved = false;

    // Buffer to handle partial outputs
    let outputBuffer = '';

    child.stdout.on('data', (data) => {
      outputBuffer += data.toString();
      const lines = outputBuffer.split('\n');
      outputBuffer = lines.pop(); // keep unfinished line

      for (const line of lines) {
        if (line.includes('your url is:')) {
          const match = line.match(/your url is: (https:\/\/[^\s]+)/);
          if (match && !resolved) {
            resolved = true;
            resolve({ url: match[1], process: child });
          }
        }
      }
    });

    child.stderr.on('data', (data) => {
      // Ignore some noise
    });

    child.on('close', (code) => {
      if (!resolved) {
        reject(new Error(`${name} tunnel process exited with code ${code}`));
      }
    });
  });
}

// Start processes list
const processes = [];

function runProcess(command, args, cwd, prefix, colorCode) {
  console.log(`[System] ${prefix} ishga tushirilmoqda...`);
  const child = spawn(command, args, { cwd, shell: true });
  processes.push(child);

  child.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (text) {
      console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${text}`);
    }
  });

  child.stderr.on('data', (data) => {
    const text = data.toString().trim();
    if (text) {
      console.error(`\x1b[31m[${prefix} Xatolik]\x1b[0m ${text}`);
    }
  });

  child.on('close', (code) => {
    console.log(`[System] ${prefix} yopildi. Kod: ${code}`);
  });

}

// Publish backend URL to a public KV store so Vercel can fetch it dynamically
function publishBackendURL(url) {
  return new Promise((resolve) => {
    console.log('[System] Active backend URL-ni public KV-ga yozilmoqda...');
    const data = url;
    const req = https.request(
      'https://kvdb.io/mc_tunnel_bucket_7653/backend_url',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          console.log('\x1b[32m✔ Backend URL public KV db-ga yozildi!\x1b[0m');
          resolve();
        });
      }
    );
    req.on('error', (err) => {
      console.error('\x1b[31m[Xatolik] Backend URL-ni KV-ga yozib bo\'lmadi:\x1b[0m', err.message);
      resolve();
    });
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n\x1b[36m====================================================\x1b[0m');
  console.log('\x1b[36m🚀 MEDI_CORE PUBLIC TUNNEL VA SERVER ISHGA TUSHURUVCHI\x1b[0m');
  console.log('\x1b[36m====================================================\x1b[0m\n');

  try {
    const publicIP = await getPublicIP();

    // 1. Backend API tunnel
    const backendTunnel = await startTunnel(BACKEND_PORT, 'API Server');
    console.log(`\x1b[32m✔ API Server uchun tunnel tayyor:\x1b[0m ${backendTunnel.url}`);
    processes.push(backendTunnel.process);
    
    // Publish backend URL to KV database
    await publishBackendURL(backendTunnel.url);

    // 2. Frontend tunnel
    const frontendTunnel = await startTunnel(FRONTEND_PORT, 'Vite Frontend');
    console.log(`\x1b[32m✔ Vite Frontend uchun tunnel tayyor:\x1b[0m ${frontendTunnel.url}`);
    processes.push(frontendTunnel.process);

    // 3. Update env files
    console.log('[System] .env fayllari yangilanmoqda...');
    updateEnvFile(FRONTEND_ENV, 'VITE_API_URL', backendTunnel.url);
    updateEnvFile(BACKEND_ENV, 'WEBSITE_URL', frontendTunnel.url);
    updateEnvFile(BOT_ENV, 'WEBSITE_URL', frontendTunnel.url);
    console.log('\x1b[32m✔ .env fayllari muvaffaqiyatli yangilandi!\x1b[0m');

    // 4. Start local services
    console.log('\n[System] Mahalliy serverlar va bot ishga tushirilmoqda...');
    
    // API Server
    runProcess('node', ['src/api-server.js'], BACKEND_DIR, 'API Server', '33'); // Yellow
    
    // Telegram Bot
    runProcess('node', ['src/bot.js'], BOT_DIR, 'Telegram Bot', '35'); // Magenta
    
    // Frontend Vite
    runProcess('npm', ['run', 'dev'], FRONTEND_DIR, 'Vite Frontend', '36'); // Cyan

    console.log('\n\x1b[32m====================================================\x1b[0m');
    console.log('\x1b[32m🎉 HAMMA TIZIMLAR MUVAFFAQIYATLI ISHGA TUSHDI!\x1b[0m');
    console.log('\x1b[32m====================================================\x1b[0m\n');
    console.log(`🌐 \x1b[1mFrontend Link (Barcha kirishi mumkin):\x1b[0m`);
    console.log(`   \x1b[34m${frontendTunnel.url}\x1b[0m`);
    console.log(`🤖 \x1b[1mBackend Link (API tunnel):\x1b[0m`);
    console.log(`   \x1b[34m${backendTunnel.url}\x1b[0m`);
    console.log(`🔑 \x1b[1mLocaltunnel Kirish Paroli (agar so'ralsa IP kiriting):\x1b[0m`);
    console.log(`   \x1b[33m${publicIP}\x1b[0m\n`);
    console.log('\x1b[90mServerlarni to\'xtatish uchun terminalda Ctrl+C bosing.\x1b[0m\n');

  } catch (error) {
    console.error('\n\x1b[31m[Xatolik] Tizimni boshlashda xatolik yuz berdi:\x1b[0m', error.message);
    cleanup();
    process.exit(1);
  }
}

function cleanup() {
  console.log('\n[System] Barcha jarayonlar yopilmoqda...');
  for (const proc of processes) {
    try {
      proc.kill();
    } catch (e) {
      // Ignore
    }
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

main();
