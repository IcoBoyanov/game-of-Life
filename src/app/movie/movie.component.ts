import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
	
	url = 'http://www.omdbapi.com/?apikey=810bbb39&';
	@Input() ID:string = '';
	movie = {};



  constructor(private http: HttpClient)
   { 
  }

  ngOnInit() {

	this.movie = {};
   	console.log(this.ID);
   	console.log(this.movie);
   	console.log(this.url);
  	this.http.get(this.url+'i='+this.ID).subscribe(data => {
  		this.movie.title = data.Title;
  		this.movie.year = data.Year;
      this.movie.description = data.Plot;
      this.movie.genre = data.Genre;
      this.movie.director = data.Director;
      this.movie.actors = data.Actors;
  		if(data.Poster == "N/A"){
  				this.movie.imgSrc = "https://placehold.it/300x425"
  		}else{

  		this.movie.imgSrc = data.Poster;
  		}
  	});
  }


}
