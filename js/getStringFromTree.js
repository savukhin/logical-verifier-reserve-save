function getStringFromTree(tree){
    if(tree.type == "terminate")
        return tree.str
    else if (tree.type == "brackets")
        return "(" + tree.childs[0].str + ")"
    var res = ""
    if(tree.type == "-")
        res += "-"
    for(var i = 0; i < tree.childs.length; i++)
        res += getStringFromTree(tree.childs[i])
            +(i + 1 < tree.childs.length ? tree.type : "")
    return res
}

//export {getStringFromTree}