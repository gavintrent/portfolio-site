"use client";

import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { getTopSecretFile } from '@/data/topSecretFiles';

export interface CommandOutput {
  type: 'text' | 'list' | 'error';
  content: string | string[];
  command: string;
}

export class CommandProcessor {
  private currentProject: typeof projects[0] | null = null;
  private inTopSecret: boolean = false;

  setCurrentProject(project: typeof projects[0] | null) {
    this.currentProject = project;
  }

  getCurrentProject() {
    return this.currentProject;
  }

  setInTopSecret(inTopSecret: boolean) {
    this.inTopSecret = inTopSecret;
  }

  getInTopSecret() {
    return this.inTopSecret;
  }

  executeCommand(command: string): CommandOutput {
    const cleanCommand = command.trim().toLowerCase();
    
    if (!cleanCommand) {
      return { type: 'text', content: '', command: '' };
    }

    // Handle top-secret directory commands (check this first)
    if (this.inTopSecret) {
      return this.handleTopSecretCommands(cleanCommand);
    }

    // Handle cd command for project navigation
    if (cleanCommand.startsWith('cd ')) {
      return this.handleCdCommand(cleanCommand);
    }

    // Handle project-specific commands when a project is selected
    if (this.currentProject) {
      return this.handleProjectCommands(cleanCommand);
    }

    // Handle general commands when no project is selected
    return this.handleGeneralCommands(cleanCommand);
  }

