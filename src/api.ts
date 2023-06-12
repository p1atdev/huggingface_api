import { HFAuth, HFUser } from "./auth.ts"
import { HF_API_BASE_URL } from "./endpoint.ts"
import { HFMetricsItem } from "./metrics.ts"
import { HFRepo, HFRepoBase, HFRepoClient, HFRepoType } from "./repo.ts"
import { HFFullTextSearchParams, HFFullTextSearchResult, HFSearchParams } from "./search.ts"

export class HFAPIClient {
    auth?: HFAuth

    constructor(auth?: HFAuth) {
        this.auth = auth
    }

    whoami = () => {
        return this.fetch<HFUser>("/whoami-v2")
    }

    login = async (auth?: HFAuth) => {
        this.auth = auth
        return await this.whoami()
    }

    createRepoClient = (repo: HFRepoBase) => {
        return new HFRepoClient({
            ...repo,
            client: this,
        })
    }

    private _searchRepo = async (
        repoType: HFRepoType,
        searchOptions?: HFSearchParams,
        options?: RequestInit
    ): Promise<HFRepo[]> => {
        const params = new URLSearchParams()
        Object.entries(searchOptions ?? {}).forEach(([key, value]) => {
            params.set(key, value)
        })

        const res = await this.fetch<HFRepo[]>(`/${repoType}s?${params.toString()}`, options)

        return res
    }

    models = async (options?: HFSearchParams) => {
        return await this._searchRepo("model", options)
    }
    datasets = async (options?: HFSearchParams) => {
        return await this._searchRepo("dataset", options)
    }
    spaces = async (options?: HFSearchParams) => {
        return await this._searchRepo("space", options)
    }

    searchFullText = async (options?: HFFullTextSearchParams) => {
        const params = new URLSearchParams()
        Object.entries(options ?? {}).forEach(([key, value]) => {
            params.set(key, value)
        })

        const res = await this.fetch<HFFullTextSearchResult>(`/search/full-text?${params.toString()}`)

        return res
    }

    // what is this???
    metrics = () => this.fetch<HFMetricsItem[]>("/metrics")

    fetchRaw = async (path: string, options?: RequestInit): Promise<Response> => {
        const headers = new Headers(options?.headers)
        if (this.auth) {
            headers.set("Authorization", `Bearer ${this.auth.accessToken}`)
        }

        const res = await fetch(`${HF_API_BASE_URL}${path}`, {
            ...options,
            headers,
        })

        if (!res.ok) {
            res.body?.cancel()
            throw new Error(`fetch ${HF_API_BASE_URL}${path} failed: ${res.status} ${res.statusText}`)
        }

        return res
    }

    fetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
        const res = await this.fetchRaw(path, options)

        return (await res.json()) as T
    }
}
