let pdfDoc = null;
let pageNum = 1;
const scale = 1.5;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('pdfUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                pdfDoc = pdf;
                pageNum = 1;
                renderPage(pageNum);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
    });
}

function searchInPDF() {
    const searchText = document.getElementById('searchText').value.trim().toLowerCase();
    if (!pdfDoc || !searchText) {
        document.getElementById('searchResult').textContent = "⚠️ Ανεβάστε ένα PDF και εισάγετε μια λέξη!";
        return;
    }

    let found = false;
    let foundPage = -1;
    let promises = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        promises.push(pdfDoc.getPage(i).then(page => {
            return page.getTextContent().then(textContent => {
                const text = textContent.items.map(item => item.str).join(" ").toLowerCase();
                if (text.includes(searchText)) {
                    found = true;
                    foundPage = i;
                }
            });
        }));
    }

    Promise.all(promises).then(() => {
        if (found) {
            document.getElementById('searchResult').textContent = `✅ Βρέθηκε στη σελίδα ${foundPage}! Μεταβαίνουμε...`;
            pageNum = foundPage;
            renderPage(pageNum);
        } else {
            document.getElementById('searchResult').textContent = `❌ Δεν βρέθηκε η λέξη "${searchText}"`;
        }
    });
}

function showTab(tabId) {
    alert(`Επιλέξατε: ${tabId}`);
}
