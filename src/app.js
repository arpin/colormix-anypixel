
var fs = require('fs');
var anypixel = require('anypixel');
var THREE = require('three');
var Time = require('./Time.js');

var options = {
    shaderMaterials: [],
    currentShader: 0,
    changeShaderCb: null,
};

document.addEventListener('onButtonDown', function(event) {
    let corner = (event.detail.x == 0 || event.detail.x == anypixel.config.width - 1) &&
                (event.detail.y == 0 || event.detail.y == anypixel.config.height - 1);
    let edge = event.detail.x == 0 || event.detail.x == anypixel.config.width - 1 ||
                event.detail.y == 0 || event.detail.y == anypixel.config.height - 1;
    let leftside = (event.detail.x < anypixel.config.width / 2.0);

    options.currentShader = (options.currentShader+1)%options.shaderMaterials.length;
    options.changeShaderCb(options.shaderMaterials[options.currentShader]);
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
    options.shaderMaterials.push(
        new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: fs.readFileSync(__dirname + '/colormix/vert.glsl', 'utf8'),
            fragmentShader: fs.readFileSync(__dirname + '/colormix/frag.glsl', 'utf8')
        })
    );
    options.shaderMaterials.push(
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

    var scene = new THREE.Scene();
    var quadGeo = new THREE.Geometry();
    quadGeo.vertices.push(new THREE.Vector3(0.0, 0.0, 0.0));
    quadGeo.vertices.push(new THREE.Vector3(1.0, 0.0, 0.0));
    quadGeo.vertices.push(new THREE.Vector3(1.0, 1.0, 0.0));
    quadGeo.vertices.push(new THREE.Vector3(0.0, 1.0, 0.0)); 
    quadGeo.faces.push(new THREE.Face3(0, 1, 2)); 
    quadGeo.faces.push(new THREE.Face3(0, 2, 3));

    var mesh = new THREE.Mesh(quadGeo, options.shaderMaterials[options.currentShader]);
	mesh.position.set(0, 0, 0);
    mesh.scale.set(anypixel.config.width,anypixel.config.height,1); // the quad should fill the whole screen
    scene.add(mesh);
    options.changeShaderCb = function(shaderMaterial) {
        mesh.material = shaderMaterial;
    };

    var update = function () {
        uniforms.time.value = Time.time;
    };

    Time.init();
    var gameloop = function () {
        Time.update();
        update();
        renderer.clear();
        renderer.render(scene, camera);

        window.requestAnimationFrame(gameloop);
    };
	window.requestAnimationFrame(gameloop);
});
