import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Values } from './shopping-services/values';
import { Config } from './shopping-services/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class CmsService {
    posts : any = [];
    post : any;
  constructor(public http: Http, public values : Values, public config : Config){}

  validateAuthToken(token){
        var params = {
            userToken : token
        };
        return new Promise(resolve => {
            this.http.post(this.config.cmsurl + '/posts/test' , params).map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
        });
  }

  createPost(subject, content, category,token, files){
      let params = new FormData();
      params.append('addContentSubject', subject);
      params.append('addContents', content);
      params.append('addCategory', category);
      params.append('userToken', token);
      for(let file of files){
        params.append('UploadFile', file);
      }
      return new Promise(resolve =>{
        this.http.post(this.config.cmsurl + '/posts?mode=add', params).map(res => res.json())
        .subscribe(data => {
            resolve(data);
        });
      });
  }

  createLike(postid, token){
      var params ={
            likesId : postid,
            userToken : token
      }
      return new Promise(resolve =>{
          this.http.post(this.config.cmsurl + '/posts/likes', params).map(res => res.json())
          .subscribe(data =>{
              resolve(data);
          });
      });
  }

  createReply(postid, contents,token){
      var params = {
        replyComment : contents,
        replyId : postid,
        userToken : token
      }
      return new Promise(resolve =>{
          this.http.post(this.config.cmsurl + '/posts/reply', params).map(res => res.json())
          .subscribe(data =>{
              resolve(data);
          });
      })
  }

  createReview(postid, rating,content, token, files){

      let params = new FormData();
      params.append('addContents', content);
      params.append('postid', postid);
      params.append('userToken', token);
      params.append('rating', rating);
      for(let file of files){
        params.append('UploadFile', file);
      }

      return new Promise(resolve =>{
          this.http.post(this.config.cmsurl + '/posts/showReview?mode=add', params).map(res => res.json())
          .subscribe(data =>{
              resolve(data);
          })
      })
  }

  removePost(postid){
      return new Promise(resolve =>{
          this.http.get(this.config.cmsurl + '/posts/delete?id=' + postid).map(res => res.json())
          .subscribe(data =>{
              resolve(data);
          });
      })
  }

  removeComment(postid, replyid){
      var param = {
          postid : postid,
          replyid : replyid
      };
      return new Promise(resolve =>{
          this.http.post(this.config.cmsurl + '/posts/deleteReply', param).map(res => res.json())
          .subscribe(data =>{
              resolve(data);
          });
      });
  }

  getCategory(){
      return new Promise(resolve =>{
          this.http.get(this.config.cmsurl + '/posts/category').map(res => res.json())
          .subscribe(data =>{
             resolve(data);
          });
      });
  }

  getPosts(page:number = 1, category:number = 0){
      return this.http.get(this.config.cmsurl + '/posts/?page=' + page + '&category=' + category).map(res=> res.json());
  }

  getPost(postid){
      return this.http.get(this.config.cmsurl + '/posts/view?id=' + postid).map(res=> res.json());
  }

  getRecentPosts(page:number = 1){
      return this.http.get(this.config.cmsurl+ '/posts/getCommunityPost?page=' + page).map(res=>res.json());
  }

  getReviews(page: number = 1, postid: number = 0){
      return this.http.get(this.config.cmsurl + '/posts/showReview?page=' + page + '&postid=' + postid).map(res => res.json());
  }

  getNotices(postid, category){
      return this.http.get(this.config.cmsurl + '/posts/post?postid=' + postid + '&category=' + category).map(res => res.json());
  }


  receiveSmsVerify(phonenum){
      return this.http.get(this.config.cmsurl + '/sms/sendOtp?phonenum=' + phonenum).map(res => res.json());
  }

  verifySms(phonenum, code){
    return this.http.get(this.config.cmsurl + '/sms/verifyOtp?phonenum=' + phonenum + '&code=' + code).map(res => res.json());
  }

  receiveSmsAcount(phonenum, price){
    return this.http.get(this.config.cmsurl + '/sms/sendAccount?phonenum=' + phonenum + '&price=' + price).map(res => res.json());
  }

  dataURItoBlob(b64Data) {
    let contentType = 'image/png';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data); //decode base64
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}
