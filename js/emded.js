(function () {
    let varObj = {
        local_url: window.location.href,
        local_protocol: window.location.protocol,
        local_hostname: window.location.hostname,
        local_pathname: window.location.pathname,
        local_search: window.location.search,
        local_hash: window.location.hash,
        local_title: document.getElementsByTagName("title").length === 0 ? window.location.href : document.getElementsByTagName("title")[0].innerHTML,
        rest_url: document.location.protocol + 'rest_url_heatmap_popup_service',
        popup_condition_show: "heatmap_popup_condition_show_popup",
        popup_value_condition_show: "heatmap_popup_value_condition_show_popup",
        popup_value_condition_show_scroll_after_time: "heatmap_popup_value_condition_show_popup_scroll_after_time",
        popup_value_condition_show_scroll_position: "heatmap_popup_value_condition_show_popup_scroll_position",
        popup_condition_inherit: "heatmap_popup_inherit_param_for_url",
        popup_site_id: "heatmap_popup_site_id",
        popup_url_id: "heatmap_popup_url_id",
        popup_popup_id: "heatmap_popup_popup_id",
        device: (function () {
            let fullPattern = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
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
        }()),
        browser: (function () {
            let userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (userAgent.toLowerCase().indexOf("opera") !== -1 || userAgent.toLowerCase().indexOf("opr") !== -1) {
                return "opera";
            }
            if (userAgent.toLowerCase().indexOf("edge") !== -1) {
                return "edge";
            }
            if (userAgent.toLowerCase().indexOf("chrome") !== -1) {
                return "chrome";
            }
            if (userAgent.toLowerCase().indexOf("safari") !== -1) {
                return "safari";
            }
            if (userAgent.toLowerCase().indexOf("firefox") !== -1) {
                return "firefox";
            }
            if (userAgent.toLowerCase().indexOf("msie") !== -1 || document.documentMode !== true) {
                return "ie";
            }
            return "unknown";
        }())
    };

    /*
     * Append html to body
     * mieruca_heatmap_popup_html: this is structure html popup
     */
    const divPopup = document.createElement('div');
    divPopup.innerHTML = "mieruca_heatmap_popup_html";
    document.body.appendChild(divPopup);

    /*
     * If get html successful from server then continues make event for html
     */
    if (document.querySelectorAll("#mieruca_heatmap_popup").length === 0) {
        return;
    }

    //Set event when close browser or go out page
    window.onunload = function () {

    };

    /*
     * Function save tracking metric
     */
    //Save pageview
    let reqParam = new Object();
    reqParam["t"] = "pageview";
    reqParam["sId"] = varObj.popup_site_id;
    reqParam["uId"] = varObj.popup_url_id;
    reqParam["pId"] = varObj.popup_popup_id;
    reqParam["protocol"] = varObj.local_protocol;
    reqParam["hostname"] = varObj.local_hostname;
    reqParam["pathname"] = varObj.local_pathname;
    reqParam["search"] = varObj.local_search;
    reqParam["hash"] = varObj.local_hash;
    reqParam["title"] = varObj.local_title;
    reqParam["browser"] = varObj.browser;
    reqParam["d"] = varObj.device;
    reqParam["ua"] = navigator.userAgent || navigator.vendor || window.opera;
    fetch(varObj.rest_url, {
        method: "POST",
        headers: {"Content-type": "application/json;charset=UTF-8"},
        body: JSON.stringify(reqParam)
    }).then().catch(err => console.log(err));

    //Save impression
    let showMierucaHeatmapPopup = function () {
        /*
         * Show popup
         */
        const popupElement = document.querySelectorAll("#mieruca_heatmap_popup")[0];
        popupElement.style.display = 'block';

        /*
         * Save log show popup
         */
        let reqParam = new Object();
        reqParam["t"] = "impression";
        reqParam["sId"] = varObj.popup_site_id;
        reqParam["uId"] = varObj.popup_url_id;
        reqParam["pId"] = varObj.popup_popup_id;
        reqParam["protocol"] = varObj.local_protocol;
        reqParam["hostname"] = varObj.local_hostname;
        reqParam["pathname"] = varObj.local_pathname;
        reqParam["search"] = varObj.local_search;
        reqParam["hash"] = varObj.local_hash;
        reqParam["title"] = varObj.local_title;
        reqParam["browser"] = varObj.browser;
        reqParam["d"] = varObj.device;
        reqParam["ua"] = navigator.userAgent || navigator.vendor || window.opera;
        fetch(varObj.rest_url, {
            method: "POST",
            headers: {"Content-type": "application/json;charset=UTF-8"},
            body: JSON.stringify(reqParam)
        }).then().catch(err => console.log(err));
    };

    //Save click
    let clickMierucaHeatmapPopup = function () {
        let reqParam = new Object();
        reqParam["t"] = "click";
        reqParam["sId"] = varObj.popup_site_id;
        reqParam["uId"] = varObj.popup_url_id;
        reqParam["pId"] = varObj.popup_popup_id;
        reqParam["protocol"] = varObj.local_protocol;
        reqParam["hostname"] = varObj.local_hostname;
        reqParam["pathname"] = varObj.local_pathname;
        reqParam["search"] = varObj.local_search;
        reqParam["hash"] = varObj.local_hash;
        reqParam["title"] = varObj.local_title;
        reqParam["browser"] = varObj.browser;
        reqParam["d"] = varObj.device;
        reqParam["ua"] = navigator.userAgent || navigator.vendor || window.opera;
        fetch(varObj.rest_url, {
            method: "POST",
            headers: {"Content-type": "application/json;charset=UTF-8"},
            body: JSON.stringify(reqParam)
        }).then().catch(err => console.log(err));
    };

    /*
     * Condition show popup
     */
    if (varObj.popup_condition_show === "show_by_time") {
        //Set time show popup
        setTimeout(showMierucaHeatmapPopup, varObj.popup_value_condition_show * 1000);
    }
    if (varObj.popup_condition_show === "show_by_scroll") {
        let isShowFirstTime = false; //This variable is flag keep status popup did show. Fix case client scroll down and scroll up and scroll again (don't show popup when scroll down again)
        (window).addEventListener("scroll", function () {
            if (isShowFirstTime) {
                return;
            }
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
            let pointShowPopup = (varObj.popup_value_condition_show_scroll_position / 100) * scrollHeight;
            let currentScrollPosition = Math.floor(document.documentElement.scrollTop || document.body.scrollTop || 0);
            if (currentScrollPosition > pointShowPopup) {
                isShowFirstTime = true;
                setTimeout(showMierucaHeatmapPopup, varObj.popup_value_condition_show_scroll_after_time * 1000);
            }
        });
    }
    if (varObj.popup_condition_show === "show_by_exit") {
        /**
         * Handle back button on browser to show popup
         **/
        history.replaceState({initPage: true}, null, null);
        history.pushState(null, null, null);
        window.addEventListener('popstate', e => {
            // Just show popup when leave first access page
            if (history.state && history.state.initPage) {
                history.replaceState(null, null, null);
                showMierucaHeatmapPopup();
            }
        });
    }
    /*
     * Condition click popup
     */
    if (document.querySelectorAll("#mieruca_heatmap_popup .mieruca-heatmap-click-link").length > 0) {
        document.querySelectorAll("#mieruca_heatmap_popup .mieruca-heatmap-click-link")[0].addEventListener("click", function () {
            clickMierucaHeatmapPopup();
        });
    }

    /*
     * Close popup
     */
    if (document.querySelectorAll("#mieruca_heatmap_popup .mieruca-hm-popup-close").length > 0) {
        document.querySelectorAll("#mieruca_heatmap_popup .mieruca-hm-popup-close")[0].addEventListener("click", function () {
            const popupElement = document.querySelectorAll("#mieruca_heatmap_popup")[0];
            popupElement.style.display = 'none';
        });
    }

    //Inherit param of url original
    if (varObj.popup_condition_inherit) {
        let elementLinkPopup = document.querySelector('.mieruca-heatmap-click-link');
        let popupUrl = new URL(elementLinkPopup.href);
        let originalUrl = new URL(varObj.local_url);
        originalUrl.searchParams.forEach((value, key) =>{
            popupUrl.searchParams.append(key, value);
        });
        elementLinkPopup.href = popupUrl;
    }

}).call(this);
