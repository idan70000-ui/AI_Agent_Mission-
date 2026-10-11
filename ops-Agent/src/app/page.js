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
      <div className={styles.header}>
        <h1 className={styles.title}>סוכן חקירת תקלות</h1>
        <p className={styles.subtitle}>The Barrel — מערכת ניטור שירות</p>
      </div>

      <button className={styles.button} onClick={investigate} disabled={loading}>
        {loading ? (
          <span className={styles.loading}>חוקר את השירות...</span>
        ) : (
          '🔍 חקור'
        )}
      </button>

      {error && (
        <div className={styles.error}>
          <strong>שגיאה:</strong> {error}
        </div>
      )}

      {report && (
        <div className={styles.report}>
          <div className={styles.reportHeader}>דוח חקירה</div>
          <pre className={styles.output}>{report.output}</pre>
          <div className={styles.timestamp}>
            {new Date(report.createdAt).toLocaleString('he-IL')}
          </div>
        </div>
      )}
    </main>
  );
}
