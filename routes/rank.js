const Router = require("koa-router");
const axios = require("axios");
const { commonParams } = require("./config");

const router = new Router({
  prefix: "/api/rank"
});

// 获取推荐列表
function getList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  const params = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(({ data = {} }) => {
      if (!data.data) {
        data.data = {};
      }
      resolve(data.data.topList || []);
    }).catch((e) => {
      reject(e);
    })
  });
}

// 获取歌曲列表
function musicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const params = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(({ data = {} }) => {
      resolve(data || []);
    }).catch((e) => {
      reject(e);
    })
  });
}

// 测试
router.get("/test", (ctx) => {
  ctx.body = {
    code: 0,
    msg: "测试",
    data: {}
  };
});

// 获取推荐列表
router.get("/topList", async (ctx) => {
  try {
    let topList = await getList();
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        topList
      }
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {
        topList: []
      }
    };
  }
});

// 获取歌曲列表
router.get("/musicList", async (ctx) => {
  const { topid } = ctx.request.query;
  try {
    if (!topid) {
      ctx.body = {
        code: -1,
        msg: "缺少参数",
        data: {}
      };
      return false;
    }
    let data = await musicList(topid);
    ctx.body = {
      code: 0,
      msg: "",
      data
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {}
    };
  }
});

module.exports = router;