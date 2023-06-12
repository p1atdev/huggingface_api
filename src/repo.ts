import { HFAPIClient } from "./api.ts"
import { HF_BASE_URL } from "./endpoint.ts"
import { HFFile } from "./file.ts"

// デフォルトの revision。
// ただ、手動で master ブランチでアップロードされていた場合とかだと
// 問題が起きるが、どうしようもないのでまあいっかという感じ
const DEFAULT_REVISION = "main"

export type HFRepoType = "model" | "dataset" | "space"

export interface HFRepoSibling {
    rfilename: string
}

export interface HFCardData {
    license?: string
    tags?: string[]
    pretty_name?: string
    language?: string[]
}

export interface HFModelCardData extends HFCardData {
    extra_gated_prompt?: string
    extra_gated_fields?: string[]
    datasets?: string[]
    inference?: boolean
    task_ids?: string[]
}

export interface HFDatasetCardData extends HFCardData {
    language_creators?: string[]
    multilinguality?: string[]
    datasets?: string[]
    inference?: boolean
    task_ids?: string[]
    source_datasets?: string[]
}

export interface HFRepoBase {
    id: string
    type: HFRepoType
    revision?: string
}

export interface HFPrivateRepo extends HFRepoBase {
    // 以降はレスポンスから取得できる
    author: string
    sha: string
    lastModified: Date
    private: boolean
    gated: boolean
    disabled: boolean
    tags: string[]
    downloads: number
    likes: string
    siblings: HFRepoSibling[]
}

export interface HFPublicRepo extends HFPrivateRepo {
    // public なレポのみ一部取得可能
    pipeline_tag?: string
    library_name?: string
    "model-index"?: string | null

    cardData: HFCardData | HFModelCardData | HFDatasetCardData
    transformersInfo?: {
        auto_model?: string
        pipeline_tag?: string
        processor?: string
    }
    spaces?: string[]
}

export type HFRepo = HFPrivateRepo | HFPublicRepo

export interface HFRepoClient extends HFRepoBase {}
export class HFRepoClient {
    client: HFAPIClient

    constructor({
        client,
        id,
        type,
        revision,
    }: {
        client: HFAPIClient
        id: string
        type: HFRepoType
        revision?: string
    }) {
        this.client = client
        this.id = id
        this.type = type
        this.revision = revision
    }

    private composePath = (tree = true, revision?: string): string => {
        if (tree) {
            return `/${this.type}s/${this.id}/tree/${revision ?? this.revision ?? DEFAULT_REVISION}`
        }

        if (revision) {
            return `/${this.type}s/${this.id}/revision/${revision}`
        }

        return `/${this.type}s/${this.id}`
    }

    private composeFullURL = (path: string, urlType: "tree" | "blob" | "resolve", revision?: string): string => {
        switch (this.type) {
            case "model": {
                return `${HF_BASE_URL}/${this.id}/${urlType}/${revision ?? this.revision ?? DEFAULT_REVISION}${path}`
            }
            default: {
                return `${HF_BASE_URL}/${this.type}s/${this.id}/${urlType}/${
                    revision ?? this.revision ?? DEFAULT_REVISION
                }${path}`
            }
        }
    }

    info = async (revison?: string) => {
        const res = await this.client.fetch<HFRepo>(this.composePath(false, revison))

        return res
    }

    ls = async (path = "/", revision?: string, requestInit?: RequestInit) => {
        const res = await this.client
            .fetch<HFFile[]>(`${this.composePath(true, revision)}${path}`, requestInit)
            .then((res) => {
                return res.map((file) => {
                    if (file.type === "directory") {
                        return {
                            ...file,
                            url: {
                                preview: this.composeFullURL(`/${file.path}`, "tree", revision),
                                raw: undefined,
                            },
                        }
                    } else {
                        return {
                            ...file,
                            url: {
                                preview: this.composeFullURL(`/${file.path}`, "blob", revision),
                                raw: this.composeFullURL(`/${file.path}`, "resolve", revision),
                            },
                        }
                    }
                })
            })
        return res
    }
}
