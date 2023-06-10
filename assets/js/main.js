document.addEventListener("DOMContentLoaded", async function () {

  const navIconMobile = document.querySelector("#nav-icon-mobile");
  navIconMobile.addEventListener("click", function () {
    this.classList.toggle("open");
  });

  async function ambilDataGejalaPenyakit() {
    const response = await fetch("/data/gejala_penyakit.json");
    const data = await response.json();
    return data;
  }

  function min(a, b) {
    return Math.min(a, b);
  }

  function fuzzyDiagnosa(gejalaPasien, gejalaPenyakit) {
    const hasilDiagnosa = [];
  
    for (const penyakit of gejalaPenyakit.penyakit) {
      let minKeyakinan = 1;
  
      for (const gejalaObj of penyakit.gejala) {
        if (gejalaPasien.find(gejala => gejala.nama === gejalaObj.nama)) {
          minKeyakinan = min(minKeyakinan, gejalaObj.keyakinan);
        }
      }
  
      if (minKeyakinan !== 1) {
        hasilDiagnosa.push({
          penyakit: penyakit.nama,
          keyakinan: minKeyakinan,
          deskripsi: penyakit.deskripsi
        });
      }
    }
  
    hasilDiagnosa.sort((a, b) => b.keyakinan - a.keyakinan);
    console.log(hasilDiagnosa);
    return hasilDiagnosa;
  }

  async function main() {

    const namaLengkap = document.querySelector("#inputName").value;
    const nomerTelepon = document.querySelector("#inputPhoneNumber").value;
    const email = document.querySelector("#inputEmail").value;
    const alamatLengkap = document.querySelector("#inputFullAddress").value;
  
    // Simpan data form di dalam sebuah objek
    const formData = {
      namaLengkap,
      nomerTelepon,
      email,
      alamatLengkap
    };
    
   // Membuat ID unik untuk setiap diagnosa
   const diagnosaId = new Date().getTime();

   // Menyimpan data form dan gejala dengan ID unik
   localStorage.setItem(`formData-${diagnosaId}`, JSON.stringify(formData));
 
   const gejalaPenyakit = await ambilDataGejalaPenyakit();
   const gejalaPasien = JSON.parse(localStorage.getItem("gejala")) || [];
   const hasilDiagnosa = fuzzyDiagnosa(gejalaPasien, gejalaPenyakit);
   localStorage.setItem(`hasilDiagnosa-${diagnosaId}`, JSON.stringify(hasilDiagnosa));
   window.open(`hasil-diagnosa-penyakit.html?id=${diagnosaId}`, "_self");
  }

  const data = await ambilDataGejalaPenyakit();

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
          
        let storedGejala = JSON.parse(localStorage.getItem("gejala")) || [];
        storedGejala = storedGejala.filter(gejala => gejala.nama !== this.getAttribute("data-value-name"));
        
        localStorage.setItem("gejala", JSON.stringify(storedGejala));
        console.log('Data dihapus dari localStorage');
      } else {
        // Jika belum dipilih, tambahkan class dan simpan data ke localStorage
        this.classList.add("button-selected");

        const gejalaData = {
          nama: this.getAttribute("data-value-name"),
          keyakinan: parseFloat(this.getAttribute("data-value-keyakinan"))
        };
        
        let storedGejala = JSON.parse(localStorage.getItem("gejala")) || [];
        storedGejala.push(gejalaData);
        
        localStorage.setItem("gejala", JSON.stringify(storedGejala));
        console.log(`Data disimpan ke localStorage: ${JSON.stringify(storedGejala)}`);
      }
    };

    contentElement.appendChild(gejalaElement);
  });

  // const diagnoseButton = document.createElement("button");
  // diagnoseButton.textContent = "Diagnosa";
  // diagnoseButton.onclick = main;
  // contentElement.appendChild(diagnoseButton);

  document.querySelector(".button-submit button").addEventListener("click", main);

})
.catch((error) => console.error("Error:", error));


function navMobile() {
  let open = document.getElementById("mobileMenu");
  open.classList.toggle("open-menu");
}

        