import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  intervalId = 0;
  seconds = 31;
  message = '';
  constructor(private appService:AppService) { }

  ngOnInit(): void {
    this.start();
  }
  ngOnDestroy() { this.clearTimer(); }

  clearTimer() { clearInterval(this.intervalId); }

  start() { this.countDown(); }
  stop()  {
    this.appService.isTimerEnd = true;
    this.clearTimer();
    this.message = `00:${this.seconds < 10 ? '0'+this.seconds:this.seconds}`;
  }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      if(this.appService.isTimerEnd)
      {
        this.appService.isTimerEnd = false;
      }
      this.seconds -= 1;
      if (this.seconds === 0) {
         this.stop();
      } else {
        if (this.seconds < 0) { this.seconds = 10; } // reset
        this.message = `00:${this.seconds < 10 ? '0'+this.seconds:this.seconds}`;
      }
    }, 1200);
  }
}
