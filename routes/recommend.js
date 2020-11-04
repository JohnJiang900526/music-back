const Router = require("koa-router");
const axios = require("axios");
const { commonParams } = require("./config");

const router = new Router({
  prefix: "/api/recommend"
});


// 获取banner和推荐列表的数据
router.get("/", async (ctx) => {
  try {
    let list = await getList();
    let banner = await getBanner();

    ctx.body = {
      code: 0,
      msg: "",
      data: {
        list,
        banner
      }
    };
  } catch (e) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        list: [],
        banner: {}
      }
    };
  }
});


// 获取banner
function getBanner() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const params = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  const data = {
    slider: [{
        linkUrl: "https://y.qq.com/m/digitalbum/v3/gold/index.html?mid=002N3gR01CnUiG&_video=true&g_f=shoujijiaodian",
        picUrl: "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3154561.jpg",
        id: 31677
      },
      {
        linkUrl: "https://y.qq.com/m/digitalbum/v3/gold/index.html?openinqqmusic=1&_video=true&mid=002YD2Fk37JQUW&g_f=shoujijiaodian",
        picUrl: "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3187188.jpg",
        id: 32189
      },
      {
        linkUrl: "https://y.qq.com/m/act/RHXHBJDL2020/index.html?openinqqmusic=1&channelId=10062701&ADTAG=neirong142",
        picUrl: "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3187628.jpg",
        id: 32233
      },
      {
        linkUrl: "https://y.qq.com/m/act/SCXSD/index_v1.html?ADTAG=neirong_share511&openinqqmusic=1&channelId=10049223",
        picUrl: "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3181017.jpg",
        id: 32141
      },
      {
        linkUrl: "https://y.qq.com/m/sact/sfhd/378.html?ADTAG=jdt&openinqqmusic=1",
        picUrl: "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3171662.jpg",
        id: 32119
      }
    ],
    radioList: [{
        picUrl: "http://y.gtimg.cn/music/photo/radio/track_radio_199_12_8.jpg",
        Ftitle: "热歌",
        radioid: 199
      },
      {
        picUrl: "http://y.gtimg.cn/music/photo/radio/track_radio_307_12_5.jpg",
        Ftitle: "一人一首招牌歌",
        radioid: 307
      }
    ],
    songList: []
  };

  // return new Promise((resolve, reject) => {
  //   axios.get(url, { params }).then(({ data = {} }) => {
  //     resolve(data.data);
  //   }).catch((e) => {
  //     console.log(e.message);
  //     resolve(data);
  //   });
  // });

  return new Promise((resolve, reject) => {
    resolve(data);
  });
}
// banner数据
router.get("/banner", async (ctx) => {
  try {
    let banner = await getBanner();
    ctx.body = {
      code: 0,
      data: banner
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: -1,
      data: {}
    };
  }
});


// 获取推荐列表
function getList() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  let params = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  const headers = {
    referer: 'https://c.y.qq.com',
    host: 'c.y.qq.com'
  };

  return new Promise((resolve, reject) => {
    axios.get(url, { headers, params, }).then(({ data = {} }) => {
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
    };
  } catch (e) {
    ctx.body = {
      code: 0,
      msg: e.message,
      data: {}
    };
  }
});


// 获取单个热门歌曲的详细数据
function getCdInfo(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
  const headers = {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
  };

  const params = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { headers, params, }).then(({ data = {} }) => {
      resolve(data);
    }).catch((e) => {
      reject(e);
    });
  });
}
// 获取单个热门歌曲的详细数据
router.get("/getCdInfo", async (ctx) => {
  const { disstid } = ctx.request.query;

  if (!disstid) {
    ctx.body = {
      code: -1,
      msg: "参数缺失",
      data: {}
    };
    return false;
  }

  try {
    let Info = await getCdInfo(disstid);
    ctx.body = {
      code: 0,
      msg: "",
      data: Info
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
