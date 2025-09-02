export interface Profile {
  name: string;
  title: string;
  bio: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    twitter?: string;
    instagram?: string;
  };
}

export const profile: Profile = {
  name: "Gavin Trent",
  title: "Full Stack Developer",
  bio: `Hello there! I'm a UCLA CS grad from the school of engineering. 
  I specialize in modern web technologies, LLM applications, and user-friendly products.

  When I'm not coding, you can find me cooking, doing photography, playing video games, or reading the classics.
  
  I believe in writing clean, maintainable code and building applications that make a difference.
  
  P.S: try typing the secret command "continue-game" :)`,
  contact: {
    email: "gavinjtrent@gmail.com",
    github: "https://github.com/gavintrent",
    linkedin: "https://www.linkedin.com/in/gavin-trent-864775247/",
    instagram: "https://www.instagram.com/gavin_trent_"
  }
};
