import { createFs } from '@framework/create-fs.function';

import { functionImportTest } from '@utils';

const { createDirectory, exists, moveFile, readFile, writeFile } = createFs({
  databaseVersion: 1,
  databaseName: 'moveFile',
  rootDirectoryName: 'root',
  objectStoreName: 'objectStoreName',
});

describe('moveFile Function', () => {
  functionImportTest(moveFile);

  describe('paths validation', () => {
    it('should throw an error when sourcePath parameter is invalid', async () => {
      await expect(moveFile('source path', 'legit')).rejects.toThrow('"source path" path is invalid.');
    });

    it('should throw an error when destinationPath parameter is invalid', async () => {
      await expect(moveFile('source_path', 'destination path')).rejects.toThrow('"destination path" path is invalid.');
    });
  });

  describe('sourcePath access validation', () => {
    it('should throw an error when does not exist', async () => {
      await expect(moveFile('file.txt', 'test.txt')).rejects.toThrow('"root/file.txt" file does not exist.');
    });

    it('should throw an error when it is not a file', async () => {
      await createDirectory('directory_as_a_file_1');

      await expect(moveFile('directory_as_a_file_1', 'test.txt')).rejects.toThrow(
        '"root/directory_as_a_file_1" source is not a file.',
      );
    });
  });

  describe('destinationPath access validation', () => {
    it('should throw an error when the destination directory does not exist', async () => {
      await writeFile('file.txt', 'file content');

      await expect(moveFile('file.txt', 'test/test.txt')).rejects.toThrow('"root/test" directory does not exist.');
    });

    it('should not throw an error when the destination point is already taken', async () => {
      await writeFile('file.txt', 'file content');
      await writeFile('file2.txt', 'file content2');

      await expect(moveFile('file.txt', 'file2.txt')).resolves.not.toThrow();
      expect(await readFile('file2.txt')).toEqual('file content');

      expect(await exists('file.txt')).toEqual(false);
    });
  });

  it('should move a file to a brand new destination point', async () => {
    await createDirectory('moved_files');
    await writeFile('root_file.txt', 'root file content');

    await moveFile('root_file.txt', 'moved_files/file.txt');

    await expect(exists('root_file.txt')).resolves.toBeFalsy();
    await expect(readFile('moved_files/file.txt')).resolves.toEqual('root file content');
  });
});
