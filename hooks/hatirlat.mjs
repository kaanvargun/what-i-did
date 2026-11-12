// İsteğe bağlı hatırlatma. VARSAYILAN KAPALI: yalnız WHAT_I_DID_HATIRLAT=1 ise çalışır.
// Modele hiçbir şey göndermez (0 token); yalnız kullanıcıya tek satır gösterir,
// oturum başına bir kez ve yalnız oturumda dosya düzenlendiyse.
if (process.env.WHAT_I_DID_HATIRLAT !== '1') process.exit(0);
import('node:fs').then(async ({ default: fs }) => {
  const os = await import('node:os'), path = await import('node:path');
  let girdi = ''; for await (const c of process.stdin) girdi += c;
  let d; try { d = JSON.parse(girdi); } catch { return; }
  if (!d.session_id || d.stop_hook_active) return;
  const bayrak = path.join(os.tmpdir(), `what-i-did-${d.session_id}`);
  if (fs.existsSync(bayrak)) return;
  let t = ''; try { t = fs.readFileSync(d.transcript_path, 'utf8'); } catch { return; }
  if (!/"name":"(Edit|Write|MultiEdit|NotebookEdit)"/.test(t)) return;
  fs.writeFileSync(bayrak, '');
  process.stdout.write(JSON.stringify({ systemMessage: 'WHAT-I-DID güncellensin mi? → /what-i-did' }));
});
