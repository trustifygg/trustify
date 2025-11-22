import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';
import { ExtendedClient, ButtonComponent, SelectMenuComponent, ModalComponent } from '../types';
import { logger } from '../utils/logger';

type ComponentType = 'buttons' | 'selectMenus' | 'modals';

interface ComponentCollections {
  buttons: Collection<string, ButtonComponent>;
  selectMenus: Collection<string, SelectMenuComponent>;
  modals: Collection<string, ModalComponent>;
}

export function loadComponents(client: ExtendedClient): void {
  client.components = {
    buttons: new Collection<string, ButtonComponent>(),
    selectMenus: new Collection<string, SelectMenuComponent>(),
    modals: new Collection<string, ModalComponent>(),
  };

  loadComponentType(client, 'buttons', 'button');

  loadComponentType(client, 'selectMenus', 'select menu');

  loadComponentType(client, 'modals', 'modal');
}

function loadComponentType(
  client: ExtendedClient,
  type: ComponentType,
  displayName: string
): void {
  const componentsPath = path.join(__dirname, `../components/${type}`);

  if (!fs.existsSync(componentsPath)) {
    logger.warning(`${displayName} directory not found`);
    return;
  }

  const componentFiles = fs
    .readdirSync(componentsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of componentFiles) {
    const filePath = path.join(componentsPath, file);

    try {
      const component: ButtonComponent | SelectMenuComponent | ModalComponent =
        require(filePath).default || require(filePath);

      if (!('customId' in component) || !('execute' in component)) {
        logger.warning(`Component at ${filePath} is missing required "customId" or "execute" property`);
        continue;
      }

      client.components[type].set(component.customId, component as any);
      logger.success(`Loaded ${displayName}: ${component.customId}`);
    } catch (error) {
      logger.error(`Failed to load ${displayName} from ${filePath}:`, error);
    }
  }
}
