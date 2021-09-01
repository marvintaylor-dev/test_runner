const assert = require('assert')
const { forEach } = require('../index');

let numbers;
//sets our numbers array to 1,2,3 before every test case
beforeEach(() => {
    numbers = [1, 2, 3];
});

it('should sum an array', () => {
    const numbers = [1, 2, 3];

    let total = 0;
    forEach(numbers, (value) => {
        total += value;
    })

    assert.strictEqual(total, 6);
    //will 'ruin' our numbers array to test if beforeEach is resetting our array to 1,2,3
    numbers.push(3)
    numbers.push(3)
    numbers.push(3)
    numbers.push(3)
    numbers.push(3)
    numbers.push(3)
})

//tests whether our array is reset to 1,2,3
it('beforeEach is ran each time', () => {
    assert.strictEqual(numbers.length, 4)
})