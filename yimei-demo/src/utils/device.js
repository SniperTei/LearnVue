/**
 * 设备检测与原生交互工具
 * 用于检测设备类型并提供调用原生代码的接口
 */

class DeviceBridge {
  constructor() {
    this.isIOS = false;
    this.isAndroid = false;
    this.isWeb = false;
    this.setup();
  }

  /**
   * 初始化设备检测
   */
  setup() {
    const ua = navigator.userAgent.toLowerCase();
    this.isIOS = /iphone|ipad|ipod/.test(ua);
    this.isAndroid = /android/.test(ua);
    this.isWeb = !this.isIOS && !this.isAndroid;

    console.log('设备类型检测:', {
      isIOS: this.isIOS,
      isAndroid: this.isAndroid,
      isWeb: this.isWeb
    });
  }

  /**
   * 调用原生方法
   * @param {string} method - 方法名
   * @param {object} params - 参数对象
   * @param {function} callback - 回调函数
   */
  callNative(method, params = {}, callback = null) {
    if (this.isWeb) {
      console.log('Web环境，跳过原生调用:', { method, params });
      return;
    }

    // 生成唯一回调ID
    const callbackId = callback ? `callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null;

    if (callbackId && callback) {
      // 注册回调函数
      window[callbackId] = (result) => {
        callback(result);
        // 清理回调函数
        setTimeout(() => {
          delete window[callbackId];
        }, 100);
      };
    }

    // 构建调用参数
    const callParams = {
      method,
      params,
      callbackId
    };

    if (this.isIOS) {
      this._callIOS(callParams);
    } else if (this.isAndroid) {
      this._callAndroid(callParams);
    }
  }

  /**
   * 调用iOS原生方法
   * @private
   */
  _callIOS(callParams) {
    try {
      // iOS通过WKWebView的messageHandlers调用原生
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeBridge) {
        window.webkit.messageHandlers.nativeBridge.postMessage(callParams);
      } else {
        console.error('iOS原生桥接未注册');
      }
    } catch (error) {
      console.error('调用iOS原生方法失败:', error);
    }
  }

  /**
   * 调用Android原生方法
   * @private
   */
  _callAndroid(callParams) {
    try {
      // Android通过addJavascriptInterface注入的对象调用原生
      if (window.androidBridge) {
        // 将参数转换为JSON字符串
        const paramsStr = JSON.stringify(callParams);
        window.androidBridge.callNativeMethod(paramsStr);
      } else {
        console.error('Android原生桥接未注册');
      }
    } catch (error) {
      console.error('调用Android原生方法失败:', error);
    }
  }

  /**
   * 拍照功能
   * @param {function} callback - 回调函数，接收图片数据
   */
  // takePhoto(callback) {
  //   this.callNative('takePhoto', {}, callback);
  // }

  // 在device.js中添加模拟功能
  async takePhoto(type, callback) {
    console.log('Taking photo with type:', type);
    if (this.isWeb) {
      // Web环境下使用文件选择器模拟
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'camera';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            callback({ success: true, data: { imageUrl: event.target.result } });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // 调用原生方法，需要处理不同的数据格式
      this.callNative('takePhoto', { type }, (nativeResult) => {
        // 处理安卓原生返回的数据格式
        if (nativeResult.code === '000000' && nativeResult.data && nativeResult.data.imageBase64) {
          // 将base64字符串转换为可显示的图片URL
          const base64String = nativeResult.data.imageBase64;
          // 确保base64字符串前面有正确的前缀
          const imageUrl = base64String.startsWith('data:image/') 
            ? base64String 
            : `data:image/jpeg;base64,${base64String}`;
          
          // 返回格式化后的结果
          callback({
            success: true,
            data: {
              imageUrl: imageUrl
            }
          });
        } else {
          // 处理失败情况
          callback({
            success: false,
            message: nativeResult.message || '拍照失败'
          });
        }
      });
    }
  }

  /**
   * 选择图片
   * @param {object} options - 选项 {maxCount: 最多选择数量}
   * @param {function} callback - 回调函数，接收图片数组
   */
  selectImages(options = { maxCount: 1 }, callback) {
    this.callNative('selectImages', options, callback);
  }

  /**
   * 保存图片到相册
   * @param {string} imageData - 图片数据（base64或文件路径）
   * @param {function} callback - 回调函数
   */
  saveImageToGallery(imageData, callback) {
    this.callNative('saveImageToGallery', { imageData }, callback);
  }

  /**
   * 获取设备信息
   * @param {function} callback - 回调函数
   */
  getDeviceInfo(callback) {
    this.callNative('getDeviceInfo', {}, callback);
  }

  /**
   * 显示Toast提示
   * @param {string} message - 提示消息
   * @param {number} duration - 显示时长（毫秒）
   */
  showToast(message, duration = 2000) {
    this.callNative('showToast', { message, duration });
  }
}

// 导出单例
export default new DeviceBridge();

// 供原生调用的全局方法，用于处理回调
window.nativeCallback = function(callbackId, result) {
  if (window[callbackId] && typeof window[callbackId] === 'function') {
    window[callbackId](result);
  }
};
