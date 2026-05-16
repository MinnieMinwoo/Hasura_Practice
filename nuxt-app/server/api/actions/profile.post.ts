/**
 * @deprecated Remote Schema (server/api/graphql.ts) に移行済み
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('[profile] body:', JSON.stringify(body, null, 2))

  const userId = body.session_variables?.['x-hasura-user-id']

  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  return {
    id: userId,
    email: `${userId}@example.com`,
    picture: `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`,
  }
})
