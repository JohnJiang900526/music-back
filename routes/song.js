const Router = require("koa-router");
const axios = require("axios");
const { commonParams } = require("./config");

const router = new Router({
  prefix: "/api/song"
});

function getPurlUrl(url_mid) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
  const headers = {
    referer: 'https://y.qq.com/',
    origin: 'https://y.qq.com',
    'Content-type': 'application/x-www-form-urlencoded'
  };

  const comm = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  return new Promise((resolve, reject) => {
    axios.post(url, { url_mid, comm }, { headers }).then(({ data = {} }) => {
      if (!data.url_mid) {
        data.url_mid = {};
      }
      resolve(data.url_mid.data);
    }).catch((e) => {
      reject(e);
    });
  });
}
router.post("/getPurlUrl", async (ctx) => {
  const {  url_mid } = ctx.request.body;
  if (!url_mid) {
    ctx.body = {
      code: -1,
      msg: "缺少参数",
      data: {}
    };
    return false;
  }
  
  try {
    const result = await getPurlUrl(url_mid);
    ctx.body = {
      code: 0,
      msg: "",
      data: result
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {}
    };
  }
});

router.options("/getPurlUrl", async (ctx) => {
  const {  url_mid } = ctx.request.body;
  if (!url_mid) {
    ctx.body = {
      code: -1,
      msg: "缺少参数",
      data: {}
    };
    return false;
  }
  
  try {
    const result = await getPurlUrl(url_mid);
    ctx.body = {
      code: 0,
      msg: "",
      data: result
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {}
    };
  }
});


function getLyric(songmid) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  const headers = {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
  };

  const params = Object.assign({}, commonParams, {
    songmid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { headers, params }).then(({ data = {} }) => {
      resolve(data.lyric);
    }).catch((e) => {
      reject(e);
    });
  });
}
router.get("/getLyric", async (ctx) => {
  const { songmid } = ctx.request.query;

  if (!songmid) {
    ctx.body = {
      code: -1,
      msg: "缺少参数",
      data: {}
    };
    return false;
  }
  try {
    const lyric = await getLyric(songmid);
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        lyric
      }
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {}
    };
    return false;
  }
});

module.exports = router;
