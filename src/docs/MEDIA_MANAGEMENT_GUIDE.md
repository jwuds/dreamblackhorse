# Media Management Integration Guide

This guide explains how to use the centralized Media Management system to handle images across the Dream Black Horse website.

## 1. Overview
The new system replaces hardcoded image URLs with a dynamic database-driven approach. 
Images are stored in a Supabase storage bucket (`site-images`) and metadata is tracked in the `site_images` database table.

## 2. Admin Interface
Access the **Media Management** tab in the Admin Dashboard.
- **Upload:** Drag & drop files or click to browse. Max size: 10MB. Formats: JPG, PNG, WEBP, GIF.
- **Categorize:** Assign images to specific sections (e.g., `hero`, `about`, `gallery`).
- **Publishing:** An image must be marked as **Published** (green badge) to be visible on the public site. Drafts (yellow badge) are hidden.
- **Edit Metadata:** Add Alt Text for SEO/accessibility.

## 3. Using Images in React Components

To display an image managed by this system, use the `<SiteImage />` component instead of standard `<img>` tags.

### Import the component: