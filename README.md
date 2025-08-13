# Pokédex Explorer

A modern, responsive React application built with Next.js and TypeScript that explores the Pokémon universe using the PokéAPI. Features advanced search, filtering, favorites system, and a polished user experience with dark mode support.

![Pokédex Explorer]

## Vercel Url
`https://pokemon-list-virid-six.vercel.app/pokemon`

## 🚀 Features

### Core Functionality
- **Comprehensive Pokémon List**: Browse through all Pokémon with pagination
- **Advanced Search**: Debounced search by name or ID with URL persistence
- **Smart Filtering**: Filter by type and view favorites with URL state management
- **Flexible Sorting**: Sort by ID, name, height, or weight
- **Detailed Views**: Individual Pokémon pages with complete stats and information
- **Favorites System**: Persistent favorites using localStorage with optimistic UI updates

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Skeleton loaders and graceful loading experiences
- **Error Handling**: Comprehensive error states with retry functionality
- **URL State Management**: Shareable URLs that preserve search and filter state
- **Keyboard Navigation**: Full keyboard accessibility support
- **Smooth Animations**: Polished transitions and hover effects

### Technical Excellence
- **Request Cancellation**: Prevents race conditions using AbortController
- **Client-side Caching**: TanStack Query for efficient data management
- **Type Safety**: Full TypeScript implementation with strict typing
- **Performance Optimized**: Code splitting, memoization, and efficient re-renders
- **Accessibility**: WCAG compliant with proper ARIA labels and focus management

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **API**: PokéAPI (https://pokeapi.co/)

## 🛠 Limitation

Need to search the pokemon with exact name as the pokemon have as the PokéAPI don't provide for the elastic search api.
And the type filter is appplied so change it if the search result is not found for the pokemon with the exact name.

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pokemon-resource-explorer.git
   cd pokemon-resource-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start