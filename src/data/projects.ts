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
    id: "dreamnet",
    title: "DreamNet",
    description: "A social dream journal",
    technologies: ["React", "Node.js", "Express", "PostgreSQL", "JavaScript", "TailwindCSS", "RESTful APIs"],
    github: "https://github.com/gavintrent/dreamnet",
    featured: true,
    link: "https://dreamnet-journal.vercel.app/",
  },
  {
    id: "htttp-web-server",
    title: "Custom C++ HTTP Web Server",
    description: "Custom multi-threaded HTTP server using Boost.Asio with dynamic routing, request parsing, and session-based authentication",
    technologies: ["CRUD", "RESTful APIs", "Boost.Asio", "C++", "Google Cloud"],
    github: "https://github.com/gavintrent/http-web-server",
    featured: true,
    link: "http://www.name-not-found-404.cs130.org/static1/index.html",
  },
  {
    id: "amc-mcp-server",
    title: "AMC A-List MCP Server",
    description: "Model Context Protocol server that integrates with AMC Theatres APIs, exposing structured tools for LLMs including movie listings, theater information, showtimes, and ticket reservations.",
    technologies: ["TypeScript", "Express.js", "RESTful APIs", "Docker", "Jest", "Playwright"],
    github: "https://github.com/gavintrent/amc-alist-mcp-server",
    featured: true,
    link: "https://github.com/gavintrent/amc-alist-mcp-server",
  },
];
