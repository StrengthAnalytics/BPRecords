# CLAUDE.MD - British Powerlifting Records Hub

> AI Assistant Reference Guide - Last Updated: 2025-12-01

## Project Overview

**British Powerlifting Records Hub** is a Progressive Web Application (PWA) for searching, browsing, and managing powerlifting records across the United Kingdom. Built with React 19 + TypeScript + Vite, it serves as a comprehensive database for the British IPF affiliate federation.

**Key Capabilities:**
- Search 1000+ powerlifting records across 13 UK regions
- Compare personal lifts against official records with visual feedback
- Export competition-ready PDFs for event displays
- Share record cards as images on social media
- Import/export record data via JSON
- Convert CSV data from Google Sheets to JSON
- Full offline support via PWA

**Target Users:** Powerlifters, coaches, competition organizers, federation officials

---

## Tech Stack

### Core
- **React 19.2.0** - UI library (latest stable with concurrent features)
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **Tailwind CSS 3.4.18** - Utility-first styling

### Key Libraries
- **@vercel/analytics** - Web analytics
- **jsPDF + jspdf-autotable** - PDF generation
- **html2canvas** - DOM to image conversion for sharing
- **vite-plugin-pwa** - Progressive Web App support

### Development
- ESLint + TypeScript ESLint
- Custom service worker for offline support
- Node.js build scripts (CommonJS)

---

## Project Structure

```
BPRecords/
├── src/
│   ├── components/          # 16 React components
│   │   ├── RecordsHub.tsx          # Main container (orchestrator)
│   │   ├── FilterPanel.tsx         # Filter controls
│   │   ├── ComparisonInputPanel.tsx # User lift comparison
│   │   ├── ResultsDisplay.tsx      # Tile/table views
│   │   ├── RecordCard.tsx          # Individual record display
│   │   ├── PDFExportModal.tsx      # PDF generation
│   │   └── ... (10 more)
│   ├── hooks/               # Custom React hooks
│   │   ├── useRecordsData.ts       # Data loading
│   │   └── useRecordsFilter.ts     # Filter management
│   ├── utils/               # Pure utility functions
│   │   ├── recordsFilters.ts       # Filter/sort logic
│   │   ├── recordsFormatters.ts    # Date/weight formatting
│   │   ├── pdfGenerator.ts         # PDF creation
│   │   ├── comparisonUtils.ts      # Comparison calculations
│   │   ├── shareRecord.ts          # Image generation
│   │   └── recordsStorage.ts       # localStorage operations
│   ├── types/               # TypeScript definitions
│   │   ├── records.ts              # Core types and constants
│   │   └── jspdf-autotable.d.ts
│   ├── data/                # Generated data
│   │   └── records.ts              # 72,166 lines of generated TS
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point (Vercel Analytics here)
│   └── index.css            # Global styles
├── data-source/             # Source JSON files (~1.5MB)
│   ├── british.json         # British national records
│   ├── england.json         # England records
│   ├── scotland.json        # Scotland records
│   ├── wales.json           # Wales records
│   └── ... (9 more regional files)
├── scripts/
│   └── build-records.cjs    # JSON → TypeScript converter
├── public/                  # PWA assets
│   ├── manifest.json
│   ├── sw.js               # Service worker
│   └── icon.svg
├── csv-to-json-converter.html  # Standalone CSV tool
├── generate-icons.html         # PWA icon generator
└── sample-records.json         # Example data format
```

---

## Core Data Model

### PowerliftingRecord Interface

```typescript
interface PowerliftingRecord {
  region: string;        // "British", "England", "Scotland", etc.
  name: string;          // Lifter's full name
  weightClass: string;   // "83kg", "120kg+", etc.
  gender: 'M' | 'F';
  lift: 'squat' | 'bench_press' | 'bench_press_ac' | 'deadlift' | 'total';
  ageCategory: string;   // "Open", "U16", "U18", "Junior", "M1"-"M6"
  record: number;        // Weight in kg
  dateSet: string;       // ISO format: YYYY-MM-DD
  equipment: 'equipped' | 'unequipped';
}
```

### Data Flow

1. **Source:** Google Sheets → CSV export
2. **Convert:** `csv-to-json-converter.html` validates & splits by region
3. **Place:** JSON files in `data-source/` directory
4. **Build:** `npm run build:data` generates `src/data/records.ts`
5. **Bundle:** Vite includes data in production build
6. **Runtime:** User can also import custom JSON via UI (stored in localStorage)

