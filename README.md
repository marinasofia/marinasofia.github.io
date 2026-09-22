# Marina Martin Portfolio

A static portfolio with project case studies and browser-based sample walkthroughs.

[Open the portfolio](https://marinasofia.github.io/)

## Run locally

```sh
python3 -m http.server 8017 --bind 127.0.0.1
```

Open `http://127.0.0.1:8017/`. No build step or API key is required.

## Source guide

- `index.html`: introduction, selected projects, experience, and contact.
- `knowledge-assistant.html`, `statement-agent.html`, and `rekindle.html`: case studies.
- `site.js`: navigation, motion controls, theme preference, and sample walkthroughs.
- `styles.css`: responsive layouts and themes.

Walkthroughs use labeled sample data. They do not upload documents, call model APIs, or submit applications. Private-source case studies are identified as such.

## Accessibility and validation

The entrance supports skip, pause, Escape, and reduced-motion preferences. Core project links remain available without JavaScript.

```sh
node --check site.js
python3 -m unittest discover -s tests -v
git diff --check
```

Before publishing, check keyboard navigation, both themes, project links, and a narrow mobile viewport. Automated checks validate local links, page anchors, and unique IDs; they do not replace browser testing.

## Publishing and privacy

GitHub Pages publishes the repository root from `main`. A push to `main` changes the live portfolio. Google Fonts is loaded from a third party with system-font fallbacks. The theme preference is stored locally in the browser.

[MIT license](LICENSE) | [Security](SECURITY.md)
