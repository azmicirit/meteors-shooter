import React from 'react';
import { View, BackHandler, Dimensions, Text } from 'react-native';
import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import CANNON from 'cannon';

import { LottieAnim, Sound, ButtonIcon, TextIcon, Compass } from './components';
import { PanHelper, PointerLockControl, Explode, Generator, Api } from './helpers';
import { TWEEN } from '../addons';
import { Meteor, Star, Fire, Earth, Sun, Moon, Saturn, Uranus, Venus, Mars } from './objects';

import Styles from './styles/Game';

const N_SPEED = 5;

export default class Game extends React.Component {
    static navigationOptions = {
        header: null,
        gesturesEnabled: false
    };

    constructor(props) {
        super(props);

        this.speed = N_SPEED;
        this.galaxyList = [];
        this.removeList = [];
        this.touchID = 0;
        this.state = {
            pause: false,
            alert: null,
            point: 0,
            hp: 100,
            soundEnabled: props.navigation.state.params.soundEnabled,
            shake: false,
            prevLocation: {
                x: 0,
                y: 0
            },
            fire: {
                color: props.navigation.state.params.fire.color
            },
            dimensions: Dimensions.get('window')
        };
        THREE.suppressExpoWarnings();
    }


    componentWillMount() {
        let self = this;
        this._panResponder = new PanHelper(
            this.onPanResponderGrant.bind(this),
            this.onPanResponderMove.bind(this),
            this.onPanResponderRelease.bind(this)
        );
        this._onContainerLayout = event => {
            self.state.containerDimensions = event.nativeEvent.layout;
        };
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentDidMount() {
        this.MOUNTED = true;
    }

    componentWillUnmount() {
        this.MOUNTED = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    set(state) {
        if (this.MOUNTED) {
            this.setState(state);
        }
    }

    handleBackButton() {
        return true;
    }

    render() {
        let { dimensions, hp, point, pause, styles } = this.state;

        return (
            <View style={Styles.Flex1}>
                <View style={Styles.GameView} onLayout={this._onContainerLayout} {...this._panResponder.panHandlers}>
                    <GraphicsView
                        onContextCreate={this.onContextCreate}
                        onRender={this.onRender}
                        onResize={this.onResize}
                        onShouldReloadContext={this.onShouldReloadContext}
                        ref={ref => (this.glView = ref)}
                    />
                    <TextIcon
                        style={Styles.HpBar}
                        textStyle={Styles.HpBarText}
                        text={hp}
                        imageStyle={Styles.BarIcon}
                        iconSource={'hp'}
                    />
                    <TextIcon
                        style={Styles.PointBar}
                        textStyle={Styles.PointBarText}
                        text={point}
                        imageStyle={Styles.BarIcon}
                        iconSource={'asteroid'}
                    />
                    <ButtonIcon
                        visible={!pause}
                        parentStyle={Styles.AimButton}
                        imageStyle={[Styles.AimButtonImage, { transform: [{ rotate: '0deg' }] }]}
                        iconSource={'aim'}
                        imageStyle1={[Styles.AimButtonImage, { transform: [{ rotate: '0deg' }], opacity: 0.5 }]}
                        iconSource1={'aim_1'}
                        ref={ref => (this.aimIcon = ref)}
                    />
                    <TextIcon
                        style={Styles.BackButton}
                        textStyle={Styles.BackButtonText}
                        text={'Back'}
                        imageStyle={Styles.BackButtonIcon}
                        iconSource={'back'}
                        onTouchStart={this.exit.bind(this)}
                    />
                    <Compass
                        size={dimensions.width / 8}
                        styles={[
                            Styles.Compass, {
                                width: dimensions.width / 8,
                                height: dimensions.width / 8,
                                marginLeft: -dimensions.width / 16
                            }
                        ]}
                        ref={ref => (this.compass = ref)}
                    />
                    <ButtonIcon
                        visible={!pause}
                        parentStyle={Styles.FireButton}
                        imageStyle={[Styles.FireButtonImage, { backgroundColor: 'transparent' }]}
                        iconSource={'laser'}
                        onTouchStart={this.fire.bind(this)}
                        onTouchEnd={this.fireEnd.bind(this)}
                        ref={ref => (this.fireIcon = ref)}
                    />
                    {
                        pause && (
                            <View style={Styles.ResetView}>
                                <LottieAnim source={'rocket'} style={Styles.LoadingRocket} speed={1} />
                                {
                                    this.state.alert && (<Text style={Styles.AlertText}>{this.state.alert}</Text>)
                                }
                                <TextIcon
                                    style={Styles.PointStyle}
                                    textStyle={Styles.PointText}
                                    text={this.state.point}
                                    imageStyle={Styles.PointIcon}
                                    iconSource={'asteroid'} />
                                <TextIcon
                                    style={Styles.ResetStyle}
                                    textStyle={Styles.ResetText}
                                    text={'Play'}
                                    imageStyle={Styles.ResetIcon}
                                    iconSource={'reset'}
                                    onTouchStart={() => { this.start() }} />
                            </View>
                        )
                    }
                </View>
            </View>
        );
    }

    onContextCreate = async ({
        gl,
        canvas,
        width,
        height,
        scale: pixelRatio,
    }) => {
        await this.loadSounds();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 15000);
        this.control = new PointerLockControl(this.camera, this.onCollisionControl.bind(this));
        this.scene.add(this.control.getObject());

        this.cannonInit();
        this.initLights();
        this.initGalaxy();

        this.scene.add(new Star(0.5));
        this.scene.add(new Star(0.75));
        this.scene.add(new Star(1));
        this.scene.add(new Star(1.25));

        // RENDERER
        this.renderer = new ExpoTHREE.Renderer({
            gl,
            canvas,
            width,
            height,
            pixelRatio,
            antialias: true,
            alpha: true
        });
        this.renderer.gammaInput = true;
        this.renderer.gammaInput = true;
        this.renderer.physicallyBasedShading = true;

        this.spawnMeteors();

        this.scanTimer = 0;
    };

    cannonInit() {
        this.world = new CANNON.World();
        this.world.add(this.control.getControlBody());
    }

    initLights() {
        let aLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(aLight);

        let light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(100, 100, -1000);
        this.scene.add(light);
    }

    async initGalaxy() {
        let sun = new Sun();
        await sun.create({ position: new THREE.Vector3(100, 100, -1000), radius: 10 });
        this.galaxyList.push(sun);
        this.scene.add(sun.get());

        let earth = new Earth();
        await earth.create({ position: new THREE.Vector3(0, 0, -800), radius: 50 });
        this.galaxyList.push(earth);
        this.scene.add(earth.get());

        let moon = new Moon();
        await moon.create({ position: new THREE.Vector3(-100, -10, -900), radius: 15 });
        this.galaxyList.push(moon);
        this.scene.add(moon.get());

        let saturn = new Saturn();
        await saturn.create({ position: new THREE.Vector3(1000, 100, 0), radius: 35 });
        this.galaxyList.push(saturn);
        this.scene.add(saturn.get());

        let uranus = new Uranus();
        await uranus.create({ position: new THREE.Vector3(-1000, -50, 0), radius: 15 });
        this.galaxyList.push(uranus);
        this.scene.add(uranus.get());

        let venus = new Venus();
        await venus.create({ position: new THREE.Vector3(0, 150, 1000), radius: 50 });
        this.galaxyList.push(venus);
        this.scene.add(venus.get());

        let mars = new Mars();
        await mars.create({ position: new THREE.Vector3(500, 500, -900), radius: 25 });
        this.galaxyList.push(mars);
        this.scene.add(mars.get());
    }

    async loadSounds() {
        let laserSound = new Sound();
        let explosionSound = new Sound();
        this.sounds = {
            laser: await laserSound.load('laser'),
            explosion: await explosionSound.load('explosion')
        };
    }

    async spawnMeteors() {
        let self = this;

        for (let i = 0; i < 3; i++) {
            self.createMeteor();
        }

        this.spawner = setInterval(() => {
            self.createMeteor();
        }, 1500);
    }

    onResize = ({ width, height, scale }) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(scale);
        this.renderer.setSize(width, height);
    };

