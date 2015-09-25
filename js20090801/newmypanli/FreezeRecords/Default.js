$(function() {

    $('#startDate').datepick({ closeAtTop: false, showDefault: false, showOn: 'both', buttonImageOnly: true, buttonImage: 'http://sf.panli.com/FrontEnd/images20090801/newmypanli/RmbAccount/guojia.gif' });
    $('#endDate').datepick({ closeAtTop: false, showDefault: false, showOn: 'both', buttonImageOnly: true, buttonImage: 'http://sf.panli.com/FrontEnd/images20090801/newmypanli/RmbAccount/guojia.gif' });

    $("#btn_Search").click(function() {
        var url = "/mypanli/FreezeRecords/Default.aspx?t=" + $(".jilu .on").attr("index");
        if ($("#startDate").val().length > 0) {
            url += ("&s=" + encodeURI($("#startDate").val()));
        }
        if ($("#endDate").val().length > 0) {
            url += ("&e=" + encodeURI($("#endDate").val()));
        }
        window.location = url;
    });

    $(".biao table tr:nth-child(odd)").addClass("d");
});