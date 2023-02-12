$(document).ready(() => {
	$('#submitBtn').on('click', submitURL);
	$('#urlText').keypress(() => $('#resp-msg').hide());
});

const loading = (state) => {
	$("#submitBtn").prop('disabled', state);
	if (state == true) {
		scrollToBottom();
		$('#loading-container').show();
		$('#progressbar').css({
			"width": "0%",
			"transition": "none"
		});
		setTimeout(() => {
			$('#progressbar').css({
				"width": "100%",
				"transition": "10s"
			});
		}, 100);
		$('#resp-msg').text('');
	} else {
		$('#loading-container').hide();
	}
}

const scrollToBottom = () => {
	$("html, body").animate({
		scrollTop: $(document).height()
	}, 1000);
}
