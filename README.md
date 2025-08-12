# Pokémon Gallery - Frontend Coding Challenge

A modern, responsive web application built with Vue 3 that displays Pokémon data from the PokéAPI. Features beautiful card layouts, search functionality, detailed Pokémon pages, and favorites management.

## 🚀 Live Demo

[View Live Application](https://pokemon-gallery-sakinah308.netlify.app)

## 📋 Features

### Core Requirements ✅
- **Vue 3** - Modern reactive framework
- **JavaScript** - Pure JS implementation (no TypeScript)
- **Bootstrap 5.3.x** - Responsive UI components
- **Pinia** - Modern state management for Vue

### Functionality
1. **Data Fetching** - Loads exactly 100 Pokémon from PokéAPI
2. **Beautiful Display** - Responsive card/grid layout with hover animations
3. **Search & Filter** - Real-time search by Pokémon name
4. **Detail Pages** - Comprehensive Pokémon information with routing
5. **Responsive Design** - Mobile-first, works on all screen sizes
6. **Loading States** - Skeleton loaders and spinner animations
7. **State Management** - Pinia store with edit functionality
8. **Favorites System** - Add/remove Pokémon from favorites with localStorage persistence

### Additional Features 🌟
- **Type-based Color Coding** - Each Pokémon type has distinct colors
- **Multiple Sprite Views** - Front, back, shiny variants
- **Comprehensive Stats** - Base stats with visual progress bars
- **Species Information** - Pokédex descriptions and generation data
- **Error Handling** - Graceful error messages and retry functionality
- **Edit Functionality** - Modify Pokémon details with form validation

## 🛠️ Tech Stack

- **Vue 3** (v3.5.18) - Progressive JavaScript framework
- **Vue Router** (v4.5.1) - Official routing library
- **Pinia** (v3.0.3) - State management
- **Bootstrap** (v5.3.2) - CSS framework
- **Axios** (v1.11.0) - HTTP client for API requests
- **Vite** (v7.0.6) - Fast build tool and dev server

## 📦 Installation & Setup

### Prerequisites
- Node.js (v20.19.0 or >=22.12.0)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd pokemon-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── HelloWorld.vue
│   └── ...
├── stores/              # Pinia state management
│   ├── pokemon.js       # Main Pokémon store
│   └── counter.js
├── views/               # Page components
│   ├── HomeView.vue     # Main gallery page
│   ├── PokemonDetail.vue # Detailed Pokémon view
│   └── AboutView.vue
├── router/              # Vue Router configuration
│   └── index.js
├── assets/              # Static assets (CSS, images)
│   ├── base.css
│   ├── main.css
│   └── logo.svg
├── App.vue              # Root component
└── main.js              # Application entry point
```

## 🔧 Key Implementation Details

### State Management (Pinia)
- **Pokemon Store**: Manages all Pokémon data, search, favorites, and API calls
- **Local Storage**: Persists favorites between sessions
- **Error Handling**: Comprehensive error states and user feedback

### Responsive Design
- **Mobile-first approach** with Bootstrap breakpoints
- **Flexible grid system** adapts to different screen sizes
- **Touch-friendly interactions** for mobile devices

### API Integration
- **PokéAPI v2**: Fetches exactly 100 Pokémon as required
- **Parallel requests**: Efficient data loading with Promise.all
- **Species data**: Additional details for comprehensive Pokémon profiles

### Performance Optimizations
- **Skeleton loading**: Smooth loading states
- **Image optimization**: Efficient sprite and artwork loading
- **Component-based architecture**: Reusable and maintainable code

## 🎨 Design Features

### Visual Elements
- **Gradient backgrounds**: Modern aesthetic appeal
- **Hover animations**: Interactive card transformations
- **Type-based colors**: Each Pokémon type has unique styling
- **Progress bars**: Visual representation of stats

### User Experience
- **Intuitive navigation**: Clear routing and back buttons
- **Search functionality**: Real-time filtering
- **Favorites system**: One-click favorite management
- **Edit mode**: In-place editing with form validation

## 🌐 Deployment

The application can be deployed to various platforms:

### Recommended Platforms
- **Netlify**: Drag & drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repositories

### Deployment Steps (Netlify Example)
1. Build the project: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Configure build settings if using Git deployment

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Known Issues & Limitations

- API rate limiting may occur with rapid requests
- Large images might take time to load on slow connections
- Edit functionality only persists in browser session (not sent back to API)

## 🤝 Contributing

This is a coding challenge submission, but feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created as part of a frontend development coding challenge.

## 🙏 Acknowledgments

- **PokéAPI** - Amazing free API for Pokémon data
- **Vue.js Team** - For the excellent framework
- **Bootstrap Team** - For the responsive CSS framework

---

*Built with ❤️ using Vue 3, Bootstrap, and the PokéAPI*
