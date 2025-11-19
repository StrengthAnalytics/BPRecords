import html2canvas from 'html2canvas';
import type { PowerliftingRecord } from '../types/records';

/**
 * Generate and download a record image
 */
export const shareRecordImage = async (
  shareCardElement: HTMLElement,
  record: PowerliftingRecord
): Promise<void> => {
  try {
    // Generate canvas from the share card
    const canvas = await html2canvas(shareCardElement, {
      scale: 2, // High quality for retina displays
      backgroundColor: '#dc2626', // Match gradient fallback
      width: 1080,
      height: 1920,
      logging: false,
      useCORS: true
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1.0);
    });

    if (!blob) {
      throw new Error('Failed to generate image');
    }

    // Create filename
    const liftName = record.lift.replace(/_/g, '-');
    const athleteName = record.name.replace(/\s+/g, '-').toLowerCase();
    const filename = `${athleteName}-${liftName}-${record.record}kg-record.png`;

    // Download image (works on both mobile and desktop)
    downloadImage(blob, filename);
  } catch (error) {
    console.error('Error generating share image:', error);
    throw error;
  }
};

/**
 * Download blob as file
 */
const downloadImage = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
