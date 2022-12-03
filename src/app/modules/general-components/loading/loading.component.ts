import { Component, OnInit } from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],

})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
