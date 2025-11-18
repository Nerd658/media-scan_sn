import pandas as pd
from sklearn.model_selection import train_test_split

INPUT = "data/facebook/facebook_posts_annotated.csv"
OUTPUT_DIR = "data/dataset_classification/"

df = pd.read_csv(INPUT)

# On garde uniquement texte + categorie
df = df[["message", "category"]].dropna()

train, temp = train_test_split(df, test_size=0.2, random_state=42, stratify=df["category"])
val, test = train_test_split(temp, test_size=0.5, random_state=42, stratify=temp["category"])

train.to_csv(f"{OUTPUT_DIR}/train.csv", index=False)
val.to_csv(f"{OUTPUT_DIR}/val.csv", index=False)
test.to_csv(f"{OUTPUT_DIR}/test.csv", index=False)

print("📁 Dataset split created in:", OUTPUT_DIR)
