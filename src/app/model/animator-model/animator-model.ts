import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AnimatorModel {
    timeStarted: number;
    animator: any;
    constructor(){
    }

    setAnimator(animator:any){
      this.animator = animator;
    }

    setTimeStart(timeStarted:number){
      this.timeStarted = timeStarted
    }
    start(params: any){
      this.animator(params,this.timeStarted);
    }

    
 }
