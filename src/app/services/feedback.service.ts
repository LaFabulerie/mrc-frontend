import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer, Question } from '../models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {


  constructor(
    private http: HttpClient,
    ) { }


  createFeedback() {
    return this.http.post<{id: string}>(`${environment.apiHost}/feedback/feedbacks/`, {});
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiHost}/feedback/questions`)
  }

  createAnswer(answer: Answer): any {
    return this.http.post(`${environment.apiHost}/feedback/answers/`, answer);
  }

}


