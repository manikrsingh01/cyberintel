---
name: performance-profiling
description: Performance profiling principles. Measurement, analysis, and optimization techniques.
allowed-tools: Read, Glob, Grep, Bash
---

# Performance Profiling

> Measure, analyze, optimize - in that order.

## 🔧 Runtime Scripts

**Execute these for automated profiling:**

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/lighthouse_audit.py` | Lighthouse performance audit | `python scripts/lighthouse_audit.py https://example.com` |

---

## 1. Core Web Vitals

### Targets

| Metric | Good | Poor | Measures |
|--------|------|------|----------|
| **LCP** | < 2.5s | > 4.0s | Loading |
| **INP** | < 200ms | > 500ms | Interactivity |
| **CLS** | < 0.1 | > 0.25 | Stability |

### When to Measure

| Stage | Tool |
|-------|------|
| Development | Local Lighthouse |
| CI/CD | Lighthouse CI |
| Production | RUM (Real User Monitoring) |

---

## 2. Profiling Workflow

### The 4-Step Process

```
1. BASELINE → Measure current state
2. IDENTIFY → Find the bottleneck
3. FIX → Make targeted change
4. VALIDATE → Confirm improvement
```

### Profiling Tool Selection

| Problem | Tool |
|---------|------|
| Page load | Lighthouse |
| Bundle size | Bundle analyzer |
| Runtime | DevTools Performance |
| Memory | DevTools Memory |
| Network | DevTools Network |

---

## 3. Bundle Analysis

### What to Look For

| Issue | Indicator |
|-------|-----------|
| Large dependencies | Top of bundle |
| Duplicate code | Multiple chunks |
| Unused code | Low coverage |
| Missing splits | Single large chunk |

### Optimization Actions

| Finding | Action |
|---------|--------|
| Big library | Import specific modules |
| Duplicate deps | Dedupe, update versions |
| Route in main | Code split |
| Unused exports | Tree shake |

---

## 4. Runtime Profiling

### Performance Tab Analysis

| Pattern | Meaning |
|---------|---------|
| Long tasks (>50ms) | UI blocking |
| Many small tasks | Possible batching opportunity |
| Layout/paint | Rendering bottleneck |
| Script | JavaScript execution |

### Memory Tab Analysis

| Pattern | Meaning |
|---------|---------|
| Growing heap | Possible leak |
| Large retained | Check references |
| Detached DOM | Not cleaned up |

---

## 5. Common Bottlenecks

### By Symptom

| Symptom | Likely Cause |
|---------|--------------|
| Slow initial load | Large JS, render blocking |
| Slow interactions | Heavy event handlers |
| Jank during scroll | Layout thrashing |
| Growing memory | Leaks, retained refs |

---

## 6. Quick Win Priorities

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Enable compression | High |
| 2 | Lazy load images | High |
| 3 | Code split routes | High |
| 4 | Cache static assets | Medium |
| 5 | Optimize images | Medium |

---

## 7. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Guess at problems | Profile first |
| Micro-optimize | Fix biggest issue |
| Optimize early | Optimize when needed |
| Ignore real users | Use RUM data |

---

## 8. Mobile Slow 4G Reality & Render-Blocking Mitigation

### The Desktop vs. Mobile Discrepancy
A site scoring 90+ on Desktop often scores 50–60 on Mobile PageSpeed Insights.
- **Root Cause**: Mobile Lighthouse simulates a low-end device (Moto G Power) on **Slow 4G** (1.6 Mbps throughput, 150ms round-trip latency, 4× CPU throttling).
- On this connection, every 50 KB of render-blocking CSS/fonts delays First Contentful Paint (FCP) by 1.5–2.5 seconds.

### Critical Elimination Rules
1. **No Broken Local Font Paths**: If a local stylesheet references fonts that 404, the browser stalls waiting for timeout before falling back to system fonts, killing FCP.
2. **Strict Font Budget**: Never load 3+ disparate font families. Cap at 2 families and prune weight ranges (e.g. 500, 600, 700 for headings; 400, 500, 600 for body).
3. **Preconnect Early**: Include `<link rel="preconnect" href="https://fonts.googleapis.com">` and `crossorigin` on `https://fonts.gstatic.com`.
4. **Deferred Global Scripts**: Never block rendering with initialization scripts. Guard against execution race conditions by checking `if (document.body)` immediately rather than waiting exclusively for `DOMContentLoaded`.

---

## 9. Responsive Image Preloading for LCP

### The Double-Download Trap
Adding a static `<link rel="preload" as="image" href="hero-desktop.webp">` forces mobile browsers to download the heavy desktop image AND then render the mobile image from the `<picture>` tag.

### The Responsive Preload Pattern
Match the `<head>` preload directly to the `<picture>` media queries:
```html
<link rel="preload" as="image" href="assets/images/hero-600.webp" media="(max-width: 767px)">
<link rel="preload" as="image" href="assets/images/hero.webp" media="(min-width: 768px)">
```
- **Mobile devices**: Download only the 20–25 KB 600px asset.
- **Desktop displays**: Download the full native asset.
- **Result**: Max visual sharpness with 0ms wasted bandwidth.

---

## 10. The Hidden Payload Traps (Source Maps & Speculative Preloads)

### 1. Vendor CSS Sourcemap Bloat
- **Trap**: Minified vendor stylesheets (e.g. `bootstrap.min.css`) sometimes have hundreds of kilobytes of JSON source maps (`{"version":3,"sources":...}`) prepended or inlined directly into the CSS file.
- **Impact**: Inflates wire transfer from 27 KB to 124 KB, wasting 3–4 seconds on Slow 4G mobile connections.
- **Audit**: Always check raw byte count and first lines of vendor files:
  ```bash
  python3 -c "with open('assets/plugins/bootstrap/bootstrap.min.css') as f: print(f.readline()[:100])"
  ```

### 2. Picture Fallback Speculative Preload Trap
- **Trap**: In `<picture><source srcset="mobile.webp"><img src="hero.png"></picture>`, modern browser speculative preloaders parse `<img> src` immediately and download `hero.png` (e.g. 388 KB) before layout evaluates `<source>`. Both images get downloaded!
- **Solution**: Always point the fallback `<img> src` to the mobile-optimized asset (`hero-600.webp`).

### 3. Icon Font Redundancy
- **Trap**: Loading multiple icon families (e.g. FontAwesome + Bootstrap Icons) simultaneously.
- **Impact**: Consumes 275+ KB of icon woff2 files and stalls critical rendering paths.
- **Solution**: Standardize on a single icon library across the entire site.

---

## 11. Eliminating Forced Synchronous Reflows on Initial Load

- **Trap**: Using FLIP techniques or querying `getBoundingClientRect()` / `offsetWidth` during DOM initialization causes 100+ ms of forced layout reflow.
- **Solution**: Guard geometric measurements with an `isInitialLoad` flag:
  ```javascript
  let isInitialLoad = true;
  function syncLayout() {
      if (isInitialLoad) {
          isInitialLoad = false;
          // Move DOM nodes directly without querying getBoundingClientRect()
          return;
      }
      // Run FLIP animation only on user-triggered resize/interaction
  }
  ```

---

> **Remember:** The fastest code is code that doesn't run. Remove before optimizing.


