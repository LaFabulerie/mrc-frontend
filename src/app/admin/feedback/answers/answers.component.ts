import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Feedback } from 'src/app/models/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {

  feedbacks: Feedback[] = []
  currentFeedback: Feedback | null = null;

  constructor(
    private feedbackService: FeedbackService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.feedbackService.getFeedbacks().subscribe((feedbacks: Feedback[]) => {
      this.feedbacks = feedbacks;
      this.currentFeedback = feedbacks[0] || null;
    })
  }

  setCurrentFeedback(feedback: Feedback) {
    this.currentFeedback = feedback;
  }

  removeCurrentFeedback(event: any) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cet retour utisateur ?',
      target: event.target as EventTarget,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'confirmPopup',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.feedbackService.deleteFeedback(this.currentFeedback!.id).subscribe(() => {
          this.feedbacks = this.feedbacks.filter(feedback => feedback.id !== this.currentFeedback!.id);
          this.currentFeedback = this.feedbacks[0] || null;
        });
      },
      reject: () => {}
    });
  }


}
