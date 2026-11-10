# MathQuest SMP

React + Vite + Firebase Firestore, aplikasi kuis dengan empat petualangan matematika (masing-masing 10 soal), skor dan leaderboard.

## Menjalankan
1. Instal Node.js versi LTS.
2. Buat proyek Firebase dan aktifkan Firestore Database.
3. Di Firebase Console > Project settings > Your apps, salin konfigurasi web ke `src/firebase.js`.
4. Atur Firestore Rules memakai `firestore.rules` (lihat catatan keamanan).
5. Jalankan:
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```
6. Buka URL lokal dari Vite.

## Penting tentang keamanan
Kode reset admin di browser menggunakan env key hanya untuk prototipe lokal; variabel `VITE_*` akan terlihat oleh pengguna. Jangan gunakan untuk kompetisi publik. Untuk penggunaan nyata, tambahkan Firebase Authentication, custom claims admin, dan Cloud Function yang memvalidasi jawaban serta memperbarui skor di server. Rules prototipe juga belum membatasi pemain memanipulasi skor; jangan dipublikasikan tanpa hardening.
