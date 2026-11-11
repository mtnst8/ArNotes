window.pvLeaveOk=function(){var q=S.qeIn;if(!q||!$('#qe.qein')||!q.dirty())return true;if(!window.confirm('Throw away your changes to this note?'))return false;S.qeIn=null;return true};
window.renderPv=function(){
  var el=$('#pv'), n=S.byId[S.pv]; if(!el) return; S.qeIn=null;
  if(!n){el.innerHTML='<p class="muted">Nothing to preview.</p>';return}
  el.innerHTML='<input id="pvTitle" class="pvtitle" value="'+esc(n.title)+'" title="Click to rename" spellcheck="false">'+
    '<div class="muted" style="font-size:12px">Created '+fmt(n.created)+(n.att?' · 📎'+n.att:'')+'</div>'+
    '<div class="bar" id="tagbar"></div>'+
    '<div class="bar"><button class="btn primary" id="pvFile">File → Cabinet</button><button class="btn" id="pvOpen">Open</button>'+'<button class="btn" id="pvTask" title="Put this on your to-do list (Tasks on Home)">'+(n.tags.indexOf(TASK_TAG)>=0?'✓ In Tasks':'☑ Add to Tasks')+'</button>'+(n.link?'':'<button class="btn" id="pvEd" title="Edit this note (inside ArNotes)">✏️ Edit</button>'+(n.sheet?'':'<button class="btn" id="pvAdd" title="Type some text and it goes at the end of this note">＋ Add text</button>'))+(n.tags.indexOf('Receipt')>=0?'<button class="btn" id="pvRc">🧾 Receipt details</button>':/mail\.google\.com/.test(n.sourceUrl||'')?'<button class="btn" id="pvMk" title="Read this email as a receipt or invoice">🧾 It\'s a receipt</button>':'')+(isScanNote(n)?'<button class="btn" id="pvNp" title="A new note with this picture in it, ready for you to write">📝 Note with this photo</button>':'')+(isScanNote(n)?'<button class="btn" id="pvJp" title="Not a document, receipt or card: remove this note and put the photo back in Photos">📷 Just a photo</button>':'')+'<button class="btn" id="pvSend" title="Email this note to someone">✉ Send</button><button class="btn" id="pvPr">🖨 Print</button><button class="btn" id="pvDn" title="Download as PDF">⇩ Download</button>'+'<button class="btn danger" id="pvDel">Delete</button>'+
    '<span class="kbd">Keys: ↑ ↓ move · T add tag · F file · Enter open</span></div><div id="pvloc"></div>'+
    (n.tags.indexOf('Receipt')>=0?'<div id="pvRcCard"><p class="muted">Loading receipt…</p></div><div id="pvFull" style="display:none">'+readerHtml()+'</div>':readerHtml());
  renderTags(n);
  var isRc=n.tags.indexOf('Receipt')>=0, pf=isRc?null:fillReader($('#pv .reader'),n.id);
  el.onmouseover=(!isRc&&!n.link&&!n.sheet&&!isPhone()&&store('qeAlways')!==false)?function(e){var t=e.target;if(t&&t.tagName==='IFRAME'&&t.classList.contains('reader')&&!t.classList.contains('editor')&&S.pv===n.id&&!$('#qe'))qeLoad(n)}:null;   // the reader frame gets swapped as it loads, so listen on the preview
  if(isRc) pvReceipt(n);
  var po=S.pvOrder||[],pi=po.indexOf(n.id); if(pi>=0) setTimeout(function(){prefetchNotes([po[pi+1],po[pi-1],po[pi+2]])},300);
  if(n.link&&pf) pf.then(function(d){if(d&&d.loc&&$('#pvloc')&&S.pv===n.id)$('#pvloc').innerHTML=locHtml(d.loc,n)}).catch(function(){});
  var ti=$('#pvTitle');
  ti.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();ti.blur()}else if(e.key==='Escape'){ti.value=n.title;ti.blur()}};
  ti.onblur=function(){var v=ti.value.trim();if(!v){ti.value=n.title;return}if(v===n.title)return;
    var old=n.title; n.title=v; n.updated=new Date().toISOString(); drawInboxList();
    var p=call('api_updateNote',n.id,{title:v}); undoToast('Renamed',function(){return p.then(function(){n.title=old;return call('api_updateNote',n.id,{title:old})}).then(function(){afterUndo([n.id])})})};
  $('#pvFile').onclick=function(){if(pvLeaveOk())fileNote(n.id)};
  $('#pvPr').onclick=function(){printNotes([n.id])};
  $('#pvSend').onclick=function(){sendNotes([n.id])};
  if($('#pvJp'))$('#pvJp').onclick=function(){justPhoto([n.id])};
  if($('#pvNp'))$('#pvNp').onclick=function(){noteFromScan(n.id,this)};
  pvLock();
  $('#pvDn').onclick=function(){downloadNotes([n.id])};
  $('#pvTask').onclick=function(){var on=n.tags.indexOf(TASK_TAG)>=0;addToTasks([n.id],on);this.textContent=on?'☑ Add to Tasks':'✓ In Tasks'};
  $('#pvOpen').onclick=function(){go('note',n.id)};
  if($('#pvEd')) $('#pvEd').onclick=function(){var b=this;
    if($('#pv .qein')){var q=$('#qeBody .qeseg');if(q)q.focus();return}
    if(b.dataset.on){S.editing=null;b.textContent='Saving…';nvFetch(n.id).catch(function(){}).then(function(){if(S.pv===n.id)renderPv()});return}
    if(isPhone()||(!n.sheet&&store('qeAlways')!==false)){if(n.sheet)window.open(editUrl(n),'_blank');else quickEdit(n,function(){if(S.pv===n.id)renderPv()},isPhone()?null:$('#pv .reader'));return}
    var r=$('#pv .reader')||$('#pv .pdfview')||$('#pv iframe');if(!r){S.editNow=n.id;go('note',n.id);return}   // edit right here in the preview
    var f=document.createElement('iframe');f.className='reader editor pvedit';f.allow='clipboard-read; clipboard-write';
    f.src=editUrl(n,true);
    f.onload=function(){try{f.focus()}catch(e){}};
    r.replaceWith(f);if(!n.sheet){f.insertAdjacentHTML('beforebegin',edHintHtml());bindEdHint(n,function(){if(S.pv===n.id)renderPv()})}S.editing=n.id;b.dataset.on=1;b.textContent='✓ Done editing';b.classList.add('primary')};
  if($('#pvAdd')) $('#pvAdd').onclick=function(){addText(n.id,function(){if(S.pv===n.id)renderPv()})};
  if($('#pvRc')) $('#pvRc').onclick=function(){S.rcData=null;rcDetails(n.id)};
  if($('#pvMk')) $('#pvMk').onclick=function(){markReceipt(n.id,this)};
  $('#pvDel').onclick=function(){var b=this;
    if(!b.dataset.arm){b.dataset.arm=1;b.textContent='Tap again to delete';setTimeout(function(){if(b.isConnected){b.textContent='Delete';delete b.dataset.arm}},3000);return}
    trashLater([n.id],n.link?'Link moved to Trash (the file is untouched)':'Note moved to Trash'); refreshInboxCount(); refreshSplit();};
};
window.qeLoad=function(n,take){S.qeCache=S.qeCache||{};var c=S.qeCache[n.id];
  if(c&&c.u===n.updated&&Date.now()-c.t<120000){if(take)delete S.qeCache[n.id];return c.p}
  var p=call('api_quickEditLoad',n.id);
  if(!take){S.qeCache[n.id]={p:p,u:n.updated,t:Date.now()};p.catch(function(){if(S.qeCache[n.id]&&S.qeCache[n.id].p===p)delete S.qeCache[n.id]})}
  return p};
