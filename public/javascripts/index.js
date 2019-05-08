$(()=>{

	var masters = []
	var copies = []

	$.get('/masters', function(data){
		masters = data
		showMasters()
	})

	$.get('/copies', function(data){
		copies = data
		showCopies()
	})

	function showMasters(){
		$('#masters').html('')
		masters.forEach((master, i) => {
			$('#masters').append(`
				<li data-master="${i}">
					${master}
					<span class="w3-right w3-hide">
						<a href="file:///C:/Users/Jonas/Github/softgestion/master/${master}">
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

	function showCopies(){

		$('#copies').html('')
		copies.forEach((copy, i) => {
			$('#copies').append(`
				<li id="copy${copy}" data-copy="${i}">
					${copy}
					<span class="w3-right w3-hide">
						<a href="file:///C:/Users/Jonas/Github/softgestion/copy/${copy}">
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

			var master = masters[$(e.target).data('master')]
			$.get(`/masters/${master}`, files => {
				var pdf = files.filter(f => f.substr(-4).toLowerCase() == '.pdf')
				if (pdf.length > 0) {
					$('#pdfViewer').attr('data', `${master}/${pdf[0]}`)
				}else{
					$('#viewer').attr('data', '')
				}
			})
		}else if (e.target.tagName  == 'I') {
			
			var master = masters[$(e.target).parent().parent().data('master')]

			if ($(e.target).hasClass('fa-history')) {			//Afficher l'historique
				console.log('Afficher l\'historique')
			}else if ($(e.target).hasClass('fa-download')) {	//Créer une copie
				console.log('Créer une copie')
			 	if (copies.indexOf(master) == -1) {
			 		postNewCopy(master)
			 	}else{
			 		if (confirm('Une copie du dossier que vous voulez importer éxiste déjà !\nSouhaitez-vous l\'écraser ?')) {
			 			postNewCopy(master)
			 		}
			 	}

			}

		}

	})

	function postNewCopy(master){
		$.post(`/masters/${master}/copy`, function(data){
			if (data.success) {
				copies.push(master)
				showCopies()
			}else{
				alert('Erreur')
			}
		})		
	}


	$('#copies').click(function(e){

		if (e.target.tagName == 'SPAN') e.target = $(e.target).parent().get(0)

		if (e.target.tagName == 'LI') {	//affiche l'apercue

			var copy = copies[$(e.target).data('copy')]
			$.get(`/copies/${copy}`, files => {
				var pdf = files.filter(f => f.substr(-4).toLowerCase() == '.pdf')
				if (pdf.length > 0) {
					$('#pdfViewer').attr('data', `${copy}/${pdf[0]}`)
				}else{
					$('#viewer').attr('data', '')
				}
			})
		}else if (e.target.tagName  == 'I') {
			
			var index = $(e.target).parent().parent().data('copy')
			var copy = copies[index]

			if ($(e.target).hasClass('fa-trash-alt')) {			//Suppression de la copie
				
				if (confirm(`Etes-vous sur de vouloir supprimer la copie "${copy}" ?\nLes modifications qui n'ont pas été uploader seront perdues !`)) {
					console.log('Suppression de la copie')
					$.post(`/copies/${copy}/remove`, {}, rep => {
						if (rep.success) {
							$(`#copy${copy}`).remove()
							copies.splice(index, 1)
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