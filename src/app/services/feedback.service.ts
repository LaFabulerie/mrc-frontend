import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer, Choice, Feedback, Question } from '../models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private questionsSubject: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  public questions$: Observable<Question[]> = this.questionsSubject.asObservable();


  constructor(
    private http: HttpClient,
    ) { }

  getFeedbacks() {
    return this.http.get<Feedback[]>(`${environment.serverHost}/api/feedback/feedbacks`);
  }

  createFeedback() {
    return this.http.post<{id: string}>(`${environment.serverHost}/api/feedback/feedbacks/`, {});
  }

  deleteFeedback(id: string) {
    return this.http.delete(`${environment.serverHost}/api/feedback/feedbacks/${id}/`);
  }

  loadQuestions() {
    this.http.get<Question[]>(`${environment.serverHost}/api/feedback/questions`).subscribe(questions => {
      this.questionsSubject.next(questions);
    })
  }

  createAnswer(answer: Answer): any {
    return this.http.post(`${environment.serverHost}/api/feedback/answers/`, answer);
  }

  patchQuestion(id: string, data: any): Observable<Question> {
    return this.http.patch<Question>(`${environment.serverHost}/api/feedback/questions/${id}/`, data);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${environment.serverHost}/api/feedback/questions/${id}/`);
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${environment.serverHost}/api/feedback/questions/`, question);
  }

  createAnswerChoice(choice: any): Observable<Choice> {
    return this.http.post<Choice>(`${environment.serverHost}/api/feedback/answerchoices/`, choice);
  }

  patchAnswerChoice(id: string, data: any): Observable<Choice> {
    return this.http.patch<Choice>(`${environment.serverHost}/api/feedback/answerchoices/${id}/`, data);
  }

  deleteAnswerChoice(id: string): Observable<any> {
    return this.http.delete(`${environment.serverHost}/api/feedback/answerchoices/${id}/`);
  }

}


