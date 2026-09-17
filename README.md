# Marina Martin Portfolio

Interactive door entrance and a portfolio covering AI systems, financial automation, and applied machine learning.

## Local preview

This site uses static HTML, CSS, and JavaScript. No build step is required.

```sh
python3 -m http.server 8017 --bind 127.0.0.1
```

Open `http://127.0.0.1:8017/`.

## Pages

- `index.html`: animated door entrance, selected projects, experience, and about.
- `knowledge-assistant.html`: document retrieval and review case study.
- `statement-agent.html`: PDF extraction and validation case study.
- `rekindle.html`: communication cadence model case study.
- `sourcer.html`: job discovery and matching case study.
- `assets/Marina_Martin_Resume.pdf`: downloadable resume.
- `styles.css`: responsive layouts, door animation, and light and dark themes.
- `site.js`: door interaction, pause control, accessible project reveal, and theme preference, and interactive sample walkthroughs.

The door illustration is built directly in HTML and CSS. It requires no video file, paid generation service, or 3D runtime. The door descends onto a stationary docking platform, settles, and opens before a camera-style transition reveals the projects. The entrance can be skipped, motion can be paused, and reduced-motion preferences are respected. Project content and links are accessible without JavaScript. Direct links to page sections bypass the entrance. Google Fonts supplies Instrument Serif and DM Sans, with system fallbacks.

## Validation

```sh
node --check site.js
git diff --check
```

Check the entrance, pause and skip controls, keyboard navigation, both themes, resume link, project navigation, and mobile layouts before publishing.

## Publishing

GitHub Pages serves the repository root from `main` at https://marinasofia.github.io/. Pushing to `main` publishes updates to the public portfolio.

[MIT license](LICENSE)

## Interactive walkthroughs

Each featured project includes a local demo on the homepage and its case study:

- Knowledge Assistant: sample policy search, source passages, and a review queue state.
- Statement Agent: sample extraction, a duplicate flag, reviewer resolution, and replay.
- ReKindle: regular, interrupted, and insufficient contact-history examples.
- Sourcer: fictional role filtering and template introductions using portfolio experience.

All sample data is labeled. These demos do not call live AI services, upload documents, or send applications.

Browser validation covered desktop and 390px layouts, landing completion, entry navigation, policy search and review, transaction review, contact scenarios, and job filtering and draft preparation. Static validation checked local links, assets, page anchors, unique element IDs, JavaScript syntax, and removal of portrait references.

## Doorway transition

Clicking Unlock my world turns a metallic key, swings the door open, zooms through an empty black doorway, and animates loose letters into the actual project heading. The transition takes approximately two seconds. Letters use measured text positions to prevent a final layout jump. Escape, a viewport resize, or a reduced-motion preference finishes the transition immediately and restores focus and scrolling. Paused-motion users enter directly. Temporary animation elements are removed afterward.

Validation included normal-speed entry, frozen intermediate animation frames, a 390px mobile layout, Escape cleanup, JavaScript syntax, and retention of the public resume without a phone number.

## White studio presentation

The entrance uses a white background, softly colored moving doors, system typography, and a key-unlocking animation. The content defaults to white. Theme preferences use a new storage key so an older saved dark preference does not override the refreshed default. Visitors can still explicitly choose dark mode. Desktop and 390px mobile checks covered the white theme, complete entry animation, scroll restoration, and horizontal overflow.