  private handleCdCommand(cleanCommand: string): CommandOutput {
    const targetDir = cleanCommand.substring(3).trim();
    
    // Check if target is a number (project ID)
    const projectNumber = parseInt(targetDir);
    if (!isNaN(projectNumber) && projectNumber >= 1 && projectNumber <= projects.length) {
      const project = projects[projectNumber - 1];
      this.setCurrentProject(project);
      return { 
        type: 'list', 
        content: [
          `Navigated to ${project.title} project`,
          '',
          'Available commands:',
          '  info    - Get project information and details',
          '  goto    - Open project link in browser (if deployed)',
          '  github  - Navigate to GitHub repository',
          '  back    - Return to project list'
        ],
        command: cleanCommand 
      };
    } else {
      // Check if target is a project name
      const projectNames = projects.map(p => p.title.toLowerCase().replace(/\s+/g, '-'));
      if (projectNames.includes(targetDir)) {
        const project = projects.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === targetDir);
        if (project) {
          this.setCurrentProject(project);
          return { 
            type: 'list', 
            content: [
              `Navigated to ${project.title} project`,
              '',
              'Available commands:',
              '  goto    - Open project link in browser (if deployed)',
              '  github  - Navigate to GitHub repository',
              '  info    - Get project information and details',
              '  back    - Return to project list'
            ],
            command: cleanCommand 
          };
        }
      }
      return { type: 'error', content: `Project '${targetDir}' not found. Use 'projects' to see available projects.`, command: cleanCommand };
    }
  }

  private handleProjectCommands(cleanCommand: string): CommandOutput {
    switch (cleanCommand) {
      case 'goto':
        if (this.currentProject?.link) {
          window.open(this.currentProject.link, '_blank');
          return { type: 'text', content: `Opened ${this.currentProject.title} in new tab`, command: cleanCommand };
        } else {
          return { type: 'text', content: 'Not currently publicly deployed', command: cleanCommand };
        }
      case 'github':
        if (this.currentProject?.github) {
          window.open(this.currentProject.github, '_blank');
          return { type: 'text', content: `Opened ${this.currentProject.title} GitHub in new tab`, command: cleanCommand };
        } else {
          return { type: 'text', content: 'GitHub repository not available', command: cleanCommand };
        }
      case 'info':
        if (!this.currentProject) {
          return { type: 'error', content: 'No project selected', command: cleanCommand };
        }
        return { 
          type: 'text', 
          content: `${this.currentProject.title}${this.currentProject.featured ? ' ★' : ''}\n\n${this.currentProject.description}\n\nTech: ${this.currentProject.technologies.join(', ')}`, 
          command: cleanCommand 
        };
      case 'back':
        this.setCurrentProject(null);
        return { 
          type: 'list', 
          content: [
            'Returned to project list',
            '',
            'Type cd [project-name-or-number] to navigate to a particular project',
            '',
            '\n',
            ...projects.map((project, index) => 
              `${index + 1}\t${project.title}`
            )
          ], 
          command: cleanCommand 
        };
      default:
        return { type: 'error', content: `Command not found: ${cleanCommand}. Use goto, github, info, or back.`, command: cleanCommand };
    }
  }

  private handleGeneralCommands(cleanCommand: string): CommandOutput {
    switch (cleanCommand) {
      case 'help':
        return {
          type: 'list',
          content: [
            'Available commands:',
            '  help       - See a list of available commands',
            '  clear      - Clear the terminal',
            '  about      - Display info about me',
            '  projects   - List available projects',
            '  photography - Navigate to photo portfolio',
            '  contact    - Show contact information'
          ],
          command: cleanCommand
        };

      case 'clear':
        return { type: 'text', content: 'CLEAR_TERMINAL', command: cleanCommand };

      case 'about':
        return {
          type: 'text',
          content: `${profile.name} - ${profile.title}\n\n${profile.bio}`,
          command: cleanCommand
        };

      case 'projects':
        return {
          type: 'list',
          content: [
            'Type cd [project-name-or-number] to navigate to a particular project',
            '',
            '\n',
            ...projects.map((project, index) => 
              `${index + 1}\t${project.title}`
            )
          ],
          command: cleanCommand
        };

      case 'photography':
        window.open('https://www.instagram.com/gavin_trent_', '_blank');
        return {
          type: 'text',
          content: 'Opening Instagram photography portfolio in new tab...\n\nIn-site portfolio coming soon!',
          command: cleanCommand
        };

      case 'contact':
        return {
          type: 'list',
          content: [
            'Contact Information:',
            `  Email: ${profile.contact.email}`,
            `  GitHub: ${profile.contact.github}`,
            `  LinkedIn: ${profile.contact.linkedin}`
          ],
          command: cleanCommand
        };

      case 'continue-game':
        return {
          type: 'text',
          content: 'CONTINUE_GAME',
          command: cleanCommand
        };

      default:
        return { type: 'error', content: `Command not found: ${cleanCommand}. Type 'help' for available commands.`, command: cleanCommand };
    }
  }

  private handleTopSecretCommands(cleanCommand: string): CommandOutput {
    switch (cleanCommand) {
      case 'ls':
      case 'ls -la':
        return {
          type: 'list',
          content: [
            'Access granted to: /top-secret/',
            '',
            'Available files:',
            '  secret-recipe.txt',
            '  instant-ramen-tierlist.txt',
            '  backup-passwords.txt',
            '  sensitive-images/',
            '',
            'Type `cd [file-or-folder-name]`, `cat [filename]`, or just the filename to explore.'
          ],
          command: cleanCommand
        };

      case 'help':
        return {
          type: 'list',
          content: [
            'Top-Secret Directory Commands:',
            '',
            '  ls, ls -la     - List files in current directory',
            '  cd [file]      - Navigate to file or folder',
            '  cat [file]     - Display file contents',
            '  [filename]     - Direct access to file/folder',
            '  cd .., cd /    - Exit top-secret directory',
            '  back           - Return to normal terminal',
            '  clear          - Clear terminal and exit secret mode',
            '  help           - Show this help message',
            '',
            'Available files:',
            '  secret-recipe.txt',
            '  instant-ramen-tierlist.txt', 
            '  backup-passwords.txt',
            '  sensitive-images/'
          ],
          command: cleanCommand
        };

      case 'clear':
        this.inTopSecret = false;
        return {
          type: 'text',
          content: 'CLEAR_TERMINAL',
          command: cleanCommand
        };

      case 'back':
        this.inTopSecret = false;
        return {
          type: 'text',
          content: 'Exited top-secret directory. Access revoked.',
          command: cleanCommand
        };

      case 'cd ..':
      case 'cd /':
        this.inTopSecret = false;
        return {
          type: 'text',
          content: 'Exited top-secret directory. Access revoked.',
          command: cleanCommand
        };

      default:
        // Handle cd command
        if (cleanCommand.startsWith('cd ')) {
          const target = cleanCommand.substring(3).trim();
          return this.handleTopSecretFile(target, cleanCommand);
        }
        
        // Handle cat command
        if (cleanCommand.startsWith('cat ')) {
          const target = cleanCommand.substring(4).trim();
          return this.handleTopSecretFile(target, cleanCommand);
        }
        
        // Handle direct filename/folder access
        const directFile = this.handleTopSecretFile(cleanCommand, cleanCommand);
        if (directFile.type !== 'error') {
          return directFile;
        }
        
        return { type: 'error', content: `Command not found: ${cleanCommand}`, command: cleanCommand };
    }
  }

  private handleTopSecretFile(target: string, originalCommand: string): CommandOutput {
    // Special handling for sensitive-images folder
    if (target === 'sensitive-images') {
      // Open the YouTube link in a new window
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
      return {
        type: 'text',
        content: 'Opening sensitive images in new window...',
        command: originalCommand
      };
    }
    
    const file = getTopSecretFile(`top-secret/${target}`);
    
    if (file) {
      if (file.type === 'folder') {
        return {
          type: 'list',
          content: [
            `Access granted to: /top-secret/${target}/`,
            '',
            'Available files:',
            ...(file.files?.map(f => `  ${f.name}`) || []),
            '',
            'Type `cd [filename]`, `cat [filename]`, or just the filename to view a file, or `cd ..` to go back.'
          ],
          command: originalCommand
        };
      } else if (file.content) {
        return {
          type: 'list',
          content: file.content,
          command: originalCommand
        };
      }
    }
    
    return {
      type: 'error',
      content: `File or directory not found: ${target}`,
      command: originalCommand
    };
  }
}
