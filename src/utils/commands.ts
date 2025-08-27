import { profile } from '@/data/profile';
import { projects } from '@/data/projects';

export interface CommandOutput {
  type: 'text' | 'list' | 'link' | 'error';
  content: string | string[] | { text: string; url: string }[];
  command: string;
}

export const commands: Record<string, () => CommandOutput> = {
  help: () => ({
    type: 'list',
    content: [
      'Available commands:',
      '  help     - Show this help message',
      '  about    - Display personal information',
      '  projects - List portfolio projects',
      '  contact  - Show contact information',
      '  clear    - Clear terminal history',
      '  ls       - List available commands (alias for help)',
      '  whoami   - Show current user (alias for about)',
      '  motd     - Display message of the day'
    ],
    command: 'help'
  }),

  about: () => ({
    type: 'text',
    content: `${profile.name} - ${profile.title}

${profile.bio}`,
    command: 'about'
  }),

  projects: () => ({
    type: 'list',
    content: projects.map(project => 
      `${project.title}${project.featured ? ' ★' : ''}
  ${project.description}
  Tech: ${project.technologies.join(', ')}
  ${project.link ? `Demo: ${project.link}` : ''}${project.github ? `\n  GitHub: ${project.github}` : ''}`
    ),
    command: 'projects'
  }),

  contact: () => ({
    type: 'list',
    content: [
      'Contact Information:',
      `  Email: ${profile.contact.email}`,
      `  GitHub: ${profile.contact.github}`,
      `  LinkedIn: ${profile.contact.linkedin}`,
      profile.contact.twitter ? `  Twitter: ${profile.contact.twitter}` : ''
    ].filter(Boolean),
    command: 'contact'
  }),

  clear: () => ({
    type: 'text',
    content: '',
    command: 'clear'
  }),

  ls: () => commands.help(),

  whoami: () => commands.about(),

  motd: () => ({
    type: 'text',
    content: `Welcome to ${profile.name}'s Terminal Portfolio!

Type 'help' to see available commands.
Type 'about' to learn more about me.
Type 'projects' to view my work.
Type 'contact' to get in touch.

Happy exploring! 🚀`,
    command: 'motd'
  })
};

export const isValidCommand = (command: string): boolean => {
  return command in commands;
};

export const executeCommand = (command: string): CommandOutput => {
  const cleanCommand = command.trim().toLowerCase();
  
  if (!cleanCommand) {
    return {
      type: 'text',
      content: '',
      command: ''
    };
  }

  if (isValidCommand(cleanCommand)) {
    return commands[cleanCommand]();
  }

  return {
    type: 'error',
    content: `Command not found: ${command}. Type 'help' for available commands.`,
    command: cleanCommand
  };
};
