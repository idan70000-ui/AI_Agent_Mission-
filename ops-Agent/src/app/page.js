'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  async function investigate() {
    setLoading(true);
    setReport(null);
    setError(null);

    try {
      const res = await fetch('/investigasion', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.barrel}>🛢️</div>
        <h1 className={styles.title}>THE BARREL</h1>
        <p className={styles.tagline}>חנות משקאות חריפים פרימיום</p>
        <div className={styles.divider}>
          <span>🥃</span>
          <div className={styles.line} />
          <span>🍷</span>
          <div className={styles.line} />
          <span>🍾</span>
        </div>
        <p className={styles.subtitle}>מערכת ניטור ואבחון שירות</p>
      </div>

      <button className={styles.button} onClick={investigate} disabled={loading}>
        {loading ? '⏳ חוקר את השירות...' : '🔍 חקור'}
      </button>

      {error && (
        <div className={styles.error}>
          <span>⚠️</span> {error}
        </div>
      )}

      {report && (
        <div className={styles.report}>
          <div className={styles.reportHeader}>
            <span>📋</span> דוח חקירה
          </div>
          <pre className={styles.output}>{report.output}</pre>
          <div className={styles.timestamp}>
            🕐 {new Date(report.createdAt).toLocaleString('he-IL')}
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <span>🛢️ The Barrel</span>
        <span>·</span>
        <span>Whisky · Vodka · Gin · Rum</span>
      </footer>
    </main>
  );
}
