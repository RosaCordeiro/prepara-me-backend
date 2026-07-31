import { IStorageProvider } from "../IStorageProvider";

class StorageProviderInMemory implements IStorageProvider {
    private files: { file: string; folder: string }[] = [];

    async save(file: string, folder: string): Promise<string> {
        this.files.push({ file, folder });
        return file;
    }

    async delete(file: string, folder: string): Promise<void> {
        this.files = this.files.filter(
            (item) => !(item.file === file && item.folder === folder)
        );
    }
}

export { StorageProviderInMemory };
