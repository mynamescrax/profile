# deploy.ps1 - push to GitHub and fast-forward the VPS checkout.
#
# Version bump rules:
#   - Changed a song or the background video -> bump ASSET_VERSION in script.js
#   - Changed album art or a profile picture  -> bump ART_VERSION in script.js
#   - Changed the font, a social icon or the poster -> bump its ?v= in index.html
#   - Changed script.js -> bump ?v= on the <script> tag in index.html
#   - index.html itself is served no-cache, so it is always fresh.
$ErrorActionPreference = 'Stop'

git push origin main
if ($LASTEXITCODE -ne 0) { throw 'git push failed' }

ssh craxvps "cd /var/www/profile && git pull --ff-only origin main && pm2 restart profile-views --update-env >/dev/null && echo deployed"
if ($LASTEXITCODE -ne 0) { throw 'remote deploy failed' }
