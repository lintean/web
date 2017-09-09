/**
 * Created by Lintean on 2017/4/26.
 */
$(document).ready(function () {

    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;

    init();

    function init(){

        var left = (window.innerWidth * 0.7 - 137) * 0.538;
        $('#postage').css('left', left + 'px');

        var width = 118.5;
        var height = 160;

        if (width/winWidth > height/winHeight) {
            //优先宽度占满
            var change = winWidth / width;
            window.change = change;

            ch_w_h('content',change);

            $('#letter_div').css({
                'transform': "translate3d("+winWidth / 1.8+"px, 0, 0) scale(" + change + ")",
            });
        }
        else {
            //优先高度占满
            var change = winHeight / height;

            ch_w_h('content',change);

            $('#letter_div').css({
                'transform':"translate3d("+winWidth / 1.8+"px, 0, 0) scale("+change+")"
            });
        }

        var left = winWidth / 2 - 118.5 * window.change;
        var top = winHeight / 2 - 80 * window.change;
        $('#content').css('left',left);
        $('#content').css('top',top);
        $('#content').css('right','0');
        $('#content').css('bottom','0');
        $('#content').css({
            'transform':"translate3d(" + winWidth / 1.8 + "px, 0, 0)"
        });

        setTimeout("$('#front').removeClass('hidden')",2400);
        setTimeout("$('#back').addClass('hidden')",2400);
        setTimeout("$('#content').removeClass('hidden')",2400);
        setTimeout("$('#content').addClass('left_active');",2500);
        $('body').addClass('noscroll');
        $('#letter_div').addClass('noscroll');
        $('#content').addClass('noscroll')
    }

    $('#to_right').bind('click',function(event){
        $('#letter_div').css({
            'transform':"translate3d("+ -winWidth / 1.8 +"px, 0, 0) scale("+window.change+")"
        });
        $('#content').css({
            'transform':"translate3d("+ -winWidth / 1.8 +"px, 0, 0)"
        });
        return false;
    });

    $('#submit_button').bind('click',function(event){
        $('body').removeClass('noscroll');
        $('#sec_flow').addClass('flow_active');
        var radio = document.getElementsByName("year_choose");
        var selectTime = (radio[0].checked == true) ? '1' : ((radio[1].checked == true) ? '2' : '');

        var data = {
            "content":$("#input_text").val(),
            "name_to":$('#name_to').val(),
            "phone_to":$('#phone_to').val(),
            "qq_to":$('#qq_to').val(),
            "name_from":$('#name_from').val(),
            "phone_from":$('#phone_from').val(),
            "selectTime":selectTime
        };

        $.ajax({
            url: 'http://wechat.withcic.cn/tp5/public/index.php?s=/timecapsule/Index/checkSet',
            data: data,
            method: "POST",
            dataType:'JSON',
            crossDomain: true,
            success: function (data) {
                if (data['code'] == '0'){
                    $('#letter_div').removeClass('left_active').addClass('without');
                    $('#front').addClass('hidden');
                    $('#back').removeClass('hidden');
                    $('#content').removeClass('left_active').addClass('hidden');
                    $('#letter_div').css({
                        'transform':""
                    });
                    $('#sec_flow').removeClass('hidden');
                    setTimeout("$('#cover').removeClass('hidden');",2400);
                    $('#code_show').text(data['message']);
                    if (selectTime == '1') $('#halfyear_show').removeClass('display_hidden');
                    if (selectTime == '2') $('#year_show').removeClass('display_hidden');
                }
                else {
                    alert(data['message']);
                }
            },
            error:function(){
                alert('好像网络有点问题呢');
            }
        });

        return false;
    });

    $('#to_left').bind('click',function(event){
        $('#letter_div').css({
            'transform':"translate3d("+ winWidth / 1.8 +"px, 0, 0) scale("+window.change+")"
        });
        $('#content').css({
            'transform':"translate3d("+ winWidth / 1.8 +"px, 0, 0)"
        });
        return false;
    });

    $('#halfyear').one('change',function(event){
        $('#choose_time').css('color','#000000');
        $('.lable').css('color','#000000');
        $('#oneyear').unbind();
    });
    $('#oneyear').one('change',function(event){
        $('#choose_time').css('color','#000000');
        $('.lable').css('color','#000000');
        $('#halfyear').unbind();
    });

    $('#end_button').bind('click',function(event){
        window.location.href = 'entrance.html';
    });
});

function ch_w_h(name, change){
    var input_width = $('#'+name).css('width');
    var input_height = $('#'+name).css('height');
    $('#'+name).css({
        'width': parseFloat(input_width) * change + input_width.slice(-2),
        'height': parseFloat(input_height) * change + input_height.slice(-2),
    });
}
