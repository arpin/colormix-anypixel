
var fs = require('fs');
var anypixel = require('anypixel');
var THREE = require('three');
var Time = require('./Time.js');

var app = {
    shaders: [],
    transition: 0.0,
    transitionTarget: 0.5
};

document.addEventListener('onButtonDown', function(event) {
    let corner = (event.detail.x == 0 || event.detail.x == anypixel.config.width - 1) &&
                (event.detail.y == 0 || event.detail.y == anypixel.config.height - 1);
    let edge = event.detail.x == 0 || event.detail.x == anypixel.config.width - 1 ||
                event.detail.y == 0 || event.detail.y == anypixel.config.height - 1;
    let leftside = (event.detail.x < anypixel.config.width / 2.0);

    app.transitionTarget = (1.0*event.detail.x) / anypixel.config.width;
});

document.addEventListener('DOMContentLoaded', function() {
    var renderer = new THREE.WebGLRenderer({context: anypixel.canvas.getContext3D()});
    renderer.autoClear = false;
    renderer.setSize(anypixel.config.width, anypixel.config.height);
    renderer.setClearColor(0x000000);

	var uniforms = {
		resolution: { value: new THREE.Vector3(anypixel.config.width, anypixel.config.height, 1.0) },
        time: { value: 0.0 },
    };
    app.shaders.push(
        new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: fs.readFileSync(__dirname + '/colormix/vert.glsl', 'utf8'),
            fragmentShader: fs.readFileSync(__dirname + '/colormix/frag.glsl', 'utf8')
        })
    );
    app.shaders.push(
        new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: fs.readFileSync(__dirname + '/pointlights/vert.glsl', 'utf8'),
            fragmentShader: fs.readFileSync(__dirname + '/pointlights/frag.glsl', 'utf8')
        })
    );

    var camera = new THREE.OrthographicCamera(0, anypixel.config.width, anypixel.config.height, 0, 0, 200);
    camera.position.set(0,0,100);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(0,0,0));

    var quadGeo = new THREE.Geometry();
    quadGeo.vertices.push(new THREE.Vector3(0.0, 0.0, 0.0));
    quadGeo.vertices.push(new THREE.Vector3(1.0, 0.0, 0.0));
    quadGeo.vertices.push(new THREE.Vector3(1.0, 1.0, 0.0));
    quadGeo.vertices.push(new THREE.Vector3(0.0, 1.0, 0.0)); 
    quadGeo.faces.push(new THREE.Face3(0, 1, 2));
    quadGeo.faces.push(new THREE.Face3(0, 2, 3));

    var bufferScene1 = new THREE.Scene();
    var buffer1 = new THREE.WebGLRenderTarget(
        anypixel.config.width, anypixel.config.height,
        { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
    );
    var bufferMesh1 = new THREE.Mesh(quadGeo, app.shaders[0]);
	bufferMesh1.position.set(0, 0, 0);
    bufferMesh1.scale.set(anypixel.config.width,anypixel.config.height,1); // the quad should fill the whole screen
    bufferScene1.add(bufferMesh1);

    var bufferScene2 = new THREE.Scene();
    var buffer2 = new THREE.WebGLRenderTarget(
        anypixel.config.width, anypixel.config.height,
        { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
    );
    var bufferMesh2 = new THREE.Mesh(quadGeo, app.shaders[1]);
	bufferMesh2.position.set(0, 0, 0);
    bufferMesh2.scale.set(anypixel.config.width,anypixel.config.height,1); // the quad should fill the whole screen
    bufferScene2.add(bufferMesh2);

    var transitionUniforms = {
		resolution: { value: new THREE.Vector3(anypixel.config.width, anypixel.config.height, 1.0) },
        transition: { value: 0.5 },
        buffer1: { value: buffer1.texture },
        buffer2: { value: buffer2.texture },
    };
    var transitionShader = new THREE.ShaderMaterial( {
        uniforms: transitionUniforms,
        vertexShader: fs.readFileSync(__dirname + '/transition/vert.glsl', 'utf8'),
        fragmentShader: fs.readFileSync(__dirname + '/transition/frag.glsl', 'utf8')
    });

    var scene = new THREE.Scene();
    var mesh = new THREE.Mesh(quadGeo, transitionShader);
	mesh.position.set(0, 0, 0);
    mesh.scale.set(anypixel.config.width,anypixel.config.height,1); // the quad should fill the whole screen
    scene.add(mesh);

    var update = function () {
        uniforms.time.value = Time.time;

        if (app.transitionTarget-0.01 > app.transition || app.transition > app.transitionTarget+0.01) {
            app.transition += (app.transitionTarget-app.transition)*Time.deltaTime;
        }
        transitionUniforms.transition.value = app.transition;

        // shader transition
        // if transition == 0.0
        // render new shader into buffer2
        // start increasing transition value
        // when done, set transition to 0.0 and set buffer1 to buffer2's texture
    };

    Time.init();
    var gameloop = function () {
        Time.update();
        update();
        renderer.clear();
        renderer.render(bufferScene1, camera, buffer1);
        renderer.render(bufferScene2, camera, buffer2);
        renderer.render(scene, camera);

        window.requestAnimationFrame(gameloop);
    };
	window.requestAnimationFrame(gameloop);
});
