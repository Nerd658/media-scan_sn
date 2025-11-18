import os
import json
import csv
import sqlite3
import time
import random
from datetime import datetime
from selenium.webdriver.common.by import By

from src.scraping.utils.driver import get_driver
from src.scraping.facebook.page_list import FACEBOOK_PAGES
from src.scraping.facebook.selectors import COMMENT_BLOCK, POST_CONTENT, COMMENT_BUTTON, SEE_MORE
from config.scraping_config import WAIT_MIN, WAIT_MAX, MAX_SCROLLS, MAX_POSTS_PER_SCROLL, MAX_COMMENTS_PER_POST


# ==================================================================
# 🔹 Chemins des fichiers pour stocker les commentaires
# ==================================================================
DB_PATH = "data/facebook/facebook_comments.db"
JSON_PATH = "data/facebook/facebook_comments.json"
CSV_PATH  = "data/facebook/facebook_comments.csv"


# ==================================================================
# 🔹 Création de la base SQLite + JSON + CSV
# ==================================================================
def init_comment_database():
    os.makedirs("data/facebook", exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page TEXT,
            post_id TEXT,
            post_url TEXT,
            comment TEXT,
            comment_date TEXT,
            scraped_at TEXT
        )
    """)
    conn.commit()
    conn.close()

    if not os.path.exists(JSON_PATH):
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=4)

    if not os.path.exists(CSV_PATH):
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["page", "post_id", "post_url", "comment", "comment_date", "scraped_at"])


# ==================================================================
# 🔹 Sauvegarde d’un commentaire dans 3 formats
# ==================================================================
def save_comment(page, post_id, post_url, comment_text, comment_date):
    timestamp = datetime.now().isoformat()

    # SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO comments(page, post_id, post_url, comment, comment_date, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (page, post_id, post_url, comment_text, comment_date, timestamp))
    conn.commit()
    conn.close()

    # JSON
    with open(JSON_PATH, "r+", encoding="utf-8") as f:
        data = json.load(f)
        data.append({
            "page": page,
            "post_id": post_id,
            "post_url": post_url,
            "comment": comment_text,
            "comment_date": comment_date,
            "scraped_at": timestamp
        })
        f.seek(0)
        json.dump(data, f, ensure_ascii=False, indent=4)

    # CSV
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([page, post_id, post_url, comment_text, comment_date, timestamp])


# ==================================================================
# 🔹 Scraper de commentaires
# ==================================================================
class CommentScraper:

    def __init__(self):
        self.driver = get_driver()
        init_comment_database()

    def wait(self):
        time.sleep(random.uniform(WAIT_MIN, WAIT_MAX))

    def open_page(self, url):
        print(f"\n➡️ Ouverture de la page : {url}")
        self.driver.get(url)
        self.wait()

    def extract_post_id(self, post_element):
        """Génère un identifiant unique pour le post"""
        try:
            return str(hash(post_element.text[:100]))
        except:
            return "unknown_post"

    def extract_post_url(self, post_element):
        """➡️ Récupère l’URL exacte du post"""
        try:
            link = post_element.find_element(By.XPATH, ".//a[contains(@href, '/posts/')]")
            return link.get_attribute("href")
        except:
            return None

    def extract_comment_date(self, comment_element):
        try:
            abbr = comment_element.find_element(By.TAG_NAME, "abbr")
            return abbr.get_attribute("data-tooltip-content")
        except:
            return None

    # ================================================
    # 🔹 Scrape les commentaires d’un post, avec "Voir plus"
    # ================================================
    def scrape_comments_from_post(self, page_name, post_element):
        post_id = self.extract_post_id(post_element)
        post_url = self.extract_post_url(post_element)

        # Ouvrir commentaires
        try:
            buttons = post_element.find_elements(By.CSS_SELECTOR, "div[role='button']")
            for btn in buttons:
                text = btn.text.lower()
                if 'commentaire' in text or 'voir les commentaires' in text or 'afficher les commentaires' in text:
                    self.driver.execute_script("arguments[0].click();", btn)
                    self.wait()
                    break
        except:
            return 0

        # Cliquer sur "Voir plus" dans les commentaires longs
        try:
            see_more_buttons = post_element.find_elements(By.CSS_SELECTOR, SEE_MORE)
            for btn in see_more_buttons:
                self.driver.execute_script("arguments[0].click();", btn)
                self.wait()
        except:
            pass

        # Récupérer les commentaires
        comments = post_element.find_elements(By.CSS_SELECTOR, COMMENT_BLOCK)
        count = 0

        for c in comments:
            if count >= MAX_COMMENTS_PER_POST:
                break
            try:
                text = c.text.strip()
                if text and len(text) > 1:
                    comment_date = self.extract_comment_date(c)
                    save_comment(page_name, post_id, post_url, text, comment_date)
                    count += 1
            except:
                pass

        return count

    def scrape_page(self, page_name, url):
        print(f"\n========== SCRAPING COMMENTAIRES : {page_name} ==========")
        self.open_page(url)

        total_comments = 0
        scraped_posts = 0

        for scroll in range(MAX_SCROLLS):

            if scraped_posts >= 500:
                break

            posts = self.driver.find_elements(By.CSS_SELECTOR, POST_CONTENT)

            for post in posts[-MAX_POSTS_PER_SCROLL:]:
                if scraped_posts >= 500:
                    break

                scraped_posts += 1
                nb = self.scrape_comments_from_post(page_name, post)
                total_comments += nb

                print(f"Post {scraped_posts} → {nb} commentaires")

            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            self.wait()

        print(f"✔️ TOTAL COMMENTAIRES POUR {page_name} : {total_comments}")
        return total_comments

    def run(self):
        for page in FACEBOOK_PAGES:
            self.scrape_page(page["name"], page["url"])

        self.driver.quit()


# ==================================================================
# 🔹 EXÉCUTION DIRECTE
# ==================================================================
if __name__ == "__main__":
    scraper = CommentScraper()
    scraper.run()
