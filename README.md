# Royal 3D Interactive Portfolio

A stunning, royal-themed 3D interactive portfolio built with React and Three.js, featuring smooth animations and dark/light mode toggling.

## Description

This portfolio is designed to showcase the experience and skills of a senior full stack developer with over 3 years of experience. It features sophisticated 3D visualizations, interactive elements, and smooth animations to create an astonishing visual experience.

## Technologies Used

### Frontend
- React.js
- Three.js (3D visualizations)
- Framer Motion (animations)
- Tailwind CSS (styling)
- Shadcn UI (component library)
- TypeScript
- Vite (build tool)

### Backend
- Node.js
- Express.js

### Database
- MySQL (showcased in skills section)

## Features

- Interactive 3D tech stack visualization
- Particle background with physics and gradient connections
- Responsive design for all device sizes
- Dark/light theme toggle
- Smooth page transitions and scroll animations
- Interactive skills visualization
- Project showcase section with filtering
- Contact form with validation

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm run dev
```
4. The application will be available at `http://localhost:3000`

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/                    # 3D interactive components
│   │   │   │   ├── TechStackShowcase.tsx
│   │   │   │   ├── ThreeDSkills.tsx
│   │   │   │   └── ThreeDAvatar.tsx
│   │   │   ├── ui/                    # UI components
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ParticlesBackground.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   └── SkillsSection.tsx
│   │   ├── context/                   # Context providers
│   │   ├── data/                      # Static data
│   │   ├── hooks/                     # Custom hooks
│   │   ├── lib/                       # Utility functions
│   │   ├── pages/                     # Page components
│   │   ├── App.tsx                    # Main application component
│   │   └── main.tsx                   # Entry point
├── server/                            # Backend server
└── shared/                            # Shared types and schema
```

## Port Configuration

The application runs on port 3000 by default. The server is configured to bind to `0.0.0.0` to make it accessible from external devices.

## Customization

- Theme colors can be adjusted in `theme.json`
- Resume data can be modified in `client/src/data/resumeData.ts`
- 3D visual effects can be customized in the components under `client/src/components/3d/`

## License

This project is licensed under the MIT License.