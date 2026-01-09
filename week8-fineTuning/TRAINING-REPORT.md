# TRAINING REPORT

## Model

* Base Model: TinyLlama/TinyLlama-1.1B-Chat-v1.0
* Loading: 4-bit (LoRA)
* Frameworks: Transformers, PEFT

## Tokenizer

* Padding Side: right
* Pad Token: eos_token
* Max Length: 256

## Fine-Tuning Method

* Technique: LoRA
* Trainable Params: 2,252,800
* Total Params: 1,102,301,184
* Trainable %: ~0.20%

## Dataset

* Format: Instruction → Response
* Split: Train / Validation
* Tokenization:

  * truncation=True
  * padding="max_length"
  * labels = input_ids

## Training Configuration

* Trainer API (Causal LM)
* Gradient Checkpointing: Disabled
* Cache: Disabled
* Precision: FP16

## Issues Faced & Fixes

* **401 Unauthorized** → Switched to correct gated model + HF token
* **Loss not returned** → Added `labels=input_ids`
* **Tensor size mismatch** → Enabled padding & truncation
* **Tokenizer warnings** → Synced pad token with model config

## Training Status

* Training successfully started after fixes
* Loss computation working

## Outputs

* LoRA Adapter Weights:

  * `adapter_model.safetensors`
  * `adapter_config.json`

## How to Save Model

```python
model.save_pretrained("./lora_adapter")
tokenizer.save_pretrained("./lora_adapter")
```

## Notes

* Base model unchanged
* Only LoRA adapters are trained
* Model can be reloaded using `PeftModel.from_pretrained()`
