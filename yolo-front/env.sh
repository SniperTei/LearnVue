#!/bin/sh

# 生成运行时的环境变量文件
echo "window.ENV = {" > /usr/share/nginx/html/env-config.js
echo "  API_URL: \"$API_URL\"," >> /usr/share/nginx/html/env-config.js
echo "  APP_ENV: \"$APP_ENV\"," >> /usr/share/nginx/html/env-config.js
echo "  APP_TITLE: \"$APP_TITLE\"" >> /usr/share/nginx/html/env-config.js
echo "}" >> /usr/share/nginx/html/env-config.js

# 使用环境变量替换nginx配置
envsubst '$API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 启动nginx
nginx -g 'daemon off;'
