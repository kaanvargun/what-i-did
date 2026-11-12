#!/usr/bin/env node
// what-i-did: projeden kısa bir özet çıkarır. Modelin kod okumasına gerek kalmasın diye
// tüm tarama burada (yerelde, token harcamadan) yapılır; çıktı küçük tutulur.
// Kullanım: node ozet.mjs [kök] [--kisa]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const KISA = args.includes('--kisa');
const ROOT = path.resolve(args.find(a => !a.startsWith('--')) || process.cwd());
const BASE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NOT_CAP = KISA ? 1500 : 4000, NOT_TOPLAM = KISA ? 5000 : 12000, AGAC_SATIR = KISA ? 60 : 110;
const ATLA = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', '.cache', '__pycache__', 'vendor', 'venv', '.venv', '.wrangler', '.idea', '.vscode']);
const METIN = new Set(['js', 'mjs', 'cjs', 'ts', 'tsx', 'jsx', 'html', 'css', 'sh', 'ps1', 'py', 'md', 'yml', 'yaml', 'toml', 'service', 'timer', 'desktop', 'txt', 'xml', 'gradle', 'kt', 'java', 'c', 'cpp', 'h', 'json']);
const out = [];
const p = s => out.push(s);
const ext = f => (f.includes('.') ? f.split('.').pop().toLowerCase() : '');

if (!fs.existsSync(ROOT)) { console.log('Klasör yok: ' + ROOT); process.exit(1); }

// --- Tarama (yerel) ---
const dosyalar = []; // {rel, size, mtime}
(function gez(dir, rel) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (e.isDirectory()) { if (!ATLA.has(e.name)) gez(path.join(dir, e.name), rel ? rel + '/' + e.name : e.name); continue; }
    if (!e.isFile()) continue;
    try { const st = fs.statSync(path.join(dir, e.name)); dosyalar.push({ rel: rel ? rel + '/' + e.name : e.name, size: st.size, mtime: st.mtimeMs }); } catch {}
  }
})(ROOT, '');

const uzantilar = new Set(dosyalar.map(d => ext(d.rel)).filter(Boolean));
let corpus = dosyalar.map(d => d.rel.toLowerCase()).join('\n') + '\n';
let okunan = 0, toplam = 0;
for (const d of dosyalar) {
  const x = ext(d.rel);
  if (!METIN.has(x) || d.size > 256 * 1024 || okunan >= 800 || toplam > 8e6) continue;
  if (x === 'json' && !/package|manifest|config|tsconfig|wrangler/i.test(d.rel)) continue; // veri dosyalarını atla
  try { corpus += fs.readFileSync(path.join(ROOT, d.rel), 'utf8').toLowerCase() + '\n'; okunan++; toplam += d.size; } catch {}
}
const var_ = key => {
  if (key.startsWith('.') && /^\.[a-z0-9]+$/.test(key)) return uzantilar.has(key.slice(1));
  let i = -1;
  while ((i = corpus.indexOf(key, i + 1)) !== -1) {
    if (!/^[a-z0-9]/.test(key) || i === 0 || !/[a-z0-9_]/.test(corpus[i - 1])) return true;
  }
  return false;
};

// --- Başlık + tür tahmini ---
const turler = [];
if (uzantilar.has('html')) turler.push('web');
if (['raspberry', 'systemctl', 'kiosk', 'lxc', 'proxmox'].some(var_)) turler.push('cihaz');
if (['.apk', '.smali', '.dex', 'apktool'].some(var_)) turler.push('apk');
if (['decompil', 'ghidra', '.asar', 'rizin', 'disassembl'].some(var_)) turler.push('re');
if (['.wasm', 'emscripten', 'webgl', 'gamepad', 'game loop'].some(var_)) turler.push('oyun');
p(`# what-i-did özeti: ${path.basename(ROOT)}`);
p(`kök: ${ROOT} | dosya: ${dosyalar.length} | tür tahmini: ${turler.join(', ') || 'belirsiz'}`);
p(`şablonlar: ${path.join(BASE, 'templates')} (iskelet.md + ${turler.map(t => t + '.md').join(', ') || '-'})`);

// --- Mevcut WHAT-I-DID ---
const wid = dosyalar.find(d => d.rel === 'WHAT-I-DID.md');
if (wid) {
  const txt = fs.readFileSync(path.join(ROOT, wid.rel), 'utf8');
  p(`\n## Mevcut WHAT-I-DID.md (${new Date(wid.mtime).toISOString().slice(0, 16)}) → GÜNCELLE, baştan yazma`);
  p('bölümler: ' + txt.split('\n').filter(l => l.startsWith('## ')).map(l => l.slice(3)).join(' | '));
  const yeni = dosyalar.filter(d => d.mtime > wid.mtime + 1000 && d.rel !== wid.rel).sort((a, b) => b.mtime - a.mtime);
  p(`o tarihten sonra değişen dosya: ${yeni.length}` + (yeni.length ? '\n' + yeni.slice(0, 40).map(d => '  ' + d.rel).join('\n') : ' (güncelleme gerekmeyebilir)'));
} else p('\n## WHAT-I-DID.md yok → 10 bölümü yaz');

