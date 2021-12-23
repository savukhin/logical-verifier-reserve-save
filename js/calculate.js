function isAxiomsExists(axiom)  {
    var axiomTree = parseString(axiom)
    for (var [, axiomsElem] of axioms)
        if (isEqualsTrees(parseString(axiomsElem[0]), axiomTree))
            return true
    return false
}

function calculate() {
    var old = new Map(Array.from(axioms))
    for (var i = 0; i < count; i++) {
        var str = document.getElementById("scheme" + i).value

        if (checkMP(str)) {
            alert(i + " - yes, MP")
            if (!isAxiomsExists(str))
                axioms.set('formula-' + i, [str, 'formula-' + i + ' [' + str + ']'])

        } else if (checkBeta(str)) {
            alert(i + " - yes, Beta")
            if (!isAxiomsExists(str))
                axioms.set('formula-' + i, [str, 'formula-' + i + ' [' + str + ']'])

        } else {
            alert("Error at " + i)
            break
        }
    }
 //   alert(Array.from(axioms, x => x[1][0]).join('\n'))
    //axioms = old
}
