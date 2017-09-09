/**
 * Created by Lintean on 2017/5/4.
 */
var secs = 60;
var i;
var t;
var j;
var status_name_to;
var status_phone_to;
var status_qq_to;
var status_name_from = true;
var status_phone_from = true;
var status_time;
var status_record;
var id;
var target;

//var height = window.innerHeight;
//$(window).resize(function() {
//    $('html').height(height);
//    $('body').height(height);
//    $('#sec_front').height(height);
//    if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
//        window.setTimeout(function () {
//            document.activeElement.scrollIntoViewIfNeeded();
//        }, 0);
//    }
//});

function timecount(id,target){
    i = 0;
    window.id = id;
    window.target = target;
    count();
}

function count(){
    i++;
    if (i >= 10) $('#time_last').text('00:'+ (i));
    else $('#time_last').text('00:0'+ (i));

    var e = Math.round((window.target - i) / window.target * 284);
    $('#step_front_'+ window.id).css('strokeDashoffset',e - 284);

    if (i >= window.target){
        if (window.id == 'record') {
            t = setTimeout("stop()",1000);
            setTimeout("alert('录音已结束');",1500);
        }
        else if (window.id == 'play') t = setTimeout("voice_stop();",1000);
    }
    else t = setTimeout("count(window.id,window.target)", 1000);
}

function playVoice(){
    status_record = 'playing';

    wx.playVoice({
        localId: window.localId // 需要播放的音频的本地ID，由stopRecord接口获得
    });

    timecount('play',j);

    $('#play_start').one('click',function(event){
        voice_stop();
    });
}

function to_play(){
    $('#wave').addClass('wave');
    setTimeout("$('#stop_play').addClass('hidden');",490);
    setTimeout("$('#play').removeClass('hidden');",490);
    setTimeout("if (j >= 10) $('#time_last').text('00:'+ (j));",700);
    setTimeout("if (j < 10) $('#time_last').text('00:0'+ (j));",700);
    setTimeout("$('#step_front_play').css('strokeDashoffset',0);",1000);
    setTimeout("$('#wave').removeClass('wave');",700);
}

function to_record(){
    $('#wave_record').addClass('wave');
    setTimeout("$('#wave_record').removeClass('wave');",700);
}

function after_to_play(){
    $('#play_start').one('click',function(event){
        voice_start();
    });
}

function to_stop(id){
    $('#' + id + '_start').addClass('to_stop');
    window.id = id;
    if (window.id == 'play') setTimeout("$('#'+window.id).addClass('hidden');", 490);
    if (window.id == 'play') setTimeout("$('#stop_'+window.id).removeClass('hidden');", 490);
    setTimeout("$('#' + id + '_start').removeClass('to_stop');", 700);
}

function start() {
    to_stop('record');
    setTimeout('wx.startRecord();', 700)
    setTimeout("timecount('record',60);",700);

    $('#record_start').one('click', function (event) {
        stop();
    });
}

function stop() {
    status_record = "stopped";
    j = i;
    clearTimeout(t);

    wx.stopRecord({
        success: function (res) {
            window.localId = res.localId;
        }
    });
    to_record();

    setTimeout("div_up();",800);
}

function restart(){
    status_record = 'on';
    div_down();

    $('#step_front_record').css('stroke-dashoffset','');
    $('#step_front_play').css('stroke-dashoffset','');
    setTimeout("$('#time_last').text('00:00');",1000);

    $('#record_start').one('click', function (event) {
        start();
    });
}

function upload(){
    wx.uploadVoice({
        localId: window.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
            window.serverId = res.serverId; // 返回音频的服务器端ID
            afterUpload();
        }
    });
}

function afterUpload() {
    var radio = document.getElementsByName("yearchoose");
    var selectTime = (radio[0].checked == true) ? '1' : ((radio[1].checked == true) ? '2' : '');
    var data = {
        "name_to": $('#name_to').val(),
        "phone_to": $('#phone_to').val(),
        "qq_to": $('#qq_to').val(),
        "name_from": $('#name_from').val(),
        "phone_from": $('#phone_from').val(),
        "selectTime": selectTime,
        "mediaId": window.serverId
    };

    $.ajax({
        url: 'http://wechat.withcic.cn/tp5/public/index.php?s=/timecapsule/index/checkSet',
        data: data,
        method: "POST",
        dataType:'JSON',
        crossDomain: true,
        success: function (data) {
            if (data['code'] == '0') {
                if (selectTime == '1') $('#halfyear_show').removeClass('display_hidden');
                if (selectTime == '2') $('#year_show').removeClass('display_hidden');
                $('#code_show').text(data['message']);
                $('#sec_back').removeClass('slideInUp').addClass('slideOutUp');
                $('#background').removeClass('hidden').addClass('animated slideInUp');
            }
            else {
                alert(data['message']);
            }
        },
        error:function(){
            alert('好像网络有点问题呢');
        }
    });
}

