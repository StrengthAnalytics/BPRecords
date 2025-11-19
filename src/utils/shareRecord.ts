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
    // Wait a moment for fonts and layout to fully render
    await new Promise(resolve => setTimeout(resolve, 200));

    // Generate canvas from the share card
    const canvas = await html2canvas(shareCardElement, {
      scale: 2, // High quality for retina displays
      backgroundColor: '#dc2626', // Match gradient fallback
      width: 1080,
      height: 1920,
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false
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

    // Try to use Web Share API first (better for mobile)
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: 'image/png' });

      try {
        // Check if we can share files
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${record.name} - ${record.record}kg Record`,
            text: `Check out this ${record.record}kg ${liftName} record by ${record.name}!`
          });
          return; // Successfully shared via native share sheet
        }
      } catch (err: any) {
        // User cancelled or share failed
        if (err.name === 'AbortError') {
          return; // User cancelled, exit silently
        }
        console.log('Share API failed, falling back to download');
        // Fall through to download
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
