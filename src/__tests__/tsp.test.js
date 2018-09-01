import Tsp from '../tsp';

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
        Tsp.swap(array, 0, 3);
        expect(array[3]).toBe(1);
        expect(array[0]).toBe(7);
    });

    test('swap function doesnt crash when empty array is passed in', () => {
        const array = [];
        Tsp.swap(array, 0, 3);
    });

    test('swap function doesnt crash when null is passed in', () => {
        const array = null;
        Tsp.swap(array, 0, 3);
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

describe('shufflePop function', () => {
    test('array changes after swapping', () => {
        const array = [0, 1, 2, 3, 4, 5];

        expect(Tsp.shufflePop(array, 1)).not.toEqual(array);
    });
    test('calls swap method number of specified times', () => {
        const array = [0, 1, 2, 3, 4, 5];
        Tsp.swap = jest.fn();

        Tsp.shufflePop(array, 10);
        expect(Tsp.swap).toHaveBeenCalledTimes(10);
    });
    test('calls swap method with array passed in', () => {
        const array = [0];
        Tsp.swap = jest.fn();

        Tsp.shufflePop(array, 1);
        expect(Tsp.swap).toHaveBeenCalledWith(array, 0, 0);
    });
});

describe('createLinearArray function', () => {
    test('returns array from 0 to passed in value', () => {
        const array0 = [0];
        const array3 = [0, 1, 2, 3];
        const array7 = [0, 1, 2, 3, 4, 5, 6, 7];
        const array11 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        expect(Tsp.createLinearArray(0)).toEqual(array0);
        expect(Tsp.createLinearArray(3)).toEqual(array3);
        expect(Tsp.createLinearArray(7)).toEqual(array7);
        expect(Tsp.createLinearArray(11)).toEqual(array11);
    });
});

describe('initialSetup function', () => {
    test('createLinearArray is called  this.totalpoints number of times', () => {
        tsp.populationDensity = 0;
        tsp.totalpoints = 10;
        Tsp.createLinearArray = jest.fn();

        tsp.initialSetup();

        expect(Tsp.createLinearArray).toHaveBeenCalledTimes(10);
    });
    test('each population is shuffled', () => {
        tsp.populationDensity = 5;
        tsp.totalpoints = 4;
        tsp.population = [
            [0, 1, 2, 3, 4],
            [0, 1, 2, 3, 4],
            [0, 1, 2, 3, 4],
            [0, 1, 2, 3, 4],
            [0, 1, 2, 3, 4],
        ];
        Tsp.shufflePop = jest.fn();

        tsp.initialSetup();

        expect(Tsp.shufflePop).toHaveBeenCalledTimes(5);
    });
});
