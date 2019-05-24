$(()=>{

	var paths = {}
	var masters = []
	var masterCopied = ''
	var copies = []
	var copiesSections = []

	//LOAD PATHS
	$.get('/paths', res => {
		paths = res
	})

	//LOAD MASTERS
	$.get('/masters', res => {
		masters = res
		showMasters()
	})

	//LOAD COPIES AND SECTIONS
	$.get('/copies', res => {
		copies = res.copies
		copiesSections = res.sections
		showCopies()
		showCopiesSection()
	})

	//MASTERS
	function showMasters(){
		$('#masters').html('')
		masters.forEach(addMaster)
		addMasterEvent()
	}

	function addMaster(master) {
		$('#masters').append(`
			<li data-master="${master}">
				${master}
				<span class="w3-right w3-hide">
					<a href="${paths.master}/${master}">
						<i class="far fa-folder-open"></i>
					</a>&nbsp;&nbsp;
					<i class="far fa-copy"></i>&nbsp;&nbsp;
					<i class="fas fa-history"></i>&nbsp;&nbsp;
					<i class="fas fa-download"></i>
				</span>
			</li>
		`)
	}

	function addMasterEvent() {
		$('#masters li').hover(function(){
			$(this).children('span').removeClass('w3-hide')
		}, function(){
			$(this).children('span').addClass('w3-hide')
		})		
	}

	$('#masters').click(function(e){

		if (e.target.tagName == 'SPAN') e.target = $(e.target).parent().get(0)

		if (e.target.tagName == 'LI') {	//affiche l'apercue

			master = $(e.target).data('master')
			$.get(`/masters/${master}`, files => {
				var pdf = files.filter(f => f.substr(-4).toLowerCase() == '.pdf')
				if (pdf.length > 0) {
					$('#pdfViewer').attr('data', `${master}/${pdf[0]}`)
				}else{
					$('#viewer').attr('data', '')
				}
			})
		}else if (e.target.tagName  == 'I') {
			
			master = $(e.target).parent().parent().data('master')

			if ($(e.target).hasClass('fa-history')) {			//Afficher l'historique
				showBackups(master)

			}else if ($(e.target).hasClass('fa-copy')) {	//Afficher les copies
				$(`/folder/${master}`, res => {
					//TODO: Afficher le dernier log
					//TODO: Ajouter un log lors de la copy
				})
				showcopieslist()
			}else if ($(e.target).hasClass('fa-download')) {	//Ouvre le choix de section pour créer une copie
				masterCopied = master
				$('#choiceCopySection').css('display', 'block')
			}
		}
	})



	$('.toogleList').click(function() {
		if ($('#listTitle').text() == 'Copies') {
			showbackupslist()
		}else{
			showcopieslist()
		}
	})

	function showbackupslist() {
		$('#listTitle').text('Archives')
		$('#backups, .toogleList.fa-history').removeClass('w3-hide')
		$('#copies, .toogleList.fa-copy').addClass('w3-hide')
	}

	function showcopieslist() {
		$('#listTitle').text('Copies')
		$('#copies, .toogleList.fa-copy').removeClass('w3-hide')
		$('#backups, .toogleList.fa-history').addClass('w3-hide')
	}

	$('#openaddmaster').click(function() {
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
						console.log(data)
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

	//BACKUPS
	function showBackups(master){
		showbackupslist()
		$.get(`/backups/${master || ''}`, backups => {
			$('#backups').html('')
			backups.forEach(backup => {
				$('#backups').append(`
					<li data-backup="${backup.time}">
						${backup.log}
						<br>
						${new Date(backup.time).toLocaleString()}
						<span class="w3-right w3-hide">
							<a href="${backup.path}">
								<i class="far fa-folder-open"></i>
							</a>&nbsp;&nbsp;
						</span>
					</li>
				`)				
			})

			addBackupsEvent()
		})
	}

	function addBackupsEvent() {
		$('#backups li').hover(function(){
			$(this).children('span').removeClass('w3-hide')
		}, function(){
			$(this).children('span').addClass('w3-hide')
		})		
	}

	//COPIES

	function showCopies(){

		$('#copies').html('')

		copies.forEach(copy => addCopy(copy))
		addCopyEvent()
	}

	function addCopy(copy, pre) {
		var html = `
			<li id="copy${copy.replace('\\', '')}" data-copy="${copy}">
				${copy.replace('\\', ' / ')}
				<span class="w3-right w3-hide">
					<a href="${paths.copy}/${copy}">
						<i class="far fa-folder-open"></i>
					</a>&nbsp;&nbsp;
					<i class="far fa-trash-alt"></i>&nbsp;&nbsp;
					<i class="fas fa-upload"></i>
				</span>
			</li>
		`
		if (pre) {
			$('#copies').prepend(html)
		}else{
			$('#copies').append(html)
		}		
	}

	function addCopyEvent(){
		//TODO: charger un apercu
		$('#copies li').hover(function(){
			$(this).children('span').removeClass('w3-hide')
		}, function(){
			$(this).children('span').addClass('w3-hide')
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
				
				if (confirm(`Etes-vous sur de vouloir supprimer la copie "${copy}" ?\n\nLes modifications qui n'ont pas été proposées seront perdues !`)) {
					$.post(`/copies/${copy}/remove`, rep => {
						if (rep.success) {
							$(`#copy${copy.replace('\\', '')}`).remove()
							copies.splice(copies.indexOf(copy), 1)
						}else{
							alert(rep.message)
						}
					})
				}

			}else if ($(e.target).hasClass('fa-upload')) {	//Soumission de la copie
				var comment = prompt('Quels sont les changements ?')
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

	function postNewCopy(section, notNew){
		var log = prompt(`Quelle est la raison d'être de cette copie ?`)
		$.post(`/masters/${masterCopied}/copy`, {section: section, log, log}, res => {
			if (res.success) {
				if (!notNew) {
					copies.push(`${section}\\${masterCopied}`)
					addCopy(`${section}\\${masterCopied}`, true)
				}
				$('#choiceCopySection').css('display', 'none')
				addCopyEvent()
			}else{
				alert(`Erreur: ${err.message}`)
			}
		})
	}


	//COPIES SECTIONS

	function showCopiesSection() {
		$('#copiesSections').html('')
		copiesSections.forEach(addCopySection)
	}

	function addCopySection(section) {
		$('#copiesSections').append(`
			<li class="copysection">${section}</li>
		`)
	}

	$('#CreateCopySection').click(function() {
		var section = $('#searchCopySection').val()

		$.post('/copies/section', {section: section}, res => {
			if (res.success) {
				addCopySection(section)
			}else alert(res.message)
		})

	})

	$('#copiesSections').click(function(e) {
		if (e.target.tagName  == 'LI') {
			var section = $(e.target).text()
			if (copies.indexOf(`${section}\\${masterCopied}`) == -1) {
				postNewCopy(section)
			}else{
				if (confirm('Une copie du dossier que vous voulez importer éxiste déjà !\nSouhaitez-vous l\'écraser ?')) {
					postNewCopy(section, true)
				}
			}			
		}
	})

	$('#closeChoiceCopySection').click(function() {
		$('#searchCopySection').val('')		
		$('#searchCopySection').keyup()		
		$('#choiceCopySection').css('display', 'none')
	})

	$('#searchCopySection').keyup(function() {
		var val = $(this).val().toLowerCase()
		var match = 0
		$('#copiesSections li').each(function(){
			if ($(this).html().toLowerCase().indexOf(val) == -1) {
				$(this).addClass('w3-hide')
			}else{
				$(this).removeClass('w3-hide')
				++match
			}
		})

		if (match == 0) {
			$('#CreateCopySection').removeClass('w3-hide')
		}else{
			$('#CreateCopySection').addClass('w3-hide')
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