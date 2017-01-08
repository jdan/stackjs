// K(x)([y, z, ...]) => [x, y, z, ...]
const K = x => ls => [x, ...ls]

// compose(f, g, h)(x) = h(g(f(x)))
const compose = fns => fns
    .slice(1)
    .reduce((acc, fn) =>
        // Compose `acc` with `fn`
        x => fn(acc(x)),
        fns[0])

const ops = {
    "+": ([a, b, ...rest]) => [a + b, ...rest],
    "-": ([a, b, ...rest]) => [a - b, ...rest],
    "*": ([a, b, ...rest]) => [a * b, ...rest],
    "/": ([a, b, ...rest]) => [a / b, ...rest],
    "%": ([a, b, ...rest]) => [a % b, ...rest],

    "&&": ([a, b, ...rest]) => [a && b, ...rest],
    "||": ([a, b, ...rest]) => [a || b, ...rest],

    "tap": ([a, ...rest]) => a,
    "print": (ls) => console.log(ls),
}

// parse an input string into a list of tokens
const tokenize = (str) => {
    const tokens = [];
    let pos = 0;

    while (str.length) {
        WHITESPACE_RE = /^\s+/
        if (WHITESPACE_RE.test(str)) {
            const ws = str.match(WHITESPACE_RE)[0]

            pos += ws.length
            str = str.slice(ws.length)
            continue
        }

        NUMBER_RE = /^\d+(\.\d+)?/
        if (NUMBER_RE.test(str)) {
            const number = str.match(NUMBER_RE)[0]
            tokens.push({
                type: "Number",
                value: parseFloat(number),
                pos,
            })

            pos += number.length
            str = str.slice(number.length)
            continue
        }

        STRING_RE = /^(".*?"|'.*?')/
        if (STRING_RE.test(str)) {
            const string = str.match(STRING_RE)[0]
            tokens.push({
                type: "String",
                value: string.slice(1, -1),
                pos,
            })

            pos += string.length
            str = str.slice(string.length)
            continue
        }

        LITERAL_RE = /^\S+/
        if (LITERAL_RE.test(str)) {
            const literal = str.match(LITERAL_RE)[0]
            tokens.push({
                type: "Literal",
                value: literal,
                pos,
            })

            pos += literal.length
            str = str.slice(literal.length)
            continue
        }

        throw `ERROR -- Unexpected input at character ${pos}`
    }

    return tokens;
}

// evaluate a list of tokens
//
// note: we don't need to do any parsing yet since our programs
// are a single statement
const evaluate = (input) => {
    const tokens = tokenize(input)

    // All we need to do is map tokens to values
    // Then compose 'em with an empty stack as the input
    return compose(tokens.map(token => {
        if (token.type === "Number" || token.type === "String") {
            return K(token.value)
        } else if (ops.hasOwnProperty(token.value)) {
            return ops[token.value]
        } else {
            throw `${token.value} is undefined (at position ${token.pos})`
        }
    }))([])
}

module.exports = {
    K,
    compose,
    ops,
    tokenize,
    evaluate,
}
