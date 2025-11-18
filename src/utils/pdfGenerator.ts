import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PowerliftingRecord } from '../types/records';
import { WEIGHT_CLASSES_MALE, WEIGHT_CLASSES_FEMALE, AGE_CATEGORIES } from '../types/records';

interface RecordCell {
  name: string;
  weight: number;
  date: string;
}

interface RecordsByWeightAndLift {
  [weightClass: string]: {
    squat: { [ageCategory: string]: RecordCell | null };
    bench_press: { [ageCategory: string]: RecordCell | null };
    deadlift: { [ageCategory: string]: RecordCell | null };
    total: { [ageCategory: string]: RecordCell | null };
    bench_press_ac: { [ageCategory: string]: RecordCell | null };
  };
}

const LIFT_LABELS = {
  squat: 'Squat',
  bench_press: 'Bench Press',
  deadlift: 'Deadlift',
  total: 'Total',
  bench_press_ac: 'Bench Press (A/C)',
};

const LIFT_ORDER: Array<keyof typeof LIFT_LABELS> = [
  'squat',
  'bench_press',
  'deadlift',
  'total',
  'bench_press_ac',
];

// Determine which age categories apply to a weight class
function getAgeCategoriesForWeightClass(weightClass: string, gender: 'M' | 'F'): string[] {
  const youthWeightClasses = gender === 'M' ? ['53kg'] : ['43kg'];
  const isYouthOnly = youthWeightClasses.includes(weightClass);

  if (isYouthOnly) {
    return ['U16', 'U18', 'U23'];
  }

  return AGE_CATEGORIES.filter(cat => cat !== 'All');
}

// Organize records by weight class and lift type
function organizeRecords(
  records: PowerliftingRecord[],
  region: string,
  gender: 'M' | 'F'
): RecordsByWeightAndLift {
  const weightClasses = gender === 'M' ? WEIGHT_CLASSES_MALE : WEIGHT_CLASSES_FEMALE;
  const organized: RecordsByWeightAndLift = {};

  // Initialize structure
  weightClasses.filter(wc => wc !== 'All').forEach(weightClass => {
    organized[weightClass] = {
      squat: {},
      bench_press: {},
      deadlift: {},
      total: {},
      bench_press_ac: {},
    };
  });

  // Fill in records
  records
    .filter(r => r.region === region && r.gender === gender)
    .forEach(record => {
      const { weightClass, lift, ageCategory, name, record: weight, dateSet } = record;

      if (organized[weightClass] && organized[weightClass][lift]) {
        organized[weightClass][lift][ageCategory] = {
          name,
          weight,
          date: dateSet,
        };
      }
    });

  return organized;
}

// Format date for display
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year.slice(2)}`;
}

// Format cell content
function formatCell(cell: RecordCell | null): string {
  if (!cell) return '-';
  return `${cell.name}\n${cell.weight}kg\n${formatDate(cell.date)}`;
}

// Generate PDF for portrait orientation
function generatePortraitPDF(
  doc: jsPDF,
  organizedRecords: RecordsByWeightAndLift,
  region: string,
  gender: 'M' | 'F'
) {
  const weightClasses = gender === 'M' ? WEIGHT_CLASSES_MALE : WEIGHT_CLASSES_FEMALE;
  const validWeightClasses = weightClasses.filter(wc => wc !== 'All');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${region} ${gender === 'M' ? 'Men' : 'Women'}'s Records`, 14, 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

  let yPosition = 28;

  validWeightClasses.forEach((weightClass) => {
    const ageCategories = getAgeCategoriesForWeightClass(weightClass, gender);
    const records = organizedRecords[weightClass];

    if (!records) return;

    // Check if we need a new page - more aggressive spacing
    const tableHeight = 35 + (LIFT_ORDER.length * 12);
    if (yPosition + tableHeight > doc.internal.pageSize.height - 15) {
      doc.addPage();
      yPosition = 15;
    }

    // Create table data
    const tableData = LIFT_ORDER.map(lift => {
      const row = [LIFT_LABELS[lift]];
      ageCategories.forEach(ageCategory => {
        const cell = records[lift][ageCategory];
        row.push(formatCell(cell));
      });
      return row;
    });

    // Include weight class in the header row
    autoTable(doc, {
      startY: yPosition,
      head: [[`${weightClass}`, ...ageCategories]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        cellPadding: 1.5,
      },
      bodyStyles: {
        fontSize: 5.5,
        cellPadding: 1,
        valign: 'middle',
        halign: 'center',
        lineWidth: 0.1,
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          fontSize: 8,
          cellWidth: 28,
          halign: 'center',
        },
      },
      margin: { left: 10, right: 10 },
      tableLineWidth: 0.1,
      didDrawPage: (data) => {
        yPosition = data.cursor!.y + 3;
      },
    });
  });
}

// Generate PDF for landscape orientation
function generateLandscapePDF(
  doc: jsPDF,
  organizedRecords: RecordsByWeightAndLift,
  region: string,
  gender: 'M' | 'F'
) {
  const weightClasses = gender === 'M' ? WEIGHT_CLASSES_MALE : WEIGHT_CLASSES_FEMALE;
  const validWeightClasses = weightClasses.filter(wc => wc !== 'All');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${region} ${gender === 'M' ? 'Men' : 'Women'}'s Records`, 14, 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

  let yPosition = 28;

  validWeightClasses.forEach((weightClass) => {
    const ageCategories = getAgeCategoriesForWeightClass(weightClass, gender);
    const records = organizedRecords[weightClass];

    if (!records) return;

    // Check if we need a new page - more aggressive spacing
    const tableHeight = 30 + (LIFT_ORDER.length * 10);
    if (yPosition + tableHeight > doc.internal.pageSize.height - 15) {
      doc.addPage();
      yPosition = 15;
    }

    // Create table data
    const tableData = LIFT_ORDER.map(lift => {
      const row = [LIFT_LABELS[lift]];
      ageCategories.forEach(ageCategory => {
        const cell = records[lift][ageCategory];
        row.push(formatCell(cell));
      });
      return row;
    });

    // Include weight class in the header row
    autoTable(doc, {
      startY: yPosition,
      head: [[`${weightClass}`, ...ageCategories]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        cellPadding: 1.5,
      },
      bodyStyles: {
        fontSize: 6,
        cellPadding: 1.2,
        valign: 'middle',
        halign: 'center',
        lineWidth: 0.1,
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          fontSize: 9,
          cellWidth: 30,
          halign: 'center',
        },
      },
      margin: { left: 10, right: 10 },
      tableLineWidth: 0.1,
      didDrawPage: (data) => {
        yPosition = data.cursor!.y + 3;
      },
    });
  });
}

// Main export function
export async function generateRecordsPDF(
  allRecords: PowerliftingRecord[],
  region: string,
  gender: 'M' | 'F',
  orientation: 'portrait' | 'landscape'
): Promise<void> {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  const organizedRecords = organizeRecords(allRecords, region, gender);

  if (orientation === 'portrait') {
    generatePortraitPDF(doc, organizedRecords, region, gender);
  } else {
    generateLandscapePDF(doc, organizedRecords, region, gender);
  }

  // Generate filename
  const genderLabel = gender === 'M' ? 'Men' : 'Women';
  const filename = `${region}_${genderLabel}_Records_${orientation}.pdf`;

  doc.save(filename);
}
