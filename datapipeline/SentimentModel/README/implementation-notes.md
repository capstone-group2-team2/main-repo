# Sentiment Analysis Service

## Overview

Service:
Sentiment Analysis

Model:
XLM-RoBERTa (Fine-tuned)

Supported Languages:
- Arabic
- English

Framework:
- Hugging Face Transformers

Backend:
- FastAPI

Input:
- text

Output:
- language
- sentiment
- confidence

Sentiment Labels:
- positive
- neutral
- negative

---

# Architecture Decision

Initially, multiple Arabic sentiment datasets were explored and evaluated, including HARD (Hotel Arabic Reviews Dataset) and ArSarcasm.

After the data exploration phase, the team identified a significantly larger and more comprehensive dataset:

**Arabic Tweets Sentiment Classification (2024)**

Since it already contains the three required sentiment classes (Positive, Neutral, Negative), provides more than 2.2 million labeled samples, and covers diverse real-world Arabic tweets, it was selected as the official training dataset.

The previous datasets are kept only for documentation and experimentation and are not used for the final model training.

---

# Final Training Dataset

Dataset:
Arabic Tweets Sentiment Classification (2024)

Original Dataset Size:
2,286,128 samples

Original Distribution:

- Negative: 1,148,870
- Neutral: 613,142
- Positive: 524,116

Selected Features:

- text
- sentiment

Dropped Features:

- id
- Unnamed: 0

---

# Data Cleaning

Performed preprocessing:

- Removed rows with missing text.
- Removed duplicate texts.
- Removed empty texts.
- Trimmed leading and trailing whitespace.
- Removed URLs.
- Removed user mentions (@username).
- Removed RT prefixes.
- Decoded HTML entities.
- Normalized multiple spaces into a single space.
- Converted sentiment labels to lowercase.

Final Labels:

- positive
- neutral
- negative

---

# Dataset Balancing

To reduce training time while maintaining class balance, random sampling was performed.

Sampling Strategy:

- Negative: 80,000
- Neutral: 80,000
- Positive: 80,000

Random Seed:

42

Final Dataset Size:

240,000 samples

---

# Dataset Split

Split Strategy:

Stratified Train / Validation / Test Split

Random Seed:

42

Distribution:

| Split | Samples |
|--------|---------:|
| Train | 192,000 |
| Validation | 24,000 |
| Test | 24,000 |

Saved Files:

- train.csv
- validation.csv
- test.csv

---

# Training

Model:

XLM-RoBERTa

Tokenizer:

(To be added)

Hyperparameters:

(To be added)

Training Strategy:

(To be added)

---

# Evaluation

Metrics:

(To be added)

Confusion Matrix:

(To be added)

Classification Report:

(To be added)

Model Version:

(To be added)

---

# Archived Experiments

## HARD Dataset

Purpose:

Initial exploration of Arabic sentiment datasets.

Observations:

- 105,698 samples.
- Ratings available:
  - 1
  - 2
  - 4
  - 5
- Neutral class was absent.
- Suitable only for binary sentiment classification.

Status:

Archived (Not used for final training)

---

## ArSarcasm Dataset

Purpose:

Evaluate Arabic Neutral sentiment samples.

Observations:

- Three sentiment classes available.
- Limited dataset size.
- Considered only to increase Neutral samples.

Status:

Archived (Not used for final training)
