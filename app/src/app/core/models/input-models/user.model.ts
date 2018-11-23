export class UserModel {
  constructor(
    public _id: string,
    public email : string,
    public password : string,
    public firstName: string,
    public lastName: string,
    //public roles: string[],
    //public createdProjects: string[],
    //public projects: string[],
    //public type: boolean,
    public salt: string,
    public image: string
    
  ) { } 
}