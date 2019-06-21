import CANNON from 'cannon';
import { THREE } from 'expo-three';
import { THREEx } from '../../addons';

export default class Fire {
    async create(material, options, collideback) {
        collideback = collideback ? collideback : Function.prototype;

        options.position = options.position || new THREE.Vector3(0, 0, 0);
        options.hit = options.hit || 50;
        options.mass = options.mass || 1;
        options.radiusTop = options.radiusTop || 1;
        options.radiusBottom = options.radiusBottom || 1;
        options.height = options.height || 1;
        options.radialSegments = options.radialSegments || 1;
        options.heightSegments = options.heightSegments || 1;
        options.openEnded = options.openEnded || false;
        options.thetaStart = options.thetaStart || false;
        options.thetaLength = options.thetaLength || 2 * Math.PI;

        this.geometry = new THREE.CylinderGeometry(options.radiusTop, options.radiusBottom, options.height, options.radialSegments, options.heightSegments,
            options.openEnded, options.thetaStart, options.thetaLength);
        this.material = material ? material : new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.userData = {
            type: 'Fire'
        };

        this.mesh.position.copy(options.position);

        this.shape = new CANNON.Cylinder(options.radiusTop, options.radiusBottom, options.height, options.radialSegments * options.heightSegments);
        this.body = new CANNON.Body({ mass: options.mass });
        this.body.specs = {
            type: 'Fire',
            hit: options.hit,
            meshId: this.mesh.id
        };
        this.body.addShape(this.shape);
        this.body.addEventListener('collide', function (e) {
            collideback(e);
        });
    }

    glow(options) {
        options = options ? options : {};
        options.insideColor = options.insideColor || 0xffffff;
        options.insideCoeficient = options.insideCoeficient || 1.1;
        options.insidePower = options.insidePower || 1.4;
        options.outsideColor = options.outsideColor || 0xffffff;
        options.outsideCoeficient = options.outsideCoeficient || 0.1;
        options.outsidePower = options.outsidePower || 1.2;

        let glow = new THREEx.GeometricGlowMesh(this.mesh);
        this.mesh.add(glow.object3d);

        let insideUniforms = glow.insideMesh.material.uniforms;
        insideUniforms.glowColor.value.set(new THREE.Color(options.insideColor));
        insideUniforms.coeficient.value = options.insideCoeficient;
        insideUniforms.power.value = options.insidePower;

        let outsideUniforms = glow.outsideMesh.material.uniforms;
        outsideUniforms.glowColor.value.set(new THREE.Color(options.outsideColor));
        outsideUniforms.coeficient.value = options.outsideCoeficient;
        outsideUniforms.power.value = options.outsidePower;
    }

    get() {
        return this.mesh;
    }

    getBody() {
        return this.body;
    }
}
