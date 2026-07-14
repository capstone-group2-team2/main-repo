# Architecture Decisions

## Model Selection

Decision:
XLM-RoBERTa

Reason:
Supports multilingual sentiment classification with excellent Arabic performance.

---

## Dataset Selection

Initially:
- HARD
- ArSarcasm

Final Decision:
Arabic Tweets Sentiment Classification (2024)

Reason:
- Contains all three classes.
- Large-scale dataset.
- No need to merge multiple datasets.
- Better generalization.

---

## Dataset Sampling

Decision:
Balanced dataset.

Reason:
Reduce training time while preserving balanced classes.

Distribution:

80K Positive
80K Neutral
80K Negative

# Dataset

The raw and processed datasets are not included in this repository because of their size.

The preprocessing notebooks inside `notebooks/` generate the processed datasets.

Raw datasets:

- Arabic Tweets Sentiment Dataset
- English Sentiment Dataset

Follow notebooks 01 → 06 to reproduce the final dataset.