"""Validate local navigation without a server or third-party packages."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def project_lines():
    """The LINES entries in site.js: id -> the source text of that entry."""
    js = (ROOT / 'site.js').read_text()
    block = re.search(r'\nconst LINES = \{\n(.*?)\n\};\n', js, re.S).group(1)
    starts = [(m.group(1), m.start()) for m in re.finditer(r'^  (\w+): \{$', block, re.M)]
    return {name: block[start:(starts[i + 1][1] if i + 1 < len(starts) else len(block))]
            for i, (name, start) in enumerate(starts)}


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = []
        self.links = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if 'id' in values:
            self.ids.append(values['id'])
        for name in ('href', 'src'):
            if values.get(name):
                self.links.append(values[name])


class SiteTests(unittest.TestCase):
    def test_unique_ids(self):
        for path in ROOT.glob('*.html'):
            page = Page(path.read_text())
            self.assertEqual(len(page.ids), len(set(page.ids)), path.name)

    def test_local_links_and_anchors(self):
        for path in ROOT.glob('*.html'):
            for link in Page(path.read_text()).links:
                url = urlsplit(link)
                if url.scheme or url.netloc:
                    continue
                # Absolute paths can belong to separate GitHub Pages projects.
                if url.path.startswith('/'):
                    continue
                target = path.parent / unquote(url.path) if url.path else path
                if target.is_dir():
                    target = target / 'index.html'
                self.assertTrue(target.is_file(), f'{path.name}: {link}')
                # '#/name' fragments are routes handled by site.js, not element ids.
                if url.fragment and not url.fragment.startswith('/') and target.suffix == '.html':
                    self.assertIn(unquote(url.fragment), Page(target.read_text()).ids,
                                  f'{path.name}: {link}')

    def test_every_station_is_in_the_text_version(self):
        lines = project_lines()
        self.assertGreaterEqual(len(lines), 3)
        lofi = (ROOT / 'lofi.html').read_text().lower()
        for name in lines:
            self.assertIn(name, lofi, f'{name} is a station in site.js but not in lofi.html')

    def test_every_station_says_where_its_code_is(self):
        for name, src in project_lines().items():
            has_link = re.search(r"\b(code|live): 'https://", src)
            self.assertTrue(has_link or 'Private' in src,
                            f'{name} needs a code or live link, or the word Private')


if __name__ == '__main__':
    unittest.main()
