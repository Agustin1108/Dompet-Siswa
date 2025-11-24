import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Transaction } from "../types";

export const generatePDF = (transactions: Transaction[], totalBalance: number) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("Laporan Keuangan Siswa", 14, 22);

  doc.setFontSize(11);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Dibuat pada: ${dateStr}`, 14, 30);
  
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`Sisa Saldo: Rp ${totalBalance.toLocaleString('id-ID')}`, 14, 40);

  // Table Data
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString('id-ID'),
    t.category,
    t.note || '-',
    t.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran',
    `Rp ${t.amount.toLocaleString('id-ID')}`
  ]);

  autoTable(doc, {
    head: [['Tanggal', 'Kategori', 'Catatan', 'Tipe', 'Jumlah']],
    body: tableData,
    startY: 50,
    theme: 'grid',
    headStyles: { fillColor: [0, 122, 255] }, // iOS Blue
    styles: { font: "helvetica" },
    columnStyles: {
      4: { halign: 'right' }
    }
  });

  doc.save(`Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.pdf`);
};
