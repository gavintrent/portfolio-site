export interface Profile {
  name: string;
  title: string;
  bio: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

export const profile: Profile = {
  name: "Your Name",
  title: "Full Stack Developer",
  bio: `Hello! I'm a passionate developer who loves building things for the web. 
I specialize in modern web technologies and enjoy creating user-friendly applications.

When I'm not coding, you can find me exploring new technologies, contributing to open source, 
or sharing knowledge with the developer community.

I believe in writing clean, maintainable code and building applications that make a difference.`,
  contact: {
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername"
  }
};
