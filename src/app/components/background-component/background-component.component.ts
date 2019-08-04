import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
import { StandardMaterial, Texture, PlayAnimationAction } from 'babylonjs';
import { BackgroundModel } from '../../model/background-model/background-model';
import { BackgroundServiceService, MyLoadingScreen } from '../../service/background-service.service';
import { SharedServiceService } from 'src/app/service/shared-service.service';
@Component({
  selector: 'app-background-component',
  templateUrl: './background-component.component.html',
  styleUrls: ['./background-component.component.css']
})
export class BackgroundComponentComponent implements AfterViewInit {


  @ViewChild('renderCanvas',{static: false}) renderCanvas:ElementRef;
  @ViewChild('creditText',{static: false}) creditText:ElementRef;
  xAxis: BABYLON.Vector3;
  yAxis: BABYLON.Vector3;
  zAxis: BABYLON.Vector3;
  sounds: {};
  backgroundModel: BackgroundModel;
  service: BackgroundServiceService
  displayCredit: boolean;
  title1: string = "Imagination is more important than knowledge.";
  title2: string = "Albert Einstein"
  constructor(public shared: SharedServiceService) {
    this.xAxis = new BABYLON.Vector3(1,0,0);
    this.yAxis = new BABYLON.Vector3(0,1,0);
    this.zAxis = new BABYLON.Vector3(0,0,1);
    this.displayCredit = false;
    shared.getBackgroundModel().subscribe(
      model => this.backgroundModel = model
      );
   }

  ngAfterViewInit() {
    this.backgroundModel.canvas = this.renderCanvas;
    this.backgroundModel.engine = new BABYLON.Engine(this.renderCanvas.nativeElement, true, {preserveDrawingBuffer: true, stencil: true});
    this.backgroundModel.initScene = this.createIntroScene(engine);
    this.backgroundModel.scene = this.createScene(this.backgroundModel.engine);
    this.backgroundModel.sounds = this.addAmbienceSounds;
    this.service = new BackgroundServiceService(this.backgroundModel, this.shared);
    this.backgroundModel.engine.isPointerLock = true
    var backgroundModel = this.backgroundModel;
    this.backgroundModel.scene.onBeforeRenderObservable.add(()=>{
      backgroundModel.globalTimer = backgroundModel.globalTimer+(1/backgroundModel.engine.getFps());
    })
    this.backgroundModel.scene.onBeforeRenderObservable.add(()=>{
      backgroundModel.flameLightAnimator.start(backgroundModel);
    })
    var service = this.service;
    var shared = this.shared;
    this.backgroundModel.scene.onBeforeRenderObservable.add(function () {
      var params = {};
      params['model'] = backgroundModel;
      params['service'] = service;
      params['shared'] = shared;
      backgroundModel.eyeOpenCloseAnimator.start(params);
    });
    //this.shared.setText("");
    var scene = this.backgroundModel.initScene;
    this.backgroundModel.engine.loadingScreen = new MyLoadingScreen("Loading!", this.backgroundModel);
     this.backgroundModel.engine.runRenderLoop(function(){
       try{
       scene.render();
       }catch(err){
        scene.dispose();
       }
     });
    this.backgroundModel.engine.displayLoadingUI();
    var engine = this.backgroundModel.engine;
    window.addEventListener('resize', function(){
       engine.resize();
    });

  }

  

