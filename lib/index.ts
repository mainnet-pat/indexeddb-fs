import { createFs } from '@framework/create-fs.function';

const fs = createFs();

export default fs;

export { fs as promises };

export { IFileEntry, IDirectoryEntry } from '@types';

export { ICreateFsProps, ICreateFsOutput } from '@framework/create-fs.types';

export { createFs } from '@framework/create-fs.function';
