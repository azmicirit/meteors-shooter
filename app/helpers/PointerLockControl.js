import CANNON, { Body } from 'cannon';
import { THREE } from 'expo-three';

export default class PointerLockControl {
    constructor(camera, collideback) {
        collideback = collideback ? collideback : Function.prototype;

        let mass = 0, radius = 1.3;
        this.sphereShape = new CANNON.Sphere(radius);
        this.sphereBody = new CANNON.Body({ mass: mass });
        this.sphereBody.addShape(this.sphereShape);
        this.sphereBody.type = Body.KINEMATIC;
        this.sphereBody.updateMassProperties();
        this.sphereBody.aabbNeedsUpdate = true;
        this.sphereBody.position.set(0, 0, 0);
        this.sphereBody.linearDamping = 0.9;
        this.sphereBody.specs = {
            type: 'Control'
        };

        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add(camera);

        this.yawObject = new THREE.Object3D();
        this.yawObject.add(this.pitchObject);
        this.yawObject.position.set(0, 1, 0);

        this.quaternion = new THREE.Quaternion();

        this.movement = {
            velocityFactor: 1,
            forward: false,
            back: false,
            left: false,
            right: false,
            canJump: false
        };

        this.contactNormal = new CANNON.Vec3();
        this.upAxis = new CANNON.Vec3(0, 1, 0);
        this.sphereBody.addEventListener('collide', function (e) {
            collideback(e);
        });

        this.inputVelocity = new THREE.Vector3();
        this.euler = new THREE.Euler();
    }

    getObject() {
        return this.yawObject;
    }

    getControlShape() {
        return this.sphereShape;
    }

    getControlBody() {
        return this.sphereBody;
    }

    getDirection(vector = new THREE.Vector3(0, 0, 0)) {
        let self = this;
        let direction = new THREE.Vector3(0, 0, - 1);
        let rotation = new THREE.Euler(0, 0, 0, "YXZ");

        rotation.set(self.pitchObject.rotation.x, self.yawObject.rotation.y, 0);
        vector.copy(direction).applyEuler(rotation);
        return vector;
    }

    setMovement(object) {
        for (const key in object) {
            this.movement[key] = object[key];
        }
    }

    setPointerLock(x, y, factor = 0.005) {
        this.yawObject.rotation.y -= x * factor;
        this.pitchObject.rotation.x -= y * factor;
        this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));
    }

    update(delta) {
        delta *= 50;
        this.inputVelocity.set(0, 0, 0);

        if (this.movement.forward) {
            this.inputVelocity.z = -this.movement.velocityFactor * delta;
        }

        if (this.movement.back) {
            this.inputVelocity.z = this.movement.velocityFactor * delta;
        }

        if (this.movement.left) {
            this.inputVelocity.x = -this.movement.velocityFactor * delta;
        }

        if (this.movement.right) {
            this.inputVelocity.x = this.movement.velocityFactor * delta;
        }

        // CONVERT VELOCITY TO WORLD COORDINATES
        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = 'XYZ';
        this.quaternion.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quaternion);


        // UPDATE CAMERA'S YAW OBJECT
        this.sphereBody.velocity.x += this.inputVelocity.x;
        this.sphereBody.velocity.z += this.inputVelocity.z;
        this.yawObject.position.copy(this.sphereBody.position);
    }
}