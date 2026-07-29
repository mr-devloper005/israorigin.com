# Slot 4 Editable Manifest

Slot 4 is now a reference-ready editable UI architecture.

## Contract

- `src/app/**` is route wiring only.
- `src/lib/**`, `src/config/**`, and APIs are data/SEO/routing logic only.
- All visible UI should live inside `src/editable/**`.
- Navbar, footer, body shell, page layouts, task archives, task details, cards, sections, theme, and copy are editable.
- Normal UI PRs must only change `src/editable/**`.

## Editable Surface

```txt
src/editable/shell/EditableSiteShell.tsx
src/editable/shell/EditableNavbar.tsx
src/editable/shell/EditableFooter.tsx
src/editable/pages/HomePage.tsx
src/editable/pages/LoginPage.tsx
src/editable/pages/SignupPage.tsx
src/editable/pages/TaskArchivePage.tsx
src/editable/pages/TaskDetailPage.tsx
src/editable/pages/*Page.tsx
src/editable/cards/PostCards.tsx
src/editable/cards/ArchiveCards.tsx
src/editable/components/EditableArchiveExplorer.tsx
src/editable/components/EditableGalleryLightbox.tsx
src/editable/components/EditableMotion.tsx
src/editable/sections/*.tsx
src/editable/content/*.ts
src/editable/layouts/design-contract.ts
src/editable/theme/*.ts
src/editable/theme/editable-global.css
```

## Current Design System

`Warm Studio` — cream canvas (`--slot4-page-bg`), white pill surfaces, oversized
`Outfit` display type over `DM Sans` body copy, and a rotating play palette
(`--iso-green` / `--iso-yellow` / `--iso-coral` / `--iso-blue` with `--iso-lilac`
highlights) exposed through `playColor()` in `layouts/design-contract.ts`.
Change `editableRootStyle` there to re-skin the entire site in one edit.

## AI Redesign Rule

When giving this folder to AI, ask it to rewrite `src/editable/**` only. It may fully redesign body, nav, footer, page layout, cards, task pages, and detail pages. It must preserve exported component/function names and props.

## Do Not Touch

```txt
src/app/**
src/lib/**
src/config/**
src/components/**
.github/**
Dockerfile
package.json
next.config.*
```

For one-time base infrastructure changes only:

```bash
ALLOW_INFRASTRUCTURE_CHANGES=1 pnpm guard:editable
```
