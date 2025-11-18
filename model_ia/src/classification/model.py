from transformers import CamembertTokenizer
import torch
from torch.utils.data import Dataset
import pandas as pd

tokenizer = CamembertTokenizer.from_pretrained("camembert-base")

class PostsDataset(Dataset):
    def __init__(self, csv_path, max_length=128):
        df = pd.read_csv(csv_path)
        self.texts = df["message"].tolist()
        self.labels = df["category"].astype("category").cat.codes.tolist()
        self.label_map = dict(enumerate(df["category"].astype("category").cat.categories))

        self.encodings = tokenizer(
            self.texts,
            truncation=True,
            padding="max_length",
            max_length=max_length
        )

    def __getitem__(self, idx):
        return {
            "input_ids": torch.tensor(self.encodings["input_ids"][idx]),
            "attention_mask": torch.tensor(self.encodings["attention_mask"][idx]),
            "labels": torch.tensor(self.labels[idx])
        }

    def __len__(self):
        return len(self.labels)
