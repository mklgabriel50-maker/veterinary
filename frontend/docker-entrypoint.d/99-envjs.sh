#!/bin/sh
set -e

: "${API_URL:=}"

cat > /usr/share/nginx/html/env.js <<ENVJS
window.__ENV__ = { API_URL: "${API_URL}" };
ENVJS
