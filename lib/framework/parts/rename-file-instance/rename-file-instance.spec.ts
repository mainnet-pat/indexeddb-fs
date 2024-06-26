import { createFs } from '@framework/create-fs.function';

import { functionImportTest } from '@utils';

const { exists, readFile, removeFile, renameFile, writeFile } = createFs({
  databaseVersion: 1,
  rootDirectoryName: 'root',
  databaseName: 'renameFile',
  objectStoreName: 'objectStoreName',
});

describe('renameFile Function', () => {
  functionImportTest(renameFile);

  it('should throw an error when fullPath parameter is invalid', async () => {
    await expect(renameFile('//invalid path', 'new_file.txt')).rejects.toThrow('"//invalid path" path is invalid.');
  });

  it('should throw an error when the user tries to rename the file that does not exist', async () => {
    await expect(renameFile('file.txt', 'root')).rejects.toThrow('"root/file.txt" file does not exist.');
  });

  it('should throw an error when target is not a file', async () => {
    await expect(renameFile('root', 'root')).rejects.toThrow('"root" is not a file.');
  });

  it('should not throw an error when new filename is already taken', async () => {
    await writeFile('file.txt', 'content');
    await writeFile('file2.txt', 'content2');

    await expect(renameFile('file.txt', 'file2.txt')).resolves.not.toThrow();
    expect(await readFile('file2.txt')).toEqual('content');

    expect(await exists('file.txt')).toEqual(false);
    await removeFile('file2.txt');
  });

  it('should return renamed file on success', async () => {
    const writtenFile = await writeFile('test_file.txt', 'content');
    const renamedFile = await renameFile('test_file.txt', 'renamed_file.txt');

    await expect(exists('test_file.txt')).resolves.toBeFalsy();
    await expect(exists('renamed_file.txt')).resolves.toBeTruthy();

    expect(writtenFile.data).toEqual(renamedFile.data);
    expect(writtenFile.type).toEqual(renamedFile.type);
    expect(writtenFile.createdAt).toEqual(renamedFile.createdAt);
    expect(writtenFile.directory).toEqual(renamedFile.directory);
  });
});
