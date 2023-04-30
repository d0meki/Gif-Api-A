import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList:Gif[] = []
  private _tagsHistory: string[] = []
  private apiKey: string = 'pgMBxfoo4ToNcDSt6A3WDYhFOtG5oE2g'
  private serviceUrl:string = 'https://api.giphy.com/v1/gifs'


  constructor(private http:HttpClient) {
    this.loadLocalStorage()
    console.log('Gift Server read');
   }


  get tagsHistory() {
    return [...this._tagsHistory]
  }


  searchTag(tag: string): void {
    if (tag.length == 0) {
      return
    }
    this.organizeHystory(tag)
    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit', '10')
      .set('q',tag)
      console.log(tag);


    this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params})
      .subscribe( (res) => {
        this.gifList = res.data
        // console.log(res);

      } )

    // this._tagsHistory.unshift(tag)
    // console.log(this._tagsHistory);

  }

  private organizeHystory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag != tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10)
    this.saveLocalStorage();
  }

  private saveLocalStorage(){
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }
  private loadLocalStorage(){
    if (!localStorage.getItem('history')) {
      return
    }
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!)

    if (this._tagsHistory.length === 0) {
      return
    }
    this.searchTag(this._tagsHistory[0]);
  }



}
