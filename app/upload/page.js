"use client";
import styles from "../Landing.module.css";
import contentStyles from "../content/content.module.css";
import uploadStyles from "./upload.module.css";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

export default function UploadPage() {
  const [csvName, setCsvName] = useState("");
  const [imgPreview, setImgPreview] = useState("https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  const [menuOpen, setMenuOpen] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);
  const [imgProgress, setImgProgress] = useState(0);
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [dragCsv, setDragCsv] = useState(false);
  const [dragImg, setDragImg] = useState(false);
  const csvInput = useRef();
  const imgInput = useRef();
  const router = useRouter();

  function uploadFile(file, setProgress, setUploaded, cb) {
    setProgress(0);
    setUploaded(false);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload"); // Change to your real endpoint
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = function () {
      setProgress(100);
      setUploaded(true);
      if (cb) cb();
    };
    xhr.onerror = function () {
      setProgress(0);
      setUploaded(false);
      alert("Upload failed");
    };
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  }

  function handleCsv(e) {
    const file = e.target.files[0];
    if (file) {
      setCsvName(file.name);
      setCsvUploaded(false);
      // Parse CSV and store in localStorage
      Papa.parse(file, {
        complete: function(results) {
          if (results.data && results.data.length > 1) {
            const headers = results.data[0];
            const rows = results.data.slice(1).filter(row => row.length === headers.length);
            localStorage.setItem('csvHeaders', JSON.stringify(headers));
            localStorage.setItem('csvRows', JSON.stringify(rows));
          }
        }
      });
      uploadFile(file, setCsvProgress, setCsvUploaded);
    }
  }
  function handleImg(e) {
    const file = e.target.files[0];
    if (file) {
      setImgUploaded(false);
      uploadFile(file, setImgProgress, setImgUploaded, () => {
        const url = URL.createObjectURL(file);
        setImgPreview(url);
        localStorage.setItem('uploadedImageUrl', url);
      });
    }
  }

  function handleDropCsv(e) {
    e.preventDefault();
    setDragCsv(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      csvInput.current.files = e.dataTransfer.files;
      handleCsv({ target: { files: e.dataTransfer.files } });
    }
  }
  function handleDropImg(e) {
    e.preventDefault();
    setDragImg(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      imgInput.current.files = e.dataTransfer.files;
      handleImg({ target: { files: e.dataTransfer.files } });
    }
  }

  function clearCsv() {
    setCsvName("");
    setCsvProgress(0);
    setCsvUploaded(false);
    if (csvInput.current) csvInput.current.value = "";
  }
  function clearImg() {
    setImgPreview("https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    setImgProgress(0);
    setImgUploaded(false);
    if (imgInput.current) imgInput.current.value = "";
    localStorage.removeItem('uploadedImageUrl');
  }

  return (
    <div className={styles.landing}>
      <header className={styles.navbar} style={{position:'relative'}}>
        <div className={styles.logoRow}>
          <img src="/logo_image.svg" alt="Logo" className={styles.logo} />
          <span className={styles.brand}>Image-Template-Filler</span>
        </div>
        <nav className={contentStyles.navLinks}>
          <a href="/" className={contentStyles.navLink}>Home</a>
          <a href="https://github.com/alvin-dennis/Image-Template-Filler" target="_blank" rel="noopener noreferrer" className={contentStyles.navLink}>Github</a>
        </nav>
        <button className={uploadStyles.hamburger} aria-label="Open menu" onClick={()=>setMenuOpen(v=>!v)}>
          <span className={uploadStyles.hamburgerBar}></span>
          <span className={uploadStyles.hamburgerBar}></span>
          <span className={uploadStyles.hamburgerBar}></span>
        </button>
        {menuOpen && <div className={uploadStyles.menuOverlay + ' ' + uploadStyles.show} onClick={()=>setMenuOpen(false)}></div>}
        {menuOpen && (
          <nav className={uploadStyles.mobileNav + ' ' + uploadStyles.show}>
            <a href="/" onClick={()=>setMenuOpen(false)}>Home</a>
            <a href="https://github.com/alvin-dennis/Image-Template-Filler" target="_blank" rel="noopener noreferrer" onClick={()=>setMenuOpen(false)}>Github</a>
          </nav>
        )}
      </header>
      <main className={uploadStyles.uploadMain}>
        <h1 className={uploadStyles.uploadTitle}>Upload CSV & Template</h1>
        <label className={uploadStyles.uploadLabel}>CSV File</label>
        <div
          style={{marginBottom:24}}
          onDragOver={e => {e.preventDefault(); setDragCsv(true);}}
          onDragLeave={e => {e.preventDefault(); setDragCsv(false);}}
          onDrop={handleDropCsv}
        >
          <input
            type="file"
            accept=".csv"
            ref={csvInput}
            style={{display:"none"}}
            onChange={handleCsv}
          />
          <div
            className={uploadStyles.uploadInput + (dragCsv ? ' ' + uploadStyles.dragActive : '')}
            tabIndex={0}
            onClick={()=>csvInput.current?.click()}
            style={{cursor:"pointer", userSelect:"none", display:'flex', alignItems:'center', justifyContent:'space-between'}}
          >
            {csvName ? (
              <>
                <span style={{color:'#181028', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{csvName}</span>
                <button type="button" onClick={e => {e.stopPropagation(); clearCsv();}} style={{marginLeft:8, background:'none', border:'none', color:'#b3a9c9', fontWeight:700, fontSize:18, cursor:'pointer'}}>×</button>
              </>
            ) : <span style={{color:'#b3a9c9'}}>Drag or click to upload</span>}
          </div>
          {csvProgress > 0 && !csvUploaded && (
            <div className={uploadStyles.uploadProgressBar}>
              <div className={uploadStyles.uploadProgressBarInner} style={{width: csvProgress + '%'}}></div>
            </div>
          )}
          {csvUploaded && <div style={{color:'#5b159a', fontWeight:600, marginTop:4}}>Uploaded!</div>}
        </div>
        <label className={uploadStyles.uploadLabel}>Template Image</label>
        <div
          style={{marginBottom:24}}
          onDragOver={e => {e.preventDefault(); setDragImg(true);}}
          onDragLeave={e => {e.preventDefault(); setDragImg(false);}}
          onDrop={handleDropImg}
        >
          <input
            type="file"
            accept="image/*"
            ref={imgInput}
            style={{display:"none"}}
            onChange={handleImg}
          />
          <div
            className={uploadStyles.uploadInput + (dragImg ? ' ' + uploadStyles.dragActive : '')}
            tabIndex={0}
            onClick={()=>imgInput.current?.click()}
            style={{cursor:"pointer", userSelect:"none", display:'flex', alignItems:'center', justifyContent:'space-between'}}
          >
            {imgUploaded ? (
              <>
                <span style={{color:'#181028', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{imgInput.current?.files?.[0]?.name || "Image uploaded"}</span>
                <button type="button" onClick={e => {e.stopPropagation(); clearImg();}} style={{marginLeft:8, background:'none', border:'none', color:'#b3a9c9', fontWeight:700, fontSize:18, cursor:'pointer'}}>×</button>
              </>
            ) : <span style={{color:'#b3a9c9'}}>Drag or click to upload</span>}
          </div>
          {imgProgress > 0 && !imgUploaded && (
            <div className={uploadStyles.uploadProgressBar}>
              <div className={uploadStyles.uploadProgressBarInner} style={{width: imgProgress + '%'}}></div>
            </div>
          )}
          {imgUploaded && <div style={{color:'#5b159a', fontWeight:600, marginTop:4}}>Uploaded!</div>}
        </div>
        <label className={uploadStyles.uploadPreviewLabel}>Template Preview</label>
        <div className={uploadStyles.uploadPreview}>
          <Image src={imgPreview} alt="Template Preview" width={700} height={440} style={{objectFit:"cover", width:"100%", height:"100%", borderRadius:16}} />
        </div>
        <div className={uploadStyles.uploadActions}>
          <button
            className={uploadStyles.uploadButton}
            type="button"
            disabled={!(csvUploaded && imgUploaded)}
            style={{opacity: !(csvUploaded && imgUploaded) ? 0.6 : 1, pointerEvents: !(csvUploaded && imgUploaded) ? 'none' : 'auto'}}
            onClick={()=>router.push("/content")}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
