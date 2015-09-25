
function lianxikefu(objID) {
    messageHandle.open();
    $('#iframe1').attr('src', "/mypanli/message/ShipMessageDetail.aspx?fkid=" + objID + "&type=2");
}

function TiJiaoShip(obj) {
    var weight = $(obj).parents("tr").find(".tempHiddenTrClass").find("input[type='hidden'][name='hid_Item_Weight']").val();
    var id = $(obj).parents("tr").find(".tempHiddenTrClass").find("input[type='hidden'][name='hid_Item_ID']").val();

    if (parseInt(weight) > 20000) {
        $(".advisory_message").show();
        Panli.Overlay.open();
    }
    else {
        window.location.href = '/mypanli/Parcel/ValidateParcel.aspx?id=' + id;
    }
}



function ValidateProductsNext()
{
    if ($("#chkItem").is(":checked")) {
        window.location.href = '';
    }
    else {
        alert("请仔细阅读并接受以上申明！");
    }
}


var IsExistsPic = function (url) {
    $.ajax({
        type: "get",
        url: url,
        timeout: 2000,
        beforeSend: function () { },
        complete: function () { },
        error: function (result) {
            $("div.w_tu").hide();
            $("div.waiguan").hide();
        },
        success: function (res) {
            $("div.w_tu").show();
            $("div.waiguan").show();
        }
    });
}

