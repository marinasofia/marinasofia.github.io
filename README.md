# Marina Martin's portfolio

A static personal website presenting Marina Martin's AI engineering, analytics,
and software projects.

[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-deployed%20static%20export-blue)](docs/maintenance.md)

[Open the live portfolio](https://marinasofia.github.io/).

## Quickstart

Requires Python 3 for a local static server. No package install or credentials
are needed. Run this in a terminal and leave it running while previewing:

```bash
git clone https://github.com/marinasofia/marinasofia.github.io.git
cd marinasofia.github.io
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:8000/) in a browser. Stop the server
with Ctrl+C. Use another port if 8000 is occupied.

## Architecture and features

`index.html` is a self-contained export with embedded CSS, JavaScript, fonts,
and imagery. Its loader creates the page through an embedded custom component
runtime and React 18.3.1. There is currently no editable source/build project,
package manifest, or dependency lockfile in this repository.

The site provides project and experience sections, a command palette, a theme
toggle, responsive styling, and reduced-motion handling. Contact composition
opens the visitor's mail client through a `mailto:` link; this repository does
not contain a server that sends mail. Browser support and accessibility still
need broader verification.

## Development and configuration

Use the local server above and browser developer tools to inspect console errors,
layout, keyboard focus, and links. The current export has no environment
configuration. Changes to content or layout are difficult to review within its
embedded payload; recover maintainable source before substantial redesigns.
Do not add API credentials to a static site because its files are public.

GitHub Pages publishes the site. The September 4, 2026 audit found a deployed
page but no custom pre-merge quality checks. The main HTML file is about 1.02 MB
before transfer compression; this is an artifact size, not a measured page-load
time. Third-party runtime and asset provenance need an explicit inventory.

## Status and roadmap

TODO: complete the [source, asset-provenance, and accessibility follow-up](https://github.com/marinasofia/marinasofia.github.io/issues/1).
It includes semantic headings, document language, keyboard navigation, mobile
checks, reproducible builds, and validation before Pages deployment. Public
project metrics should link to their dated source repository evidence.

See [CONTRIBUTING.md](CONTRIBUTING.md), [maintainer guidance](docs/maintenance.md),
[CHANGELOG.md](CHANGELOG.md), [SECURITY.md](SECURITY.md), and
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License and assets

The existing repository license is [MIT](LICENSE). Embedded third-party libraries,
fonts, and images require their own source and license inventory; their terms
are not established merely by the repository license. Asset provenance is part
of the linked follow-up. Preserve existing notices when recovering source.
