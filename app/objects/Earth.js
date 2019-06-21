import CANNON from 'cannon';
import { THREE } from 'expo-three';
import { LoaderManager } from '../helpers';
import { SHADERS } from '../../addons';

export default class Earth {
    async create(options) {
        options.position = options.position || new THREE.Vector3(0, 0, 0);
        options.cameraPosition = options.cameraPosition || new THREE.Vector3(0, 0, 0);
        options.radius = options.radius || 1;
        options.widthSegments = options.widthSegments || 32;
        options.heightSegments = options.heightSegments || 32;

        this.geometry = new THREE.SphereGeometry(options.radius, options.widthSegments, options.heightSegments);
        this.material = new THREE.MeshPhongMaterial({
            map: LoaderManager.textures['earth'],
            specularMap: LoaderManager.textures['earth_s']
        });
        this.material.specular = new THREE.Color('grey');

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.userData = {
            type: 'Earth'
        };

        let cloudGeometry = new THREE.SphereGeometry(options.radius + 0.01, options.widthSegments, options.heightSegments);
        let cloudMaterial = new THREE.MeshPhongMaterial({
            alphaMap: LoaderManager.textures['earth_cloud'],
            blending: 1,
            transparent: true,
            opacity: 0.2,
            depthTest: false,
        });
        let cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.mesh.add(cloudMesh);
        this.cloudMesh = cloudMesh;

        this.mesh.position.copy(options.position);
        this.mesh.rotation.z = 0.1;

        let glowMaterial = new THREE.ShaderMaterial({
			uniforms: {
                alpha: { type: "f", value: 0.3 },
                force: { type: "f", value: 6 },
                glowVec3: { type: "v3", value: new THREE.Vector3(1, 1, 1) },
				viewVector: { type: "v3", value: options.cameraPosition }
			},
			vertexShader: SHADERS.glowVertex,
			fragmentShader: SHADERS.glowFragment,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		});

		let glowGeometry = new THREE.SphereGeometry(options.radius * 2, options.widthSegments, options.heightSegments);
		let glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
		this.mesh.glow = glowMesh;
		this.mesh.add(glowMesh);

		this.cameraPosition = options.cameraPosition;
    }

    update() {
        let viewVector = new THREE.Vector3().subVectors(this.cameraPosition, this.mesh.glow.getWorldPosition());
        this.mesh.glow.material.uniforms.viewVector.value = viewVector;
		this.mesh.rotation.y += 0.001;
		this.cloudMesh.rotation.x += 0.0002;
		this.cloudMesh.rotation.y += 0.002;
    }

    get() {
        return this.mesh;
    }
}
