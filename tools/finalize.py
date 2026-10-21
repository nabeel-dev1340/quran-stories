"""Finish a PDF made by tools/build.mjs: document info, bookmarks, page
labels (ebook) and trim/bleed boxes (print editions).

    python3 tools/finalize.py <pdf> <finalize-<edition>.json>
"""
import json
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.constants import PageLabelStyle
from pypdf.generic import ArrayObject, FloatObject, NameObject, TextStringObject

pdf_path, meta_path = sys.argv[1], sys.argv[2]
meta = json.load(open(meta_path, encoding="utf-8"))
edition = meta["edition"]
publishing = meta["publishing"]

writer = PdfWriter(clone_from=PdfReader(pdf_path))
writer.add_metadata({
    "/Title": "The Best of Stories: Quran Stories for Little Ones",
    "/Author": publishing["author"],
    "/Subject": "42 illustrated stories from the Quran, retold for reading aloud to babies and young children",
    "/Keywords": "Quran stories, prophets, Islamic children's book, bedtime stories, duas, Muslim baby book",
    "/Creator": "quran-stories book builder",
})
writer._root_object[NameObject("/Lang")] = TextStringObject("en")

BLEED = 9  # 0.125in in points
TRIM = 612  # 8.5in in points
if edition == "ebook":
    # Show the cover alone, then art + text spreads side by side.
    writer._root_object[NameObject("/PageLayout")] = NameObject("/TwoPageRight")
    # Page labels match the numbers printed in the book: Cover, Inside cover,
    # 1 … 106, Back cover.
    labels = meta["labels"]
    first_num = labels.index("1")
    writer.set_page_label(0, 0, prefix="Cover")
    writer.set_page_label(1, first_num - 1, prefix="Inside cover")
    writer.set_page_label(first_num, first_num + meta["interiorCount"] - 1, style=PageLabelStyle.DECIMAL, start=1)
    writer.set_page_label(len(labels) - 1, len(labels) - 1, prefix="Back cover")
else:
    # Mark where the printer trims each page. Chromium rounds the page size a
    # hair (621.12pt for 8.625in), so set the exact size printers expect.
    exact = {"kdp": (TRIM + BLEED, TRIM + 2 * BLEED), "lulu": (TRIM + 2 * BLEED, TRIM + 2 * BLEED)}[edition]
    for i, page in enumerate(writer.pages):
        w, h = exact
        box = ArrayObject([FloatObject(0), FloatObject(0), FloatObject(w), FloatObject(h)])
        page[NameObject("/MediaBox")] = box
        page[NameObject("/CropBox")] = box
        if edition == "kdp":
            recto = (i + 1) % 2 == 1  # odd pages are right-hand pages: spine on the left
            x0 = 0 if recto else BLEED
        else:
            x0 = BLEED
        page[NameObject("/BleedBox")] = ArrayObject([FloatObject(v) for v in (0, 0, w, h)])
        page[NameObject("/TrimBox")] = ArrayObject([FloatObject(v) for v in (x0, BLEED, x0 + TRIM, BLEED + TRIM)])

parent = None
for title, page_no, level in meta["outline"]:
    item = writer.add_outline_item(title, page_no - 1, parent=parent if level == 1 else None)
    if level == 0:
        parent = item

with open(pdf_path, "wb") as fh:
    writer.write(fh)
print(f"finalized {pdf_path} ({edition}): {len(writer.pages)} pages, {len(meta['outline'])} bookmarks")
