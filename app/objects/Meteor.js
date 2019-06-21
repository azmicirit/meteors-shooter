import CANNON, { Body } from 'cannon';
import { THREE } from 'expo-three';
import { LoaderManager, Generator } from '../helpers';
import { THREEx } from '../../addons';
import Assets from '../assets/Assets';

const meteorTypes = [
    {
        level: 0,
        name: 'yellow',
        hp: 50,
        color: 0xfdfd96,
        point: 5
    },
    {
        level: 1,
        name: 'green',
        hp: 100,
        color: 0x77dd77,
        point: 7
    },
    {
        level: 2,
        name: 'red',
        hp: 150,
        color: 0xff6961,
        point: 9
    },
    {
        level: 3,
        name: 'purple',
        hp: 200,
        color: 0xb19cd9,
        point: 12
    }
];

export default class Meteor {
    getRandomType() {
        let rnd = Generator.generateRandomNumber(Object.keys(Assets.objects).length - 1, 0);
        return meteorTypes[rnd];
    }

    async create(options, collideback) {
        collideback = collideback ? collideback : Function.prototype;

        options.index = Generator.generateRandomNumber(Object.keys(Assets.objects).length, 1);
        options.level = options.level || meteorTypes[0].level;
        options.hp = options.hp || meteorTypes[0].hp;
        options.mass = options.mass || 1;
        options.position = options.position || new THREE.Vector3(0, 0, 0);
        options.point = options.point || meteorTypes[0].point;

        let object = LoaderManager.objects['meteor_' + options.index];
        let texture = LoaderManager.textures['meteor_' + options.index];

        this.geometry = new THREE.Geometry().fromBufferGeometry(object.children[0].geometry);

        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({ map: texture }));
        this.mesh.userData = {
            type: 'Meteor'
        };

        let bbox = new THREE.Box3().setFromObject(this.mesh);
        // this.shape = new CANNON.Box(new CANNON.Vec3((bbox.max.x - bbox.min.x) / 2, (bbox.max.y - bbox.min.y) / 2, (bbox.max.z - bbox.min.z) / 2));
        this.shape = new CANNON.Sphere(Math.max((bbox.max.x - bbox.min.x) / 2, (bbox.max.y - bbox.min.y) / 2, (bbox.max.z - bbox.min.z) / 2));
        this.body = new CANNON.Body({ mass: options.mass });
        this.body.specs = {
            type: 'Meteor',
            level: options.level,
            color: meteorTypes[options.level].color,
            hp: options.hp,
            meshId: this.mesh.id,
            point: options.point,
            hit: this.hit.bind(this)
        };
        this.body.addShape(this.shape);
        this.body.addEventListener('collide', function (e) {
            collideback(e);
        });

        // SET POSITONS
        this.mesh.position.copy(options.position);
        this.body.position.copy(options.position);
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
        this.insideUniforms = insideUniforms;

        let outsideUniforms = glow.outsideMesh.material.uniforms;
        outsideUniforms.glowColor.value.set(new THREE.Color(options.outsideColor));
        outsideUniforms.coeficient.value = options.outsideCoeficient;
        outsideUniforms.power.value = options.outsidePower;
        this.outsideUniforms = outsideUniforms;
    }

    hit(damage) {
        this.body.specs.hp -= damage;
        this.body.specs.level -= 1;

        let color = meteorTypes[this.body.specs.level] ? meteorTypes[this.body.specs.level].color : meteorTypes[0].color;
        this.insideUniforms.glowColor.value.set(new THREE.Color(color));
        this.outsideUniforms.glowColor.value.set(new THREE.Color(color));
        
        this.body.specs.color = color;
    }

    get() {
        return this.mesh;
    }

    getBody() {
        return this.body;
    }
}