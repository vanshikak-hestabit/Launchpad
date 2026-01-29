# QLoRA Fine-Tuning 

## Objective

Fine-tune an LLM using **QLoRA** with minimal memory and ~1% trainable parameters.

---

## Setup

* Platform: Google Colab
* Libraries: transformers, peft, bitsandbytes, trl
* Quantization: 4-bit 
* Precision: fp16
* Gradient Checkpointing: Enabled

---

## Training Config

 Param    | Value |
 -------- | ----- |
 Method   | QLoRA |
 Rank (r) | 16    |
 Alpha    | 32    |
 Dropout  | 0.05  |
 LR       | 2e-4  |
 Batch    | 4     |
 Epochs   | 3     |

---

## PEFT Details

* Target modules: `q_proj`, `v_proj`
* Trainable params ≈ **0.2%** 
* Base model frozen

---

## Memory Tricks

* 4-bit loading
* LoRA adapters only
* fp16 mixed precision
* Gradient checkpointing

---

## Results

✔ ~1% trainable params
✔ Loss optimized
✔ Adapter saved

```
/adapters/adapter_model.bin
```
