const Router = require("koa-router");
const axios = require("axios");
const { commonParams } = require("./config");

const router = new Router({
  prefix: "/api/search"
});

// 获取热门搜索
function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  const params = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(({ data = {} }) => {
      resolve(data.data);
    }).catch((e) => {
      reject(e);
    })
  });
}
router.get("/hotKey", async (ctx) => {
  try {
    let hotKey = await getHotKey();
    ctx.body = {
      code: 0,
      msg: "",
      data: hotKey || {}
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {}
    }; 
  }
});


// 获取搜索数据
function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  const headers = {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
  };

  const params = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { headers, params }).then(({ data = {} }) => {
      resolve(data.data || {});
    }).catch((e) => {
      reject(e);
    });
  });
}
router.get("/", async (ctx) => {
  const { query = "", page = 0, zhida = true, perpage = 0 } = ctx.request.query;
  try {
    let result = await search(query, page, zhida, 25);
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
    }
  }
});

module.exports = router;