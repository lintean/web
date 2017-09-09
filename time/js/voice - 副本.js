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
var status_name_from;
var status_phone_from;
var status_time;
var status_record;

function timecount(){
    i = 0;
    count();
}

function count(){
    i++;
    if (secs - i >= 10) $('#time_last').text('00:'+ (secs - i));
    else $('#time_last').text('00:0'+ (secs - i));

    var e = Math.round((secs - i) / secs * 284);
    $('#step_front').css('strokeDashoffset',e - 284);

    if (secs - i == 0) {
        stop();
    }
    else t = setTimeout("count()", 1000);
}

function timecount_reverse(){
    i = j;
    count_reverse();
}

function count_reverse(){
    i--;
    if (i >= 10) $('#time_last').text('00:'+ i);
    else $('#time_last').text('00:0'+ i);

    var e = Math.round((secs - i) / secs * 284);
    $('#step_front').css('strokeDashoffset',e - 284);

    if (i == 0) {
        voice_stop();
        clearTimeout(t);
    }
    else t = setTimeout("count_reverse()", 1000);
}

function playVoice(){
    $('#record_play').val('停止播放');

    wx.playVoice({
        localId: window.localId // 需要播放的音频的本地ID，由stopRecord接口获得
    });

    timecount_reverse();

    $('#record_play').one('click',function(event){
        voice_stop();
    });
}

function stopVoice(){
    $('#record_play').val('播放');

    var e = Math.round((secs - j) / secs * 284);
    $('#step_front').css('strokeDashoffset',e - 284);

    $('#record_play').one('click',function(event){
        voice_start();
    });
}

function start() {
    $('#tip').addClass('tip_up');
    $('#hidden').removeClass('div_hidden').addClass('div_up');

    setTimeout("$('#stop').removeClass('hidden')", 1000);
    setTimeout("$('#record').addClass('hidden')", 1000);
    setTimeout('wx.startRecord();', 1000)

    $('#record_start').one('click', function (event) {
        stop();
    });

    setTimeout("timecount();",1000);
}


function stop() {
    if (status_record == "stopped") return;
    status_record = "stopped";
    j = i;
    clearTimeout(t);

    wx.stopRecord({
        success: function (res) {
            window.localId = res.localId;
        }
    });

    setTimeout("alert('录音已结束');",500);
    setTimeout("$('#time_last').text('00:00');",1000);
}

function restart(){
    status_record = 'on';
    $('#tip').removeClass('tip_up');
    $('#hidden').removeClass('div_up').addClass('div_hidden');

    setTimeout("$('#record').removeClass('hidden')", 1000);
    setTimeout("$('#stop').addClass('hidden')", 1000);
    $('#step_front').css('stroke-dashoffset','');

    $('#record_start').unbind("click");
    $('#record_start').one('click', function (event) {
        start();
    });
}

function upload(){
    $('#sec_back').removeClass('slideInUp').addClass('slideOutUp');
    $('#background').removeClass('hidden').addClass('animated slideInUp');
    $('body').addClass('back_p');

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
            }
            else {
                alert(data['message']);
            }
        },
    });

    //$('#sec_back').removeClass('slideInUp').addClass('slideOutUp');
    //$('#sec_end').addClass('visible animated slideInUp');
    //$('html').addClass('back_p');
}

function voice_start(){
    setTimeout("playVoice();",1000);
}

function voice_stop(){
    wx.stopVoice({
        localId: window.localId // 需要停止的音频的本地ID，由stopRecord接口获得
    });

    setTimeout("stopVoice();",500);
}

function validate(expression,id){
    var reg = new RegExp(expression);
    return reg.test($('#'+id).val());
}

function check(){
    if (status_name_to == false) return false;
    if (status_name_to != true) {
        $('#name_to').blur();
        return false;
    }

    if (status_phone_to == false) return false;
    if (status_phone_to != true) {
        $('#phone_to').blur();
        return false;
    }

    if (status_qq_to == false) return false;
    if (status_qq_to != true) {
        $('#qq_to').blur();
        return false;
    }

    if (status_name_from == false) return false;
    if (status_name_from != true) {
        $('#name_from').blur();
        return false;
    }

    if (status_phone_from == false) return false;
    if (status_phone_from != true) {
        $('#phone_from').blur();
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
    $('#error_'+id).slideToggle('slow');
}

function showError_reverse(id){
    $('#leave_'+id).css('background-image',"url('./picture/icon/leave.png')");
    $('#tip_'+id).removeClass('error_color');
    $('#error_'+id).slideToggle('slow');
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
        });

        wx.error(function (res) {
            alert('fail');
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

        });
    }

    init();

    $('#record_restart').bind('click', function (event) {
        stop();
        setTimeout("restart()",500);
    });

    $('#record_start').one('click', function (event) {
        start();
    });

    $('#record_upload').bind('click', function (event) {
        stop();
        setTimeout("upload()",500);
    });


    $('#record_play').one('click', function (event) {
        stop();
        voice_start();
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
        if (validate(".*\\d+.*",'name_from') || $('#name_from').val() == '') {
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
        if (validate(/^[1][0-9]{10}$/,'phone_from') && $('#phone_from').val() != '') {
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
