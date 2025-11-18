#!/usr/bin/env node

/**
 * Build script to generate TypeScript records file from JSON sources
 *
 * This script:
 * 1. Reads all JSON files from data-source/
 * 2. Validates the data
 * 3. Combines all records
 * 4. Generates src/data/records.ts with proper TypeScript formatting
 */

const fs = require('fs');
const path = require('path');

const DATA_SOURCE_DIR = path.join(__dirname, '../data-source');
const OUTPUT_FILE = path.join(__dirname, '../src/data/records.ts');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log(`${'='.repeat(60)}`, colors.cyan);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`  ${message}`, colors.blue);
}

/**
 * Read and parse all JSON files from the data-source directory
 */
function readJSONFiles() {
  logSection('Reading JSON Files');

  if (!fs.existsSync(DATA_SOURCE_DIR)) {
    logError(`Data source directory not found: ${DATA_SOURCE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DATA_SOURCE_DIR)
    .filter(file => file.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    logWarning('No JSON files found in data-source/');
    logInfo('The generated file will contain an empty records array.');
    return [];
  }

  logInfo(`Found ${files.length} JSON file(s):\n`);

  const allRecords = [];
  const regionStats = {};

  files.forEach(file => {
    const filePath = path.join(DATA_SOURCE_DIR, file);
    const regionName = path.basename(file, '.json');

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const records = JSON.parse(content);

      if (!Array.isArray(records)) {
        logError(`${file}: Must contain an array of records`);
        process.exit(1);
      }

      const recordCount = records.length;
      allRecords.push(...records);
      regionStats[regionName] = recordCount;

      logSuccess(`${file.padEnd(30)} → ${recordCount} record(s)`);

    } catch (error) {
      logError(`${file}: ${error.message}`);
      process.exit(1);
    }
  });

  log('', colors.reset);
  return allRecords;
}

/**
 * Validate record data
 */
function validateRecords(records) {
  logSection('Validating Records');

  const requiredFields = [
    'region', 'name', 'weightClass', 'gender',
    'lift', 'ageCategory', 'record', 'dateSet', 'equipment'
  ];

  const validGenders = ['M', 'F'];
  const validLifts = ['squat', 'bench_press', 'bench_press_ac', 'deadlift', 'total'];
  const validEquipment = ['equipped', 'unequipped'];

  const errors = [];
  const warnings = [];

  records.forEach((record, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (record[field] === undefined || record[field] === null || record[field] === '') {
        errors.push(`Record #${index + 1}: Missing or empty field '${field}'`);
      }
    });

    // Validate specific fields
    if (record.gender && !validGenders.includes(record.gender)) {
      errors.push(`Record #${index + 1}: Invalid gender '${record.gender}' (must be M or F)`);
    }

    if (record.lift && !validLifts.includes(record.lift)) {
      warnings.push(`Record #${index + 1}: Unusual lift type '${record.lift}'`);
    }

    if (record.equipment && !validEquipment.includes(record.equipment)) {
      errors.push(`Record #${index + 1}: Invalid equipment '${record.equipment}' (must be equipped or unequipped)`);
    }

    if (record.record !== undefined && (typeof record.record !== 'number' || isNaN(record.record))) {
      errors.push(`Record #${index + 1}: Invalid record value '${record.record}' (must be a number)`);
    }

    // Validate date format (YYYY-MM-DD)
    if (record.dateSet && !/^\d{4}-\d{2}-\d{2}$/.test(record.dateSet)) {
      warnings.push(`Record #${index + 1}: Date '${record.dateSet}' should be in YYYY-MM-DD format`);
    }
  });

  if (errors.length > 0) {
    logError(`Found ${errors.length} validation error(s):\n`);
    errors.forEach(err => logError(`  ${err}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    logWarning(`Found ${warnings.length} warning(s):\n`);
    warnings.forEach(warn => logWarning(`  ${warn}`));
    log('', colors.reset);
  } else {
    logSuccess('All records validated successfully');
  }

  return true;
}

/**
 * Generate TypeScript file content
 */
function generateTypeScriptFile(records) {
  logSection('Generating TypeScript File');

  const timestamp = new Date().toISOString();
  const recordsJSON = JSON.stringify(records, null, 2);

  // Format the JSON to match TypeScript code style
  const formattedRecords = recordsJSON
    .replace(/"([^"]+)":/g, '$1:')  // Remove quotes from keys
    .replace(/: "([^"]+)"/g, ': "$1"')  // Keep quotes on string values
    .split('\n')
    .map((line, index) => {
      if (index === 0) return line;  // Don't indent first line
      return '  ' + line;  // Indent all other lines
    })
    .join('\n');

  const content = `import type { PowerliftingRecord } from '../types/records';

/**
 * British Powerlifting Records Database
 *
 * This file is auto-generated by scripts/build-records.js
 * DO NOT EDIT MANUALLY - Your changes will be overwritten
 *
 * To update records:
 * 1. Edit JSON files in data-source/
 * 2. Run: npm run build:data
 *
 * Last generated: ${timestamp}
 */

export const records: PowerliftingRecord[] = ${formattedRecords};
`;

  return content;
}

/**
 * Write the generated content to file
 */
function writeOutputFile(content) {
  const outputDir = path.dirname(OUTPUT_FILE);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  logSuccess(`Generated: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

/**
 * Display summary statistics
 */
function displaySummary(records) {
  logSection('Summary');

  const uniqueRegions = new Set(records.map(r => r.region)).size;
  const uniqueAthletes = new Set(records.map(r => r.name)).size;
  const maleRecords = records.filter(r => r.gender === 'M').length;
  const femaleRecords = records.filter(r => r.gender === 'F').length;
  const equippedRecords = records.filter(r => r.equipment === 'equipped').length;
  const unequippedRecords = records.filter(r => r.equipment === 'unequipped').length;

  logInfo(`Total Records:        ${records.length}`);
  logInfo(`Unique Regions:       ${uniqueRegions}`);
  logInfo(`Unique Athletes:      ${uniqueAthletes}`);
  logInfo(`Male Records:         ${maleRecords}`);
  logInfo(`Female Records:       ${femaleRecords}`);
  logInfo(`Equipped:             ${equippedRecords}`);
  logInfo(`Unequipped:           ${unequippedRecords}`);

  log('\n' + '='.repeat(60), colors.cyan);
  logSuccess('Build completed successfully!');
  log('='.repeat(60) + '\n', colors.cyan);
}

/**
 * Main execution
 */
function main() {
  try {
    log('\n' + colors.bright + colors.blue +
        '╔════════════════════════════════════════════════════════════╗\n' +
        '║     British Powerlifting Records - Data Build Script      ║\n' +
        '╚════════════════════════════════════════════════════════════╝' +
        colors.reset);

    const records = readJSONFiles();
    validateRecords(records);
    const content = generateTypeScriptFile(records);
    writeOutputFile(content);
    displaySummary(records);

    process.exit(0);

  } catch (error) {
    logError(`\nUnexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
