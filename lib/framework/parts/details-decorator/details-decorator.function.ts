import { formatAndValidateFullPath } from '@utils';

import { IFileEntry, IDirectoryEntry } from '@types';
import { IDetailsDecoratorProps } from './details-decorator.types';

export const detailsDecorator =
  ({ directoryDetails, exists, fileDetails, isDirectory, isFile, rootDirectoryName }: IDetailsDecoratorProps) =>
  async (fullPath: string): Promise<IFileEntry<unknown> | IDirectoryEntry> => {
    const verifiedFullPath = formatAndValidateFullPath(fullPath, rootDirectoryName);

    const doesTargetExist = await exists(verifiedFullPath);

    if (!doesTargetExist) {
      throw new Error(`"${verifiedFullPath}" file or directory does not exist.`);
    }

    const targetIsOfTypeFile = await isFile(verifiedFullPath);
    const targetIsOfTypeDirectory = await isDirectory(verifiedFullPath);

    if (targetIsOfTypeFile && targetIsOfTypeDirectory) {
      throw new Error(`"${verifiedFullPath}" is a path of file and directory.`);
    }

    if (targetIsOfTypeFile) {
      return fileDetails(verifiedFullPath);
    }

    return directoryDetails(verifiedFullPath);
  };
