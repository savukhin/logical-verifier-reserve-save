function deleteSpaces(str) {
    var result = ""
    for (var i = 0; i < str.length; i++) {
        if (str[i] != ' ' && str[i] != '\t')
            result += str[i]
    }
    return result;
}

const typesEnum = new Map([['*', 1],
                            ['/', 2],                            
                            ['+', 3],
                            ['->', 4],                            
                            ['brackets', -1000],
                            ['terminate', -1000],
                        ]) // In order of operation

function getNextVariable(str) {
    if (str[0] == '(') {
        var brackets = 1;
        var i;
        for (i = 1; i < str.length && brackets > 0; i++) {
            if (str[i] == '(') 
                brackets++
            else if(str[i] == ')')
                brackets--
        }
        return str.slice(0, i);
    }
    var regexp = /^[a-zA-Z0-9]*/
    var ans = str.match(regexp)
    if (ans != null)
        return ans[0]
    return false
}

function getNextOperand(str) {
    var regexp = /^->|\*|\+|\\/
    var ans = str.match(regexp)
    if (ans != null)
        return ans[0]
    return false
}

function parseString(str) { // False if error
    str = deleteSpaces(str);
    if (str.length == 0)
        return false

    let tree = {
        type : 'terminate',
        childs : [],
        str : str,
    }
    

    var separatorsIndexes = [-1]
    
    for (var i = (str[0] != '-') ? 0 : 1; ; ) {
        // Reading a variable
        var nextVar = getNextVariable(str.slice(i))
        if (nextVar == false)
            return false
        i += nextVar.length

        if (i == str.length)
            break

        // Reading an operator
        var operator = getNextOperand(str.slice(i))
        if (operator == false)
            return false        

        if (typesEnum.get(operator) > typesEnum.get(tree.type)) {
            tree.type = operator
            separatorsIndexes = [-operator.length]
        }

        if (operator == tree.type)
            separatorsIndexes.push(i)

        i += operator.length
    }

    if (tree.type == 'terminate') { // It can be brackets
        var firstNonMinusIndex = (str[0] != '-') ? 0 : 1; // Can be minus ahead
        if (str[firstNonMinusIndex] == '(') { // Case if it is brackets
            var child = parseString(str.slice(firstNonMinusIndex + 1, str.length - 1))
            if (child == false)
                return false
            tree.childs.push(child)
            tree.type = 'brackets'
        }

        if (str[0] == '-' ) { // Processing minus ahead
            let child = {
                type : tree.type,
                childs : tree.childs,
                str : str.slice(1),
            }
            tree.childs = [child]
            tree.type = '-'
        }
        return tree
    }
    separatorsIndexes.push(tree.str.length);

    for (var i = 1; i < separatorsIndexes.length; i++) {
        var left = separatorsIndexes[i-1] + tree.type.length, right = separatorsIndexes[i]
        var insideTree = parseString(tree.str.slice(left, right))
        tree.childs.push(insideTree)
    }
        
    return tree
}

//export {deleteSpaces, parseString}