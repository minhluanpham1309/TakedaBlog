var mierucaOptimize = function () {

    this.protocol = window.location.protocol;

    this.encodeValue = (value) => {
        return encodeURIComponent(value);
    };

    this.getCombineCookie = (name) => {
        var cookie, valueSet = new Set();
        document.cookie.split('; ').forEach((el) => {
            let [k, v] = el.split('=');
            if (k.startsWith(name)) {
                valueSet.add(v);
            }
        })
        cookie = [...valueSet].join(';');
        return cookie;
    };
    
    this.getSessionIdFromCookie = (name) => {
        var cookies = document.cookie.split('; '),
        sessionId = '';
        for (var i = 0; i < cookies.length; i++) {
            let [k, v] = cookies[i].split('=');
            if (k.startsWith(name)) {
                sessionId = v.split('_')[1];
                break;
            }
        }
        return sessionId;
    };
    
    var siteId = 1876303146,
    url = new URL(window.location.href),
    urlParams = url.searchParams,
    protocol = "http:",
    encodeValue = this.encodeValue,
    getCombineCookie = this.getCombineCookie;

    this.init = () => {
        window.mojsId = 1;
        if (isHMCapture()) {
            return;
        }
        handleCrossDomainParam();
        loadRedirectScript();
        if (urlParams.has("_mo_ab_preview_mode")) {
            loadViewModeScript();
        } else if (urlParams.has("_mo_ab_preview_pid")) {
            loadABPreviewScript();
        } else {
            loadABTestScript();
        }
    };

    var loadRedirectScript = () => {
        let a = document.createElement('script');
        a.type = 'text/javascript';
        a.async = true;
        a.src = protocol + '//localhost8082/redirect-url/embed'
        + '?siteId=' + encodeValue(siteId)
        + '&visitorUrl=' + encodeValue(url.toString())
        + '&dv=' + encodeValue(getDeviceType())
        + '&ck=' + encodeValue(getCombineCookie("__MOR-"))
        + '&referUrl=' + encodeValue(document.referrer)
        + '&ua=' + encodeValue(navigator.userAgent)
        let b = document.getElementsByTagName('script')[0];
        b.parentNode.insertBefore(a, b);
    },
    loadABPreviewScript = () => {
        let device = urlParams.get('dv') || getDeviceType();
        let a = document.createElement('script');
        a.type = 'text/javascript';
        a.async = true;
        a.src = protocol + '//localhost8082/ab/preview'
        + '?sId=' + encodeValue(siteId)
        + '&dv=' + encodeValue(device)
        + '&pId=' + encodeValue(urlParams.get('_mo_ab_preview_pid') || '');
        let b = document.getElementsByTagName('script')[0];
        b.parentNode.insertBefore(a, b);
    },
    loadABTestScript = () => {
        let a = document.createElement('script');
        a.type = 'text/javascript';
        a.async = true;
        a.src = protocol + '//localhost8082/ab/embed'
        + '?siteId=' + encodeValue(siteId)
        + '&visitorUrl=' + encodeValue(url.toString())
        + '&dv=' + encodeValue(getDeviceType())
        + '&ck=' + encodeValue(getCombineCookie("__MOAB-"))
        + '&ua=' + encodeValue(navigator.userAgent)
        let b = document.getElementsByTagName('script')[0];
        b.parentNode.insertBefore(a, b);
    },
    loadViewModeScript = () => {
        let a = document.createElement('script');
        a.type = 'text/javascript';
        a.async = true;
        a.src = protocol + '//localhost8082/ab/view'
        + '?sId=' + encodeValue(siteId)
        + '&visitorUrl=' + encodeValue(url.toString())
        + '&pId=' + encodeValue(urlParams.get('_mo_ab_preview_mode') || '')
        let b = document.getElementsByTagName('script')[0];
        b.parentNode.insertBefore(a, b);
    },

    getDeviceType = () => {
        var mobilePattern = /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/,
        tabletPattern = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i,
        userAgent = navigator.userAgent;
        if (tabletPattern.test(userAgent)) {
            return "TABLET";
        }
        if (mobilePattern.test(userAgent)) {
            return "MOBILE";
        }
        return "DESKTOP";
    },

    isHMCapture = () => {
        var mierucaHMPattern = /MierucaHeatmap|fabercompany.co.jp/,
        userAgent = navigator.userAgent;
        return mierucaHMPattern.test(userAgent);
    },

    handleCrossDomainParam = () => {
        if (!urlParams.has("_mo")) {
            return;
        }
        var isCookieExisted = false;
        var parameterArrays = urlParams.get("_mo").split(";_;");
        parameterArrays.forEach(function(param) {
            var [cookieKey, cookieVal] = param.split(":");
            document.cookie.split('; ').forEach((el) => {
                let [k, v] = el.split('=');
                if (cookieKey === k && cookieVal === v) {
                    isCookieExisted = true;
                }
            });
            if (!isCookieExisted) {
                var date = new Date();
                date.setTime(date.getTime() + 93 * 24 * 60 * 60 * 1000);
                var expiresDateTime = date.toUTCString();
                var domain = "." + window.location.host.replace("www.", "");
                var encodeKey = encodeValue(cookieKey), encodeVal = encodeValue(cookieVal);
                document.cookie = `${encodeKey}=${encodeVal};domain=${domain};expires=${expiresDateTime};path=/;`;
            }
        });
        urlParams.delete('_mo');
        url.search = urlParams.toString();
    };
};

(function () {
    if (window.mojsId) return;
    window.__mieruca_optimize = new mierucaOptimize();
    window.__mieruca_optimize.init();
}());