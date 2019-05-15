$(() => {
	console.log('work')

	$.get('/paths', res => {
		$('#pathmaster').val(res.master)
		$('#pathcopy').val(res.copy)
		$('#pathpull').val(res.pull)
		$('#pathbackup').val(res.backup)
	})

	$('#save').click(function(){
		var paths = {
			master: $('#pathmaster').val(),
			copy: 	$('#pathcopy').val(),
			pull: 	$('#pathpull').val(),
			backup: $('#pathbackup').val()
		}

		$.post('/paths', paths, res => {
			if (res.success) {
				alert(res.message)
			}else{
				alert(res.message)
			}
		})
	})

})