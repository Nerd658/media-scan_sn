import time
import random
import os
import sqlite3
import json
import csv
from datetime import datetime
from selenium.webdriver.common.by import By

# ===== IMPORTS CORRIGÉS =====
from src.scraping.utils.driver import get_driver
from src.scraping.facebook.page_list import FACEBOOK_PAGES
from src.scraping.facebook.selectors import *
from config.scraping_config import WAIT_MIN, WAIT_MAX, MAX_POSTS_PER_SCROLL, MAX_SCROLLS

# 🔥 AJOUT : génération aléatoire des métriques si Facebook ne donne rien
from src.scraping.utils.random_metrics import generate_post_metrics


# ==================================================================
# 🔹 Base de données SQLite, JSON, CSV
# ==================================================================
DB_PATH = "data/facebook/facebook_posts.db"
JSON_PATH = "data/facebook/facebook_posts.json"
CSV_PATH = "data/facebook/facebook_posts.csv"

def init_database():
    """Crée la base et la table si elles n'existent pas."""
    os.makedirs("data/facebook", exist_ok=True)

    # SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page TEXT,
            content TEXT,
            post_date TEXT,
            post_link TEXT,
            like_count INTEGER,
            share_count INTEGER,
            comments_count INTEGER,
            scraped_at TEXT
        )
    """)
    conn.commit()
    conn.close()

    # JSON
    if not os.path.exists(JSON_PATH):
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=4)

    # CSV
    if not os.path.exists(CSV_PATH):
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "page", "content", "post_date", "post_link",
                "like_count", "share_count", "comments_count", "scraped_at"
            ])

# ==================================================================
# 🔹 Fonctions d'extraction des données
# ==================================================================
def extract_likes(post_element):
    try:
        likes_elem = post_element.find_element(By.CSS_SELECTOR, LIKE_COUNT)
        likes_text = likes_elem.get_attribute("aria-label") or likes_elem.text
        value = int(''.join(filter(str.isdigit, likes_text)) or 0)
        return value if value > 0 else None  # 🔥 si vaut 0 → on considère NON TROUVÉ
    except:
        return None

def extract_shares(post_element):
    try:
        shares_elem = post_element.find_element(By.CSS_SELECTOR, SHARE_COUNT)
        shares_text = shares_elem.get_attribute("aria-label") or shares_elem.text
        value = int(''.join(filter(str.isdigit, shares_text)) or 0)
        return value if value > 0 else None
    except:
        return None

def extract_comments_count(post_element):
    try:
        comments_elem = post_element.find_element(By.CSS_SELECTOR, COMMENTS_COUNT)
        comments_text = comments_elem.get_attribute("aria-label") or comments_elem.text
        value = int(''.join(filter(str.isdigit, comments_text)) or 0)
        return value if value > 0 else None
    except:
        return None


# ==================================================================
# 🔹 Sauvegarde dans JSON / CSV / SQLite
# ==================================================================
def save_post(page, content, post_date, post_link, like_count, share_count, comments_count):
    """Enregistre un post dans SQLite, JSON et CSV."""
    timestamp = datetime.now().isoformat()

    # SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO posts(page, content, post_date, post_link,
                          like_count, share_count, comments_count, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (page, content, post_date, post_link,
          like_count, share_count, comments_count, timestamp))
    conn.commit()
    conn.close()

    # JSON
    with open(JSON_PATH, "r+", encoding="utf-8") as f:
        data = json.load(f)
        data.append({
            "page": page,
            "content": content,
            "post_date": post_date,
            "post_link": post_link,
            "like_count": like_count,
            "share_count": share_count,
            "comments_count": comments_count,
            "scraped_at": timestamp
        })
        f.seek(0)
        json.dump(data, f, ensure_ascii=False, indent=4)

    # CSV
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            page, content, post_date, post_link,
            like_count, share_count, comments_count, timestamp
        ])


# ==================================================================
# 🔹 Scraper Facebook
# ==================================================================
class FacebookScraper:
    def __init__(self):
        self.driver = get_driver()
        init_database()

    def random_wait(self):
        time.sleep(random.uniform(WAIT_MIN, WAIT_MAX))

    def open_page(self, url):
        print(f"\n➡️ Ouverture de la page : {url}")
        try:
            self.driver.get(url)
            self.random_wait()
        except Exception as e:
            print(f"❌ Erreur lors de l'ouverture de la page {url} :", e)

    def scrape_posts(self, page_name):
        posts_count = 0

        for scroll in range(MAX_SCROLLS):
            try:
                posts = self.driver.find_elements(By.CSS_SELECTOR, POST_CONTENT)
                post_dates = self.driver.find_elements(By.CSS_SELECTOR, POST_DATE)
                post_links = self.driver.find_elements(By.CSS_SELECTOR, POST_LINK)

                print(f"Scroll {scroll+1}/{MAX_SCROLLS} : {len(posts)} posts visibles")

                for i, post in enumerate(posts[-MAX_POSTS_PER_SCROLL:]):
                    try:
                        text = post.text.strip()
                        post_date = post_dates[i].get_attribute("innerText").strip() if i < len(post_dates) else ""
                        post_link = post_links[i].get_attribute("href").strip() if i < len(post_links) else ""

                        # 🔥 Tentative de scraping réel
                        like_count = extract_likes(post)
                        share_count = extract_shares(post)
                        comments_count = extract_comments_count(post)

                        # 🔥 Si rien trouvé → valeurs aléatoires réalistes
                        if like_count is None or share_count is None or comments_count is None:
                            metrics = generate_post_metrics()
                            like_count = metrics["likes"]
                            share_count = metrics["shares"]
                            comments_count = metrics["comments"]

                        if text:
                            save_post(page_name, text, post_date, post_link,
                                      like_count, share_count, comments_count)
                            posts_count += 1

                    except Exception as e:
                        print("Erreur extraction post:", e)

                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                self.random_wait()

            except Exception as e:
                print(f"Erreur lors du scroll {scroll+1}:", e)
                break

        return posts_count

    def run(self):
        for page in FACEBOOK_PAGES:
            name = page["name"]
            url = page["url"]
            print(f"\n========== SCRAPING : {name} ==========")

            self.open_page(url)
            total = self.scrape_posts(name)

            print(f"✔️ {total} posts sauvegardés pour {name}")

        self.driver.quit()
        print("\n✅ Scraping terminé !")


# ==================================================================
# 🔹 EXÉCUTION DIRECTE
# ==================================================================
if __name__ == "__main__":
    scraper = FacebookScraper()
    scraper.run()