---

## Key Features

### 1. Advanced Filtering
- **Text search:** Lifter name (case-insensitive)
- **Dropdowns:** Region, Weight Class, Lift Type, Age Category, Equipment, Gender
- **Smart defaults:** Gender affects weight class options
- **Performance:** Results limited to 100, paginated (20 per load)

### 2. Comparison Mode (NEW Feature)
- Toggle between "Records" and "Comparison" modes
- User inputs: Gender, Weight Class, Age, Equipment, Personal Lifts
- Visual percentage bars: Green (≥100%), Yellow (85-99%), Red (<85%)
- Region-specific filtering for comparisons
- Works in both tile and table views

### 3. View Modes
- **Tile View:** Card-based layout with detailed info
- **Table View:** Compact tabular format with inline comparisons

### 4. Sorting
- By weight (default, highest first)
- By date (newest first)
- By name (alphabetical)

### 5. PDF Export
- Competition-ready formatted PDFs
- Portrait/Landscape orientation
- Region and gender filtering
- Organized by weight class and lift type
- Uses jsPDF + jspdf-autotable

### 6. Share Records
- Generate branded image cards
- Uses html2canvas to convert DOM to image
- Share button on each record card

### 7. CSV to JSON Converter
- Standalone tool: `csv-to-json-converter.html`
- Hidden in-app access: Type "JSON" in name search
- Real-time validation with warnings
- Exports separate files per region

### 8. PWA Features
- Installable on mobile/desktop
- Offline support via service worker (cache-first strategy)
- Auto-update prompts
- Custom icon with British colors

### 9. Dark Mode
- Full dark theme support
- Persistent toggle (localStorage)
- Smooth transitions

---

## Important Patterns & Conventions

