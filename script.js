let pdfDoc = null,
    pageNum = 1,
    scale = 1.5,
    canvas = document.getElementById("pdfCanvas"),
    ctx = canvas.getContext("2d");

// 📂 Φόρτωμα PDF από τον χρήστη
document.getElementById("uploadPDF").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
        alert("Παρακαλώ ανεβάστε ένα αρχείο PDF!");
        return;
    }

    let fileReader = new FileReader();
    fileReader.onload = function () {
        let typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
            pdfDoc = pdf;
            pageNum = 1;
            renderPage(pageNum);
        });
    };
    fileReader.readAsArrayBuffer(file);
});

// 🖼️ Εμφάνιση σελίδας PDF
function renderPage(num) {
    if (!pdfDoc) return;

    pdfDoc.getPage(num).then(function (page) {
        let viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };
        page.render(renderContext);

        document.getElementById("pageNumber").textContent = `📄 Σελίδα ${num} από ${pdfDoc.numPages}`;
    });
}

// 🔍 Αναζήτηση λέξης στο PDF
async function searchInPDF() {
    let query = document.getElementById("searchWord").value.toLowerCase();
    if (!pdfDoc || query === "") {
        alert("Πρώτα ανεβάστε ένα PDF και εισάγετε μια λέξη προς αναζήτηση!");
        return;
    }

    let found = false;
    
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        let page = await pdfDoc.getPage(i);
        let textContent = await page.getTextContent();
        let text = textContent.items.map(item => item.str.toLowerCase()).join(" ");

        if (text.includes(query)) {
            pageNum = i;
            renderPage(pageNum);
            found = true;
            alert(`🔎 Η λέξη βρέθηκε στη σελίδα ${pageNum}`);
            break;
        }
    }

    if (!found) {
        alert("❌ Η λέξη δεν βρέθηκε στο PDF.");
    }
}

// ⬅️➡️ Πλοήγηση στο PDF
document.getElementById("prevPage").addEventListener("click", function () {
    if (!pdfDoc || pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById("nextPage").addEventListener("click", function () {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
});
