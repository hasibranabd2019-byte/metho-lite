import app from "../../src/index.js";

export async function onRequest({ request, env }) {
  return app.fetch(request, env);
}
