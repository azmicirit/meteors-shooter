import CANNON from 'cannon';
import { THREE } from 'expo-three';
import { LoaderManager } from '../helpers';
import { SHADERS } from '../../addons';

export default class Saturn {
    async create(options) {
        options.position = options.position || new THREE.Vector3(0, 0, 0);
        options.cameraPosition = options.cameraPosition || new THREE.Vector3(0, 0, 0);
        options.radius = options.radius || 1;
        options.widthSegments = options.widthSegments || 32;
        options.heightSegments = options.heightSegments || 32;

        this.geometry = new THREE.SphereGeometry(options.radius, options.widthSegments, options.heightSegments);
        this.material = new THREE.MeshPhongMaterial({
            map: LoaderManager.textures['saturn'],
            bumpMap: LoaderManager.textures['saturn'],
            bumpScale: 0.05
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.userData = {
            type: 'Saturn'
        };

        this.mesh.position.copy(options.position);
        this.mesh.rotation.z = 0.1;

        let glowMaterial = new THREE.ShaderMaterial({
			uniforms: {
                alpha: { type: "f", value: 0.3 },
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

        this.createRing(300);
    }

    createRing(n) {
        let thetas = new Float32Array(n);
        let delayX = new Float32Array(n);
        let delayZ = new Float32Array(n);

        for (i = 0; i < n; i++) {
            let theta = Math.random() * 2 * Math.PI;
            thetas[i] = theta;
            delayX[i] = (Math.random() - 0.5) * 80;
            delayZ[i] = (Math.random() - 0.5) * 30;
        }

        let internalRingGeometry = new THREE.BufferGeometry();
        let externalRingGeometry = new THREE.BufferGeometry();
        internalRingGeometry.addAttribute('base_angle', new THREE.BufferAttribute(thetas, 1))
            .addAttribute('offsetX', new THREE.BufferAttribute(delayX, 1))
            .addAttribute('offsetZ', new THREE.BufferAttribute(delayZ, 1))
            .addAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
        externalRingGeometry = internalRingGeometry.clone();

        let internalRingMaterial = new THREE.ShaderMaterial({
            uniforms: internalRingUniforms = {
                time: { value: 100.0 },
                stretch: { value: new THREE.Vector3(190, 30, 135) },
                shadowType: { value: 1.0 }
            },
            vertexShader: SHADERS.saturnRingVertex,
            fragmentShader: SHADERS.saturnRingFragment,
        });

        let externalRingMaterial = new THREE.ShaderMaterial({
            uniforms: externalRingUniforms = {
                time: { value: 100.0 },
                stretch: { value: new THREE.Vector3(290, 40, 180) },
                shadowType: { value: 1.0 }
            },
            vertexShader: SHADERS.saturnRingVertex,
            fragmentShader: SHADERS.saturnRingFragment,
        });

        let internalRing = new THREE.Points(externalRingGeometry, internalRingMaterial);
        let externalRing = new THREE.Points(internalRingGeometry, externalRingMaterial);
        this.mesh.add(internalRing);
        this.mesh.add(externalRing);
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
