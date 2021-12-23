function downloadAsStr(filename, text){
    var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".txt");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function downloadAsJson(filename, text){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(text)
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function exportFile(count){
    str = document.getElementById("scheme" + count).value
    	if(str){
    		tree = JSON.stringify(parseString(str))
    		if(tree != 'false'){
    			downloadAsStr("scheme" + count, str)
    			downloadAsJson("scheme" + count, tree)
    		} else {
    			alert("The formula is not correct! Try again!")
    		}
    	} else {
    		alert("You have not entered a formula in the Scheme" + (count+1) + "! Try again!")
    }

}