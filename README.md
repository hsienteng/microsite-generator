# AI Microsite Generator

A Next.js application that transforms markdown content into complete, professional microsites using AI to intelligently select the most appropriate components for each section. The system generates a dedicated microsite with navigation, layout, and interactive features.

## 🚀 Features

### AI-Powered Microsite Generation

- **Intelligent Component Selection**: AI analyzes content and chooses the best components for each section
- **Complete Microsite Creation**: Generates full websites with navigation, layout, and interactive features
- **16 Component Types**: From hero sections to testimonials, timeline to team grids
- **Responsive Design**: Professional layouts that work on all devices

### Microsite Features

- **Navigation Header**: Sticky navigation with site title and actions
- **Side Navigation**: Auto-generated navigation based on content sections
- **Professional Footer**: Complete footer with site information and actions
- **Gradient Backgrounds**: Modern design with beautiful gradients
- **Interactive Elements**: Buttons, links, and user interactions

### Available Component Types

1. **Hero** - Main titles, introductions, and primary messaging
2. **Section** - Major content sections with titles
3. **InfoCard** - Structured information display (contact details, company info)
4. **LeadershipCard** - Individual person profiles with photos and bios
5. **ProcessSteps** - Sequential processes or methodologies
6. **FeatureList** - Lists of features, services, or capabilities
7. **Pillars** - Core principles or foundational elements
8. **DataTable** - Structured tabular data
9. **Quote** - Highlighted quotes or important statements
10. **AwardList** - Awards and recognitions
11. **StatsCard** - Statistics and metrics
12. **TeamGrid** - Multiple team member displays
13. **Timeline** - Chronological events or milestones
14. **Testimonial** - Customer or client testimonials
15. **CTASection** - Call-to-action sections
16. **Collaboration** - Partnership and collaboration information

### AI Analysis Capabilities

The system performs intelligent content analysis:

- **Content Type Detection**: Identifies patterns indicating specific content types
- **Contextual Analysis**: Considers relationships between sections and visual flow
- **Semantic Matching**: Matches component purpose to content intent
- **Structure Analysis**: Analyzes lists, tables, key-value pairs, and paragraphs

## 🛠️ Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **PrimeReact** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI GPT-4** - AI-powered content analysis
- **Markdown Parsing** - Intelligent component selection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd markdown-test
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Basic Workflow

1. **Enter Content**: Paste your markdown content in the textarea on the home page
2. **Load Sample Site**: Click "Load Sample Site" to see the system in action with the Temus HCD documentation
3. **Enable AI Selection**: Toggle the checkbox to use AI-driven component selection
4. **Generate Microsite**: Click "Generate Microsite" to create your complete website
5. **View Results**: You'll be automatically redirected to your generated microsite
6. **Navigate**: Use the header buttons to regenerate or create a new site

### Microsite Features

- **Professional Header**: Shows site title, description, and navigation
- **Side Navigation**: Auto-generated navigation based on your content sections
- **Gradient Banners**: Beautiful gradient backgrounds for visual appeal
- **Dynamic Content**: Renders all generated components with professional styling
- **Complete Footer**: Professional footer with site information and actions
- **Download Options**: Easy access to original content and source files

### API Endpoint

The system provides a REST API for generating microsites:

```bash
POST /api/parse-markdown
Content-Type: application/json

{
  "markdownContent": "# Your markdown content",
  "useIntelligentSelection": true,
  "useChunking": false
}
```

### Response Format

```json
{
  "components": [
    {
      "type": "hero",
      "props": {
        "title": "Main Title",
        "subtitle": "Subtitle",
        "description": "Description text"
      }
    }
  ],
  "metadata": {
    "title": "Site Title",
    "description": "Brief description",
    "tags": ["tag1", "tag2"]
  }
}
```

## 🧠 How It Works

### 1. Content Analysis

The AI analyzes the markdown content to understand:

- Content type and structure
- Semantic meaning and purpose
- Visual hierarchy and relationships
- User experience requirements

### 2. Component Selection

Based on the analysis, the AI selects the most appropriate component:

- **Contact information** → `info-card`
- **Team member profiles** → `leadership-card` or `team-grid`
- **Step-by-step processes** → `process-steps`
- **Lists of features** → `feature-list`
- **Statistics and metrics** → `stats-card`
- **Customer testimonials** → `testimonial`
- **Company history** → `timeline`
- **Partnership information** → `collaboration`

### 3. Microsite Generation

The system creates a complete microsite with:

- **Professional Layout**: Modern design with gradients and shadows
- **Navigation System**: Auto-generated navigation based on content
- **Responsive Design**: Works perfectly on all device sizes
- **Interactive Elements**: Buttons, links, and user interactions
- **Complete Structure**: Header, content, and footer sections

## 🎨 Component Examples

### Hero Section

```json
{
  "type": "hero",
  "props": {
    "title": "Temus HCD",
    "subtitle": "Human-Centric Design",
    "description": "Empowering businesses through innovative design solutions"
  }
}
```

### Team Grid

```json
{
  "type": "team-grid",
  "props": {
    "title": "Our Leadership Team",
    "members": [
      {
        "name": "KC Yeoh",
        "title": "Chief Executive Officer",
        "bio": "Leading digital transformation initiatives...",
        "image": "/images/kc-yeoh.jpg"
      }
    ]
  }
}
```

### Timeline

```json
{
  "type": "timeline",
  "props": {
    "title": "Company History",
    "events": [
      {
        "title": "Company Founded",
        "date": "April 2021",
        "description": "Temus was established by Temasek in strategic partnership with UST"
      }
    ]
  }
}
```

## 🔧 Customization

### Adding New Components

1. Create a new component in `components/`:

```typescript
// components/NewComponent.tsx
import React from "react";
import { Card } from "primereact/card";

interface NewComponentProps {
  title: string;
  // ... other props
}

export const NewComponent: React.FC<NewComponentProps> = ({ title }) => {
  return (
    <Card className="mb-6 shadow-lg">
      <h2>{title}</h2>
      {/* Component content */}
    </Card>
  );
};
```

2. Export it in `components/index.ts`:

```typescript
export { NewComponent } from "./NewComponent";
```

3. Add it to the registry in `components/DynamicComponents.tsx`:

```typescript
const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ... existing components
  "new-component": NewComponent,
};
```

4. Update the AI prompt in `lib/markdownParser.ts` to include the new component type.

### Styling

All components use Tailwind CSS classes and PrimeReact components for consistent styling. You can customize the appearance by modifying the component files or updating the Tailwind configuration.
