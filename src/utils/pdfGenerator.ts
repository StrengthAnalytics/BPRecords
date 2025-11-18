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

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${region} ${gender === 'M' ? 'Men' : 'Women'}'s Records`, 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  let yPosition = 35;

  validWeightClasses.forEach((weightClass) => {
    const ageCategories = getAgeCategoriesForWeightClass(weightClass, gender);
    const records = organizedRecords[weightClass];

    if (!records) return;

    // Check if we need a new page
    const tableHeight = 50 + (LIFT_ORDER.length * 20);
    if (yPosition + tableHeight > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPosition = 20;
    }

    // Weight class header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${weightClass}`, 14, yPosition);
    yPosition += 8;

    // Create table data
    const tableData = LIFT_ORDER.map(lift => {
      const row = [LIFT_LABELS[lift]];
      ageCategories.forEach(ageCategory => {
        const cell = records[lift][ageCategory];
        row.push(formatCell(cell));
      });
      return row;
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Lift', ...ageCategories]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
        valign: 'middle',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 35 },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        yPosition = data.cursor!.y + 10;
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

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${region} ${gender === 'M' ? 'Men' : 'Women'}'s Records`, 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  let yPosition = 35;

  validWeightClasses.forEach((weightClass) => {
    const ageCategories = getAgeCategoriesForWeightClass(weightClass, gender);
    const records = organizedRecords[weightClass];

    if (!records) return;

    // Check if we need a new page
    const tableHeight = 50 + (LIFT_ORDER.length * 15);
    if (yPosition + tableHeight > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPosition = 20;
    }

    // Weight class header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${weightClass}`, 14, yPosition);
    yPosition += 8;

    // Create table data
    const tableData = LIFT_ORDER.map(lift => {
      const row = [LIFT_LABELS[lift]];
      ageCategories.forEach(ageCategory => {
        const cell = records[lift][ageCategory];
        row.push(formatCell(cell));
      });
      return row;
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Lift', ...ageCategories]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        valign: 'middle',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        yPosition = data.cursor!.y + 10;
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
