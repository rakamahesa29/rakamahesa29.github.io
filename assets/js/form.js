window.onload = async function () {
    const response = await fetch("/data/gejala_penyakit.json");
    const data = await response.json();
    console.log(data);
  };

  async function ambilDataGejalaPenyakit() {
    const response = await fetch("/data/gejala_penyakit.json");
    const data = await response.json();
    return data;
  }

  function inputGejala() {
    const gejalaPasien = document
      .getElementById("gejala")
      .value.toLowerCase()
      .split(", ");
    return gejalaPasien;
  }

  function min(a, b) {
    return Math.min(a, b);
  }

  function max(a, b) {
    return Math.max(a, b);
  }

  function fuzzyDiagnosa(gejalaPasien, gejalaPenyakit) {
    const hasilDiagnosa = [];

    for (const penyakit of gejalaPenyakit.penyakit) {
      let minKeyakinan = 1;

      for (const gejalaObj of penyakit.gejala) {
        if (gejalaPasien.includes(gejalaObj.nama)) {
          minKeyakinan = min(minKeyakinan, gejalaObj.keyakinan);
        }
      }

      if (minKeyakinan !== 1) {
        hasilDiagnosa.push({
          penyakit: penyakit.nama,
          keyakinan: minKeyakinan,
        });
      }
    }

    hasilDiagnosa.sort((a, b) => b.keyakinan - a.keyakinan);
    return hasilDiagnosa;
  }

  async function main() {
    const gejalaPenyakit = await ambilDataGejalaPenyakit();
    const gejalaPasien = inputGejala();
    const hasilDiagnosa = fuzzyDiagnosa(gejalaPasien, gejalaPenyakit);
    localStorage.setItem("hasilDiagnosa", JSON.stringify(hasilDiagnosa));
    window.open("hasil-diagnosa.html", "_blank");
  }