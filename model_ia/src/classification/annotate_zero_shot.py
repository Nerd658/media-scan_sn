import os
import csv
import json
import random
import sqlite3
from pathlib import Path
from typing import List
from transformers import pipeline

# --------------------------
# Config
# --------------------------
ROOT = Path.cwd()
DATA_DIR = ROOT / "data" / "facebook"
CSV_IN = DATA_DIR / "facebook_posts.csv"
DB_IN = DATA_DIR / "facebook_posts.db"
CSV_OUT = DATA_DIR / "facebook_posts_annotated.csv"
JSON_OUT = DATA_DIR / "facebook_posts_annotated.json"

SAMPLE_SIZE = 2000  # Augmenté
SEED = 42

LABELS = ["Politique","Gouvernance","Économie", "Sécurité", "Santé", "Culture", "Sport", "Autres", "Social", "Environnement", "Diplomatie","Justice","Humanitaire"]
HYPOTHESIS_TEMPLATE = "Ce texte parle de {}."

# --------------------------
# Fonctions utilitaires
# --------------------------
def load_posts_from_csv(path: Path) -> List[dict]:
    posts = []
    if not path.exists():
        return posts
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            posts.append(r)
    return posts

def load_posts_from_db(path: Path) -> List[dict]:
    posts = []
    if not path.exists():
        return posts
    conn = sqlite3.connect(str(path))
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, page, content, post_date, post_link, like_count, share_count, comments_count, scraped_at FROM posts")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        for row in rows:
            posts.append(dict(zip(cols, row)))
    except Exception as e:
        print("Warning: impossible de lire la table posts depuis DB :", e)
    finally:
        conn.close()
    return posts

def sample_posts(posts: List[dict], n: int) -> List[dict]:
    random.seed(SEED)
    if len(posts) <= n:
        return posts
    return random.sample(posts, n)

def ensure_output_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

def add_category_column_db(db_path: Path):
    conn = sqlite3.connect(str(db_path))
    cur = conn.cursor()
    try:
        cur.execute("PRAGMA table_info(posts)")
        cols = [r[1] for r in cur.fetchall()]
        if "category" not in cols:
            cur.execute("ALTER TABLE posts ADD COLUMN category TEXT")
            conn.commit()
            print("✅ Colonne 'category' ajoutée à la table posts (DB).")
        else:
            print("ℹ️ Colonne 'category' déjà présente.")
    except Exception as e:
        print("⚠️ Impossible d'ajouter la colonne 'category' dans la DB :", e)
    finally:
        conn.close()

def write_outputs(annotated: List[dict]):
    # CSV
    fieldnames = list(annotated[0].keys()) if annotated else ["id","page","content","category"]
    with open(CSV_OUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in annotated:
            writer.writerow(r)
    print(f"📁 CSV sauvegardé : {CSV_OUT}")

    # JSON
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(annotated, f, ensure_ascii=False, indent=2)
    print(f"📁 JSON sauvegardé : {JSON_OUT}")

def update_db_categories(db_path: Path, annotated: List[dict]):
    if not db_path.exists():
        print("⚠️ DB introuvable, saut mise à jour DB.")
        return
    conn = sqlite3.connect(str(db_path))
    cur = conn.cursor()
    try:
        for r in annotated:
            pid = r.get("id")
            cat = r.get("category")
            if pid is None:
                continue
            cur.execute("UPDATE posts SET category = ? WHERE id = ?", (cat, pid))
        conn.commit()
        print("✅ DB mise à jour (categories).")
    except Exception as e:
        print("⚠️ Erreur lors de la mise à jour DB :", e)
    finally:
        conn.close()

# --------------------------
# Main
# --------------------------
def main():
    ensure_output_dir()

    # 1) Charger posts
    posts = load_posts_from_csv(CSV_IN)
    if not posts:
        print("ℹ️ CSV introuvable ou vide — tentative depuis DB...")
        posts = load_posts_from_db(DB_IN)
    if not posts:
        print("❌ Aucun post trouvé dans CSV ni DB. Arrêt.")
        return

    print(f"ℹ️ {len(posts)} posts disponibles, échantillonnage de {SAMPLE_SIZE} posts pour annotation auto.")
    sampled = sample_posts(posts, SAMPLE_SIZE)

    # 2) Initialiser pipeline zero-shot (GPU si dispo)
    device_id = 0 
    print("⚙️ Chargement du modèle zero-shot sur", "GPU" if device_id==0 else "CPU")
    classifier = pipeline("zero-shot-classification",
                          model="joeddav/xlm-roberta-large-xnli",
                          device=device_id)

    annotated = []
    for i, p in enumerate(sampled, 1):
        text = (p.get("content") or "").strip()
        if not text:
            p["category"] = "Autres"
            annotated.append(p)
            continue

        try:
            out = classifier(text, LABELS, hypothesis_template=HYPOTHESIS_TEMPLATE, multi_label=False)
            top_label = out["labels"][0]
            top_score = out["scores"][0]
            p["category"] = top_label
            p["category_score"] = float(top_score)
            annotated.append(p)
        except Exception as e:
            print(f"⚠️ Erreur zero-shot pour post {i} (id {p.get('id')}):", e)
            p["category"] = "Autres"
            p["category_score"] = 0.0
            annotated.append(p)

        if i % 50 == 0:
            print(f"  → Annotés {i}/{len(sampled)}")

    # 3) Écrire fichiers de sortie
    write_outputs(annotated)

    # 4) Mise à jour DB
    add_category_column_db(DB_IN)
    update_db_categories(DB_IN, annotated)

    print("🎉 Annotation zero-shot terminée.")
    print(f"Résultats partiels : {CSV_OUT} / {JSON_OUT} / DB updated (posts.category)")

if __name__ == "__main__":
    main()
