(window.webpackJsonp=window.webpackJsonp||[]).push([[3,10],{20:function(e,s,t){"use strict";var a=t(0);var n=[function(e,s,t){return["pre",s,"{white-space:pre-wrap;font-size:.8125rem;font-family:Arial,Helvetica,sans-serif}table",s,"{table-layout:fixed;width:100%}"].join("")}],i=t(10);function o(e,s,t,n){const{h:o,t:l,b:r,c:c,k:d,d:p,i:h}=e,{_m0:u,_m1:m,_m2:v}=n;return[s.yearEvents?o("div",{key:0},[o("div",{classMap:{"slds-card":!0},key:1},[o("div",{classMap:{"slds-card__header":!0},key:2},[o("div",{classMap:{"slds-media":!0,"slds-media--center":!0,"slds-has-flexi-truncate":!0},key:3},[o("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-event":!0},attrs:{title:"Description of icon when needed"},key:4},[o("svg",{classMap:{"slds-icon":!0},attrs:{"aria-hidden":"true"},key:5},[o("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#event")},key:6},[])]),o("span",{classMap:{"slds-assistive-text":!0},key:7},[l("Description of icon when needed")])]),o("div",{classMap:{"slds-media__body":!0},key:8},[o("h2",{classMap:{"slds-p-left_small":!0,"slds-card__header-title":!0},key:9},[s.isHome?l("Upcoming Events"):null,s.isHome?null:o("select",{key:10,on:{change:u||(n._m0=r(s.handleYearChange))}},[o("option",{attrs:{value:"2021"},key:11},[l("2021")]),o("option",{attrs:{value:"2020"},key:12},[l("2020")]),o("option",{attrs:{value:"2019"},key:13},[l("2019")]),o("option",{attrs:{value:"2018"},key:14},[l("2018")]),o("option",{attrs:{value:"2017"},key:15},[l("2017")]),o("option",{attrs:{value:"2016"},key:16},[l("2016")]),o("option",{attrs:{value:"2015"},key:17},[l("2015")])]),s.isHome?null:l("  Calendar of Events"),s.isHome?null:c("lightning-helptext",i.a,{classMap:{"slds-var-p-left_small":!0},props:{content:"Select a year from the dropdown to view a list of events for that year. Click on an event to view event details and/or the trip report for the event."},key:18},[])])])])]),o("div",{classMap:{"slds-card__body":!0},key:19},[o("div",{classMap:{"slds-scrollable--y":!0,"slds-is-relative":!0},key:20},[s.loading?o("div",{classMap:{"slds-spinner_container":!0},key:21},[o("div",{classMap:{"slds-spinner":!0,"slds-spinner_medium":!0,"slds-spinner_brand":!0},attrs:{role:"status"},key:22},[o("span",{classMap:{"slds-assistive-text":!0},key:23},[l("Loading")]),o("div",{classMap:{"slds-spinner__dot-a":!0},key:24},[]),o("div",{classMap:{"slds-spinner__dot-b":!0},key:25},[])])]):null,o("table",{classMap:{fixed_header:!0,"slds-table":!0,"slds-table_cell-buffer":!0,"slds-table_bordered":!0,"slds-table_col-bordered":!0},key:26},[o("thead",{key:27},[o("tr",{classMap:{"slds-text-heading--label":!0},key:28},[o("th",{attrs:{scope:"col"},key:29},[o("span",{classMap:{"slds-truncate":!0},key:30},[l("Date(s)")])]),o("th",{attrs:{scope:"col"},key:31},[o("span",{classMap:{"slds-truncate":!0},key:32},[l("Event")])])])]),o("tbody",{key:33},h(s.yearEvents,(function(e){return o("tr",{classMap:{"slds-hint-parent":!0},attrs:{"data-item":e.id},key:d(34,e.id),on:{click:m||(n._m1=r(s.handleEventClick))}},[o("td",{classMap:{"slds-cell-wrap":!0},key:35},[p(e.date),o("div",{classMap:{"slds-float_right":!0},key:36},[e.cancelled?o("div",{classMap:{"slds-media__figure":!0},key:37},[o("span",{classMap:{"slds-icon_container":!0,"slds-icon-custom-custom60":!0},attrs:{title:"Cancelled"},key:38},[o("svg",{classMap:{"slds-icon":!0,"slds-icon_x-small":!0},attrs:{"aria-hidden":"true"},key:39},[o("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/custom-sprite/svg/symbols.svg#custom60")},key:40},[])])])]):null]),o("div",{classMap:{"slds-float_right":!0},key:41},[e.pdfFile?o("div",{classMap:{"slds-media__figure":!0},key:42},[o("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-knowledge":!0},attrs:{title:"Trip Report"},key:43},[o("svg",{classMap:{"slds-icon":!0,"slds-icon_x-small":!0},attrs:{"aria-hidden":"true"},key:44},[o("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#knowledge")},key:45},[])])])]):null]),o("div",{classMap:{"slds-float_right":!0},key:46},[e.details?o("div",{classMap:{"slds-media__figure":!0},key:47},[o("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-address":!0},attrs:{title:"Details"},key:48},[o("svg",{classMap:{"slds-icon":!0,"slds-icon_x-small":!0},attrs:{"aria-hidden":"true"},key:49},[o("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#address")},key:50},[])])])]):null])]),o("td",{classMap:{"slds-cell-wrap":!0},key:51},[p(e.event)])])})))])])]),s.isHome?o("footer",{classMap:{"slds-card__footer":!0},key:52},[o("a",{classMap:{"slds-card__footer-action":!0},attrs:{href:"#"},key:53,on:{click:v||(n._m2=r(s.handleViewAllEventsClick))}},[l("View All Events")])]):null])]):null]}var l=Object(a.registerTemplate)(o);o.stylesheets=[],n&&o.stylesheets.push.apply(o.stylesheets,n),o.stylesheetTokens={hostAttribute:"my-my-events_events-host",shadowAttribute:"my-my-events_events"};var r=t(9);class c extends a.LightningElement{constructor(...e){super(...e),this.year=void 0,this.yearEvents=void 0,this.showModal=!1,this.events={},this.selectedEvent=void 0,this.noEvents=!1,this.loading=!1,this.opts={autoScroll:!1,autoScrollTime:7},this.home=void 0,this.readOnly=!1}connectedCallback(){const e=(new Date).getFullYear();this.year=e,this.fetchEvents(e)}get options(){return Object.keys(this.events)}handleEventClick(e){const s=e.currentTarget.dataset.item;this.selectedEvent=this.yearEvents.find(e=>e.id===s),"0"!==s&&this.dispatchEvent(new CustomEvent("eventclick",{detail:this.selectedEvent}))}handleCloseClick(){this.showModal=!1}handleYearChange(e){const s=e.currentTarget.value;this.year=s,this.fetchEvents(s),this.dispatchEvent(new CustomEvent("eventyearchange"))}get eventCancelled(){return this.selectedEvent.cancelled}get tripReport(){return this.selectedEvent.tripReport}createEvents(e){if(this.yearEvents=[],0===e.length)return this.yearEvents=[{id:"0",date:"No Events Scheduled"}],void(this.noEvents=!0);this.noEvents=!1,e.sort((e,s)=>e.start>s.start?1:-1),e.forEach(e=>{let s=[];e.photos&&e.photos.forEach(e=>{s.push({header:""+e.caption,image:"https://fredbirds-098f.restdb.io/media/"+e.photo,href:"#"})}),e.species_sighted&&e.species_sighted.sort((e,s)=>e.common>s.common?1:-1),e.participants&&e.participants.sort((e,s)=>e.name>s.name?1:-1),this.yearEvents.push({id:e._id,date:this.getEventDate(new Date(e.start),e.end?new Date(e.end):null),event:e.event,sightings:e.species_sighted,details:e.details,tripReport:e.tripreport,participants:e.participants,start:e.start,cancelled:e.cancelled,photos:s,pdfFile:e.pdfFile})})}get showDetails(){return console.log(new Date<this.selectedEvent.start||"0"===this.yearEvents[0]._id),new Date<this.selectedEvent.start||"0"===this.yearEvents[0]._id}fetchEvents(e){this.loading=!0;const s="false"===this.home?sessionStorage.getItem(e+"events"):sessionStorage.getItem("upcomingevents");s?(this.createEvents(JSON.parse(s)),this.loading=!1):"false"===this.home?this.fetchYearEvents(e):this.fetchFutureEvents()}fetchFutureEvents(){const e=new Date;Object(r.d)(e,3).then(e=>{sessionStorage.setItem("upcomingevents",JSON.stringify(e)),this.createEvents(e),this.loading=!1}).catch(e=>{console.log(e)})}fetchYearEvents(e){Object(r.b)(e).then(s=>{sessionStorage.setItem(e+"events",JSON.stringify(s)),this.createEvents(s),this.loading=!1}).catch(e=>{console.log(e)})}getEventDate(e,s){const t=["January","February","March","April","May","June","July","August","September","October","November","December"];let a="";const n=t[e.getUTCMonth()];if(a=`${n} ${e.getUTCDate()}`,s){const e=t[s.getUTCMonth()];a+=n===e?" - "+s.getUTCDate():` - ${e} ${t[s.getUTCDate()]}`}return a}get isHome(){return"true"===this.home}handleViewAllEventsClick(){this.dispatchEvent(new CustomEvent("viewall",{detail:"events",bubbles:!0,composed:!0}))}}Object(a.registerDecorators)(c,{publicProps:{home:{config:0},readOnly:{config:0}},fields:["year","yearEvents","showModal","events","selectedEvent","noEvents","loading","opts"]});s.a=Object(a.registerComponent)(c,{tmpl:l})},25:function(e,s,t){"use strict";t.r(s);var a=t(0),n=t(19);function i(e,s,t,i){const{h:o,t:l,k:r,d:c,c:d,i:p,b:h}=e,{_m0:u}=i;return[o("article",{classMap:{"slds-card":!0},key:0},[o("div",{classMap:{"slds-card__header":!0,"slds-grid":!0},key:1},[o("header",{classMap:{"slds-media":!0,"slds-media_center":!0,"slds-has-flexi-truncate":!0},key:2},[o("div",{classMap:{"slds-media__figure":!0},key:3},[o("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-announcement":!0},attrs:{title:"account"},key:4},[o("svg",{classMap:{"slds-icon":!0,"slds-icon_medium":!0},attrs:{"aria-hidden":"true"},key:5},[o("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#announcement")},key:6},[])])])]),o("div",{classMap:{"slds-media__body":!0},key:7},[o("h2",{classMap:{"slds-card__header-title":!0},key:8},[l("Announcements")])])])]),o("div",{classMap:{"slds-card__body":!0,"slds-card__body_inner":!0},key:9},p(s.announcements,(function(e){return o("div",{classMap:{"slds-p-bottom_small":!0},key:r(10,e._id)},[o("div",{classMap:{"slds-text-heading_medium":!0},key:11},[c(e.headline)]),o("div",{classMap:{"slds-p-top_xx-small":!0},key:12},[d("lightning-formatted-rich-text",n.a,{props:{value:e.details},key:13},[])])])}))),s.showFooter?o("footer",{classMap:{"slds-card__footer":!0},key:14},[o("a",{classMap:{"slds-card__footer-action":!0},attrs:{href:"javascript:void(0);"},key:15,on:{click:u||(i._m0=h(s.handleViewAllClick))}},[l("View All Announcements")])]):null])]}var o=Object(a.registerTemplate)(i);i.stylesheets=[],i.stylesheetTokens={hostAttribute:"my-my-announcements_announcements-host",shadowAttribute:"my-my-announcements_announcements"};var l=t(9);class r extends a.LightningElement{constructor(...e){super(...e),this.home=!1,this.numRows=2,this.announcements=[]}connectedCallback(){this.fetchAnnouncements()}fetchAnnouncements(){const e=sessionStorage.getItem("announcements");e?this.announcements=this.home?JSON.parse(e).splice(0,this.numRows):this.announcements=JSON.parse(e):Object(l.a)().then(e=>{let s=e.length<this.numRows?e.length:this.numRows;sessionStorage.setItem("announcements",JSON.stringify(e)),this.announcements=this.home||1===e.length?e.splice(0,s):e}).catch(e=>{console.log(e)})}get showFooter(){return"true"===this.home}handleViewAllClick(){this.dispatchEvent(new CustomEvent("viewall",{detail:"announcements",bubbles:!0,composed:!0}))}}Object(a.registerDecorators)(r,{publicProps:{home:{config:0},numRows:{config:0}},fields:["announcements"]});s.default=Object(a.registerComponent)(r,{tmpl:o})},44:function(e,s,t){"use strict";t.r(s);var a=t(0);var n=[function(e,s,t){return[".main",s,"{background-color:#fff}.opening",s,"{font-size:1rem}.slds-carousel__panel.panel-hide",s,"{display:none}.slds-carousel__panel",s," img",s,"{max-height:60vh!important}.ebird",s,"{width:178px;height:85px}"].join("")}];var i=[function(e,s,t){return[".slds-carousel__panel.panel-hide",s,"{display:none}.slds-carousel__panel",s," img",s,"{max-height:60vh!important}.slds-carousel__image",s,"{object-fit:cover}"].join("")}];function o(e,s,t,n){const{b:i,h:o,gid:l,k:r,ti:c,d:d,fid:p,i:h}=e,{_m0:u,_m1:m}=n;return[o("div",{classMap:{"slds-carousel":!0},key:0},[o("div",{classMap:{"slds-carousel__stage":!0},key:1},[s.autoScroll?o("span",{classMap:{"slds-carousel__autoplay":!0},key:2},[s.showPlayIcon?null:o("button",{classMap:{"slds-button":!0,"slds-button_icon":!0,"slds-button_icon-border-filled":!0,"slds-button_icon-x-small":!0},attrs:{title:"Stop auto-play"},key:3,on:{click:u||(n._m0=i(s.togglePlay))}},[o("svg",{classMap:{"slds-button__icon":!0},attrs:{"aria-hidden":"true"},key:4},[o("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/utility-sprite/svg/symbols.svg#pause")},key:5},[])])]),s.showPlayIcon?o("button",{classMap:{"slds-button":!0,"slds-button_icon":!0,"slds-button_icon-border-filled":!0,"slds-button_icon-x-small":!0},attrs:{title:"resume auto-play"},key:6,on:{click:m||(n._m1=i(s.togglePlay))}},[o("svg",{classMap:{"slds-button__icon":!0},attrs:{"aria-hidden":"true"},key:7},[o("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/utility-sprite/svg/symbols.svg#play")},key:8},[])])]):null]):null,o("div",{classMap:{"slds-carousel__panels":!0},styleMap:{transform:"translateX(-0%)"},key:9},s.components?h(s.components,(function(e){return o("div",{className:e.contentClass,attrs:{id:l(e.contentId),role:"tabpanel","aria-hidden":e.hidden,"aria-labelledby":l(e.indicatorId)},key:r(10,e.contentId)},[e.video?o("div",{classMap:{"slds-carousel__panel-action":!0,"slds-text-link_reset":!0},attrs:{tabindex:c(e.tabindex)},key:11},[o("div",{key:12},[o("iframe",{attrs:{height:"400px",width:"100%",src:e.video,frameborder:"0",allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:""},key:13},[])]),o("div",{classMap:{"slds-carousel__content":!0},key:14},[o("h2",{classMap:{"slds-carousel__content-title":!0},key:15},[d(e.header)]),o("p",{key:16},[d(e.description)])])]):null,e.video?null:o("a",{classMap:{"slds-carousel__panel-action":!0,"slds-text-link_reset":!0},attrs:{href:p(e.href),tabindex:c(e.tabindex)},key:17},[o("div",{classMap:{"slds-carousel__image":!0},key:18},[o("img",{attrs:{src:e.image,alt:e.header},key:19},[])]),o("div",{classMap:{"slds-carousel__content":!0},key:20},[o("h2",{classMap:{"slds-carousel__content-title":!0},key:21},[d(e.header)]),o("p",{key:22},[d(e.description)])])])])})):[])])])]}var l=Object(a.registerTemplate)(o);function r(e,s){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);s&&(a=a.filter((function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable}))),t.push.apply(t,a)}return t}function c(e,s,t){return s in e?Object.defineProperty(e,s,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[s]=t,e}o.stylesheets=[],i&&o.stylesheets.push.apply(o.stylesheets,i),o.stylesheetTokens={hostAttribute:"my-c-carouselComponent_carouselComponent-host",shadowAttribute:"my-c-carouselComponent_carouselComponent"};class d extends a.LightningElement{constructor(...e){super(...e),this.items=void 0,this.options=void 0,this.components=void 0,this.showPlayIcon=void 0,this.activeComponent=0,this.loaded=!1,this.autoScroll=void 0,this.intervalVar=void 0}navigate(e){this.activeComponent=parseInt(e.target.dataset.id),this.arrangeComponents()}arrangeComponents(){let e=[],s=0;this.items.forEach(t=>{let a=function(e){for(var s=1;s<arguments.length;s++){var t=null!=arguments[s]?arguments[s]:{};s%2?r(Object(t),!0).forEach((function(s){c(e,s,t[s])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(s){Object.defineProperty(e,s,Object.getOwnPropertyDescriptor(t,s))}))}return e}({},t);a.id=s,a.contentId="content-id-"+s,a.indicatorId="indicator-id-"+s,a.href&&(a.href="javascript:void(0);"),s===this.activeComponent?(a.hidden=!1,a.tabindex=0,a.active=!0,a.indicatorClass="slds-carousel__indicator-action slds-is-active",a.contentClass="slds-carousel__panel"):(a.hidden=!0,a.tabindex=-1,a.active=!1,a.indicatorClass="slds-carousel__indicator-action",a.contentClass="slds-carousel__panel panel-hide"),e.push(a),s++}),this.components=e}togglePlay(){this.showPlayIcon?this.checkOptions():(clearInterval(this.intervalVar),this.showPlayIcon=!0)}checkOptions(){this.options&&this.options.autoScroll&&this.options.autoScrollTime&&(this.autoScroll=!0,this.showPlayIcon=!1,this.intervalVar=setInterval(()=>{this.activeComponent===this.components.length-1?this.activeComponent=0:this.activeComponent++,this.arrangeComponents()},1e3*this.options.autoScrollTime))}renderedCallback(){this.loaded||(this.arrangeComponents(),this.checkOptions(),this.loaded=!0)}}Object(a.registerDecorators)(d,{publicProps:{items:{config:0},options:{config:0}},track:{components:1,showPlayIcon:1},fields:["activeComponent","loaded","autoScroll","intervalVar"]});var p=Object(a.registerComponent)(d,{tmpl:l}),h=t(20),u=t(25);function m(e,s,t,a){const{t:n,h:i,c:o}=e;return[i("div",{classMap:{"slds-grid":!0,"slds-wrap":!0,"slds-p-left_large":!0,"slds-p-right_large":!0,main:!0,"slds-p-bottom_xx-large":!0,"slds-p-top_medium":!0,"slds-gutters":!0},key:0},[i("div",{classMap:{"slds-large-size_2-of-3":!0,"slds-small-size_1-of-1":!0,"slds-col":!0},key:1},[i("div",{classMap:{},key:2},[i("div",{classMap:{"slds-text-heading_large":!0,"slds-p-top_small":!0},key:3},[i("strong",{key:4},[n("Welcome!")])]),i("div",{classMap:{opening:!0},key:5},[n("Welcome to the new and improved webpage for the Fredericksburg Birding Club (FBC). Our members are bird enthusiasts of all skill levels – from beginning to advanced birders – who reside in the greater Fredericksburg, Virginia area. We have been brought together because of our interest in birds and our love of birding. We welcome anyone to join us on one of our upcoming trips – even if you have never birded before – and hope you will consider becoming a member.")])])]),i("div",{classMap:{"slds-large-size_1-of-3":!0,"slds-small-size_1-of-1":!0,"slds-col":!0},key:6},[i("div",{classMap:{"slds-text-align_center":!0,"slds-p-bottom_large":!0,"slds-p-top_large":!0},key:7},[i("a",{attrs:{href:"https://ebird.org/",target:"_blank"},key:8},[i("img",{classMap:{ebird:!0},attrs:{src:"resources/photos/ebird.png"},key:9},[])])])]),i("div",{classMap:{"slds-large-size_2-of-3":!0,"slds-small-size_1-of-1":!0,"slds-col":!0},key:10},[i("div",{classMap:{"slds-p-top_medium":!0},key:11},[i("div",{classMap:{"carousel-container":!0},key:12},[o("c-carousel-component",p,{props:{items:s.items,options:s.options},key:13},[])])])]),i("div",{classMap:{"slds-large-size_1-of-3":!0,"slds-small-size_1-of-1":!0,"slds-col":!0,"slds-p-top_medium":!0},key:14},[o("my-events",h.a,{props:{home:"true"},key:15},[]),i("div",{classMap:{"slds-p-top_small":!0},key:16},[o("my-announcements",u.default,{props:{home:"true"},key:17},[])])])])]}var v=Object(a.registerTemplate)(m);m.stylesheets=[],n&&m.stylesheets.push.apply(m.stylesheets,n),m.stylesheetTokens={hostAttribute:"my-my-home_home-host",shadowAttribute:"my-my-home_home"};class y extends a.LightningElement{constructor(...e){super(...e),this.counter=0,this.options={autoScroll:!0,autoScrollTime:5},this.items=[{image:"resources/photos/image5.jpeg",header:"Bristoe Station Heritage Park",description:"June 19, 2021",href:"#"},{image:"resources/photos/CBBT.jpg",header:"Chesapeake Bay Bridge Tunnel",href:"#"},{image:"resources/photos/Group.jpg",header:"George Washington Birthplace National Monument",description:"November 10, 2018",href:"#"},{image:"resources/photos/Group1.jpg",header:"Occoquan Bay National Wildlife Refuge",description:"March 11, 2017",href:"#"},{image:"resources/photos/P1020092.jpg",href:"#"},{image:"resources/photos/Photo-Op.jpg",header:"Mattamuskeet National Wildlife Refuge",href:"#"}],this.showModal=!1,this.modalDetail={}}handleMemberEvent(e){this.showModal=!0,this.modalDetail=e.detail}handleOkClick(){this.showModal=!1}}Object(a.registerDecorators)(y,{fields:["counter","options","items","showModal","modalDetail"]});s.default=Object(a.registerComponent)(y,{tmpl:v})},9:function(e,s,t){"use strict";t.d(s,"b",(function(){return i})),t.d(s,"d",(function(){return o})),t.d(s,"e",(function(){return l})),t.d(s,"g",(function(){return r})),t.d(s,"a",(function(){return c})),t.d(s,"c",(function(){return d})),t.d(s,"f",(function(){return p}));const a="https://fredbirds-api.herokuapp.com/",n=function(e){return new Promise((s,t)=>{fetch(e,{method:"GET",headers:{"cache-control":"no-cache"}}).then(e=>e.json()).then(e=>{s(e)}).catch(e=>{t(e)})})},i=e=>n(`${a}events/${e}`),o=(e,s=3)=>n(`${a}events/future/${s}`),l=()=>n("https://fredbirds-api.herokuapp.com/news"),r=e=>fetch("https://fredbirds-api.herokuapp.com/sendgrid",{method:"POST",headers:{"cache-control":"no-cache","content-type":"application/json"},body:e,json:!0}),c=()=>n("https://fredbirds-api.herokuapp.com/announcements"),d=()=>fetch("https://fredbirds-api.herokuapp.com/faqs",{method:"GET"}),p=()=>fetch("https://fredbirds-api.herokuapp.com/newsletters",{method:"GET"})}}]);