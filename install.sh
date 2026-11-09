#!/usr/bin/env bash
# Glass theme + Traditional Chinese for Pterodactyl Panel 1.15.2
# Usage: sudo bash install.sh [panel directory]   (default: /var/www/pterodactyl)
#
# Running it again over an earlier install updates the theme. The first backup stays
# the restore point; originals of any files that the update touches for the first time
# are added beside it, so restore.sh still returns the panel to its original state.
set -euo pipefail

PANEL="${1:-/var/www/pterodactyl}"
HERE="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
MARKER="$PANEL/.glass-zh-new-files"
RECORD="$PANEL/.glass-zh-backup"

say() { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m錯誤：\033[0m %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "請用 sudo 執行此腳本。"
[ -f "$PANEL/artisan" ] || die "在 $PANEL 找不到面板，請在指令後面加上面板路徑。"

VERSION="$(grep -oP "'version' => '\K[^']+" "$PANEL/config/app.php" || true)"
if [ "$VERSION" != "1.15.2" ]; then
    echo "此更新包是為面板 1.15.2 製作的，偵測到的版本是：${VERSION:-未知}"
    read -r -p "仍要繼續嗎？[y/N] " ok
    [[ "$ok" =~ ^[Yy]$ ]] || exit 1
fi

# Find the backup made by an earlier install, if there is one.
ORIGINAL=""
if [ -f "$RECORD" ] && [ -f "$(cat "$RECORD")" ]; then
    ORIGINAL="$(cat "$RECORD")"
elif [ -f "$MARKER" ]; then
    ORIGINAL="$(ls -1 "$(dirname "$PANEL")"/pterodactyl-backup-*.tar.gz 2>/dev/null | sort | head -n 1 || true)"
fi

cd "$HERE/files"
mapfile -t FILES < <(find . -type f ! -path './public/assets/*' | sed 's#^\./##' | sort)

if [ -z "$ORIGINAL" ]; then
    BACKUP="$(dirname "$PANEL")/pterodactyl-backup-$STAMP.tar.gz"
    say "備份會被覆蓋的檔案到 $BACKUP"
    EXISTING=()
    NEW=()
    for f in "${FILES[@]}"; do
        if [ -e "$PANEL/$f" ]; then EXISTING+=("$f"); else NEW+=("$f"); fi
    done
    (cd "$PANEL" && tar czf "$BACKUP" "${EXISTING[@]}" public/assets)
    printf '%s\n' "${NEW[@]}" > "$BACKUP.new-files"
else
    BACKUP="$ORIGINAL"
    say "偵測到先前的安裝，原始備份保留在 $BACKUP"
    mapfile -t SAVED < <(tar tzf "$BACKUP"; cat "$BACKUP.new-files" 2>/dev/null; ls -1 "$BACKUP".extra-*.list 2>/dev/null | xargs -r cat)
    declare -A KNOWN=()
    for f in "${SAVED[@]}"; do if [ -n "$f" ]; then KNOWN["$f"]=1; fi; done
    EXTRA=()
    for f in "${FILES[@]}"; do
        [ -n "${KNOWN[$f]:-}" ] && continue
        if [ -e "$PANEL/$f" ]; then EXTRA+=("$f"); else echo "$f" >> "$BACKUP.new-files"; fi
    done
    if [ "${#EXTRA[@]}" -gt 0 ]; then
        say "另外備份 ${#EXTRA[@]} 個這次才會修改的原始檔案"
        (cd "$PANEL" && tar czf "$BACKUP.extra-$STAMP.tar.gz" "${EXTRA[@]}")
        printf '%s\n' "${EXTRA[@]}" > "$BACKUP.extra-$STAMP.list"
    fi
fi

say "安裝新檔案"
rm -rf "$PANEL/public/assets"
cp -a "$HERE/files/." "$PANEL/"
if [ -f "$BACKUP.new-files" ]; then cp "$BACKUP.new-files" "$MARKER"; else : > "$MARKER"; fi
echo "$BACKUP" > "$RECORD"

# Folder for the logo uploaded from 系統設定 → 標誌; the web server must be able to write here.
mkdir -p "$PANEL/public/brand"
OWNER="$(stat -c '%U:%G' "$PANEL/artisan")"
chown -R "$OWNER" "$PANEL/app" "$PANEL/resources" "$PANEL/routes" "$PANEL/public" "$MARKER" "$RECORD"

say "清除面板快取"
cd "$PANEL"
php artisan optimize:clear >/dev/null
php artisan view:clear >/dev/null

if [ -z "$ORIGINAL" ]; then
    echo
    read -r -p "要把繁體中文設為所有使用者（含現有帳號）的預設語言嗎？之後每個人仍可自己切換。[Y/n] " zh
    if [[ ! "$zh" =~ ^[Nn]$ ]]; then
        if grep -q '^APP_LOCALE=' .env; then
            sed -i 's/^APP_LOCALE=.*/APP_LOCALE=zh/' .env
        else
            echo 'APP_LOCALE=zh' >> .env
        fi
        php artisan tinker --execute="Pterodactyl\Models\User::query()->update(['language' => 'zh']);" >/dev/null
        php artisan config:clear >/dev/null
        say "已將預設語言設為繁體中文"
    fi
fi

if systemctl list-units --type=service --all 2>/dev/null | grep -q pteroq; then
    systemctl restart pteroq || true
fi

echo
say "完成！請在瀏覽器按 Ctrl + F5 重新整理面板。"
echo "    如需還原：sudo bash $HERE/restore.sh $BACKUP $PANEL"
