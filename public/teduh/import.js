(() => {
 const input=document.getElementById('prayer-file'),status=document.getElementById('status');
 function setStatus(t){status.textContent=t;}
 document.getElementById('import').addEventListener('click',async()=>{
   if (!input.files?.length){setStatus('Pilih file HTML asli terlebih dahulu.');return}
   const file=input.files[0];
   if(file.size>7_000_000){setStatus('Ukuran file terlalu besar. Maksimum 7 MB.');return}
   try{
     const raw=await file.text();
     const doc=new DOMParser().parseFromString(raw,'text/html');
     function readGlobal(name){
       const prefix='window.'+name+'=';
       const script=Array.from(doc.querySelectorAll('script')).find(s=>s.textContent.trimStart().startsWith(prefix));
       if(!script)throw Error('Tidak menemukan '+name+' dalam file.');
       const json=script.textContent.trim().slice(prefix.length).replace(/;\s*$/,'');
       return JSON.parse(json);
     }
     const data=readGlobal('DOA_DATA'),extras=readGlobal('DOA_EXTRAS');
     if (!Array.isArray(data.chapters)||data.chapters.length!==13||!Array.isArray(extras.items)) throw Error('Format file tidak cocok.');
     localStorage.setItem('doa-teduh-local-v34',JSON.stringify({data,extras}));
     setStatus('Berhasil: '+data.chapters.length+' fase dan '+extras.items.length+' doa pilihan tersimpan di perangkat. Silakan buka Doa Teduh.');
   }catch(e){setStatus('Gagal mengimpor: '+e.message);}
 });
 document.getElementById('clear').addEventListener('click',()=>{
  localStorage.removeItem('doa-teduh-local-v34');setStatus('Data doa pribadi di perangkat ini sudah dibersihkan.');
 });
 if(localStorage.getItem('doa-teduh-local-v34'))setStatus('Perangkat ini sudah menyimpan naskah pribadi yang pernah diimpor.');
})();
