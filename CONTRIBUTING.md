# Contributing

Follow the [Code of Conduct](CODE_OF_CONDUCT.md) and use [SECURITY.md](SECURITY.md)
for sensitive concerns. Do not post personal messages or contact-form content.

## Preview and review

Start `python3 -m http.server 8000 --bind 127.0.0.1` from the checkout and open
the local page. No Node installation or build command is currently required.
Check the changed content on narrow and wide viewports, keyboard navigation,
reduced motion, both themes, and the browser console. Do not submit a real email
while testing the contact controls. Use `git diff --check` before committing.

There is no browser test suite or custom CI quality gate yet. A successful
Pages deployment does not prove layout, accessibility, or link correctness.
Document exactly what was checked in the pull request.

## Scope and source

The HTML contains embedded generated assets and runtime code. Preserve the
current design and source notices. Recover an editable, reproducible build
before large structural changes; do not introduce another opaque export.
Content claims must have a dated source or maintainer confirmation. Avoid
duplicating changing project metrics when a link to the project is sufficient.

Keep PRs focused and update [CHANGELOG.md](CHANGELOG.md). Include browser tests
with behavior changes as the harness is introduced. Use TODOs linked to issues
for unfinished work. Avoid em and en dashes in new text, comments, or commit
messages. Branch and release guidance is in [docs/maintenance.md](docs/maintenance.md).
