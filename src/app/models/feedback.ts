
export type Choice = {
  id: string;
  text: string;
}



export type Question = {
  id: string;
  text: string;
  allowComment: boolean;
  type: 'text' | 'radio' | 'checkbox';
  order: number;
  choices: Choice[];
}

export class Answer {
  feedbackId: string = '';
  questionId: string = '';
  choice: string = '';
  text: string = '';

  constructor(data: any) {
    Object.assign(this, data);
  }

}
