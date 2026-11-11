{{-- Picks which uploaded background to show and rotates it. Runs before first paint, on every page. --}}
<script>
    (function () {
        var C = @json(\Pterodactyl\Extensions\Themes\ThemeSettings::backgroundConfig());
        var root = document.documentElement, timer = null, shown = null;
        var target = location.pathname.indexOf('/auth/') === 0 ? 'login' : 'page';
        var shade = {
            page: 'linear-gradient(rgba(7,11,20,.66),rgba(7,11,20,.88))',
            login: 'linear-gradient(rgba(7,11,20,.5),rgba(7,11,20,.82))',
        };
        function pick(list, key) {
            if (list.length < 2) return 0;
            if (C.mode === 'slideshow') return Math.floor(Date.now() / (C.interval * 1000)) % list.length;
            // Random: one image per visit, so moving between pages does not change it.
            try {
                var saved = list.indexOf(sessionStorage.getItem('glass:bg:' + key));
                if (saved >= 0) return saved;
                var i = Math.floor(Math.random() * list.length);
                sessionStorage.setItem('glass:bg:' + key, list[i]);
                return i;
            } catch (e) {
                return Math.floor(Math.random() * list.length);
            }
        }
        function apply(fade) {
            clearTimeout(timer);
            var key = C[target].length ? target : 'page', list = C[key];
            if (!list.length) {
                root.style.removeProperty('--page-bg');
                shown = null;
                return;
            }
            var url = list[pick(list, key)];
            var value = shade[key] + ",url('" + url + "') center/cover no-repeat";
            if (C.mode === 'slideshow' && list.length > 1) {
                var ms = C.interval * 1000;
                timer = setTimeout(function () { apply(true); }, ms - (Date.now() % ms) + 60);
            }
            if (value === shown) return;
            var set = function () { root.style.setProperty('--page-bg', value); shown = value; };
            if (!fade || !document.body || document.hidden) return set();
            var img = new Image();
            img.onload = function () {
                var layer = document.createElement('div');
                layer.setAttribute('aria-hidden', 'true');
                layer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100vh;height:100lvh;z-index:-1;pointer-events:none;opacity:0;transition:opacity 1.2s ease;background:' + value;
                document.body.appendChild(layer);
                layer.offsetWidth;
                layer.style.opacity = '1';
                setTimeout(function () { set(); layer.remove(); }, 1300);
            };
            img.onerror = set;
            img.src = url;
        }
        window.GlassBackground = {
            /** Switch between the login images and the page images (the client is a single-page app). */
            use: function (next) { if (next !== target) { target = next; apply(true); } },
            hasLogin: C.login.length > 0,
        };
        apply(false);
    })();
</script>
