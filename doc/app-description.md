# Kuvio Feed Validator Application Analysis

## Purpose and Core Functionality

### Primary Purpose
A Next.js web application designed to validate and analyze CSV feed files, done in the browser client with no backend or database.

### Core Features
1. CSV File Upload and Processing
   - Drag-and-drop or file selection interface
   - Progress tracking during upload (percentage, running for 5 seconds no matter the file size - not actual progress)
   - File information display (name, size, number of rows)
   - Ability to abort upload
   - Ability to handle large files

2. Column Validation
   - Validates required/preferred/optional columns
   - Matches column names with aliases
   - Provides validation feedback

3. Data Analytics
   - Statistical analysis of numerical data
   - Distribution charts for costs and prices
   - Category-based analysis
   - Missing value detection

### Main User Flow
1. User uploads CSV file
2. System validates column structure
3. If valid, displays analytics dashboard
4. Shows detailed statistics and visualizations

## Tech Stack

### Frontend
- React 18.2
- Next.js 15.0.2
- TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- no database, no backend

### Key Dependencies

json
{
"dependencies": {
"@types/papaparse": "^5.3.15",
"next": "15.0.2",
"papaparse": "^5.4.1",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"recharts": "^2.13.2"
}
}

### Development Tools
- ESLint for code quality
- TypeScript for type safety
- Next.js App Router for routing

## Architecture and Design Patterns

### Component Structure
1. Core Components
   - Page Component (`app/page.tsx`)
   - Analytics Components (`components/analytics/`)
   - UI Components (`components/ui/`)

2. Utility Layers
   - Data Processing (`utils/dataAnalytics.ts`)
   - Column Validation (`utils/columnValidation.ts`)
   - Configuration (`config/columns.ts`)

### Design Patterns
- Component-based architecture
- Container/Presenter pattern
- Utility-first CSS with Tailwind


## User Interface

### Key Sections
1. File Upload Area
   - Upload button
   - Progress bar
   - File information display

2. Validation Section
   - Column validation results
   - Required/Preferred/Optional column groups

3. Analytics Dashboard
   - Statistics cards: 
   1. Overview: number of skus, number of brands, number of categories,
   2. Missing values list of columns with missing values, and their count and percentage of missing values
   3. shipping costs: average, median, min, max,
   4. cost price: average, median, min, max,
      
   5. Distribution charts 
Two Main Distribution Charts:
Shipping Cost Distribution
Cost Price Distribution
Shipping Cost Distribution: Shows how shipping costs are spread across products
Cost Price Distribution: Shows how purchase prices are distributed across products
Visual Representation
Bar charts where:
Taller bars mean more products fall in that price range
Each bar represents a price range (bucket)
You can hover over bars to see exact numbers
Uses Kuvio's brand colors (purple for shipping, coral for cost)
3. Smart Price Ranges
Automatically creates sensible price ranges based on your data
Handles outliers intelligently:
Groups extreme values separately
Shows a special "greater than" bucket for unusually high values
Prevents the chart from being skewed by extreme prices
Interactive Elements
Hover over any bar to see:
The exact price range
Number of products in that range
Percentage of total products
Clear labels for all axes
Responsive sizing that works on all screens
Data Analysis Features
Shows where most of your prices cluster
Helps identify pricing patterns
Makes it easy to spot outliers
Shows the spread of your costs
User-Friendly Details
Numbers are formatted with proper separators
Price ranges are clearly labeled
Loading states show while data is being calculated
Empty states handle cases with no data
Automatically adjusts to screen size
Technical Smarts
Handles missing or invalid data
Calculates distributions efficiently
Updates smoothly when data changes
Works with any reasonable number of products

### UI Components
- Reusable Card component
- Custom Progress Bar
- Data visualization charts
- Responsive grid layouts

#### Color Palette
The application uses a custom Kuvio color palette defined in CSS variables:

css
--primary-purple: #6B66A8
--primary-purple-dark: #5A5691
--secondary-coral: #FF9E8C
--accent-teal: #4B9B9B
--text-dark: #333333
--gray-light: #F5F5F7
--gray-medium: #E5E5EA
--white: #FFFFFF



### Import data structure. This is used to validate the uploaded file. These are the columns that are expected:

ColumnDefinition[] = [
  {
    name: 'sku',
    necessity: 'required',
    type: 'string',
    description: 'The sku of the product or variant if applicable',
    aliases: ['productId', 'article_number', 'item_sku']
  },
  {
    name: 'costPrice',
    necessity: 'required',
    type: 'float',
    description: 'The purchase price (COGS)',
    validation: {
      min: 0
    },
    aliases: ['cost', 'purchase_price', 'buying_price']
  },
  {
    name: 'title',
    necessity: 'optional',
    type: 'string',
    description: 'The name of the product',
    aliases: ['name', 'product_name', 'product_title']
  },
  {
    name: 'salesPrice',
    necessity: 'optional',
    type: 'float',
    description: 'The net price the picture is sold for',
    validation: {
      min: 0
    },
    aliases: ['price', 'selling_price', 'retail_price']
  },
  {
    name: 'shippingCost',
    necessity: 'optional',
    type: 'float',
    description: 'The actual/ average shipping cost per product',
    validation: {
      min: 0
    },
    aliases: ['shipping', 'delivery_cost']
  },
  {
    name: 'kickback',
    necessity: 'optional',
    type: 'float',
    description: 'The kickback for that product, in percent of purchase price, times 100',
    validation: {
      min: 0,
      max: 10000
    },
    aliases: ['cashback', 'rebate']
  },
  {
    name: 'vat',
    necessity: 'optional',
    type: 'integer',
    description: 'The VAT times 100 (25 for Sweden)',
    validation: {
      min: 0,
      max: 10000
    },
    aliases: ['tax', 'vat_rate', 'tax_rate']
  },
  {
    name: 'brand',
    necessity: 'preferred',
    type: 'string',
    description: 'The brand of the product',
    aliases: ['manufacturer', 'make']
  },
  {
    name: 'category',
    necessity: 'preferred',
    type: 'string',
    description: 'The category of the product',
    aliases: ['product_category', 'product_type']
  },
  {
    name: 'returns',
    necessity: 'optional',
    type: 'float',
    description: 'The return rate for that product, in percent of purchase price, times 100',
    validation: {
      min: 0,
      max: 10000
    },
    aliases: ['return_rate', 'returns_rate', 'return_percentage']
  },
  {
    name: 'custom_1',
    necessity: 'optional',
    type: 'string',
    description: 'Custom dimension for reporting',
    aliases: ['customField1', 'custom1']
  },
  {
    name: 'custom_2',
    necessity: 'optional',
    type: 'string',
    description: 'Custom dimension for reporting',
    aliases: ['customField2', 'custom2']
  },
  {
    name: 'custom_3',
    necessity: 'optional',
    type: 'string',
    description: 'Custom dimension for reporting',
    aliases: ['customField3', 'custom3']
  },
  {
    name: 'custom_4',
    necessity: 'optional',
    type: 'string',
    description: 'Custom dimension for reporting',
    aliases: ['customField4', 'custom4']
  }
];
