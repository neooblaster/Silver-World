// ==UserScript==
// @name         Silver-World Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://silver-world.net/map/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=silver-world.net
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/gh/neooblaster/nativejs-proto-extensions/nativejs-proto-extensions.min.js
// @require      https://rawcdn.githack.com/neooblaster/HTML/aa9263b08705a9676416f2ba64b474daa3a62945/release/v1.4.0/HTML.min.js
// @require      https://rawcdn.githack.com/neooblaster/HTML/8f2ac9f0f94e506847309635b269de0356b46f3e/src/NotifyMe.min.js
// @require      https://cdn.jsdelivr.net/npm/less@4.1.1
// @require      https://cdn.jsdelivr.net/gh/neooblaster/jslib-deliver@master/Common/LocalStorageUtil/LocalStorageUtil.js
// @require      http://localhost:8000/silver-world-assistant.js
// ==/UserScript==

(function() {
    'use strict';

    // Add new link reference for our LESS Stylesheet.
    document.querySelector('html head').appendChild(new HTML().compose({
        name: 'link',
        attributes: {
            rel: 'stylesheet/less',
            type: 'text/css',
            //href: `https://raw.githubusercontent.com/neooblaster/Silver-World/master/less/silver-world-assistant.less?ts=${new Date().getTime()}1`
            // python -m http.server
            // + CORS Unblock
            href: `http://localhost:8000/less/silver-world-assistant.less`
        },
        properties: {
            onload: function(){
                // Apply newly loaded stylesheet
                less.registerStylesheets();
                less.refresh();
            }
        }
    }));
    // Apply newly loaded stylesheet
    less.registerStylesheets();
    less.refresh();

})();