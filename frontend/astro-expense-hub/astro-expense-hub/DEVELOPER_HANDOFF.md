# ExpenseFlow - Developer Handoff

## 🎯 Project Overview

**ExpenseFlow** is a next-generation expense management application with a futuristic UI design featuring deep navy backgrounds, neon cyan-to-purple gradients, and glassmorphism effects.

## 🎨 Design System

### Brand Identity
- **App Name**: ExpenseFlow
- **Tagline**: "Next-gen expense management • OCR receipts • Multi-level approvals"
- **Logo**: Circular "E" with clockwise arrow in neon gradient (#00FFFF → #9B6BFF)

### Color Palette
- **Background**: Deep navy gradient (#071028 → #0b1220)
- **Primary Gradient**: Cyan to Purple (#00FFFF → #9B6BFF)
- **Text**: Headings #E6F3FF, Body #B9C7D9, Muted #8092A8
- **Status Colors**: Approved #2EE6A5, Rejected #FF6B6B, Pending #FFC857

### Typography
- **Font Family**: Inter/Poppins
- **Scale**: H1 (28-34px bold), H2 (20-24px semibold), Body (14-16px regular)

## 📱 Pages & Components

### 1. Landing Page (`/`)
- **Hero Section**: Large logo, gradient headline, CTA buttons
- **Features Grid**: 3 feature cards with icons and badges
- **CTA Section**: Glass card with final call-to-action

### 2. Authentication (`/auth`)
- **Layout**: 2-column (promotional left, form right)
- **Left Column**: Logo, headline, feature cards, trust indicators
- **Right Column**: Glass form panel with tabs (Sign In/Sign Up)
- **Form Fields**: Rounded inputs (44px height, 12px radius)

### 3. Dashboard (`/dashboard`)
- **Layout**: Sidebar + Header + Main Content
- **Sidebar**: Navigation with icons, labels, and badges
- **Header**: Search bar, notifications, user menu
- **Main Content**: Welcome section, metric cards, charts, quick actions

### 4. Expense Form (`/expenses/new`)
- **OCR Section**: Receipt upload with auto-extract preview
- **Form Section**: Expense details with validation
- **Features**: File upload, OCR preview, form validation

### 5. Approval Flow (`/approvals`)
- **Visual Flow**: Step-by-step approval process
- **Components**: Circular avatars, role badges, status indicators
- **Modal**: Center-screen approval modal with comments

## 🧩 Component Architecture

### Core Components
1. **ExpenseFlowLogo** - Brand logo with gradient and glow
2. **Sidebar** - Left navigation with icons and badges
3. **Header** - Top bar with search, notifications, user menu
4. **MetricCard** - Dashboard statistics with trends
5. **ExpenseForm** - OCR-enabled expense submission
6. **ApprovalFlow** - Multi-level approval visualization
7. **ApprovalModal** - Approval/rejection modal

### UI Components (shadcn/ui)
- Button, Card, Input, Label, Textarea
- Select, Tabs, Badge, Avatar
- DropdownMenu, Dialog, Toast

## 🔌 API Integration

### Authentication Endpoints
- `POST /api/auth/register-company` - Company + admin registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info

### Expense Management
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses?role=pending` - Pending approvals
- `POST /api/expenses/{id}/approve` - Approve expense
- `POST /api/expenses/{id}/reject` - Reject expense

### Analytics & Reports
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/categories` - Category breakdown
- `GET /api/analytics/trends` - Spending trends

### Utility Endpoints
- `GET /api/countries` - Country list for forms
- `GET /api/rates?base={CURRENCY}` - Exchange rates

## 🎨 Styling Implementation

### CSS Variables (in `index.css`)
```css
:root {
  --background-gradient: linear-gradient(180deg, #071028 0%, #0b1220 100%);
  --gradient-primary: linear-gradient(135deg, #00FFFF 0%, #9B6BFF 100%);
  --card-glass: rgba(12, 20, 40, 0.6);
  --glow-primary: 0 0 20px rgba(0, 255, 255, 0.3);
  --shadow-elevated: 0 10px 40px rgba(7, 16, 40, 0.5);
}
```

### Utility Classes
- `.glass` - Glassmorphism effect with blur
- `.glass-hover` - Hover state with glow
- `.gradient-primary` - Primary gradient background
- `.glow-primary` - Cyan glow effect
- `.status-approved/rejected/pending` - Status colors

### Component Styling
- **Buttons**: 44px height, 12px radius, gradient backgrounds
- **Inputs**: 44px height, 12px radius, focus rings
- **Cards**: Glass background, 24px radius, soft shadows
- **Badges**: Rounded pills with status colors

## 🔧 Technical Implementation

### State Management
- **AuthContext**: User authentication and company data
- **Local State**: Form data, UI state, loading states
- **API Service**: Centralized API calls with error handling

### Form Handling
- **React Hook Form**: Form validation and submission
- **Zod**: Schema validation for type safety
- **Error Handling**: User-friendly error messages

### File Upload & OCR
- **File Upload**: Drag & drop with preview
- **OCR Simulation**: Mock data extraction for demo
- **Image Processing**: Thumbnail generation and validation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (single column)
- **Tablet**: 640px - 1024px (stacked layout)
- **Desktop**: > 1024px (sidebar + main content)

### Layout Adaptations
- **Mobile**: Collapsed sidebar, stacked forms
- **Desktop**: Full sidebar, 2-column auth forms
- **Charts**: Responsive containers with proper scaling

## ♿ Accessibility Features

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- High contrast for status indicators
- Accessible color combinations

### Keyboard Navigation
- Tab order follows logical flow
- Focus indicators on all interactive elements
- Keyboard shortcuts for common actions

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex components
- Alt text for images and icons

## 🚀 Performance Considerations

### Image Optimization
- WebP format for modern browsers
- Lazy loading for dashboard images
- Optimized icon sprites

### Code Splitting
- Route-based code splitting
- Lazy loading for heavy components
- Dynamic imports for charts

### Caching Strategy
- API response caching
- Static asset caching
- Service worker for offline support

## 🧪 Testing Strategy

### Unit Tests
- Component rendering tests
- Form validation tests
- API service tests

### Integration Tests
- Authentication flow
- Expense submission flow
- Approval workflow

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness

## 📦 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production
- Static hosting (Vercel, Netlify)
- CDN for assets
- Environment variables for API URLs

## 🔄 Future Enhancements

### Phase 2 Features
- Real OCR integration
- Advanced analytics
- Mobile app
- Team collaboration tools

### Phase 3 Features
- AI-powered insights
- Automated approvals
- Integration with accounting software
- Multi-currency support

---

## 📋 Quick Start Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Set up environment variables
- [ ] Configure API endpoints
- [ ] Test authentication flow
- [ ] Verify responsive design
- [ ] Run accessibility audit
- [ ] Deploy to staging
- [ ] Performance testing
- [ ] Production deployment

**Design Spec**: See `design-spec.json` for complete technical specifications.
**Assets**: Logo and icon files available in `/public` directory.
