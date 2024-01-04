"use strict";(self.webpackChunkrun_169=self.webpackChunkrun_169||[]).push([[558],{7558:(Z,l,s)=>{s.r(l),s.d(l,{AuthModule:()=>v});var h=s(6814),a=s(4109),t=s(5879),n=s(6223),d=s(6402),u=s(2939),m=s(9157),c=s(2032),g=s(2296);const f=[{path:"",component:(()=>{class o{constructor(i,e,r){this.authService=i,this.snackbar=e,this.router=r,this.errorMessages=(0,t.Flj)(()=>this.authService.errorMessage()),this.loginForm=new n.cw({email:new n.NI("",[n.kI.required,n.kI.email]),password:new n.NI("",[n.kI.required])}),(0,t.cEC)(()=>{this.errorMessages()&&this.snackbar.open(this.errorMessages(),"Dismiss").afterDismissed().subscribe({next:()=>{this.authService.errorMessage.set("")}})})}ngOnInit(){this.authService.isLoggedIn()&&this.router.navigate(["/"])}login(){const i=this.loginForm.get("email")?.value??"",e=this.loginForm.get("password")?.value??"";this.authService.login(i,e)}static#t=this.\u0275fac=function(e){return new(e||o)(t.Y36(d.$),t.Y36(u.ux),t.Y36(a.F0))};static#o=this.\u0275cmp=t.Xpm({type:o,selectors:[["ng-component"]],decls:19,vars:2,consts:[["autocomplete","none",3,"formGroup","ngSubmit"],[1,"full-width"],["type","email","matInput","","formControlName","email","autocomplete","none"],["type","password","matInput","","formControlName","password","autocomplete","none"],[1,"forgot-email"],["routerLink","/passwords/forgot"],["mat-raised-button","","color","primary","type","submit",3,"disabled"]],template:function(e,r){1&e&&(t.TgZ(0,"h1"),t._uU(1,"Login"),t.qZA(),t.TgZ(2,"form",0),t.NdJ("ngSubmit",function(){return r.login()}),t.TgZ(3,"div")(4,"mat-form-field",1)(5,"mat-label"),t._uU(6,"E-mail"),t.qZA(),t._UZ(7,"input",2),t.qZA()(),t.TgZ(8,"div")(9,"mat-form-field",1)(10,"mat-label"),t._uU(11,"Password"),t.qZA(),t._UZ(12,"input",3),t.qZA()(),t.TgZ(13,"div",4),t._uU(14," Forgot your password? "),t.TgZ(15,"a",5),t._uU(16,"Reset it here."),t.qZA()(),t.TgZ(17,"button",6),t._uU(18," Login "),t.qZA()()),2&e&&(t.xp6(2),t.Q6J("formGroup",r.loginForm),t.xp6(15),t.Q6J("disabled",r.loginForm.invalid))},dependencies:[a.rH,n._Y,n.Fj,n.JJ,n.JL,n.sg,n.u,m.KE,m.hX,c.Nt,g.lW],styles:[".forgot-email[_ngcontent-%COMP%]{margin-bottom:15px}a[_ngcontent-%COMP%]:link, a[_ngcontent-%COMP%]:visited, a[_ngcontent-%COMP%]:active, a[_ngcontent-%COMP%]:hover{color:#00f}"]})}return o})()}];let p=(()=>{class o{static#t=this.\u0275fac=function(e){return new(e||o)};static#o=this.\u0275mod=t.oAB({type:o});static#n=this.\u0275inj=t.cJS({imports:[a.Bz.forChild(f),a.Bz]})}return o})(),v=(()=>{class o{static#t=this.\u0275fac=function(e){return new(e||o)};static#o=this.\u0275mod=t.oAB({type:o});static#n=this.\u0275inj=t.cJS({imports:[h.ez,p,n.UX,m.lN,c.c,g.ot,u.ZX]})}return o})()}}]);