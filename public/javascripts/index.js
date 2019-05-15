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
		masters.forEach(addMaster)
		addMasterEvent()
	}

	var addMaster = master => {
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
	}

	var addMasterEvent = () => {
		$('#masters li').hover(function(){
			$(this).children('span').removeClass('w3-hide')
		}, function(){
			$(this).children('span').addClass('w3-hide')
		})		
	}

	$('#openaddmaster').click(function(){
		$('#selectfolder').click()
	})

	//TODO: change is the good event ?
	$('#selectfolder').change(function(){

		var files = Array.from($(this).get(0).files, f => f.webkitRelativePath)
		var data = new FormData($(this).parent()[0])
		
		if (files.length) {
			var folderName = prompt('Nom du dossier', files[0].split('/')[0])

			//TODO: faire la même côté server
			var cleanFolderName = folderName.replace(/[^a-zA-Z0-9]/g, '')

			data.append('folderName', cleanFolderName)

			//TODO: Laisser l'écrasement possible ?
			if (masters.indexOf(cleanFolderName) == -1 || confirm(`Attention, le dossier ${cleanFolderName} existe déjà !\n Etes-vous sur de vouloir l'écraser`)) {
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
						masters.push(folderName)
						addMaster(folderName)
						addMasterEvent()
					},
					error: function (err) {
						alert(err.message)
					}
				})				
			}
					
		}else{
			alert('Dossier vide !')
		}
		
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
				var comment = prompt('Quels sont les changement ?')
				if (comment.length) {
					$.post(`/copies/${copy}/pull`, {comment: comment}, res => {
						if (res.success) {
							alert(`Merci !\n\nVos modifications seront prise en compte dés qu'elles seront validé !` )
						}else{
							alert(err.message)
						}
					})
				}else{
					alert('Vous devez faire un commentaire !')
				}

			}

		}

	})

})

$.postJSON = function(url, data, callback) {
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