import { Injectable } from '@angular/core';
import { AnimatorModel } from '../model/animator-model/animator-model'
import { BackgroundModel } from '../model/background-model/background-model';
import * as BABYLON from 'babylonjs';
import { SharedServiceService } from './shared-service.service';

@Injectable({providedIn: 'root'})
export class BackgroundServiceService {

    backgroundModel: BackgroundModel;
    shared: SharedServiceService;
    sounds: {};
    constructor(backgroundModel: BackgroundModel, shared: SharedServiceService){
      this.shared = shared;
      this.backgroundModel = backgroundModel;
      this.backgroundModel.isReady = this.shared.display
      this.loadSounds();
      this.backgroundModel.eyeVal = 0;
      this.backgroundModel.flameLightAnimator = new AnimatorModel();
      this.backgroundModel.flameLightAnimator.setAnimator(this.attachflameAnimator);
      this.backgroundModel.flameLightAnimator.setTimeStart(0) 
      this.backgroundModel.eyeOpenCloseAnimator = new AnimatorModel();
      this.backgroundModel.eyeOpenCloseAnimator.setAnimator(this.attachEyeAnimator);
      this.backgroundModel.eyeOpenCloseAnimator.setTimeStart(0);
      this.shared.setBackgroundModel(backgroundModel);
      
    }
    
    stop(backgroundModel: BackgroundModel) {
      backgroundModel.engine.stopRenderLoop()
      // backgroundModel.initScene.removeMesh(backgroundModel.initScene.getMeshByID('earth'));
      // backgroundModel.initScene.removeMesh(backgroundModel.initScene.getMeshByID('sphere1'));
      // backgroundModel.initScene.removeMesh(backgroundModel.initScene.getMeshByID('sphere2'));
      // backgroundModel.initScene.removeMesh(backgroundModel.initScene.getMeshByID('sphere3'));
      // backgroundModel.initScene.removeMesh(backgroundModel.initScene.getMeshByID('sphere4'));
      // backgroundModel.initScene.removeMesh(backgroundModel.initScene.getMeshByID('sphere5'));
      // backgroundModel.initScene.removeMaterial(backgroundModel.initScene.getMaterialByID('earthMaterial'));
      // backgroundModel.initScene.removeMaterial(backgroundModel.initScene.getMaterialByID('mat'));
      // backgroundModel.initScene.removeCamera(backgroundModel.initScene.getCameraByID("camera1"))
      backgroundModel.initScene.getMeshByID('earth').dispose()
      backgroundModel.initScene.getMeshByID('sphere1').dispose()
      backgroundModel.initScene.getMeshByID('sphere2').dispose()
      backgroundModel.initScene.getMeshByID('sphere3').dispose()
      backgroundModel.initScene.getMeshByID('sphere4').dispose()
      backgroundModel.initScene.getMeshByID('sphere5').dispose()
      backgroundModel.initScene.getMaterialByID('earthMaterial').dispose()
      backgroundModel.initScene.getMaterialByID('mat').dispose()
      backgroundModel.initScene.getCameraByID("camera1").dispose()
      var scene = backgroundModel.scene
      backgroundModel.engine.runRenderLoop(function(){
          scene.render();
      });
      scene.cameras[0].attachControl
      backgroundModel.sounds(backgroundModel.scene);
    }

    attachflameAnimator(params: any, timeStarted: number) {
      var backgroundModel: BackgroundModel = params;
      backgroundModel.flameLight.position.x = backgroundModel.flamePosition.x+(Math.random()*1)
      backgroundModel.flameLight.position.y = backgroundModel.flamePosition.y+(Math.random()*1)
      backgroundModel.flameLight.position.z = backgroundModel.flamePosition.z+(Math.random()*1)
      backgroundModel.flameLight.intensity = 0.5+(Math.random()*0.5)
    }

