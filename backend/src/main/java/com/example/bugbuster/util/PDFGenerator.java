package com.example.bugbuster.util;

import com.example.bugbuster.entity.BugReport;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.FileOutputStream;
import java.time.format.DateTimeFormatter;

@Component
public class PDFGenerator {

    @Value("${pdf.storage.path}")
    private String pdfStoragePath;

    public String generateReportPDF(BugReport report) {
        String fileName = "report_" + report.getReportId() + ".pdf";
        String filePath = pdfStoragePath + fileName;

        try (Document document = new Document()) {
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            // Add report content
            document.add(new Paragraph("BugBuster Scan Report"));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("URL: " + report.getUrlScanned()));
            document.add(new Paragraph("Scan Date: " +
                    report.getScanTimestamp().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
            document.add(new Paragraph("Total Bugs Found: " + report.getTotalBugsFound()));

            // Add more report details as needed
            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }

        return filePath;
    }
}