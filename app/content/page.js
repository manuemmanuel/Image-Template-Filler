"use client";
import styles from "../Landing.module.css";
import contentStyles from "./content.module.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function ContentPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState(["Column 1", "Column 2", "Column 3"]);
  const [csvRows, setCsvRows] = useState([
    ["Value A1", "Value B1", "Value C1"],
    ["Value A2", "Value B2", "Value C2"],
    ["Value A3", "Value B3", "Value C3"],
    ["Value A4", "Value B4", "Value C4"],
    ["Value A5", "Value B5", "Value C5"],
  ]);
  const [previewImage, setPreviewImage] = useState("/content_preview.png");
  const [placedTags, setPlacedTags] = useState([]); // {header, x, y}
  const [draggedHeader, setDraggedHeader] = useState(null);
  const canvasRef = useRef();
  const [imageSize, setImageSize] = useState({ width: 700, height: 440 });

  useEffect(() => {
    const headers = localStorage.getItem('csvHeaders');
    const rows = localStorage.getItem('csvRows');
    const uploadedImageUrl = localStorage.getItem('uploadedImageUrl');
    if (headers && rows) {
      try {
        setCsvHeaders(JSON.parse(headers));
        setCsvRows(JSON.parse(rows));
      } catch (e) {
        // fallback to defaults
      }
    }
    if (uploadedImageUrl) {
      setPreviewImage(uploadedImageUrl);
      // Dynamically get image size
      const img = new window.Image();
      img.onload = () => setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      img.src = uploadedImageUrl;
    }
  }, []);

  function handleCellChange(rowIdx, cellIdx, value) {
    setCsvRows(prev => {
      const updated = prev.map(row => [...row]);
      updated[rowIdx][cellIdx] = value;
      return updated;
    });
  }

  // Drag-and-drop logic
  function onDragStart(header) {
    setDraggedHeader(header);
  }
  function onDragOverCanvas(e) {
    e.preventDefault();
  }
  function onDropCanvas(e) {
    e.preventDefault();
    if (!draggedHeader) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlacedTags(tags => [
      ...tags,
      { header: draggedHeader, x, y }
    ]);
    setDraggedHeader(null);
  }
  function removeTag(idx) {
    setPlacedTags(tags => tags.filter((_, i) => i !== idx));
  }
  // Allow moving tags (optional, simple click-to-move)
  function onTagDragStart(idx) {
    setDraggedHeader(placedTags[idx].header);
    setPlacedTags(tags => tags.filter((_, i) => i !== idx));
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
        <button className={contentStyles.hamburger} aria-label="Open menu" onClick={()=>setMenuOpen(v=>!v)}>
          <span className={contentStyles.hamburgerBar}></span>
          <span className={contentStyles.hamburgerBar}></span>
          <span className={contentStyles.hamburgerBar}></span>
        </button>
        {menuOpen && <div className={contentStyles.menuOverlay} onClick={()=>setMenuOpen(false)}></div>}
        {menuOpen && (
          <nav className={contentStyles.mobileNav}>
            <a href="/" onClick={()=>setMenuOpen(false)}>Home</a>
            <a href="https://github.com/alvin-dennis/Image-Template-Filler" target="_blank" rel="noopener noreferrer" onClick={()=>setMenuOpen(false)}>Github</a>
          </nav>
        )}
      </header>
      <main className={contentStyles.mainContent} style={{display:'flex', flexDirection:'row', gap: '48px', alignItems:'flex-start', justifyContent:'center', padding:'40px 0'}}>
        <section style={{flex: '0 0 720px', maxWidth: 720, width: 720, display:'flex', flexDirection:'column', alignItems:'center'}}>
          <h2 className={contentStyles.sectionTitle}>Preview</h2>
          <div
            className={contentStyles.previewImageWrap}
            ref={canvasRef}
            style={{position:'relative', width:imageSize.width, height:imageSize.height, background:'#f7f8fa', borderRadius:20, overflow:'hidden', margin:'0 auto', boxShadow:'0 2px 16px rgba(24,16,40,0.08)'}}
            onDragOver={onDragOverCanvas}
            onDrop={onDropCanvas}
          >
            <Image src={previewImage} alt="Preview" width={imageSize.width} height={imageSize.height} className={contentStyles.previewImage} style={{borderRadius:20, objectFit:'contain', width:'100%', height:'100%'}} />
            {/* Placed tags as overlays */}
            {placedTags.map((tag, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => onTagDragStart(idx)}
                style={{
                  position:'absolute',
                  left:`${tag.x}%`,
                  top:`${tag.y}%`,
                  transform:'translate(-50%,-50%)',
                  background:'#f3eaff',
                  borderRadius:16,
                  color:'#181028',
                  fontWeight:600,
                  padding:'4px 12px',
                  cursor:'grab',
                  boxShadow:'0 1px 4px rgba(24,16,40,0.08)',
                  zIndex:2,
                  userSelect:'none',
                  display:'flex',
                  alignItems:'center',
                }}
              >
                {/* Show sample value from first row if available */}
                <span style={{marginRight:8}}>{csvRows[0]?.[csvHeaders.indexOf(tag.header)] ?? tag.header}</span>
                <button onClick={e => {e.stopPropagation(); removeTag(idx);}} style={{background:'none', border:'none', color:'#b3a9c9', fontWeight:700, fontSize:16, marginLeft:4, cursor:'pointer'}}>×</button>
              </div>
            ))}
          </div>
          {/* Draggable tags for CSV headers */}
          <div style={{marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent:'center'}}>
            {csvHeaders.map((header, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => onDragStart(header)}
                style={{padding: '8px 20px', background: '#f3eaff', borderRadius: 16, color: '#181028', fontWeight: 600, cursor: 'grab', boxShadow: '0 1px 4px rgba(24,16,40,0.08)', fontSize:16}}
              >
                {header}
              </div>
            ))}
          </div>
        </section>
        <section style={{flex: '1 1 400px', minWidth: 320, maxWidth: 480}}>
          <div style={{marginBottom: 32}}>
            <h2 className={contentStyles.sectionTitle}>Edit CSV Content</h2>
            <div className={contentStyles.tableWrapper}>
              <table className={contentStyles.csvTable}>
                <thead className={contentStyles.tableHead}>
                  <tr>
                    {csvHeaders.map((header, idx) => (
                      <th key={idx} className={contentStyles.tableHeader}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={contentStyles.tableCell}>
                          <input
                            type="text"
                            value={cell}
                            onChange={e => handleCellChange(rowIdx, cellIdx, e.target.value)}
                            className={contentStyles.tableInput}
                            style={{width:'100%', border:'none', background:'transparent', outline:'none', font:'inherit', color:'#181028'}}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{background:'#f7f8fa', borderRadius:16, padding:'24px 20px', boxShadow:'0 1px 4px rgba(24,16,40,0.06)', color:'#181028', fontSize:16}}>
            <span className={contentStyles.previewLabel}>Preview</span>
            <div className={contentStyles.previewTitle}>Image Preview</div>
            <div className={contentStyles.previewDesc}>
              Drag a tag onto the image to place it. You can move or remove tags. The value from the first row will be shown as a live preview.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

