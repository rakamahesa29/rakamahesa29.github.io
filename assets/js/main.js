document.addEventListener("DOMContentLoaded", function () {
  const navIconMobile = document.querySelector("#nav-icon-mobile");

  navIconMobile.addEventListener("click", function () {
    this.classList.toggle("open");
  });
});

fetch("./data/gejala_penyakit.json")
  .then((response) => response.json())
  .then((data) => {
    const contentElement = document.querySelector(".gejala-penyakit");
    let uniqueGejala = new Map();

    // Melakukan loop melalui setiap penyakit
    data.penyakit.forEach((penyakit) => {
      // Melakukan loop melalui setiap gejala
      penyakit.gejala.forEach((gejala) => {
        // Menambahkan gejala ke map unik jika belum ada
        if (!uniqueGejala.has(gejala.nama)) {
          uniqueGejala.set(gejala.nama, gejala);
        }
      });
    });

    let idCounter = 0; // Counter untuk membuat id dinamis

    // Loop melalui setiap gejala unik dan menambahkan button ke HTML
    uniqueGejala.forEach((gejala, gejalaName) => {
      const gejalaElement = document.createElement("button");
      gejalaElement.textContent = gejalaName;

      // Menambahkan atribut data ke button
      gejalaElement.setAttribute("data-value-name", gejala.nama);
      gejalaElement.setAttribute("data-value-keyakinan", gejala.keyakinan);

      // Menambahkan id dinamis ke button
      gejalaElement.id = `gejalaButton${idCounter++}`;

      gejalaElement.onclick = function() {
        // Cek apakah button sudah dipilih
        if (this.classList.contains("button-selected")) {
          // Jika sudah dipilih, hapus class dan hapus data dari localStorage
          this.classList.remove("button-selected");
          localStorage.removeItem("namaGejala");
          localStorage.removeItem("nilaiKeyakinan");
          console.log('Data dihapus dari localStorage');
        } else {
          // Jika belum dipilih, tambahkan class dan simpan data ke localStorage
          this.classList.add("button-selected");
      
          const gejalaData = {
            nama: this.getAttribute("data-value-name"),
            keyakinan: parseFloat(this.getAttribute("data-value-keyakinan"))
          };
          localStorage.setItem("namaGejala", JSON.stringify(gejalaData.nama));
          localStorage.setItem("nilaiKeyakinan", JSON.stringify(gejalaData.keyakinan));
        
          let storedNamaGejala = localStorage.getItem("namaGejala");
          let storedNilaiKeyakinan = localStorage.getItem("nilaiKeyakinan");
          console.log(`Data disimpan ke localStorage: ${storedNamaGejala},${storedNilaiKeyakinan}`);
        }
      };
      

      contentElement.appendChild(gejalaElement);
    });
  })
  .catch((error) => console.error("Error:", error));