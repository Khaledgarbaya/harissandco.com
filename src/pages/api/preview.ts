import { createPreviewHandler } from "@uniformdev/canvas-next"

// Preview Mode, more info https://nextjs.org/docs/advanced-features/preview-mode
export default createPreviewHandler({
  playgroundPath: "/playground",
  secret: () => process.env.UNIFORM_PREVIEW_SECRET || "hello-world",
})
