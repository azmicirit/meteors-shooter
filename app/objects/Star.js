import { THREE } from 'expo-three';
import { Generator } from '../helpers';

export default class Star {
    constructor(size) {
        let geometry = new THREE.Geometry();
        for (let i = 0; i < 100; i++) {
            let point = new THREE.Vector3();
            point.x = Generator.generateRandomPoint(1200).x;
            point.y = Generator.generateRandomPoint(1200).y;
            point.z = Generator.generateRandomPoint(1200).x;            
            geometry.vertices.push(point);
        }
        let color = new THREE.Color().setRGB(Math.random() * (255 - 170) + 170, Math.random() * (255 - 170) + 170, Math.random() * (255 - 170) + 170);
        let material = new THREE.PointsMaterial({ size: size, sizeAttenuation: false, transparent: true, color: color });
        let star = new THREE.Points(geometry, material);
        star.sortParticles = true;
        return star;
    }
}