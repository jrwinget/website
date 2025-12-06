# MailerLite RSS-to-Email Campaign Setup Guide

This guide will walk you through the complete setup of your MailerLite newsletter system for **The Friction Point** blog. By the end, you'll have an automated RSS-to-Email campaign that sends new blog posts to subscribers, plus an embedded signup form on your website.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Part 1: Create Your MailerLite Account](#part-1-create-your-mailerlite-account)
4. [Part 2: Set Up Your RSS-to-Email Campaign](#part-2-set-up-your-rss-to-email-campaign)
5. [Part 3: Create and Embed the Subscription Form](#part-3-create-and-embed-the-subscription-form)
6. [Part 4: Migrate Existing Subscribers from Netlify Forms](#part-4-migrate-existing-subscribers-from-netlify-forms)
7. [Part 5: Testing the Complete System](#part-5-testing-the-complete-system)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Overview

### What You'll Build

- **Automated RSS-to-Email**: Automatically sends emails to subscribers when new blog posts are published
- **Subscription Form**: Embedded form in the right margin of blog posts for easy signups
- **Subscriber Management**: Centralized list management in MailerLite

### How It Works

1. You publish a new blog post on your Quarto website
2. The blog post is added to your RSS feed at `https://www.jrwinget.com/blog.xml`
3. MailerLite checks the RSS feed periodically (you configure the frequency)
4. When a new post is detected, MailerLite automatically sends it to your subscribers
5. New visitors can subscribe via the embedded form in your blog's right margin

---

## Prerequisites

Before you begin, make sure you have:

- [x] A published website at `https://www.jrwinget.com`
- [x] A working RSS feed at `https://www.jrwinget.com/blog.xml`
- [x] Access to edit files in `/home/user/Sync/web-apps/website/`
- [x] Email address for your MailerLite account (`contact@jrwinget.com`)
- [x] List of existing subscribers (if migrating from Netlify Forms: just my own contact@jrwinget.com)

---

## Part 1: Create Your MailerLite Account

### Step 1.1: Sign Up for MailerLite

1. Go to [https://www.mailerlite.com](https://www.mailerlite.com)
2. Click **"Sign up free"** (free plan includes up to 1,000 subscribers)
3. Enter your email address and create a password
4. Choose **"I want to send emails to my subscribers"** when asked about your use case

**Expected outcome**: You'll receive a verification email. Click the link to verify your account.

### Step 1.2: Complete Your Profile

1. Log into MailerLite
2. Complete the welcome wizard:
   - **Business name**: "The Friction Point" or "Jeremy R. Winget"
   - **Industry**: Education / Technology / Professional Services
   - **Email sending volume**: Start with your estimate (e.g., "Less than 1,000/month")
3. Add your business details:
   - **From name**: "Jeremy Winget" or "The Friction Point"
   - **From email**: `contact@jrwinget.com` (or your preferred email)
   - **Company address**: Your address (required by anti-spam laws)

**Expected outcome**: Your account is fully set up and ready to create campaigns.

---

## Part 2: Set Up Your RSS-to-Email Campaign

### Step 2.1: Navigate to Campaigns

1. From the MailerLite dashboard, click **"Campaigns"** in the left sidebar
2. Click the **"Create campaign"** button
3. Select **"RSS campaign"** from the campaign types

**Visual guidance**: Look for an orange RSS icon. If you don't see it, click "Show all campaign types" or "View more".

### Step 2.2: Configure RSS Feed Settings

1. **Campaign name**: Enter "Blog RSS - The Friction Point" (internal name only)
2. **RSS feed URL**: Enter `https://www.jrwinget.com/blog.xml`
3. Click **"Check feed"** or **"Validate"**

**Expected outcome**: MailerLite should confirm the feed is valid and show you the most recent posts from your blog. You should see your latest post (e.g., "What Is Cognitive Engineering? Building Technology for Human Minds").

**Common pitfall**: If the feed doesn't validate, double-check:
- The URL is exactly `https://www.jrwinget.com/blog.xml` (no typos)
- Your website is published and accessible
- Try opening the URL in your browser to verify it works

### Step 2.3: Configure Campaign Schedule

1. **Trigger frequency**: Choose how often MailerLite checks for new posts:
   - **Recommended**: "Daily at 10:00 AM" (checks once per day)
   - Alternative: "Every time new content is detected" (checks hourly)
   - Alternative: "Weekly on Monday at 10:00 AM" (for less frequent blogs)

2. **Time zone**: Select your time zone (e.g., "America/New_York")

3. **Start date**: Choose when to start sending:
   - Select "Immediately" to start checking the feed right away
   - Or schedule a specific start date

**Expected outcome**: Your schedule is saved. Emails will only be sent when NEW posts are detected after this start date.

**Important note**: Existing posts in the feed won't trigger emails. Only posts published AFTER you activate the campaign will be sent.

### Step 2.4: Design Your Email Template

This is where you customize how your blog posts will appear in subscribers' inboxes.

1. **Choose a template**:
   - Click **"Select template"**
   - Choose **"RSS digest"** or **"Blog update"** templates
   - Or start with **"Blank template"** for full control

2. **Customize the email design**:
   - **Subject line**: Use dynamic fields:
     ```
     New post: {{rss.title}}
     ```
     Or create a custom subject:
     ```
     The Friction Point: {{rss.title}}
     ```

   - **Preview text**: Add preview text (appears in inbox):
     ```
     {{rss.description}}
     ```

   - **Email body**: Drag and drop blocks to build your email:
     - Add a **Logo** block (upload `/home/user/Sync/web-apps/website/assets/img/logo.png`)
     - Add a **Text** block for a brief intro:
       ```
       New from The Friction Point:
       ```
     - Add an **RSS** block (this automatically pulls from your feed):
       - RSS Title: `{{rss.title}}`
       - RSS Description: `{{rss.description}}`
       - RSS Link: `{{rss.link}}`
       - **Show featured image**: Enable this to include images from your posts
     - Add a **Button** block:
       - Button text: "Read the full post"
       - Button URL: `{{rss.link}}`
       - Button color: Match your brand (e.g., `#6b5d54` from your site)
     - Add a **Footer** with unsubscribe link (automatically included)

3. **Styling recommendations**:
   - Keep it simple and readable
   - Use your brand colors: background `#faf8f5`, primary color `#6b5d54`
   - Ensure mobile responsiveness (preview on mobile before saving)

**Expected outcome**: A professional-looking email template that showcases your blog post with your branding.

### Step 2.5: Select Recipients

1. **Choose your subscriber group**:
   - If this is your first campaign, select **"All subscribers"**
   - Or create a segment (e.g., "Blog subscribers")

2. **Configure subscriber settings**:
   - Check **"Don't send to unsubscribed"** (enabled by default)
   - Check **"Don't send to bounced emails"** (enabled by default)

**Expected outcome**: Your campaign will send to all active subscribers who haven't unsubscribed or bounced.

### Step 2.6: Review and Activate

1. Click **"Review"** to see a summary of your campaign:
   - RSS feed URL
   - Send schedule
   - Email template preview
   - Recipient list

2. **Send a test email** (highly recommended):
   - Click **"Send test"**
   - Enter your email address
   - Check your inbox to review the email

3. **Make any final adjustments** to the template or settings

4. Click **"Start campaign"** or **"Activate"**

**Expected outcome**: Your RSS campaign is now live! MailerLite will automatically check your feed according to the schedule you set and send emails when new posts are published.

**Important**: The campaign will only send emails for NEW posts published after activation. It won't send emails for posts already in your RSS feed.

---

## Part 3: Create and Embed the Subscription Form

### Step 3.1: Create a Subscription Form

1. In MailerLite, click **"Forms"** in the left sidebar (or **"Grow"** > **"Forms"**)
2. Click **"Create form"**
3. Select **"Embedded form"** (not popup or landing page)

**Visual guidance**: You want a form that can be embedded directly into your website's HTML.

### Step 3.2: Design Your Form

1. **Choose a template**:
   - Select **"Simple email form"** or **"Minimal"** for a clean look
   - Or start with a **"Blank"** template

2. **Customize form fields**:
   - **Required field**: Email address (keep this)
   - **Optional**: Add name field if desired (not required)
   - **Remove**: Any fields you don't need (keep it simple)

3. **Form settings**:
   - **Button text**: "Subscribe" or "Get Updates"
   - **Success message**: "Thanks for subscribing! You'll receive new posts via email."
   - **Redirect after signup**: Optional - can redirect to `/subscription-success.html`
     - If using redirect, enter: `https://www.jrwinget.com/subscription-success.html`

4. **Styling** (to match your site):
   - **Background**: `#faf8f5` or transparent
   - **Input border**: `#d0ccc5`
   - **Button color**: `#6b5d54`
   - **Button hover**: `#5a4d45`
   - **Text color**: `#2c2c2c`

5. **Form behavior**:
   - Check **"Double opt-in"** if you want subscribers to confirm their email (recommended for compliance)
   - Or uncheck for **"Single opt-in"** (subscribers are added immediately)

**Expected outcome**: A clean, simple form that matches your website's aesthetic.

### Step 3.3: Get the Embed Code

1. Click **"Done editing"** or **"Save"**
2. MailerLite will show you the embed options
3. Select **"Embed code"** or **"HTML code"**
4. Copy the entire code snippet - it will look something like this:

```html
<div class="ml-embedded" data-form="ABC123xyz"></div>
<script>
  (function(m,a,i,l,e,r){ m['MailerLiteObject']=e;function f(){
  var c={ a:arguments,q:[]};var r=this.push(c);return "number"!=typeof r?r:f.bind(c.q);}
  f.q=f.q||[];m[e]=m[e]||f.bind(f.q);m[e].q=m[e].q||f.q;r=a.createElement(i);
  var _=a.getElementsByTagName(i)[0];r.async=1;r.src=l+'?v'+(~~(new Date().getTime()/1000000));
  _.parentNode.insertBefore(r,_);})(window, document, 'script', 'https://static.mailerlite.com/js/universal.js', 'ml');

  var ml_account = ml('accounts', '1234567', 'a1b2c3d4e5f6g7h8', 'load');
</script>
```

**Important**: Your embed code will have different IDs and account numbers - copy YOUR specific code.

### Step 3.4: Add the Embed Code to Your Website

Now you'll replace the placeholder in `/home/user/Sync/web-apps/website/_margin-header.qmd` with your actual MailerLite form.

1. **Open the _margin-header.qmd file**:
   ```bash
   # The file is located at:
   /home/user/Sync/web-apps/website/_margin-header.qmd
   ```

2. **Find the placeholder section** (around lines 20-24):
   ```html
   <!-- MAILERLITE EMBED CODE GOES HERE -->
   <!-- Replace this placeholder div with your MailerLite embed code -->
   <div class="subscribe-placeholder">
     <p style="font-style: italic; color: #666; font-size: 0.9em;">
       MailerLite form will appear here
     </p>
   </div>
   <!-- END MAILERLITE EMBED CODE -->
   ```

3. **Replace the placeholder** with your MailerLite embed code:
   ```html
   <!-- MAILERLITE EMBED CODE GOES HERE -->
   <div class="ml-embedded" data-form="ABC123xyz"></div>
   <script>
     (function(m,a,i,l,e,r){ m['MailerLiteObject']=e;function f(){
     var c={ a:arguments,q:[]};var r=this.push(c);return "number"!=typeof r?r:f.bind(c.q);}
     f.q=f.q||[];m[e]=m[e]||f.bind(f.q);m[e].q=m[e].q||f.q;r=a.createElement(i);
     var _=a.getElementsByTagName(i)[0];r.async=1;r.src=l+'?v'+(~~(new Date().getTime()/1000000));
     _.parentNode.insertBefore(r,_);})(window, document, 'script', 'https://static.mailerlite.com/js/universal.js', 'ml');

     var ml_account = ml('accounts', '1234567', 'a1b2c3d4e5f6g7h8', 'load');
   </script>
   <!-- END MAILERLITE EMBED CODE -->
   ```

4. **Save the file**

5. **Rebuild your Quarto site**:
   ```bash
   cd /home/user/Sync/web-apps/website
   quarto render
   ```

6. **Deploy to Netlify**:
   ```bash
   # If using Git deployment:
   git add _margin-header.qmd assets/styles.css _quarto.yml
   git commit -m "Add MailerLite subscription form embed code"
   git push

   # Netlify will automatically rebuild and deploy
   ```

**Expected outcome**: Your blog posts will now show a working subscription form in the right margin. The form will match your site's design and allow visitors to subscribe.

### Step 3.5: Verify the Form Appears

1. Wait for Netlify to finish deploying (usually 1-3 minutes)
2. Visit any blog post on your site (e.g., `https://www.jrwinget.com/blog/2025-11-21_cognitive-engineering/`)
3. Look at the right margin (on desktop) or scroll down (on mobile)
4. You should see your subscription form with an email input and subscribe button

**Common pitfall**: If the form doesn't appear:
- Check browser console for JavaScript errors (F12 > Console)
- Verify the embed code was pasted correctly (no missing parts)
- Clear your browser cache and reload
- Check that Netlify deployed successfully

---

## Part 4: Migrate Existing Subscribers from Netlify Forms

If you have existing subscribers from Netlify Forms, you'll want to import them into MailerLite.

### Step 4.1: Export Subscribers from Netlify

1. Log into your Netlify account at [https://app.netlify.com](https://app.netlify.com)
2. Select your site ("website" or "jrwinget.com")
3. Click **"Forms"** in the top navigation
4. Find your subscription form in the list
5. Click on the form name to see submissions
6. Click **"Export as CSV"** (usually in the top-right corner)
7. Save the CSV file to your computer

**Expected outcome**: A CSV file containing email addresses and any other form data.

### Step 4.2: Prepare the CSV File

1. Open the CSV file in a spreadsheet program (Excel, Google Sheets, LibreOffice)
2. Ensure there's a column header named **"email"** or **"Email"**
3. Remove any test emails or invalid entries
4. Remove duplicate emails if any exist
5. The final file should have at least one column with email addresses

**Example format**:
```csv
email
subscriber1@example.com
subscriber2@example.com
subscriber3@example.com
```

**Optional**: You can also include additional columns like `name`, `signup_date`, etc.

### Step 4.3: Import to MailerLite

1. In MailerLite, go to **"Subscribers"** in the left sidebar
2. Click **"Import subscribers"**
3. Choose **"Upload CSV file"** or **"Paste data"**
4. Upload your prepared CSV file
5. **Map fields**:
   - Map the email column to **"Email"**
   - Map any other columns as needed (name, etc.)
6. **Import settings**:
   - **Group**: Choose "All subscribers" or create a new group called "Blog subscribers"
   - **Resubscribe**: Check this if you want to re-add people who may have unsubscribed
   - **Status**: Select "Active" (subscribers will be added as active)
   - **Send welcome email**: Optional - you can send a one-time email explaining the migration

7. Click **"Import"**

**Expected outcome**: All your existing subscribers are now in MailerLite and will receive future blog post notifications.

**Important compliance note**: Only import subscribers who explicitly opted in to receive emails. Importing people who didn't consent can violate anti-spam laws.

### Step 4.4: Verify Import

1. Go to **"Subscribers"** in MailerLite
2. Check that the subscriber count matches your import
3. Click on a few subscribers to verify their data imported correctly

---

## Part 5: Testing the Complete System

Now it's time to test the entire workflow to make sure everything works.

### Test 1: Subscription Form

**Goal**: Verify new subscribers can sign up through your website.

1. Visit a blog post on your site (e.g., `https://www.jrwinget.com/blog/2025-11-21_cognitive-engineering/`)
2. Find the subscription form in the right margin
3. Enter a test email address (use a different email than your main one)
4. Click "Subscribe" or "Get Updates"
5. **Check for double opt-in** (if enabled):
   - Check the test email inbox
   - Look for a confirmation email from MailerLite
   - Click the confirmation link
6. Verify you're redirected to the success page or see a success message

**Expected outcome**:
- The form submits without errors
- A success message appears or you're redirected to `/subscription-success.html`
- The email appears in your MailerLite subscribers list (check Subscribers > All subscribers)

**If this fails**: See [Troubleshooting - Form Issues](#form-issues)

### Test 2: RSS Feed Detection

**Goal**: Verify MailerLite can read your RSS feed.

1. In MailerLite, go to **"Campaigns"**
2. Find your RSS campaign
3. Click on it to view details
4. Look for a **"Preview feed"** or **"View RSS feed"** option
5. Verify that your latest blog post appears in the feed preview

**Expected outcome**: MailerLite shows your most recent blog posts with titles, descriptions, and links.

**If this fails**: See [Troubleshooting - RSS Feed Issues](#rss-feed-issues)

### Test 3: End-to-End Campaign Test

**Goal**: Verify that a new blog post triggers an email to subscribers.

**Option A: Publish a test post**

1. Create a simple test blog post in `/home/user/Sync/web-apps/website/blog/`:
   ```bash
   mkdir -p /home/user/Sync/web-apps/website/blog/2025-12-06_test-post
   ```

2. Create `index.qmd`:
   ```yaml
   ---
   title: "Test Post - Please Ignore"
   date: "2025-12-06"
   categories: [test]
   ---

   This is a test post to verify the RSS-to-Email campaign is working.
   ```

3. Render and deploy:
   ```bash
   cd /home/user/Sync/web-apps/website
   quarto render
   git add .
   git commit -m "Add test post for RSS campaign"
   git push
   ```

4. Wait for deployment to complete

5. **Wait for the scheduled check**:
   - If your campaign checks daily at 10 AM, wait until after that time
   - Or manually trigger in MailerLite (if available): Campaigns > Your RSS Campaign > "Send now" or "Check feed now"

6. Check your test subscriber's inbox for the email

**Option B: Manually trigger a campaign send (if available)**

1. In MailerLite, go to **"Campaigns"**
2. Find your RSS campaign
3. If there's a **"Send test"** or **"Preview latest post"** option, use it
4. Send to your test email address

**Expected outcome**:
- Your test subscriber receives an email with the blog post content
- The email looks professional and matches your template design
- All links in the email work correctly
- The "Read the full post" button takes you to the correct blog post

**After testing**: Delete the test blog post if you don't want it published.

### Test 4: Unsubscribe Flow

**Goal**: Verify subscribers can unsubscribe easily (required by law).

1. Using your test subscriber email, find the unsubscribe link in the test email
2. Click the unsubscribe link
3. Verify you're taken to an unsubscribe page
4. Confirm the unsubscription
5. In MailerLite, go to **"Subscribers"** and verify the test email is now marked as "Unsubscribed"

**Expected outcome**: The unsubscribe process is smooth and the subscriber is properly marked as unsubscribed in MailerLite.

---

## Troubleshooting

### Form Issues

**Problem**: Subscription form doesn't appear on the page

**Solutions**:
1. Check that you saved `_margin-header.qmd` after adding the embed code
2. Verify Netlify deployment completed successfully
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for JavaScript errors (F12 > Console tab)
5. Verify the embed code is complete (both `<div>` and `<script>` tags)
6. Check that `_quarto.yml` has the include directive for `_margin-header.qmd` (lines 34-35):
   ```yaml
   margin-header: |
     {{< include _margin-header.qmd >}}
   ```

**Problem**: Form appears but doesn't submit

**Solutions**:
1. Check browser console for errors
2. Verify your MailerLite account is active and not suspended
3. Try a different email address (some corporate emails may block form submissions)
4. Check MailerLite form settings - ensure it's set to "Active" not "Paused"

**Problem**: Subscribers don't appear in MailerLite after signing up

**Solutions**:
1. If using double opt-in, subscriber must click confirmation email first
2. Check MailerLite spam/abuse folder for flagged subscribers
3. Verify the form is pointing to the correct MailerLite account
4. Check that the form's "Add to group" setting is configured

### RSS Feed Issues

**Problem**: MailerLite can't validate the RSS feed

**Solutions**:
1. Test the feed directly in a browser: `https://www.jrwinget.com/blog.xml`
2. Validate the feed using [W3C Feed Validator](https://validator.w3.org/feed/)
3. Ensure your site is deployed and accessible (not behind authentication)
4. Check for XML syntax errors in the generated feed
5. Verify the feed URL is exactly `https://www.jrwinget.com/blog.xml` (no trailing slash)

**Problem**: RSS feed validates but MailerLite doesn't detect new posts

**Solutions**:
1. Check the campaign schedule - it may not have checked yet
2. Verify the post was published AFTER the campaign was activated (past posts won't trigger)
3. Check that the post's publication date is recent (some platforms ignore old content)
4. Look at the RSS feed in a browser to confirm the new post appears there
5. Try manually triggering a feed check in MailerLite (if available)

### Email Delivery Issues

**Problem**: Emails aren't being sent

**Solutions**:
1. Verify the RSS campaign is "Active" not "Paused" or "Draft"
2. Check that you have subscribers in the selected group
3. Verify your MailerLite account is in good standing (no holds or suspensions)
4. Check the campaign schedule - emails only send at scheduled times
5. Review MailerLite's campaign reports for errors or warnings

**Problem**: Emails go to spam

**Solutions**:
1. Ask subscribers to add your sending address to their contacts
2. Ensure your from email is properly authenticated (MailerLite handles this)
3. Avoid spam trigger words in subject lines ("FREE", "ACT NOW", etc.)
4. Ensure your content is relevant to what subscribers signed up for
5. Check your sender reputation in MailerLite's dashboard

### Import Issues

**Problem**: CSV import fails

**Solutions**:
1. Ensure the CSV has a header row with "email" column
2. Check for special characters or formatting issues in the CSV
3. Try importing a smaller batch (100 emails at a time)
4. Verify email addresses are valid format (user@domain.com)
5. Remove any blank rows or duplicate emails

---

## Best Practices

### Content Strategy

1. **Posting frequency**: Aim for consistent publishing (e.g., weekly or bi-weekly) so subscribers know what to expect

2. **Subject lines**: Keep them clear and descriptive. The dynamic `{{rss.title}}` works well, or add a prefix like "New post: {{rss.title}}"

3. **Email timing**: Schedule RSS checks for times when your audience is likely to read (e.g., Tuesday-Thursday mornings)

4. **Content quality**: Since every post goes to all subscribers, maintain high quality standards

### Subscriber Management

1. **Clean your list regularly**:
   - Remove hard bounces immediately
   - Consider removing subscribers who haven't opened emails in 6-12 months

2. **Segment if needed**:
   - Create segments for different topics if you write about diverse subjects
   - Allow subscribers to choose their interests

3. **Monitor metrics**:
   - Track open rates (healthy is 20-40% for blog newsletters)
   - Track click rates (healthy is 2-10%)
   - Monitor unsubscribe rate (under 1% is good)

### Compliance

1. **Always include unsubscribe link**: MailerLite adds this automatically

2. **Honor unsubscribe requests immediately**: MailerLite handles this automatically

3. **Include your physical address**: Required by CAN-SPAM (add in email footer)

4. **Only email people who opted in**: Never buy email lists or add people without consent

5. **Keep records**: Document when and how people subscribed

### Email Design

1. **Keep it simple**: Most successful newsletters are plain text or minimally designed

2. **Mobile-first**: Over 50% of emails are read on mobile devices

3. **Clear call-to-action**: Make the "Read full post" button prominent

4. **Consistent branding**: Use your logo, colors, and voice consistently

5. **Test before sending**: Always send yourself a test email before activating

### Technical Maintenance

1. **Monitor your RSS feed**:
   - Periodically check `https://www.jrwinget.com/blog.xml` to ensure it's working
   - Verify new posts appear in the feed after publishing

2. **Keep MailerLite API updated**: If the embed code version changes, update your `_margin-header.qmd`

3. **Check analytics**:
   - MailerLite dashboard for email metrics
   - Plausible.io (your analytics) for website conversions

4. **Backup your subscriber list**: Periodically export your subscribers as a backup

---

## Quick Reference

### Key URLs

- **Your RSS feed**: `https://www.jrwinget.com/blog.xml`
- **Subscription success page**: `https://www.jrwinget.com/subscription-success.html`
- **MailerLite login**: `https://app.mailerlite.com`
- **Netlify dashboard**: `https://app.netlify.com`

### Key Files

- **Subscription form**: `/home/user/Sync/web-apps/website/_margin-header.qmd`
- **Subscription styles**: `/home/user/Sync/web-apps/website/assets/styles.css` (lines 321-408)
- **Success page**: `/home/user/Sync/web-apps/website/subscription-success.qmd`
- **Quarto config**: `/home/user/Sync/web-apps/website/_quarto.yml`
- **RSS feed source**: Generated automatically by Quarto in `/_site/blog.xml`

### Common Commands

**Rebuild site after changes**:
```bash
cd /home/user/Sync/web-apps/website
quarto render
```

**Deploy changes**:
```bash
git add .
git commit -m "Update subscription form"
git push
```

**Preview locally before deploying**:
```bash
quarto preview
# Then visit http://localhost:4200
```

---

## Support Resources

### MailerLite Documentation

- [RSS Campaign Guide](https://www.mailerlite.com/help/how-to-create-an-rss-campaign)
- [Embedded Forms](https://www.mailerlite.com/help/how-to-use-an-embedded-form)
- [Import Subscribers](https://www.mailerlite.com/help/how-to-import-subscribers)

### Quarto Documentation

- [Website Basics](https://quarto.org/docs/websites/)
- [RSS Feeds](https://quarto.org/docs/websites/website-blog.html#rss-feed)

### Additional Help

- **MailerLite Support**: Available via in-app chat or email
- **Netlify Support**: https://docs.netlify.com or community forums
- **RSS Validation**: https://validator.w3.org/feed/

---

## Next Steps

After completing this setup:

1. **Write your next blog post** and verify the email sends automatically
2. **Promote your newsletter** on social media, in your email signature, etc.
3. **Monitor engagement** in MailerLite's analytics dashboard
4. **Iterate on your email template** based on what gets the best response
5. **Consider adding a welcome automation** for new subscribers (MailerLite feature)

---

**Questions or issues?** Review the troubleshooting section above, or reach out to MailerLite support for platform-specific help.

Good luck with your newsletter! 🚀
