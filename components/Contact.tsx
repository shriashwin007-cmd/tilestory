"use client";

import { FormEvent, useState } from "react";
import { STORE, waLink } from "@/lib/store";
import Reveal from "./Reveal";
import ArrowButton from "./ArrowButton";
import styles from "./Contact.module.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setError("");

    fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, message }),
    }).catch(() => {});

    const waMessage = `Hi Tile Story!\n\nName: ${name}\nPhone: ${phone}\n\nMessage: ${message || "I'd like to know more."}`;
    window.open(waLink(waMessage), "_blank", "noopener,noreferrer");
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <span className="ghost-num">05</span>
          <div className="s-label" style={{ justifyContent: "center" }}>
            <span className="s-index">05</span>Get In Touch
          </div>
          <h2 className="s-title">
            Visit Our <em>Showroom</em>
          </h2>
        </Reveal>

        <div className={styles.grid}>
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>📍</span>
              <div>
                {STORE.address}
                <br />
                <a
                  className={styles.mapLink}
                  href={STORE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps ↗
                </a>
              </div>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>🕒</span>
              <span>{STORE.hours}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>📞</span>
              <a href={`tel:${STORE.phoneTel}`}>{STORE.phoneDisplay}</a>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>✉️</span>
              <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.fg}>
              <label className={styles.fl} htmlFor="cName">
                Your Name
              </label>
              <input
                id="cName"
                className={styles.fi}
                type="text"
                placeholder="Eg. Priya Krishnan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.fg}>
              <label className={styles.fl} htmlFor="cPhone">
                Phone Number
              </label>
              <input
                id="cPhone"
                className={styles.fi}
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={styles.fg}>
              <label className={styles.fl} htmlFor="cMsg">
                Tell Us About Your Project
              </label>
              <textarea
                id="cMsg"
                className={styles.fta}
                placeholder="I'm looking for bathroom tiles..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <ArrowButton type="submit" className={styles.fsub}>
              Send via WhatsApp
            </ArrowButton>
          </form>
        </div>
      </div>
    </section>
  );
}
