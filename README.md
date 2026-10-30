# Marina Martin Portfolio

A night ride on a New York subway car, built in three.js. The ad cards, the strip map, the sign over the door, the payphone and the paper on the seat each open part of the portfolio. Each project is its own stop: step off the train onto the platform and read it on a lit poster that rolls from panel to panel.

[Open the portfolio](https://marinasofia.github.io/) · [Text version](https://marinasofia.github.io/lofi.html)

A short recording of the ride is on the [GitHub profile](https://github.com/marinasofia). The re-encoded GIF came out over 2 MB, so it is not checked in here.

## Why

The site is a product demo of the same habits as the projects. Measure: every project panel leads with a number and says how it was measured. Fall back: no WebGL, no JavaScript or a slow connection lands on the text version with the same content. Keep it accessible: everything works from the keyboard, reduced motion is respected and the 3D scene is marked decorative.

## Run locally

```sh
python3 -m http.server 8018 --bind 127.0.0.1
```

Open `http://127.0.0.1:8018/`. There is no build step and no API key.

## Source guide

- `index.html`: the page shell, the sheets for About, Work and Contact, the platform placard and the terminal.
- `site.js`: the car, the stations, the platform with its three project spots, the trains, and the copy for every panel.
- `site.css`: the overlays, set in vintage print type on aged paper.
- `lofi.html`: the same content as a plain page, for quick reading and for browsers without WebGL.
- `assets/vendor/`: self hosted three.js and GSAP (see Vendored).
- `sourcer.html`, `rekindle.html`, `knowledge-assistant.html`, `statement-agent.html`: redirects that keep older links working.
- `tests/`: link, anchor and ID checks that run in CI.

## Vendored

- three.js r160 (`assets/vendor/three.module.js`, `REVISION = '160'`) and its `RoomEnvironment` addon.
- GSAP 3.12.5 (`assets/vendor/gsap.min.js`).

Cache busting is the `?v=` query on `site.css` and `site.js` in `index.html`; bump it when either file changes.

## Accessibility

Reduced motion turns off the camera moves, the swaying car and the trains. Every part of the site is reachable from the keyboard: A, W, T and C open About, Work, the terminal and Contact, 1 2 3 open the projects, L opens the text version, the arrow keys move through a project, and Esc returns to the car. The text version has everything without the 3D scene. On touch screens a one time hint says what to tap.

## Checks

```sh
node --check site.js
python3 -m unittest discover -s tests -v
```

CI runs both, plus a copy lint with Vale.

## Publishing

GitHub Pages publishes `main`. Developed privately; the first public commit is a squash.

[MIT license](LICENSE) · [Security](SECURITY.md)
