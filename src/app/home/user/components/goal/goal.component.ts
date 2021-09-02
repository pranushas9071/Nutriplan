import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css'],
})
export class GoalComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {}

  userGoal = this.fb.group({
    goalPerWeek: new FormControl(0.75),
  });

  aptWeight: number = 0;
  weight: number = 0;
  BMI: number = 0;
  status: string = '';
  weeks: number = 0;

  async ngOnInit(): Promise<void> {
    const username = localStorage.getItem('username');
    if (typeof username == 'string') {
      const weight = await this.taskService.getUserAptWeight(username);
      const value = Object.values(weight);
      this.aptWeight = value[0];
      this.weight = value[1];
      this.BMI = value[2];
      this.status = value[3];
      // console.log(this.aptWeight);
    }
  }

  onChange() {
    let diff = this.weight - this.aptWeight;
    if (diff < 0) {
      diff = diff * -1;
    }
    this.weeks = Math.ceil(diff / this.userGoal.value.goalPerWeek);
  }

  async updateGoal() {
    const username = localStorage.getItem('username');
    if (typeof username == 'string') {
      const result = await this.taskService.updateGoal(
        username,
        this.userGoal.value.goalPerWeek
      );
      this.router.navigate(['/dashboard']);
    }
  }
}