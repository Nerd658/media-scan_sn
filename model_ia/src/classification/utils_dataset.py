# src/classification/utils_dataset.py
import pandas as pd
from datasets import Dataset, ClassLabel

def load_annotated_csv(path="data/facebook/facebook_posts_annotated.csv", text_col="content", label_col="category"):
    df = pd.read_csv(path)
    # dropna and basic clean
    df = df[[text_col, label_col]].dropna().reset_index(drop=True)
    labels = sorted(df[label_col].unique().tolist())
    # map labels to ints
    label2id = {l:i for i,l in enumerate(labels)}
    df["label"] = df[label_col].map(label2id)
    ds = Dataset.from_pandas(df[[text_col, "label"]])
    ds = ds.class_encode_column("label")  # create ClassLabel
    return ds, labels, label2id
