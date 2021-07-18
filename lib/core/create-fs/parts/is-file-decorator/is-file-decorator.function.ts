import { formatAndValidateFullPath } from '@core/utils';

import { EntryType } from '@types';
import { IsFileDecoratorProps } from './is-file-decorator.types';

export const isFileDecorator =
  ({ exists, rootDirectoryName, initializeObjectStore }: IsFileDecoratorProps) =>
  async (fullPath: string): Promise<boolean> => {
    const verifiedFullPath = formatAndValidateFullPath(fullPath, rootDirectoryName);

    const doesDirectoryExists = await exists(verifiedFullPath);

    if (!doesDirectoryExists) {
      throw new Error(`"${fullPath}" file does not exist.`);
    }

    const objectStore = await initializeObjectStore('readonly');

    return new Promise((resolve) => {
      const request = objectStore.get(verifiedFullPath);

      request.onerror = () => resolve(false);

      request.onsuccess = (event: Event) => {
        const targetWithType = event.target as IDBRequest;
        const response = targetWithType.result;

        resolve(Boolean(response?.type === EntryType.FILE));
      };
    });
  };