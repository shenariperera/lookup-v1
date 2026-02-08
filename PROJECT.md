# Lookup.lk - Project Documentation

## Project Overview
Lookup.lk is a business directory and deals platform for Sri Lanka. 
Users can browse businesses, discover deals/offers, and save money. 
Businesses can register for free and post unlimited deals.

## MVP Features (Phase 1 - 8 weeks)
- [x] Free business listings (up to 3 deals)
- [x] Deals/offers posting
- [x] Business directory
- [x] Category pages & filters
- [x] Homepage with listings
- [x] Authentication (register/login)
- [x] Company dashboard (manage profile & deals)
- [x] Admin panel (approve/manage)
- [x] Static pages (About, Contact, T&C, Privacy)
- [x] Search & filters
- [x] Image upload
- [x] SEO

## NOT in MVP (Phase 2)
- [ ] Premium tiers
- [ ] Payment gateway
- [ ] Analytics dashboard
- [ ] Subscription management

---

## Tech Stack
- **Frontend:** Next.js 15 (App Router) + React
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js (email/password)
- **Storage:** Supabase Storage (images)
- **Email:** Resend (contact form)
- **Hosting:** Vercel
- **Language:** JavaScript (not TypeScript)

---

## Design System

### Colors
**Primary (Teal): #1985a1**
```javascript
primary: {
  50: '#f0f9fb',
  100: '#d9f0f5',
  200: '#b3e1eb',
  300: '#8dd2e1',
  400: '#4db4cc',  
  500: '#1985a1',  // Main brand color
  600: '#166b85',  // Hover states
  700: '#125669',
  800: '#0d404d',
  900: '#082b34',
}
```

**Secondary (Coral): #f04124**
```javascript
secondary: {
  500: '#f04124',  // Hot deals, urgent CTAs
  600: '#d3371d',
}
```

**Utility Colors:**
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Error: #ef4444 (red)

### Component Patterns

**Button (Primary):**
```jsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md">
  Click Me
</button>
```

**Button (Secondary):**
```jsx
<button className="bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold transition-colors">
  Learn More
</button>
```

**Card:**
```jsx
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
  {/* Content */}
</div>
```

**Badge (Featured):**
```jsx
<span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
  ⭐ Featured
</span>
```

**Badge (Hot Deal):**
```jsx
<span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
  🔥 Hot Deal
</span>
```

### Typography
- **Headings:** font-bold, text sizes: 4xl, 3xl, 2xl, xl, lg
- **Body:** text-base (16px), text-gray-600
- **Small text:** text-sm, text-gray-500

### Spacing
- Sections: py-12 (48px vertical padding)
- Cards: p-4 or p-6
- Gaps: gap-6 for grids

### Design Principles
- Rounded corners: rounded-lg (8px)
- Shadows: shadow-md, hover:shadow-xl
- Transitions: transition-all or transition-colors
- Mobile-first: Use md:, lg: breakpoints

---

## File Structure
```
lookup/
├── app/
│   ├── page.js                    # Homepage
│   ├── layout.js                  # Root layout
│   ├── globals.css                # Global styles
│   ├── deals/
│   │   ├── page.js                # All deals
│   │   ├── [slug]/page.js         # Single deal
│   │   └── category/[category]/page.js
│   ├── companies/
│   │   ├── page.js                # All companies
│   │   └── [slug]/page.js         # Company profile
│   ├── dashboard/
│   │   ├── page.js                # Dashboard home
│   │   ├── deals/
│   │   │   ├── page.js            # Manage deals
│   │   │   └── new/page.js        # Create deal
│   │   └── profile/page.js        # Edit profile
│   ├── admin/
│   │   ├── page.js                # Admin dashboard
│   │   ├── companies/page.js
│   │   └── deals/page.js
│   ├── auth/
│   │   ├── login/page.js
│   │   └── register/page.js
│   ├── about/page.js
│   ├── contact/page.js
│   └── api/
│       ├── deals/route.js
│       ├── companies/route.js
│       ├── auth/[...nextauth]/route.js
│       └── upload/route.js
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── Badge.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── deals/
│   │   ├── DealCard.jsx
│   │   ├── DealGrid.jsx
│   │   └── DealForm.jsx
│   └── companies/
│       ├── CompanyCard.jsx
│       └── CompanyProfile.jsx
├── lib/
│   ├── prisma.js                  # Prisma client
│   ├── auth.js                    # Auth config
│   └── utils.js                   # Utilities
├── prisma/
│   └── schema.prisma              # Database schema
└── public/
    └── images/
```

