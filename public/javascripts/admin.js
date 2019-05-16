$(() => {

	
	selectMenu(0)

	var pulls = []

	//LOAD PULLS
	$.get('/pulls', res => {
		pulls = res
		pulls.sort((a, b) => a.time - b.time)
		pulls.forEach(addPull)
	})

	function addPull(pull) {
		$('#pulls').append(`
			<li>
				<span class="w3-large">${pull.pull}</span>
				<span class="w3-small w3-opacity">${new Date(pull.time).toLocaleString()}</span>
				<i class="acceptpull fas fa-check w3-xlarge w3-right w3-button w3-round"></i>
				<i class="removepull fas fa-times w3-xlarge w3-right w3-button w3-round" style="margin-right: 20px"></i>					
				<br><span>${pull.log.replace('->', '- ')}</span>
			</li>
		`)
	}



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

	$('#menu li').click(function() {
		selectMenu($(this).data('index'))
	})

	function selectMenu(index) {
		$('#menu li').css('border-left', 'none')
		$(`#menu${index}`).css('border-left', 'solid 5px grey')

		$('.content').addClass('w3-hide')
		$(`#content${index}`).removeClass('w3-hide')
	}

})