import { Values } from './../../services/shopping-services/values';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { Service } from '../../services/shopping-services/service';
import { Functions } from './../../services/shopping-services/functions';
import { CmsService } from '../../services/cms-service.service';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the CommunityWritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-community-write',
  templateUrl: 'community-write.html',
})
export class CommunityWritePage {

  categories:any;
  selectCategory:any = 0;
  content : any;
  title: any;
  file: File;

  imageURI:any;
  imageFileName:any;

  selectedImage: any;
  processedImages: any = [];
  fileimgs : any = [];
  showTitle: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public service: Service,
    public cmsService: CmsService,
    public values: Values,
    public functions : Functions,
    public loadingCtrl: LoadingController,
    private camera: Camera,
    public toastCtrl: ToastController,
    //public imagePicker : ImagePicker
    ) {
    this.selectCategory = navParams.data;
    this.categories = [
      {
        name: "메인",
        id: 0,
        value : "main"
      },
      {
        name: "부부클리닉",
        id: 1,
        value : "clinic"
      },
      {
        name: "중고장터",
        id: 2,
        value : "usedmarket"
      },
      {
        name: "자랑하기",
        id: 3,
        value : "boast"
      }
    ]
  }

  ionViewDidLoad() {
    
  }

  doWrite(){
    console.log(this.categories[this.selectCategory]);
    console.log(this.content);
    console.log(this.title);
    if(this.title == undefined)
      this.functions.showAlert("에러", "제목을 적어 주세요");
    else if(this.content == undefined)
      this.functions.showAlert("에러", "내용을 입력해 주세요");
    else if(this.selectCategory == undefined || this.selectCategory == 0)
      this.functions.showAlert("에러", "카테고리를 선택해 주세요");
    else{
      let loading = this.loadingCtrl.create({
        content: "글을 업로드 중입니다"
      });
      loading.present();
      let fileblobs = []
      for(let file of this.fileimgs){
        fileblobs.push(this.cmsService.dataURItoBlob(file));
      }


      this.cmsService.createPost(this.title, this.content, this.selectCategory, this.values.token, fileblobs).then((results) => {
        this.functions.showAlert("성공", "글쓰기 성공!");
        loading.dismiss();
        this.navCtrl.pop();
      })
    } 
  }

  getImage() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
    }

    if(this.fileimgs.length >= 3){
      this.functions.showAlert('에러', '이미지는 최대 3장 업로드 가능합니다.')
    }
    else{
      this.camera.getPicture(options).then((imageData) => {
        //this.imageURI = imageData;
        this.fileimgs.push('data:image/jpeg;base64,' + imageData);
      }, (err) => {
        console.log(err);
        this.presentToast(err);
      });
    }
  }

  /*getImage(){
    this.imagePicker.getPictures({
      maximumImagesCount : 4,
      quality : 40
    }).then((results) => {
      for(var i=0 ; i < results.length; i++){
        console.log('data:image/jpeg;base64,' + results);
      }
    }, (err) => {});
  }*/

  


  


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  




}
