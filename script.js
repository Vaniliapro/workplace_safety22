    let found = false;
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        pdfDoc.getPage(i).then(page => {
            return page.getTextContent();
        }).then(textContent => {
            let text = textContent.items.map(item => item.str.toLowerCase()).join(" ");
            if (text.includes(query)) {
                pageNum = i;
                renderPage(pageNum);
                found = true;
                alert(`🔎 Η λέξη βρέθηκε στη σελίδα ${pageNum}`);
            }
        });
    }

    if (!found) {
        alert("❌ Η λέξη δεν βρέθηκε στο PDF.");
    }
}

// ⬅️➡️ Πλοήγηση στο PDF
document.getElementById("prevPage").addEventListener("click", function () {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById("nextPage").addEventListener("click", function () {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
});
