#  CRM Frontend - Design Documentation

Complete design system and architecture documentation for the SalonPro CRM Frontend.

---

##  Design System

### Color Palette

#### Primary Colors
```css
--primary: #7c3aed        /* Violet 600 - Main brand color */
--primary-hover: #6d28d9  /* Violet 700 - Hover states */
--primary-light: #a78bfa  /* Violet 400 - Light accents */
--primary-dark: #5b21b6   /* Violet 800 - Dark accents */
```

#### Semantic Colors
```css
--success: #10b981        /* Emerald 500 - Success states */
--warning: #f59e0b        /* Amber 500 - Warning states */
--error: #ef4444          /* Red 500 - Error states */
--info: #0ea5e9           /* Sky 500 - Info states */
```

#### Neutral Colors
```css
--text-primary: #1f2937   /* Gray 800 - Primary text */
--text-secondary: #6b7280 /* Gray 500 - Secondary text */
--text-tertiary: #9ca3af  /* Gray 400 - Tertiary text */
--border: #e5e7eb         /* Gray 200 - Borders */
--bg: #ffffff             /* White - Background */
--hover: #f9fafb          /* Gray 50 - Hover background */
```

#### Dark Mode
```css
--dark-bg: #111827        /* Gray 900 - Dark background */
--dark-surface: #1f2937   /* Gray 800 - Dark surface */
--dark-border: #374151    /* Gray 700 - Dark borders */
--dark-text: #f9fafb      /* Gray 50 - Dark text */
```

---

### Typography

#### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

#### Font Sizes
```css
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
```

#### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

### Spacing System

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

---

### Border Radius

```css
--radius-sm: 0.375rem   /* 6px - Small elements */
--radius-md: 0.5rem     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem    /* 12px - Cards */
--radius-xl: 1rem       /* 16px - Modals */
--radius-2xl: 1.5rem    /* 24px - Large cards */
--radius-full: 9999px   /* Full rounded - Pills, avatars */
```

---

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

---

##  Component Design Patterns

### Button Variants

#### Primary Button
```tsx
<button className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 
                   text-white font-semibold transition shadow-sm">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="px-4 py-2 rounded-xl border border-gray-300 
                   hover:bg-gray-50 text-gray-700 font-semibold transition">
  Secondary Action
</button>
```

#### Danger Button
```tsx
<button className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 
                   text-white font-semibold transition">
  Delete
</button>
```

#### Icon Button
```tsx
<button className="w-10 h-10 rounded-lg hover:bg-gray-100 
                   flex items-center justify-center transition">
  <Icon size={20} />
</button>
```

---

### Input Fields

#### Text Input
```tsx
<input 
  type="text"
  className="w-full px-3 py-2 rounded-xl border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-violet-500 
             focus:border-transparent"
  placeholder="Enter text..."
/>
```

#### Select Dropdown
```tsx
<select className="w-full px-3 py-2 rounded-xl border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-violet-500">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

#### Textarea
```tsx
<textarea 
  className="w-full px-3 py-2 rounded-xl border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-violet-500 
             resize-none"
  rows={4}
  placeholder="Enter description..."
/>
```

---

### Card Designs

#### Basic Card
```tsx
<div className="rounded-2xl p-6 bg-white border border-gray-200 
                shadow-sm hover:shadow-md transition">
  <h3 className="text-lg font-bold text-gray-900 mb-2">Card Title</h3>
  <p className="text-sm text-gray-600">Card content goes here</p>
</div>
```

#### Stat Card
```tsx
<div className="rounded-2xl p-6 bg-gradient-to-br from-violet-500 to-violet-600 
                text-white shadow-lg">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium opacity-90">Total Revenue</span>
    <Icon size={20} />
  </div>
  <div className="text-3xl font-bold">₹45,230</div>
  <div className="text-xs opacity-75 mt-1">+12% from last month</div>
</div>
```

#### Interactive Card
```tsx
<button className="w-full rounded-2xl p-4 border-2 border-gray-200 
                   hover:border-violet-500 hover:bg-violet-50 
                   transition-all text-left">
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-violet-100 
                    flex items-center justify-center">
      <Icon size={24} className="text-violet-600" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">Service Name</h4>
      <p className="text-sm text-gray-600">₹500 • 30 min</p>
    </div>
  </div>
</button>
```

---

### Modal Design

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">Modal Title</h2>
      <button className="w-8 h-8 rounded-lg hover:bg-gray-100 
                         flex items-center justify-center">
        <X size={20} />
      </button>
    </div>
    <div className="mb-6">
      <p className="text-gray-600">Modal content goes here</p>
    </div>
    <div className="flex gap-3">
      <button className="flex-1 px-4 py-2 rounded-xl border border-gray-300 
                         hover:bg-gray-50 font-semibold">
        Cancel
      </button>
      <button className="flex-1 px-4 py-2 rounded-xl bg-violet-600 
                         hover:bg-violet-700 text-white font-semibold">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

### Badge/Pill Design

```tsx
{/* Status Badges */}
<span className="px-2 py-1 rounded-full text-xs font-semibold 
                 bg-emerald-100 text-emerald-700">
  Completed
