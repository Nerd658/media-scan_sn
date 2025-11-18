import time
import random
import os
import sqlite3
import json
import csv
from datetime import datetime
from selenium.webdriver.common.by import By

# ===============================
# 🔹 IMPORTS ABSOLUS CORRIGÉS
# ===============================
from scraping.utils.driver import get_driver
from scraping.facebook.page_list import FACEBOOK_PAGES
from scraping.facebook.selectors import POST_CONTENT, POST_DATE

# Le fichier est dans /config en dehors de /src
from config.scraping_config import (
    WAIT_MIN,
    WAIT_MAX,
    MAX_POSTS_PER_SCROLL,
    MAX_SCROLLS
)

# ==================================================================
# 🔹 Base de données SQLite
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
            scraped_at TEXT,
            post_date TEXT
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
            writer.writerow(["page", "content", "scraped_at", "post_date"])


def save_post(page, content, post_date):
    """Enregistre un seul post dans SQLite, JSON et CSV."""
    timestamp = datetime.now().isoformat()

    # SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO posts(page, content, scraped_at, post_date)
        VALUES (?, ?, ?, ?)
    """, (page, content, timestamp, post_date))
    conn.commit()
    conn.close()

    # JSON
    with open(JSON_PATH, "r+", encoding="utf-8") as f:
        data = json.load(f)
        data.append({
            "page": page,
            "content": content,
            "scraped_at": timestamp,
            "post_date": post_date
        })
        f.seek(0)
        json.dump(data, f, ensure_ascii=False, indent=4)

    # CSV
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([page, content, timestamp, post_date])


# ==================================================================
# 🔹 Scraper Facebook
# ==================================================================
class FacebookScraper:
    def __init__(self):
        self.driver = get_driver()
        init_database()  # Assure que la DB existe

    def random_wait(self):
        """Pause aléatoire entre WAIT_MIN et WAIT_MAX secondes"""
        time.sleep(random.uniform(WAIT_MIN, WAIT_MAX))

    def open_page(self, url):
        """Ouvre une page Facebook"""
        print(f"\n➡️ Ouverture de la page : {url}")
        try:
            self.driver.get(url)
            self.random_wait()
        except Exception as e:
            print(f"❌ Erreur lors de l'ouverture de la page {url} :", e)

    def scrape_posts(self, page_name):
        """Récupère les posts en scrollant"""
        posts_count = 0

        for scroll in range(MAX_SCROLLS):
            try:
                posts = self.driver.find_elements(By.CSS_SELECTOR, POST_CONTENT)
                post_dates = self.driver.find_elements(By.CSS_SELECTOR, POST_DATE)
                print(f"Scroll {scroll+1}/{MAX_SCROLLS} : {len(posts)} posts visibles")

                # Récupère les derniers posts visibles
                for post, date_elem in zip(posts[-MAX_POSTS_PER_SCROLL:], post_dates[-MAX_POSTS_PER_SCROLL:]):
                    try:
                        text = post.text.strip()
                        post_date = date_elem.text.strip() if date_elem else ""

                        if text:
                            save_post(page_name, text, post_date)
                            posts_count += 1

                    except Exception as e:
                        print("Erreur extraction post:", e)

                # Scroll vers le bas
                self.driver.execute_script(
                    "window.scrollTo(0, document.body.scrollHeight);"
                )
                self.random_wait()

            except Exception as e:
                print(f"Erreur lors du scroll {scroll+1}:", e)
                break

        return posts_count

    def run(self):
        """Scraper toutes les pages"""
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