---

## Database Schema
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password_hash String
  name          String
  role          Role      @default(COMPANY)
  company_id    String?   @unique
  company       Company?  @relation(fields: [company_id], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Company {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  logo_url    String?
  banner_url  String?
  website     String?
  phone       String?
  whatsapp    String?
  email       String?
  location    String?
  category    String?
  status      Status    @default(PENDING) // Admin approval required
  deals       Deal[]
  user        User?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Deal {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  description String     @db.Text
  terms       String?    @db.Text
  category    String
  location    String?
  image_urls  String[]
  end_date    DateTime   // REQUIRED (no nullable)
  status      DealStatus @default(ACTIVE)
  featured    Boolean    @default(false)
  company_id  String
  company     Company    @relation(fields: [company_id], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  icon  String?
}

enum Role {
  COMPANY
  ADMIN
}

enum Status {
  PENDING   // Waiting for admin approval
  ACTIVE
  SUSPENDED
}

enum DealStatus {
  ACTIVE     // Visible (if not expired)
  DISABLED   // Admin manually hid it
}
```

---

## API Routes

### Deals
- `GET /api/deals` - List all approved deals
- `POST /api/deals` - Create new deal
- `GET /api/deals/[id]` - Get single deal
- `PUT /api/deals/[id]` - Update deal
- `DELETE /api/deals/[id]` - Delete deal

### Companies
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create company
- `GET /api/companies/[id]` - Get company
- `PUT /api/companies/[id]` - Update company

### Admin
- `GET /api/admin/companies/pending`
- `PUT /api/admin/companies/[id]/approve` - Approve company
- `PUT /api/admin/companies/[id]/suspend` - Suspend company
- `PUT /api/admin/deals/[id]/disable` - For scam / abuse / policy violations

---

## Development Timeline

### Week 1: Foundation (IN PROGRESS)
- [x] Next.js setup
- [x] Tailwind config with colors
- [ ] Prisma setup
- [ ] Database schema
- [ ] Base components (Button, Card, Badge)
- [ ] Homepage layout

### Week 2: Auth + Static Pages
- [ ] NextAuth.js setup
- [ ] Login/Register pages
- [ ] About/Contact/T&C/Privacy pages

### Week 3: Company Dashboard
- [ ] Dashboard layout
- [ ] Profile management
- [ ] Image upload

### Week 4: Deal Management
- [ ] Create deal form
- [ ] Edit deal
- [ ] Deal list

### Week 5: Public Deal Pages
- [ ] All deals page
- [ ] Deal detail page
- [ ] Category pages

### Week 6: Business Directory
- [ ] Companies listing
- [ ] Company profile pages

### Week 7: Search + Admin
- [ ] Search functionality
- [ ] Admin panel

### Week 8: Polish + Launch
- [ ] SEO optimization
- [ ] Testing
- [ ] Deploy to Vercel

---

## Coding Standards

### Naming Conventions
- **Components:** PascalCase (DealCard.jsx)
- **Functions:** camelCase (getDealBySlug)
- **Files:** lowercase with dashes (deal-card.jsx) OR PascalCase for components
- **CSS classes:** Tailwind utilities only, no custom classes

### Component Structure
```jsx
// 1. Imports
import { useState } from 'react';
import Link from 'next/link';

// 2. Component
export default function ComponentName({ prop1, prop2 }) {
  // 3. State
  const [state, setState] = useState(null);
  
  // 4. Functions
  const handleClick = () => {
    // ...
  };
  
  // 5. Return JSX
  return (
    <div className="...">
      {/* Content */}
    </div>
  );
}
```

### Best Practices
- Use server components by default (Next.js 15)
- Add 'use client' only when needed (hooks, event handlers)
- Keep components small and focused
- Extract reusable logic to lib/utils.js
- Always use Image component from next/image
- Use Link component from next/link for navigation

---

## Important Notes

- **No TypeScript** - Using JavaScript for simplicity
- **No src/ directory** - Everything in root-level folders
- **App Router** - Using Next.js 15 App Router (not Pages Router)
- **Free tier everything** - MVP uses all free services
- **Mobile-first** - Design for mobile, enhance for desktop
- **SEO-focused** - All pages have proper meta tags

---

## Environment Variables
```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_KEY="..."

RESEND_API_KEY="re_..."
```

---

## Resources
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Supabase Docs: https://supabase.com/docs

---

Last Updated: [Current Date]
Status: Week 1 - Foundation Phase
Current Focus: Prisma setup and database schema