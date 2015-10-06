# Copy2gist [![npm version](https://img.shields.io/npm/v/copy2gist.svg)](https://www.npmjs.com/package/copy2gist) [![Build Status](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Dead-simple Copy Paste directly from your clipboard to pastebin.com via terminal

```
npm install -g copy2gist
```

Install this globally and you'll have access to the `copy2gist` command anywhere on your system.

Usage
-----
```bash
copy2gist
```

Setup
-----
1.) Create gist token
```
curl -u YOUR_GITHUB_USERNAME \
  -d '{"scopes":["gist"],"note":"gist access"}' \
  https://api.github.com/authorizations
```

2.) Set gist credentials
```
git config --global --add gist.username YOUR_GITHUB_USERNAME
git config --global --add gist.token THAT_TOKEN_YOU_GOT
```