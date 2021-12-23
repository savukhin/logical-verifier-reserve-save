function checkBeta(str) {
    var tree = parseString(str)
    if (tree == false)
        return false

    //var variables = getVariables(tree)
    var variables = getAllSubTrees(tree)
    for (var [, axiom] of axioms) {
        var axiomTree = parseString(axiom[0])
        var axiomVariables = Array.from(getVariables(axiomTree))
        var variants = getAllReplacements(variables, axiomVariables.length)

        for (var variant of variants) {
            var finalAxiom = axiomTree
            finalAxiom = makeMetaReplaces(variant, axiomVariables, finalAxiom)

            if (!isEqualsTrees(finalAxiom, tree))
                continue

            //var resultTree = parseString(concatFormulas(finalAxiom, tree, '->'))
            var resultTree = finalAxiom
                
            if (bruteAxioms(resultTree)) {
                return true
            }
        }
    }
    return false
}

/*
import {parseString} from './parseString.js'
import {checkAxiom, axioms, isEqualsTrees} from './highlightAxioms.js'
import {getStringFromTree} from './getStringFromTree.js'
import {metaReplace, getAllReplacements, getAllSubTrees, getVariables, bruteAxioms} from './MPalgorithm.js'
//console.log(checkBeta("a->b->c->d"))
console.log(checkBeta("p->((a+b)->q)"))
console.log(checkBeta("p->((a+b)->p)"))
*/