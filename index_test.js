const assert = require("assert")

const {
    K,
    ops,
    compose,
    tokenize,
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

        assert.equal(compose([timesTwo, addOne])(6), 14)
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
