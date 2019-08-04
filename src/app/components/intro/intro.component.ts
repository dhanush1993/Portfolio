import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Vector2 } from 'babylonjs';


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements AfterViewInit {
  

  @ViewChild('introCanvas',{static: false}) introCanvas:ElementRef;
  @ViewChild('creditText',{static: false}) creditText:ElementRef;
  displayCredit: boolean;
  title1: string = "Imagination is more important than knowledge.";
  title2: string = "Albert Einstein"
  constructor() { 
    this.displayCredit = false;
  }

  ngAfterViewInit(): void {
    this.creditText.nativeElement.style.opacity = 0;
    var engine = new BABYLON.Engine(this.introCanvas.nativeElement, true, {preserveDrawingBuffer: true, stencil: true});
    var scene = this.createIntroScene(engine);
    engine.runRenderLoop(function(){
      scene.render();
    });
    window.addEventListener('resize', function(){
       engine.resize();
    });
  }

  createIntroScene(engine: BABYLON.Engine) {
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

      if(camera.position.y > 30 && (asteroid.position.x>earth.position.x || asteroid.position.y>earth.position.y || asteroid.position.z<earth.position.z)){
        asteroid.position.x -= speed.x/500
        asteroid.position.y -= speed.y/500
        asteroid.position.z -= speed.z/500
      }
      if(camera.position.y < 220){
        camera.position.y += 0.12;
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
