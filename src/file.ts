export type HFFileType = "file" | "directory"

export interface HFFileURL {
    raw?: string
    preview: string
}

export interface HFFile {
    type: HFFileType
    oid: string

    /**
     * file size in bytes.
     * if directory, size is 0
     */
    size: number
    path: string

    /**
     * set if it is large file storage object
     */
    lfs?: HFFileLFS

    url: HFFileURL
}

export interface HFFileLFS {
    oid: string
    size: number
    pointerSize: number
}
