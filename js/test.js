import {parseString, deleteSpaces} from './parseString.js';

function test(tests, func) {
    for (var i = 0; i < tests.length; i++) {
        try {
            var answer = func(tests[i][0]); 
            if (JSON.stringify(answer) != JSON.stringify(tests[i][1])) {
                console.log("Wrong answer at " + i + " test: "  + tests[i][0] + " with answer " + JSON.stringify(answer))
                console.log("---")
            }
        } catch (error) {
            console.log("Error at " + i + " test: "  + tests[i][0])
            console.log("---")
        }
    }
}

var deleteSpacesTests = [
        ['qwer asdf zxcv', 'qwerasdfzxcv'],
        ['aaa', 'aaa'],
        ['', ''],
        ['  ', ''],
        ['\t \t', ''],
        ['ab ba', 'abba'],
        ['q w e r\t', 'qwer'],
        ['ok\tok', 'okok'],
        ['\t\t\t', ''],
        ['\t\t   \t  \t " okda \' tt', '"okda\'tt'],
    ]

var parseStringTests = [
        ['a->b', JSON.parse('{"type":"->","childs":[{"type":"terminate","childs":[],"str":"a"},{"type":"terminate","childs":[],"str":"b"}],"str":"a->b"}')],
        ['a-<b', false],
        ['kek', JSON.parse('{"type":"terminate","childs":[],"str":"kek"}')],
        ['())', false],
        ['()', false],
        ['(a))', false],
        ['(a)', JSON.parse('{"type":"brackets","childs":[{"type":"terminate","childs":[],"str":"a"}],"str":"(a)"}')],
        ['((a))', JSON.parse('{"type":"brackets","childs":[{"type":"brackets","childs":[{"type":"terminate","childs":[],"str":"a"}],"str":"(a)"}],"str":"((a))"}')],
        ['a+b*c + (a+b)', JSON.parse('{"type":"+","childs":[{"type":"terminate","childs":[],"str":"a"},{"type":"*","childs":[{"type":"terminate","childs":[],"str":"b"},{"type":"terminate","childs":[],"str":"c"}],"str":"b*c"},{"type":"brackets","childs":[{"type":"+","childs":[{"type":"terminate","childs":[],"str":"a"},{"type":"terminate","childs":[],"str":"b"}],"str":"a+b"}],"str":"(a+b)"}],"str":"a+b*c+(a+b)"}')],
        ['a++', false],
        ['+a+', false],
        ['+a+b', false],
        ['-a', JSON.parse('{"type":"-","childs":[{"type":"terminate","childs":[],"str":"a"}],"str":"-a"}')],
        ['-a+b', JSON.parse('{"type":"+","childs":[{"type":"-","childs":[{"type":"terminate","childs":[],"str":"a"}],"str":"-a"} ,{"type":"terminate","childs":[],"str":"b"}],"str":"-a+b"}')],
        ['-a+(a * (b1 + a2) + a)', JSON.parse('{"type":"+","childs":[{"type":"-","childs":[{"type":"terminate","childs":[],"str":"a"}],"str":"-a"},{"type":"brackets","childs":[{"type":"+","childs":[{"type":"*","childs":[{"type":"terminate","childs":[],"str":"a"},{"type":"brackets","childs":[{"type":"+","childs":[{"type":"terminate","childs":[],"str":"b1"},{"type":"terminate","childs":[],"str":"a2"}],"str":"b1+a2"}],"str":"(b1+a2)"}],"str":"a*(b1+a2)"},{"type":"terminate","childs":[],"str":"a"}],"str":"a*(b1+a2)+a"}],"str":"(a*(b1+a2)+a)"}],"str":"-a+(a*(b1+a2)+a)"}')],
        ['a+', false],
        ['a-b', false],
        ['a-', false],
    ]

console.log("Testing deleteSpaces(str) with " + deleteSpacesTests.length + " tests")
test(deleteSpacesTests, deleteSpaces)
console.log("deleteSpaces(str) testing ended")
console.log("------------------")
console.log("Testing parseString(str) with " + parseStringTests.length + " tests")
test(parseStringTests, parseString);
console.log("parseString(str) testing ended")