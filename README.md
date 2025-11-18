# British Powerlifting Records Hub

A modern, installable Progressive Web App (PWA) for searching and exploring powerlifting records across the UK. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Progressive Web App**: Install on mobile or desktop for offline access and app-like experience
- **Advanced Filtering**: Search records by name, region, weight class, lift type, age category, equipment, and gender
- **Multiple Sort Options**: Sort records by weight, date, or name
- **PDF Export**: Generate professional competition-ready PDFs with customizable region, gender, and orientation
- **CSV to JSON Converter**: Standalone tool for converting Google Sheets exports to JSON with validation and date format handling
- **JSON Import**: Import powerlifting records from JSON files
- **Dark Mode**: Full dark mode support with toggle
- **Offline Support**: Service worker caches app resources for offline functionality
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Local Storage**: Records persist in browser localStorage
- **Clean UI**: Modern, athletic interface with skeleton loading states

## Tech Stack

- **React 19.2+** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling with **vite-plugin-pwa** for PWA support
- **Service Worker** for offline caching and app updates
- **jsPDF** with jspdf-autotable for PDF generation
- **LocalStorage** for data persistence
- **Web Manifest** with custom powerlifting-themed icon

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view in the browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Progressive Web App (PWA)

This application is a fully-featured Progressive Web App that can be installed on your device:

### PWA Features
- **Installable**: Add to home screen on mobile devices or install as a desktop app
- **Offline Support**: Service worker caches app resources for offline access
- **App-like Experience**: Runs in standalone mode without browser UI
- **Auto-updates**: Automatically checks for and prompts to install updates
- **Custom Icon**: Powerlifting-themed icon with British colors (red, white, blue)

### Installation Instructions

**On Mobile (Android/iOS):**
1. Open the app in your browser
2. Look for "Add to Home Screen" or "Install App" prompt
3. Follow the prompts to install

**On Desktop (Chrome/Edge):**
1. Look for the install icon in the address bar
2. Click "Install" to add as a desktop app

### Generating PWA Icons

The app includes an SVG icon at `/public/icon.svg`. To generate PNG icons at various sizes:

1. Run the development server: `npm run dev`
2. Open `http://localhost:5173/generate-icons.html`
3. Click "Generate All Icons"
4. Download each icon size and save to the `/public` folder with these names:
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - `icon-144x144.png`
   - `icon-152x152.png`
   - `icon-192x192.png`
   - `icon-384x384.png`
   - `icon-512x512.png`
   - `icon-maskable-192x192.png` (same as icon-192x192.png)
   - `icon-maskable-512x512.png` (same as icon-512x512.png)

Alternatively, use any SVG to PNG converter tool with the `/public/icon.svg` file.

## Usage

### Importing Records

1. Click "Choose JSON File" in the Import Records section
2. Select a JSON file with the correct format (see below)
3. Records will be imported and saved to localStorage

### Filtering Records

Use the filter dropdowns and search box to narrow down results:
- **Lifter Name**: Text search (partial match, case-insensitive)
- **Region**: Filter by UK region
- **Weight Class**: Filter by weight category
- **Lift**: Filter by lift type (Squat, Bench Press, Deadlift, Total, etc.)
- **Age Category**: Filter by age group (Open, Junior, M1, M2, etc.)
- **Equipment**: Filter by equipped/unequipped
- **Gender**: Filter by Male/Female

### Sorting Results

Click the sort buttons to order records by:
- **Weight**: Highest to lowest (default)
- **Date**: Newest to oldest
- **Name**: Alphabetical order

### Exporting to PDF

Generate professional PDFs for competition displays:

1. Click the "Export PDF" button in the filter panel
2. Select the region, gender, and page orientation (portrait/landscape)
3. Review the export preview showing record count and weight classes
4. Click "Export PDF" to download the formatted PDF

**PDF Features:**
- Organized by weight class and lift type (Squat, Bench Press, Deadlift, Total, Bench Press A/C)
- Displays lifter name, weight, and date for each record
- Optimized layouts for both portrait and landscape orientations
- Youth weight classes (53kg male, 43kg female) use compact formatting

### CSV to JSON Converter

Two ways to convert CSV data to JSON:

**Method 1: Standalone Tool (Recommended)**
1. Open `csv-to-json-converter.html` in your browser
2. Upload your CSV export from Google Sheets
3. Review validation warnings and date conversions
4. Download JSON files organized by region

**Method 2: Hidden In-App Tool**
- Type `JSON` in the "Search by Lifter Name" field to activate the converter
- This is a quick-access feature for administrators

**Converter Features:**
- Automatic date format standardization (converts to YYYY-MM-DD)
- Validation for all required fields with specific row numbers
- Warnings for suspicious dates (future dates, invalid months/days)
- Real-time preview of conversions
- Exports separate JSON files per region

