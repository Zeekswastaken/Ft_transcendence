// export class UserDtosingin {
//     email:String;
//     password:String;
//     image:String;
//     constructor(){
//         this.image='none';
//     }
// }
export class UserDto {
    username:String;
    password:String;
    repassword:String;
    avatar_url:String;
    gender:String;
    birthDay: Date;
    email:String;
    constructor(){
        this.avatar_url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU';
        this.repassword = 'none';
        this.password = 'Oauth';
        this.username = ''
    }
}

export class UserDto2 {
    username:String;
    password:String;
    avatar_URL:String;
    gender:String;
    birthDay: Date;
    constructor(){
        this.avatar_URL='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU';
        this.password = 'Oauth';
        this.username = ''
    }
}

export class jwtDTO{
    username:String;
    avatar_URL: String;
    gender: String;
    birthDay:Date;
}

export class MoreInfos{
    id:number;
    avatar_URL:String;
    gender:String;
    birthDay: Date;
    cookie:String;
    constructor(){
        //this.avatar_URL='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU';
        this.id = -1;
    }
}
export class TO_update{
    avatar_URL:String;
    gender:String;
    birthDay: Date;
    constructor(){
       // this.avatar_URL='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU';
    }
}
export  class update{
    username:String;
    password:String;
    Bio:String;
    privacy:String;
    // constructor(){
    //     this.privacy = true;
    // }
}
// export class UserDtosave {
//     username:String;
//     email:String;
//     password:String;
//     image:String;
//     constructor(){
//         this.image='none';
//     }
// }
// export class UserOauth{
//     username:String;
//     password:String;
//     email:String;
//     image:String;
//     constructor(){
//         this.image='none';
//         this.password='Oauth';
//     }
// }
export class tokenDto {
    token:String
}