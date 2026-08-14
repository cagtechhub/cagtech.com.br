export default defineEventHandler(async (event) => {
  return await resolveSiteSettings(event)
})
