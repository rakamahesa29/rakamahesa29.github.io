window.onload = function() {
    const hasilDiagnosa = JSON.parse(localStorage.getItem("hasilDiagnosa"));
    const elemHasilDiagnosa = document.getElementById("hasilDiagnosa");
  
    if (hasilDiagnosa) {
      hasilDiagnosa.sort((a, b) => b.keyakinan - a.keyakinan);
  
      let teksHasil = "Kemungkinan penyakit yang diderita:<br>";
      const penyakitUtama = hasilDiagnosa.slice(0, 1);
      for (const diagnosa of penyakitUtama) {
        teksHasil += `${diagnosa.penyakit} (Keyakinan: ${(diagnosa.keyakinan * 100).toFixed(2)}%)<br>`;
      }
  
      const penyakitLain = hasilDiagnosa.slice(1);
      if (penyakitLain.length > 0) {
        teksHasil += "<br>namun ada kemungkinan penyakit lain yang diderita seperti:<br>";
        for (const diagnosa of penyakitLain) {
          teksHasil += `${diagnosa.penyakit} (Keyakinan: ${(diagnosa.keyakinan * 100).toFixed(2)}%)<br>`;
        }
      }
  
      elemHasilDiagnosa.innerHTML = teksHasil;
    } else {
      elemHasilDiagnosa.innerHTML = "Tidak dapat mendiagnosa penyakit. Harap konsultasikan dengan dokter.";
    }
  }
  