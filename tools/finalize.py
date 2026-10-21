"""Add bookmarks, document info and a two-page (spread) layout to the PDF."""
import json
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, FloatObject, NameObject, TextStringObject

pdf_path, outline_path = sys.argv[1], sys.argv[2]
outline = json.load(open(outline_path, encoding="utf-8"))

writer = PdfWriter(clone_from=PdfReader(pdf_path))
writer.add_metadata({
    "/Title": "The Best of Stories — Quran Stories for Little Ones",
    "/Subject": "42 illustrated stories from the Quran, retold for reading aloud to babies and young children",
    "/Keywords": "Quran stories, prophets, Islamic children's book, bedtime stories, duas",
    "/Creator": "quran-stories book builder",
})
# Show the cover on its own, then the art + text spreads side by side.
writer._root_object[NameObject("/PageLayout")] = NameObject("/TwoPageRight")
writer._root_object[NameObject("/Lang")] = TextStringObject("en")

# Print version: mark the trim (8.5in) inside the 0.125in bleed on every page.
bleed = 9  # points
for page in writer.pages:
    w = float(page.mediabox.width)
    if abs(w - 630) < 1:
        page[NameObject("/BleedBox")] = ArrayObject([FloatObject(v) for v in (0, 0, 630, 630)])
        page[NameObject("/TrimBox")] = ArrayObject([FloatObject(v) for v in (bleed, bleed, 630 - bleed, 630 - bleed)])

parent = None
for title, page, level in outline:
    item = writer.add_outline_item(title, page - 1, parent=parent if level == 1 else None)
    if level == 0:
        parent = item

with open(pdf_path, "wb") as fh:
    writer.write(fh)
print(f"finalized {pdf_path}: {len(outline)} bookmarks")
