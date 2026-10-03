const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 30, bottom: 30, left: 30, right: 30 }
});

doc.pipe(fs.createWriteStream('Super_TET_Syllabus_2026_Detailed.pdf'));

const currentPageWidth = doc.page.width;
const currentPageHeight = doc.page.height;
const margin = 35;
const contentWidth = currentPageWidth - (margin * 2);

function addCustomPageBorder() {
  doc.rect(12, 12, currentPageWidth - 24, currentPageHeight - 24).strokeColor('#2b6cb0').lineWidth(1.5).stroke();
  doc.rect(16, 16, currentPageWidth - 32, currentPageHeight - 32).strokeColor('#4299e1').lineWidth(0.5).stroke();
}

addCustomPageBorder();

doc.on('pageAdded', () => {
  addCustomPageBorder();
  doc.y = 45; // Start a bit lower on the second page
});

// --- Header ---
doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a365d').text('SUPER TET 2026 SYLLABUS', { align: 'center' });
doc.fontSize(14).font('Helvetica-Bold').fillColor('#2d3748').text('Assistant Teacher (Primary Level, Classes 1–5)', { align: 'center' });
doc.moveDown(0.3);
doc.moveTo(margin, doc.y).lineTo(currentPageWidth - margin, doc.y).strokeColor('#cbd5e0').lineWidth(1).stroke();
doc.moveDown(0.3);

// --- Exam Structure Box ---
const structureTop = doc.y;
// Height is pre-calculated for these 4 lines
doc.rect(margin, structureTop, contentWidth, 90).fillAndStroke('#ebf8ff', '#90cdf4');

doc.fillColor('#2c5282').fontSize(14).font('Helvetica-Bold').text('Exam Structure Overview', margin + 12, structureTop + 10);

const structureDetails = [
  '• Exam Mode: Offline (OMR-based Multiple Choice Questions)',
  '• Total Questions & Marks: 120 Questions | 360 Marks (3 marks per question)',
  '• Negative Marking: 1 mark deduction for every incorrect answer',
  '• Difficulty Level: Up to Class 12 / D.El.Ed standard'
];

doc.fontSize(11).font('Helvetica').fillColor('#2d3748');
let currentY = structureTop + 30;
structureDetails.forEach(line => {
  doc.text(line, margin + 18, currentY);
  currentY += 14;
});

doc.y = structureTop + 100;

// --- Subjects Breakdown Title ---
doc.fontSize(16).font('Helvetica-Bold').fillColor('#1a365d').text('Subject-Wise Detailed Curriculum', margin, doc.y);
doc.moveDown(0.3);

const subjects = [
  {
    title: '1. Language (Hindi, Sanskrit, and English) - 40 Marks',
    details: [
      '• Grammar: Parts of speech, tenses, active/passive voice, direct/indirect speech.',
      '• Vocabulary: Synonyms, antonyms, idioms, phrases, one-word substitution.',
      '• Comprehension: Unseen passages, poetry extracts, and related questions.',
      '• Literature Basics: Famous authors and their significant works.'
    ]
  },
  {
    title: '2. Mathematics - 20 Marks',
    details: [
      '• Arithmetic: Number system, decimals, fractions, simplification, HCF & LCM.',
      '• Commercial Math: Percentage, profit/loss, simple/compound interest.',
      '• Algebra & Geometry: Basic algebraic identities, lines & angles, triangles.',
      '• Mensuration & Statistics: Area, volume, mean, median, mode.'
    ]
  },
  {
    title: '3. Science - 10 Marks',
    details: [
      '• Physics: States of matter, force, motion, energy, light, sound, electricity.',
      '• Chemistry: Acids, bases, salts, metals & non-metals, daily life chemistry.',
      '• Biology: Human body systems, health, diseases, plant & animal life.',
      '• Environment: Natural resources, environmental protection, pollution.'
    ]
  },
  {
    title: '4. Environment & Social Studies - 10 Marks',
    details: [
      '• Geography: Earth structure, rivers, mountains, continents, oceans.',
      '• History: Indian freedom struggle, ancient & medieval Indian history.',
      '• Polity & Economy: Indian Constitution, democracy, basic economics.',
      '• Management: Disaster management, environmental sustainability.'
    ]
  },
  {
    title: '5. Teaching Skills - 10 Marks',
    details: [
      '• Methodologies: Teaching methods, principles of teaching, learning processes.',
      '• Classroom: Current Indian society & elementary education, inclusion.',
      '• Evaluation: Educational evaluation, measurement techniques, assessment.',
      '• Innovations: New initiatives in elementary education, administration.'
    ]
  },
  {
    title: '6. Child Psychology - 10 Marks',
    details: [
      '• Development: Factors affecting child development, physical & cognitive growth.',
      '• Learning: Learning theories, identification of learning needs, special ed.',
      '• Environment: Creating environments conducive to reading and learning.',
      '• Guidance: Counseling, role of teacher as a facilitator and guide.'
    ]
  },
  {
    title: '7. General Knowledge & Current Affairs - 30 Marks',
    details: [
      '• Current Events: Significant national and international events.',
      '• Personalities & Places: Important persons, places, recent appointments.',
      '• Culture: Indian art, culture, important dates, sports, awards.',
      '• Misc: Books & authors, state/national symbols.'
    ]
  },
  {
    title: '8. Logical Knowledge (Reasoning) - 5 Marks',
    details: [
      '• Verbal: Analogies, classification, coding-decoding, number series.',
      '• Non-Verbal: Puzzles, direction sense, clocks & calendars, syllogism.',
      '• Analytical: Critical reasoning, statement & arguments, data sufficiency.'
    ]
  },
  {
    title: '9. Information Technology (Computer) - 5 Marks',
    details: [
      '• Basics: Fundamentals of computers, hardware, software, operating systems.',
      '• Internet & Web: Use of internet, email, basic network concepts.',
      '• Education Tech: Digital teaching aids, OER, smart classrooms.',
      '• Applications: Useful applications in teaching and school management.'
    ]
  },
  {
    title: '10. Life Skills, Management & Attitude - 10 Marks',
    details: [
      '• Professional Conduct: Professional ethics, policies, moral values.',
      '• Motivation: Role of motivation in learning, positive reinforcement.',
      '• Teacher Roles: Facilitator, monitor, leader, mentor, rights/duties.',
      '• Discipline: Penalties and punishments, effective school management.'
    ]
  }
];

