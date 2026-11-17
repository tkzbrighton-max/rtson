# Firebase Firestore Security Specification

## 1. Data Invariants
- **SiteConfig**: Read accessible to all visitors so custom hero images, branding, and links load dynamically. Write restricted to authenticated admins.
- **PortfolioItems**: Read accessible to all visitors to render the portfolio grid. Write/Update/Delete restricted to authenticated admins.
- **ShowcaseVideos**: Read accessible to all visitors to display video/motion flyer showcases. Write/Update/Delete restricted to authenticated admins.
- **Inquiries**: Public creation allowed with validated payload (client name, project details, estimate). Read and update restricted to authenticated admins.
- **Reviews**: Public read allowed. Public creation allowed with valid rating and comment.

## 2. Validation & Security Rules
- Strict ID validation using `isValidId(id)` for document operations.
- Schema verification for incoming documents.
- Default deny catch-all `match /{document=**} { allow read, write: if false; }`.
