# Marina Martin Portfolio

A static portfolio built as a record shop: each project is a record that plays on a turntable, with its case study as the track list and a sample run you can try.

[Open the portfolio](https://marinasofia.github.io/)

## Run locally

```sh
python3 -m http.server 8017 --bind 127.0.0.1
```

Open `http://127.0.0.1:8017/`. There is no build step and no API key.

## Source guide

- `index.html`: the shop, the crate of four records, the turntable room with every case study, experience, and contact.
- `site.js`: the crate, the turntable and room lighting, sound, and the four sample runs.
- `styles.css`: the record shop visual system and responsive layouts.
- `sourcer.html`, `rekindle.html`, `knowledge-assistant.html`, `statement-agent.html`: redirects that keep older links working.
- `assets/fonts/`: self-hosted Bricolage Grotesque, Martian Mono (SIL Open Font License) and Permanent Marker (Apache License).
- `assets/music/`: tracks by Kevin MacLeod ([incompetech.com](https://incompetech.com)), licensed under [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/) and credited on each record.
- `tests/`: link, anchor, and ID checks that run in CI.

Sample runs use labeled sample data, entirely in the browser.

## Accessibility

Sound starts only after a visitor picks a record, and the mute setting is remembered. Reduced motion turns off spinning and animation. The crate, turntable, and sample runs work from the keyboard, and core content is readable without JavaScript.

## Checks

```sh
node --check site.js
python3 -m unittest discover -s tests -v
```

CI runs both, plus a copy lint with Vale.

## Publishing

GitHub Pages publishes `main`. Fonts and music are self-hosted, so the site makes no third-party requests.

[MIT license](LICENSE) · [Security](SECURITY.md)
