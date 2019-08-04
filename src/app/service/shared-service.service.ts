import { Injectable } from '@angular/core';
import { BackgroundModel } from '../model/background-model/background-model';
import { Observable, of } from 'rxjs';
import * as BABYLON from 'babylonjs';
//import { posix } from 'path';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  
  

  backgroundModel: BackgroundModel = new BackgroundModel();
  interactEvent: any;
  display: boolean = false;
  constructor() {

  }

  setDisplay(display: boolean){
    this.display = display;
  }

  getBackgroundModel(): Observable<BackgroundModel>{
    return of(this.backgroundModel);
  }

  getDisplay(): Observable<boolean> {
    return of(this.display);
  }
  

  setBackgroundModel(backgroundModel: BackgroundModel){

    this.backgroundModel = backgroundModel;  

  }

  setText(answer: any) {
    var len = answer.length;
    var numberOfLines = 6
    var fontSize = 32;
    var rect = <any>this.backgroundModel.manager.getChildren()[0].getChildByName('Indiandialog');
    var width = (0.32*len*2/numberOfLines);
    if(width > 10){
      width = 10
    }
    //rect.width = (fontSize*width)/(fontSize*15);
    
    numberOfLines = Math.ceil(len*fontSize/rect.widthInPixels)
    var height = (numberOfLines*fontSize)+50;
    if(numberOfLines == 0 || numberOfLines==Infinity)
      height = 1024*0.6
    if(height > 500){
      height = 500
    }
    this.backgroundModel.dialogScaling = new BABYLON.Vector3(width, width, width)
    var pivot = <any>this.backgroundModel.scene.getMeshByID('Indiandialog');
    rect.heightInPixels = height;
    rect.getChildByName('dialogText').fontSize = fontSize+"px"
    rect.getChildByName('dialogText').text = answer;
    //pivot.setPivotMatrix(BABYLON.Matrix.Translation(1*(width/2), -1*(width/2), 1*(width/2)));
    pivot.position.y = 25
  }
}
