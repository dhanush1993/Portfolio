import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  @Input() question: any;
  
  @Output() provideAnswer = new EventEmitter<string>();
  constructor() { 
    
  }

  ngOnInit() {
  }

  askQuestion(){
    this.provideAnswer.emit(this.question);
  }

}
