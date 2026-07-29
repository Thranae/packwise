import PDFDocument from 'pdfkit';
import Trip from '../models/Trip.js';

/**
 * PDF Export Service
 * Generates a beautifully formatted trip report PDF using pdfkit.
 */
class PDFExportService {
  async generateTripPDF(tripId, res) {
    const trip = await Trip.findById(tripId).lean();
    if (!trip) throw new Error('Trip not found');

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `${trip.destination} — Trip Report`,
        Author: 'Voyage Genie',
        Subject: 'Travel Itinerary & Packing List',
      }
    });

    // Pipe to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="voyage-genie-${trip.destination.replace(/\s/g, '-')}.pdf"`);
    doc.pipe(res);

    this._drawCoverPage(doc, trip);
    this._drawItinerary(doc, trip);
    this._drawPackingList(doc, trip);
    this._drawBudget(doc, trip);
    this._drawFooter(doc);

    doc.end();
  }

  _drawCoverPage(doc, trip) {
    // Dark header background
    doc.rect(0, 0, doc.page.width, 220).fill('#0F172A');

    // Title
    doc.fontSize(28).fillColor('#FFFFFF').font('Helvetica-Bold')
      .text('Voyage Genie', 50, 50, { align: 'left' });

    doc.fontSize(11).fillColor('#94A3B8').font('Helvetica')
      .text('Your AI-Powered Travel Companion', 50, 82);

    // Destination
    doc.moveTo(50, 110).lineTo(doc.page.width - 50, 110).strokeColor('#334155').stroke();

    doc.fontSize(22).fillColor('#F1F5F9').font('Helvetica-Bold')
      .text(trip.destination, 50, 125);

    doc.fontSize(12).fillColor('#64748B').font('Helvetica')
      .text(trip.country || '', 50, 153);

    // Trip metadata row
    const metaY = 170;
    const meta = [
      { label: 'Status', value: (trip.status || 'planning').toUpperCase() },
      { label: 'Travelers', value: String(trip.travelers || 1) },
      { label: 'Budget', value: `${trip.budget || 0} ${trip.currency || 'USD'}` },
    ];

    if (trip.startDate) {
      meta.unshift({ label: 'Dates', value: `${this._fmt(trip.startDate)} → ${this._fmt(trip.endDate)}` });
    }

    let mx = 50;
    for (const m of meta) {
      doc.fontSize(9).fillColor('#64748B').font('Helvetica').text(m.label, mx, metaY);
      doc.fontSize(11).fillColor('#CBD5E1').font('Helvetica-Bold').text(m.value, mx, metaY + 14);
      mx += 130;
    }

    doc.moveDown(8);
    doc.fillColor('#0F172A'); // reset
  }

  _drawItinerary(doc, trip) {
    if (!trip.itinerary?.length) return;

    doc.addPage();
    this._sectionHeader(doc, '📅  Day-by-Day Itinerary');

    for (const day of trip.itinerary) {
      doc.fontSize(13).fillColor('#1E293B').font('Helvetica-Bold')
        .text(`Day ${day.day}: ${day.title || ''}`, { continued: false });
      doc.moveDown(0.3);

      if (day.activities?.length) {
        for (const act of day.activities) {
          doc.fontSize(10).fillColor('#475569').font('Helvetica-Bold')
            .text(`  ${act.time || ''}  `, { continued: true });
          doc.fontSize(10).fillColor('#334155').font('Helvetica')
            .text(act.place || act.description || '');
          if (act.description && act.place) {
            doc.fontSize(9).fillColor('#94A3B8').font('Helvetica')
              .text(`       ${act.description}`, { indent: 20 });
          }
          doc.moveDown(0.2);
        }
      }
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#E2E8F0').stroke();
      doc.moveDown(0.5);
    }
  }

  _drawPackingList(doc, trip) {
    if (!trip.packingList?.length) return;

    doc.addPage();
    this._sectionHeader(doc, '🎒  Packing List');

    for (const cat of trip.packingList) {
      doc.fontSize(12).fillColor('#1E293B').font('Helvetica-Bold')
        .text(cat.category || cat.name || 'Items');
      doc.moveDown(0.3);

      const items = cat.items || [];
      for (const item of items) {
        const check = item.isPacked ? '☑' : '☐';
        doc.fontSize(10).fillColor(item.isPacked ? '#22C55E' : '#475569').font('Helvetica')
          .text(`  ${check}  ${item.name || item.text || ''}`, { indent: 10 });
      }
      doc.moveDown(0.6);
    }
  }

  _drawBudget(doc, trip) {
    if (!trip.budgetDetails?.categories?.length) return;

    doc.addPage();
    this._sectionHeader(doc, '💰  Budget Breakdown');

    doc.fontSize(12).fillColor('#475569').font('Helvetica')
      .text(`Total Budget: ${trip.budget} ${trip.currency || 'USD'}`);
    doc.moveDown(0.5);

    for (const cat of trip.budgetDetails.categories) {
      const barWidth = Math.round((cat.percent / 100) * (doc.page.width - 150));
      doc.fontSize(10).fillColor('#334155').font('Helvetica-Bold').text(`${cat.name}`, { continued: true });
      doc.fontSize(10).fillColor('#64748B').font('Helvetica').text(`  —  ${cat.amount} ${trip.currency || 'USD'} (${cat.percent}%)`);

      const barY = doc.y + 2;
      doc.rect(50, barY, barWidth, 8).fill(cat.color || '#3B82F6');
      doc.rect(50, barY, doc.page.width - 150, 8).stroke('#E2E8F0');
      doc.moveDown(1.2);
    }
  }

  _sectionHeader(doc, title) {
    doc.rect(40, doc.y - 5, doc.page.width - 80, 34).fill('#F1F5F9');
    doc.fontSize(15).fillColor('#0F172A').font('Helvetica-Bold')
      .text(title, 50, doc.y + 2);
    doc.moveDown(1.2);
  }

  _drawFooter(doc) {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor('#94A3B8').font('Helvetica')
        .text(
          `Generated by Voyage Genie — voyagegenie.app  |  Page ${i + 1} of ${range.count}`,
          50, doc.page.height - 40,
          { align: 'center', width: doc.page.width - 100 }
        );
    }
  }

  _fmt(dateStr) {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

export default new PDFExportService();
