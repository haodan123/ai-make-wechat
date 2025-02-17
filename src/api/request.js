// 请求基础URL
const BASE_URL = 'https://api.example.com';

// 存储等待中的请求队列
let refreshTokenPromise = null;
let requestQueue = [];

// 刷新token的方法
const refreshToken = async () => {
  try {
    const refreshToken = uni.getStorageSync('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await uni.request({
      url: `${BASE_URL}/auth/refresh`,
      method: 'POST',
      data: { refreshToken },
      header: {
        'Content-Type': 'application/json'
      }
    });

    const { statusCode, data } = response;
    if (statusCode === 200 && data.token) {
      // 保存新token
      uni.setStorageSync('token', data.token);
      if (data.refreshToken) {
        uni.setStorageSync('refreshToken', data.refreshToken);
      }
      return data.token;
    } else {
      throw new Error('Refresh token failed');
    }
  } catch (error) {
    throw error;
  }
};

// 请求拦截器
const requestInterceptor = (config) => {
  // 获取token
  const token = uni.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }
  return config;
};

// 响应拦截器
const responseInterceptor = async (response, config) => {
  const { statusCode, data } = response;

  // 请求成功
  if (statusCode >= 200 && statusCode < 300) {
    return data;
  }

  // token过期处理
  if (statusCode === 401) {
    try {
      // 如果已经在刷新token，则将请求加入队列
      if (refreshTokenPromise) {
        return new Promise((resolve, reject) => {
          requestQueue.push({
            config,
            resolve,
            reject
          });
        });
      }

      // 开始刷新token
      refreshTokenPromise = refreshToken();
      const newToken = await refreshTokenPromise;

      // 重新发起之前的请求
      config.header['Authorization'] = `Bearer ${newToken}`;
      const retryResponse = await uni.request(config);

      // 处理队列中的请求
      requestQueue.forEach(({ config: queuedConfig, resolve, reject }) => {
        queuedConfig.header['Authorization'] = `Bearer ${newToken}`;
        uni.request(queuedConfig)
          .then(res => resolve(responseInterceptor(res, queuedConfig)))
          .catch(reject);
      });
      requestQueue = [];

      // 重置刷新token的Promise
      refreshTokenPromise = null;

      return responseInterceptor(retryResponse, config);
    } catch (error) {
      // 刷新token失败，清空队列并跳转登录页
      refreshTokenPromise = null;
      requestQueue.forEach(({ reject }) => reject(error));
      requestQueue = [];

      uni.removeStorageSync('token');
      uni.removeStorageSync('refreshToken');
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      });

      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }, 1500);

      throw error;
    }
  }

  // 其他错误处理
  uni.showToast({
    title: data.message || '请求失败',
    icon: 'none'
  });
  return Promise.reject(data);
};

// 封装请求方法
const request = (options) => {
  // 合并请求配置
  const config = {
    url: `${BASE_URL}${options.url}`,
    method: options.method || 'GET',
    data: options.data,
    header: options.header || {},
    timeout: options.timeout || 60000
  };

  // 应用请求拦截器
  const interceptedConfig = requestInterceptor(config);

  // 发起请求
  return new Promise((resolve, reject) => {
    uni.request({
      ...interceptedConfig,
      success: (response) => {
        try {
          responseInterceptor(response, interceptedConfig)
            .then(resolve)
            .catch(reject);
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(error);
      }
    });
  });
};

// 导出请求方法
export const http = {
  get: (url, data, options = {}) => {
    return request({
      url,
      method: 'GET',
      data,
      ...options
    });
  },
  post: (url, data, options = {}) => {
    return request({
      url,
      method: 'POST',
      data,
      ...options
    });
  },
  put: (url, data, options = {}) => {
    return request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  },
  delete: (url, data, options = {}) => {
    return request({
      url,
      method: 'DELETE',
      data,
      ...options
    });
  }
};