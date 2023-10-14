import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer, Question } from '../models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private questionsSubject: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  public questions$: Observable<Question[]> = this.questionsSubject.asObservable();


  constructor(
    private http: HttpClient,
    ) { }


  createFeedback() {
    return this.http.post<{id: string}>(`${environment.serverHost}/api/feedback/feedbacks/`, {});
  }

  loadQuestions() {
    this.http.get<Question[]>(`${environment.serverHost}/api/feedback/questions`).subscribe(questions => {
      this.questionsSubject.next(questions);
    })
  }

  createAnswer(answer: Answer): any {
    return this.http.post(`${environment.serverHost}/api/feedback/answers/`, answer);
  }

}