    attachEyeAnimator(params: BackgroundServiceService,timeStarted: number) {
      {
        var backgroundModel: BackgroundModel = params['model'];
        var seconds = Math.floor(backgroundModel.globalTimer - timeStarted)
        var service:BackgroundServiceService = params['service'];
        var shared:SharedServiceService = params['shared'];
        var panic = service.sounds['panic'];
        var panic_human = service.sounds['panic_human'];
        var camera: any = backgroundModel.scene.cameras[0]
        if(seconds<7){
          backgroundModel.eyeVal = 1;
        }
        if(seconds == 7){
            backgroundModel.eyeVal = -0.01
            
          }
        if(seconds == 8){
            backgroundModel.eyeVal = +0.01
          }
        if(seconds == 10){
            backgroundModel.eyeVal = -0.01
          }
        if(seconds == 11){
          backgroundModel.eyeVal = +0.01
          }
        if(seconds < 13){
          service.eyeSequence(backgroundModel);
        }else{
          service.playOnce({sound:panic});
          service.removeEyeSequence(backgroundModel);
        }
        if(seconds == 14){
          try{
            if(!panic_human.isPlaying)
              service.playOnce({sound:panic_human,end:1});
          }catch(err){}
          service.panicCamera(backgroundModel);
          shared.setDisplay(true);
        }
        
        if(seconds >=14){
          camera.attachControl(backgroundModel.canvas.nativeElement,true);
          if(service.panicCamera(backgroundModel)){
            camera.rotation.z = 0;
            service.showDialog(backgroundModel);
          if(camera.rotation.y> backgroundModel.cameraRotation.y+2*(Math.PI/180))
            camera.rotation.y = backgroundModel.cameraRotation.y+2*(Math.PI/180)
          else if(camera.rotation.y<backgroundModel.cameraRotation.y-2*(Math.PI/180))
            camera.rotation.y = backgroundModel.cameraRotation.y-2*(Math.PI/180)
            
          if(camera.rotation.x>backgroundModel.cameraRotation.x+2*(Math.PI/180))
            camera.rotation.x = backgroundModel.cameraRotation.x+2*(Math.PI/180)
          else if(camera.rotation.x<backgroundModel.cameraRotation.x-2*(Math.PI/180))
            camera.rotation.x = backgroundModel.cameraRotation.x-2*(Math.PI/180)
          }
        }
      }
    }
    
    playOnce({sound, end=0}:{sound:any; end?:number}) {
      try{
        if(!sound.isPlaying){
          if(end == 0)
            sound.play();
          else
            sound.play(0,0,end);
        }
      }catch(err){}
    }

    eyeSequence(backgroundModel: BackgroundModel){
      backgroundModel.scene.getMeshByID('fulleyes').visibility = backgroundModel.scene.getMeshByID('fulleyes').visibility + backgroundModel.eyeVal;
      if(backgroundModel.scene.getMeshByID('fulleyes').visibility>=1.1){
        backgroundModel.scene.getMeshByID('fulleyes').visibility = 1
      }else if(backgroundModel.scene.getMeshByID('fulleyes').visibility<=-0.1){
        backgroundModel.scene.getMeshByID('fulleyes').visibility = 0
      }
    }

    removeEyeSequence(backgroundModel: BackgroundModel){
      if(backgroundModel.scene.getMeshByID('fulleyes').visibility > 0)
        backgroundModel.scene.getMeshByID('fulleyes').visibility = backgroundModel.scene.getMeshByID('fulleyes').visibility - 0.01;
      if(backgroundModel.scene.getMeshByID('halfeyes').visibility > 0)
        backgroundModel.scene.getMeshByID('halfeyes').visibility = backgroundModel.scene.getMeshByID('fulleyes').visibility - 0.005;
    }

    showDialog(backgroundModel: BackgroundModel){
      if(backgroundModel.scene.getMeshByID('Indiandialog').visibility < 1)
            backgroundModel.scene.getMeshByID('Indiandialog').visibility = (backgroundModel.scene.getMeshByID('Indiandialog').visibility)*2+0.001;
      if(backgroundModel.scene.getMeshByID('Indiandialog').scaling.x != backgroundModel.dialogScaling.x){
        backgroundModel.scene.getMeshByID('Indiandialog').scaling.x = backgroundModel.dialogScaling.x;
      }
      if(backgroundModel.scene.getMeshByID('Indiandialog').scaling.y < backgroundModel.dialogScaling.y){
        backgroundModel.scene.getMeshByID('Indiandialog').scaling.y = backgroundModel.dialogScaling.y;
      }
    }

    panicCamera(backgroundModel: BackgroundModel) {
      var camera = backgroundModel.scene.cameras[0];
      if(camera.position.z > -30){
        camera.position.x = Math.random()*0.1
        camera.position.y = camera.position.y+(Math.random()*0.1)
        camera.position.z = camera.position.z - (Math.random()*0.5);
        
        return false;
      }else{
        
        camera.position.x = 0
        camera.position.y = 5
        camera.position.z = -30;
        
        return true;
  
      }
  }

  loadSounds(){
    this.sounds = {};
    var panic = this.loadSound('Panic');
    this.sounds['panic'] = panic;
    var panic_human = this.loadSound('Panic_human')
    this.sounds['panic_human'] = panic_human;
    this.sounds['panic'].setVolume(0.5);
    panic.onended = function () {
          panic.dispose();
      };
    panic_human.onended = function () {
          panic_human.dispose();
      };
  }

  loadSound(sound: string) {
    return new BABYLON.Sound("panic", "../../../assets/sounds/"+sound+".mp3",  this.backgroundModel.scene);
  }



}

export class MyLoadingScreen implements BABYLON.ILoadingScreen {
  //optional, but needed due to interface definitions
  public loadingUIBackgroundColor: string = "#000000";
  constructor(public loadingUIText: string, public backGround: BackgroundModel) {}
  public displayLoadingUI() {
    this.backGround.canvas.nativeElement.style.backgroundColor = "rgba(0,0,0,1)"
  }

  public hideLoadingUI() {
    this.backGround.isReady = true;
  }
}
