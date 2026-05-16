import { createSchema, createYoga } from "graphql-yoga";

const schema = createSchema({
  typeDefs: `
    type auth0_profile {
      id: String
      email: String
      picture: String
    }

    type Query {
      auth0: auth0_profile
    }
  `,
  resolvers: {
    Query: {
      auth0: (_: unknown, __: unknown, context: { request: Request }) => {
        const token = context.request.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) return null

        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        const userId = payload['https://hasura.io/jwt/claims']?.['x-hasura-user-id']

        if (!userId) return null

        return {
          id: userId,
          email: `${userId}@example.com`,
          picture: `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`,
        }
      },
    },
  },
});

const yoga = createYoga({ schema, graphqlEndpoint: "/api/graphql" });

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const body = await readRawBody(event);

  const response = await yoga.fetch(url, {
    method: event.method,
    headers: getRequestHeaders(event) as HeadersInit,
    body,
  });

  setResponseStatus(event, response.status);
  response.headers.forEach((value, key) => setResponseHeader(event, key, value));

  return response.text();
});
