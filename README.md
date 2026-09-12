# Marina Martin

Personal portfolio featuring retrieval systems, AI agents and workflow automation.

[View the portfolio](https://marinasofia.github.io/)

## Development

Static HTML, CSS and JavaScript. No package installation or build step.

```sh
python3 -m http.server 8017 --bind 127.0.0.1
```

Open `http://127.0.0.1:8017`.

## Files

- `index.html` contains the introduction, selected projects and experience.
- `knowledge-assistant.html` contains the project overview.
- `styles.css` defines the responsive layout and color themes.
- `site.js` handles theme switching and the interactive backdrop.
- `assets/` contains the portrait and skyline.

## Validation

```sh
node --check site.js
git diff --check
```

Check navigation, responsive layouts, both themes and reduced-motion behavior
when changing the interface. Core content and project links work without JavaScript.

## Deployment

GitHub Pages publishes the repository root from `main`.

[MIT license](LICENSE)
