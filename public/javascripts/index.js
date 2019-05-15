$(()=>{

	var paths = {}
	var masters = []
	var copies = []

	$.get('/paths', res => {
		paths = res
	})

	$.get('/masters', res => {
		masters = res
		showMasters()
	})

	$.get('/copies', res => {
		copies = res
		showCopies()
	})



	function showMasters(){
		$('#masters').html('')
		masters.forEach((master, i) => {
			$('#masters').append(`
				<li data-master="${master}">
					${master}
					<span class="w3-right w3-hide">
						<a href="${paths.master}/${master}">
							<i class="far fa-folder-open"></i>
						</a>&nbsp;&nbsp;
						<i class="fas fa-history"></i>&nbsp;&nbsp;
						<i class="fas fa-download"></i>
					</span>
				</li>
			`)
		})

		//TODO: charger un apercu
		$('#masters li').hover(function(){
			$(this).children('span').removeClass('w3-hide')
		}, function(){
			$(this).children('span').addClass('w3-hide')
		})

	}

	$('#mastertitle').hover(function(){
		$(this).children('i').removeClass('w3-hide')
	}, function(){
		$(this).children('i').addClass('w3-hide')
	})

	$('#openaddmaster').click(function(){
		$('#selectfolder').click()
	})

	$('#selectfolder').change(function(){
		console.log('Folder selected')
		var files = Array.from($(this).get(0).files, f => f.webkitRelativePath)
		var data = new FormData($(this).parent()[0])

		$.ajax({
			type: 'POST',
			enctype: 'multipart/form-data', 
			url: '/masters',
			data: data,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 600000,
			success: function (data) {
				alert(data.message)
				console.log(data.form)
			},
			error: function (err) {
				alert(err.message)
			}
		})

		/*
		if (files.length) {
			console.log(files)
			var folderName = prompt('Nom du dossier', files[0].split('/')[0])
			var cleanFolderName = folderName.replace(/[^a-zA-Z0-9]/g, '')
			if (folderName.length > cleanFolderName.length) {
				alert(`Les caractères spéciaux et les espaces ont été supprimés.\nRésultat: ${cleanFolderName}`)
			}




			$.postJSON('/masters', {folderName: folderName, files: files}, function(rep){
				if (rep.success) {
					//TODO: traiter le succès
				 console.log('succès')
				}else{
					alert(rep.message)
				}
			}, 'json')
					
		}else{
			alert('Dossier vide !')
		}
		*/
	})



	function showCopies(){

		$('#copies').html('')
		copies.forEach((copy, i) => {
			$('#copies').append(`
				<li id="copy${copy}" data-copy="${copy}">
					${copy}
					<span class="w3-right w3-hide">
						<a href="${paths.copy}/${copy}">
							<i class="far fa-folder-open"></i>
						</a>&nbsp;&nbsp;
						<i class="far fa-trash-alt"></i>&nbsp;&nbsp;
						<i class="fas fa-upload"></i>
					</span>
				</li>
			`)
		})

		//TODO: cherger un apercu
		$('#copies li').hover(function(){
			$(this).children('span').removeClass('w3-hide')
		}, function(){
			$(this).children('span').addClass('w3-hide')
		})

	}

	$('#masters').click(function(e){

		if (e.target.tagName == 'SPAN') e.target = $(e.target).parent().get(0)

		if (e.target.tagName == 'LI') {	//affiche l'apercue

			var master = $(e.target).data('master')
			$.get(`/masters/${master}`, files => {
				var pdf = files.filter(f => f.substr(-4).toLowerCase() == '.pdf')
				if (pdf.length > 0) {
					$('#pdfViewer').attr('data', `${master}/${pdf[0]}`)
				}else{
					$('#viewer').attr('data', '')
				}
			})
		}else if (e.target.tagName  == 'I') {
			
			var master = $(e.target).parent().parent().data('master')

			if ($(e.target).hasClass('fa-history')) {			//Afficher l'historique
				console.log('Afficher l\'historique')
			}else if ($(e.target).hasClass('fa-download')) {	//Créer une copie
				console.log('Créer une copie')
				console.log(copies)
			 	if (copies.indexOf(master) == -1) {
			 		postNewCopy(master)
			 	}else{
			 		if (confirm('Une copie du dossier que vous voulez importer éxiste déjà !\nSouhaitez-vous l\'écraser ?')) {
			 			postNewCopy(master, true)
			 		}
			 	}

			}

		}

	})

	function postNewCopy(master, notNew){
		$.post(`/masters/${master}/copy`, function(data){
			if (data.success) {
				if (!notNew) copies.push(master)
				showCopies()
			}else{
				alert('Erreur')
			}
		})		
	}


	$('#copies').click(function(e){

		if (e.target.tagName == 'SPAN') e.target = $(e.target).parent().get(0)

		if (e.target.tagName == 'LI') {	//affiche l'apercue

			var copy = $(e.target).data('copy')
			$.get(`/copies/${copy}`, files => {
				var pdf = files.filter(f => f.substr(-4).toLowerCase() == '.pdf')
				if (pdf.length > 0) {
					$('#pdfViewer').attr('data', `${copy}/${pdf[0]}`)
				}else{
					$('#viewer').attr('data', '')
				}
			})
		}else if (e.target.tagName  == 'I') {
			
			var copy = $(e.target).parent().parent().data('copy')

			if ($(e.target).hasClass('fa-trash-alt')) {			//Suppression de la copie
				
				if (confirm(`Etes-vous sur de vouloir supprimer la copie "${copy}" ?\nLes modifications qui n'ont pas été uploader seront perdues !`)) {
					console.log('Suppression de la copie')
					console.log(copies)
					$.post(`/copies/${copy}/remove`, {}, rep => {
						if (rep.success) {
							$(`#copy${copy}`).remove()
							copies.splice(copies.indexOf(copy), 1)
						}else{
							alert(rep.message)
						}
					})
				}

			}else if ($(e.target).hasClass('fa-upload')) {	//Soumission de la copie
				console.log('soumission de la copie')

			}

		}

	})

})

$.postJSON = function( url, data, callback) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
		callback = data
		data = undefined
	}

    return jQuery.ajax({
		url: url,
		type: "POST",
		contentType:"application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify(data),
		success: callback
	})
}