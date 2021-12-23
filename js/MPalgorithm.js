function concatFormulas(tree1, tree2, sign='->') {
    return '(' + getStringFromTree(tree1) + ')' + sign + '(' + getStringFromTree(tree2) + ')'
}

function bruteAxioms(tree) { // false if can't brute axiom to this tree
    for (let [, axiomMP] of axioms) {
        if (checkAxiom(tree, parseString(axiomMP[0]))[0] != '') {
            return true
            break
        }
    }
    return false
}

function getVariables(tree) {
    if(tree.type == "terminate")
        return new Set([tree.str])
    else if (tree.type == "brackets")
        return getVariables(tree.childs[0])

    var res = new Set([])
    for(var i = 0; i < tree.childs.length; i++) 
        res = new Set([...res, ...getVariables(tree.childs[i])])
    return res
}

function metaReplace(replacingTree, variable, tree) { // like [B/b]f    
    if (tree.type == 'terminate') {
        if (tree.str == variable)
            return replacingTree
        return tree
    }

    let result = {
        type: tree.type,
        childs: [],
        str: tree.str
    }
    for (let child of tree.childs) {
        result.childs.push(metaReplace(replacingTree, variable, child))
    }
    result.str = getStringFromTree(result)
    return result
}

function makeMetaReplaces(replacingTrees, variables, tree) {
    if (tree.type == 'terminate') {
        for (var i = 0; i < replacingTrees.length; i++) {
            if (tree.str == variables[i])
                return replacingTrees[i]
        }
        return tree
    }

    let result = {
        type: tree.type,
        childs: [],
        str: tree.str
    }
    for (let child of tree.childs) {
        result.childs.push(makeMetaReplaces(replacingTrees, variables, child))
    }
    result.str = getStringFromTree(result)
    return result
}

function getAllReplacements(variables, count) {
    if (count == 1)
        return Array.from(variables.values())
    var result = []
    var tmp = new Set([...variables.values()])
    for (var elem of variables) {
        //tmp.delete(elem)
        var variants = getAllReplacements(tmp, count - 1)
        //tmp.add(elem)
        for (var variant of variants) {
            if (variant.length > 1)
                result.push([elem, ...variant])
            else
                result.push([elem, variant])
        }
    }
    return result
}

function getAllSubTrees(tree) {
    if (tree.type == 'terminate')
        return new Set([tree])
    
    var subtrees = new Set()
    for (var child of tree.childs) {
        getAllSubTrees(child).forEach(elem => {
            var tmp = [...subtrees].filter(sub => isEqualsTrees(sub, elem)) // Because subtrees.has(elem) don't work with JSON
            if (tmp.length == 0)
                subtrees.add(elem)
        })
    }
    subtrees.add(tree)

    return subtrees
}

function checkMP(str) {
    var tree = parseString(str)
    if (tree == false)
        return false

    var variables = getAllSubTrees(tree)
    for (var [, axiom] of axioms) {
        var axiomTree = parseString(axiom[0])
        var axiomVariables = Array.from(getVariables(axiomTree))
        var variants = getAllReplacements(variables, axiomVariables.length)

        for (var variant of variants) {
            var finalAxiom = axiomTree
            /*for (var i = 0; i < variant.length; i++) {
                finalAxiom = metaReplace(variant[i], axiomVariables[i], finalAxiom)
            }*/
            finalAxiom = makeMetaReplaces(variant, axiomVariables, finalAxiom)

            var resultTree = parseString(concatFormulas(finalAxiom, tree, '->'))
                
            if (bruteAxioms(resultTree)) {
                return true
            }
        }
    }
    return false
}

//p->((a*b)->a)
/*
import {parseString} from './parseString.js'
import {getStringFromTree} from './getStringFromTree.js'
import {checkAxiom, axioms, isEqualsTrees} from './highlightAxioms.js'
export {metaReplace, getAllReplacements, getAllSubTrees, getVariables, bruteAxioms}
*/
//console.log(checkMP('p->(s*d->s)'));
//console.log(checkMP('p->p->p'));
//console.log(checkMP('a->a'));
//console.log(getStringFromTree(metaReplace(parseString('a'), 'b', parseString('q + b -> s'))))