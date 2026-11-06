# deploy.ps1 - push to GitHub and fast-forward the VPS checkout.
#
# Version bump rules:
#   - Changed a file in assets/  -> bump ASSET_VERSION in script.js AND the ?v=
#     strings in index.html (CSS font url, social icons, poster).
#   - Changed only script.js     -> bump ?v= on the <script> tag in index.html.
#   - index.html itself is served no-cache, so it is always fresh.
$ErrorActionPreference = 'Stop'

git push origin main
if ($LASTEXITCODE -ne 0) { throw 'git push failed' }

ssh craxvps "cd /var/www/profile && git pull --ff-only origin main && pm2 restart profile-views --update-env >/dev/null && echo deployed"
if ($LASTEXITCODE -ne 0) { throw 'remote deploy failed' }
