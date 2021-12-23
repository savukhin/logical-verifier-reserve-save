function addMoreSchemas() {
    var newSchemeDiv = document.createElement('div')
    newSchemeDiv.className = 'scheme'
    newSchemeDiv.innerHTML += createSelector(count)  
    var input =  document.createElement('input')
    input.type='text'
    input.id='scheme' + count
    newSchemeDiv.append(input)

    newSchemeDiv.innerHTML += 
                    '<div class="dropdown"> \
                        ?\
                        <div class="dropdown-content">\
                            <div onclick="highlightAxioms(\'axiom-k\')" class="dropdown-element">K</div>\
                            <div onclick="highlightAxioms(\'axiom-s\')" class="dropdown-element">S</div>\
                            <div onclick="highlightAxioms(\'axiom-e-minus\')" class="dropdown-element">E-</div>\
                        </div>\
                    </div>'
    
    schemasDiv.append(newSchemeDiv)
    newSchemeDiv.innerHTML += '<button class = "ExportFile" onClick="exportFile(' + count + ')"></button>'
    newSchemeDiv.innerHTML += '<div class="UploadButton"><button class="ImportFile"></button><input type="file" id="inputFile' + count + '" onclick = "importFile(' + count + ')" multiple></input></div>'
    count++
}

function changeFunc(count){
    var schemeText = document.getElementById("scheme" + count)
    var selectBox = document.getElementById("selectFormulas" + count)
    schemeText.value += selectBox.options[selectBox.selectedIndex].text
}

function generateOptions(count) {
    var selectBox= document.getElementById("selectFormulas" + count)
    var optionsHTML = ""
    for(var i = 0; i < Array.from(axioms, x => x[1][0]).length; i++){
        optionsHTML += '<option>' + Array.from(axioms, x => x[1][0])[i] + '</option>'
    }
    selectBox.innerHTML = optionsHTML
}

function createSelector(count){
    var optionsHTML = '<select class="classic" onclick="generateOptions('+count+')" id = "selectFormulas'+count+'" onchange="changeFunc('+count+')">'
    for(var i = 0; i < Array.from(axioms, x => x[1][0]).length; i++){
        optionsHTML += '<option>' + Array.from(axioms, x => x[1][0])[i] + '</option>'
    }
    optionsHTML += '</select>'
    return optionsHTML
}
