import pdfExportService from '../services/pdfExport.service.js';

export const exportTripPDF = async (req, res) => {
  try {
    const { id } = req.params;
    await pdfExportService.generateTripPDF(id, res);
  } catch (err) {
    console.error('[PDF Export] Error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
};
