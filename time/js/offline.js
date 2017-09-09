/**
 * Created by Lintean on 2017/5/6.
 */
var position = '0';
var pos = ['' , 'name', 'phone', 'qq', 'class', 'time'];

function showError(id,message){
    $('#leave_'+id).css('background-image',"url('./picture/icon/red_leave.png')");
    $('#tip_'+id).addClass('red_color');
    $('#error_'+id).text(message);
    $('#error_'+id).slideDown('slow');
}

function showError_reverse(id){
    $('#leave_'+id).css('background-image',"url('./picture/icon/leave.png')");
    $('#tip_'+id).removeClass('red_color');
    $('#error_'+id).slideUp('slow');
}

$(document).ready(function(){
    var hidden_height = parseFloat($('#h_hidden').css('height'));
    $('#h_hidden').addClass('display_hidden');
    $('#y_hidden').addClass('display_hidden');

    $('.line').css('height',parseFloat($('#first_div').css('height')) + window.innerHeight * 0.05 + 'px');
    $('#last_line').css('height',parseFloat($('#hidden_div').css('height')) + window.innerHeight * 0.05 + 'px');
    setTimeout("$('#last_line').addClass('active');",100);

    var Y = $('#h_lable').offset().left;
    $('#h_hidden').css('left',Y - window.innerWidth * 0.15 + 'px');
    $('#y_hidden').css('left',Y - window.innerWidth * 0.15 + 'px');

    var X = $('#tip_name').position().left;
    $('.error_show').css('left',X + 'px');

    var left = (window.innerWidth * 0.8 - 137) * 0.538;
    $('#postage').css('left', left + 'px');

    $('#halfyear').bind('change',function(event){

        if ($('#halfyear').attr('checked') == undefined) {
            $('#h_hidden').slideToggle('slow');
            $('#halfyear').attr('checked','checked');
            $('#h_lable').addClass('focus');

            $('#last_line').css('height',parseFloat($('#last_line').css('height')) + hidden_height + 'px');
        }
        else {
            $('#h_hidden').slideToggle('slow');
            $('#halfyear').removeAttr('checked');
            setTimeout("$('#h_lable').removeClass('focus');",700)

            $('#last_line').css('height',parseFloat($('#last_line').css('height')) - hidden_height + 'px');
        }
    });

    $('#year').bind('change',function(event){

        if ($('#year').attr('checked') == undefined) {
            $('#y_hidden').slideToggle('slow');
            $('#year').attr('checked','checked');
            $('#y_lable').addClass('focus');

            $('#last_line').css('height',parseFloat($('#last_line').css('height')) + hidden_height + 'px');
        }
        else {
            $('#y_hidden').slideToggle('slow');
            $('#year').removeAttr('checked');
            setTimeout("$('#y_lable').removeClass('focus');",700)

            $('#last_line').css('height',parseFloat($('#last_line').css('height')) - hidden_height + 'px');
        }
    });

    $('#submit_d').bind('click',function(event){
        var isHalf = ($('#halfyear').attr('checked') == undefined) ? '0' : '1';
        var isOne = ($('#year').attr('checked') == undefined) ? '0' : '1';
        var data ={
            'senderName':$('#senderName').val(),
            'senderClass':$('#senderClass').val(),
            'senderPhone':$('#senderPhone').val(),
            'qq':$('#qq').val(),
            'isHalf': isHalf,
            'isOne': isOne,
            'h_i_g':$('#h_i_g').val(),
            'h_o_g':$('#h_o_g').val(),
            'h_i_c':$('#h_i_c').val(),
            'y_i_g':$('#y_i_g').val(),
            'y_o_g':$('#y_o_g').val(),
            'y_i_c':$('#y_i_c').val()
        };

        $.ajax({
            url: 'http://wechat.withcic.cn/tp5/public/index.php?s=/offline/index/index',
            data: data,
            method: "POST",
            dataType:"JSON",
            crossDomain: true,
            success: function (data) {
                if (data['code'] == '0'){
                    document.getElementById("write").scrollIntoViewIfNeeded();
                    $('#sec_front').scrollTop(0);
                    $('html').scrollTop(0);
                    $('body').scrollTop(0);
                    $('#sec_front').removeClass('slideInUp').addClass('slideOutUp');
                    $('body').css('overflow','hidden');
                    $('#sec_end').removeClass('hidden').addClass('animated slideInUp');
                    $('#code').text(data['data']['getCode']);
                    $('#money').text(data['data']['postage']);
                    if (isHalf == '1') $('#_h_i_c').text($('#h_i_c').val()); else $('#_h_i_c').text('0');
                    if (isHalf == '1') $('#_h_i_g').text($('#h_i_g').val()); else $('#_h_i_g').text('0');
                    if (isHalf == '1') $('#_h_o_g').text($('#h_o_g').val()); else $('#_h_o_g').text('0');
                    if (isOne == '1') $('#_y_i_c').text($('#y_i_c').val()); else $('#_y_i_c').text('0');
                    if (isOne == '1') $('#_y_i_g').text($('#y_i_g').val()); else $('#_y_i_g').text('0');
                    if (isOne == '1') $('#_y_o_g').text($('#y_o_g').val()); else $('#_y_o_g').text('0');
                }
                else { 
                    //if (position != '0') showError_reverse(pos[position]);
                    position = data['message'].substring(0,1);
                    var message = data['message'].substring(1,data['message'].length);
                    document.getElementById('leave_' + pos[position]).scrollIntoViewIfNeeded();
                    showError(pos[position],message);
                }
            },
            error:function(){
                alert('好像网络有点问题呢');
            }
        }); 

        return false;
    });

    $('#first_button').bind('click',function(event){
        $('body').css('overflow','auto');
        $('#sec_first').addClass('animated slideOutUp');
        $('#sec_front').removeClass('hidden').addClass('animated slideInUp');
    });

    $('#senderName').bind('blur',function(event){
        if (position == '1') showError_reverse('name');
    });

    $('#senderPhone').bind('blur',function(event){
        if (position == '2') showError_reverse('phone');
    });

    $('#qq').bind('blur',function(event){
        if (position == '3') showError_reverse('qq');
    });

    $('#senderClass').bind('blur',function(event){
        if (position == '4') showError_reverse('class');
    });

    $('#hidden_div').bind('click',function(event){
        if (position == '5') showError_reverse('time');
    });

});
