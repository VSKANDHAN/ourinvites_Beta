const fs = require('fs');
const xlsx = require('xlsx');
const pdfkit = require('pdfkit');

// Load feedback data from file
const feedbackData = JSON.parse(fs.readFileSync('feedbacksDataBackup.json', 'utf8'));

// Analyze feedback data
function analyzeFeedback(data) {
    const totalResponses = data.length;
    const ratings = data.map(item => parseFloat(item.rating) || 0).filter(r => r > 0);
    const averageRating = (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2);
    
    const lovedCounts = {};
    const improvementCounts = {};
    const bookCounts = {};
    
    data.forEach(item => {
        if (item.loved) lovedCounts[item.loved] = (lovedCounts[item.loved] || 0) + 1;
        if (item.improvements) improvementCounts[item.improvements] = (improvementCounts[item.improvements] || 0) + 1;
        if (item.booksName) {
            item.booksName.split(/,|\r?\n/).forEach(book => {
                book = book.trim();
                if (book) bookCounts[book] = (bookCounts[book] || 0) + 1;
            });
        }
    });
    
    return { totalResponses, averageRating, lovedCounts, improvementCounts, bookCounts };
}

const analysis = analyzeFeedback(feedbackData);

// Generate Excel report
function generateExcelReport(analysis) {
    const workbook = xlsx.utils.book_new();
    const summarySheet = xlsx.utils.aoa_to_sheet([
        ['Metric', 'Value'],
        ['Total Responses', analysis.totalResponses],
        ['Average Rating', analysis.averageRating]
    ]);
    
    const lovedSheet = xlsx.utils.json_to_sheet(Object.entries(analysis.lovedCounts).map(([key, value]) => ({ Loved: key, Count: value })));
    const improvementSheet = xlsx.utils.json_to_sheet(Object.entries(analysis.improvementCounts).map(([key, value]) => ({ Improvement: key, Count: value })));
    const booksSheet = xlsx.utils.json_to_sheet(Object.entries(analysis.bookCounts).map(([key, value]) => ({ Book: key, Count: value })));
    
    xlsx.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    xlsx.utils.book_append_sheet(workbook, lovedSheet, 'Loved Features');
    xlsx.utils.book_append_sheet(workbook, improvementSheet, 'Improvements');
    xlsx.utils.book_append_sheet(workbook, booksSheet, 'Books Preferences');
    
    xlsx.writeFile(workbook, 'Kanchipuram_Book_Fair_Analysis.xlsx');
    console.log('Excel report generated: Kanchipuram_Book_Fair_Analysis.xlsx');
}

// Generate PDF report
function generatePDFReport(analysis) {
    const doc = new pdfkit();
    doc.pipe(fs.createWriteStream('Kanchipuram_Book_Fair_Analysis.pdf'));
    
    doc.fontSize(16).text('Kanchipuram Book Fair - Feedback Analysis', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Total Responses: ${analysis.totalResponses}`);
    doc.text(`Average Rating: ${analysis.averageRating}`).moveDown();
    
    doc.text('Most Loved Features:', { underline: true }).moveDown(0.5);
    for (const [feature, count] of Object.entries(analysis.lovedCounts)) {
        doc.text(`${feature}: ${count}`);
    }
    
    doc.moveDown().text('Areas for Improvement:', { underline: true }).moveDown(0.5);
    for (const [area, count] of Object.entries(analysis.improvementCounts)) {
        doc.text(`${area}: ${count}`);
    }
    
    doc.moveDown().text('Popular Books:', { underline: true }).moveDown(0.5);
    for (const [book, count] of Object.entries(analysis.bookCounts)) {
        doc.text(`${book}: ${count}`);
    }
    
    doc.end();
    console.log('PDF report generated: Kanchipuram_Book_Fair_Analysis.pdf');
}

// Run report generation
generateExcelReport(analysis);
generatePDFReport(analysis);
