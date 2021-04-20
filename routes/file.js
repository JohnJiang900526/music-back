const Router = require("koa-router");
const fs = require("fs");
const send = require('koa-send');
const path = require('path')

const router = new Router({
  prefix: "/api/file"
});

router.get("/:name", async (ctx) => {
  const name = ctx.params.name;
  const url = `public/static/upload/${name}`;

  ctx.attachment(url);
  await send(ctx, url);
});

module.exports = router;

