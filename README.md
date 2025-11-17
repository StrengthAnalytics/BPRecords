# British Powerlifting Records Hub

A modern, responsive web application for searching and exploring powerlifting records across the UK. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Advanced Filtering**: Search records by name, region, weight class, lift type, age category, equipment, and gender
- **Multiple Sort Options**: Sort records by weight, date, or name
- **JSON Import**: Import powerlifting records from JSON files
- **Dark Mode**: Full dark mode support with toggle
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Local Storage**: Records persist in browser localStorage
- **Clean UI**: Modern, athletic interface with skeleton loading states

## Tech Stack

- **React 18.2+** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **LocalStorage** for data persistence

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
src/
├── components/          # React components
│   ├── RecordsHub.tsx          # Main container
│   ├── FilterPanel.tsx         # Search/filter controls
│   ├── RecordCard.tsx          # Individual record display
│   ├── ResultsDisplay.tsx      # Grid of records
│   ├── RecordsImport.tsx       # JSON import functionality
│   ├── RecordsIcon.tsx         # Navigation icon
│   ├── Section.tsx             # Reusable section wrapper
│   └── IconButton.tsx          # Reusable button component
├── hooks/               # Custom React hooks
│   ├── useRecordsData.ts       # Data loading/importing
│   └── useRecordsFilter.ts     # Filter state management
├── utils/               # Utility functions
│   ├── recordsStorage.ts       # localStorage operations
│   ├── recordsFilters.ts       # Filter/search logic
│   └── recordsFormatters.ts    # Date formatting, unit display
├── types/               # TypeScript type definitions
│   └── records.ts              # All interfaces and constants
├── App.tsx              # Root component with dark mode
└── main.tsx             # Application entry point
```

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

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
