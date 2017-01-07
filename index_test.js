const assert = require("assert")

const {
    K,
    ops,
    compose,
    tokenize,
    evaluate,
} = require("./index.js")

describe("kestrel", () => {
    it("should push a value to the stack", () => {
        assert.deepEqual(K(10)([1, 2, 3]), [10, 1, 2, 3])
    })

    it("should populate an empty stack", () => {
        assert.deepEqual(K(100)([]), [100])
    })
})

describe("ops", () => {
    it("should contain various dyadic functions", () => {
        assert.deepEqual(ops["+"]([1, 2, 3]), [3, 3])
        assert.deepEqual(ops["&&"]([true, false]), [false])
    })
})

describe("compose", () => {
    it("should compose a list of functions", () => {
        const addOne   = n => n + 1
        const timesTwo = n => n * 2
        const oneThird = n => n / 3

        assert.equal(compose([addOne, timesTwo, oneThird])(6), 5)
    })

    it("should work for a single function", () => {
        const addOne = n => n + 1
        assert.equal(compose([addOne])(100), 101)
    })
})

describe("tokenize", () => {
    it("should split by whitespace", () => {
        const tokens = tokenize(`1 2   3
             4`)
        assert.equal(4, tokens.length)
    })

    it("should identify numbers", () => {
        const tokens = tokenize("1   2 +  3 *")
        assert.equal(5, tokens.length)
        assert.equal(3, tokens.filter(t => t.type === "Number").length)
    })

    it("should identify strings", () => {
        const tokens = tokenize(`"hello" 'wor"l"d' 32 "how are you"`)
        assert.equal(4, tokens.length)
        assert.equal(3, tokens.filter(t => t.type === "String").length)
        assert.deepEqual(tokens.map(t => t.value), [
            "hello",
            "wor\"l\"d",
            32,
            "how are you",
        ])
    })

    it("should identify literals", () => {
        const tokens = tokenize("1   2 +  3 *")
        assert.equal(5, tokens.length)
        assert.equal(2, tokens.filter(t => t.type === "Literal").length)
    })
})

describe("evaluate", () => {
    it("should build a simple stack of numbers and strings", () => {
        assert.deepEqual(
            evaluate(`1 2 "hello world" 3 4`),
            [4, 3, "hello world", 2, 1])
    })

    it("should evaluate functions within the stack", () => {
        assert.equal(12, evaluate("4 3 * tap"))
        assert.equal(7, evaluate("1 2 3 * * 1 + tap"))
        assert.equal("hello, world!", evaluate(`"world!" "hello, " + tap`))
    })
})
