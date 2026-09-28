---
name: seo-fundamentals
description: SEO fundamentals, E-E-A-T, Core Web Vitals, and Google algorithm principles.
allowed-tools: Read, Glob, Grep
---

# SEO Fundamentals

> Principles for search engine visibility.

---

## 1. E-E-A-T Framework

| Principle | Signals |
|-----------|---------|
| **Experience** | First-hand knowledge, real examples |
| **Expertise** | Credentials, depth of knowledge |
| **Authoritativeness** | Backlinks, mentions, industry recognition |
| **Trustworthiness** | HTTPS, transparency, accurate info |

---

## 2. Core Web Vitals

| Metric | Target | Measures |
|--------|--------|----------|
| **LCP** | < 2.5s | Loading performance |
| **INP** | < 200ms | Interactivity |
| **CLS** | < 0.1 | Visual stability |

---

## 3. Technical SEO Principles

### Site Structure

| Element | Purpose |
|---------|---------|
| XML sitemap | Help crawling |
| robots.txt | Control access |
| Canonical tags | Prevent duplicates |
| HTTPS | Security signal |

### Performance

| Factor | Impact |
|--------|--------|
| Page speed | Core Web Vital |
| Mobile-friendly | Ranking factor |
| Clean URLs | Crawlability |

---

## 4. Content SEO Principles

### Page Elements

| Element | Best Practice |
|---------|---------------|
| Title tag | 50-60 chars, keyword front |
| Meta description | 150-160 chars, compelling |
| H1 | One per page, main keyword |
| H2-H6 | Logical hierarchy |
| Alt text | Descriptive, not stuffed |

### Content Quality

| Factor | Importance |
|--------|------------|
| Depth | Comprehensive coverage |
| Freshness | Regular updates |
| Uniqueness | Original value |
| Readability | Clear writing |

---

## 5. Schema Markup Types

| Type | Use |
|------|-----|
| Article | Blog posts, news |
| Organization | Company info |
| Person | Author profiles |
| FAQPage | Q&A content |
| Product | E-commerce |
| Review | Ratings |
| BreadcrumbList | Navigation |

---

## 6. AI Content Guidelines

### What Google Looks For

| ✅ Do | ❌ Don't |
|-------|----------|
| AI draft + human edit | Publish raw AI content |
| Add original insights | Copy without value |
| Expert review | Skip fact-checking |
| Follow E-E-A-T | Keyword stuffing |

---

## 7. Ranking Factors (Prioritized)

| Priority | Factor |
|----------|--------|
| 1 | Quality, relevant content |
| 2 | Backlinks from authority sites |
| 3 | Page experience (Core Web Vitals) |
| 4 | Mobile optimization |
| 5 | Technical SEO fundamentals |

---

## 8. Measurement

| Metric | Tool |
|--------|------|
| Rankings | Search Console, Ahrefs |
| Traffic | Analytics |
| Core Web Vitals | PageSpeed Insights |
| Indexing | Search Console |
| Backlinks | Ahrefs, Semrush |

---

## 9. Edge Hosting, Clean URLs & Canonical Discipline

### The Edge Redirect Loop Trap
Modern hosting platforms (Cloudflare Pages, Vercel, Netlify) automatically strip `.html` extensions by default (`/contact.html` -> 308/301 -> `/contact`).
- **Critical Rule**: If the canonical tag references `/contact.html` while the server redirects `/contact.html` to `/contact`, it creates a canonical vs redirect mismatch or circular crawl trap.
- **Protocol**: Always align canonical URLs and internal links to the clean route (`https://domain.com/contact`).
- **Sitemap Consistency**: All `<loc>` tags in `sitemap.xml` must match the clean canonical URL exactly.

### Selective Indexing Architecture
Avoid burning crawl budget or indexing half-baked templates.
- **Indexable**: Only high-value landing and functional pages (e.g. `index.html`, `/contact`). Include in `sitemap.xml`.
- **Non-Indexable**: Internal demo pages, template variants, or incomplete drafts. Add:
  ```html
  <meta name="robots" content="noindex, nofollow">
  ```
  and exclude them from `sitemap.xml`.

---

## 10. Agentic Engine Optimization (AEO / LLM SEO)

Search engines and AI agents (ChatGPT, Claude, Perplexity, Gemini) actively fetch markdown context from websites:
1. **`llms.txt` Standard**: Place at the web root (`/llms.txt`).
   - Must include an H1 project summary, core description, and structured sections.
   - Per llmstxt.org specification, always include a `## Links & Documentation` section providing direct, clean URLs to canonical pages.
2. **`llms-full.txt`**: Complete concatenated text context for agents needing deep technical ingestion.

---

## 11. Google Search Console: Indexing Protocol

### Auto-Crawling vs. Manual Priority Request
- **Auto-Crawling (Passive)**: Googlebot regularly revisits sitemaps and discovered URLs. For low-frequency sites, this takes anywhere from **3 days to 4 weeks**.
- **Manual Priority Request (Active)**:
  1. Open Google Search Console -> **URL Inspection**.
  2. Paste the live URL (e.g. `https://domain.com/` or `https://domain.com/contact`).
  3. Click **"Test Live URL"** to verify rendering, status 200, and canonical tag recognition.
  4. Click **"Request Indexing"**. This places the URL directly into Googlebot's **high-priority crawl queue (typically re-crawled within 12–48 hours)**.
- **When to Request Indexing**:
  - Major typography/visual redesigns affecting Core Web Vitals.
  - New page additions or canonical URL restructuring.
  - Critical meta tag/robots updates.

---

> **Remember:** SEO is a long-term game. Quality content + technical excellence + patience = results.

