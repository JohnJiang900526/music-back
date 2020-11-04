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
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
  const jumpPrefix = 'https://y.qq.com/n/yqq/album/';

  const headers = {
    referer: 'https://u.y.qq.com/',
    host: 'u.y.qq.com'
  };

  const params = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    inCharset: 'utf8',
    format: 'json',
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    data: {
      'comm': { 'ct': 24 },
      'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' },
      'recomPlaylist': {
        'method': 'get_hot_recommend',
        'param': { 'async': 1, 'cmd': 2 },
        'module': 'playlist.HotRecommendServer'
      },
      'playlist': {
        'method': 'get_playlist_by_category',
        'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 },
        'module': 'playlist.PlayListPlazaServer'
      },
      'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } },
      'new_album': {
        'module': 'newalbum.NewAlbumServer',
        'method': 'get_new_album_info',
        'param': { 'area': 1, 'sin': 0, 'num': 10 }
      },
      'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} },
      'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} },
      'focus': { 'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {} }
    }
  });

  return new Promise((resolve, reject) => {
    axios.get(url, { params, headers }).then(({ data = {} }) => {
      if (data.code === 0) {
        const slider = [];
        const content = data.focus.data && data.focus.data.content;

        for (let i = 0; i < content.length; i++) {
          const item = content[i];
          const sliderItem = {};
          sliderItem.id = item.id;
          sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html';
          sliderItem.picUrl = item.pic_info.url;
          slider.push(sliderItem);
        }

        resolve({ slider });
      } else {
        reject(new Error(data.msg));
      }
    }).catch((e) => {
      console.log(e.message);
      reject(e);
    });
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
