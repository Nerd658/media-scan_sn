import torch
from transformers import CamembertForSequenceClassification, Trainer, TrainingArguments
from model import PostsDataset
import json
import os

# ----------- GPU AUTO ----------- #
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("🖥️ Device used for training :", device)

# ----------- DATA ----------- #
train_ds = PostsDataset("data/dataset_classification/train.csv")
val_ds = PostsDataset("data/dataset_classification/val.csv")

num_labels = len(train_ds.label_map)

# ----------- MODEL ----------- #
model = CamembertForSequenceClassification.from_pretrained(
    "camembert-base",
    num_labels=num_labels
).to(device)

# Sauvegarde du dictionnaire label -> id
os.makedirs("model_classification", exist_ok=True)
with open("model_classification/labels.json", "w") as f:
    json.dump(train_ds.label_map, f, indent=4)

# ----------- TRAINING PARAMS ----------- #
args = TrainingArguments(
    output_dir="model_classification/",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=5,
    weight_decay=0.01,
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    push_to_hub=False,
    fp16=torch.cuda.is_available(),  # 👉 Active mixed precision si GPU
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=train_ds,
    eval_dataset=val_ds,
)

# ----------- TRAIN ----------- #
trainer.train()

# ----------- SAVE FINAL ----------- #
trainer.save_model("model_classification/")
print("🎉 Model trained & saved to model_classification/")