// --- Git ---
const git = (...a) => { try { return execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
if (git('rev-parse', '--is-inside-work-tree') === 'true') {
  p('\n## git');
  p(git('log', '-n', KISA ? '10' : '20', '--date=short', '--format=%ad %s') || '(commit yok)');
  const st = git('status', '--short');
  if (st) p(`commit edilmemiş değişiklik: ${st.split('\n').length} dosya`);
} else p('\n## git: yok (geçmiş bilgisi oturumdan/notlardan)');

// --- Hazır notlar ---
const notlar = ['TODO.md', 'CLAUDE.md', 'context/MAP.md', 'README.md', ...dosyalar.filter(d => !d.rel.includes('/') && d.rel.endsWith('.md')).map(d => d.rel)];
let kalan = NOT_TOPLAM; const goruldu = new Set();
for (const n of notlar) {
  if (goruldu.has(n.toLowerCase()) || n === 'WHAT-I-DID.md' || kalan <= 0) continue;
  goruldu.add(n.toLowerCase());
  const f = path.join(ROOT, n); if (!fs.existsSync(f)) continue;
  let t = fs.readFileSync(f, 'utf8').replace(/\n{3,}/g, '\n\n').trim();
  const cap = Math.min(NOT_CAP, kalan);
  if (t.length > cap) t = t.slice(0, cap) + `\n…(kesildi, ${t.length} karakter)`;
  kalan -= t.length;
  p(`\n## not: ${n}\n${t}`);
}

// --- Lisans/kaynak dosyaları (bölüm 9 için; kısa) ---
const lis = dosyalar.filter(d => /(^|\/)(kaynaklar|credits|attribution|licen[cs]e|notice|copying)[^/]*$/i.test(d.rel)).slice(0, 4);
for (const d of lis) {
  let t = fs.readFileSync(path.join(ROOT, d.rel), 'utf8').trim();
  if (t.length > 700) t = t.slice(0, 700) + `\n…(kesildi, ${t.length} karakter)`;
  p(`\n## lisans/kaynak: ${d.rel}\n${t}`);
}

// --- Dosya ağacı (toplanmış) ---
p('\n## dosya ağacı (büyük klasörler toplu)');
const agac = [];
(function ciz(dir, rel, derin) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  const kl = ents.filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
  const fl = ents.filter(e => e.isFile()).sort((a, b) => a.name.localeCompare(b.name));
  const girinti = '  '.repeat(derin);
  if (fl.length > 12 || derin >= 3) {
    if (fl.length) {
      const say = {}; fl.forEach(e => { const x = ext(e.name) || '-'; say[x] = (say[x] || 0) + 1; });
      agac.push(`${girinti}(${fl.length} dosya: ${Object.entries(say).map(([k, v]) => `.${k}×${v}`).join(' ')})`);
    }
  } else for (const e of fl) {
    const sz = fs.statSync(path.join(dir, e.name)).size;
    agac.push(`${girinti}${e.name}${sz > 100 * 1024 ? ` [${Math.round(sz / 1024)}K]` : ''}`);
  }
  for (const e of kl) {
    if (ATLA.has(e.name)) { agac.push(`${girinti}${e.name}/ (atlandı)`); continue; }
    agac.push(`${girinti}${e.name}/`);
    if (derin < 3) ciz(path.join(dir, e.name), rel + e.name + '/', derin + 1);
  }
})(ROOT, '', 0);
p(agac.slice(0, AGAC_SATIR).join('\n') + (agac.length > AGAC_SATIR ? `\n…(+${agac.length - AGAC_SATIR} satır)` : ''));

// --- Sözlük eşleşmeleri ---
p('\n## sözlük eşleşmeleri (yalnız belgede kullandıklarını koy)');
const gdir = path.join(BASE, 'glossary');
for (const g of fs.readdirSync(gdir).filter(f => f.endsWith('.md')).sort()) {
  const satirlar = [];
  for (const l of fs.readFileSync(path.join(gdir, g), 'utf8').split('\n')) {
    if (!l.startsWith('- ')) continue;
    const [terim, keys, aciklama, benzetme] = l.slice(2).split(' | ');
    if (keys && keys.split(',').map(k => k.trimStart()).filter(Boolean).some(var_))
      satirlar.push(`| ${terim} | ${aciklama} | ${benzetme || ''} |`);
  }
  if (satirlar.length) p(`[${g.replace('.md', '')}]\n` + satirlar.join('\n'));
}

process.stdout.write(out.join('\n') + '\n');
