window.onload = function() {
  // Membaca query string dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const diagnosaId = urlParams.get('id');

  const formData = JSON.parse(localStorage.getItem(`formData-${diagnosaId}`));
  // Mendapatkan data namaLengkap dari formData
  const namaLengkap = formData ? formData.namaLengkap : null;
  
  // Anda bisa menggunakan variabel namaLengkap sekarang
  console.log(namaLengkap);

  const namaPasien = document.getElementById("namaPasien");
  namaPasien.innerHTML = namaLengkap;
  
  const hasilDiagnosa = JSON.parse(localStorage.getItem(`hasilDiagnosa-${diagnosaId}`));
  const elemHasilDiagnosa = document.getElementById("hasilDiagnosa");
  const elemHasilPenyakitLain = document.getElementById("hasilPenyakitLain");

  if (hasilDiagnosa) {
    hasilDiagnosa.sort((a, b) => b.keyakinan - a.keyakinan);

    let teksHasil = "kemungkinan penyakit yang kamu miliki adalah ";
    let namaPenyakitHasil = "Gejala "
    let deskripsiHasil = "";
    let teksPenyakitLain = "";
    const penyakitUtama = hasilDiagnosa.slice(0, 1);
    for (const diagnosa of penyakitUtama) {
      teksHasil += `${diagnosa.penyakit} (dengan nilai keyakinan sebesar ${(diagnosa.keyakinan * 100).toFixed(2)}%)<br>`;
      namaPenyakitHasil += `${diagnosa.penyakit}`;
      deskripsiHasil += `${diagnosa.deskripsi}`;
    }

    const penyakitLain = hasilDiagnosa.slice(1);
    if (penyakitLain.length > 0) {
      teksPenyakitLain += "namun ada kemungkinan penyakit lain yang diderita seperti";
      for (const diagnosa of penyakitLain) {
        // teksHasil += `${diagnosa.penyakit} (dengan nilai keyakinan ${(diagnosa.keyakinan * 100).toFixed(2)}%)<br>`;
        teksPenyakitLain += `${diagnosa.penyakit} (dengan nilai keyakinan <span class="keyakinan-penyakit">${(diagnosa.keyakinan * 100).toFixed(2)}</span>%) `;
      }
    }

    elemHasilDiagnosa.innerHTML = teksHasil;
    document.getElementById("judulHasilPenyakit").innerHTML = namaPenyakitHasil;
    document.getElementById("hasilPenyakit").innerHTML = deskripsiHasil;
    document.getElementById("hasilLainDiagnosa").innerHTML = teksPenyakitLain; // Menampilkan penyakit lain
  } else {
    elemHasilDiagnosa.innerHTML = "Tidak dapat mendiagnosa penyakit. Harap konsultasikan dengan dokter.";
    document.getElementById("hasilPenyakit").innerHTML = "";
    elemHasilPenyakitLain.innerHTML = ""; // Mengosongkan penyakit lain jika tidak ada hasil diagnosa
  }
}

function backToHome() {
  const urlParams = new URLSearchParams(window.location.search);
  const diagnosaId = urlParams.get('id');
  localStorage.removeItem("gejala");
  localStorage.removeItem(`formData-${diagnosaId}`);
  window.open("/index.html", "_self");
}
