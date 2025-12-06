# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal website built with [Quarto](https://quarto.org/) and deployed via Netlify. The site includes a blog, research projects, software projects, talks, and courses, all authored in Quarto Markdown (.qmd) files.

## Build and Development Commands

```bash
# Preview site locally with live reload (http://localhost:4200)
quarto preview

# Build the site (output to _site/)
quarto render

# Build a specific file
quarto render path/to/file.qmd

# Check Quarto version
quarto --version
```

The site auto-builds and deploys via Netlify on push to the repository. The Netlify plugin (`@quarto/netlify-plugin-quarto`) handles the build process.

## Architecture

### Content Organization

All content follows a directory-based structure with `index.qmd` files:

- **Blog**: `blog/YYYY-MM-DD_slug/index.qmd` - Blog posts with date-prefixed directories
- **Research**: `research/project-name/index.qmd` - Research project pages
- **Software**: `software/project-name/index.qmd` - Software project pages
- **Talks**: `talks/project-name/index.qmd` - Talk/presentation pages
- **Courses**: `courses/project-name/index.qmd` - Course material pages

Each content directory contains:
- `index.qmd` - The main content file
- `featured.png` (or `.jpg`) - Featured image for listings and social sharing
- Additional assets (data files, images, etc.) as needed

### Listing Pages

Top-level `.qmd` files (e.g., `blog.qmd`, `research.qmd`) are listing pages that automatically aggregate and display content from their respective directories. They use Quarto's listing feature to:
- Auto-discover content in subdirectories
- Display cards/grids with featured images
- Enable filtering by categories/tags
- Generate RSS feeds (for blog)

### Configuration

- **`_quarto.yml`**: Main site configuration (navbar, theme, metadata, rendering options)
- **`assets/main.scss`**: Custom SCSS theme variables and overrides (based on Flatly theme)
- **`assets/styles.css`**: Additional CSS customizations
- **`netlify.toml`**: Netlify build configuration

### Rendering and Caching

Quarto uses a "freeze" system (`freeze: auto` in `_quarto.yml`) to cache computational results:
- `_freeze/` directory stores cached outputs
- Re-renders only when source files change
- Useful for posts with R/Python code execution
- The freeze cache is committed to the repository

## Content Frontmatter Standards

### Blog Posts
```yaml
---
title: "Post Title"
subtitle: "Optional subtitle"
date: 'YYYY-MM-DD'
date-modified: last-modified
date-format: "MMMM D, YYYY"
categories: ["Category 1", "Category 2"]
tags: ["tag1", "tag2", "tag3"]
image: featured.png
toc: true
citation: true
---
```

### Research/Software Projects
```yaml
---
title: "Project Title"
date: "YYYY-MM-DD"
date-modified: last-modified
date-format: "MMMM D, YYYY"
subtitle: "Brief description"
author: "J. R. Winget"
categories: ["Category"]
tags: ["tag1", "tag2"]
description: "Longer description for metadata"
image: featured.png
---
```

Key conventions:
- Date format is always `"MMMM D, YYYY"` (e.g., "November 21, 2025")
- Use `date-modified: last-modified` to auto-update modification dates
- Featured images should be named `featured.png` or `featured.jpg`

## Styling and Theme

The site uses a custom theme based on Flatly with extensive SCSS customization:
- Color palette emphasizes warm neutrals and WCAG AA compliant colors
- Custom navbar background: `#f2e9dc`
- Typography: Roboto (body), Roboto Slab (headings)
- Design system variables defined in `assets/main.scss`

When modifying styles, prefer updating SCSS variables in `assets/main.scss` over adding raw CSS to `assets/styles.css`.

## Adding New Content

### New Blog Post
1. Create directory: `blog/YYYY-MM-DD_descriptive-slug/`
2. Add `index.qmd` with proper frontmatter
3. Add `featured.png` image (1200x630px recommended for social sharing)
4. The post will automatically appear on the blog listing page

### New Research/Software/Talk/Course
1. Create directory: `research/project-slug/` (or `software/`, `talks/`, `courses/`)
2. Add `index.qmd` with proper frontmatter
3. Add `featured.png` or `featured.jpg`
4. The project will automatically appear on the respective listing page

## Deployment

- **Platform**: Netlify
- **Build command**: Handled by `@quarto/netlify-plugin-quarto`
- **Publish directory**: `_site/`
- **Builds trigger**: Automatically on push to repository

The site is deployed at https://jrwinget.com (with www.jrwinget.com as an alias).
