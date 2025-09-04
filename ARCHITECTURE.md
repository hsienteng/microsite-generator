# Enhanced Markdown Parser Architecture

## Overview

This document describes the new flexible and dynamic architecture for the markdown parsing system, designed to handle various response structures from AI parsing and provide graceful degradation when components fail to render.

## Key Improvements

### 1. Flexible Component Schema System (`lib/componentSchema.ts`)

- **Schema-based validation**: Each component type has a defined schema with required/optional props
- **Property mapping**: Multiple property name variants are automatically mapped to standard names
- **Validation with warnings**: Components validate but allow rendering with warnings instead of hard failures
- **Default values**: Schemas provide sensible defaults for missing properties

### 2. Structured API Response Format

```typescript
interface StructuredApiResponse {
  success: boolean;
  data: {
    components: FlexibleComponentData[];
    metadata: {
      title: string;
      description: string;
      tags: string[];
      processingInfo: {
        strategy: string;
        chunksProcessed?: number;
        fallbackUsed?: boolean;
        warnings: string[];
      };
    };
  };
  errors?: string[];
  warnings?: string[];
}
```

### 3. Functional Component Registry

- **Runtime registration**: Components can be registered/unregistered at runtime using functional patterns
- **Extensibility**: Easy to add new component types without code changes
- **Type safety**: Maintains TypeScript type safety for registered components
- **Functional approach**: Uses closures and pure functions instead of classes

### 4. Graceful Error Handling

- **Fallback rendering**: Failed components render warning cards instead of breaking the page
- **Multiple fallback levels**: API → Parser → Component → UI fallbacks
- **Detailed error information**: Debug information available in development

## Component Schema Example

```typescript
{
  type: 'feature-list',
  requiredProps: ['features'],
  optionalProps: ['title', 'description', 'layout'],
  propMappings: {
    title: ['title', 'heading', 'header', 'name'],
    features: ['features', 'items', 'list', 'services', 'capabilities'],
  },
  defaultProps: {
    title: 'Features',
    features: []
  },
  validation: (props) => {
    // Custom validation logic
  }
}
```

## Processing Flow

1. **Markdown Input** → AI Parser (with fallback)
2. **Raw AI Response** → Schema-based normalization
3. **Validated Components** → Dynamic component registry
4. **Rendered Components** → Error boundary with fallbacks

## Benefits

### For Developers

- **Reduced rigidity**: No more hardcoded transformation logic
- **Better debugging**: Clear warnings and error messages
- **Easier extension**: Add new components with just schema definitions
- **Type safety**: Full TypeScript support throughout
- **Functional patterns**: Uses modern functional programming patterns instead of classes

### For Users

- **More reliable**: Pages render even with parsing errors
- **Better feedback**: Clear warnings about issues
- **Consistent experience**: Standardized component behavior

### For AI Parsing

- **Flexible input**: AI can return various property structures
- **Automatic normalization**: Property names are automatically mapped
- **Graceful degradation**: Partial parsing failures don't break the entire page

## Migration Guide

### From Old to New Format

The system supports both legacy and new response formats automatically. No migration is required for existing content.

### Adding New Components

1. **Create the React component** in `components/`
2. **Add schema definition** in `componentSchema.ts`
3. **Register the component** (automatically done for default components)

```typescript
// Add to COMPONENT_SCHEMAS
'my-component': {
  type: 'my-component',
  requiredProps: ['title'],
  optionalProps: ['description'],
  propMappings: {
    title: ['title', 'heading', 'name'],
    description: ['description', 'content', 'text']
  },
  defaultProps: {
    title: 'Default Title'
  }
}
```

### Custom Component Registration

```typescript
import { registerComponent } from "@/components/DynamicComponents";
import MyCustomComponent from "./MyCustomComponent";

registerComponent("my-custom-type", MyCustomComponent);
```

## Configuration

### Schema Customization

Schemas can be extended or modified to handle specific use cases:

```typescript
// Override default schema
COMPONENT_SCHEMAS["hero"].propMappings.title.push("custom-title-field");

// Add validation
COMPONENT_SCHEMAS["hero"].validation = (props) => {
  const errors = [];
  if (props.title && props.title.length > 100) {
    errors.push("Title too long");
  }
  return { isValid: errors.length === 0, errors };
};
```

### Processing Strategy Selection

The API supports multiple processing strategies:

- `intelligent`: AI-powered with robust error handling
- `chunked`: For large documents, processes in chunks
- `basic`: Simple parsing with minimal AI processing
- `fallback`: Rule-based parsing when AI fails

## Debugging

### Development Mode

Set `showDebugInfo={true}` on `DynamicPage` to enable debug information display.

### Logging

- Component normalization warnings logged to console
- API processing information included in response
- Detailed error information for failed renders

### Troubleshooting

1. **Check browser console** for detailed warning messages
2. **Review processing info** in the yellow banner (if warnings exist)
3. **Inspect component data** using the debug info panel
4. **Verify schema mappings** for new component types

## Performance Considerations

- **Schema validation** is fast and runs on every component
- **Property mapping** happens once during normalization
- **Component registration** is a one-time setup cost
- **Error boundaries** add minimal overhead

## Future Enhancements

1. **Hot-reloading schemas** for development
2. **Visual schema editor** for non-developers
3. **AI-assisted schema generation** from examples
4. **Component usage analytics** and optimization
5. **Advanced validation rules** with custom logic
