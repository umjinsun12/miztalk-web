import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as Config from '../wordpress.config';
import { Observable } from 'rxjs/Observable';
import { Values } from './shopping-services/values';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class WordpressService {
  constructor(public http: Http, public values : Values){}

  getRecentPosts(categoryId:number, page:number = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";
  
    console.log(Config.WORDPRESS_REST_API_URL+ 'posts?page=' + page+ category_url);

    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + category_url)
    .map(res => res.json());
  }

  getComments(postId:number, page:number = 1){
    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + "comments?post=" + postId
      + '&page=' + page)
    .map(res => res.json());
  }

  getAuthor(author){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "users/" + author)
    .map(res => res.json());
  }

  getPostCategories(post){
    let observableBatch = [];

    post.categories.forEach(category => {
      observableBatch.push(this.getCategory(category));
    });

    return Observable.forkJoin(observableBatch);
  }

  getCategory(category){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "categories/" + category)
    .map(res => res.json());
  }

  getAllCategory(){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "categories/")
    .map(res => res.json());
  }

  createComment(postId, comment){
    let header: Headers = new Headers();
    header.append('Authorization', 'Bearer ' + this.values.token);

    return new Promise(resolve =>{
      this.http.post(Config.WORDPRESS_REST_API_URL + "comments?token=" + this.values.token, {
        author_name: this.values.customerName,
        author_email: this.values.customerId,
        post: postId,
        content: comment
      },{ headers: header }).map(res => res.json()).subscribe(data => {
        resolve(data);
      });
    });
  }

  getPostbyId(postId){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "posts/" + postId + "?_embed")
    .map(res => res.json());
  }
  
  getPostbyCategory(category){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "posts?categories=" + category)
    .map(res => res.json());
  }

  getPostEmbedbyCategory(category, page:number = 1){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "posts?_embed&categories=" + category + "&page=" + page)
    .map(res => res.json());
  }

  getPostMediabyIdheader(postId, page:number = 1){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "media?parent=" + postId + "&page=" + page)
    .map(res => res);
  }
  getPostMediabyId(postId, page:number = 1){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "media?parent=" + postId + "&page=" + page)
    .map(res => res.json());
  }
}