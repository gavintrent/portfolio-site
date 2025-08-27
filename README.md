# Terminal Portfolio

A retro terminal-style personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Users navigate the site by typing commands in a simulated terminal environment.

## Features

- 🖥️ **Terminal Interface**: Full-screen terminal UI with command-line navigation
- ⌨️ **Command System**: Type commands like `help`, `about`, `projects`, `contact`
- 🎨 **Retro Design**: Classic terminal aesthetic with green text on black background
- 📱 **Responsive**: Mobile-friendly design with always-visible input
- ⚡ **Fast**: Built with Next.js for optimal performance
- 🎭 **Animations**: Smooth transitions and typing effects with Framer Motion

## Available Commands

- `help` - Show available commands
- `about` - Display personal information
- `projects` - List portfolio projects
- `contact` - Show contact information
- `clear` - Clear terminal history
- `ls` - Alias for help
- `whoami` - Alias for about
- `motd` - Display message of the day

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Font**: JetBrains Mono
- **Deployment**: Static export ready

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd terminal-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Customize your information:
   - Edit `src/data/profile.ts` with your personal details
   - Update `src/data/projects.ts` with your projects
   - Modify `src/app/layout.tsx` metadata

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The static files will be generated in the `.next/` directory. For deployment, the build process automatically handles static generation thanks to the `output: 'export'` configuration in `next.config.js`.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/          # React components
│   ├── Terminal.tsx    # Main terminal component
│   ├── CommandInput.tsx # Command input handler
│   ├── CommandHistory.tsx # Command history display
│   └── OutputBlock.tsx # Output rendering
├── data/               # Static data
│   ├── profile.ts      # Personal information
│   └── projects.ts     # Portfolio projects
├── styles/             # Global styles
│   └── globals.css     # Tailwind + custom CSS
└── utils/              # Utility functions
    └── commands.ts     # Command system logic
```

## Customization

### Personal Information
Edit `src/data/profile.ts` to update:
- Name and title
- Bio/description
- Contact links

### Projects
Modify `src/data/projects.ts` to add/remove projects:
- Project title and description
- Technologies used
- Demo and GitHub links
- Featured status

### Styling
Customize the terminal theme in `tailwind.config.js`:
- Colors (background, text, cursor)
- Fonts
- Animations

### Commands
Add new commands in `src/utils/commands.ts`:
- Define command logic
- Add to the commands object
- Update help text

## Deployment

This project is configured for static export and can be deployed to:

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

### Netlify
1. Build the project: `npm run build`
2. Upload the `.next/` directory contents
3. Set build command: `npm run build`
4. Set publish directory: `.next`

### GitHub Pages
1. Build the project: `npm run build`
2. Upload the `.next/` directory contents to your repository
3. Enable GitHub Pages in repository settings

### Manual Static Hosting
1. Build the project: `npm run build`
2. Upload the `.next/` directory contents to your web server

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server (requires build first)
- `npm run lint` - Run ESLint

### Adding New Commands

To add a new command:

1. Add the command logic to `src/utils/commands.ts`:
```typescript
export const commands: Record<string, () => CommandOutput> = {
  // ... existing commands
  newcommand: () => ({
    type: 'text',
    content: 'Your new command output here',
    command: 'newcommand'
  }),
};
```

2. Update the help command to include your new command
3. Test with `npm run dev`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [ISC License](LICENSE).

## Acknowledgments

- Inspired by retro terminal aesthetics
- Built with modern web technologies
- Designed for developer portfolios

---

Happy coding! 🚀
