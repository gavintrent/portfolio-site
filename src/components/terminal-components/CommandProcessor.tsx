"use client";

import { profile } from '@/data/profile';
import { projects } from '@/data/projects';

export interface CommandOutput {
  type: 'text' | 'list' | 'error';
  content: string | string[];
  command: string;
}

export class CommandProcessor {
  private currentProject: typeof projects[0] | null = null;

  setCurrentProject(project: typeof projects[0] | null) {
    this.currentProject = project;
  }

  getCurrentProject() {
    return this.currentProject;
  }

  executeCommand(command: string): CommandOutput {
    const cleanCommand = command.trim().toLowerCase();
    
    if (!cleanCommand) {
      return { type: 'text', content: '', command: '' };
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
          '  goto    - Open project link in browser (if deployed)',
          '  github  - Navigate to GitHub repository',
          '  info    - Get project information and details',
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
            '  photography - Navigate to photo portfolio (coming soon)',
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
        return {
          type: 'text',
          content: 'Photography portfolio coming soon...',
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

      default:
        return { type: 'error', content: `Command not found: ${cleanCommand}. Type 'help' for available commands.`, command: cleanCommand };
    }
  }
}
