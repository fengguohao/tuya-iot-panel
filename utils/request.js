// 重新请求限制
let count = 5;
const expiredCode = 1004;
const expiredCode2 = 1010;

export const login = async () => {
  const params = {
    name: 'ty-service',
    data: {
      action: 'user.wx-applet.synchronization',
      params: {
        open_id: 'cloud',
        app_schema: 'cloud'
      }
    }
  };

  const { uid, access_token } = await request(params);
  wx.setStorageSync('uid', uid);
  wx.setStorageSync('access_token', access_token)
  return uid
};

//刷新token
const refreshToken = async () => {
  const params = {
    name: 'ty-service',
    data: {
      action: 'user.refreshToken',
      params: { refresh_token: wx.getStorageSync('refresh_token') },
    },
  };

  const res = await request(params);
  if (!res) return false;

  const { uid, access_token, refresh_token } = res;
  wx.setStorageSync('uid', uid);
  wx.setStorageSync('access_token', access_token);
  wx.setStorageSync('refresh_token', refresh_token);
  return true;
};

const setUid = async (params) => {
  const {
    data: { action }
  } = params;
  let uid = wx.getStorageSync('uid');
  let access_token = wx.getStorageSync('access_token')
  const isNoLogin = action !== 'user.wx-applet.synchronization';
  if (!uid && isNoLogin && count) {
    await login();
    count--;
    return setUid(params);
  }
  if (access_token && uid && isNoLogin) {
    params.data.params || (params.data.params = {});
    params.data.params['uid'] = uid;
    params.data['access_token'] = access_token;
  }
};

const request = async (params) => {
  await setUid(params);

  try {
    const { success, data, errorCode, errorMsg, t } = (
      await wx.cloud.callFunction(params)
    ).result;
    if (success && data === true) {
      return { success, t }
    } else if (success) {
      return data
    }

    // token过期时，刷新token
    if (+errorCode === expiredCode||+errorCode===expiredCode2) {
      const rSuccess = await refreshToken();
      if (rSuccess) return request(params);
    }

    wx.showToast({
      title: `code:${errorCode}, message:${errorMsg}`,
      icon: 'none',
      duration: 3000,
      mask: true
    });
  } catch (error) {
    wx.showToast({
      title: '网络错误！',
      icon: 'none',
      duration: 3000,
      mask: true
    });
  }
  return [];
};



export default request;
