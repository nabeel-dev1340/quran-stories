# Publishing on Amazon KDP, step by step

Amazon KDP (kdp.amazon.com) is free to join and prints each paperback when it is ordered, so there is no stock to buy. Text to paste is in [`listing.md`](listing.md).

## 1. Account (once)

1. Sign up at kdp.amazon.com with your Amazon account.
2. **Tax information:** complete the tax interview (form W-8BEN for non-US individuals). If you live in Pakistan, give your CNIC as your foreign tax number and claim the US–Pakistan tax treaty (Article VIII, royalties); without a tax number, 30% is withheld from US sales. See the tax notes in [`where-to-sell.md`](where-to-sell.md).
3. **Payment information:** add the bank account royalties should be paid into. KDP pays monthly, about 60 days after the end of the month of the sale.

## 2. The paperback

**Bookshelf › + Create › Paperback**

**Page 1: details**
- Language: English.
- Title: **The Best of Stories**. Subtitle: **Quran Stories for Little Ones**.
- Author: **Nabeel Sharafat**.
- Description, keywords and categories: copy them from `listing.md`.
- Publishing rights: *I own the copyright and I hold the necessary publishing rights.*
- Reading age: Baby to 6. Adult content: No.

**Page 2: content**
- ISBN: *Get a free KDP ISBN*. Write the number down; it can be added to the copyright page later (see the end of this guide).
- Print options: **Premium colour**, **white paper**, trim size **8.5 × 8.5 in**, bleed **Bleed (PDF only)**, cover finish **Glossy** (matte also suits picture books).
- Manuscript: upload `dist/print/interior-kdp-ingramspark.pdf`.
- Cover: *Upload a cover you already have* → `dist/print/cover-kdp-premium-color.pdf`. If you choose standard colour instead, upload `dist/print/cover-kdp-standard-color.pdf`, which has the thinner spine that paper needs.
- **AI-generated content:** answer **Yes** for text and **Yes** for images, and pick the amount of editing that matches what you did. Amazon uses this internally and does not show it on the book's page.
- Launch the **Print Previewer**, check the pages and approve.

**Page 3: pricing**
- Territories: all. Primary marketplace: Amazon.com.
- List price: see `listing.md` (suggested $22.99 for premium colour). KDP shows your earnings for each marketplace as you type.
- Leave Expanded Distribution off; at these prices it earns almost nothing.
- **Order a proof copy** (Bookshelf › ⋯ › Request printed proofs) before you click Publish, to check the colours on paper.

Reviews take up to 72 hours. The paperback then appears on Amazon US, UK, Canada, Australia, Japan and most EU stores.

## 3. The Kindle ebook

**Bookshelf › + Create › Kindle eBook**. Use the same details as the paperback, then on the content page either:

- **Option A, the EPUB:** upload `dist/ebook/The-Best-of-Stories.epub`. First open it in Amazon's free **Kindle Previewer** app on a computer to check the pages and the converted file size.
- **Option B, Kindle Create:** if the EPUB doesn't look right in Kindle Previewer, open `dist/ebook/The-Best-of-Stories.pdf` in Amazon's free **Kindle Create** app (Windows or Mac), save the `.kpf` file it makes, and upload that.

Then:

- Cover: `dist/ebook/cover-2560x2560.jpg`.
- AI-generated content: Yes for text and Yes for images, as for the paperback.
- **KDP Select: leave it unticked** if you will also sell the PDF or EPUB on Etsy, Apple Books or anywhere else. Select requires the ebook to be sold only on Amazon.
- Price: $6.99. Pick the 70% royalty unless KDP shows a delivery file over about 23 MB, in which case 35% pays more.

## 4. After publishing

- **Link the two editions:** KDP usually does this within a few days; if not, ask KDP support to link them.
- **Author Central** (author.amazon.com): claim the book and add a photo and bio.
- **A+ Content** (KDP › Marketing): add `dist/marketing/aplus-970x600.jpg` and the look-inside spreads.
- **Ask early readers for honest reviews.** Never pay for reviews or swap them; Amazon removes those.

## Adding the ISBN to the copyright page

Put the number in `src/content/publishing.js` (for example `paperback: '979-8-...'`) and run `npm run build:print`. Then upload the new interior PDF to the same paperback in KDP; a new interior file goes through review again, but nothing else changes. Or send me the number and I'll do it.
