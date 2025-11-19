import html2canvas from 'html2canvas';
import type { PowerliftingRecord } from '../types/records';

/**
 * Generate and share/download a record image
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

    // Try native share (mobile/modern browsers)
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: 'image/png' });

      const canShareFiles = navigator.canShare({ files: [file] });

      if (canShareFiles) {
        try {
          await navigator.share({
            files: [file],
            title: `${record.name} - ${record.record}kg Record`,
            text: `${record.name} set a ${record.record}kg ${record.lift} record!`
          });
          return;
        } catch (err: any) {
          // User cancelled share or share failed
          if (err.name === 'AbortError') {
            return; // User cancelled, silently exit
          }
          console.error('Share failed:', err);
          // Fall through to download
        }
      }
    }

    // Fallback: Download image
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
