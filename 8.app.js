(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{21:function(e,t,s){"use strict";var a=s(1),i=s(3),l=s.n(i),n=s(7);function r(e,t,s,a){const{c:i,d:l,h:r}=e;return[r("div",{classMap:{"slds-form-element__icon":!0},key:0},[r("button",{classMap:{"slds-button":!0,"slds-button_icon":!0},attrs:{type:"button"},key:1},[i("lightning-primitive-icon",n.a,{props:{svgClass:t.computedSvgClass,iconName:t.iconName,variant:"bare"},key:2},[]),r("span",{classMap:{"slds-assistive-text":!0},key:3},[l(t.alternativeText)])])])]}var d=Object(a.registerTemplate)(r);r.stylesheets=[],l.a&&r.stylesheets.push.apply(r.stylesheets,l.a),r.stylesheetTokens={hostAttribute:"my-src-lightning_helptext-host",shadowAttribute:"my-src-lightning_helptext"};var o=s(9),c=s(0),p=s(4),h=s(13);class v extends a.LightningElement{constructor(...e){super(...e),this.state={iconName:"utility:info",iconVariant:"bare",alternativeText:"Help"},this._tooltip=null}get content(){return this._tooltip?this._tooltip.value:void 0}set content(e){this._tooltip?this._tooltip.value=e:e&&(this._tooltip=new h.a(e,{root:this,target:()=>this.template.querySelector("button"),type:h.b.Toggle}),this._tooltip.initialize())}set iconName(e){this.state.iconName=e}get iconName(){return Object(o.d)(this.state.iconName)?this.state.iconName:"utility:info"}set iconVariant(e){this.state.iconVariant=e}get iconVariant(){return Object(c.y)(this.state.iconVariant,{fallbackValue:"bare",validValues:["bare","error","inverse","warning"]})}get alternativeText(){return this.state.alternativeText}set alternativeText(e){e&&"string"==typeof e&&""!==e.trim()?this.state.alternativeText=e:console.warn("<lightning-helptext> Invalid alternativeText value: "+e)}disconnectedCallback(){this._tooltip&&!this._tooltip.initialized&&this._tooltip.hide(),this._tooltip=null}renderedCallback(){this._tooltip&&!this._tooltip.initialized&&this._tooltip.initialize()}get computedSvgClass(){const e=Object(p.a)("slds-button__icon");switch(this.iconVariant){case"error":e.add("slds-icon-text-error");break;case"warning":e.add("slds-icon-text-warning");break;case"inverse":case"bare":break;default:e.add("slds-icon-text-default")}return e.toString()}}Object(a.registerDecorators)(v,{publicProps:{content:{config:3},iconName:{config:3},iconVariant:{config:3},alternativeText:{config:3}},track:{state:1},fields:["_tooltip"]});t.a=Object(a.registerComponent)(v,{tmpl:d})},29:function(e,t,s){"use strict";var a=s(1);var i=[function(e,t,s){return["pre",t,"{white-space:pre-wrap;font-size:.8125rem;font-family:Arial,Helvetica,sans-serif}table",t,"{table-layout:fixed;width:100%}"].join("")}],l=s(21);function n(e,t,s,i){const{h:n,t:r,b:d,c:o,k:c,d:p,i:h}=e,{_m0:v,_m1:u,_m2:y}=i;return[t.yearEvents?n("div",{key:0},[n("div",{classMap:{"slds-card":!0},key:1},[n("div",{classMap:{"slds-card__header":!0},key:2},[n("div",{classMap:{"slds-media":!0,"slds-media--center":!0,"slds-has-flexi-truncate":!0},key:3},[n("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-event":!0},attrs:{title:"Description of icon when needed"},key:4},[n("svg",{classMap:{"slds-icon":!0},attrs:{"aria-hidden":"true"},key:5},[n("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#event")},key:6},[])]),n("span",{classMap:{"slds-assistive-text":!0},key:7},[r("Description of icon when needed")])]),n("div",{classMap:{"slds-media__body":!0},key:8},[n("h2",{classMap:{"slds-p-left_small":!0,"slds-card__header-title":!0},key:9},[t.isHome?r("Upcoming Events"):null,t.isHome?null:n("select",{key:10,on:{change:v||(i._m0=d(t.handleYearChange))}},[n("option",{attrs:{value:"2023"},key:11},[r("2023")]),n("option",{attrs:{value:"2022"},key:12},[r("2022")]),n("option",{attrs:{value:"2021"},key:13},[r("2021")]),n("option",{attrs:{value:"2020"},key:14},[r("2020")]),n("option",{attrs:{value:"2019"},key:15},[r("2019")]),n("option",{attrs:{value:"2018"},key:16},[r("2018")]),n("option",{attrs:{value:"2017"},key:17},[r("2017")]),n("option",{attrs:{value:"2016"},key:18},[r("2016")]),n("option",{attrs:{value:"2015"},key:19},[r("2015")])]),t.isHome?null:r("  Calendar of Events"),t.isHome?null:o("lightning-helptext",l.a,{classMap:{"slds-var-p-left_small":!0},props:{content:"Select a year from the dropdown to view a list of events for that year. Click on an event to view event details and/or the trip report for the event."},key:20},[])])])])]),n("div",{classMap:{"slds-card__body":!0},key:21},[n("div",{classMap:{"slds-scrollable--y":!0,"slds-is-relative":!0},key:22},[t.loading?n("div",{classMap:{"slds-spinner_container":!0},key:23},[n("div",{classMap:{"slds-spinner":!0,"slds-spinner_medium":!0,"slds-spinner_brand":!0},attrs:{role:"status"},key:24},[n("span",{classMap:{"slds-assistive-text":!0},key:25},[r("Loading")]),n("div",{classMap:{"slds-spinner__dot-a":!0},key:26},[]),n("div",{classMap:{"slds-spinner__dot-b":!0},key:27},[])])]):null,n("table",{classMap:{fixed_header:!0,"slds-table":!0,"slds-table_cell-buffer":!0,"slds-table_bordered":!0,"slds-table_col-bordered":!0},key:28},[n("thead",{key:29},[n("tr",{classMap:{"slds-text-heading--label":!0},key:30},[n("th",{attrs:{scope:"col"},key:31},[n("span",{classMap:{"slds-truncate":!0},key:32},[r("Date(s)")])]),n("th",{attrs:{scope:"col"},key:33},[n("span",{classMap:{"slds-truncate":!0},key:34},[r("Event")])])])]),n("tbody",{key:35},h(t.yearEvents,(function(e){return n("tr",{classMap:{"slds-hint-parent":!0},attrs:{"data-item":e.id},key:c(36,e.id),on:{click:u||(i._m1=d(t.handleEventClick))}},[n("td",{classMap:{"slds-cell-wrap":!0},key:37},[p(e.date),n("div",{classMap:{"slds-float_right":!0},key:38},[e.cancelled?n("div",{classMap:{"slds-media__figure":!0},key:39},[n("span",{classMap:{"slds-icon_container":!0,"slds-icon-custom-custom60":!0},attrs:{title:"Cancelled"},key:40},[n("svg",{classMap:{"slds-icon":!0,"slds-icon_x-small":!0},attrs:{"aria-hidden":"true"},key:41},[n("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/custom-sprite/svg/symbols.svg#custom60")},key:42},[])])])]):null]),n("div",{classMap:{"slds-float_right":!0},key:43},[e.pdfFile?n("div",{classMap:{"slds-media__figure":!0},key:44},[n("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-knowledge":!0},attrs:{title:"Trip Report"},key:45},[n("svg",{classMap:{"slds-icon":!0,"slds-icon_x-small":!0},attrs:{"aria-hidden":"true"},key:46},[n("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#knowledge")},key:47},[])])])]):null]),n("div",{classMap:{"slds-float_right":!0},key:48},[e.details?n("div",{classMap:{"slds-media__figure":!0},key:49},[n("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-address":!0},attrs:{title:"Details"},key:50},[n("svg",{classMap:{"slds-icon":!0,"slds-icon_x-small":!0},attrs:{"aria-hidden":"true"},key:51},[n("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#address")},key:52},[])])])]):null])]),n("td",{classMap:{"slds-cell-wrap":!0},key:53},[p(e.event)])])})))])])]),t.isHome?n("footer",{classMap:{"slds-card__footer":!0},key:54},[n("a",{classMap:{"slds-card__footer-action":!0},attrs:{href:"#"},key:55,on:{click:y||(i._m2=d(t.handleViewAllEventsClick))}},[r("View All Events")])]):null])]):null]}var r=Object(a.registerTemplate)(n);n.stylesheets=[],i&&n.stylesheets.push.apply(n.stylesheets,i),n.stylesheetTokens={hostAttribute:"my-my-events_events-host",shadowAttribute:"my-my-events_events"};var d=s(12);class o extends a.LightningElement{constructor(...e){super(...e),this.year=void 0,this.yearEvents=void 0,this.showModal=!1,this.events={},this.selectedEvent=void 0,this.noEvents=!1,this.loading=!1,this.opts={autoScroll:!1,autoScrollTime:7},this.home=void 0,this.readOnly=!1}connectedCallback(){this.year=2022,this.fetchEvents(2022)}get options(){return Object.keys(this.events)}handleEventClick(e){const t=e.currentTarget.dataset.item;this.selectedEvent=this.yearEvents.find(e=>e.id===t),"0"!==t&&this.dispatchEvent(new CustomEvent("eventclick",{detail:this.selectedEvent}))}handleCloseClick(){this.showModal=!1}handleYearChange(e){const t=e.currentTarget.value;this.year=t,this.fetchEvents(t),this.dispatchEvent(new CustomEvent("eventyearchange"))}get eventCancelled(){return this.selectedEvent.cancelled}get tripReport(){return this.selectedEvent.tripReport}createEvents(e){if(this.yearEvents=[],0===e.length)return this.yearEvents=[{id:"0",date:"No Events Scheduled"}],void(this.noEvents=!0);this.noEvents=!1,e.sort((e,t)=>e.start>t.start?1:-1),e.forEach(e=>{let t=[];e.photos&&e.photos.forEach(e=>{t.push({header:""+e.caption,image:"https://fredbirds-098f.restdb.io/media/"+e.photo,href:"#"})}),e.species_sighted&&e.species_sighted.sort((e,t)=>e.common>t.common?1:-1),e.participants&&e.participants.sort((e,t)=>e.name>t.name?1:-1),this.yearEvents.push({id:e._id,date:this.getEventDate(new Date(e.start),e.end?new Date(e.end):null),event:e.event,sightings:e.species_sighted,details:e.details,tripReport:e.tripreport,participants:e.participants,start:e.start,cancelled:e.cancelled,photos:t,pdfFile:e.pdfFile})})}get showDetails(){return console.log(new Date<this.selectedEvent.start||"0"===this.yearEvents[0]._id),new Date<this.selectedEvent.start||"0"===this.yearEvents[0]._id}fetchEvents(e){this.loading=!0;const t="false"===this.home?sessionStorage.getItem(e+"events"):sessionStorage.getItem("upcomingevents");t?(this.createEvents(JSON.parse(t)),this.loading=!1):"false"===this.home?this.fetchYearEvents(e):this.fetchFutureEvents()}fetchFutureEvents(){const e=new Date;Object(d.f)(e,3).then(e=>{sessionStorage.setItem("upcomingevents",JSON.stringify(e)),this.createEvents(e),this.loading=!1}).catch(e=>{console.log(e)})}fetchYearEvents(e){Object(d.c)(e).then(t=>{sessionStorage.setItem(e+"events",JSON.stringify(t)),this.createEvents(t),this.loading=!1}).catch(e=>{console.log(e)})}getEventDate(e,t){const s=["January","February","March","April","May","June","July","August","September","October","November","December"];let a="";const i=s[e.getUTCMonth()];if(a=`${i} ${e.getUTCDate()}`,t){const e=s[t.getUTCMonth()];a+=i===e?" - "+t.getUTCDate():` - ${e} ${s[t.getUTCDate()]}`}return a}get isHome(){return"true"===this.home}handleViewAllEventsClick(){this.dispatchEvent(new CustomEvent("viewall",{detail:"events",bubbles:!0,composed:!0}))}}Object(a.registerDecorators)(o,{publicProps:{home:{config:0},readOnly:{config:0}},fields:["year","yearEvents","showModal","events","selectedEvent","noEvents","loading","opts"]});t.a=Object(a.registerComponent)(o,{tmpl:r})},52:function(e,t,s){"use strict";s.r(t);var a=s(1),i=[],l=s(29);var n=[function(e,t,s){return["lightning-formatted-rich-text",t,"{white-space:pre-wrap;font-size:1rem;font-family:Arial,Helvetica,sans-serif}"].join("")}],r=s(27);function d(e,t,s,i){const{h:l,d:n,t:d,gid:o,b:c,c:p}=e,{_m0:h,_m1:v}=i;return[t.showDetails?l("article",{classMap:{"slds-card":!0},key:0},[l("div",{classMap:{"slds-card__header":!0,"slds-grid":!0},key:1},[l("header",{classMap:{"slds-media":!0,"slds-media_center":!0,"slds-has-flexi-truncate":!0},key:2},[l("div",{classMap:{"slds-media__figure":!0},key:3},[l("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-account":!0},attrs:{title:"account"},key:4},[l("svg",{classMap:{"slds-icon":!0,"slds-icon_medium":!0},attrs:{"aria-hidden":"true"},key:5},[l("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/standard-sprite/svg/symbols.svg#knowledge")},key:6},[])])])]),l("div",{classMap:{"slds-media__body":!0},key:7},[l("h2",{classMap:{"slds-card__header-title":!0},key:8},[n(t.selectedEvent.event)])])])]),l("div",{classMap:{"slds-card__body":!0,"slds-card__body_inner":!0},key:9},[l("div",{classMap:{"slds-scrollable--y":!0},styleMap:{"max-height":"650px"},key:10},[t.eventCancelled?l("div",{classMap:{"slds-scoped-notification":!0,"slds-media":!0,"slds-media_center":!0,"slds-theme_error":!0},attrs:{role:"status"},key:11},[l("div",{classMap:{"slds-media__figure":!0},key:12},[l("span",{classMap:{"slds-icon_container":!0,"slds-icon-utility-error":!0},attrs:{title:"error"},key:13},[l("svg",{classMap:{"slds-icon":!0,"slds-icon_small":!0},attrs:{"aria-hidden":"true"},key:14},[l("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/utility-sprite/svg/symbols.svg#error")},key:15},[])]),l("span",{classMap:{"slds-assistive-text":!0},key:16},[d("error")])])]),l("div",{classMap:{"slds-media__body":!0},key:17},[l("p",{key:18},[d("This event was cancelled")])])]):null,t.showButtons?l("div",{classMap:{"slds-p-top_small":!0,"slds-p-bottom_small":!0},key:19},[l("fieldset",{classMap:{"slds-form-element":!0},key:20},[l("div",{classMap:{"slds-form-element__control":!0},key:21},[l("div",{classMap:{"slds-radio_button-group":!0},key:22},[l("span",{classMap:{"slds-button":!0,"slds-radio_button":!0},key:23},[l("input",{attrs:{type:"radio",name:"event",id:o("details"),disabled:t.detailsDisabled?"":null},props:{value:"details",checked:t.detailsSelected},key:24,on:{change:h||(i._m0=c(t.handleTypeChange))}},[]),l("label",{classMap:{"slds-radio_button__label":!0},attrs:{for:""+o("details")},key:25},[l("span",{classMap:{"slds-radio_faux":!0},key:26},[d("Details")])])]),l("span",{classMap:{"slds-button":!0,"slds-radio_button":!0},key:27},[l("input",{attrs:{type:"radio",name:"event",id:o("tripReport"),disabled:t.tripReportDisabled?"":null},props:{value:"tripReport",checked:t.tripReportSelected},key:28,on:{change:v||(i._m1=c(t.handleTypeChange))}},[]),l("label",{classMap:{"slds-radio_button__label":!0},attrs:{for:""+o("tripReport")},key:29},[l("span",{classMap:{"slds-radio_faux":!0},key:30},[d("Trip Report")])])])])])])]):null,l("div",{classMap:{"slds-text-body_small":!0},key:31},[t.eventCancelled||t.showButtons?null:l("div",{classMap:{"slds-scoped-notification":!0,"slds-media":!0,"slds-media_center":!0,"slds-theme_warning":!0},attrs:{role:"status"},key:32},[l("div",{classMap:{"slds-media__figure":!0},key:33},[l("span",{classMap:{"slds-icon_container":!0,"slds-icon-utility-warning":!0},attrs:{title:"warning"},key:34},[l("svg",{classMap:{"slds-icon":!0,"slds-icon_small":!0},attrs:{"aria-hidden":"true"},key:35},[l("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/utility-sprite/svg/symbols.svg#warning")},key:36},[])]),l("span",{classMap:{"slds-assistive-text":!0},key:37},[d("warning")])])]),l("div",{classMap:{"slds-media__body":!0},key:38},[l("p",{key:39},[d("There are no event details or a trip report for this event")])])]),t.eventCancelled?null:t.detailsSelected?p("lightning-formatted-rich-text",r.a,{props:{value:t.selectedEvent.details},key:40},[]):null,t.eventCancelled?null:t.tripReportSelected?l("div",{styleMap:{overflow:"auto !important","-webkit-overflow-scrolling":"touch !important"},key:41},[l("iframe",{attrs:{src:t.pdfFileLocation,width:"100%",height:"600px"},key:42},[])]):null])])])]):null]}var o=Object(a.registerTemplate)(d);d.stylesheets=[],n&&d.stylesheets.push.apply(d.stylesheets,n),d.stylesheetTokens={hostAttribute:"my-my-eventDetails_eventDetails-host",shadowAttribute:"my-my-eventDetails_eventDetails"};class c extends a.LightningElement{constructor(...e){super(...e),this.selectedEvent=void 0,this.detailsSelected=void 0,this.tripReportSelected=void 0}get eventCancelled(){return this.selectedEvent.cancelled}get tripReport(){return this.selectedEvent.pdfFile}get showDetails(){return void 0!==this.selectedEvent}get detailsDisabled(){return void 0===this.selectedEvent.details||""===this.selectedEvent.details}get tripReportDisabled(){return void 0===this.selectedEvent.pdfFile||""===this.selectedEvent.pdfFile}get showButtons(){return void 0!==this.selectedEvent.pdfFile&&""!==this.selectedEvent.pdfFile||""!==this.selectedEvent.details&&void 0!==this.selectedEvent.details}resetSelected(e,t){e?(this.detailsSelected=!0,this.tripReportSelected=!1):t?(this.detailsSelected=!1,this.tripReportSelected=!0):(this.detailsSelected=!1,this.tripReportSelected=!1)}get pdfFileLocation(){return`https://drive.google.com/file/d/${this.selectedEvent.pdfFile}/preview?usp=sharing`}handleTypeChange(e){"details"===e.target.value?(this.detailsSelected=!0,this.tripReportSelected=!1):(this.detailsSelected=!1,this.tripReportSelected=!0)}}Object(a.registerDecorators)(c,{publicProps:{selectedEvent:{config:0}},publicMethods:["resetSelected"],fields:["detailsSelected","tripReportSelected"]});var p=Object(a.registerComponent)(c,{tmpl:o});function h(e,t,s,a){const{b:i,c:n,h:r}=e,{_m0:d,_m1:o}=a;return[r("div",{classMap:{"slds-grid":!0,"slds-wrap":!0,"slds-gutters":!0,"slds-p-left_medium":!0,"slds-p-right_medium":!0,main:!0,"slds-p-bottom_xx-large":!0,"slds-p-top_medium":!0},key:0},[r("div",{classMap:{"slds-col":!0,"slds-large-size_1-of-3":!0,"slds-small-size_1-of-1":!0,"slds-p-left_x-small":!0},key:1},[r("div",{key:2},[n("my-events",l.a,{props:{home:"false"},key:3,on:{eventclick:d||(a._m0=i(t.handleEventClick)),eventyearchange:o||(a._m1=i(t.handleYearChange))}},[])])]),r("div",{classMap:{"slds-col":!0,"slds-large-size_2-of-3":!0,"slds-small-size_1-of-1":!0},key:4},[n("my-event-details",p,{props:{selectedEvent:t.selectedEvent},key:5},[])])])]}var v=Object(a.registerTemplate)(h);h.stylesheets=[],i&&h.stylesheets.push.apply(h.stylesheets,i),h.stylesheetTokens={hostAttribute:"my-my-eventParent_eventParent-host",shadowAttribute:"my-my-eventParent_eventParent"};class u extends a.LightningElement{constructor(...e){super(...e),this.selectedEvent=void 0}handleEventClick(e){this.selectedEvent=e.detail,this.template.querySelector("my-event-details").resetSelected(void 0!==this.selectedEvent.details&&""!==this.selectedEvent.details,void 0!==this.selectedEvent.pdfFile&&""!==this.selectedEvent.pdfFile)}handleYearChange(){this.selectedEvent=void 0}}Object(a.registerDecorators)(u,{fields:["selectedEvent"]});t.default=Object(a.registerComponent)(u,{tmpl:v})}}]);