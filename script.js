// Function to switch tabs
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

// PDF Upload and Search Function
function searchInPDF() {
    const file = document.getElementById('pdfUpload').files[0];
    const searchText = document.getElementById('searchText').value;
    
    if (!file || !searchText) {
        document.getElementById('searchResult').textContent = "Please upload a PDF and enter a search term.";
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
            let totalText = "";
            let pagePromises = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                pagePromises.push(
                    pdf.getPage(i).then(page => {
                        return page.getTextContent().then(textContent => {
                            totalText += textContent.items.map(item => item.str).join(" ") + " ";
                        });
                    })
                );
            }

            Promise.all(pagePromises).then(() => {
                const found = totalText.toLowerCase().includes(searchText.toLowerCase());
                document.getElementById('searchResult').textContent = found 
                    ? `The word "${searchText}" was found in the document.` 
                    : `The word "${searchText}" was NOT found in the document.`;
            });
        });
    };
    reader.readAsArrayBuffer(file);
}
