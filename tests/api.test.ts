import { HFAPIClient, HFUser } from "../src/mod.ts"
import { assert, assertExists, assertRejects } from "./deps.ts"
import { Secret } from "./secret.ts"

// wait for a random sec to avoid rate limit
const wait = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, Math.random() * 1000)
    })
}

Deno.test("whoami directly", async () => {
    const client = new HFAPIClient({
        accessToken: Secret.HF_READ_TOKEN,
    })

    await wait()

    const user = await client.fetch<HFUser>("/whoami-v2")

    // console.log(user)

    assertExists(user.id)
})

Deno.test("whoami with accessToken", async () => {
    const client = new HFAPIClient({
        accessToken: Secret.HF_READ_TOKEN,
    })

    await wait()

    const user = await client.whoami()

    assertExists(user.id)
})

Deno.test("whoami with accessToken passed after initialized", async () => {
    const client = new HFAPIClient()

    await wait()

    client.login({
        accessToken: Secret.HF_READ_TOKEN,
    })

    const user = await client.whoami()

    assertExists(user.id)
})

Deno.test("whoami without accessToken and should reject", async () => {
    const client = new HFAPIClient()

    await wait()

    await assertRejects(() => {
        return client.whoami()
    })
})

Deno.test("get metrics", async () => {
    const client = new HFAPIClient()

    const metrics = await client.metrics()

    // console.log(metrics)

    assertExists(metrics)
    metrics.forEach((metric) => {
        assertExists(metric.id)
    })
})

Deno.test("search models without any params", async () => {
    const client = new HFAPIClient()

    const models = await client.models()

    // console.log(models)

    assertExists(models)
    models.forEach((model) => {
        assertExists(model.id)
    })
})

Deno.test("search models with params", async () => {
    const client = new HFAPIClient({
        accessToken: Secret.HF_READ_TOKEN,
    })

    const models = await client.models({
        search: "stable-diffusion",
        filter: "stable-diffusion",
        limit: 10,
    })

    // console.log(models)

    assertExists(models)
    models.forEach((model) => {
        assertExists(model.id)
        assertExists(model.tags)
        assert(model.tags.includes("stable-diffusion"))
    })
})

Deno.test("search full text without params", async () => {
    const client = new HFAPIClient({
        accessToken: Secret.HF_READ_TOKEN,
    })

    const limit = 30

    const result = await client.searchFullText({
        q: "latent diffusion",
        limit,
    })

    // console.log(result)

    assertExists(result.estimatedTotalHits)
    assert(result.hits.length == limit)
    result.hits.forEach((hit) => {
        assertExists(hit.repoId)
    })
})
