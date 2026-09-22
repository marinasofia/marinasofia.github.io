"""Validate local navigation without a server or third-party packages."""
from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


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
                if url.fragment and target.suffix == '.html':
                    self.assertIn(unquote(url.fragment), Page(target.read_text()).ids,
                                  f'{path.name}: {link}')


if __name__ == '__main__':
    unittest.main()
