/**
 * Created by Lintean on 2017/5/7.
 */
var height = window.innerHeight;
var width = window.innerWidth;

function getPgjs(){
    var agent = navigator.userAgent.toLowerCase();
    var res = agent.match(/android/);
    if(res == "android")
        return res;
    res = agent.match(/iphone/);
    if(res == "iphone")
        return "ios";
    res = agent.match(/ipad/);
    if(res == "ipad")
        return "ipad";
    res = agent.match(/windows/);
    if(res == "windows")
        return "wp";
    return "pc";
}

if (getPgjs() == "pc" || getPgjs() == "wp" || getPgjs() == "ipad"){
    alert('为使用完整功能，请使用手机浏览网页');
    if (getPgjs() == "wp") window.location.href = 'about:blank ';
    CloseWebPage();
}

$(window).resize(function() {
    $('html').height(height);
    $('body').height(height);
    if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

function CloseWebPage(){
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        } else {
            window.open('', '_top');
            window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';
    } else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}
