(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{43:function(s,t,e){"use strict";e.r(t);var a=e(0);var l=[function(s,t,e){return[".body",t,"{max-height:450px}"].join("")}],o=e(10);function i(s,t,e,l){const{h:i,t:d,b:c,k:r,d:n,i:h,c:p}=s,{_m0:y,_m1:m}=l;return[t.showHotspots?i("div",{key:0},[i("div",{classMap:{"slds-card":!0},key:1},[i("div",{classMap:{"slds-card__header":!0},key:2},[i("div",{classMap:{"slds-media":!0,"slds-media--center":!0,"slds-has-flexi-truncate":!0},key:3},[i("span",{classMap:{"slds-icon_container":!0,"slds-icon-standard-event":!0},attrs:{title:"Description of icon when needed"},key:4},[i("svg",{classMap:{"slds-icon":!0},attrs:{"aria-hidden":"true"},key:5},[i("use",{attrs:{"xlink:href":Object(a.sanitizeAttribute)("use","http://www.w3.org/2000/svg","xlink:href","resources/SLDS/icons/custom-sprite/svg/symbols.svg#custom3")},key:6},[])]),i("span",{classMap:{"slds-assistive-text":!0},key:7},[d("Description of icon when needed")])]),i("div",{classMap:{"slds-media__body":!0},key:8},[i("h2",{classMap:{"slds-p-left_small":!0,"slds-text-heading--small":!0,"slds-truncate":!0},key:9},[d("Hotspots for  "),i("select",{key:10,on:{change:y||(l._m0=c(t.handleLocationChange))}},h(t.locations,(function(s){return i("option",{attrs:{value:s.value},key:r(11,s.value)},[n(s.label)])}))),p("lightning-helptext",o.a,{classMap:{"slds-var-p-left_small":!0},props:{content:"Select a county from the dropdown to view a list of hotspots. Click on a hotspot to see a list of birds recorded for that selected sight and a location map."},key:12},[])])])])]),i("div",{classMap:{"slds-card__body":!0},key:13},[i("div",{classMap:{"slds-scrollable--y":!0,"slds-is-relative":!0,body:!0},key:14},[i("table",{classMap:{fixed_header:!0,"slds-table":!0,"slds-table_cell-buffer":!0,"slds-table_bordered":!0,"slds-table_col-bordered":!0},key:15},[i("thead",{key:16},[i("tr",{classMap:{"slds-text-heading--label":!0},key:17},[i("th",{attrs:{scope:"col"},key:18},[i("span",{classMap:{"slds-truncate":!0},key:19},[d("Location")])]),i("th",{attrs:{scope:"col"},key:20},[i("span",{classMap:{"slds-truncate":!0},key:21},[d("Last Visited")])]),i("th",{attrs:{scope:"col"},key:22},[i("span",{classMap:{"slds-truncate":!0,"slds-text-align_center":!0},key:23},[d("Species")])])])]),i("tbody",{key:24},h(t.filteredHotspots,(function(s){return i("tr",{classMap:{"slds-hint-parent":!0},attrs:{"data-item":s.locId},key:r(25,s.locId),on:{click:m||(l._m1=c(t.handleHotspotClick))}},[i("td",{classMap:{"slds-cell-wrap":!0},key:26},[n(s.locName)]),i("td",{classMap:{"slds-cell-wrap":!0},key:27},[n(s.latestObsDt)]),i("td",{classMap:{"slds-cell-wrap":!0,"slds-text-align_center":!0},key:28},[n(s.numSpeciesAllTime)])])})))])])])])]):null]}var d=Object(a.registerTemplate)(i);i.stylesheets=[],l&&i.stylesheets.push.apply(i.stylesheets,l),i.stylesheetTokens={hostAttribute:"my-my-hotspots_hotspots-host",shadowAttribute:"my-my-hotspots_hotspots"};var c=e(1);class r extends a.LightningElement{constructor(...s){super(...s),this.hotspots=[],this.regions=void 0,this.locations=[],this.selectedId=""}connectedCallback(){const s=sessionStorage.getItem("hotspots");if(this.regions=JSON.parse(sessionStorage.getItem("regions")),s)this.hotspots=JSON.parse(s),this.locations=this.setLocations(),this.selectedId=this.locations[0].value;else{const s={lat:38.31,long:-77.46};Object(c.b)(s).then(s=>{this.hotspots=s,sessionStorage.setItem("hotspots",JSON.stringify(s)),this.locations=this.setLocations(),this.selectedId=this.locations[0].value})}}setLocations(){let s=[],t=new Set(this.hotspots.map(s=>s.subnational2Code));return t.delete(void 0),t.forEach(t=>{let e=this.regions.find(s=>t===s.code);s.push({value:t,label:e.name})}),s.sort((s,t)=>s.label>t.label?1:-1)}get filteredHotspots(){return this.hotspots.filter(s=>s.subnational2Code===this.selectedId)}handleLocationChange(s){this.selectedId=s.target.value,this.dispatchEvent(new CustomEvent("locationchange"))}handleHotspotClick(s){this.dispatchEvent(new CustomEvent("hotspotclick",{bubbles:!0,composed:!0,detail:s.currentTarget.dataset.item}))}get showHotspots(){return this.hotspots.length>0}}Object(a.registerDecorators)(r,{fields:["hotspots","regions","locations","selectedId"]});var n=Object(a.registerComponent)(r,{tmpl:d});var h=[function(s,t,e){return[".body",t,"{max-height:375px}"].join("")}];function p(s,t,e,a){const{d:l,h:o,t:i,k:d,i:c}=s;return[t.showHotspot?o("article",{classMap:{"slds-card":!0},key:0},[o("div",{classMap:{"slds-card__header":!0,"slds-grid":!0},key:1},[o("header",{classMap:{"slds-media":!0,"slds-media_center":!0,"slds-has-flexi-truncate":!0},key:2},[o("div",{classMap:{"slds-media__body":!0},key:3},[o("h2",{classMap:{"slds-card__header-title":!0},key:4},[o("a",{classMap:{"slds-card__header-link":!0,"slds-truncate":!0},attrs:{href:t.ebirdLink,title:t.hotspot.name,target:"_blank"},key:5},[o("span",{key:6},[l(t.hotspot.hierarchicalName)])])])])])]),o("div",{classMap:{"slds-card__body":!0,"slds-card__body_inner":!0},key:7},[o("div",{classMap:{"slds-grid":!0,"slds-wrap":!0},key:8},[o("div",{classMap:{"slds-small-size_1-of-1":!0,"slds-large-size_1-of-2":!0,"slds-col":!0},key:9},[t.showSpeciesList?o("div",{classMap:{"slds-card":!0},key:10},[o("header",{classMap:{"slds-media":!0,"slds-media_center":!0,"slds-has-flexi-truncate":!0},key:11},[o("div",{classMap:{"slds-media__body":!0},key:12},[o("h3",{classMap:{"slds-card__header-title":!0},key:13},[i("Species List")])])]),o("div",{classMap:{"slds-card__body":!0},key:14},[o("div",{classMap:{"slds-scrollable--y":!0,"slds-is-relative":!0,body:!0},key:15},[o("table",{classMap:{fixed_header:!0,"slds-table":!0,"slds-table_cell-buffer":!0,"slds-table_bordered":!0,"slds-table_col-bordered":!0},key:16},[o("thead",{key:17},[o("tr",{classMap:{"slds-text-heading--label":!0},key:18},[o("th",{attrs:{scope:"col"},key:19},[o("span",{classMap:{"slds-truncate":!0},key:20},[i("Common")])]),o("th",{attrs:{scope:"col"},key:21},[o("span",{classMap:{"slds-truncate":!0},key:22},[i("Scientific")])]),o("th",{attrs:{scope:"col"},key:23},[o("span",{classMap:{"slds-truncate":!0},key:24},[i("Family")])])])]),o("tbody",{key:25},c(t.sightings,(function(s){return o("tr",{classMap:{"slds-hint-parent":!0},key:d(26,s.comName)},[o("td",{classMap:{"slds-cell-wrap":!0},key:27},[l(s.comName)]),o("td",{classMap:{"slds-cell-wrap":!0},key:28},[o("i",{key:29},[l(s.sciName)])]),o("td",{classMap:{"slds-cell-wrap":!0},key:30},[l(s.familyComName)])])})))])])])]):null]),o("div",{classMap:{"slds-small-size_1-of-1":!0,"slds-large-size_1-of-2":!0,"slds-col":!0},key:31},[o("iframe",{styleMap:{border:"0"},attrs:{width:"100%",height:"400px",frameborder:"0",src:t.mapUrl,allowfullscreen:""},key:32},[])])])])]):null]}var y=Object(a.registerTemplate)(p);p.stylesheets=[],h&&p.stylesheets.push.apply(p.stylesheets,h),p.stylesheetTokens={hostAttribute:"my-my-hotspotDetails_hotspotDetails-host",shadowAttribute:"my-my-hotspotDetails_hotspotDetails"};class m extends a.LightningElement{constructor(...s){super(...s),this.hotspot=void 0,this.sightings=[]}get showHotspot(){return void 0!==this.hotspot&&null!==this.hotspot}get mapUrl(){return`https://www.google.com/maps/embed/v1/place?key=AIzaSyCB3Q5szLx_1-UE-WIkFSgA3fFi7-KWFAM&q=${this.hotspot.latitude},${this.hotspot.longitude}&zoom=14`}get ebirdLink(){return"https://ebird.org/hotspot/"+this.hotspot.locId}get showSpeciesList(){return void 0!==this.sightings&&null!==this.sightings}}Object(a.registerDecorators)(m,{publicProps:{hotspot:{config:0},sightings:{config:0}}});var g=Object(a.registerComponent)(m,{tmpl:y});function k(s,t,e,a){const{b:l,c:o,h:i}=s,{_m0:d,_m1:c}=a;return[i("div",{classMap:{"slds-grid":!0,"slds-wrap":!0,"slds-gutters":!0,"slds-p-left_medium":!0,"slds-p-right_medium":!0,main:!0,"slds-p-bottom_xx-large":!0,"slds-p-top_medium":!0},key:0},[i("div",{classMap:{"slds-col":!0,"slds-large-size_1-of-3":!0,"slds-small-size_1-of-1":!0,"slds-p-left_x-small":!0},key:1},[i("div",{key:2},[o("my-hotspots",n,{key:3,on:{hotspotclick:d||(a._m0=l(t.handleHotspotClick)),locationchange:c||(a._m1=l(t.handleLocationChange))}},[])])]),i("div",{classMap:{"slds-col":!0,"slds-large-size_2-of-3":!0,"slds-small-size_1-of-1":!0},key:4},[o("my-hotspot-details",g,{props:{hotspot:t.hotspot,sightings:t.sightings},key:5},[])])])]}var u=Object(a.registerTemplate)(k);k.stylesheets=[],k.stylesheetTokens={hostAttribute:"my-my-hotspotParent_hotspotParent-host",shadowAttribute:"my-my-hotspotParent_hotspotParent"};class b extends a.LightningElement{constructor(...s){super(...s),this.hotspot=void 0,this.sightings=void 0}handleHotspotClick(s){Object(c.a)({locId:s.detail}).then(s=>{this.hotspot=s,Object(c.g)({locId:this.hotspot.locId}).then(s=>{this.sightings=s.sort((s,t)=>s.comName>t.comName?1:-1)})})}handleLocationChange(){this.hotspot=void 0,this.sightings=void 0}}Object(a.registerDecorators)(b,{fields:["hotspot","sightings"]});t.default=Object(a.registerComponent)(b,{tmpl:u})}}]);