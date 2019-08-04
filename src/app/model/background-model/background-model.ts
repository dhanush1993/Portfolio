import { NgModule, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatorModel } from '../animator-model/animator-model'
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class BackgroundModel { 
  initScene: BABYLON.Scene;
  canvas: ElementRef;
  scene: BABYLON.Scene;
  engine: BABYLON.Engine;
  eyeVal: number;
  globalTimer:number = 0;
  flamePosition: BABYLON.Vector3;
  flameLight: BABYLON.PointLight;
  cameraRotation: BABYLON.Vector3;
  flameLightAnimator: AnimatorModel;
  eyeOpenCloseAnimator: AnimatorModel;
  interactionAnimator: AnimatorModel;
  manager: GUI.AdvancedDynamicTexture;
  dialogScaling: BABYLON.Vector3;
  isReady: boolean;
  sounds: any;
  asteroidSound: BABYLON.Sound;
}
