
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { CartService } from 'src/app/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isBackBtn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { 

  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof ActivationEnd) {
        if(val.snapshot.component['name'].toString() != 'CardsComponent'){
          this.isBackBtn = true;
        }else{
          this.isBackBtn = false;
        }
      }
   });
  }

}