// Styling configuration for maximum readability
const titleFontSize = 13;
const detailsFontSize = 11;
const padding = 10;
const textIndent = 8;
const detailOptions = { width: contentWidth - (padding * 2) - textIndent };

// First loop to pre-calculate heights for dynamic spacing
const boxHeights = subjects.map(subject => {
  doc.fontSize(titleFontSize).font('Helvetica-Bold');
  const titleH = doc.heightOfString(subject.title, { width: contentWidth - (padding * 2) });
  
  doc.fontSize(detailsFontSize).font('Helvetica');
  let detailsH = 0;
  subject.details.forEach(detail => {
    detailsH += doc.heightOfString(detail, detailOptions) + 4; // 4 is line gap
  });
  
  return padding + titleH + 5 + detailsH + padding; // 5 is gap between title and details
});

// Calculate gaps
// Page 1 has 5 boxes. Page 1 remaining space: 
const page1ContentStart = doc.y;
const page1Available = currentPageHeight - page1ContentStart - 40; // 40 bottom margin
const page1BoxesHeight = boxHeights.slice(0, 5).reduce((a, b) => a + b, 0);
const gap1 = (page1Available - page1BoxesHeight) / 4; 

// Page 2 has 5 boxes + footer
const page2ContentStart = 45;
const footerHeight = 40;
const page2Available = currentPageHeight - page2ContentStart - footerHeight - 40; 
const page2BoxesHeight = boxHeights.slice(5, 10).reduce((a, b) => a + b, 0);
const gap2 = (page2Available - page2BoxesHeight) / 4;

subjects.forEach((subject, index) => {
  if (index === 5) {
    doc.addPage();
  }

  const boxHeight = boxHeights[index];
  const boxTop = doc.y;

  // Draw Box
  doc.rect(margin, boxTop, contentWidth, boxHeight).fillAndStroke('#f7fafc', '#a0aec0');

  // Draw Title
  doc.fillColor('#2b6cb0').fontSize(titleFontSize).font('Helvetica-Bold').text(subject.title, margin + padding, boxTop + padding);

  // Draw Details
  doc.fillColor('#2d3748').fontSize(detailsFontSize).font('Helvetica');
  let textY = doc.y + 5;
  
  subject.details.forEach(detail => {
    doc.text(detail, margin + padding + textIndent, textY, detailOptions);
    textY = doc.y + 4; // Add gap between lines
  });

  // Advance to next box
  const gap = index < 5 ? gap1 : gap2;
  doc.y = boxTop + boxHeight + gap;
});

// --- Footer Note ---
doc.moveTo(margin, doc.y).lineTo(currentPageWidth - margin, doc.y).strokeColor('#cbd5e0').lineWidth(1).stroke();
doc.moveDown(0.5);
doc.fontSize(9).font('Helvetica-Oblique').fillColor('#718096').text(
  'Note: This document provides a structured overview based on historical patterns and recent announcements. Always verify with the official UPESSC notification.',
  margin, doc.y, { align: 'center', width: contentWidth }
);

doc.end();
