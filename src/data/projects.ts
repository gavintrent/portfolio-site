export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "terminal-portfolio",
    title: "Terminal Portfolio",
    description: "A retro terminal-style personal portfolio website built with Next.js and TypeScript. Features a command-line interface for navigation and showcases projects in a unique way.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/yourusername/terminal-portfolio",
    featured: true
  },
  {
    id: "project-2",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce application with user authentication, product management, and payment processing. Built with modern web technologies and responsive design.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    link: "https://your-ecommerce-app.com",
    github: "https://github.com/yourusername/ecommerce-app",
    featured: true
  },
  {
    id: "project-3",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    technologies: ["Vue.js", "Firebase", "Vuex", "Tailwind CSS"],
    link: "https://your-task-app.com",
    github: "https://github.com/yourusername/task-app",
    featured: false
  },
  {
    id: "project-4",
    title: "Weather Dashboard",
    description: "A weather application that displays current conditions and forecasts using multiple weather APIs. Features location-based weather data and beautiful visualizations.",
    technologies: ["JavaScript", "HTML5", "CSS3", "Weather APIs"],
    link: "https://your-weather-app.com",
    github: "https://github.com/yourusername/weather-app",
    featured: false
  }
];
