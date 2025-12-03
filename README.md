# Travel Memories - Countries Travelled

A beautiful, high-end web application to track and showcase countries you've traveled to. Think of it as digital fridge magnets for your travel memories.

## Features

- **Beautiful UI**: Agency-quality design with smooth animations and modern aesthetics
- **Image Gallery**: Display country photos in an elegant grid layout
- **Simple Database**: SQLite database for easy data management
- **Image Upload**: Drag-and-drop or click to upload country photos
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Instant Updates**: Real-time UI updates when adding or removing countries

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Development Mode

To run with auto-restart on file changes:
```bash
npm run dev
```

## How to Use

1. **Add a Country**:
   - Click the "Add Country" button in the header
   - Enter the country name
   - Upload a photo (drag-and-drop or click to browse)
   - Click "Add to Collection"

2. **View Your Collection**:
   - All countries are displayed in a beautiful grid
   - Hover over cards to see the remove button
   - Images scale smoothly on hover for a premium feel

3. **Remove a Country**:
   - Hover over a country card
   - Click the "Remove" button
   - Confirm the deletion

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **File Upload**: Multer
- **Styling**: Custom CSS with modern design patterns

## Project Structure

```
Countries-Travelled/
├── server.js          # Express server and API endpoints
├── package.json       # Project dependencies
├── database.db        # SQLite database (auto-generated)
├── public/            # Frontend files
│   ├── index.html     # Main HTML file
│   ├── styles.css     # Styling and animations
│   └── app.js         # Client-side JavaScript
└── uploads/           # Uploaded images (auto-generated)
```

## API Endpoints

- `GET /api/countries` - Get all countries
- `POST /api/countries` - Add a new country (with image upload)
- `DELETE /api/countries/:id` - Delete a country
- `PUT /api/countries/:id` - Update a country

## Features in Detail

### Design Philosophy
- Clean, minimalist interface
- High-end agency-quality aesthetics
- Smooth animations and transitions
- Premium typography (Playfair Display + Inter)
- Thoughtful hover states and interactions

### Image Handling
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- Automatic image optimization
- 4:3 aspect ratio for consistent gallery layout

## Customization

You can easily customize the look and feel by editing `public/styles.css`:
- Color scheme in CSS variables (`:root`)
- Animation speeds and easing
- Layout breakpoints
- Typography choices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built with care for travel enthusiasts who want to showcase their adventures in style.
