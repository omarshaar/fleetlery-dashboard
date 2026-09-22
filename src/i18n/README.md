# Internationalization (i18n) - Usage Guide

## Overview

Full-featured multi-language system using **i18next** with complete support for Arabic and English.

## File Structure

```
src/
├── i18n/
│   ├── config.ts                 # Main i18next configuration
│   ├── index.ts                  # Entry point
│   ├── hooks/
│   │   ├── useLanguage.ts        # Custom Hook for translations
│   │   └── index.ts
│   └── locales/
│       ├── ar/                   # Arabic translations
│       │   ├── common.json       # Common texts
│       │   ├── navigation.json   # Navigation texts
│       │   ├── forms.json        # Form labels
│       │   └── messages.json     # Messages and alerts
│       └── en/                   # English translations
│           ├── common.json
│           ├── navigation.json
│           ├── forms.json
│           └── messages.json
└── eano/
    └── components/
        └── language-switcher/    # Language switcher component
            ├── LanguageSwitcher.tsx
            └── index.ts
```

## Usage

### 1. In Any React Component

```typescript
import { useLanguage } from '@/i18n/hooks';

export function MyComponent() {
  const { t, language, changeLanguage, isRTL, direction } = useLanguage();

  return (
    <div dir={direction}>
      <h1>{t('app.title')}</h1>
      <p>{t('general.success')}</p>
      <button onClick={() => changeLanguage('ar')}>{t('app.language')}</button>
    </div>
  );
}
```

### 2. Available Hook Properties

| Property | Type | Description |
|----------|------|-------------|
| `t()` | Function | Translation function (key → translated value) |
| `language` | String | Current language ('ar' or 'en') |
| `changeLanguage()` | Function | Function to change language |
| `isRTL` | Boolean | Is language right-to-left (ar) |
| `isLTR` | Boolean | Is language left-to-right (en) |
| `direction` | String | 'rtl' or 'ltr' value |
| `i18n` | Object | Complete i18n object |

### 3. Using Language Switcher Component

```typescript
import { LanguageSwitcher } from '@/eano/components/language-switcher';

export function Header() {
  return (
    <header>
      <h1>My App</h1>
      <LanguageSwitcher />
    </header>
  );
}
```

## Adding New Translations

### Steps to add a new translation key:

1. **Open the appropriate translation file:**
   - `src/i18n/locales/ar/common.json` (for common texts)
   - `src/i18n/locales/ar/forms.json` (for form labels)
   - etc.

2. **Add the key and value:**

```json
{
  "newFeature": {
    "title": "عنوان الميزة الجديدة",
    "description": "وصف الميزة الجديدة"
  }
}
```

3. **Do the same for English:**

```json
{
  "newFeature": {
    "title": "New Feature Title",
    "description": "New Feature Description"
  }
}
```

4. **Use in component:**

```typescript
const { t } = useLanguage();
console.log(t('newFeature.title'));
```

## Variables in Translations

You can use variables in translations:

```json
{
  "validation": {
    "minLength": "Text must be at least {{min}} characters long"
  }
}
```

**Usage:**

```typescript
const { t } = useLanguage();
t('validation.minLength', { min: 5 })
// Result: "Text must be at least 5 characters long"
```

## Changing Language Programmatically

```typescript
const { changeLanguage } = useLanguage();

// Change to Arabic
await changeLanguage('ar');

// Change to English
await changeLanguage('en');
```

## Language Persistence

Selected language is automatically saved to localStorage and restored on next visit.

## Features

- ✅ **Auto Language Detection:** Browser language automatically detected
- ✅ **RTL/LTR Support:** Page direction automatically updated
- ✅ **Language Persistence:** Language choice saved to localStorage
- ✅ **Type Safe:** Full TypeScript support

## Complete Practical Example

```typescript
import { useLanguage } from '@/i18n/hooks';
import { LanguageSwitcher } from '@/eano/components/language-switcher';

export function DashboardPage() {
  const { t, isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('sidebar.dashboard')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardTitle>{t('sidebar.products')}</CardTitle>
          <CardContent>100</CardContent>
        </Card>

        <Card>
          <CardTitle>{t('sidebar.orders')}</CardTitle>
          <CardContent>50</CardContent>
        </Card>

        <Card>
          <CardTitle>{t('sidebar.customers')}</CardTitle>
          <CardContent>500</CardContent>
        </Card>
      </div>

      {/* Form Example */}
      <form className="mt-8 p-4 border rounded">
        <label>{t('forms.user.name')}</label>
        <input type="text" placeholder={t('forms.user.name')} />

        <label>{t('forms.user.email')}</label>
        <input type="email" placeholder={t('forms.user.email')} />

        <button type="submit">{t('general.save')}</button>
      </form>
    </div>
  );
}
```

## Additional Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)

---

**System setup completed successfully! ✅**

````