import { HFAPIClient } from "../src/mod.ts"
import { HFRepoBase, HFRepoClient } from "../src/repo.ts"
import { assert, assertEquals, assertExists } from "./deps.ts"
import { Secret } from "./secret.ts"

const client = new HFAPIClient({
    accessToken: Secret.HF_READ_TOKEN,
})

Deno.test("get repo information", async () => {
    const repos: HFRepoBase[] = [
        { id: "facebook/dino-vitb16", type: "model" },
        { id: "DeepFloyd/IF-I-XL-v1.0", type: "model" },
        { id: "stabilityai/stable-diffusion-2-1", type: "model" },
        { id: "EleutherAI/lambada_openai", type: "dataset" },
        { id: "laion/laion400m", type: "dataset" },
        { id: "hakurei/waifu-diffusion-demo", type: "space" },
    ]

    for (const repoInfo of repos) {
        const repo = new HFRepoClient({
            client,
            id: repoInfo.id,
            type: repoInfo.type,
        })

        const info = await repo.info()

        assertEquals(info.id, repoInfo.id)
        assertExists(info.sha)
    }
})

Deno.test("ls files in repo", async () => {
    const repos: HFRepoBase[] = [
        { id: "facebook/dino-vitb16", type: "model" },
        { id: "DeepFloyd/IF-I-XL-v1.0", type: "model" },
        { id: "stabilityai/stable-diffusion-2-1", type: "model" },
        { id: "EleutherAI/lambada_openai", type: "dataset" },
        { id: "laion/laion400m", type: "dataset" },
        { id: "hakurei/waifu-diffusion-demo", type: "space" },
    ]

    for (const repoInfo of repos) {
        const repo = new HFRepoClient({
            client,
            id: repoInfo.id,
            type: repoInfo.type,
        })

        const files = await repo.ls()

        // console.log(files)

        assert(files.length > 0)
        assert(files.every((file) => file.oid.length === 40))
    }
})
