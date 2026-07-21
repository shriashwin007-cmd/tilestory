import { getProducts, getReviews, getEnquiries } from "@/lib/data";
import { CATEGORIES, FINISHES, SIZES } from "@/lib/products";
import {
  upsertProduct,
  removeProductImage,
  deleteProduct,
  addReview,
  deleteReview,
  deleteEnquiry,
  signOut,
} from "./actions";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, reviews, enquiries] = await Promise.all([
    getProducts(),
    getReviews(),
    getEnquiries(),
  ]);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Tile Story Admin</h1>
        <form action={signOut}>
          <button className={styles.signOut} type="submit">
            Sign Out
          </button>
        </form>
      </header>

      <section className={styles.section}>
        <h2 className={styles.h2}>Enquiries ({enquiries.length})</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Received</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.phone}</td>
                  <td className={styles.msgCell}>{e.message || "—"}</td>
                  <td>{new Date(e.created_at).toLocaleString("en-IN")}</td>
                  <td>
                    <form action={deleteEnquiry}>
                      <input type="hidden" name="id" value={e.id} />
                      <button className={styles.deleteBtn} type="submit">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.empty}>
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Products ({products.length})</h2>

        <details className={styles.addBox}>
          <summary className={styles.addSummary}>+ Add / update a product</summary>
          <form action={upsertProduct} className={styles.form}>
            <div className={styles.formRow}>
              <label>ID (e.g. TS031)</label>
              <input name="id" required />
            </div>
            <div className={styles.formRow}>
              <label>Name</label>
              <input name="name" required />
            </div>
            <div className={styles.formRow}>
              <label>Category</label>
              <select name="category" required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Finish</label>
              <select name="finish" required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {FINISHES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Size</label>
              <select name="size" required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Colors (comma-separated hex)</label>
              <input name="colors" placeholder="#8B8B8B, #A9A9A9" required />
            </div>
            <div className={styles.formRow}>
              <label>Use cases (comma-separated)</label>
              <input name="use_cases" placeholder="Living Room, Bedroom" required />
            </div>
            <div className={styles.formRow}>
              <label>Tags (comma-separated)</label>
              <input name="tags" placeholder="modern, gray" />
            </div>
            <div className={styles.formRow}>
              <label>Image filename</label>
              <input name="image" placeholder="living_room_1.jpg" />
            </div>
            <div className={styles.formRowWide}>
              <label>Description</label>
              <textarea name="description" required />
            </div>
            <button className={styles.submitBtn} type="submit">
              Save Product
            </button>
          </form>
        </details>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Photos (up to 3)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    <div className={styles.photoForm}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={styles.photoSlotWrap}>
                          <form
                            action="/admin/upload-image"
                            method="POST"
                            encType="multipart/form-data"
                            className={styles.slotForm}
                          >
                            <input type="hidden" name="id" value={p.id} />
                            <label className={styles.photoSlot}>
                              {p.images[i] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.images[i]} alt="" className={styles.photoThumb} />
                              ) : (
                                <span className={styles.photoEmpty}>{i + 1}</span>
                              )}
                              <input
                                type="file"
                                name={`image${i + 1}`}
                                accept="image/*"
                                className={styles.photoInput}
                              />
                            </label>
                            <button type="submit" className={styles.slotSaveBtn} title="Upload photo">
                              ↑
                            </button>
                          </form>
                          {p.images[i] && (
                            <form action={removeProductImage}>
                              <input type="hidden" name="id" value={p.id} />
                              <input type="hidden" name="slot" value={i + 1} />
                              <button type="submit" className={styles.photoRemove} title="Remove photo">
                                ×
                              </button>
                            </form>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className={styles.deleteBtn} type="submit">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Reviews ({reviews.length})</h2>

        <details className={styles.addBox}>
          <summary className={styles.addSummary}>+ Add a review</summary>
          <form action={addReview} className={styles.form}>
            <div className={styles.formRow}>
              <label>Customer name</label>
              <input name="name" required />
            </div>
            <div className={styles.formRow}>
              <label>Rating (1–5)</label>
              <input name="rating" type="number" min={1} max={5} defaultValue={5} required />
            </div>
            <div className={styles.formRowWide}>
              <label>Review text</label>
              <textarea name="text" required />
            </div>
            <button className={styles.submitBtn} type="submit">
              Add Review
            </button>
          </form>
        </details>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Text</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.rating}★</td>
                  <td className={styles.msgCell}>{r.text}</td>
                  <td>
                    <form action={deleteReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className={styles.deleteBtn} type="submit">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
