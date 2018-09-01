import Tsp from './tsp';

const temp = new Tsp();

// Output should be 0, 2, 4, 1, 3    (or the reverse)
const points = [
    [40.738967, -73.983748],
    [40.722868, -73.988469],
    [40.736853, -73.978427],
    [40.717598, -73.991130],
    [40.730934, -73.983019],
];

temp.getShortestRoute(points);
