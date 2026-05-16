import pkg from "jsonwebtoken";

// jsonwebtokenはCommonJS
const { sign } = pkg;

export default defineEventHandler(async (event) => {
  const { userId, nickname } = await readBody(event);

  if (!userId || !nickname) {
    throw createError({ statusCode: 400, message: "userId and nickname are required" });
  }

  const config = useRuntimeConfig();

  await $fetch(config.hasuraEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": config.hasuraAdminSecret,
    },
    body: JSON.stringify({
      query: `
        mutation($userId: String!, $nickname: String) {
          insert_users(
            objects: [{ id: $userId, name: $nickname, last_seen: "now()" }]
            on_conflict: { constraint: users_pkey, update_columns: [last_seen, name] }
          ) {
            affected_rows
          }
        }
      `,
      variables: { userId, nickname },
    }),
  });

  const token = sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": userId,
      },
    },
    config.jwtSecret,
    { expiresIn: "24h" },
  );

  return { token };
});
