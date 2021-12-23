function importFile(count){
	var schemeText = document.getElementById("scheme" + count)
	var inputFile =document.getElementById("inputFile" + count)
	inputFile.addEventListener('change', () => { 
    let files = inputFile.files 
    const file = files[0] 
    let reader = new FileReader() 
    reader.onload = (e) => { 
        const file = e.target.result 
        const lines = file.split(/\r\n|\n/)
        schemeText.value += lines.join('\n')
    }
    reader.onerror = (e) => alert(e.target.error.name) 
    reader.readAsText(file)

})
}
