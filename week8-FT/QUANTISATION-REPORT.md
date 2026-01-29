
## Objective

Convert a trained LLM into smaller, faster formats: **INT8, INT4, and GGUF** to reduce memory and speed up inference.

---

## What is Quantisation?

Quantisation replaces big FP16 numbers with smaller INT8 / INT4 numbers.

Result:

* Less memory
* Faster inference
* Small accuracy loss

Used for **deployment, not training**.

---

## Formats

* **FP16**: Best quality, large size
* **INT8**: Smaller, fast, very good quality
* **INT4**: Tiny, fastest, some quality drop
* **GGUF**: llama.cpp format, CPU friendly, supports q4_0 / q8_0

---

## Post-Training Quantisation

Train → Save → Quantise → Deploy

Model is compressed after training. No learning happens here.

---

## Static vs Dynamic

* **Static**: Pre-quantised, faster
* **Dynamic**: Quantised at runtime, flexible

---

## Outputs

```
/quantized/model-int8
/quantized/model-int4
/quantized/model.gguf
```

---

## Comparison

| Format | Size    | Speed     | Quality   |
| ------ | ------- | --------- | --------- |
| FP16   | Large   | Medium    | Best      |
| INT8   | Smaller | Faster    | Very Good |
| INT4   | Tiny    | Fastest   | Good      |
| GGUF   | Tiny    | Very Fast | Good      |

---

## Model report 

Format          |  Size (MB)
------------------------------
FP16 GGUF       |    2099.05
INT8 GGUF       |    1115.62
INT4 GGUF       |     607.23

## Conclusion

Quantisation shrinks models to run faster and cheaper while keeping usable quality.
