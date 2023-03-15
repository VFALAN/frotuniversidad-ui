import { Component, OnInit } from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],

})
export class LoadingComponent implements OnInit {

  constructor(public _loader : LoadingService) { }

  ngOnInit(): void {
  }

}