</span>

<span className="px-2 py-1 rounded-full text-xs font-semibold 
                 bg-amber-100 text-amber-700">
  Pending
</span>

<span className="px-2 py-1 rounded-full text-xs font-semibold 
                 bg-red-100 text-red-700">
  Cancelled
</span>

<span className="px-2 py-1 rounded-full text-xs font-semibold 
                 bg-blue-100 text-blue-700">
  In Progress
</span>
```

---

### Table Design

```tsx
<div className="rounded-2xl border border-gray-200 overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold 
                       text-gray-600 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold 
                       text-gray-600 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold 
                       text-gray-600 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 text-sm text-gray-900">John Doe</td>
        <td className="px-6 py-4">
          <span className="px-2 py-1 rounded-full text-xs font-semibold 
                           bg-emerald-100 text-emerald-700">
            Active
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <button className="text-violet-600 hover:text-violet-700 
                             font-semibold text-sm">
            Edit
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

##  Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices (large desktops) */
2xl: 1536px /* 2X large devices (larger desktops) */
```

### Responsive Grid

```tsx
{/* 1 column on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>

{/* Responsive padding */}
<div className="px-4 md:px-6 lg:px-8">
  Content
</div>

{/* Responsive text size */}
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Heading
</h1>
```

---

##  Animation & Transitions

### Hover Effects

```css
/* Smooth transitions */
transition: all 0.2s ease-in-out;

/* Scale on hover */
transform: scale(1.05);

/* Shadow on hover */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Loading States

```tsx
{/* Skeleton loader */}
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

{/* Spinner */}
<div className="animate-spin rounded-full h-8 w-8 border-4 
                border-gray-200 border-t-violet-600"></div>
```

---

##  Dark Mode Support

```tsx
{/* Dark mode classes */}
<div className="bg-white dark:bg-gray-900 
                text-gray-900 dark:text-gray-100 
                border-gray-200 dark:border-gray-700">
  Content
</div>

{/* Dark mode button */}
<button className="bg-violet-600 dark:bg-violet-500 
                   hover:bg-violet-700 dark:hover:bg-violet-600">
  Button
</button>
```

---

##  Layout Patterns

### Dashboard Layout

```tsx
<div className="min-h-screen bg-gray-50">
  {/* Sidebar */}
  <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
    <Sidebar />
  </aside>
  
  {/* Main Content */}
  <main className="ml-64 p-6">
    <Header />
    <div className="mt-6">
      {children}
    </div>
  </main>
</div>
```

### Form Layout

```tsx
<form className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        First Name
      </label>
      <input type="text" className="w-full px-3 py-2 rounded-xl border" />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Last Name
      </label>
      <input type="text" className="w-full px-3 py-2 rounded-xl border" />
    </div>
  </div>
  
  <div className="flex gap-3 justify-end">
    <button type="button" className="px-4 py-2 rounded-xl border">
      Cancel
    </button>
    <button type="submit" className="px-4 py-2 rounded-xl bg-violet-600 text-white">
      Save
    </button>
  </div>
</form>
```

---

##  Icon System

Using **Lucide React** icons:

```tsx
import { 
  User, Calendar, DollarSign, Settings, 
  Bell, Search, Plus, Edit, Trash2 
} from 'lucide-react'

{/* Icon sizes */}
<Icon size={16} />  {/* Small */}
<Icon size={20} />  {/* Medium */}
<Icon size={24} />  {/* Large */}

{/* Icon with color */}
<Icon size={20} className="text-violet-600" />
```

---

##  Data Visualization

Using **Recharts** for charts:

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} />
</LineChart>
```

---

##  Accessibility

### ARIA Labels

```tsx
<button aria-label="Close modal">
  <X size={20} />
</button>

<input 
  type="text" 
  aria-label="Search customers"
  aria-describedby="search-help"
/>
```

### Keyboard Navigation

```tsx
{/* Tab index */}
<button tabIndex={0}>Focusable</button>

{/* Keyboard shortcuts */}
onKeyDown={(e) => {
  if (e.key === 'Enter') handleSubmit()
  if (e.key === 'Escape') handleClose()
}}
```

---

##  Best Practices

1. **Consistent Spacing**: Use Tailwind spacing scale
2. **Color Consistency**: Stick to defined color palette
3. **Responsive First**: Design for mobile, enhance for desktop
4. **Accessibility**: Always include ARIA labels and keyboard support
5. **Performance**: Lazy load images and components
6. **Dark Mode**: Support both light and dark themes
7. **Loading States**: Show feedback for async operations
8. **Error Handling**: Display clear error messages
9. **Form Validation**: Validate on blur and submit
10. **Consistent Icons**: Use same icon library throughout

---

**Built for Hair Ahmedabad** · Ahmedabad, Gujarat, India