### Component Architecture
- **RecordsHub.tsx** is the main orchestrator (don't bypass it)
- Custom hooks (`useRecordsData`, `useRecordsFilter`) manage state
- Error boundaries at multiple levels (general, data, PDF-specific)
- Utilities are pure functions (no side effects)

### State Management
- React hooks (no Redux/Zustand)
- localStorage for: dark mode, imported records, user preferences
- No backend - fully client-side

### Styling
- Tailwind utility classes
- Custom color scheme: British red (`red-600` primary)
- Dark mode: `dark:` prefix classes
- Responsive: Mobile-first approach

### Type Safety
- Strict TypeScript throughout
- Generated data file has full type annotations
- No `any` types in application code

### Performance
- Results pagination (20 records per page)
- 100 record display limit
- Skeleton loading states
- Memoized filter calculations
- Service worker caching

---

## Common Tasks

### Adding a New Filter
1. Add field to filter state in `useRecordsFilter.ts`
2. Add filter logic to `filterRecords()` in `recordsFilters.ts`
3. Add UI control to `FilterPanel.tsx`
4. Update URL persistence if needed

### Modifying the Data Schema
1. Update interface in `src/types/records.ts`
2. Update validation in `scripts/build-records.cjs`
3. Update CSV converter validation
4. Rebuild data: `npm run build:data`
5. Update affected components

### Adding a New Component
1. Create in `src/components/`
2. Use TypeScript (.tsx extension)
3. Import types from `src/types/records.ts`
4. Follow existing naming conventions (PascalCase)
5. Add error boundary if component can fail independently

### Updating Records Data
1. Export CSV from Google Sheets
2. Open `csv-to-json-converter.html` in browser
3. Upload CSV, validate, download JSON files
4. Replace files in `data-source/`
5. Run `npm run build:data`
6. Test locally, then commit

### Building for Production
```bash
npm run build:data  # Update data (if needed)
npm run build       # TypeScript compile + Vite build
npm run preview     # Test production build locally
```

### Development Workflow
```bash
npm run dev         # Start dev server (usually port 5173)
npm run lint        # Check code quality
```

---

## Important Files

### Configuration
- `vite.config.ts` - Build configuration, PWA settings
- `tailwind.config.js` - Custom colors, dark mode settings
- `tsconfig.json` - TypeScript compiler options
- `public/manifest.json` - PWA manifest (name, icons, colors)
- `public/sw.js` - Service worker (offline caching strategy)

### Entry Points
- `index.html` - HTML entry point
- `src/main.tsx` - JavaScript entry point (Vercel Analytics imported here)
- `src/App.tsx` - Root React component

### Data Management
- `data-source/` - Source JSON files (version controlled)
- `src/data/records.ts` - Generated data (DO NOT EDIT MANUALLY)
- `scripts/build-records.cjs` - Data build script

### Documentation
- `README.md` - User-facing documentation
- `DATA-MANAGEMENT.md` - Data workflow guide
- `CLAUDE.MD` - This file (AI assistant guide)

---

## Gotchas & Important Notes

### DO NOT Edit Generated Files
- `src/data/records.ts` is auto-generated - changes will be overwritten
- Always edit source JSON files in `data-source/` instead
- Run `npm run build:data` to regenerate

### Data Validation is Strict
- Build script will fail if any record is invalid
- All fields are required (no nulls/undefined)
- Date format must be YYYY-MM-DD
- Gender must be exactly 'M' or 'F'
- Equipment must be 'equipped' or 'unequipped'

### Service Worker Caching
- Service worker caches aggressively for offline support
- Clear browser cache or use incognito for testing updates
- Auto-update prompts appear for new versions

### Large Data Files
- `src/data/records.ts` is 72,166 lines
- Git tracks this file (it's the source of truth for deployed app)
- Keep `data-source/` files under version control too

### Secret Admin Features
- Type "JSON" in name search → Opens CSV converter
- Type "PDF" in name search → Opens PDF export modal
- These are intentional shortcuts for power users

### CSS Class Conflicts
- Tailwind purges unused classes in production
- Always use standard Tailwind utilities
- Custom classes must be in `index.css`

### TypeScript Strict Mode
- `tsconfig.json` has strict: true
- No implicit any
- Null checks required
- This is intentional - maintain type safety

### PWA Update Flow
- Users see prompt: "New version available! Reload to update?"
- Service worker uses skip waiting strategy
- Page auto-reloads when user accepts
- Don't disable this - it's the UX pattern

---

## Recent Changes

### 2025-12-01: Vercel Analytics Integration
- Added `@vercel/analytics` package
- Imported and rendered `<Analytics />` in `src/main.tsx`
- Tracks page views automatically once deployed to Vercel

### Recent Feature: Comparison Mode
- Users can compare personal lifts against records
- Visual percentage bars with color coding
- Compact toggle for better UX
- Works in both tile and table views
- Region-specific filtering

### Recent UI Improvements
- Centered region text on record cards (multi-line wrap)
- Compact comparison toggle
- Reset button for comparison mode
- Lift-specific filtering in comparison mode

---

## Testing Checklist

When making changes, test these critical paths:

1. **Filtering**
   - [ ] Name search works (case-insensitive)
   - [ ] All dropdowns filter correctly
   - [ ] Gender change updates weight class options
   - [ ] Combining multiple filters works

2. **Comparison Mode**
   - [ ] Toggle switches between modes
   - [ ] User input saves and persists
   - [ ] Percentage bars display correctly
   - [ ] Color coding is accurate (green/yellow/red)
   - [ ] Region filtering works

3. **Views & Sorting**
   - [ ] Tile view displays properly
   - [ ] Table view displays properly
   - [ ] All sort options work
   - [ ] Pagination (Load More) works

4. **Export & Share**
   - [ ] PDF export generates correctly
   - [ ] Share creates image properly
   - [ ] Both work in light and dark mode

5. **PWA**
   - [ ] App installs on mobile/desktop
   - [ ] Offline mode works
   - [ ] Service worker caches properly
   - [ ] Update prompt appears for new versions

6. **Data Management**
   - [ ] Import JSON works
   - [ ] CSV converter validates correctly
   - [ ] Build script runs without errors
   - [ ] Data displays after rebuild

7. **Dark Mode**
   - [ ] Toggle works
   - [ ] Preference persists
   - [ ] All components look good in both themes

---

## Common Issues & Solutions

### Issue: "Records not updating after data change"
**Solution:** Run `npm run build:data` to regenerate `src/data/records.ts`

### Issue: "Service worker serving stale content"
**Solution:**
1. Update version in `public/sw.js` (CACHE_NAME)
2. Deploy new version
3. Users will see update prompt

### Issue: "PDF export not working"
**Solution:** Check `PDFErrorBoundary.tsx` - likely jsPDF issue with fonts or data

### Issue: "Share button not creating image"
**Solution:**
1. Check browser console for html2canvas errors
2. Verify `ShareCard.tsx` is rendering hidden element
3. Check for CORS issues with images

### Issue: "TypeScript errors after data rebuild"
**Solution:**
1. Verify all records match `PowerliftingRecord` interface
2. Check `scripts/build-records.cjs` validation
3. Fix invalid records in source JSON files

### Issue: "Dark mode not persisting"
**Solution:** Check localStorage is enabled in browser (privacy settings)

---

## Architecture Decisions

### Why No Backend?
- Simplicity: Pure frontend, easy to host anywhere
- Performance: All data bundled, no API latency
- Offline: Full functionality without network
- Cost: Free hosting on Vercel/Netlify

### Why localStorage for Imports?
- User privacy: Data stays local
- No auth needed
- Instant updates
- Easy to clear/reset

### Why Generated TypeScript File?
- Type safety at compile time
- Intellisense support
- Zero runtime validation overhead
- Catches data errors at build time

### Why Vite over Create React App?
- Faster dev server (HMR)
- Smaller production bundles
- Better tree-shaking
- Modern best practices
- CRA is deprecated

### Why Tailwind CSS?
- Rapid development
- Consistent design system
- Built-in dark mode
- Purges unused CSS (small bundles)
- No CSS modules complexity

---

## Performance Considerations

### Bundle Size
- Current production build: ~500KB (gzipped)
- Largest chunk: Data file (~400KB)
- PWA caches everything for offline use

### Runtime Performance
- Results pagination prevents DOM bloat
- Virtual scrolling not needed (100 item limit)
- Memoized filters prevent unnecessary recalculations
- Lazy loading for modals (PDF, CSV converter)

### Load Time
- First load: ~2-3 seconds (includes data)
- Subsequent loads: <500ms (service worker cache)
- Time to interactive: <1 second

### Optimization Opportunities
- Could split data by region (code splitting)
- Could use virtual scrolling for 1000+ results
- Could lazy-load utility libraries
- Currently not needed - performance is good

---

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Auto-deploys on push to main
3. Preview deployments for PRs
4. Vercel Analytics works out of the box
5. Custom domains supported

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Auto-deploys on push

### GitHub Pages
1. Build locally: `npm run build`
2. Deploy `dist/` folder
3. Configure base path in `vite.config.ts` if needed

### Docker (Advanced)
- Not currently containerized
- Could use nginx to serve `dist/` folder
- Not necessary for this static app

---

## Contributing Guidelines

### Code Style
- Use TypeScript (no plain JS in src/)
- Follow existing naming conventions
- Use Tailwind utilities (avoid custom CSS when possible)
- Add types for all function parameters/returns
- No `console.log` in production code

### Git Workflow
- Branch naming: `feature/description` or `fix/description`
- Commit messages: Imperative mood ("Add feature" not "Added feature")
- Keep commits focused (one logical change per commit)
- Test before pushing

### Pull Request Checklist
- [ ] Code lints without errors (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Tested in both light and dark mode
- [ ] Tested on mobile viewport
- [ ] No console errors
- [ ] Updated this file if architecture changed

---

## Support & Resources

### Documentation
- README.md - User guide
- DATA-MANAGEMENT.md - Data workflow
- This file - Technical reference

### External Resources
- [Vite Docs](https://vitejs.dev/)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [jsPDF Docs](https://github.com/parallax/jsPDF)
- [PWA Guide](https://web.dev/progressive-web-apps/)

### Key Contacts
- Federation officials for data updates
- Repository owner for technical issues

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Lint code

# Building
npm run build:data      # Regenerate data from JSON
npm run build           # Production build
npm run preview         # Preview production build

# Data Management
# 1. Open csv-to-json-converter.html in browser
# 2. Upload CSV, validate, download JSON
# 3. Place JSON files in data-source/
# 4. npm run build:data

# Deployment
# Just push to main - Vercel auto-deploys
```

---

## Version History

- **v1.0** - Initial release with filtering and PDF export
- **v1.1** - Added comparison mode
- **v1.2** - PWA support with offline functionality
- **v1.3** - Dark mode support
- **v1.4** - CSV converter integration
- **v1.5** - Table view and enhanced sorting
- **v1.6** - Vercel Analytics integration (current)

---

**End of CLAUDE.MD**

*This file is maintained for AI assistants to understand the codebase quickly. Keep it updated when making architectural changes.*
