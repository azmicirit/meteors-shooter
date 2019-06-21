import CANNON from 'cannon';
import { THREE } from 'expo-three';
import { LoaderManager } from '../helpers';
import { SHADERS } from '../../addons';

export default class Moon {
    async create(options) {
        options.position = options.position || new THREE.Vector3(0, 0, 0);
        options.cameraPosition = options.cameraPosition || new THREE.Vector3(0, 0, 0);
        options.radius = options.radius || 1;
        options.widthSegments = options.widthSegments || 32;
        options.heightSegments = options.heightSegments || 32;

        this.geometry = new THREE.SphereGeometry(options.radius, options.widthSegments, options.heightSegments);
        this.material = new THREE.MeshPhongMaterial({
            map: LoaderManager.textures['moon'],
            bumpMap: LoaderManager.textures['moon_b'],
            bumpScale: 0.002
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.userData = {
            type: 'Moon'
        };

        this.mesh.position.copy(options.position);
        this.mesh.rotation.z = 0.1;

        let glowMaterial = new THREE.ShaderMaterial({
			uniforms: {
                alpha: { type: "f", value: 0.7 },
                force: { type: "f", value: 2 },
                glowVec3: { type: "v3", value: new THREE.Vector3(1, 1, 1) },
				viewVector: { type: "v3", value: options.cameraPosition }
			},
			vertexShader: SHADERS.glowVertex,
			fragmentShader: SHADERS.glowFragment,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		});

		let glowGeometry = new THREE.SphereGeometry(options.radius * 1.5, options.widthSegments, options.heightSegments);
		let glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
		this.mesh.glow = glowMesh;
		this.mesh.add(glowMesh);

		this.cameraPosition = options.cameraPosition;
    }

    update() {
        let viewVector = new THREE.Vector3().subVectors(this.cameraPosition, this.mesh.glow.getWorldPosition());
        this.mesh.glow.material.uniforms.viewVector.value = viewVector;
        this.mesh.rotation.x += 0.0001;
		this.mesh.rotation.y += 0.001;
    }

    get() {
        return this.mesh;
    }
}
