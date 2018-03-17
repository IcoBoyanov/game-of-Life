import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

	searchTitle = '';
	idCollection = [];
	url = 'http://www.omdbapi.com/?apikey=810bbb39&'

  constructor(private http: HttpClient) { }

  ngOnInit() {
  	this.idCollection = JSON.parse(localStorage.getItem('collection'));
  }


  getMovie(title)
  {
  	console.log("Requesting movie..");
  	this.http.get(this.url+'t='+title).subscribe(data => {
  		if(data.Response != "False")
  		{
  			console.log(data);
  			this.idCollection.push(data.imdbID);
     	 	localStorage.setItem('collection',JSON.stringify(this.idCollection));
  			console.log(localStorage);
  		}else{
  			console.log("Bad name");
  		}
    });
  }

  clearMovies()
	{
		this.idCollection = [];
		localStorage.setItem('collection',JSON.stringify(this.idCollection));
		console.log("clear");
	}  

	destroyEl(id:string )
	{
		for(let i = 0; i< this.idCollection.length; i++)
		{
				if(this.idCollection[i] === id)
				{
					this.idCollection.splice(i,1);
					break;
				}
		}
		console.log(id);
	}

}
