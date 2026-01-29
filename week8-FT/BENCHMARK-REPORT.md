# Benchmark Report 

## Objective

Measure and compare inference performance of three model types:

1. Base TinyLlama model
2. LoRA fine-tuned model
3. Quantised GGUF model using llama.cpp

Metrics tracked: tokens/sec, latency, VRAM usage, and output accuracy.

---

## What the Benchmark Does

The benchmarking script runs the same set of prompts through each model and measures:

* **Tokens/sec:** How many tokens the model generates per second.
* **Latency:** Time taken to produce the output.
* **VRAM usage:** GPU memory consumed (0 if running on CPU).
* **Accuracy:** Semantic similarity of model outputs to ground-truth answers using sentence embeddings.

---

## Key Components

### HuggingFace Models

* `benchmark_hf()` loads and runs base or fine-tuned models.
* Runs on GPU if available.
* Measures speed, memory, latency, and accuracy.

### GGUF Model with llama.cpp

* `benchmark_gguf()` loads GGUF model.
* Can run on CPU or GPU depending on setup(ran on CPU).
* Measures same metrics as HF models.

### Accuracy Calculation

* Uses SentenceTransformer embeddings.
* Cosine similarity between predicted text and ground truth.
* Gives score between 0 and 1.

### VRAM Monitoring

* `torch.cuda.memory_allocated()` used for GPU memory tracking.
* Reports 0 if running on CPU.

### Multiple Runs

* Each model benchmarked multiple times for reliability.
* Results stored in CSV (`benchmarks/results.csv`).

---

## Metrics Meaning

 Metric     |  Meaning                                 |
 -----------------------
 Tokens/sec | Speed of text generation                 |
 Latency(s) | Time to generate output                  |
 VRAM(MB)   | GPU memory used                          |
 Accuracy   | Semantic similarity to reference answers |

---

## Notes / Observations

* Base and fine-tuned models run on GPU; GGUF usually runs on CPU (unless explicitly offloaded), so VRAM shows 0.
* Latency may vary if models are cold-started.
* Accuracy may drop slightly for GGUF due to quantisation and CPU inference.

---

## Conclusion

The benchmark script provides a consistent, automated way to measure inference speed, memory usage, latency, and quality across different model types and configurations. It helps identify trade-offs between performance and resou
