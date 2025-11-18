from transformers import CamembertTokenizer, CamembertForSequenceClassification
import torch
import json

class Predictor:
    def __init__(self):
        self.tokenizer = CamembertTokenizer.from_pretrained("camembert-base")
        self.model = CamembertForSequenceClassification.from_pretrained("model_classification/")
        self.model.eval()

        with open("model_classification/labels.json", "r") as f:
            self.label_map = json.load(f)

    def predict(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            logits = self.model(**inputs).logits
        pred_id = torch.argmax(logits).item()
        return self.label_map[str(pred_id)]

predictor = Predictor()

def predict_category(text):
    return predictor.predict(text)
