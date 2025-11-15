---
title: "How to Setup Google Fonts in Electron Apps"
description: ""
date: "November 08 2025"
---

As a developer, adding custom fonts in your Electron.js applications always 
gives a clean and polished finishing. I am writing this guide to walk you 
through on the steps required manually add fonts to your app.

## Step 1: Scaffolding - Electron, Vite and TailwindCSS

In order to get started, use the `@quick-start/create-electron` template. Here's 
a link to the setup steps for your [Electron, Vite and TypeScript app.](https://www.npmjs.com/package/@quick-start/create-electron)

Once the initial scaffolding is complete, you can add **TailwindCSS v4** to it 
like any other Vite project.

```bash
# If npm is your package manager
npm install tailwindcss @tailwindcss/vite @tailwindcss/typography

# If yarn is your package manager
yarn add tailwindcss @tailwindcss/vite @tailwindcss/typography

# If pnpm is your package manager
pnpm add tailwindcss @tailwindcss/vite @tailwindcss/typography

# At the time of writing, "bun" is not recommended for Electron apps.
```

Next, edit the `electron.vite.config.js` file as follows
```js
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
// Import: `tailwindcss()` as plugin
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		resolve: {
			alias: {
				"@renderer": resolve("src/renderer/src"),
			},
		},
        // Add: `tailwindcss()` as plugin
		plugins: [react(), tailwindcss()],
	},
});
```

## Step 2: Download the Font Files from Google Font

- Head over to [Google Fonts](https://fonts.google.com/) and choose a font of your
choice. For this guide, I am choosing the [Inter](https://fonts.google.com/specimen/Inter?preview.text=Whereas%20recognition%20of%20the%20inherent%20dignity) font and downloading all the variants. 

- Download and unzip the `.ttf` files. We need to get the variable length 
font file and not the static font files.

- Move the variable-length `.ttf` files to `src/renderer/src/assets/fonts/` directory
for your font.

## Step 3: Import and Use the Font

Finally, time to setup `src/renderer/src/assets/index.css`. You can clear out all 
other CSS files. One file is enough. Import the same in `main.tsx`.

Add this in the top level configuration:
```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";

@font-face {
  font-family: 'Inter';
  src: url('/src/assets/fonts/Inter.ttf') format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
...
```

Import it as the global font in the same file.
```css
...

/* Contains default configs for Desktop apps */
@layer base {
  #root {
    height: 100%;
  }

  html,
  body {
    height: 100%;

    user-select: none;
    -webkit-user-select: none;

    font-family:
    /* Added "Inter" font as default font-family */
      'Inter', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
    -webkit-font-smoothning: antialiased;
    -moz-osx-font-smoothning: grayscale;
    color: #ffffff;

    overflow: hidden;
  }
  header {
    -webkit-app-region: drag;
  }
  button {
    -webkit-app-region: no-drag;
  }
  ::-webkit-scrollbar {
    width: 0.5rem;
  }
  ::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 0.375rem;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
}
```

And that's it. Now, you can use this in your application.

## Verify the Installation

Try adding the following code in `App.tsx` and run using `npm run dev` or 
your package manager of choice. You should see your font.

```jsx
function App(): React.JSX.Element {
  return (
    <div className="text-xl text-black">
      Hello World. My font should render.
    </div>
  );
}

export default App
```