function voice_start(){
    to_stop('play');
    setTimeout("playVoice();",700);
}

function voice_stop(){
    wx.stopVoice({
        localId: window.localId // 需要停止的音频的本地ID，由stopRecord接口获得
    });
    clearTimeout(t);
    $('#play_start').unbind();

    to_play();
    setTimeout("status_record = 'stopped';",700);

    setTimeout("after_to_play()",1200);
}

function validate(expression,id){
    var reg = new RegExp(expression);
    return reg.test($('#'+id).val());
}

function check(){
    if (status_name_to == false) {
        $('#name_to').focus();
        return false;
    }
    if (status_name_to != true) {
        $('#name_to').blur();
        $('#name_to').focus();
        return false;
    }

    if (status_phone_to == false) {
        $('#phone_to').focus();
        return false;
    }
    if (status_phone_to != true) {
        $('#phone_to').blur();
        $('#phone_to').focus();
        return false;
    }

    if (status_qq_to == false) {
        $('#qq_to').focus();
        return false;
    }
    if (status_qq_to != true) {
        $('#qq_to').blur();
        $('#qq_to').focus();
        return false;
    }

    if (status_name_from == false) {
        $('#name_from').focus();
        return false;
    }
    if (status_name_from != true) {
        $('#name_from').blur();
        $('#name_from').focus();
        return false;
    }

    if (status_phone_from == false) {
        $('#phone_from').focus();
        return false;
    }
    if (status_phone_from != true) {
        $('#phone_from').blur();
        $('#phone_from').focus();
        return false;
    }
    
    var radio = document.getElementsByName("yearchoose");
    var selectTime = (radio[0].checked == true) ? '1' : ((radio[1].checked == true) ? '2' : '');
    if (selectTime == '') {
        if (status_time == false) return false;
        status_time = false;
        showError('time',"时间没选好");
        return false;
    }

    return true;
}

function valueTrim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function showError(id,message){
    $('#leave_'+id).css('background-image',"url('./picture/icon/red_leave.png')");
    $('#tip_'+id).addClass('error_color');
    if (message != '') $('#error_'+id).text(message);
    $('#error_'+id).slideDown('slow');
}

function showError_reverse(id){
    $('#leave_'+id).css('background-image',"url('./picture/icon/leave.png')");
    $('#tip_'+id).removeClass('error_color');
    $('#error_'+id).slideUp('slow');
}

function div_up(){
    if ($('#div_up').hasClass('div_slideInDown')) $('#div_up').removeClass('div_slideInDown');
    $('#div_up').addClass('div_slideOutUp');
    if ($('#div_down').hasClass('div_slideOutDown')) $('#div_down').removeClass('div_slideOutDown');
    $('#div_down').addClass('div_slideInUp');
}

function div_down(){
    $('#div_down').removeClass('div_slideInUp').addClass('div_slideOutDown');
    $('#div_up').removeClass('div_slideOutUp').addClass('div_slideInDown');
}

