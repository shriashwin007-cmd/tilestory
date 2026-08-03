import { STORE, waLink } from "@/lib/store";
import styles from "./MobileTabBar.module.css";

// A fixed bottom action bar -- a native e-commerce-app pattern (persistent
// Call/WhatsApp within thumb reach) that the desktop site deliberately
// doesn't have, since it isn't needed when the nav/CTAs are already
// always-visible on a wide screen.
export default function MobileTabBar() {
  return (
    <div className={styles.bar}>
      <a href={`tel:${STORE.phoneTel}`} className={styles.callBtn}>
        📞 Call
      </a>
      <a
        href={waLink("Hi Tile Story! I'd like to know more about your tiles.")}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.waBtn}
      >
        💬 WhatsApp
      </a>
    </div>
  );
}