    onRender = delta => {
        this.scanTimer += delta;

        this.updateGalaxy();
        this.updateFires();
        this.updateMeteors();
        this.shakeCamera();
        this.removeObjects();

        TWEEN.update();
        this.world.step(1 / 60);
        this.control.update(delta);
        this.renderer.render(this.scene, this.camera);
    };

    updateGalaxy() {
        for (const i in this.galaxyList) {
            this.galaxyList[i].update();
        }
    }

    updateFires() {
        for (let i = 0; i < this.world.bodies.length; i++) {
            let body = this.world.bodies[i];
            if (body.specs && body.specs.type === 'Fire') {
                let mesh = this.scene.getObjectById(body.specs.meshId);
                mesh.position.copy(body.position);
            }
        }
    }

    updateMeteors() {
        let positions = [];

        for (let i = 0; i < this.world.bodies.length; i++) {
            let body = this.world.bodies[i];
            if (body.specs && body.specs.type === 'Meteor') {
                let mesh = this.scene.getObjectById(body.specs.meshId);
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Date.now() / 3000);
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Date.now() / 3000);
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Date.now() / 3000);
                mesh.quaternion.copy(body.quaternion);
                mesh.position.copy(body.position);

                positions.push({
                    id: i,
                    x: body.position.x,
                    y: body.position.y,
                    z: body.position.z,
                    color: body.specs.color
                });
            }
        }

        if (this.scanTimer > 0.5) {
            if (this.compass) {
                this.compass.setPositions(positions);
            }

            this.scanTimer = 0;
        }
    }

    shakeCamera() {
        if (this.state.shake) {
            let noise = ((Math.random() * 4) - 2) * 2;
            this.control.getControlBody().position.set(noise, noise, noise);
        } else {
            this.control.getControlBody().position.set(0, 0, 0);
        }
    }

    removeObjects() {
        for (let i = 0; i < this.removeList.length; i++) {
            const object = this.removeList[i];
            this.world.remove(object.body);
            this.scene.remove(object.mesh);
            if (object.mesh.mesh) {
                object.mesh.mesh.dispose();
            }
            if (object.mesh.texture) {
                object.mesh.texture.dispose();
            }
            if (object.mesh.material) {
                object.mesh.material.dispose();
            }
            if (object.mesh.geometry) {
                object.mesh.geometry.dispose();
            }
        }
        this.removeList = [];

        if (this.state.pause) {
            this.renderer.renderLists.dispose();
        }
    }

    start() {
        this.speed = N_SPEED;

        this.set({
            pause: false,
            point: 0,
            hp: 100,
            alert: null
        });

        this.spawnMeteors();
    }

    stop(save = false) {
        let self = this;

        clearInterval(this.spawner);
        this.removeList = [];

        this.control.getObject().rotation.set(0, 0, 0);

        this.set({
            pause: true
        });

        this.fireIcon.setParentProps({
            backgroundColor: 'transparent'
        });

        this.compass.setRotation(0);

        // CLEAR SCENE
        for (let i = 0; i < this.world.bodies.length; i++) {
            const body = this.world.bodies[i];
            if (body.specs.type === 'Meteor' || body.specs.type === 'Fire') {
                let mesh = this.scene.getObjectById(body.specs.meshId);
                this.removeList.push({
                    body: body,
                    mesh: mesh
                });
            }
        }

        if (save && this.state.point > 0) {
            Api.sendScore(this.state.point, function (result) {
                self.set({
                    alert: result.error ? 'Network Error! Please try again later.' : null
                });
            });
        } else {
            this.set({
                alert: null
            });
        }
    }

    exit() {
        const { navigate } = this.props.navigation;
        this.stop();
        navigate('Main', {});
    }

    // FUNCTIONS
    async createMeteor(velocity = this.speed) {
        let rndPoint = Generator.generateRandomPoint(100);
        let meteor = new Meteor();
        let rnd = meteor.getRandomType();
        await meteor.create({
            level: rnd.level,
            hp: rnd.hp,
            mass: 10000,
            position: new THREE.Vector3(
                rndPoint.x,
                Generator.generateRandomSignedNumber(50, 1),
                rndPoint.y
            ),
            point: rnd.point
        }, this.onCollisionMeteor.bind(this));
        meteor.glow({
            insideColor: rnd.color,
            outsideColor: rnd.color,
        });

        let direction = new THREE.Vector3();
        direction.subVectors(meteor.getBody().position, new THREE.Vector3(0, 0, 0)).normalize();
        meteor.getBody().velocity.set(-direction.x * velocity, -direction.y * velocity, -direction.z * velocity);

        this.world.add(meteor.getBody());
        this.scene.add(meteor.get());
    }

    shoot(velocity = 10) {
        let direction = this.control.getDirection();

        let fire = new Fire();
        fire.create(null, {
            mass: 1,
            radiusTop: 0.01,
            radiusBottom: 0.01,
            height: 0.5,
            radialSegments: 8,
            heightSegments: 8,
        }, this.onCollisionFire.bind(this, fire));
        fire.glow({
            insideColor: this.state.fire.color,
            outsideColor: this.state.fire.color,
        });
        fire.get().quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        fire.getBody().velocity.set(direction.x * velocity, direction.y * velocity, direction.z * velocity);

        let controlBody = this.control.getControlBody();
        let controlShape = this.control.getControlShape();

        let x = direction.x * (controlShape.radius * 1.5) + controlBody.position.x;
        let y = (direction.y - 0.25) * (controlShape.radius * 1.5) + controlBody.position.y;
        let z = direction.z * (controlShape.radius * 1.5) + controlBody.position.z;

        fire.get().position.set(x, y, z);
        fire.getBody().position.set(x, y, z);

        this.world.add(fire.getBody());
        this.scene.add(fire.get());

        setTimeout(() => {
            this.removeList.push({
                body: fire.getBody(),
                mesh: fire.get()
            });
        }, 5000);
    }

    fire() {
        this.fireIcon.setParentProps({
            backgroundColor: '#ff6961'
        });
        this.shoot(100);
        this.sounds.laser.play(this.state.soundEnabled);
    }

    fireEnd() {
        this.fireIcon.setParentProps({
            backgroundColor: 'transparent'
        });
    }

    // COLLISIONS
    onCollisionMeteor(e) {
        if (e.body.specs.type === 'Fire') {
            let mesh = this.scene.getObjectById(e.body.specs.meshId);
            this.removeList.push({
                body: e.body,
                mesh: mesh
            });
        }
    }

    onCollisionFire(fire, e) {
        if (e.body.specs.type === 'Meteor') {
            e.body.specs.hit(fire.getBody().specs.hit);

            // METEOR HP CHECK
            if (e.body.specs.hp <= 0) {
                let mesh = this.scene.getObjectById(e.body.specs.meshId);
                this.removeList.push({
                    body: e.body,
                    mesh: mesh
                });
                let explode = new Explode(this.scene, mesh);
                explode.start();
                this.sounds.explosion.play(this.state.soundEnabled);
                this.set({
                    point: this.state.point + e.body.specs.point
                });

                // SET SPEED
                if (this.state.point > 150) {
                    this.speed = Math.ceil(this.state.point / 50) + 1;
                }
            }
        }
    }

    onCollisionControl(e) {
        let mesh = this.scene.getObjectById(e.body.specs.meshId);
        this.removeList.push({
            body: e.body,
            mesh: mesh
        });

        let explode = new Explode(this.scene, mesh);
        explode.start();
        this.sounds.explosion.play(this.state.soundEnabled);
        this.set({
            hp: this.state.hp - 20,
            shake: true
        });

        setTimeout(() => {
            this.set({
                shake: false
            });
        }, 500);

        // CONTROL HP CHECK
        if (this.state.hp <= 0) {
            this.stop(true);
        }
    }

    // EVENTS
    pausePan(e) {
        return (this.state.pause ||
            e.nativeEvent.target !== this.glView.nativeRef._nativeTag ||
            e.nativeEvent.identifier !== this.touchID);
    }

    onPanResponderGrant(e, gestureState) {
        this.touchID = e.nativeEvent.touches[0].identifier;
        if (this.pausePan(e)) return;

        this.state.prevLocation.x = e.nativeEvent.locationX;
        this.state.prevLocation.y = e.nativeEvent.locationY;
    }

    onPanResponderMove(e, gestureState) {
        if (this.pausePan(e)) return;

        this.aimIcon.setImageProps(
            {
                transform: [{
                    rotate: Math.floor(e.nativeEvent.locationX - this.state.prevLocation.x) * 2 + 'deg'
                }]
            }, {
                transform: [{
                    rotate: Math.floor(-(e.nativeEvent.locationX - this.state.prevLocation.x)) * 2 + 'deg'
                }]
            }
        );

        this.compass.setRotation(THREE.Math.radToDeg(this.control.getObject().rotation.y));

        this.control.setPointerLock(e.nativeEvent.locationX - this.state.prevLocation.x,
            e.nativeEvent.locationY - this.state.prevLocation.y);
        this.state.prevLocation.x = e.nativeEvent.locationX;
        this.state.prevLocation.y = e.nativeEvent.locationY;
    }

    onPanResponderRelease(e, { vx, vy }) {
        if (this.pausePan(e)) return;

        this.compass.setRotation(THREE.Math.radToDeg(this.control.getObject().rotation.y));

        this.control.setPointerLock(e.nativeEvent.locationX - this.state.prevLocation.x,
            e.nativeEvent.locationY - this.state.prevLocation.y);
        this.state.prevLocation.x = e.nativeEvent.locationX;
        this.state.prevLocation.y = e.nativeEvent.locationY;
    }
}