// K(x)([y, z, ...]) => [x, y, z, ...]
const K = x => ls => [x, ...ls]

// compose(f, g, h)(x) = f(g(h(x)))
const compose = fns => fns
    .slice(1)
    .reduce((acc, fn) =>
        // Compose `acc` with `fn`
        x => acc(fn(x)),
        fns[0])

const ops = {
    "+": ([a, b, ...rest]) => [a + b, ...rest],
    "-": ([a, b, ...rest]) => [a - b, ...rest],
    "*": ([a, b, ...rest]) => [a * b, ...rest],
    "/": ([a, b, ...rest]) => [a / b, ...rest],
    "%": ([a, b, ...rest]) => [a % b, ...rest],

    "&&": ([a, b, ...rest]) => [a && b, ...rest],
    "||": ([a, b, ...rest]) => [a || b, ...rest],
}

module.exports = {
    K,
    compose,
    ops,
}
