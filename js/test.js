var MierucaHM = function () {
    "use strict";
    var hmObj = {
        local_url: window.location.href,
        referrer_url: document.referrer,
        sWs: 'ws://127.0.0.1:8000/hm',
        HM: {},
        site_id: 992858870,
        temp_scroll_pos: 0,
        idl: null,
        iwc: 0,
        time_out: false,
        chkPrevEvent: null,
        temp_x_pos: 0,
        temp_y_pos: 0,
        read_check: "",
        href: "",
        text: "",
        ipa: 0,
        device: (function () {
            var mobilePattern = /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/,
                tabletPattern = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i,
                userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (tabletPattern.test(userAgent)) {
                return "t";
            }
            if (mobilePattern.test(userAgent)) {
                return "m";
            }
            return "d";
        }())},
            hmDocH = 0,
            hmDocW = 0,
            hmWinH = 0,
            hmWinW = 0,
            sReadTop = 0,
            webSocket = null,
            hm = MierucaHM.prototype = {

                //<editor-fold defaultstate="collapsed" desc="INIT WINDOWS ELEMENT">
                initWindowElement: function () {
                    var body = document.body || {scrollTop: 0, scrollHeight: 0, offsetHeight: 0, scrollLeft: 0, offsetWidth: 0, clientWidth: 0},
                    docElement = document.documentElement || {scrollTop: 0, clientHeight: 0, scrollHeight: 0, clientWidth: 0, scrollWidth: 0, offsetWidth: 0, offsetHeight: 0};
                    sReadTop = Math.floor(docElement.scrollTop || body.scrollTop || window.pageYOffset);
                    hmDocH = Math.max(body.scrollHeight, body.offsetHeight, docElement.clientHeight, docElement.scrollHeight, docElement.offsetHeight);
                    hmDocW = Math.max(body.scrollLeft, body.offsetWidth, docElement.clientWidth, docElement.scrollWidth, docElement.offsetWidth);
                    hmWinW = Math.floor(window.innerWidth || docElement.clientWidth || body.clientWidth);
                    hmWinH = Math.floor((window.innerHeight + sReadTop) > hmDocH ? hmDocH : window.innerHeight);
                },
                //</editor-fold>

                //<editor-fold defaultstate="collapsed" desc="SEND PAGE VIEW AND GET INFO">
                sendPageView: async function () {
                    // Get browser information
                    const browserInfo = {
                        appName: navigator.appName,          // The name of the browser
                        appCodeName: navigator.appCodeName,  // The code name of the browser
                        appVersion: navigator.appVersion,    // The version information of the browser
                        userAgent: navigator.userAgent,      // The user-agent string
                        platform: navigator.platform,        // The platform the browser is running on
                        language: navigator.language,        // The preferred language of the user
                        languages: navigator.languages,      // An array of the user's preferred languages
                        online: navigator.onLine,            // Boolean indicating if the browser is online
                        webdriver : navigator.webdriver,
                        cookiesEnabled: navigator.cookieEnabled, // Boolean indicating if cookies are enabled
                    };
                    
                    console.log('Browser Information:', browserInfo);



                    //
                    var userAgent = navigator.userAgent;
                    const vendor = navigator.vendor;
                    const opera = window.opera;
                    const response = await fetch('https://api.ipify.org?format=json');
                    const dataIP = await response.json();
                    $('body').prepend(`<div> user agent: ${userAgent}</div>`);
                    $('body').prepend(`<div> vender: ${vendor}</div>`);
                    $('body').prepend(`<div> opera: ${opera}</div>`);
                    // $('body').prepend(`<div> ip: ${dataIP.ip}</div>`);
                    $('body').prepend(`<div>browserInfo ${JSON.stringify(browserInfo, null, 2)}</div>`);
                    if (userAgent.includes("Chrome-Lighthouse"))  {
                        $("body").prepend(`<div>return</div>`);
                        return;
                    }
                    $("body").prepend(`<div>websocket</div>`);
                    if ('WebSocket' in window) {
                        webSocket = new WebSocket(hmObj.sWs);
                    } else if ('MozWebSocket' in window) {
                        webSocket = new MozWebSocket(hmObj.sWs);
                    } else {
                        return;
                    }

                    hm.initWindowElement();

                    //<editor-fold defaultstate="collapsed" desc="ON OPEN">
                    webSocket.onopen = function () {
                            var pageView = {};
                            pageView["type"] = 'p';
                            pageView["sId"] = hmObj.site_id;
                            pageView["url"] = hmObj.local_url;
                            pageView["refUrl"] = hmObj.referrer_url;
                            pageView["d"] = hmObj.device;
                            pageView["sP"] = hmWinH;
                            pageView["dH"] = hmDocH;
                            pageView["wW"] = hmWinW;
                            pageView["wH"] = hmWinH;
                            pageView["ipa"] = "ipa";
                            pageView["ua"] = 
                            webSocket.sendMessage(JSON.stringify(pageView));
                    };
                    //</editor-fold>

                    //<editor-fold defaultstate="collapsed" desc="ON CLOSE">
                    webSocket.onclose = function () {
                        hmObj.iwc = 1;
                    };
                    //</editor-fold>

                    //<editor-fold defaultstate="collapsed" desc="SEND MESSAGE">
                    webSocket.sendMessage = function (data) {
                        if (data !== '' && hmObj.iwc === 0) {
                            if (webSocket.readyState === webSocket.OPEN) {
                                webSocket.send(data);
                            }
                        }
                    };
                    //</editor-fold>

                    //<editor-fold defaultstate="collapsed" desc="RECEIVE MESSAGE">
                    webSocket.onmessage = function(event) {
                        // Just Show popup when site has not reached limit pv
                        if (event.data === "IS_ALLOW_LOAD_POPUP") {
                            //hm.popupHandle();
                            return;
                        }

                        if (event.data.startsWith("refId-")) {
                            window.__hmrid = event.data.split("-")[1];
                            return;
                        }

                        if (event.data.startsWith("urlId-")) {
                            window.__hmuid = event.data.split("-")[1];
                            return;
                        }
                    };
                    //</editor-fold>

                    //Click handle
                   var elements = document.querySelectorAll("label,a,input,button,textarea,img,iframe,video"), i = 0;
                   for (i; i < elements.length; i += 1) {
                       hm.setEventClickListener(elements[i]);
                   }
//
//                    //Scroll handle
//                    window.addEventListener("scroll", function () {
//                        if (hmObj.time_out) {
//                            return;
//                        }
//                        hm.scrollHandle();
//                        hm.readHandle();
//                        hm.resetTimeOut();
//                    });
                    hm.resetTimeOut();


                },
                //</editor-fold>

                //<editor-fold defaultstate="collapsed" desc="HANDLE EVENT FOR READ">
                readHandle: function () {
                    clearTimeout(hmObj.read_check);
                    hmObj.read_check = setTimeout(function () {
                        hm.initWindowElement();
                        if (sReadTop !== 0) {
                            var read = {};
                            read["type"] = "r";
                            read["rP"] = Math.floor(window.innerHeight + sReadTop) >= hmDocH ? Math.floor(hmDocH - window.innerHeight) : Math.floor(sReadTop);
                            read["dH"] = hmDocH;
                            read["wW"] = Math.floor(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
                            read["wH"] = hmWinH;
                            read["d"] = hmObj.device;
                            webSocket.sendMessage(JSON.stringify(read));
                        }
                    }, 4000);
                },
                //</editor-fold>

                //<editor-fold defaultstate="collapsed" desc="HANDLE EVENT FOR SCROLL">
                scrollHandle: function () {
                    clearTimeout(hmObj.sChk);
                    hmObj.sChk = setTimeout(function () {
                        hm.initWindowElement();
                        var scrollTop = Math.floor(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0) + hmWinH;
                        if (scrollTop > hmObj.temp_scroll_pos) {
                            hmObj.temp_scroll_pos = scrollTop;
                            var scroll = {};
                            scroll["type"] = "s";
                            scroll["sP"] = scrollTop >= hmDocH ? hmDocH : scrollTop;
                            scroll["dH"] = hmDocH;
                            scroll["wW"] = hmWinW;
                            scroll["wH"] = hmWinH;
                            scroll["d"] = hmObj.device;
                            webSocket.sendMessage(JSON.stringify(scroll));
                        }
                    }, 300);
                },
                //</editor-fold>

                //<editor-fold defaultstate="collapsed" desc="RESET TIME OUT">
                resetTimeOut: function () {
                    if (hmObj.idl !== null) {
                        clearTimeout(hmObj.idl);
                    }
                    hmObj.idl = setTimeout(function () {
                        hmObj.time_out = true;
                        hmObj.idl = null;
                    }, 600000);
                },
                //</editor-fold>

                //<editor-fold defaultstate="collapsed" desc="HANDLE CLICK EVENT FOR NON A TAG ELEMENT">
                setEventClickListener: function (elements) {
                    elements.addEventListener("click", function (e) {
                        hm.initWindowElement();
                        if (!hmObj.time_out) {
                            e = e || window.event;
                            var ampl = 50,
                                xP = e.pageX !== undefined ? Math.floor(e.pageX) : 0,
                                yP = e.pageY !== undefined ? Math.floor(e.pageY) : 0,
                                isPinchedActionX = Math.abs(hmObj.tempXp - xP) < ampl,
                                isPinchedActionY = Math.abs(hmObj.tempYp - yP) < ampl;
                            if ((hmObj.device === "m") && (isPinchedActionX && isPinchedActionY)) {
                                if (this.nodeName !== "A") {
                                    return;
                                }
                                clearTimeout(hmObj.chkPrevEvent);
                            }
                            hmObj.tempXp = xP;
                            hmObj.tempYp = yP;
                            var click = {};
                            if (this.nodeName === "IMG") {
                                click["txt"] = this.alt === undefined ? "" : this.alt;
                                click["href"] = this.src === undefined ? "" : this.src;
                            } else {
                                click["txt"] = this.innerText === undefined ? "" : this.innerText;
                                click["href"] = this.href === undefined ? "" : this.href;
                                var img = this.getElementsByTagName("img");
                                if (!click["txt"] && click["txt"].trim().length === 0 && img.length) {
                                    click["txt"] = img[0].alt === undefined ? "" : img[0].alt;
                                }
                            }
                            click["type"] = 'c';
                            click["xP"] = xP;
                            click["yP"] = yP;
                            click["dW"] = hmDocW;
                            click["dH"] = hmDocH;
                            click["wW"] = hmWinW;
                            click["d"] = hmObj.device;
                            hmObj.chkPrevEvent = setTimeout(function () {
                                webSocket.sendMessage(JSON.stringify(click));
                                hmObj.chkPrevEvent = null;
                            }, this.nodeName !== "A" ? 300 : 1);
                        }
                    });
                },
                //</editor-fold>
                //<editor-fold defaultstate="collapsed" desc="HANDLE LOAD POPUP SCRIPT EVENT">
//                popupHandle: function() {
//                    let a = document.createElement('script');
//                    a.type = 'text/javascript';
//                    a.async = true;
//                    a.src = document.location.protocol + '//hpjp.mieru-ca.com/embed'
//                            + '?service=heatmap-popup&tokenId='
//                            + window.__fid[0][0]
//                            + '&protocol=' + window.location.protocol
//                            + '&hostname=' + window.location.hostname
//                            + '&pathname=' + encodeURIComponent(window.location.pathname)
//                            + '&search=' + encodeURIComponent(window.location.search)
//                            + '&hash=' + encodeURIComponent(window.location.hash)
//                            + '&dv=' + hmObj.device;
//                    let b = document.getElementsByTagName('script')[0];
//                    b.parentNode.insertBefore(a, b);
//                }
                //</editor-fold>
            };

    //<editor-fold defaultstate="collapsed" desc="INIT">
    this.init = function () {
        setTimeout(hm.sendPageView(), 500);
    };
    //</editor-fold>
};
(function () {
    "use strict";
    window.__mieruca_heatmap = new MierucaHM();
    window.__mieruca_heatmap.init();
}());