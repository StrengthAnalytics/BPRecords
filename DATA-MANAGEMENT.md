# Data Management Guide

This guide explains how to update the British Powerlifting records database.

## Overview

The records are stored in JSON files (organized by region) and automatically converted to TypeScript for the application. You have two tools available:

1. **Standalone CSV Converter** (`csv-to-json-converter.html`) - Use in your browser
2. **Built-in Converter** - Hidden in the app itself (type "JSON" in the name search field)

## Quick Start: Updating Records

### Method 1: Using the Standalone Tool (Recommended)

1. **Export from Google Sheets**
   - File → Download → Comma Separated Values (.csv)

2. **Convert to JSON**
   - Open `csv-to-json-converter.html` in your browser
   - Upload the CSV file
   - Download the region JSON files you need

3. **Update Data Files**
   - Place downloaded JSON files in `data-source/` directory
   - Only replace the regions you're updating

4. **Build TypeScript Files**
   ```bash
   npm run build:data
   ```

5. **Commit Changes**
   ```bash
   git add data-source/ src/data/records.ts
   git commit -m "Update [region] records"
   git push
   ```

### Method 2: Using the Hidden In-App Tool

1. **Access the Tool**
   - Open the application
   - Type `JSON` in the "Search by Lifter Name" field
   - The converter modal will appear

2. **Follow the same conversion process** as Method 1

## File Structure

```
BPRecords/
├── csv-to-json-converter.html   # Standalone conversion tool
├── data-source/                  # Source JSON files (region-based)
│   ├── england.json
│   ├── scotland.json
│   ├── wales.json
│   └── ... (one file per region)
├── src/data/
│   └── records.ts               # Auto-generated (DO NOT EDIT MANUALLY)
└── scripts/
    └── build-records.cjs        # Build script
```

## Data Format Requirements

### CSV Format (Google Sheets Export)

Your Google Sheets must have these columns:

| Column        | Required | Example               | Notes                           |
|---------------|----------|-----------------------|---------------------------------|
| Region        | Yes      | England               | Exact region name               |
| Name          | Yes      | John Smith            | Lifter's full name              |
| Weight Class  | Yes      | 83kg                  | Include 'kg' suffix             |
| Gender        | Yes      | M                     | M or F only                     |
| Lift          | Yes      | Squat                 | See valid lifts below           |
| Age Category  | Yes      | Open                  | See valid categories below      |
| Record        | Yes      | 280.5                 | Number only (kg)                |
| Date Set      | Yes      | 2024-01-15            | YYYY-MM-DD format               |
| Equipment     | Yes      | Unequipped            | Equipped or Unequipped          |

### Valid Values

**Lift Types:**
- `Squat` → converts to `squat`
- `Bench Press` → converts to `bench_press`
- `Bench Press A/C` → converts to `bench_press_ac`
- `Deadlift` → converts to `deadlift`
- `Total` → converts to `total`

**Equipment:**
- `Equipped`
- `Unequipped` (also accepts `Raw` or `Classic`)

**Gender:**
- `M` (Male)
- `F` (Female)

**Age Categories:**
- Sub-Junior
- Junior
- Open
- M1, M2, M3, M4

**Regions:**
The converter automatically detects regions from your data. Common regions:
- England, Scotland, Wales, Northern Ireland
- London, North West, Yorkshire, South East, East Midlands, West Midlands
- etc.

## The Build Process

When you run `npm run build:data`, the script:

1. Reads all `.json` files from `data-source/`
2. Validates the data (checks required fields, formats)
3. Combines all records into a single array
4. Generates `src/data/records.ts` with TypeScript formatting
5. Displays statistics (total records, regions, athletes, etc.)

### Build Script Output

```
╔════════════════════════════════════════════════════════════╗
║     British Powerlifting Records - Data Build Script      ║
╚════════════════════════════════════════════════════════════╝

============================================================
  Reading JSON Files
============================================================
  Found 3 JSON file(s):

✓ england.json                   → 245 record(s)
✓ scotland.json                  → 89 record(s)
✓ wales.json                     → 67 record(s)

============================================================
  Validating Records
============================================================
✓ All records validated successfully

============================================================
  Generating TypeScript File
============================================================
✓ Generated: src/data/records.ts

============================================================
  Summary
============================================================
  Total Records:        401
  Unique Regions:       3
  Unique Athletes:      287
  Male Records:         256
  Female Records:       145
  Equipped:             198
  Unequipped:           203

============================================================
✓ Build completed successfully!
============================================================
```

## Workflow for Partial Updates

You don't need to replace all regions at once. To update just one region:

1. Export only the region data from Google Sheets (or filter the CSV)
2. Convert to JSON using the tool
3. Replace only that region's JSON file in `data-source/`
4. Run `npm run build:data`
5. Commit only the changed files

Example:
```bash
# Updated only England records
git add data-source/england.json src/data/records.ts
git commit -m "Update England records - add new Open squat record"
git push
```

## Troubleshooting

### Build Script Errors

**"Missing or empty field 'X'"**
- Check that all required columns are present in your CSV
- Ensure no cells are empty

**"Invalid gender 'X' (must be M or F)"**
- Gender column must contain only 'M' or 'F'
- Check for typos or extra spaces

**"Date should be in YYYY-MM-DD format"**
- Dates must be formatted as YYYY-MM-DD
- Example: 2024-01-15 (not 15/01/2024)

**"Invalid equipment 'X'"**
- Must be either 'equipped' or 'unequipped'
- The converter accepts 'Raw' or 'Classic' as aliases for 'unequipped'

### CSV Upload Issues

**"JSON must be an array of records"**
- Make sure you're uploading a CSV file, not JSON
- Check that the file isn't corrupted

**"No records found in file"**
- The CSV might be empty or malformed
- Check that it has a header row and at least one data row

### Common Mistakes

1. **Editing `src/data/records.ts` directly**
   - This file is auto-generated and will be overwritten
   - Always edit the JSON files in `data-source/` instead

2. **Wrong date format**
   - Google Sheets may export dates in different formats
   - Always verify dates are YYYY-MM-DD before uploading

3. **Missing regions**
   - If you delete a region's JSON file, those records won't appear
   - Keep all region files, even if you're only updating one

## Testing Your Changes

After building, you can test locally:

```bash
npm run dev
```

Then verify:
- Records appear correctly in the app
- Filters work as expected
- No console errors
- All data is accurate

## Hidden In-App Converter

For quick access during development:

1. Type `JSON` in the name search field
2. The converter modal appears automatically
3. The name field is cleared immediately
4. This is a secret admin feature - not visible to regular users

## Backup Strategy

Before making major updates:

1. Commit your current data:
   ```bash
   git add data-source/
   git commit -m "Backup before update"
   ```

2. If something goes wrong, you can revert:
   ```bash
   git checkout data-source/
   ```

## Questions?

If you encounter issues:

1. Check the build script output for specific error messages
2. Verify your CSV matches the required format
3. Ensure all required fields are present
4. Check the `data-source/README.md` for additional details
