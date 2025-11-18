# Scripts Directory

This directory contains build and automation scripts for the British Powerlifting Records application.

## build-records.cjs

Node.js script that generates the TypeScript records file from JSON source data.

### Purpose

Converts JSON files from `data-source/` into a single TypeScript file at `src/data/records.ts` that can be imported by the application.

### Usage

```bash
npm run build:data
```

Or run directly:
```bash
node scripts/build-records.cjs
```

### What It Does

1. **Reads JSON Files** - Scans `data-source/` directory for all `.json` files
2. **Validates Data** - Checks all records for:
   - Required fields (region, name, weightClass, gender, lift, ageCategory, record, dateSet, equipment)
   - Valid gender values (M or F)
   - Valid lift types (squat, bench_press, bench_press_ac, deadlift, total)
   - Valid equipment types (equipped or unequipped)
   - Proper date format (YYYY-MM-DD)
   - Numeric record values
3. **Combines Records** - Merges all region files into a single array
4. **Generates TypeScript** - Creates `src/data/records.ts` with:
   - Proper type imports
   - Auto-generated timestamp
   - Warning not to edit manually
   - Formatted record data
5. **Displays Summary** - Shows statistics:
   - Total records
   - Unique regions and athletes
   - Gender breakdown
   - Equipment breakdown

### Output Example

```
╔════════════════════════════════════════════════════════════╗
║     British Powerlifting Records - Data Build Script      ║
╚════════════════════════════════════════════════════════════╝

============================================================
  Reading JSON Files
============================================================
  Found 4 JSON file(s):

✓ british.json                 → 401 record(s)
✓ england.json                 → 358 record(s)
✓ scotland.json                → 245 record(s)
✓ wales.json                   → 189 record(s)

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
  Total Records:        1193
  Unique Regions:       4
  Unique Athletes:      687
  Male Records:         756
  Female Records:       437
  Equipped:             598
  Unequipped:           595

============================================================
✓ Build completed successfully!
============================================================
```

### Error Handling

The script will exit with an error if:
- JSON files are malformed
- Required fields are missing
- Invalid values are found (wrong gender, equipment, etc.)
- Record values are not numbers

Warnings (non-fatal):
- Unusual lift types
- Dates not in YYYY-MM-DD format

### Color-Coded Output

- **Green (✓)**: Success messages
- **Yellow (⚠)**: Warnings
- **Red (✗)**: Errors
- **Blue**: Informational messages
- **Cyan**: Section headers

## Workflow Integration

This script is part of the data management workflow:

1. Export data from Google Sheets as CSV
2. Convert CSV to JSON using `csv-to-json-converter.html`
3. Place JSON files in `data-source/`
4. Run `npm run build:data` (this script)
5. Commit both JSON and generated TypeScript files

For detailed workflow, see [DATA-MANAGEMENT.md](../DATA-MANAGEMENT.md) and [data-source/README.md](../data-source/README.md).

## File Structure

```
scripts/
└── build-records.cjs    # Main build script (Node.js CommonJS)
```

## Requirements

- Node.js (any modern version)
- No external dependencies (uses only Node.js built-ins: `fs`, `path`)

## Notes

- The script is executable (`chmod +x`) and includes a shebang for direct execution
- Uses ANSI color codes for terminal output
- Automatically creates output directory if it doesn't exist
- The generated file includes a timestamp and warning header
