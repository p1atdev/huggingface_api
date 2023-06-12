// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts"

await emptyDir("./npm")

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",

    shims: {
        deno: true,
    },
    test: false,
    package: {
        // package.json properties
        name: "huggingface_api",
        version: Deno.args[0],
        description: "HuggingFace API client.",
        license: "MIT",
        repository: {
            type: "git",
            url: "git+https://github.com/p1atdev/huggingface_api",
        },
    },
    compilerOptions: {
        lib: ["DOM"],
    },
    postBuild() {
        // steps to run after building and before running the tests
        Deno.copyFileSync("LICENSE", "npm/LICENSE")
        Deno.copyFileSync("README.md", "npm/README.md")
    },
})
