export default class Generator {
    static generateRandomNumber(max = 100, min = 1) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static generateRandomSignedNumber(max = 100, min = 1) {
        let factor = Math.floor(Math.random() * 10 % 2) === 0 ? 1 : -1;
        return Math.floor(Math.random() * (max - min + 1) + min) * factor;
    }

    static generateRandomPoint(radius = 1) {
        let angle = Math.random()*Math.PI*2;
        return {
            x: Math.cos(angle)*radius,
            y: Math.sin(angle)*radius
        }
    }
}