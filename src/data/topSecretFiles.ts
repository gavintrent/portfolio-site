export interface TopSecretFile {
  name: string;
  type: 'file' | 'folder';
  content?: string[];
  files?: TopSecretFile[];
}

export const topSecretFiles: TopSecretFile[] = [
  {
    name: 'secret-recipe.txt',
    type: 'file',
    content: [
      '=== GAVINS TOP SECRET RECIPE FOR MANGO STICKY RICE ===',
      '',
      'Make the glutinous rice in a rice cooker same as you’d make white rice',
      '',
      'Put the whole can of coconut milk in a saucepan and bring it to a simmer',
      '',
      'Then add sugar by the spoonful, letting it dissolve and tasting along the way until it’s the sweetness you want',
      '',
      'Pour most (not all) of the mixture into the rice and stir until the rice absorbs it',
      '',
      'With the remaining coconut milk mixture, mix a small amount of water with corn starch and then add it to the saucepan while stirring until it thickens into a sauce',
      '',
      'Plate rice, mango, sauce on top, sesame seeds',
      '',
      '--- END OF CLASSIFIED DOCUMENT ---'
    ]
  },

  {
    name: 'instant-ramen-tierlist.txt',
    type: 'file',
    content: [
        '=== INSTANT RAMEN TIERLIST ===',
        '',
        '=== S TIER ===',
        'SHIN Black, Buldak Carbonara, Ottogi Jin Mild/Spicy, Jjajangmen Black Bean, Indomie Mi Goreng, Cup Noodles Curry,',
        '',
        '=== A TIER ===',
        'Buldak Spicy, Ottogi Sesame, Soba Noodle Soup (the one in the green package), Indomie Curry, Igarashi Seimen Okinawa Style Wafu Dashi',
        '',
        '=== B TIER ===',
        'Gomtang Korean Beef, SHIN Original, SHIN Green, Neoguri Spicy Seafood, ',
        '',
        '=== C TIER ===',
        'SHIN Gold, Top Ramen, Maruchan',
        '',
        '=== F TIER ===',
        'Sapporo Ichiban Tonkotsu (flavorless dogwater)'
    ]
  },
  {
    name: 'backup-passwords.txt',
    type: 'file',
    content: [
      '=== BACKUP PASSWORDS (ENCRYPTED) ===',
      '',
      'WARNING: This file contains highly sensitive information!',
      '',
      'Password: 123456789'
    ]
  },
  {
    name: 'sensitive-images/',
    type: 'folder',
    files: [
      {
        name: 'rickroll.jpg',
        type: 'file',
        content: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ']
      }
    ]
  }
];

export const getTopSecretFile = (path: string): TopSecretFile | null => {
  const parts = path.split('/').filter(part => part && part !== 'top-secret');
  
  if (parts.length === 0) {
    return { name: '/top-secret/', type: 'folder', files: topSecretFiles };
  }
  
  let current: TopSecretFile | undefined = topSecretFiles.find(file => file.name === parts[0]);
  
  for (let i = 1; i < parts.length; i++) {
    if (!current || current.type !== 'folder') {
      return null;
    }
    current = current.files?.find(file => file.name === parts[i]);
  }
  
  return current || null;
};
