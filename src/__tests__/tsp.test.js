import { Tsp } from '../tsp';

let tsp = new Tsp();

describe('core functionality test', () => {
    test('1', () => {
        tsp = new Tsp();
        const points = [
            [40.738967, -73.983748], // 0
            [40.722868, -73.988469], // 3
            [40.736853, -73.978427], // 1
            [40.717598, -73.991130], // 4
            [40.730934, -73.983019], // 2
        ];
        console.log(tsp.getShortestRoute(points));
        expect(tsp.getShortestRoute(points)).toEqual([0, 2, 4, 1, 3]);
    });


    test('2', () => {
        tsp = new Tsp();
        const points = [
            [40.730934, -73.983019], // 2
            [40.738967, -73.983748], // 0
            [40.722868, -73.988469], // 3
            [40.736853, -73.978427], // 1
            [40.717598, -73.991130], // 4
        ];
        console.log(tsp.getShortestRoute(points));
        expect(tsp.getShortestRoute(points)).toEqual([1, 3, 0, 2, 4]);
    });

    test('3', () => {
        tsp = new Tsp();
        const points = [
            [40.722868, -73.988469], // 3
            [40.736853, -73.978427], // 1
            [40.717598, -73.991130], // 4
            [40.730934, -73.983019], // 2
            [40.738967, -73.983748], // 0
        ];
        console.log(tsp.getShortestRoute(points));
        expect(tsp.getShortestRoute(points)).toEqual([4, 1, 3, 0, 2]);
    });

    test('4', () => {
        tsp = new Tsp();
        const points = [
            [40.730934, -73.983019], // 2
            [40.738967, -73.983748], // 0
            [40.717598, -73.991130], // 4
            [40.722868, -73.988469], // 3
            [40.736853, -73.978427], // 1
        ];
        console.log(tsp.getShortestRoute(points));
        expect(tsp.getShortestRoute(points)).toEqual([1, 4, 0, 3, 2]);
    });

});


describe('swap function', () => {
    test('array swaps elements correctly', () => {
        const array = [1, 3, 5, 7];
        tsp.swap(array, 0, 3);
        expect(array[3]).toBe(1);
        expect(array[0]).toBe(7);
    });

    test('swap function doesnt crash when empty array is passed in', () => {
        const array = [];
        tsp.swap(array, 0, 3);
    });

    test('swap function doesnt crash when null is passed in', () => {
        const array = null;
        tsp.swap(array, 0, 3);
    });
});

describe('setRecord function', () => {
    test('set record if distance is less than record', () => {
        tsp.population = [0, 1, 2];
        tsp.record = 1000;
        tsp.setRecord(100, 0);
        expect(tsp.record).toBe(100);
    });

    test('do not set record if distance is greater than record', () => {
        tsp.population = [0, 1, 2];
        tsp.record = 100;
        tsp.setRecord(1000, 0);
        expect(tsp.record).toBe(100);
    });

    test('setRecord doesnt crash if null passed in', () => {
        tsp.setRecord(null, null);
    });
});

describe('normalizeDesirability function', () => {
    test('Correctly converts number to percentage', () => {
        tsp.desirability = [0, 5, 2, 3, 5];
        tsp.populationDensity = 5;
        tsp.normalizeDesirability();
        expect(tsp.desirability[1]).toBe(0.3333333333333333);
        expect(tsp.desirability[0]).toBe(0);
        expect(tsp.desirability[3]).toBe(0.2);
    });

});
