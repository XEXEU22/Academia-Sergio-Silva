/**
 * auto-deploy.cjs
 * 
 * Script de auto-deploy para o projeto Academia Sergio Silva.
 * Monitora alterações nos arquivos do projeto e faz commit + push
 * automaticamente para o GitHub (que aciona o deploy na Vercel).
 * 
 * Como usar:
 *   node auto-deploy.cjs
 * 
 * Deixe rodando em um terminal separado enquanto desenvolve.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Configurações ──────────────────────────────────────────────────────────
const ROOT_DIR = __dirname;
const WATCH_DIRS = ['src', 'supabase', 'public'];
const DEBOUNCE_MS = 4000; // Aguarda 4s após o último save antes de commitar
const BRANCH_MASTER = 'main-local';
const REMOTE_TARGETS = ['master', 'main']; // Branches remotas para atualizar

// ─── State ───────────────────────────────────────────────────────────────────
let debounceTimer = null;
let pendingFiles = new Set();
let deployCount = 0;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function log(msg, type = 'info') {
  const icons = { info: '📦', success: '✅', error: '❌', watch: '👁️' };
  const time = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${time}] ${icons[type] || '•'} ${msg}`);
}

function exec(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    throw new Error(err.stderr || err.message);
  }
}

function hasChanges() {
  try {
    const status = exec('git status --porcelain');
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

// ─── Deploy ──────────────────────────────────────────────────────────────────
function deploy() {
  if (!hasChanges()) {
    log('Nenhuma alteração detectada, pulando deploy.', 'info');
    pendingFiles.clear();
    return;
  }

  const filesChanged = [...pendingFiles].slice(0, 5).join(', ') +
    (pendingFiles.size > 5 ? ` +${pendingFiles.size - 5} arquivo(s)` : '');
  pendingFiles.clear();

  deployCount++;
  const commitMsg = `auto: save changes [${deployCount}] - ${new Date().toLocaleString('pt-BR')}`;

  log(`Iniciando deploy #${deployCount}...`, 'info');
  log(`Arquivos: ${filesChanged}`, 'info');

  try {
    exec('git add .');
    exec(`git commit -m "${commitMsg}"`);
    log('Commit criado!', 'success');

    for (const remote of REMOTE_TARGETS) {
      exec(`git push origin ${BRANCH_MASTER}:${remote}`);
      log(`Push para ${remote} concluído!`, 'success');
    }

    log(`Deploy #${deployCount} concluído! A Vercel irá atualizar o site em breve.`, 'success');
    console.log('─'.repeat(60));
  } catch (err) {
    log(`Erro no deploy: ${err.message}`, 'error');
  }
}

// ─── Watcher ─────────────────────────────────────────────────────────────────
function watchDir(dir) {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return;

  fs.watch(fullPath, { recursive: true }, (event, filename) => {
    if (!filename) return;

    // Ignora arquivos temporários e de build
    if (
      filename.endsWith('.tmp') ||
      filename.includes('node_modules') ||
      filename.includes('.git') ||
      filename.includes('dist/')
    ) return;

    pendingFiles.add(`${dir}/${filename}`);

    // Debounce: aguarda 4s após o último save
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(deploy, DEBOUNCE_MS);
  });

  log(`Monitorando: ${dir}/`, 'watch');
}

// ─── Inicialização ────────────────────────────────────────────────────────────
console.log('');
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║       🥋 ARTE DE LUTAR — AUTO-DEPLOY ATIVO 🥋             ║');
console.log('╠═══════════════════════════════════════════════════════════╣');
console.log('║  Salve qualquer arquivo e ele será enviado ao GitHub      ║');
console.log('║  automaticamente em até 4 segundos.                       ║');
console.log('║                                                           ║');
console.log('║  Pressione CTRL+C para parar.                             ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

for (const dir of WATCH_DIRS) {
  watchDir(dir);
}

log('Auto-deploy pronto! Aguardando alterações...', 'watch');
console.log('─'.repeat(60));