  createScene(engine: BABYLON.Engine){
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -28), scene);
    //camera.attachControl(this.renderCanvas.nativeElement, true);
    
    //camera.setTarget(new BABYLON.Vector3(0,10,0));
    var light = new BABYLON.HemisphericLight('pointlight', new BABYLON.Vector3(0, 20, 0), scene);
    light.setDirectionToTarget(BABYLON.Vector3.Zero());
    light.intensity = 0.3;
    //light.range = 1;
    this.covercamera(scene,camera);
    this.createGround(scene);
    this.createSky(scene);
    this.createFire(scene);
    this.createMountains(scene);
    this.createBush(scene);
    var dialog = BABYLON.MeshBuilder.CreatePlane('Indiandialog',{width: 2, size: 2},scene);
    this.backgroundModel.dialogScaling = new BABYLON.Vector3(4,4,4);
    dialog.visibility = 0;
    this.createIndian(scene);
    //this.addAmbienceSounds(scene);
    var manager = GUI.AdvancedDynamicTexture.CreateForMesh(dialog);
    manager.addControl(this.indianDialog(manager));
    this.backgroundModel.manager = manager;
    // Return the created scene
    return scene;
  }

  covercamera(scene:BABYLON.Scene, camera:BABYLON.FreeCamera){
    var plane = BABYLON.MeshBuilder.CreatePlane('halfeyes',{width: 2, size: 2},scene)
    var plane2 = BABYLON.MeshBuilder.CreatePlane('fulleyes',{width: 2, size: 2},scene)
    plane.parent = camera;
    plane2.parent = camera;
    plane.position = new BABYLON.Vector3(0,0,2);
    plane2.position = new BABYLON.Vector3(0,0,3);
    var material = new BABYLON.StandardMaterial('eyeMaterial',scene);
    material.diffuseColor = new BABYLON.Color3(0,0,0);
    material.specularColor = new BABYLON.Color3(0,0,0);
    plane2.material = material;
    plane2.visibility = 0;
    plane.scaling = new BABYLON.Vector3(10,1,1);
    plane2.scaling = new BABYLON.Vector3(10,1,1);
    var gradientMaterial = new StandardMaterial('Name', scene);
    var diffuseColor = new BABYLON.Color3(0,0,0);
    var opacityTexture = new Texture('../../../assets/textures/eyePatch.png',scene);
    opacityTexture.hasAlpha = true;
    gradientMaterial.diffuseColor = diffuseColor;
    gradientMaterial.opacityTexture = opacityTexture;
    plane.material = gradientMaterial;
    this.backgroundModel.cameraRotation = new BABYLON.Vector3(-10*(Math.PI/180),0,0);
    
      
  }
  

  addAmbienceSounds(scene: BABYLON.Scene): void {
    var ambience = new BABYLON.Sound("Music", "../../../assets/sounds/Nightambience.mp3", scene, null, { loop: true, autoplay: true });
    var fire = new BABYLON.Sound("Music", "../../../assets/sounds/Fire.mp3", scene, null, { loop: true, autoplay: true, spatialSound: true,
      distanceModel: "linear", rolloffFactor: 2 });
    ambience.setVolume(0.2);
    fire.setVolume(0.5);
    fire.setPosition(BABYLON.Vector3.Zero());
    var horse = new BABYLON.Sound("panic", "../../../assets/sounds/horse.mp3", this.backgroundModel.scene);
    var interval = 30000+Math.random()*30000;
    setInterval(function(){
      horse.play()
      interval = 30000+Math.random()*30000;
    },interval);
  }

  createIndian(scene: BABYLON.Scene){
    var material = new BABYLON.StandardMaterial('american',scene);
    material.specularColor = new BABYLON.Color3(0,0,0);
    var _scene = scene;
    var _engine = this.backgroundModel.engine
    BABYLON.SceneLoader.ImportMesh("", "../../../assets/models/Native_American/", "native.babylon", scene, function (newMeshes, particleSystems) {
        var scaling = _scene.getMeshByID('Indiandialog').scaling;
        var pivot = <any>_scene.getMeshByID('Indiandialog');
        var scene = _scene;
        
        pivot.setPivotMatrix(BABYLON.Matrix.Translation(1, -1, 1));
        pivot.position = new BABYLON.Vector3(-5,18,0);
        newMeshes[0].position.x = -10
        newMeshes[0].scaling = new BABYLON.Vector3(0.1,0.1,0.1);
        newMeshes[0].rotate(new BABYLON.Vector3(0,1,0), -Math.PI/2, BABYLON.Space.WORLD);
        _engine.hideLoadingUI()
     })
  }

  

  createSky(scene: BABYLON.Scene) {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:500.0}, scene);	
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../../assets/skybox/galaxy/galaxy", scene);
    skyboxMaterial.reflectionTexture
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }

  createGround(scene: BABYLON.Scene) {
    var ground = BABYLON.Mesh.CreateGround('ground', 1000, 1000, 2, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
    var texture = new BABYLON.Texture("../../../assets/textures/ground.jpg", scene);
    texture.uScale = 50;
    texture.vScale =  50;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.ambientTexture = texture;
    ground.material = groundMaterial;
  }

  createBush(scene: BABYLON.Scene) {
    BABYLON.SceneLoader.ImportMesh("", "../../../assets/models/bush/", "bush.babylon", scene, function (newMeshes, particleSystems) {

      newMeshes[0].position.x = 25
      newMeshes[0].position.z = -5
      newMeshes[0].scaling = new BABYLON.Vector3(0.5,0.5,0.5);
      //newMeshes[0].rotate(new BABYLON.Vector3(0,1,0), -Math.PI/2, BABYLON.Space.WORLD);

   })

   BABYLON.SceneLoader.ImportMesh("", "../../../assets/models/bush/", "bush.babylon", scene, function (newMeshes, particleSystems) {

    newMeshes[0].position.x = -15
    newMeshes[0].position.z = 5
    newMeshes[0].scaling = new BABYLON.Vector3(0.3,0.2,0.3);
    newMeshes[0].rotate(new BABYLON.Vector3(1,1,0), Math.PI/2, BABYLON.Space.LOCAL);
    //newMeshes[0].rotate(new BABYLON.Vector3(0,1,0), -Math.PI/2, BABYLON.Space.WORLD);

 })
  
  }


  createFire(scene){
    var sphere = new BABYLON.TransformNode("root");
    //sphere.position.y = 1;
    this.backgroundModel.flameLight = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 5, 0), scene);
    this.backgroundModel.flameLight.diffuse = new BABYLON.Color3(1, 0.7, 0);
    this.backgroundModel.flameLight.specular = new BABYLON.Color3(1, 1, 1);
    this.backgroundModel.flameLight.intensity = 0.5;
    this.backgroundModel.flameLight.range = 100;
    this.backgroundModel.flamePosition = new BABYLON.Vector3(0,5,0);
    this.loadModel(scene);
    var smokeSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
	  smokeSystem.particleTexture = new BABYLON.Texture("../../../assets/textures/flare.png", scene);
	  smokeSystem.emitter = sphere.position; // the starting object, the emitter
    smokeSystem.minEmitBox = new BABYLON.Vector3(-1, 1, -1); // Starting all from
    smokeSystem.maxEmitBox = new BABYLON.Vector3(1, 1, 1); // To...
	
	  smokeSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
    smokeSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
    smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
	
	  smokeSystem.minSize = 0.5;
    smokeSystem.maxSize = 2;

    smokeSystem.minLifeTime = 0.3;
    smokeSystem.maxLifeTime = 1.5;

    smokeSystem.emitRate = 500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    smokeSystem.direction1 = new BABYLON.Vector3(0, 8, 0);
    smokeSystem.direction2 = new BABYLON.Vector3(0, 8, 0);

    smokeSystem.minAngularSpeed = 0;
	   smokeSystem.maxAngularSpeed = Math.PI;

    smokeSystem.minEmitPower = 1;
    smokeSystem.maxEmitPower = 2;
    smokeSystem.updateSpeed = 0.005;

    smokeSystem.start();
	
	
	
    // Create a particle system
    var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    fireSystem.particleTexture = new BABYLON.Texture("../../../assets/textures/flare.png", scene);

    // Where the particles come from
    fireSystem.emitter = sphere.position; // the starting object, the emitter
    fireSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5); // Starting all from
    fireSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5); // To...

    // Colors of all particles
    fireSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
    fireSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
    fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    // Size of each particle (random between...
    fireSystem.minSize = 0.5;
    fireSystem.maxSize = 1;

    // Life time of each particle (random between...
    fireSystem.minLifeTime = 0.2;
    fireSystem.maxLifeTime = 0.4;

    // Emission rate
    fireSystem.emitRate = 500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    // Direction of each particle after it has been emitted
    fireSystem.direction1 = new BABYLON.Vector3(0, 8, 0);
    fireSystem.direction2 = new BABYLON.Vector3(0, 8, 0);

    // Angular speed, in radians
    fireSystem.minAngularSpeed = 0;
    fireSystem.maxAngularSpeed = Math.PI;

    // Speed
    fireSystem.minEmitPower = 1;
    fireSystem.maxEmitPower = 3;
    fireSystem.updateSpeed = 0.005;

    // Start the particle system
    fireSystem.start();
  }

  loadModel(scene: BABYLON.Scene) {
    var logMaterial = new BABYLON.StandardMaterial('logPineMaterial', scene);
    var logTexture = new BABYLON.Texture("../../../assets/models/firecamp/firewoodTexture.jpg", scene);
    logMaterial.specularColor = new BABYLON.Color3(0.2,0.2,0.2);
    logMaterial.emissiveColor = new BABYLON.Color3(0.5,0.2,0.2);
    logMaterial.ambientTexture = logTexture;
    var stoneMaterial = new BABYLON.StandardMaterial('stoneMaterial', scene);
    stoneMaterial.diffuseTexture = new BABYLON.Texture("../../../assets/models/firecamp/rockTexture.jpg", scene);
    stoneMaterial.specularColor = new BABYLON.Color3(0,0,0);
    BABYLON.SceneLoader.ImportMesh("", "../../../assets/models/firecamp/", "firecamp.babylon", scene, function (newMeshes, particleSystems) {
      for(var i=0;i<newMeshes.length;i++){
        if(newMeshes[i].id.split('.')[0] == "Log_pine"){
          newMeshes[i].material = logMaterial;
        }else{
          newMeshes[i].material = stoneMaterial;
        }
      }
     
    });
  }

  createMountains(scene: BABYLON.Scene){
    var mountain1 = BABYLON.MeshBuilder.CreatePlane("mountain-1", {width: 220, size:100}, scene);
    var mountain2 = BABYLON.MeshBuilder.CreatePlane("mountain-2", {width: 350, size:150}, scene);
    //mountains.rotate(this.zAxis, Math.PI/2, BABYLON.Space.LOCAL);
    mountain1.position = new BABYLON.Vector3(-80,30,150);
    mountain2.position = new BABYLON.Vector3(100,30,200);
    var material1 = new BABYLON.StandardMaterial("mountain1Texture", scene);
    material1.diffuseTexture = new BABYLON.Texture("../../../assets/textures/mountain-1.png", scene);
    material1.specularColor = new BABYLON.Color3(0,0,0.1);
    material1.diffuseTexture.hasAlpha = true;
    mountain1.material = material1;
  
    var material2 = new BABYLON.StandardMaterial("mountain2Texture", scene);
    material2.diffuseTexture = new BABYLON.Texture("../../../assets/textures/mountain-2.png", scene);
    material2.specularColor = new BABYLON.Color3(0,0,0.05);
    material2.diffuseTexture.hasAlpha = true;
    mountain2.material = material2;
  }

  

  indianDialog(manager: GUI.AdvancedDynamicTexture){
    var rectObj = this.makeRect('Indiandialog', manager);
    //rectObj.scaling = new BABYLON.Vector3(5,5,1);
    rectObj.addControl(this.makeTextBlock('dialogText'))
    return rectObj;
  }

  makeRect(recName:string, manager:GUI.AdvancedDynamicTexture ){
        var sv = new GUI.ScrollViewer('Indiandialog');
        sv.thickness = 7;
        sv.color = "black";
        sv.width = 1;
        sv.height = 0.6;
        sv.background = "white";  
        manager.addControl(sv);
        return sv;
    }

  makeTextBlock(textBlockName: string){
    var textObject = new GUI.TextBlock(textBlockName);
    textObject.text = "Don't panic... I won't hurt you."
    textObject.fontSize = "150px"
    textObject.resizeToFit = true;
    textObject.textWrapping = GUI.TextWrapping.WordWrap;
    //textObject.lineSpacing = "2px";
    textObject.paddingTop = "50px";
	  // textObject.height = "200px"
    textObject.paddingLeft = "50px";
    textObject.paddingBottom = "50px";
    textObject.paddingRight = "50px";
    textObject.color = "black";
    textObject.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textObject.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textObject.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textObject.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    return textObject;
  }

  createPanel(vec: BABYLON.Vector3){
    var panel = new GUI.StackPanel();
    return panel;
  }

  createIntroScene(engine: BABYLON.Engine) {
    this.creditText.nativeElement.style.opacity = 0;
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, -220, -200), scene);
    var earth = BABYLON.MeshBuilder.CreateSphere("earth", {diameter: 300}, scene);
    earth.position = new BABYLON.Vector3(-250,0,0);
    var material = new BABYLON.StandardMaterial('earthMaterial',scene);
    material.ambientTexture = new BABYLON.Texture('../../../assets/textures/earth_8k.jpg',scene);
    material.specularColor = new BABYLON.Color3(0,0,0)
    earth.material = material;
    var hl1 = new BABYLON.HighlightLayer("hl1", scene);
    hl1.addMesh(earth, BABYLON.Color3.White());
    hl1.innerGlow = false;
    hl1.blurHorizontalSize = 0;
    hl1.blurVerticalSize = 0;
    var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-100, 0, 300), scene);
    light.radius = 10
    var light2 = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(0, 2, 0), scene);
    light2.parent = camera;
    light2.intensity = 0.2;
    light.intensity = 0
    scene.clearColor = new BABYLON.Color4(0,0,0,1);
    var asteroid = this.createAsteroid(scene, camera);
    asteroid.scaling = new BABYLON.Vector3(4,4,4);
    var speed = new BABYLON.Vector3(
      asteroid.position.x-earth.position.x,
      asteroid.position.y-earth.position.y-50,
      asteroid.position.z-earth.position.z
    )
    var _self = this
    scene.onBeforeRenderObservable.add(function(){
      asteroid.rotation.x += 0.02
      asteroid.rotation.y += 0.01
      asteroid.rotation.z += 0.005
      if(camera.position.y > -100 && camera.position.y < -50 && _self.creditText.nativeElement.style.opacity<1){
        _self.displayCredit = true;
        _self.creditText.nativeElement.style.opacity = ""+(parseFloat(_self.creditText.nativeElement.style.opacity)+0.01)
      }else if(camera.position.y > -50 && camera.position.y < -25 && _self.creditText.nativeElement.style.opacity>0){
        _self.creditText.nativeElement.style.opacity = ""+(parseFloat(_self.creditText.nativeElement.style.opacity)-0.01)
      }else if(camera.position.y > -25 && camera.position.y < 50 && _self.creditText.nativeElement.style.opacity<1){
        _self.title1 = "My"
        _self.title2 = "Portfolio"
        _self.creditText.nativeElement.style.opacity = ""+(parseFloat(_self.creditText.nativeElement.style.opacity)+0.01)
      }else if(camera.position.y > 50 && camera.position.y < 75 && _self.creditText.nativeElement.style.opacity>0){
        _self.creditText.nativeElement.style.opacity = ""+(parseFloat(_self.creditText.nativeElement.style.opacity)-0.01)
      }else if(camera.position.y > 75 && camera.position.y < 125 && _self.creditText.nativeElement.style.opacity<1){
        _self.title1 = "by"
        _self.title2 = "Dhanush Srinivasa"
        _self.creditText.nativeElement.style.opacity = ""+(parseFloat(_self.creditText.nativeElement.style.opacity)+0.01)
      }else if(camera.position.y > 125 && camera.position.y < 150 && _self.creditText.nativeElement.style.opacity>0){
        _self.creditText.nativeElement.style.opacity = ""+(parseFloat(_self.creditText.nativeElement.style.opacity)-0.01)
      }
      if(Math.round(camera.position.y) == 35){
        try{
            if(!_self.backgroundModel.asteroidSound.isPlaying)
              _self.backgroundModel.asteroidSound.play()
          }catch(err){}
      }
      if(camera.position.y > 30 && (asteroid.position.x>earth.position.x || asteroid.position.y>earth.position.y || asteroid.position.z<earth.position.z)){
          
        
        asteroid.position.x -= speed.x/500
        asteroid.position.y -= speed.y/500
        asteroid.position.z -= speed.z/500
      }
      if(camera.position.y < 240){
        camera.position.y += 0.12;
      }else{
        if(_self.backgroundModel.isReady==true){
          _self.service.stop(_self.backgroundModel)
        }
      }
      if(camera.position.y > -230 && camera.position.y<250){
        if(hl1.blurHorizontalSize < 1){
          hl1.addMesh(earth, new BABYLON.Color3(0.6,0.6,0.8));
          hl1.blurHorizontalSize += 0.001
          hl1.blurVerticalSize += 0.001
        }
        if(light.intensity < 10){
          light.intensity += 0.01
        }
      }else{
        try{
          hl1.removeMesh(earth)
        }catch(err){}
        if(light.intensity > 0){
          light.intensity -= 0.01
        }
      }
      
      earth.rotation.y-= 0.0005;

    })
    return scene;
  }

  createAsteroid(scene: BABYLON.Scene, camera){
    var scrambleUp = function(data) {
      for (var index = 0; index < data.length; index ++) {
          data[index] += 0.4 * Math.random();
      }
    }
  
    var scrambleDown = function(data) {
        for (var index = 0; index < data.length; index ++) {
            data[index] -= 0.4 * Math.random();
        }
    }
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    //sphere.parent = camera
    sphere.position = new BABYLON.Vector3(75,50,-200);
    var materialSphere = new BABYLON.StandardMaterial("mat", scene);
    materialSphere.diffuseTexture = new BABYLON.Texture("../../../assets/textures/asteroid.jpg", scene);    
    materialSphere.specularColor = new BABYLON.Color3(0,0,0)
    materialSphere.emissiveColor = new BABYLON.Color3(0.3,0.1,0.1)
    sphere.material = materialSphere;
    this.backgroundModel.asteroidSound = new BABYLON.Sound("Music", "../../../assets/sounds/asteroid.mp3", scene);
    this.backgroundModel.asteroidSound.setVolume(0.2);
    this.backgroundModel.asteroidSound.setPosition(sphere.position);
    var asteroidSound = this.backgroundModel.asteroidSound;
    //asteroidSound.stop()
    this.backgroundModel.asteroidSound.onended = function () {
      asteroidSound.dispose();
    };
    var hl2 = new BABYLON.HighlightLayer("hl2", scene);
    hl2.addMesh(sphere, new BABYLON.Color3(0,0,0));
    hl2.outerGlow = false;
    hl2.blurVerticalSize = 5
    hl2.blurHorizontalSize = 5
    var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 2, scene);
    sphere2.setEnabled(false);
    sphere2.updateMeshPositions(scrambleUp);

    var sphere3 = BABYLON.Mesh.CreateSphere("sphere3", 16, 2, scene);
    sphere3.setEnabled(false);

    sphere3.scaling = new BABYLON.Vector3(2.1, 3.5, 1.0);
    sphere3.bakeCurrentTransformIntoVertices();

    var sphere4 = BABYLON.Mesh.CreateSphere("sphere4", 16, 2, scene);
    sphere4.setEnabled(false);
    sphere4.updateMeshPositions(scrambleDown);

    var sphere5 = BABYLON.Mesh.CreateSphere("sphere5", 16, 2, scene);
    sphere5.setEnabled(false);

    sphere5.scaling = new BABYLON.Vector3(1.0, 0.1, 1.0);
    sphere5.bakeCurrentTransformIntoVertices();    

    var manager = new BABYLON.MorphTargetManager();
    sphere.morphTargetManager = manager;

    var target0 = BABYLON.MorphTarget.FromMesh(sphere2, "sphere2", 0.25);
    manager.addTarget(target0);

    var target1 = BABYLON.MorphTarget.FromMesh(sphere3, "sphere3", 0.25);
    manager.addTarget(target1);

    var target2 = BABYLON.MorphTarget.FromMesh(sphere4, "sphere4", 0.25);
    manager.addTarget(target2);   

    var target3 = BABYLON.MorphTarget.FromMesh(sphere5, "sphere5", 0.25);
    manager.addTarget(target3)

    target0.influence = 0.3
    target1.influence = 0.25
    target2.influence = 0.15
    target3.influence = 0.25

    return sphere;
  }

}
