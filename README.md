# i18n Hover

Preview i18n translation values on hover for t('key.path') calls in your code without opening locale files.

i18n Hover automatically detects your workspace's locale files (e.g., tr.ts, en.ts) and supports multiple export styles:

**Direct export object:**

```typescript
const tr = { home: 'Ana Sayfa' };
export default tr;
```

**Translation object inside default export:**

```typescript
export default { translation: { home: 'Ana Sayfa' } };
```

It also supports parametrized calls like:

```typescript
t('home.title');
t('home.title', { name: 'Oğuzhan' });
t('home.title', someVar);
```

## Features

-   Hover over `t('key.path')` to see the translated values.
-   Supports multiple languages.
-   Automatically scans workspace for locale files.
-   Handles different export structures (default, translation object).
-   Ignores missing languages that do not exist in the workspace.
-   Supports parameterized t() calls.

## Installation

1. Open your workspace in VS Code.
2. Install the extension from Marketplace: **i18n Hover**
   or install locally via .vsix:

```bash
code --install-extension i18n-hover-0.0.1.vsix
```

## Usage

Hover over any `t('key.path')` call in your code.

A tooltip will show the translation for all available languages.

**Example:**

```typescript
// tr.ts
export default { translation: { home: 'Ana Sayfa' } };

// en.ts
export default { translation: { home: 'Home' } };

// In your code
t('home');
```

Hover shows:

-   tr: Ana Sayfa
-   en: Home

Missing keys are ignored silently.

Parameterized calls work as expected:

```typescript
t('greeting', { name: 'Oğuzhan' });
```

## Configuration

Optionally, you can configure which languages to display:

1. Open Settings → search `i18nHover.languages`
2. Add the languages you want:

```json
"i18nHover.languages": ["tr", "en"]
```

## Supported Languages / Export Formats

-   Direct object in default export: `export default { home: "Ana Sayfa" }`
-   Object inside translation: `export default { translation: { home: "Ana Sayfa" } }`
-   Works with parameterized t() calls.

## License

MIT License
