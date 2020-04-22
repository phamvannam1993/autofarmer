$('.tab').click(function () {
    var tab = $(this).attr('data-id');
    var uid = $('#uid').val();
    viewData(1, tab , uid);
})

$('body').on('click', '.page-link', function() {
    var page = $(this).text();
    var tab = $(this).closest('.tab-pane').attr('data-id');
    var uid = $('#uid').val();
    viewData(page, tab , uid);
});

function viewData(page, tab , uid) {
     $.ajax({
        type: "GET",
        url: $('#getAtionUrl').val(),
        data: {
            tab: tab,
            uid: uid,
            page:page
        },
        success: function (response) {
            $('.tabAction'+tab).html(response);
            $('.tabAction'+tab).find('a').attr('href', 'javascript:void(0)');
        },
        error: function (response) {

        }
    });
}

$('.btnSubmit').click(function () {
    var id = $(this).attr('id');
    submitForm(id);
})

function submitForm(id) {
    form = $('#CloneForm');
    var data = form.serialize();
    if(id == 'delete') {
        var url = $('#deleteClone').val();
    } else {
        var url = $('#updateClone').val();
    }
    if(id == 'update-all') {
        data = {
            'update' : '1',
            '_token' : $('#_token').val()
        };
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (response) {
            location.reload();
        },
        error: function (response) {

        }
    });
}

$('#search').click(function () {
    var action = $('#action').val();
    var uid = $('#Clone').val();
    var url = $('#urlSearch').val()+'?action='+action+'&uid='+uid;
    window.location.href = url;
})

$('.checkAll').click(function () {
    if ($('.checkAll').is(':checked')) {
        $('body .checkBox').attr('checked', true);
    } else {
        $('body .checkBox').attr('checked', false);
    }
})

var action = $('#action').val() ? $('#action').val() : '';
if(action) {
    $('.boxClone').find('.page-link').each(function () {
        var href = $(this).attr('href')
        if(href) {
            var link = href+'&action='+action
            $(this).attr('href', link)
        }
    })
}

function makeTransaction(element, planId) {
    var btn = $(element);
    $.ajax({
        type: "POST",
        url: $('#urlSave').val(),
        headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
        plan_id: planId
    },
    beforeSend: function() {
        btn.prop('disabled', true);
        btn.prepend('<i class="fa fa-spinner fa-spin"></i>');
    },
    success: function(response) {
        btn.prop('disabled', false);
        btn.find('i.fa-spinner').remove();
        if (response.success == 1) {
            window.location.href = $('#urlRedirect').val() +'/'+ response.data.code;
        } else {
            toastr.error(response.message);
        }
    },
    complete: function(){
        btn.prop('disabled', false);
        btn.find('i.fa-spinner').remove();
    }
});
}

$.ajax({
	type: "GET",
	url: $('#getBalanceUrl').val(),
	data: {
	},
	success: function (response) {
		$('#balance').text(response);
	},
	error: function (response) {

	}
});

$('#appName').change(function () {
    var value = $(this).val()
    var userId = $('#userId').val()
    $.ajax({
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        url: $('#changAppNameUrl').val(),
        data: {
            appName:value,
            userId:userId
        },
        success: function (response) {
            location.reload()
        },
        error: function (response) {

        }
    });
})

$('.updateAtion').change(function () {
    var name = $(this).attr('data-action')
    var deviceId = $(this).attr('data-id')
    var value = $(this).val()
    $.ajax({
        type: "POST",
        url: $('#updateUrl').val(),
        headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
        name: name,
            deviceId: deviceId,
            value:value
    },
    success: function(response) {
        
    },
});
})