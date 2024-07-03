var mierucaOptimize = function () {

    this.protocol = "http:";

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
        visualEditorCommunicate();
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
        a.src = protocol + '//localhost:8082/redirect-url/embed'
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
        a.src = protocol + '//localhost:8082/ab/preview'
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
        a.src = protocol + '//localhost:8082/ab/embed'
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
        a.src = protocol + '//localhost:8082/ab/view'
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
    visualEditorCommunicate = () => {
        let parent = window.opener;
        if (!parent || !document.referrer || new URL(document.referrer).origin !== "http://localhost:8080") {
            return;
        }
        // Listen for messages from the sender tab
        window.addEventListener('message', (event) => {
            if (event.origin !== "http://localhost:8080") {
                return;
            }
            let dataMessage = event.data;
            switch (dataMessage.action) {
                case "VISUAL_EDITOR_SCRIPT" : {
                    if (dataMessage.status === "open" && dataMessage.code === siteId) {
                        event.source.postMessage({
                            "action" : "VISUAL_EDITOR_SCRIPT",
                            "status" : "ready"
                        },event.origin);
                        const veLayout = dataMessage.data.html;
                        document.body.insertAdjacentHTML('beforeend', veLayout);

                        var blob = new Blob([dataMessage.data.script], {type: 'text/javascript'});
                        var url = URL.createObjectURL(blob,);
                        let a = document.createElement("script");
                        a.type = "text/javascript",
                        a.async = !0,
                        a.src = url;
                        let n = document.getElementsByTagName("script")[0];
                        n.parentNode.insertBefore(a, n);
                    }
                }
            }
        });
    };
};

(function () {
    if (window.mojsId) return;
    window.__mieruca_optimize = new mierucaOptimize();
    window.__mieruca_optimize.init();
}()),
moObserverHandler = function (callbackFn, callbackArg, config = {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true}) {
    // Observer DOM change
    let observer = new MutationObserver((mutations, observer) => {
        if (callbackFn) {
            callbackFn(callbackArg, mutations, observer);
        }
    });

    observer.observe(document.body, config);
    return observer;
},
moUrlChangeListener = function (callbackFn, callbackArg) {
    // The popstate event is triggered when the user clicks the browser's back or forward buttons, or when the history.back(), history.forward(), 
    // or history.go() methods are called
    window.addEventListener('popstate', function(event) {
        // The URL has changed, do something here
        if (callbackFn) {
            callbackFn(callbackArg);
        }
    });
    // To detect URL changes caused by history.pushState() or history.replaceState()
    // override the default behavior of these methods and manually trigger the popstate event
    var pushState = history.pushState;
    history.pushState = function(state, title, url) {
        pushState.apply(history, arguments);
        window.dispatchEvent(new Event('popstate'));
    };
},
moGetELByXpath = (xpath) => {
    return document.evaluate(xpath, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
},
moWrap = (wrapper, el) => {
    moInsertBefore(el, wrapper);
    wrapper.appendChild(el);
},
moInsertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
},
moInsertBefore = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
},
moHashString = async (str) => {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (error) {
        console.log(error)
    }
},
moApplyChange = async (stacks) => {
    try {
        for (let i = 0; i < stacks.length; i++) {
            let item = stacks[i];
            let currentEle = moGetELByXpath(item.xpath);
            if (!currentEle) {
                item.isCompleteSetting = false;
                continue;
            }
            let currentEleHtml = currentEle.outerHTML;
            let hashData = await moHashString(currentEleHtml).then(str => str);
            if (item.hash !== hashData) {
                item.isCompleteSetting = false;
                continue;
            }
            if ((item.type === 'MOVE' || item.type === 'DUPLICATE')) {
                let desEle = moGetELByXpath(item.desXpath);
                if (!desEle) {
                    item.isCompleteSetting = false;
                    continue;
                }
                let currentDesEleHtml = desEle.outerHTML;
                let hashDesData = await moHashString(currentDesEleHtml).then(str => str);
                if (item.desHash !== hashDesData) {
                    item.isCompleteSetting = false;
                    continue;
                }
            }
            if (item.isCompleteSetting) {
                continue;
            }
            item.isCompleteSetting = true;
            try {
                eval(item.script);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error)
    }
};