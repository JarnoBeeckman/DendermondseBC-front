(this.webpackJsonptoolbox=this.webpackJsonptoolbox||[]).push([[0],{11:function(e,t,n){"use strict";(function(e){n.d(t,"d",(function(){return O})),n.d(t,"b",(function(){return m})),n.d(t,"c",(function(){return x})),n.d(t,"a",(function(){return v}));var r=n(3),a=n(10),c=n(2),s=n.n(c),i=n(0),u=n(16),o=n(23),l=n(14),d=n(1),b=Object(i.createContext)(),j=l.token_key;function p(t){if(!t)return{};var n=t.split(".")[1],r=e.from(n,"base64").toString("ascii");return JSON.parse(r)}function f(e){return e?("number"!==typeof e&&(e=Number(e)),isNaN(e)?null:new Date(1e3*e)):null}var h=function(){return Object(i.useContext)(b)},O=function(){var e=h(),t=e.loading,n=e.error,r=e.token,a=e.lid,c=e.ready,s=e.hasRole;return{loading:t,error:n,token:r,lid:a,ready:c,isAuthed:Boolean(r),hasRole:s}},m=function(){return h().login},x=function(){return h().logout},v=function(e){var t=e.children,n=Object(i.useState)(!1),c=Object(a.a)(n,2),l=c[0],h=c[1],O=Object(i.useState)(!1),m=Object(a.a)(O,2),x=m[0],v=m[1],g=Object(i.useState)(""),w=Object(a.a)(g,2),k=w[0],N=w[1],y=Object(i.useState)(localStorage.getItem(j)),S=Object(a.a)(y,2),C=S[0],L=S[1],B=Object(i.useState)(null),D=Object(a.a)(B,2),I=D[0],A=D[1],F=Object(i.useCallback)(function(){var e=Object(r.a)(s.a.mark((function e(t,n){var r,a,c,i,l;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=p(t),a=r.exp,c=r.userId,i=f(a),(l=i>=new Date)?localStorage.setItem(j,t):(localStorage.removeItem(j),t=null,i&&N("Session expired, sign in again")),u.b(t),h(t&&l),L(t),n||!l){e.next=11;break}return e.next=10,o.a(c);case 10:n=e.sent;case 11:A(n);case 12:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),[]);Object(i.useEffect)((function(){F(C)}),[C,F]);var J=Object(i.useCallback)(function(){var e=Object(r.a)(s.a.mark((function e(t){var n,r,a,c,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.mail,r=t.wachtwoord,e.prev=1,v(!0),N(""),e.next=6,o.b(n,r);case 6:return a=e.sent,c=a.token,i=a.user,e.next=11,F(c,i);case 11:return e.abrupt("return",!0);case 14:return e.prev=14,e.t0=e.catch(1),console.error(e.t0),N("Login failed"),e.abrupt("return",!1);case 19:return e.prev=19,v(!1),e.finish(19);case 22:case"end":return e.stop()}}),e,null,[[1,14,19,22]])})));return function(t){return e.apply(this,arguments)}}(),[F]),R=Object(i.useCallback)(function(){var e=Object(r.a)(s.a.mark((function e(t){var n,r,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,v(!0),N(""),e.next=5,o.c(t);case 5:return n=e.sent,r=n.token,a=n.lid,e.next=10,F(r,a);case 10:return e.abrupt("return",!0);case 13:return e.prev=13,e.t0=e.catch(0),N(e.t0),e.abrupt("return",!1);case 17:return e.prev=17,v(!1),e.finish(17);case 20:case"end":return e.stop()}}),e,null,[[0,13,17,20]])})));return function(t){return e.apply(this,arguments)}}(),[F]),z=Object(i.useCallback)((function(){F(null),A(null)}),[F]),E=Object(i.useCallback)((function(e){return!!I&&I.roles.include(I)}),[I]),P=Object(i.useMemo)((function(){return{loading:x,error:k,token:C,lid:I,login:J,logout:z,register:R,ready:l,hasRole:E}}),[x,k,C,I,J,z,R,l,E]);return Object(d.jsx)(b.Provider,{value:P,children:t})}}).call(this,n(49).Buffer)},14:function(e){e.exports=JSON.parse('{"url":"https://dendermondse-bc.herokuapp.com/api/","token_key":"auth_token","pages":{"lid":["account gegevens","kledij bestellen"],"trainer":[],"admin":[],"penningmeester":[],"beheerder":["account gegevens","kledij bestellen"]}}')},16:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return i}));var r=n(38),a=n.n(r),c=n(14),s=a.a.create({baseURL:c.url}),i=function(e){e?s.defaults.headers.Authorization="Bearer ".concat(e):delete s.defaults.headers.Authorization}},23:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return u})),n.d(t,"a",(function(){return o}));var r=n(3),a=n(2),c=n.n(a),s=n(16),i=function(){var e=Object(r.a)(c.a.mark((function e(t,n){var r,a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.post("account/login",{mail:t,wachtwoord:n});case 2:return r=e.sent,a=r.data,e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),u=function(){var e=Object(r.a)(c.a.mark((function e(t,n,r,a,i,u,o,l,d,b,j){var p,f;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.post("account",{mail:t,wachtwoord:n,voornaam:r,achternaam:a,adres:i,postcode:u,woonplaats:o,geslacht:l,geboortedatum:d,gsm:b,spelertype:j});case 2:return p=e.sent,f=p.data,e.abrupt("return",f);case 5:case"end":return e.stop()}}),e)})));return function(t,n,r,a,c,s,i,u,o,l,d){return e.apply(this,arguments)}}(),o=function(){var e=Object(r.a)(c.a.mark((function e(t){var n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("account/".concat(t));case 2:return n=e.sent,r=n.data,e.abrupt("return",r);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},47:function(e,t,n){},48:function(e,t,n){},77:function(e,t,n){},78:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(37),s=n.n(c),i=(n(47),n(48),n(22)),u=n(4),o=n(11),l=n(17),d=n(39),b=n(1),j=["children"];function p(e){var t=e.children,n=Object(d.a)(e,j),r=Object(o.d)().isAuthed,a=Object(u.h)().pathname;return Object(b.jsx)(u.b,Object(l.a)(Object(l.a)({},n),{},{children:r?t:Object(b.jsx)(u.a,{from:a,to:"/login"})}))}var f=n(3),h=n(2),O=n.n(h),m=n(14);function x(){var e=Object(o.d)(),t=e.lid,n=e.loading,a=e.error,c=Object(o.c)(),s=Object(r.useCallback)(Object(f.a)(O.a.mark((function e(){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c();case 2:case"end":return e.stop()}}),e)}))),[c]),i=Object(r.memo)((function(e){return Object(b.jsx)("button",{className:"keuzemenubutton",onClick:e.click,children:e.page},e.page)}));return t?t.roles.includes("beheerder")?Object(b.jsxs)("div",{className:"buttongrid flex-w",children:[m.pages.beheerder.map((function(e){return Object(b.jsx)(i,{page:e},e)})),Object(b.jsx)(i,{page:"Log uit",click:s},"Log uit")]}):Object(b.jsxs)("div",{className:"buttongrid flex-w",children:[t.roles.map((function(e){return m.pages[e].map((function(e){return Object(b.jsx)(i,{page:e},e)}))})),Object(b.jsx)(i,{})]}):n?Object(b.jsx)("div",{children:"Loading..."}):a?Object(b.jsx)("div",{children:a}):Object(b.jsx)(b.Fragment,{})}var v=n.p+"static/media/logoBC.dcd27ad3.jpg";function g(){return Object(b.jsx)("div",{className:"limit",children:Object(b.jsx)("div",{className:"cntr",children:Object(b.jsxs)("div",{className:"wrapper",children:[Object(b.jsx)("img",{src:v,alt:"logo"}),Object(b.jsx)(x,{})]})})})}var w=n(42);n(77);function k(){var e=Object(o.b)(),t=Object(u.g)(),n=Object(o.d)(),a=n.loading,c=n.error,s=n.isAuthed,i=Object(w.a)(),d=i.register,j=i.handleSubmit,p=i.formState.errors;Object(r.useEffect)((function(){s&&t.push("/")}));var h=Object(r.useCallback)(function(){var n=Object(f.a)(O.a.mark((function n(r){var a,c;return O.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return a=r.mail,c=r.wachtwoord,n.next=3,e({mail:a,wachtwoord:c});case 3:n.sent&&t.push("/");case 5:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),[e,t]);return Object(b.jsx)("div",{className:"limit",children:Object(b.jsx)("div",{className:"conlogin",children:Object(b.jsx)("div",{className:"wraplogin",children:Object(b.jsxs)("form",{className:"loginform validate-form flex-sb flex-w",onSubmit:j(h),children:[Object(b.jsx)("span",{className:"loginformtitle",children:"Login"}),c?Object(b.jsx)("p",{className:"errorlogin",children:JSON.stringify(c)}):null,Object(b.jsxs)("div",{className:"wrapinput validate-input",children:[Object(b.jsx)("input",Object(l.a)({id:"mail",className:"input",type:"text",defaultValue:"","data-cy":"mail",placeholder:"mail"},d("mail",{required:"Dit is vereist"}))),Object(b.jsx)("span",{className:"focusinput"})]}),p.mail&&Object(b.jsx)("p",{children:p.mail.message}),Object(b.jsxs)("div",{className:"wrapinput validate-input",children:[Object(b.jsx)("input",Object(l.a)({id:"pw",className:"input",type:"password","data-cy":"wachtwoord",placeholder:"wachtwoord"},d("wachtwoord",{required:"Dit is vereist"}))),Object(b.jsx)("span",{className:"focusinput"})]}),p.wachtwoord&&Object(b.jsx)("p",{children:p.wachtwoord.message}),Object(b.jsx)("div",{className:"conloginform",children:Object(b.jsx)("button",{type:"submit",className:"loginbutton",disabled:a,"data-cy":"login",children:"Log in"})})]})})})})}var N=function(){return Object(b.jsx)(o.a,{children:Object(b.jsx)(i.a,{children:Object(b.jsxs)(u.d,{children:[Object(b.jsx)(u.b,{exact:!0,path:"/login",children:Object(b.jsx)(k,{})}),Object(b.jsx)(u.b,{exact:!0,path:"/DendermondseBC-front",children:Object(b.jsx)(u.a,{to:"/"})}),Object(b.jsx)(p,{exact:!0,path:"/",children:Object(b.jsx)(g,{})})]})})})},y=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,79)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,s=t.getTTFB;n(e),r(e),a(e),c(e),s(e)}))};s.a.render(Object(b.jsx)(a.a.StrictMode,{children:Object(b.jsx)(N,{})}),document.getElementById("root")),y()}},[[78,1,2]]]);
//# sourceMappingURL=main.68ea86ef.chunk.js.map