For detailed data management workflows, see [DATA-MANAGEMENT.md](./DATA-MANAGEMENT.md)

## JSON Data Format

Records should be imported as an array of objects with the following structure:

```json
[
  {
    "region": "England",
    "name": "John Smith",
    "weightClass": "83kg",
    "gender": "M",
    "lift": "squat",
    "ageCategory": "Open",
    "record": 280.5,
    "dateSet": "2024-01-15",
    "equipment": "unequipped"
  }
]
```

### Field Specifications

- **region**: String - UK region (e.g., "England", "Scotland", "Wales", "Northern Ireland", or specific regions)
- **name**: String - Lifter's full name
- **weightClass**: String - Weight category (e.g., "59kg", "66kg", "74kg", "83kg", "93kg", "105kg", "120kg", "120+kg")
- **gender**: "M" | "F" - Gender
- **lift**: "squat" | "bench_press" | "bench_press_ac" | "deadlift" | "total"
- **ageCategory**: String - Age category (e.g., "Open", "Junior", "Sub-Junior", "M1", "M2", "M3", "M4")
- **record**: Number - Weight in kg
- **dateSet**: String - Date in ISO format (YYYY-MM-DD)
- **equipment**: "equipped" | "unequipped"

## Sample Data

A sample data file is provided at `sample-records.json` with 10 example records for testing.

## Project Structure

```
BPRecords/
├── csv-to-json-converter.html   # Standalone CSV converter tool
├── generate-icons.html          # PWA icon generator utility
├── data-source/                  # Source JSON files organized by region
│   ├── README.md                # Data source documentation
│   ├── british.json
│   ├── england.json
│   ├── scotland.json
│   └── wales.json
├── public/                      # Static assets
│   ├── icon.svg                 # Custom powerlifting-themed PWA icon
│   ├── manifest.json            # PWA manifest file
│   └── sw.js                    # Service worker for offline support
├── scripts/
│   └── build-records.cjs        # Converts JSON files to TypeScript
├── src/
│   ├── components/              # React components
│   │   ├── RecordsHub.tsx          # Main container
│   │   ├── FilterPanel.tsx         # Search/filter controls
│   │   ├── RecordCard.tsx          # Individual record display
│   │   ├── ResultsDisplay.tsx      # Grid of records
│   │   ├── RecordsImport.tsx       # JSON import functionality
│   │   ├── PDFExportModal.tsx      # PDF export dialog
│   │   ├── CSVConverterModal.tsx   # Hidden in-app CSV converter
│   │   ├── RecordsIcon.tsx         # Navigation icon
│   │   ├── Section.tsx             # Reusable section wrapper
│   │   └── IconButton.tsx          # Reusable button component
│   ├── hooks/                   # Custom React hooks
│   │   ├── useRecordsData.ts       # Data loading/importing
│   │   └── useRecordsFilter.ts     # Filter state management
│   ├── utils/                   # Utility functions
│   │   ├── recordsStorage.ts       # localStorage operations
│   │   ├── recordsFilters.ts       # Filter/search logic
│   │   ├── recordsFormatters.ts    # Date formatting, unit display
│   │   └── pdfGenerator.ts         # PDF generation logic
│   ├── types/                   # TypeScript type definitions
│   │   └── records.ts              # All interfaces and constants
│   ├── data/
│   │   └── records.ts              # Auto-generated from data-source/
│   ├── App.tsx                  # Root component with dark mode
│   └── main.tsx                 # Application entry point with SW registration
├── DATA-MANAGEMENT.md           # Comprehensive data management guide
├── README.md                    # This file
├── vite.config.ts               # Vite config with PWA plugin
└── package.json
```

## Data Management

For administrators who need to update records:

- **Quick Start**: See [DATA-MANAGEMENT.md](./DATA-MANAGEMENT.md) for the complete workflow
- **Data Source**: Records are stored as JSON files in `data-source/` directory
- **Build Process**: Run `npm run build:data` to convert JSON files to TypeScript
- **CSV Converter**: Use `csv-to-json-converter.html` for Google Sheets exports

See also: [data-source/README.md](./data-source/README.md) for detailed update instructions.

## Responsive Breakpoints

- **Mobile**: < 640px - Single column layout
- **Tablet**: 640px+ - Two column layout
- **Desktop**: 1024px+ - Three column layout

## Dark Mode

Toggle between light and dark modes using the button in the top-right corner. Your preference is saved to localStorage.

## Browser Support

Works in all modern browsers that support:
- ES2015+
- CSS Grid
- LocalStorage API
- Fetch API
- Service Workers (for PWA functionality)
- Web App Manifest (for PWA installation)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
