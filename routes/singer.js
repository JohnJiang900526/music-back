const Router = require("koa-router");
const axios = require("axios");
const { commonParams } = require("./config");

const router = new Router({
  prefix: "/api/singer"
});

// 获取歌手列表
function getList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const params = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(({ data = {} }) => {
      if (!data.data) {
        data.data = {};
      }
      resolve(data.data.list || []);
    }).catch((e) => {
      reject(e);
    });
  });
}
router.get("/list", async (ctx) => {
  try {
    let list = await getList();

    ctx.body = {
      code: 0,
      msg: "",
      data: {
        list
      }
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {}
    }
  }
});

// 获取歌手详情信息
function getDetail(singermid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const params = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(({ data = {} }) => {
      resolve(data.data);
    }).catch((e) => {
      reject(e);
    });
  });
}
router.get("/detail/:singermid", async (ctx) => {
  const { singermid } = ctx.params;
  try {
    let detail = await getDetail(singermid);
    ctx.body = {
      code: 0,
      msg: "",
      data: detail
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e.message,
      data: {}
    }
  }
});

module.exports = router;
