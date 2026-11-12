# what-i-did
> [English](README.md)

Claude Code plugin'i. Proje bitince köke **WHAT-I-DID.md** yazar: teknik bilgisi az biri projeyi
başkasına eksiksiz, doğru terimlerle ve dürüstçe anlatabilsin.

## Kurulum
Terminalde (ya da Claude Code içinde başına `/` koyarak):
```bash
claude plugin marketplace add kaanvargun/what-i-did
claude plugin install what-i-did@what-i-did
```
Yeni oturum aç, `/what-i-did` yaz. Varsayılan kurulum bu bilgisayardaki tüm projelerde geçerlidir;
yalnız bir proje için `--scope project` ekle.

Kaldırma:
```bash
claude plugin uninstall what-i-did@what-i-did
claude plugin marketplace remove what-i-did
```
Güncelleme: `claude plugin marketplace update what-i-did`

Yerel klasörden kurmak için `marketplace add` komutuna GitHub adı yerine klasör yolunu ver.

## Kullanım
```
/what-i-did                 # çalışma klasörü
/what-i-did apps/Proje      # başka klasör
/what-i-did --dil=en        # İngilizce
/what-i-did --kisa          # çok büyük projede daha az not oku
```
Dosya zaten varsa baştan yazılmaz; yalnız son yazımdan sonra değişen kısımlar güncellenir.

## Belge bölümleri (sabit sıra)
1 Tek cümlede · 2 Ne yaptık · 3 Nasıl çalışıyor (şema) · 4 Dosya haritası · 5 Baştan sona akış ·
6 Kavram sözlüğü (yalnız projede geçenler) · 7 Sorulabilecek sorular · 8 Dürüst sınırlar (zorunlu:
yapay zekâ ile yapıldığı, test edilmeyenler, tahmini kısımlar) · 9 Kaynaklar ve lisanslar · 10 Komutlar

## Token tasarrufu (neden ucuz?)
- Model kodu **okumaz**. `skills/what-i-did/scripts/ozet.mjs` bilgisayarda (token harcamadan) klasörü tarar
  ve tek, kısa bir özet verir: tür tahmini, git geçmişi, TODO/CLAUDE/MAP/README notları, toplanmış dosya ağacı,
  lisans dosyaları ve **yalnız projede geçen** sözlük terimleri.
- Sözlük dosyalarının tamamı modele gitmez; script eşleşen satırları seçer.
- Model yalnız ilgili şablonu okur (web, cihaz, apk, re, oyun).
- Güncellemede tüm belge yeniden yazılmaz, yalnız etkilenen bölümler düzenlenir.
- Oturum başına sabit maliyet: yalnız skill'in tek satırlık açıklaması. Hook varsayılan kapalı.
- Yaklaşık maliyet (Vakit Ekranı, ~1300 dosya): özet çıktısı ~16 KB; asıl maliyet belgenin kendisini yazmak.

## İsteğe bağlı hatırlatma (varsayılan KAPALI)
Oturumda dosya düzenlendiyse, oturum başına bir kez ekranda tek satır: "WHAT-I-DID güncellensin mi?".
Modele bir şey gitmez (0 token). Açmak için `~/.claude/settings.json`:
```json
{ "env": { "WHAT_I_DID_HATIRLAT": "1" } }
```

## Yapı
```
.claude-plugin/plugin.json        plugin tanımı
.claude-plugin/marketplace.json   yerel kurulum için katalog
commands/what-i-did.md            /what-i-did komutu (skill'i çağırır)
skills/what-i-did/SKILL.md        talimat
skills/what-i-did/scripts/ozet.mjs  yerel özet çıkarıcı (Node.js gerekir)
skills/what-i-did/templates/      iskelet + tür şablonları (bölüm ipuçları, SSS)
skills/what-i-did/glossary/       kavram sözlüğü (genel, web, linux, android, re, oyun)
hooks/hooks.json, hatirlat.mjs    isteğe bağlı hatırlatma
```

## Sözlüğe terim ekleme
`glossary/<konu>.md` içine bir satır:
```
- Terim | anahtar1,anahtar2,.uzanti | 1-2 cümle sade açıklama. | Benzetme.
```
Anahtar `.` ile başlıyorsa dosya uzantısıdır; diğerleri dosya adı/içeriğinde aranır (küçük harf).

## Gereksinim
Node.js 18+ (özet scripti ve hook için).