$(document).ready(function () {

    function init() {
        var X = $('#tip_name_to').position().left;
        $('.error_show').css('left',X + 'px');

        $('#last_line').css('height',parseFloat($('#last_div').css('height')) + parseFloat($('#container_div').css('height')) * 0.081 + 'px');

        var left = (window.innerWidth * 0.8 - 137) * 0.538;
        $('#postage').css('left', left + 'px');

        $.ajax({
            url: 'http://wechat.withcic.cn/tp5/public/index.php?s=/timecapsule/index/sendParam',
            method: "GET",
            crossDomain: true,
            success: function (data) {
                data = JSON.parse(data);

                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wxc08ee94c1250cea0', // 必填，公众号的唯一标识
                    timestamp: data['timestamp'], // 必填，生成签名的时间戳
                    nonceStr: data['noncestr'], // 必填，生成签名的随机串
                    signature: data['signature'],// 必填，签名，见附录1
                    jsApiList: ['onVoiceRecordEnd', 'onVoicePlayEnd', 'onVoicePlayEnd',
                        'startRecord', 'stopRecord', 'uploadVoice', 'playVoice', 'pauseVoice', 'stopVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.onVoiceRecordEnd({
                    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                    complete: function (res) {
                        window.localId = res.localId;
                    }
                });

                wx.onVoicePlayEnd({
                    success: function (res) {
                        window.localId = res.localId; // 返回音频的本地ID
                    }
                });
            },
            error:function(){
                alert('好像网络有点问题呢');
            }
        });

        wx.error(function (res) {
            alert('fail');
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

        });
    }

    init();

    $('#record_restart').bind('click', function (event) {
        if (status_record == 'stopped') restart();
        else if (status_record == 'playing') alert('还没停止播放呢');
    });

    $('#record_start').one('click', function (event) {
        start();
    });

    $('#record_upload').bind('click', function (event) {
        if (status_record == 'stopped') upload();
        else if (status_record == 'playing') alert('还没停止播放呢');
    });


    $('#play_start').one('click', function (event) {
        if (status_record == 'stopped') voice_start();
        else if (status_record == 'playing') alert('还没停止播放呢');
    });

    //$('#play_pause').bind('click', function (event) {
    //    wx.pauseVoice({
    //        localId: "window.localId" // 需要暂停的音频的本地ID，由stopRecord接口获得
    //    });
    //});

    //$('#play_stop').bind('click', function (event) {
    //    wx.stopVoice({
    //        localId: "window.localId" // 需要停止的音频的本地ID，由stopRecord接口获得
    //    });
    //});

    $('#to_record').bind('click', function (event) {
        if (check()){
            $('#sec_front').addClass('animated slideOutUp');
            $('#sec_back').removeClass('hidden').addClass('animated slideInUp');
        }
    });

    $('#end_button').bind('click', function (event) {
        window.location.href = 'entrance.html';
    });

    $('#halfyear').bind('change',function(event){
        var radio = document.getElementsByName("yearchoose");
        if (radio[0].checked == true){
            $('#halfyear_div').removeClass('grey').addClass('focus');
            if ($('#year_div').hasClass('focus')) $('#year_div').removeClass('focus').addClass('grey');

            if (status_time == false){
                status_time = true;
                showError_reverse('time');
            }
        }
    });
    $('#year').bind('change',function(event){
        var radio = document.getElementsByName("yearchoose");
        if (radio[1].checked == true){
            $('#year_div').removeClass('grey').addClass('focus');
            if ($('#halfyear_div').hasClass('focus')) $('#halfyear_div').removeClass('focus').addClass('grey');

            if (status_time == false){
                status_time = true;
                showError_reverse('time');
            }
        }
    });

    $('#name_to').bind('blur',function(event){
        $('#name_to').val(valueTrim($('#name_to').val()));
        if (validate(".*\\d+.*",'name_to') || $('#name_to').val() == '') {
            if (status_name_to == false) return false;
            status_name_to = false;
            showError('name_to',"收件人姓名没填好");
        }
        else {
            if (status_name_to == false){
                showError_reverse('name_to');
            }
            status_name_to = true;
        }
    });

    $('#phone_to').bind('blur',function(event){
        $('#phone_to').val(valueTrim($('#phone_to').val()));
        if (validate(/^[1][0-9]{10}$/,'phone_to') && $('#phone_to').val() != '') {
            if (status_phone_to == false){
                showError_reverse('phone_to');
            }
            status_phone_to = true;
        }
        else{
            if (status_phone_to == false) return false;
            status_phone_to = false;
            showError('phone_to',"收件人手机没填好");
        }
    });

    $('#qq_to').bind('blur',function(event){
        $('#qq_to').val(valueTrim($('#qq_to').val()));
        if (validate(/^[1-9][0-9]{4,}$/,'qq_to') && $('#qq_to').val() != '') {
            if (status_qq_to == false){
                showError_reverse('qq_to');
            }
            status_qq_to = true;
        }
        else{
            if (status_qq_to == false) return false;
            status_qq_to = false;
            showError('qq_to',"收件人qq没填好");
        }
    });

    $('#name_from').bind('blur',function(event){
        $('#name_from').val(valueTrim($('#name_from').val()));
        if (validate(".*\\d+.*",'name_from')) {
            if (status_name_from == false) return false;
            status_name_from = false;
            showError('name_from',"寄件人姓名没填好");
        }
        else {
            if (status_name_from == false){
                showError_reverse('name_from');
            }
            status_name_from = true;
        }
    });

    $('#phone_from').bind('blur',function(event){
        $('#phone_from').val(valueTrim($('#phone_from').val()));
        if (validate(/^[1][0-9]{10}$/,'phone_from') || $('#phone_from').val() == '') {
            if (status_phone_from == false){
                showError_reverse('phone_from');
            }
            status_phone_from = true;
        }
        else{
            if (status_phone_from == false) return false;
            status_phone_from = false;
            showError('phone_from',"寄件人手机没填好");
        }
    });
});
