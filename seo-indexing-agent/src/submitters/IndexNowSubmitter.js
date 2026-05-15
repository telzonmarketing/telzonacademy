'use strict';

const https = require('https');
const crypto = require('crypto');

/**
 * IndexNow — open protocol used by Bing, Yandex, Naver, Seznam, Yep.
 * Free, no auth, instant indexing notification. Submit URLs and the
 * search engines re-crawl within minutes (vs hours/days normally).
 *
 * Setup: a key file must exist at /{key}.txt on the site root containing
 * just the key string. We use a deterministic key derived from the host.
 */
class IndexNowSubmitter {
  constructor(config = {}) {
    this.config = config;
  }

  _keyFor(host) {
    // Deterministic 32-char hex key per host — same key every run
    return crypto.createHash('sha256').update('indexnow-' + host).digest('hex').slice(0, 32);
  }

  keyFile(host) {
    const key = this._keyFor(host);
    return { key, filename: `${key}.txt`, content: key };
  }

  async submitBatch(urls) {
    if (!urls || urls.length === 0) return { submitted: 0, failed: 0 };

    const host = new URL(urls[0]).host;
    const key = this._keyFor(host);
    const keyLocation = `https://${host}/${key}.txt`;

    const body = JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: urls.slice(0, 10000),
    });

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.indexnow.org',
        path: '/IndexNow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
      }, (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          // 200/202 = success. 403 = key file not found (one-time setup needed)
          const success = res.statusCode === 200 || res.statusCode === 202;
          resolve({
            submitted: success ? urls.length : 0,
            failed:    success ? 0 : urls.length,
            statusCode: res.statusCode,
            keyLocation,
            note: success
              ? `Notified Bing/Yandex/Naver of ${urls.length} URLs`
              : `IndexNow returned ${res.statusCode}. ${res.statusCode === 403 ? 'Key file missing — see keyLocation' : data.slice(0, 200)}`,
          });
        });
      });
      req.on('error', (err) => {
        resolve({ submitted: 0, failed: urls.length, error: err.message });
      });
      req.write(body);
      req.end();
    });
  }
}

module.exports = { IndexNowSubmitter };
