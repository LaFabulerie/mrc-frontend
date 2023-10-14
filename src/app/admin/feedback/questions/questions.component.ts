import { Component, EventEmitter, OnInit } from '@angular/core';
import { _ } from 'core-js';
import { ConfirmationService } from 'primeng/api';
import { Choice, Question } from 'src/app/models/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-edit-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  questions: Question[] = [];
  currentQuestion: Question|null = null;

  currentType: 'text' | 'radio' | 'checkbox' = 'text';

  questionTypes = [
    { value: 'text', label: 'Réponse libre' },
    { value: 'radio', label: 'Choix unique' },
    { value: 'checkbox', label: 'Choix multiple' },
  ];

  allowCommentChoices = [
    { value: true, label: 'Oui' },
    { value: false, label: 'Non' },
  ];

  newQuestionChoice: string = ""


  constructor(
    private feedbackService: FeedbackService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.feedbackService.questions$.subscribe((questions: Question[]) => {
      if(questions && questions.length > 0) {
        this.questions = questions;
        this.currentQuestion = this.questions[0];
        this.currentType = this.currentQuestion.type
      }
    });
  }

  setCurrentQuestion(question: Question) {
    this.currentQuestion = question;
    this.currentType = this.currentQuestion.type
  }


  removeCurrentQuestion(event: any) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette question ?',
      target: event.target as EventTarget,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'confirmPopup',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.feedbackService.deleteQuestion(this.currentQuestion!.id!).subscribe(_ => {
          this.questions = this.questions.filter(q => q.id !== this.currentQuestion!.id);
          this.setCurrentQuestion(this.questions[0]);
        });
      },
      reject: () => {}
    });
  }

  updateAllowComment() {
    if(!this.currentQuestion!.id) return
    this.feedbackService.patchQuestion(this.currentQuestion!.id, {allowComment: this.currentQuestion!.allowComment}).subscribe();
  }
  updateOrder(){
    if(!this.currentQuestion!.id) return
    this.feedbackService.patchQuestion(this.currentQuestion!.id, {order: this.currentQuestion!.order}).subscribe(_ => {
      this.questions.sort((q1,q2) => q1.order - q2.order)
    });
  }

  updateText(){
    if(!this.currentQuestion!.id) return
    this.feedbackService.patchQuestion(this.currentQuestion!.id, {text: this.currentQuestion!.text}).subscribe();
  }

  updateType(){
    if(!this.currentQuestion!.id) {
      this.currentQuestion!.type = this.currentType;
      return
    }
    if(this.currentQuestion?.type !== 'text' && this.currentType === 'text' && this.currentQuestion!.choices.length > 0){
      this.confirmationService.confirm({
        message: 'En changeant le type de question en textuel, vous allez supprimer les choix existants. Êtes-vous sûr de vouloir continuer ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        key: 'confirmDialog',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: () => {
          this.feedbackService.patchQuestion(this.currentQuestion!.id!, {type: this.currentType}).subscribe(_ =>{
            this.currentQuestion!.type = this.currentType;
            this.currentQuestion!.choices.forEach((c:Choice) => this.removeAnswerChoice(c, null));
          });
        },
        reject: () => {
          this.currentType = this.currentQuestion!.type;
        }
      });
    }
    else{
      this.feedbackService.patchQuestion(this.currentQuestion!.id, {type: this.currentType}).subscribe(_ =>{
        this.currentQuestion!.type = this.currentType;
      });
    }
  }

  newQuestion() {
    this.currentType = 'text';
    this.currentQuestion = {
      text: '',
      type: this.currentType,
      order: this.questions.length + 1,
      allowComment: false,
      choices: [],
    }
  }

  saveNewQuestion() {
    this.feedbackService.createQuestion(this.currentQuestion!).subscribe((question: Question) => {
      this.questions.push(question);
      this.questions.sort((q1,q2) => q1.order - q2.order)
      this.currentQuestion = question;
    });
  }

  addAnswerChoice() {
    if(this.newQuestionChoice !== ''){
      this.feedbackService.createAnswerChoice({
        question: this.currentQuestion!.id,
        text: this.newQuestionChoice
      }).subscribe((choice: Choice) => {
        this.currentQuestion!.choices.push(choice);
        this.newQuestionChoice = '';
      });
    }
  }

  updateAnswerChoiceText(choice: Choice) {
    this.feedbackService.patchAnswerChoice(choice.id, {text: choice.text}).subscribe();
  }

  removeAnswerChoice(choice: Choice, event:any) {
    if (event) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        key: 'confirmPopup',
        message: 'Êtes-vous sûr de vouloir supprimer ce choix de réponse ?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: () => {
          this.feedbackService.deleteAnswerChoice(choice.id).subscribe(_ => {
            this.currentQuestion!.choices = this.currentQuestion!.choices.filter(c => c.id !== choice.id);
          });
        },
        reject: () => {}
      });
    }
    else {
      this.feedbackService.deleteAnswerChoice(choice.id).subscribe(_ => {
        this.currentQuestion!.choices = this.currentQuestion!.choices.filter(c => c.id !== choice.id);
      });
    }
  }
}
