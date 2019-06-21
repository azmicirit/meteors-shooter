import { THREE } from 'expo-three';
import { LoaderManager } from '../helpers';
import { TWEEN } from '../../addons';

export default class Explode {
    constructor(scene, object) {
        this.particleArray = [];
        this.scene = scene;
        this.object = object;
        return this;
    }

    async start(callback) {
        callback = callback ? callback : Function.prototype;
        
        let geometry = new THREE.Geometry();
        for (let i = 0; i < 30; i++) {
            let point = new THREE.Vector3();
            point.x = THREE.Math.randFloatSpread(1);
            point.y = THREE.Math.randFloatSpread(1);
            point.z = THREE.Math.randFloatSpread(1);
            geometry.vertices.push(point);
        }

        let particleImage = LoaderManager.textures['fraction_1'];
        let colorArray = [0xfabe82, 0xe03809, 0xee9c64, 0x910300];
        var sizeArray = [0.5, 0.5, 0.5, 0.5, 0.75];

        for (let i = 0; i < 10; ++i) {

            let color = colorArray[i % colorArray.length];
            let size = sizeArray[i % sizeArray.length];

            let particleMaterial = new THREE.PointsMaterial({
                color: color, size: size, map: particleImage, opacity: 1.0, transparent: true, depthTest: false, blending: THREE.AdditiveBlending
            });
            particles = new THREE.Points(geometry, particleMaterial);

            particles.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            particles.position.copy(this.object.position);            
            particles.scale.set(0.1, 0.1, 0.1);
            particles.visible = false;

            this.scene.add(particles);
            this.particleArray.push({ p: particles, m: particleMaterial });
        }

        this.explode(callback);
    }

    explode(callback) {
        callback = callback ? callback : Function.prototype;
        
        let particleArray = this.particleArray;
        let scene = this.scene;
        this.object.visible = false;
        
        for (let i = 0; i < particleArray.length; ++i) {
            let particles = particleArray[i].p;
            let material = particleArray[i].m;

            particles.visible = true;

            let scaletween = new TWEEN.Tween(particles.scale).to({ x: 25, y: 25, z: 25 }, 1000).easing(TWEEN.Easing.Quadratic.Out);
            scaletween.start();

            let alphatween = new TWEEN.Tween(material).to({ opacity: 0 }, 1000).easing(TWEEN.Easing.Quadratic.Out);
            alphatween.start();

            let rotatetween = new TWEEN.Tween(particles.rotation).to({ x: particles.rotation.x + 0.05, y: particles.rotation.y + 0.05, z: particles.rotation.z + 0.05 }, 1000).easing(TWEEN.Easing.Quadratic.Out);
            rotatetween.start();

            let positiontween = new TWEEN.Tween(particles.position).to({ x: particles.position.x + Math.random() * 20 - 10, y: particles.position.y + Math.random() * 20 - 10, y: particles.position.y + Math.random() * 20 - 10 }, 1000).easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                    scene.remove(particles);
                    particles.material.dispose();
                    particles.geometry.dispose();               
                    callback(null);
                })
            positiontween.start();
        }
    }
}