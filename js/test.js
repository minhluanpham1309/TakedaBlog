var MierucaHM = function () {
    "use strict";
    var hmObj = {
        local_url: window.location.href,
        referrer_url: document.referrer,
        sWs: ('https:' === document.location.protocol ? 'wss' : 'ws') + '://127.0.0.1:8000/hm',
        HM: {},
        site_id: 672436484,
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
            var fullPattern = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
                    shortPattern = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
                    tabletPattern = /android|ipad|playbook|silk/i,
                    userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (fullPattern.test(userAgent) || shortPattern.test(userAgent.substr(0, 4))) {
                return "m";
            }
            if (tabletPattern.test(userAgent)) {
                return "t";
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
                sendPageView: function () {
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
                        (function () {
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
                            pageView["ua"] = navigator.userAgent || navigator.vendor || window.opera;
                            webSocket.sendMessage(JSON.stringify(pageView));
                        })();
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
                            hm.popupHandle();
                        }
                    };
                    //</editor-fold>

                    //Click handle
                    var elements = document.querySelectorAll("label,a,input,button,textarea,img,iframe,video"), i = 0;
                    for (i; i < elements.length; i += 1) {
                        hm.setEventClickListener(elements[i]);
                    }

                    //Scroll handle
                    // window.addEventListener("scroll", function () {
                    //     if (hmObj.time_out) {
                    //         return;
                    //     }
                    //     hm.scrollHandle();
                    //     hm.readHandle();
                    //     hm.resetTimeOut();
                    // });
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
                            var xP = e.pageX !== undefined ? Math.floor(e.pageX) : 0,
                                    yP = e.pageY !== undefined ? Math.floor(e.pageY) : 0,
                                    xPMax = xP + 50, xPMin = (xP >= 50) ? xP - 50 : 0,
                                    yPMax = yP + 50, yPMin = (yP >= 50) ? yP - 50 : 0;
                            if ((xPMin <= hmObj.tempXp && hmObj.tempXp <= xPMax)
                                && (yPMin <= hmObj.tempYp && hmObj.tempYp <= yPMax)) {
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
                                if (click["txt"] === "" && img.length) {
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
                // popupHandle: function() {
                //     let a = document.createElement('script');
                //     a.type = 'text/javascript';
                //     a.async = true;
                //     a.src = document.location.protocol + '//hpjp.mieru-ca.com/embed'
                //             + '?service=heatmap-popup&tokenId='
                //             + window.__fid[0][0]
                //             + '&protocol=' + window.location.protocol
                //             + '&hostname=' + window.location.hostname
                //             + '&pathname=' + encodeURIComponent(window.location.pathname)
                //             + '&search=' + encodeURIComponent(window.location.search)
                //             + '&hash=' + encodeURIComponent(window.location.hash)
                //             + '&dv=' + hmObj.device;
                //     let b = document.getElementsByTagName('script')[0];
                //     b.parentNode.insertBefore(a, b);
                // }
                //</editor-fold>
            };

    //<editor-fold defaultstate="collapsed" desc="INIT">
    this.init = function () {
        hm.sendPageView();
    };
    //</editor-fold>
};
(function () {
    "use strict";
    window.__mieruca_heatmap = new MierucaHM();
    window.__mieruca_heatmap.init();
}());
