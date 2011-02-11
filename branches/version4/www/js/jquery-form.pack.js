;(function($){$.fn.ajaxSubmit=function(x){if(!this.length){log('ajaxSubmit: skipping submit process - no element selected');return this}if(typeof x=='function'){x={success:x}}var y=this.attr('action');var z=(typeof y==='string')?$.trim(y):'';if(z){z=(z.match(/^([^#]+)/)||[])[1]}z=z||window.location.href||'';x=$.extend(true,{url:z,type:this[0].getAttribute('method')||'GET',iframeSrc:/^https/i.test(window.location.href||'')?'javascript:false':'about:blank'},x);var A={};this.trigger('form-pre-serialize',[this,x,A]);if(A.veto){log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');return this}if(x.beforeSerialize&&x.beforeSerialize(this,x)===false){log('ajaxSubmit: submit aborted via beforeSerialize callback');return this}var n,v,a=this.formToArray(x.semantic);if(x.data){x.extraData=x.data;for(n in x.data){if(x.data[n]instanceof Array){for(var k in x.data[n]){a.push({name:n,value:x.data[n][k]})}}else{v=x.data[n];v=$.isFunction(v)?v():v;a.push({name:n,value:v})}}}if(x.beforeSubmit&&x.beforeSubmit(a,this,x)===false){log('ajaxSubmit: submit aborted via beforeSubmit callback');return this}this.trigger('form-submit-validate',[a,this,x,A]);if(A.veto){log('ajaxSubmit: submit vetoed via form-submit-validate trigger');return this}var q=$.param(a);if(x.type.toUpperCase()=='GET'){x.url+=(x.url.indexOf('?')>=0?'&':'?')+q;x.data=null}else{x.data=q}var B=this,callbacks=[];if(x.resetForm){callbacks.push(function(){B.resetForm()})}if(x.clearForm){callbacks.push(function(){B.clearForm()})}if(!x.dataType&&x.target){var C=x.success||function(){};callbacks.push(function(a){var b=x.replaceTarget?'replaceWith':'html';$(x.target)[b](a).each(C,arguments)})}else if(x.success){callbacks.push(x.success)}x.success=function(a,b,c){var d=x.context||x;for(var i=0,max=callbacks.length;i<max;i++){callbacks[i].apply(d,[a,b,c||B,B])}};var D=$('input:file',this).length>0;var E='multipart/form-data';var F=(B.attr('enctype')==E||B.attr('encoding')==E);if(x.iframe!==false&&(D||x.iframe||F)){if(x.closeKeepAlive){$.get(x.closeKeepAlive,fileUpload)}else{fileUpload()}}else{$.ajax(x)}this.trigger('form-submit-notify',[this,x]);return this;function fileUpload(){var j=B[0];if($(':input[name=submit],:input[id=submit]',j).length){alert('Error: Form elements must not have name or id of "submit".');return}var s=$.extend(true,{},$.ajaxSettings,x);s.context=s.context||s;var k='jqFormIO'+(new Date().getTime()),fn='_'+k;var l=$('<iframe id="'+k+'" name="'+k+'" src="'+s.iframeSrc+'" />');var m=l[0];l.css({position:'absolute',top:'-1000px',left:'-1000px'});var o={aborted:0,responseText:null,responseXML:null,status:0,statusText:'n/a',getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(){this.aborted=1;l.attr('src',s.iframeSrc)}};var g=s.global;if(g&&!$.active++){$.event.trigger("ajaxStart")}if(g){$.event.trigger("ajaxSend",[o,s])}if(s.beforeSend&&s.beforeSend.call(s.context,o,s)===false){if(s.global){$.active--}return}if(o.aborted){return}var p=0;var q=j.clk;if(q){var n=q.name;if(n&&!q.disabled){s.extraData=s.extraData||{};s.extraData[n]=q.value;if(q.type=="image"){s.extraData[n+'.x']=j.clk_x;s.extraData[n+'.y']=j.clk_y}}}function doSubmit(){var t=B.attr('target'),a=B.attr('action');j.setAttribute('target',k);if(j.getAttribute('method')!='POST'){j.setAttribute('method','POST')}if(j.getAttribute('action')!=s.url){j.setAttribute('action',s.url)}if(!s.skipEncodingOverride){B.attr({encoding:'multipart/form-data',enctype:'multipart/form-data'})}if(s.timeout){setTimeout(function(){p=true;cb()},s.timeout)}var b=[];try{if(s.extraData){for(var n in s.extraData){b.push($('<input type="hidden" name="'+n+'" value="'+s.extraData[n]+'" />').appendTo(j)[0])}}l.appendTo('body');m.attachEvent?m.attachEvent('onload',cb):m.addEventListener('load',cb,false);j.submit()}finally{j.setAttribute('action',a);if(t){j.setAttribute('target',t)}else{B.removeAttr('target')}$(b).remove()}}if(s.forceSync){doSubmit()}else{setTimeout(doSubmit,10)}var r,doc,domCheckCount=50;function cb(){doc=m.contentWindow?m.contentWindow.document:m.contentDocument?m.contentDocument:m.document;if(!doc||doc.location.href==s.iframeSrc){return}m.detachEvent?m.detachEvent('onload',cb):m.removeEventListener('load',cb,false);var c=true;try{if(p){throw'timeout';}var d=s.dataType=='xml'||doc.XMLDocument||$.isXMLDoc(doc);log('isXml='+d);if(!d&&window.opera&&(doc.body==null||doc.body.innerHTML=='')){if(--domCheckCount){log('requeing onLoad callback, DOM not available');setTimeout(cb,250);return}}o.responseText=doc.body?doc.body.innerHTML:doc.documentElement?doc.documentElement.innerHTML:null;o.responseXML=doc.XMLDocument?doc.XMLDocument:doc;o.getResponseHeader=function(a){var b={'content-type':s.dataType};return b[a]};var f=/(json|script)/.test(s.dataType);if(f||s.textarea){var h=doc.getElementsByTagName('textarea')[0];if(h){o.responseText=h.value}else if(f){var i=doc.getElementsByTagName('pre')[0];var b=doc.getElementsByTagName('body')[0];if(i){o.responseText=i.textContent}else if(b){o.responseText=b.innerHTML}}}else if(s.dataType=='xml'&&!o.responseXML&&o.responseText!=null){o.responseXML=u(o.responseText)}r=w(o,s.dataType,s)}catch(e){log('error caught:',e);c=false;o.error=e;s.error.call(s.context,o,'error',e);g&&$.event.trigger("ajaxError",[o,s,e])}if(o.aborted){log('upload aborted');c=false}if(c){s.success.call(s.context,r,'success',o);g&&$.event.trigger("ajaxSuccess",[o,s])}g&&$.event.trigger("ajaxComplete",[o,s]);if(g&&!--$.active){$.event.trigger("ajaxStop")}s.complete&&s.complete.call(s.context,o,c?'success':'error');setTimeout(function(){l.removeData('form-plugin-onload');l.remove();o.responseXML=null},100)}var u=$.parseXML||function(s,a){if(window.ActiveXObject){a=new ActiveXObject('Microsoft.XMLDOM');a.async='false';a.loadXML(s)}else{a=(new DOMParser()).parseFromString(s,'text/xml')}return(a&&a.documentElement&&a.documentElement.nodeName!='parsererror')?a:null};var v=$.parseJSON||function(s){return window['eval']('('+s+')')};var w=function(a,b,s){var c=a.getResponseHeader('content-type')||'',xml=b==='xml'||!b&&c.indexOf('xml')>=0,r=xml?a.responseXML:a.responseText;if(xml&&r.documentElement.nodeName==='parsererror'){$.error&&$.error('parsererror')}if(s&&s.dataFilter){r=s.dataFilter(r,b)}if(typeof r==='string'){if(b==='json'||!b&&c.indexOf('json')>=0){r=v(r)}else if(b==="script"||!b&&c.indexOf("javascript")>=0){$.globalEval(r)}}return r}}};$.fn.ajaxForm=function(f){if(this.length===0){var o={s:this.selector,c:this.context};if(!$.isReady&&o.s){log('DOM not ready, queuing ajaxForm');$(function(){$(o.s,o.c).ajaxForm(f)});return this}log('terminating; zero elements found by selector'+($.isReady?'':' (DOM not ready)'));return this}return this.ajaxFormUnbind().bind('submit.form-plugin',function(e){if(!e.isDefaultPrevented()){e.preventDefault();$(this).ajaxSubmit(f)}}).bind('click.form-plugin',function(e){var a=e.target;var b=$(a);if(!(b.is(":submit,input:image"))){var t=b.closest(':submit');if(t.length==0){return}a=t[0]}var c=this;c.clk=a;if(a.type=='image'){if(e.offsetX!=undefined){c.clk_x=e.offsetX;c.clk_y=e.offsetY}else if(typeof $.fn.offset=='function'){var d=b.offset();c.clk_x=e.pageX-d.left;c.clk_y=e.pageY-d.top}else{c.clk_x=e.pageX-a.offsetLeft;c.clk_y=e.pageY-a.offsetTop}}setTimeout(function(){c.clk=c.clk_x=c.clk_y=null},100)})};$.fn.ajaxFormUnbind=function(){return this.unbind('submit.form-plugin click.form-plugin')};$.fn.formToArray=function(b){var a=[];if(this.length===0){return a}var c=this[0];var d=b?c.getElementsByTagName('*'):c.elements;if(!d){return a}var i,j,n,v,el,max,jmax;for(i=0,max=d.length;i<max;i++){el=d[i];n=el.name;if(!n){continue}if(b&&c.clk&&el.type=="image"){if(!el.disabled&&c.clk==el){a.push({name:n,value:$(el).val()});a.push({name:n+'.x',value:c.clk_x},{name:n+'.y',value:c.clk_y})}continue}v=$.fieldValue(el,true);if(v&&v.constructor==Array){for(j=0,jmax=v.length;j<jmax;j++){a.push({name:n,value:v[j]})}}else if(v!==null&&typeof v!='undefined'){a.push({name:n,value:v})}}if(!b&&c.clk){var e=$(c.clk),input=e[0];n=input.name;if(n&&!input.disabled&&input.type=='image'){a.push({name:n,value:e.val()});a.push({name:n+'.x',value:c.clk_x},{name:n+'.y',value:c.clk_y})}}return a};$.fn.formSerialize=function(a){return $.param(this.formToArray(a))};$.fn.fieldSerialize=function(b){var a=[];this.each(function(){var n=this.name;if(!n){return}var v=$.fieldValue(this,b);if(v&&v.constructor==Array){for(var i=0,max=v.length;i<max;i++){a.push({name:n,value:v[i]})}}else if(v!==null&&typeof v!='undefined'){a.push({name:this.name,value:v})}});return $.param(a)};$.fn.fieldValue=function(a){for(var b=[],i=0,max=this.length;i<max;i++){var c=this[i];var v=$.fieldValue(c,a);if(v===null||typeof v=='undefined'||(v.constructor==Array&&!v.length)){continue}v.constructor==Array?$.merge(b,v):b.push(v)}return b};$.fieldValue=function(b,c){var n=b.name,t=b.type,tag=b.tagName.toLowerCase();if(c===undefined){c=true}if(c&&(!n||b.disabled||t=='reset'||t=='button'||(t=='checkbox'||t=='radio')&&!b.checked||(t=='submit'||t=='image')&&b.form&&b.form.clk!=b||tag=='select'&&b.selectedIndex==-1)){return null}if(tag=='select'){var d=b.selectedIndex;if(d<0){return null}var a=[],ops=b.options;var e=(t=='select-one');var f=(e?d+1:ops.length);for(var i=(e?d:0);i<f;i++){var g=ops[i];if(g.selected){var v=g.value;if(!v){v=(g.attributes&&g.attributes['value']&&!(g.attributes['value'].specified))?g.text:g.value}if(e){return v}a.push(v)}}return a}return $(b).val()};$.fn.clearForm=function(){return this.each(function(){$('input,select,textarea',this).clearFields()})};$.fn.clearFields=$.fn.clearInputs=function(){return this.each(function(){var t=this.type,tag=this.tagName.toLowerCase();if(t=='text'||t=='password'||tag=='textarea'){this.value=''}else if(t=='checkbox'||t=='radio'){this.checked=false}else if(tag=='select'){this.selectedIndex=-1}})};$.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=='function'||(typeof this.reset=='object'&&!this.reset.nodeType)){this.reset()}})};$.fn.enable=function(b){if(b===undefined){b=true}return this.each(function(){this.disabled=!b})};$.fn.selected=function(b){if(b===undefined){b=true}return this.each(function(){var t=this.type;if(t=='checkbox'||t=='radio'){this.checked=b}else if(this.tagName.toLowerCase()=='option'){var a=$(this).parent('select');if(b&&a[0]&&a[0].type=='select-one'){a.find('option').selected(false)}this.selected=b}})};function log(){if($.fn.ajaxSubmit.debug){var a='[jquery.form] '+Array.prototype.join.call(arguments,'');if(window.console&&window.console.log){window.console.log(a)}else if(window.opera&&window.opera.postError){window.opera.postError(a)}}}})(jQuery);
