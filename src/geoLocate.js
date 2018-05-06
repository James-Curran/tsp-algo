export class GeoLocate {

    constructor() {
        this.latLongValues = [];
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    showPosition(position) {

        this.latLongValues[0] = position.coords.latitude;
        this.latLongValues[1] = position.coords.longitude;

    }

    getLocationArray(){
        return this.latLongValues;
    }
}

