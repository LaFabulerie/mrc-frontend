import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Answer, Question } from 'src/app/models/feedback';
import { RemoteControlService } from 'src/app/services/control.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  feedbackId: string = '';
  currentQuestionIndex = 0;
  currentQuestion!: Question;
  questions: Question[] = [];
  answerForm!: FormGroup;

  answers: Answer[] = [];

  constructor(
    private feedbackService: FeedbackService,
    private fb: FormBuilder,
    public control: RemoteControlService,
  ) {
    this.controlSetup();
    this.answerForm = this.fb.group({
      feedbackId: [''],
      questionId: [''],
      choice: [''],
      text: [''],
    });
  }

  private controlSetup() {
    this.control.navBarEnabled = true;
    this.control.showMapButton = false;
    this.control.showBackButton = false;
    this.control.showListButton = false;
    this.control.showExitButton = false;
    this.control.bgColor = '#FFFFFF';
  }

  get currentAnswerChoice() {
    return this.answerForm.get('choice')?.value;
  }

  get currentAnswerText() {
    return this.answerForm.get('text')?.value;
  }

  ngOnInit(): void {
    console.log('feedback init');
    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.feedbackService.questions$.subscribe(questions => {
      this.questions = questions;
      this.currentQuestionIndex = 0;
      this.currentQuestion = questions[this.currentQuestionIndex];
      this.answerForm.patchValue({
        questionId: this.currentQuestion.id,
      });
      this.feedbackService.createFeedback().subscribe(feedback => {
        this.feedbackId = feedback.id;
        this.answerForm.patchValue({
          feedbackId: this.feedbackId,
        });
      });
    });
  }

  answerValid() {
    if(this.currentQuestion.type === 'text') {
      return this.currentAnswerText !== '' && this.currentAnswerText !== null;
    } else if(this.currentQuestion.type === 'radio' || this.currentQuestion.type === 'checkbox') {
      return this.currentAnswerChoice !== '' && this.currentAnswerChoice !== null;
    }
    return false;
  }


  next() {
    const answer = new Answer(this.answerForm.value);
    if(answer.choice) {
      //in case of checkbox
      answer.choice = this.currentAnswerChoice.toString();
    }
    this.answers.push(answer);

    this.currentQuestionIndex++;

    if(this.currentQuestionIndex >= this.questions.length) {
      for(let answer of this.answers) {
        this.feedbackService.createAnswer(answer).subscribe();
      }

      this.control.forceExit();
      return
    }

    this.answerForm.reset();
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.answerForm.patchValue({
      feedbackId: this.feedbackId,
      questionId: this.currentQuestion.id,
    });
  }


}
