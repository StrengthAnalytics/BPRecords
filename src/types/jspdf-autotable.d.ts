declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    columnStyles?: { [key: number]: any };
    margin?: { top?: number; right?: number; bottom?: number; left?: number } | number;
    didDrawPage?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    [key: string]: any;
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
