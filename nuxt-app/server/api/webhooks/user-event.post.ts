export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const name = body.event?.data?.new?.name;
  const op = body.event?.op;
  const trigger = body.trigger?.name;
  const table = body.table;

  console.log(`[Event Trigger] ${trigger} — ${op} on ${table?.schema}.${table?.name}`);

  if (op === "INSERT" && name) {
    // SendGridの代わりにコンソールログでメール送信をシミュレート
    console.log("--- Mock Email ---");
    console.log("To: admin@example.com");
    console.log("Subject: A new user has registered");
    console.log(`Body: Hi, a new user has registered under the name of ${name}`);
    console.log("-----------------");
  }

  return { success: true };
});
