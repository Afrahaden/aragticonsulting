# Aragti Consulting Website

A five-page, responsive HTML/CSS/JavaScript website.

## Pages
- index.html
- about.html
- services.html
- where-we-work.html
- contact.html

## Local development
Open the project folder in VS Code and use the Live Server extension,
or run:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000

## Before public launch
1. Replace assets/logo.svg with the APPROVED brand symbol. The current SVG
   is a temporary approximation, not the approved artwork.
2. Replace assets/favicon.svg with the approved simplified symbol.
3. Verify the illustrative Somalia graphic and replace it with a geographically
   accurate, properly licensed map if cartographic precision is required.
4. Add the verified official email in js/main.js (OFFICIAL_EMAIL).
5. Replace contact-page email, phone, and social-media placeholders.
6. Review and publish appropriate privacy/legal information.
7. Confirm the domain, then add absolute canonical URLs, absolute social-image
   URLs, and a sitemap.xml.
8. Verify all copy, branding, and contact details before publishing.
9. Test all five pages on mobile, tablet, and desktop.

## Contact form
The form uses mailto:, not a server-side submission endpoint.
It does not send messages automatically.

## Fonts
Plus Jakarta Sans and Inter are loaded from Google Fonts.
The site falls back to system fonts when offline.

## Build
The ZIP is generated automatically by build-aragti.js.
# aragti-consulting
