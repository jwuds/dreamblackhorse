# Supabase Testing Guide

This guide outlines the manual testing procedures for verifying the robust implementation of Supabase features, Row Level Security (RLS) policies, and the newly implemented FAQ functionality.

## 1. Supabase Connection Verification
* **Objective:** Ensure the client initializes properly and can reach the database.
* **Test Steps:**
  1. Open the application and open browser Developer Tools (Console).
  2. Navigate to the `/blog` page.
  3. Verify that posts load successfully.
  4. Ensure no connection timeout errors or CORS issues appear in the console.
* **Expected Result:** Content renders. Network tab shows successful fetch to your `<project-url>/rest/v1/blog_posts`.

## 2. Row Level Security (RLS) Policy Testing
* **Objective:** Verify data security matches access rules.
* **Test Steps (Public/Unauthenticated):**
  1. Open an Incognito window.
  2. Go to `/blog`. Verify only posts with `status = 'published'` are visible.
  3. Attempt to access an unpublished post via direct URL (`/blog/<draft-slug>`). Verify it shows a 404 or redirects back.
* **Test Steps (Authenticated Admin):**
  1. Log in via `/admin/login`.
  2. Navigate to `/admin/blog`. Verify ALL posts (Draft, Published, Archived) are visible.
  3. Attempt to Create, Edit, and Delete a post.
* **Expected Result:** Unauthenticated users can only READ published posts. Authenticated users have full CRUD access.

## 3. Blog Editor FAQ Workflow
* **Objective:** Test the FAQ array addition and modification capabilities.
* **Test Steps:**
  1. Navigate to `/admin/blog/new` (or edit an existing post).
  2. Scroll to the "FAQ Items" section.
  3. Click "Add FAQ". Enter a Question and an Answer.
  4. Add a second FAQ.
  5. Use the "Up" and "Down" arrows to reorder them.
  6. Delete one of the FAQs.
  7. Save the post.
* **Expected Result:** The `faq_items` JSON array correctly persists in the database.

## 4. Blog Post FAQ Display Verification
* **Objective:** Verify the front-end rendering and schema generation for FAQs.
* **Test Steps:**
  1. Open the published blog post from Step 3.
  2. Scroll down to the "Frequently Asked Questions" section.
  3. Click a question to expand it (Accordion functionality). Verify smooth animation and correct Markdown rendering of the answer.
  4. Open page source or DevTools -> Elements. Search for `application/ld+json`. Verify the `FAQPage` schema is present containing your questions and answers.
* **Expected Result:** Accordion works flawlessly. SEO schema is valid.

## 5. Error Logger Verification
* **Objective:** Ensure all failures are safely caught and logged.
* **Test Steps:**
  1. Temporarily break your network connection (e.g., set to Offline in Chrome Network tab) and try saving a post.
  2. Observe the console output.
* **Expected Result:** `[ERROR]` tag should appear in console indicating the query failure, structured properly with timestamps. A user-friendly toast message should appear in the UI.