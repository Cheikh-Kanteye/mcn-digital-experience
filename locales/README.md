Internationalisation (i18n) — instructions

We extracted existing French UI strings into `locales/fr.json`.

Next steps to enable i18n (suggested):

1. Install react-i18next and i18next:

   pnpm add react-i18next i18next

2. Create an i18n bootstrap file (e.g. `lib/i18n.ts`) that loads `locales/fr.json` and initializes i18next.

3. Replace hardcoded strings in components with `t('key.path')` calls.

4. Add `locales/en.json` and `locales/es.json` once translations are ready.

If you want, I can:

- Add `lib/i18n.ts` and wire a provider in the app layout, and convert `boutique.tsx` to use `t()` for the newly extracted keys.
- Or just stop here and let you translate `locales/fr.json` manually; tell me when to proceed to phase 2.
