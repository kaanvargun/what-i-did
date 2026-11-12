---
name: what-i-did
description: Writes/updates WHAT-I-DID.md in the project root to explain a finished project. Use for "/what-i-did", "explain the project", "projeyi anlat", "ne yaptık yaz".
---
# what-i-did

Amaç: teknik bilgisi az kullanıcı projeyi birine eksiksiz, doğru terimlerle, dürüstçe anlatabilsin.
TOKEN KURALI: kod tabanını OKUMA/TARAMA. Bilgi = aşağıdaki script çıktısı + bu oturumda zaten bilinenler.
Ek dosya okuman gerekirse en fazla 2 dosya, yalnız gereken satırlar.

## Adımlar
1. Tek komut (bu skill'in klasörü = BASE; kök = argümandaki klasör yoksa çalışma dizini):
   `node "BASE/scripts/ozet.mjs" "<kök>"` (çok büyük projede `--kisa` ekle)
   Çıktı: tür tahmini, git özeti, hazır notlar (TODO/CLAUDE/MAP/README), dosya ağacı, eşleşen sözlük satırları, varsa mevcut WHAT-I-DID durumu.
2. Tür(ler)e göre yalnızca ilgili şablonu oku: `BASE/templates/<tür>.md` (web, oyun, apk, re, cihaz). İskelet: `BASE/templates/iskelet.md`.
3. Yaz:
   - WHAT-I-DID.md YOKSA: iskeletteki 10 bölümü sırayla yaz, tek Write.
   - VARSA: baştan yazma. Script'in "değişenler" listesine göre yalnız etkilenen bölümleri Edit ile güncelle; en alttaki "Son güncelleme" satırını yenile.
4. Kavram sözlüğü (6): yalnız script'in verdiği eşleşmeler + oturumda geçen ek terimler. Belgede kullanmadığın terimi koyma.
5. Dürüst sınırlar (8) ZORUNLU, boş bırakılamaz: yapay zekâ (Claude Code) ile yapıldı + kullanıcının rolü; test EDİLMEYENLER (notlarda "denenmedi" vb. geçenler); tahmini/varsayım kısımlar; bilinen hatalar. Emin olmadığını "doğrulanmadı" diye yaz, uydurma.
6. Dil: `--dil=` verilmişse o, yoksa kullanıcının konuştuğu dil (belirsizse İngilizce). Başlıkları, şablonu ve sözlük satırlarını o dile çevir.
7. Kullanıcıya tek satır: dosya yolu + "doğrulanmadı" diye işaretlenen madde sayısı. Belgeyi sohbete kopyalama.

## Yazım
- Sade cümle, kısa madde, tablo. Her bölüm ekranı geçmesin. Toplam ~200-350 satır.
- Dosya haritasında 1 satır = 1 dosya/klasör görevi; büyük veri klasörlerini tek satırda topla.
- Kod parçası koyma; yalnız komut (bölüm 10).
- Gizli bilgi (şifre, token, e-posta, iç IP) yazma.
