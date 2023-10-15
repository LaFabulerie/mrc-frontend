export type Feedback = {
  id: string;
  repr: string;
  answers: Answer[];
}



export type Choice = {
  id: string;
  text: string;
}



export type Question = {
  id?: string;
  text: string;
  allowComment: boolean;
  type: 'text' | 'radio' | 'checkbox';
  order: number;
  choices: Choice[];
}

export class Answer {
  feedbackId: string = '';
  questionId: string = '';
  question?: Question;
  question_text?: string = '';
  choice: string = '';
  text: string = '';

  constructor(data: any) {
    Object.assign(this, data);
  }

}
