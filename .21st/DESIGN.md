# Mox UI design context

Mox UI is a React component library built with Next.js, Tailwind CSS, and shadcn conventions. Read `AGENTS.md` and `CONVENTIONS.md` before edits.

## Component documentation

Use the [Forge UI reference](https://forgeui.in/components/animated-form) supplied by the user. Keep Mox UI branding and the existing component demos.

- Full-width sticky header with search and theme controls.
- Flat, grouped component navigation in a left sidebar.
- A centered article with preview and source tabs.
- CLI and manual installation tabs with numbered steps.
- A sticky page index and contribution links on the right.
- Thin neutral borders, compact code headers, and 10px panel corners.
- A black background in dark mode and a white background in light mode.

The palette is scoped to `.docs-page` in `app/globals.css`. Reuse the existing catalog, source API, copy controls, syntax highlighter, icons, and theme toggle. `/components` opens the first component; `/components?view=overview` preserves the gallery.
