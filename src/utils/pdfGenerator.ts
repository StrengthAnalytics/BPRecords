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
  const youthWeightClass = gender === 'M' ? '53kg' : '43kg';

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${region} ${gender === 'M' ? 'Men' : 'Women'}'s Records`, 14, 15);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 21);

  let yPosition = 26;

  validWeightClasses.forEach((weightClass) => {
    const ageCategories = getAgeCategoriesForWeightClass(weightClass, gender);
    const records = organizedRecords[weightClass];
    const isYouthOnly = weightClass === youthWeightClass;

    if (!records) return;

    // Calculate table height - youth classes are smaller
    const tableHeight = isYouthOnly ? 22 : 38;
    if (yPosition + tableHeight > doc.internal.pageSize.height - 10) {
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
    const tableConfig: any = {
      startY: yPosition,
      head: [[`${weightClass}`, ...ageCategories]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontSize: isYouthOnly ? 6 : 6.5,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        cellPadding: isYouthOnly ? 1 : 1.2,
      },
      bodyStyles: {
        fontSize: isYouthOnly ? 4.5 : 5,
        cellPadding: isYouthOnly ? 0.6 : 0.8,
        valign: 'middle',
        halign: 'center',
        lineWidth: 0.1,
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          fontSize: isYouthOnly ? 6.5 : 7,
          cellWidth: isYouthOnly ? 22 : 24,
          halign: 'center',
        },
      },
      margin: { left: 10, right: 10 },
      tableLineWidth: 0.1,
      didDrawPage: (data: any) => {
        yPosition = data.cursor!.y + (isYouthOnly ? 2 : 2.5);
      },
    };

    // For youth-only classes, set fixed column widths to limit horizontal spread
    if (isYouthOnly) {
      tableConfig.columnStyles[1] = { cellWidth: 28 };
      tableConfig.columnStyles[2] = { cellWidth: 28 };
      tableConfig.columnStyles[3] = { cellWidth: 28 };
    }

    autoTable(doc, tableConfig);
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
  const youthWeightClass = gender === 'M' ? '53kg' : '43kg';

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${region} ${gender === 'M' ? 'Men' : 'Women'}'s Records`, 14, 15);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 21);

  let yPosition = 26;

  validWeightClasses.forEach((weightClass) => {
    const ageCategories = getAgeCategoriesForWeightClass(weightClass, gender);
    const records = organizedRecords[weightClass];
    const isYouthOnly = weightClass === youthWeightClass;

    if (!records) return;

    // Calculate table height - youth classes are smaller
    const tableHeight = isYouthOnly ? 18 : 32;
    if (yPosition + tableHeight > doc.internal.pageSize.height - 10) {
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
    const tableConfig: any = {
      startY: yPosition,
      head: [[`${weightClass}`, ...ageCategories]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontSize: isYouthOnly ? 6.5 : 7,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        cellPadding: isYouthOnly ? 1 : 1.2,
      },
      bodyStyles: {
        fontSize: isYouthOnly ? 5 : 5.5,
        cellPadding: isYouthOnly ? 0.8 : 1,
        valign: 'middle',
        halign: 'center',
        lineWidth: 0.1,
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          fontSize: isYouthOnly ? 7.5 : 8,
          cellWidth: isYouthOnly ? 24 : 26,
          halign: 'center',
        },
      },
      margin: { left: 10, right: 10 },
      tableLineWidth: 0.1,
      didDrawPage: (data: any) => {
        yPosition = data.cursor!.y + (isYouthOnly ? 2 : 2.5);
      },
    };

    // For youth-only classes, set fixed column widths to limit horizontal spread
    if (isYouthOnly) {
      tableConfig.columnStyles[1] = { cellWidth: 35 };
      tableConfig.columnStyles[2] = { cellWidth: 35 };
      tableConfig.columnStyles[3] = { cellWidth: 35 };
    }

    autoTable(doc, tableConfig);
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
