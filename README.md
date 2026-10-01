<div align="center">
  <a href="https://mox-ui.vercel.app">
    <img src="public/assets/repoassets/repoimg.png" alt="Mox UI" width="100%" />
  </a>
</div>

<div align="center">

**A shadcn registry of rare, ready-to-use components and animations.**

<img src="https://img.shields.io/badge/Next.js-0a0a0a?logo=nextdotjs&logoColor=FC4C01" alt="Next.js" />
<img src="https://img.shields.io/badge/Tailwind_CSS-0a0a0a?logo=tailwindcss&logoColor=FC4C01" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/TypeScript-0a0a0a?logo=typescript&logoColor=FC4C01" alt="TypeScript" />
<img src="https://img.shields.io/badge/shadcn-registry-FC4C01?labelColor=0a0a0a" alt="shadcn registry" />

[**mox-ui.vercel.app**](https://mox-ui.vercel.app) &nbsp;&middot;&nbsp; [Components](https://mox-ui.vercel.app/components) &nbsp;&middot;&nbsp; [Follow on X](https://x.com/mox)

</div>

<br />

Mox UI is a shadcn registry built with Next.js, Tailwind CSS, and TypeScript. Every component is animated with Motion, honors `prefers-reduced-motion`, and installs straight into your codebase. You own the code: no package to depend on, restyle anything.

## Quick start

Install any component with the shadcn CLI:

```bash
npx shadcn@latest add mox/mox-ui/{component-name}
```

For example:

```bash
npx shadcn@latest add mox/mox-ui/fluid-orb
```

Browse every component, with live previews and props, at [mox-ui.vercel.app/components](https://mox-ui.vercel.app/components).

## Running locally

```bash
git clone https://github.com/mox/mox-ui.git
cd mox-ui
npm install
npm run dev
```

Components live in `components/ui`. After changing a component or `registry.json`, rebuild the registry output with `npm run registry:build`.

## Credits

Mox UI began as a fork of [MOX UI](https://github.com/Moxsahil/mox-ui) by
[@Mox_sahil01](https://x.com/Mox_sahil01), and is MIT licensed under the terms of that
original work. The component code is inherited from it; the Mox UI name, logo and site
design are separate.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full walkthrough, from creating a component to a working install command.

<div align="center">
  <br />
  <img src="public/logos/moxui.svg" alt="" width="28" />
  <p><sub>Built by <a href="https://x.com/mox">@mox</a></sub></p>
</div>
