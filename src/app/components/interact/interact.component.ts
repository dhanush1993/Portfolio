import { Component, OnInit, Injectable } from '@angular/core';
import questionList from '../../../assets/json/questionAndAnswers';
import { SharedServiceService } from 'src/app/service/shared-service.service';

@Component({
  selector: 'app-interact',
  templateUrl: './interact.component.html',
  styleUrls: ['./interact.component.css']
})
export class InteractComponent implements OnInit {
  questions = [];
  displayInteract: boolean;
  constructor(public shared: SharedServiceService) {
    this.pushQuestions(1);
    shared.getDisplay().subscribe(display => console.log(display));
  }

  ngOnInit() {
  }

  getQuestionWithID(id:number){
    for(var i = 0;i<questionList.list.length;i++){
      if(questionList.list[i].id == id){
        return questionList.list[i];
      }
    }
    return null;
  }

  pushQuestions(id: number){
    this.questions = []
    var obj = this.getQuestionWithID(id);
    for(var i in obj.questions)
      this.questions.push(obj.questions[i]);

  }

  provideAnswer($event: any){
    //var textBox = <any>this.model.scene.getMeshByID('dialogText');
    this.shared.setText($event.answer);
    this.pushQuestions($event.nextID);
  }

}
