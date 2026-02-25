# Dicatat

Dicatat adalah sebuah aplikasi web manajemen catatan (Notes App) yang intuitif dan mudah digunakan. Aplikasi ini dirancang untuk membantu pengguna mencatat, mengelola, dan menyimpan ide atau informasi penting sehari-hari. 

Aplikasi Dicatat terintegrasi secara langsung dengan layanan RESTful API **Dicoding Notes API v2** (`https://notes-api.dicoding.dev/v2`) sebagai backend (server-side). Seluruh proses manipulasi data pada aplikasi ini berkomunikasi langsung dengan endpoint API tersebut untuk memastikan data tersimpan secara terpusat dan aman.

## Fitur Utama

Berdasarkan antarmuka pengguna pada aplikasi, Dicatat memiliki fungsionalitas CRUD (Create, Read, Update, Delete) yang lengkap beserta fitur pengarsipan:

* **Buat Catatan Baru (Create Note)**
  Pengguna dapat membuat catatan baru dengan memasukkan "Judul" dan "Isi Catatan" melalui formulir yang disediakan, kemudian menyimpannya dengan menekan tombol "Tambahkan Catatan".
* **Daftar Catatan Aktif (Active Notes)**
  Menampilkan semua catatan pengguna yang sedang berstatus aktif. Setiap kartu catatan menampilkan judul, isi catatan, dan juga tanggal pembuatan secara rapi.
* **Daftar Catatan Arsip (Archived Notes)**
  Menyediakan bagian khusus untuk menampilkan catatan yang telah diarsipkan. Fitur ini membantu pengguna merapikan tampilan daftar catatan aktif dari catatan yang mungkin sudah tidak terlalu sering dibaca namun tetap ingin disimpan.
* **Arsip dan Batal Arsip (Archive & Unarchive)**
  Pengguna dapat memindahkan catatan dari daftar "Active Notes" ke "Archived Notes" dengan menekan tombol "Archive". Sebaliknya, catatan yang ada di arsip dapat dikembalikan ke daftar aktif dengan tombol "Unarchive".
* **Ubah Catatan (Edit Note)**
  Memungkinkan pengguna untuk memperbarui atau mengubah judul dan isi dari catatan yang sudah ada sebelumnya melalui tombol "Edit".
* **Hapus Catatan (Delete Note)**
  Pengguna dapat menghapus catatan yang sudah tidak diperlukan lagi secara permanen dengan menekan tombol "Delete".

## Integrasi API (Dicoding Notes API v2)

Aplikasi ini tidak menyimpan data pada local storage peramban, melainkan melakukan pemanggilan HTTP Request (Fetch API/Axios) ke Dicoding Notes API v2. Interaksi yang dilakukan meliputi:
* Mendapatkan daftar catatan aktif dan catatan arsip.
* Mengirim data catatan baru ke server.
* Mengirim permintaan pembaruan data (Edit).
* Mengubah status arsip (Archive/Unarchive) suatu catatan.
* Menghapus data catatan dari server.

## Hak Cipta
Copyright (c) 2025 nuramalihisyam. All Rights Reserved.

## Profil Pengembang
### Nur Amali Hisyam
* **Peran:** Front-End Developer
* **Linkedin:** [linkedin.com/in/nuramalihisyam](https://www.linkedin.com/in/nuramalihisyam)
* **Github:** [github.com/Hisyamuel](https://github.com/Hisyamuel)
* **Instagram:** [instagram.com/smhsymz](https://www.instagram.com/smhsymz)
* **Portfolio:** [nuramalihisyam.netlify.app](https://nuramalihisyam.netlify.app)