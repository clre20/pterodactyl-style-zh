#!/usr/bin/env bash
# Restore the files backed up by install.sh.
# Usage: sudo bash restore.sh <backup .tar.gz> [panel directory]
set -euo pipefail

BACKUP="${1:-}"
PANEL="${2:-/var/www/pterodactyl}"

die() { printf '\033[1;31m錯誤：\033[0m %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "請用 sudo 執行此腳本。"
[ -f "$BACKUP" ] || die "找不到備份檔：$BACKUP"
[ -f "$PANEL/artisan" ] || die "在 $PANEL 找不到面板。"

# Remove files that did not exist before the theme was installed.
if [ -f "$BACKUP.new-files" ]; then
    while IFS= read -r f; do
        if [ -n "$f" ]; then rm -f "$PANEL/$f"; fi
    done < "$BACKUP.new-files"
    # Drop folders that are now empty (e.g. resources/lang/zh), deepest first.
    while IFS= read -r f; do
        if [ -n "$f" ]; then dirname "$f"; fi
    done < "$BACKUP.new-files" | sort -u -r | while IFS= read -r d; do
        while [ "$d" != "." ] && rmdir "$PANEL/$d" 2>/dev/null; do d="$(dirname "$d")"; done
    done
fi
rm -rf "$PANEL/public/assets"
tar xzf "$BACKUP" -C "$PANEL"
# Originals of files that a later update touched for the first time.
for extra in "$BACKUP".extra-*.tar.gz; do
    [ -f "$extra" ] && tar xzf "$extra" -C "$PANEL"
done
rm -f "$PANEL/.glass-zh-new-files" "$PANEL/.glass-zh-backup"
# Backgrounds uploaded through the theme, then the brand folder created by
# install.sh (kept if a logo is still in it).
rm -f "$PANEL"/public/brand/login-bg.* "$PANEL"/public/brand/page-bg.*
rmdir "$PANEL/public/brand" 2>/dev/null || true

OWNER="$(stat -c '%U:%G' "$PANEL/artisan")"
chown -R "$OWNER" "$PANEL/app" "$PANEL/resources" "$PANEL/routes" "$PANEL/public"

cd "$PANEL"
# Accounts switched to Chinese would otherwise point at a language that no longer exists.
php artisan tinker --execute="Pterodactyl\Models\User::query()->where('language', 'zh')->update(['language' => 'en']);" >/dev/null || true
# Appearance options saved by the theme (colours, announcement, login text).
php artisan tinker --execute="Illuminate\Support\Facades\DB::table('settings')->where('key', 'like', 'settings::glass:%')->delete();" >/dev/null || true
php artisan optimize:clear >/dev/null
php artisan view:clear >/dev/null
echo "已還原為原本的面板。若先前把 APP_LOCALE 改成 zh，可在 .env 改回 en。"
