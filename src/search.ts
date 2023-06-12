import { HFRepoType } from "./repo.ts"

export interface HFSearchParams {
    /**
     * Filter based on substrings for repos and their usernames,
     * such as resnet or microsoft.
     */
    search?: string

    /**
     * Filter models by an author or organization,
     * such as huggingface or microsoft.
     */
    author?: string

    /**
     * Filter based on tags, such as text-classification or spacy.
     */
    filter?: string

    /**
     * Property to use when sorting, such as downloads or modified.
     */
    sort?: "downloads" | "modified" | "likes"

    /**
     * Direction in which to sort, such as -1 for descending,
     * and 1 for ascending. Defaults to -1.
     */
    direction?: -1 | 1

    /**
     * Limit the number of models fetched.
     */
    limit?: number

    /**
     * Whether to fetch most model data, such as all tags, the files, etc
     */
    full?: boolean

    /**
     * Whether to also fetch the repo config.
     */
    config?: boolean

    library?: string | string[]
}

export interface HFFullTextSearchParams {
    /**
     * Search query.
     */
    q?: string

    /**
     * Number of results to return.
     */
    limit?: number

    /**
     * Number of results to skip.
     * Usually set to (page - 1) * limit.
     */
    skip?: number

    /**
     * Which type of repo to search.
     */
    type?: HFRepoType | HFRepoType[]
}

export interface HFFullTextSearchResult {
    estimatedTotalHits: number
    hits: HFFullTextSearchHit[]
}

export interface HFFullTextSearchHit {
    /**
     * this is not the form of "username/repo-name".
     * returns repo's hash oid.
     */
    repoId: string
    repoOwnerId: string
    /**
     * this is the form of "username/repo-name".
     */
    name: string
    /**
     * the part of "repo-name"
     */
    repoName: string
    repoOwner: string

    authorData: {
        avatarUrl: string
        fullname: string
        name: string
        type: "user"
        isPro: boolean

        /**
         * if the user is huggingface staff, this will be true.
         */
        isHf: boolean
    }

    /**
     * Tags separated by commas.
     */
    tags: string
    isPrivate: boolean
    type: HFRepoType
    likes: number

    fileName: string
    isReadmeFile: boolean
    readmeStartLine: number
    updatedAt: number
}
