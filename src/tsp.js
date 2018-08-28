export class Tsp {
    constructor() {
        this.pointDist = [];
        this.pointLocations = [];
        this.bestOrder = [];
        this.record = Number.MAX_SAFE_INTEGER;
        this.totalpoints = null;
        this.population = [];
        this.populationDensity = 500;
        this.desirability = [];
        this.chartBestRecords = [];
    }

    getShortestRoute(points) {
        // Sets the this.pointDist array to the passed in value and the total number
        // of points / collection point this.pointDist = points;

        /* Run the create points if you are calculating as the crow flies distance
        from long/lat to generate the required 2d array of distances */
        this.pointLocations = points;
        this.createpoints(points);
        this.totalpoints = this.pointDist[0].length;

        this.initialSetup();

        /* Produces the desired number of generations. For now having it equal the this.population
        density seems to work well. May be changed at a later date to a more optimal solution */
        for (let i = 0; i < (this.totalpoints * 6); i += 1) {
            this.getDesirability();
            this.normalizeDesirability();
            this.nextGeneration();

            this.chartBestRecords[i] = [];
            this.chartBestRecords[i][0] = (`Generation ${i}`);
            this.chartBestRecords[i][1] = this.record * -1;
        }
        this.chartBestRecords.splice(0, 0, ['Generation', 'Record in Meters']);
        // Return the best found order when all the generations have completed
        return (this.bestOrder);
    }

    initialSetup() {
        // Creates a default initial linear order - 0, 1, 2, 3..
        const order = [];
        for (let i = 0; i < this.totalpoints; i += 1) {
            order[i] = i;
        }

        // Shuffles the linear order into the required amount of random arrays to initially
        // fill our this.population with
        for (let i = 0; i < this.populationDensity; i += 1) {
            this.population[i] = order.slice();
            this.shufflePop(this.population[i], 100);
        }
    }

    // Draws chart showing performance of algorithm by generation
    // drawChart() {
    //     const data = google.visualization.arrayToDataTable(this.chartBestRecords);
    //
    //     const options = {
    //         title: 'Algorithm Performance',
    //         curveType: 'function',
    //         legend: { position: 'bottom' }
    //     };
    //
    //     const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    //
    //     chart.draw(data, options);
    // }

    /* to create a 2d array, each array element representing a point's location using Lat/Long (as
    the crow flies) and this distance between itself and every point in the order, inclusively. */
    createpoints() {
        for (let i = 0; i < this.pointLocations.length; i += 1) {
            this.pointDist[i] = [];
            for (let j = 0; j < this.pointLocations.length; j += 1) {
                this.pointDist[i][j] = this.latDist(
                    this.pointLocations[i][0],
                    this.pointLocations[i][1],
                    this.pointLocations[j][0],
                    this.pointLocations[j][1],
                );
            }
        }
    }

    // Finds the total distance of a given order
    findTotalDistance(points, order) {
        // Steps through the array of points adding distance between each point based on the order
        let totalDistance = 0;
        for (let i = 0; i < this.totalpoints - 1; i += 1) {
            const pointIndexA = order[i];
            const pointIndexB = order[i + 1];
            const pointLocationA = Number(points[pointIndexA][pointIndexA]);
            const pointLocationB = Number(points[pointIndexB][pointIndexA]);
            const distance = pointLocationA + pointLocationB;
            totalDistance += distance;
        }
        // Return the total distance
        return totalDistance;
    }

    /* Credit to http:// www.movable-type.co.uk/scripts/latlong.html for the algorithm, slightly modified to fit our purposes
    Find the distance between two points given their lognitudinal and latitudinal coordinates */
    latDist(lat1, lon1, lat2, lon2) {
        const R = 6371; //  Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1); // this.deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1))
            * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; //  Distance in meters
    }

    // Converts degrees to radians
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Simple shuffle to mix around the this.population
    shufflePop(pop, numTimes) {
        for (let i = 0; i < numTimes; i += 1) {
            const indexA = Math.floor(Math.random() * pop.length);
            const indexB = Math.floor(Math.random() * pop.length);
            this.swap(pop, indexA, indexB);
        }
    }

    // Simple swap function
    swap(array, index1, index2) {
        if (array && array.length) {
            const temp = array[index1];
            array[index1] = array[index2];
            array[index2] = temp;
        }
    }

    setRecord(distance, index) {
        if (distance < this.record) {
            this.record = distance;
            this.bestOrder = this.population[index];
        }
    }

    //  Calculates the desirability for every population distribution
    getDesirability() {
        for (let i = 0; i < this.populationDensity; i += 1) {
            const distance = this.findTotalDistance(this.pointDist, this.population[i]);
            // Sets record to the shortest distance and bestOrder to the population spwaned it
            this.setRecord(distance, i);
            // Puts number to the power 12 to exacerbate the difference between good and bad gens
            this.desirability[i] = 1 / ((distance ** 12) + 1);
        }
    }

    // Turns the desirability values into the percentage of the total desirability
    normalizeDesirability() {
        // Adds up all of the this.desirability values
        let sum = 0;
        for (let i = 0; i < this.populationDensity; i += 1) {
            sum += this.desirability[i];
        }
        // Transforms each value into it's relevant percentage of the total desirability
        for (let i = 0; i < this.populationDensity; i += 1) {
            this.desirability[i] = this.desirability[i] / sum;
        }
    }

    // Creates a cross over of two arrays of orders
    crossOver(orderA, orderB) {
        /* Generates a random start and end point, ensuring that the end is after the start. .slice
        makes it so we can go passed the last index of the order without getting an error. */
        const start = Math.floor(Math.random() * orderA.length);
        const end = Math.floor((Math.random() * orderA.length) + (start + 1));
        const newOrder = orderA.slice(start, end);
        // Add all the elements in from B as long as they're not already in A
        for (let i = 0; i < orderB.length; i += 1) {
            const point = orderB[i];
            if (!newOrder.includes(point)) {
                newOrder.push(point);
            }
        }
        // Return the newly created order
        return newOrder;
    }

    // Creates the next generation of the this.population
    nextGeneration() {
        const newPopulation = [];
        for (let i = 0; i < this.population.length; i += 1) {
            // Gets two of the best populations and then crosses them over
            const orderA = this.chooseDesirable(this.population, this.desirability);
            const orderB = this.chooseDesirable(this.population, this.desirability);
            const order = this.crossOver(orderA, orderB);
            // Mutate at a rate of 8.5%
            this.mutate(order, 0.085);
            newPopulation[i] = order;
        }
        this.population = newPopulation;
    }

    // Picks a random number 0 - 1 and starts subtracting desirability
    chooseDesirable(list) {
        let index = 0;
        let r = Math.random(1);
        // While r is still a positive number, keep subtracting the next this.desirability index
        while (r > 0) {
            r -= this.desirability[index];
            index += 1;
        }
        // Compensates for the final unnecessary index increment
        index -= 1;
        // Return the desirability that caused r to go negative
        return list[index].slice();
    }

    // Mutates a given order by a given % mutation rate
    mutate(order, mutationRate) {
        for (let i = 0; i < this.totalpoints; i += 1) {
            // in mutationRate % of cases this happens
            if (Math.random(1) < mutationRate) {
                // Swaps two random elements in the array
                const indexA = Math.floor(Math.random() * this.totalpoints);
                const indexB = (indexA + 1) % this.totalpoints;
                this.swap(order, indexA, indexB);
            }
        }
    }
}
