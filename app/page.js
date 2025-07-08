// app/page.js
"use client";
import { useRouter } from "next/navigation";
import styles from './Landing.module.css';
import './page.module.css';
import { Upload, Pencil, Download, FileText, Layers, Eye } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div id="top" className={styles.landing}>
      <header className={styles.navbar}>
        <div className={styles.logoRow}>
          <img src="/logo_image.svg" alt="Logo" className={styles.logo} />
          <span className={styles.brand}>Image-Template-Filler</span>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.heroCard}>
          <div className={styles.heroText}>
            <h1 className={styles.sectionTitleLarge}>
              Convert CSV to <br />
              Custom Images in <br />
              <span className={styles.accent}>Seconds</span>
            </h1>
            <p>
              Transform your CSV data into stunning, personalized images effortlessly. Our intuitive platform allows you to upload your CSV, customize templates, and generate high-quality visuals in bulk.
            </p>
            <button
              className={styles.cta}
              onClick={() => router.push('/upload')}
            >
              Upload CSV & Template
            </button>
          </div>
          <div className={styles.heroImageWrap}>
            <img src="/landing_image.png" alt="Hero" className={styles.heroImage} />
          </div>
        </div>

        <div className={styles.sectionSpacing}>
          <div className={styles.divider} />
        </div>

        <div className={styles.centeredSection}>
          <h2 className={styles.sectionTitleLarge}>How it works</h2>
          <div className={`${styles.sectionCardGrid} ${styles.centeredCardGrid}`}>
            <div className={`${styles.sectionCard} ${styles['sectionCard--highlight']}`}>
              <span className={styles.sectionCardNumber}>01</span>
              <div className={styles.sectionCardTitle}>Upload</div>
              <div className={styles.sectionCardText}>Upload your CSV file and select a template.</div>
            </div>
            <div className={styles.sectionCard}>
              <span className={styles.sectionCardNumber}>02</span>
              <div className={styles.sectionCardTitle}>Edit Placeholders</div>
              <div className={styles.sectionCardText}>Customize your template by mapping CSV columns to image placeholders.</div>
            </div>
            <div className={styles.sectionCard}>
              <span className={styles.sectionCardNumber}>03</span>
              <div className={styles.sectionCardTitle}>Download ZIP</div>
              <div className={styles.sectionCardText}>Download a ZIP file containing your generated images.</div>
            </div>
          </div>
        </div>

        <div className={styles.sectionSpacing}>
          <div className={styles.divider} />
        </div>

        <div className={styles.centeredSection}>
          <h2 className={styles.sectionTitleLarge}>Features</h2>
          <div className={`${styles.sectionCardGrid} ${styles.centeredCardGrid}`}>
            <div className={`${styles.sectionCard} ${styles['sectionCard--highlight']}`}>
              <span className={styles.sectionCardNumber}>01</span>
              <div className={styles.sectionCardTitle}>Content Editing</div>
              <div className={styles.sectionCardText}>Generate hundreds of images from a single CSV file.</div>
            </div>
            <div className={styles.sectionCard}>
              <span className={styles.sectionCardNumber}>02</span>
              <div className={styles.sectionCardTitle}>Batch Generation</div>
              <div className={styles.sectionCardText}>Edit the contents of the uploaded CSV file.</div>
            </div>
            <div className={styles.sectionCard}>
              <span className={styles.sectionCardNumber}>03</span>
              <div className={styles.sectionCardTitle}>Instant Previews</div>
              <div className={styles.sectionCardText}>Preview your images in real-time before downloading.</div>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <img src="/logo_image.svg" alt="Logo" className={styles.footerLogo} />
          <span className={styles.footerBrand}>Image-Template-Filler</span>
        </div>
        <a href="https://github.com/alvin-dennis/Image-Template-Filler" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          Github
        </a>
      </footer>
    </div>
  );
}
