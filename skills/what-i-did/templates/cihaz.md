# Tür: cihaz / sunucu kurulumu (Raspberry Pi, Linux, LXC, kiosk)
Bölüm ipuçları
- 3: donanım (hangi cihaz, ekrana nasıl bağlı), işletim sistemi, hangi servis ne zaman başlıyor.
- 4: kurulum betiğinin cihazda oluşturduğu dosyaları da yaz (/opt, /etc/systemd, autostart).
- 5: "fişe takınca ne olur": açılış → otomatik giriş → servis → tarayıcı tam ekran → uygulama.
- 8: gerçek cihazda denenmedi mi? Elektrik kesintisi, saat kayması (RTC yok), SD kart bozulması.
- 10: kurulum, güncelleme, kaldırma, eski hale dönme komutları.
SSS
- Elektrik gidip gelince kendiliğinden açılır mı?
- İnternet/Wi-Fi yokken çalışır mı? Saat nasıl doğru kalır?
- Uzaktan erişim var mı, güvenli mi (şifre, SSH)?
- Güncelleme nasıl yapılır, kim yapar?
- Cihaz bozulursa yenisine nasıl kurulur, ne kadar sürer?
- Eski sisteme nasıl geri dönülür?
- Betik cihazda neyi değiştiriyor (root/sudo ile)?
