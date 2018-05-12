/**
 * Tools for h5sve
 * @desc: h5sve tools
 * @email: dielangwei@gmail.com
 * Copyright (c) 2018 dielang, under MIT license
 */
(function(a){
'use strict';

function Tools() {}

/**
 * @desc Sample fetch for request, cache in localStore
 * @param {url} string
 * @param {cache} string
 * @param {fn} callback function
 */
Tools.fetch = function (url,cacheFlag,cb) {
    if(cacheFlag){ /* need cache */
        var currentTime = new Date().valueOf();
        var currentFlag = cacheFlag;
        var currentFlagTime = currentFlag+'-time';
        if (JSON.stringify(metoo.getItem(currentFlag)) != "null" && parseInt(metoo.getItem(currentFlagTime)) > currentTime - http_cache_time) {
            cb(metoo.getItem(currentFlag));
            console.info('get '+currentFlag+' cache.');
        } else {
            fetch(url).then(res=> {
                if (res.status === 200) {
                    return res.json();
                }
            }).then(data=> {
                if( data!=null && data !={} ){
                    metoo.setItem(currentFlag,JSON.stringify(data));
                    metoo.setItem(currentFlagTime,new Date().valueOf());
                    cb(data);
                }
            }).catch(err=> {
                console.error( 'get '+currentFlag+' err: ' + err.toString() );
            });
        }
    }else{
        fetch(url).then(res=> {
            if (res.status === 200) {
                return res.json();
            }
        }).then(data=> {
            if( data!=null && data !={} ){
                cb(data);
            }
        }).catch(err=> {
            console.error( 'request err: ' + err.toString() );
        });
    }
    if(!cb){
        fetch(url).then(res=> {
            if (res.status === 200) {
                return res.json();
            }
        }).then(data=> {
            if( data!=null && data !={} ){
                cb(data);
            }
        }).catch(err=> {
            console.error( 'request err: ' + err.toString() );
        });
	}
}

/**
* @desc set cookie with expire time.
* @param {key} string
* @param {value} string
* @param {expire} expire time by date.
*/
Tools.prototype.setCookie = function (key,value,expireDay) {
	var expire = new Date();
	expire.setDate(expire.getDate()+expireDay);
	document.cookie = key + '=' + encodeURIComponent(value)+((expire==null) ? "" : ";expires="+expire.toGMTString());
}

/**
* @desc get cookie.
* @param {key} string
*/
Tools.prototype.getCookie = function (key) {
    if (document.cookie.length>0)
    {
        var c_start=document.cookie.indexOf(key + "=")
        if (c_start!=-1)
        {
            c_start=c_start + key.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return encodeURIComponent(document.cookie.substring(c_start,c_end));
        }
    }
    return ""
}

/**
* @desc get cookie.
* @param {arg} obj
*/
Tools.prototype.isArray = function(arg) {
    if (typeof arg === 'object') {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return false;
}

/**
 * @desc Cache json object
 * @param {string} key
 * @param {string} value
 */
Tools.prototype.setItem = function(key, value) {
	var v = null;
	if( typeof value == 'string'){
		v = value;
	}else{
		v = JSON.stringify(value);
	}
	window.localStorage.setItem(key, v);
}

/**
 * @desc Get from cache
 * @return {string} key
 */
Tools.prototype.getItem = function(key) {
	return JSON.parse(window.localStorage.getItem(key));
}

/**
 * @desc Calculate word in a string
 * @return {number} number of words (contains chinese an english)
 */
Tools.prototype.getstringLEN = function(val) {
	var len = 0;
	if(val) {
		for(var i = 0; i < val.length; i++) {
			var a = val.charAt(i);
			if(a.match(/[^\x00-\xff]/ig) != null) {
				len += 2;
			} else {
				len += 1;
			}
		}
	}
	return len;
}

/**
 * @desc Judge is wechat browser or not
 * @return {Boolean}
 */
Tools.prototype.isWxBrowser = function() {
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}

/**
 * @desc Get device's dpr
 * @return {number} dpr value, default return 1
 */
Tools.prototype.getDevicePixelRatio = function () {
	return window.devicePixelRatio || 1;
}

/**
 * @desc Get browser's location language
 * @isLower {boolean}
 * @customLanguage {string}
 * @return {string} short-code
*/
Tools.prototype.getLanguage = function (isLower=true,customLanguage) {
	/*
	 if have a custom set, it will return custom language, otherwise return the browser' language.
	 eg, getLanguage(false,'en-us');
	 */
    var language;
	typeof customLanguage == 'string' ? language = customLanguage : language = (window.navigator.language || window.navigator.browserLanguage);
    return isLower? language.toLowerCase() : language;
}

/**
 * @desc test phone number
 * @type 0 1 2, phone, tel, phone and tel
 * @number {string} phone number
 * @return {boolean}
 */
Tools.prototype.isCanCall = function (number,type) {
    var pattern = '';
    if(type==0){
    	pattern = /^(1[34578]\d{9})$/;
	}else if (type==1){
        pattern = /^(0\d{2,3}-\d{7,8})$/;
	}else if(type==2){
        pattern = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
	}else {
		console.warn('please set an regular rule.');
	}
	return pattern.test(number);
}

/**
* @desc replace substring from string
* @content {string} string
* @toItem {string} substring
* @return {string}
*/
Tools.prototype.replace = function (content,reg,toItem) {
	return content.replace(reg,toItem);
}

/**
 *@desc debounce function, clear repeat option an run option at the last.
 *@param {string} function
 *@param {string} delay time
 */
Tools.prototype.debounce = function(fn,delayTime){
	var timer;
	return function () {
		clearTimeout(timer);
		/* fn run after delayTime */
		timer = setTimeout(function (args) {
			fn.apply(undefined,args);
        }.bind(undefined,arguments),delayTime);
    }
}

/**
 * @desc Toast tool, like android's toast.
 * @param {string} msg
 *@param {int} duration time
*/
Tools.prototype.toast =  function () {
	var msg = arguments[0];
	var duration = arguments[1];

	duration = isNaN(duration) ? 3000 : duration;
	var m = document.createElement('div');

	m.innerHTML = msg;
	m.style.cssText = "width:60%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; min-width:150px; background:#000; opacity:0.5; height:40px; color:#fff; line-height:40px; text-align:center; border-radius:5px; position:absolute; top:0px; left:0px; right:0px; bottom:0px;margin:auto; z-index:999999; font-weight:bold;";
	document.body.appendChild(m);
	var h1, h2;
	h1 = setTimeout(function () {
		var d = 0.5;
		m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
		m.style.opacity = '0';
		h2 = setTimeout(function () {
			document.body.removeChild(m);
			clearTimeout(h1);
			clearTimeout(h2);
		}, d * 1000);
	}, duration);
}

a.Metool = Tools;
a.metoo = new Tools();
})(window)