window.quickEdit=function(n,after,host){
  var inl=!!host;   // host given: edit right in its place (the Inbox preview), not full screen
  var ov=document.createElement('div');ov.className='qe'+(inl?' qein':'');ov.id='qe';
  ov.innerHTML='<div class="qehead"><button class="btn small" id="qeNo">Cancel</button><b class="grow" style="text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(inl?'<span class="muted" style="font-weight:normal;font-size:13px">Editing · Ctrl+S saves · Esc cancels</span>':esc(n.title))+'</b><button class="btn small primary" id="qeOk" disabled>Save</button></div>'+
    '<div class="qetools"><button data-c="bold"><b>B</b></button><button data-c="italic"><i>I</i></button><button data-c="underline"><u>U</u></button><button data-c="h">H</button><button data-c="insertUnorderedList">• List</button><button data-c="insertOrderedList">1. List</button>'+(!isPhone()&&store('qeAlways')!==false?'<span class="grow"></span><button class="btn small" id="qeGd" title="Go back to editing in Google Docs on this computer">Use Google Docs editor instead</button>':'')+'</div>'+
    '<div class="qebody" id="qeBody"><div class="muted" style="padding:16px">Opening…</div></div>';
  if(inl){host.replaceWith(ov);S.qeIn={id:n.id,dirty:dirty};   // keep showing the note (dimmed) while it opens for editing
    var hs=host.getAttribute('style')||'';$('#qeBody').innerHTML='<div class="muted" style="padding:6px 2px;font-size:13px">Opening for editing…</div>';host.style.cssText=hs+';height:calc(100% - 40px);min-height:0;opacity:.55;pointer-events:none;border:0';$('#qeBody').appendChild(host)}else{document.body.appendChild(ov);document.body.classList.add('qeon')}
  var data=null,orig=[];
  function close(){if(inl){if(S.qeIn&&S.qeIn.id===n.id)S.qeIn=null;host.setAttribute('style',hs);if(ov.isConnected)ov.replaceWith(host)}else ov.remove();document.body.classList.remove('qeon')}
  if(inl) ov.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&(e.key==='s'||e.key==='S')){e.preventDefault();var ok=$('#qeOk');if(ok&&!ok.disabled)ok.click();else close()}
    else if(e.key==='Escape'){e.preventDefault();if(dirty()&&!confirmLeave())return;close()}});
  function dirty(){if(!data)return false;return [].some.call($$('#qeBody .qeseg'),function(e){return JSON.stringify(qeItems(e))!==orig[+e.dataset.k]})}
  $('#qeNo').onclick=function(){if(dirty()&&!confirmLeave())return;close()};
  if($('#qeGd')) $('#qeGd').onclick=function(){if(dirty()&&!confirmLeave())return;store('qeAlways',false);close();toast('Google Docs editor from now on: press ✏️ Edit again',3500)};
  function confirmLeave(){return window.confirm('Throw away your changes?')}
  qeLoad(n,true).then(function(d){if(!ov.isConnected)return;data=d;
    $('#qeBody').innerHTML=d.segs.map(function(sg,k){
      if(sg.type==='fixed')return '<div class="qefix">'+(sg.label==='Picture'?'🖼':sg.label==='Table'?'▦':'▪')+' '+esc(sg.label)+' <span class="muted">(stays as it is; open in Google Docs to change it)</span></div>';
      return '<div class="qeseg" contenteditable="true" data-k="'+k+'">'+qeHtml(sg.items)+'</div>'}).join('');
    $$('#qeBody .qeseg').forEach(function(e){orig[+e.dataset.k]=JSON.stringify(qeItems(e));e.addEventListener('input',function(){$('#qeOk').disabled=false})});
    var first=$('#qeBody .qeseg');if(first&&(inl||!d.segs.some(function(s){return s.type==='text'&&s.items.length}))){first.focus();
      if(inl){try{var rg=document.createRange();rg.selectNodeContents(first);rg.collapse(false);var sl=getSelection();sl.removeAllRanges();sl.addRange(rg)}catch(e){}}}
  }).catch(function(e){$('#qeBody').innerHTML='<div class="empty">Could not open this note for editing: '+esc(e.message)+'<br><br><a class="btn" target="_blank" href="'+editUrl(n)+'">Open in Google Docs</a></div>'});
  $$('.qetools button').forEach(function(b){b.onmousedown=function(e){e.preventDefault()};b.onclick=function(){var c=b.dataset.c;
    if(c==='h'){var cur=(document.queryCommandValue('formatBlock')||'').toLowerCase();document.execCommand('formatBlock',false,cur==='h2'?'p':'h2')}else document.execCommand(c);$('#qeOk').disabled=false}});
  $('#qeOk').onclick=function(){var ok=this,ch={},nCh=0;
    $$('#qeBody .qeseg').forEach(function(e){var k=+e.dataset.k,j=JSON.stringify(qeItems(e));if(j!==orig[k]){ch[k]=JSON.parse(j);nCh++}});
    if(!nCh){close();return}
    ok.disabled=true;ok.textContent='Saving…';
    call('api_quickEditSave',n.id,data.ver,ch).then(function(){close();toast('Saved');n.updated=new Date().toISOString();
      nvFetch(n.id).catch(function(){}).then(function(){if(after)after()})})
    .catch(function(e){ok.disabled=false;ok.textContent='Save';toast('Could not save: '+e.message)})};
};
window.pvMove=function(d){var o=S.pvOrder||[],i=o.indexOf(S.pv);if(i<0)return;var j=Math.max(0,Math.min(o.length-1,i+d));if(j===i||!pvLeaveOk())return;S.pv=o[j];markAct();renderPv();
  var r=$('#lcol .row.act');if(r)r.scrollIntoView({block:'nearest'})};
'ok'