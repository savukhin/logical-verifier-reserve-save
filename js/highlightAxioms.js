var axioms = new Map()
axioms.set('axiom-k', ['q -> (p -> q)', 'Axiom K [p -> (q->p)]'])
axioms.set('axiom-s', ['(s -> (p -> q)) -> ((s -> p) -> (s -> q))', 'Axiom S [(𝑠 -> (𝑝 -> 𝑞)) -> ((𝑠 -> 𝑝) -> (𝑠 -> q))]'])
axioms.set('axiom-e-minus', ['((p -> f) -> f) -> p', 'Axiom E- [((p -> f) -> f) -> p]'])
axioms.set('axiom A1', ['a * b -> a', 'kek'])
axioms.set('axiom A2', ['a -> a + b', 'lol'])

var orderDependedTypes = new Set(['->'])

var isEqualsTrees = (obj1,obj2)=>{
    if (obj1.type != obj2.type || (obj1.type == 'terminate' && obj1.str != obj2.str) || obj1.childs.length != obj2.childs.length) {
        if (obj1.type == 'brackets')
            return isEqualsTrees(obj1.childs[0], obj2)
        else if (obj2.type == 'brackets')
            return isEqualsTrees(obj1, obj2.childs[0])
        else 
            return false
    }

    if (orderDependedTypes.has(obj1.type)) {
        for (var i = 0; i < obj1.childs.length; i++) {
            if (!isEqualsTrees(obj1.childs[i], obj2.childs[i]))
                return false
        }
    } else {
        var obj2UsedChilds = Array.from(Array(obj1.childs.length), x => {return false}) 

        for (var i = 0; i < obj1.childs.length; i++) {
            var used = false
            for (var j = 0; j < obj2.childs.length; j++) {
                if (obj2UsedChilds[j])
                    continue

                if (isEqualsTrees(obj1.childs[i], obj2.childs[j])) {
                    used = true
                    obj2UsedChilds[j] = true
                    break
                }
            }

            if (!used)
                return false
        }
    }

    return true
}

function notIntersect(obj1, obj2) { //obj1 and obj2 - maps type of [variable: tree]
    return Array.from(obj1.keys()).every(x => (obj2.has(x) ? isEqualsTrees(obj2.get(x), obj1.get(x)) : true))
}

function checkAxiom(tree, axiomTree) {
    var variables = new Map()
    var result = ''
 
    if ((tree.type != axiomTree.type || tree.childs.length != axiomTree.childs.length) && axiomTree.type != 'terminate') {
        return [result, variables]
    }

    if (axiomTree.type == 'terminate') {                    
        if (variables.has(axiomTree.str)) {                        
            if (isEqualsTrees(variables.get(key), tree)) {
                result = getStringFromTree(tree.childs[i])
            }
        } else {
            result = getStringFromTree(tree)
            variables.set(axiomTree.str, tree)
        }
        return [result, variables]
    }

    if (axiomTree.type == 'brackets') {
        var [childResult, childVar] = checkAxiom(tree.childs[0], axiomTree.childs[0])
        if (childResult == '' || !notIntersect(childVar, variables))
            return ['', variables]
        result = '(' + childResult + ')'
        variables = new Map([...variables].concat([...childVar]))

        return [result, variables]
    }

    for (var i = 0; i < tree.childs.length; i++) {
        var [childResult, childVar] = checkAxiom(tree.childs[i], axiomTree.childs[i])
        if (childResult == '' || !notIntersect(childVar, variables))
            return ['', childVar]
        
        variables = new Map([...variables].concat([...childVar]))


        result += childResult
        if (i < tree.childs.length - 1)
            result += tree.type
    }

    return [result, variables]
}

function findAxiom(tree, axiomString, className) {
    var axiomTree = parseString(axiomString)
    var childsUsed = new Set()
    var result = []

    if (tree.type == axiomTree.type && tree.childs.length >= axiomTree.childs.length) {
        //if (orderDependedTypes.has(tree.type)) {
            for (var i = 0; i < tree.childs.length - axiomTree.childs.length + 1; i++) {
                var left = i, right = i + axiomTree.childs.length
                var newTree = {
                    type: tree.type,
                    childs: tree.childs.slice(left, right),
                    str: ''
                }
                var check = checkAxiom(newTree, axiomTree)[0]
                if (check != '') {
                    result.push({
                        str: check,
                        class: className
                    })
                    if (result != '') {
                        var slice = Array.from(Array(right - left).keys(), x => x + i)
                        slice.every(x => childsUsed.add(x))
                    }
                }
            }            
        //}
    }
    
    for (var i = 0; i < tree.childs.length; i++) {
        if (childsUsed.has(i))
            continue

        var child = tree.childs[i]
        var axiom = findAxiom(child, axiomString, className)
        if (tree.type == 'brackets')
            result.push({
                str: '(',
                class: ''
            })

        if (axiom == '') {
            result.push({
                str: getStringFromTree(child),
                class: ''
            })
        } else {
            result = result.concat(axiom)
        }
        
        if (i < tree.childs.length - 1)
            result.push({
                str: tree.type,
                class: ''
            })
        if (tree.type == 'brackets')
            result.push({
                str: ')',
                class: ''
            })
    }

    return result
}

function highlightAxioms(className) {
    for (var i = 0; i < count; i++) {
        var str = document.getElementById("scheme" + i).value
        var tree = parseString(str)
        if (tree == false) {
            prompt("Scheme " + i + " is incorrect")
            continue
        }

        var result = findAxiom(tree, axioms.get(className)[0], className)
        
        var newDiv = document.createElement('div')
        for (var i = 0; i < result.length; i++) {
            for (var i = 0; i < result.length; i++) {
                var q = document.createElement('span')
                q.innerHTML = result[i].str
                if (result[i].class != '') {
                    q.title = axioms.get(result[i].class)[1]
                    q.className = result[i].class
                }
                newDiv.append(q)
            }            
        }
        
        schemasDiv.append(newDiv)
    }
}

/*
import {parseString} from './parseString.js'
import {getStringFromTree} from './getStringFromTree.js'
//console.log(findAxiom(parseString("(s -> (p -> q)) -> ((s -> p) -> (s -> q))"), 'p -> (q -> p)', 'axiom-k'));
//console.log(findAxiom(parseString("((s -> (p -> q)) -> ((s -> p) -> (s -> q))) + a"), '(s -> (p -> q)) -> ((s -> p) -> (s -> q))', 'axiom-s'));
//console.log(isEqualsTrees(parseString('q*a+b'), parseString('b+a*q')))
export {checkAxiom, axioms, isEqualsTrees}*/