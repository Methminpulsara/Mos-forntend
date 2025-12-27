document.getElementById('downloadPdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Sales Report", 10, 10);
    doc.autoTable({ html: 'table' });

    doc.save("report.pdf");
});