import * as THREE from 'three';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now(); //current time
const velocity = new THREE.Vector3(); //velocity in 3 directions
const directions = new THREE.Vector3(); //directions 

let camera,scene, renderer, controls;
init();
animate();

function init(){ //initialize
     scene = new THREE.Scene();
     camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,1,1000);
     camera.position.y = 10;

     controls = new PointerLockControls(camera,document.body);

     const blocker = document.getElementById('blocker');
     const instructions = document.getElementById('instructions');

     instructions.addEventListener('click',function(){
        controls.lock();
     });
     controls.addEventListener('lock',function(){
        instructions.style.display = 'none';
        blocker.style.display = 'none';
     });
     controls.addEventListener('unlock',function(){
        blocker.style.display = 'block';
        instructions.style.display = '';
     });
     scene.add(controls.getObject());

     const onKeyDown = function(event){
        switch(event.code){
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 350
                canJump = false;
                break;
        }
     }

     const onKeyUp = function(event){
        switch(event.code){
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
        }
     }
     document.addEventListener('keydown',onKeyDown)
     document.addEventListener('keyup',onKeyUp)

     raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0),0,10)

    const light = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(light);

    const sun = new THREE.PointLight(0xffffff, 200000);
    sun.position.set(0, 200, 0);
    scene.add(sun);

    const geometry1 = new THREE.PlaneGeometry(1000, 1000, 5);
    const material1 = new THREE.MeshLambertMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(geometry1,material1);
    plane.rotateX(-1.57)
    scene.add(plane)
    objects.push(plane)

    const geometry2 = new THREE.TorusGeometry(10, 3, 64, 64);
    const material2 = new THREE.MeshLambertMaterial({color: 0x4da6ff});
    const torus1 = new THREE.Mesh(geometry2,material2);
    torus1.rotateX(-1.57)
    torus1.position.set(30, 15, 10);
    scene.add(torus1)
    objects.push(torus1)

    const geometry3 = new THREE.BoxGeometry(20, 20, 1);
    const material3 = new THREE.MeshLambertMaterial({color: 0x4da6ff});
    const box1 = new THREE.Mesh(geometry3,material3);
    box1.rotateX(-1.57)
    box1.position.set(30, 210, 10)
    scene.add(box1)
    objects.push(box1)

    const geometry4 = new THREE.BoxGeometry(20, 20, 1);
    const material4 = new THREE.MeshLambertMaterial({color: 0x4da6ff});
    const box2 = new THREE.Mesh(geometry4,material4);
    box2.rotateX(-1.57)
    box2.position.set(-75, 210, 10)
    scene.add(box2)
    objects.push(box2)

    const geometry5 = new THREE.CapsuleGeometry(20, 20, 1);
    const material5 = new THREE.MeshLambertMaterial({color: 0x4da6ff});
    const box3 = new THREE.Mesh(geometry4,material4);
    box3.rotateX(-1.57)
    box3.position.set(-17, 80, 10)
    scene.add(box3)
    objects.push(box3)

    renderer = new THREE.WebGLRenderer({antialias:true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

     window.addEventListener('resize',onWindowResize)
  }

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth,window.innerHeight)
}

function animate(){
    requestAnimationFrame( animate )
    const time = performance.now();

    if(controls.isLocked === true){
        raycaster.ray.origin.copy(controls.getObject().position)
        raycaster.ray.origin.y -= 10

        const intersections = raycaster.intersectObjects(objects,false)
        const onObject = intersections.length > 0
        const delta = (time - prevTime) / 1000

        velocity.x -= velocity.x * 10.0 * delta
        velocity.z -= velocity.z * 10.0 * delta

        velocity.y -= 9.8 * 100.0 * delta

        directions.z = Number(moveForward) - Number(moveBackward)
        directions.x = Number(moveRight) - Number(moveLeft)
        directions.normalize()

        if(moveForward || moveBackward) velocity.z -= directions.z * 400.0 * delta
        if(moveLeft || moveRight) velocity.x -= directions.x * 400.0 * delta

        if(onObject == true){
            velocity.y = Math.max(0,velocity.y)
            canJump = true;
        }

        controls.moveRight(-velocity.x * delta)
        controls.moveForward(-velocity.z * delta)

        controls.getObject().position.y += (velocity.y * delta)

        if(controls.getObject().position.y < 10){
            velocity.y = 0
            controls.getObject().position.y = 10
            canJump = true
        }
    }
    prevTime = time
    renderer.render(scene, camera)
}