---
name: tts-ssml-prosody-markup-tuning
description: Authors Speech Synthesis Markup Language (SSML) tags for controlling pitch, rate, breaks, and phonemes in TTS. Use when producing natural, expressive text-to-speech voice generation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/TR/speech-synthesis11/"
---
# Tts Ssml Prosody Markup Tuning

## Overview
Raw text fed to TTS voices sounds monotonic and robotic. SSML markup introduces natural breath breaks (<break time="300ms"/>), emphasis tags, pitch contours, and IPA phonetic pronunciations.

## Operational Workflow

1. **Format plain script into valid SSML document structure (<speak>...</speak>).**:
   - Format plain script into valid SSML document structure (<speak>...</speak>).

2. **Inject explicit pause durations at sentence and clause boundaries using <break> tags.**:
   - Inject explicit pause durations at sentence and clause boundaries using <break> tags.

3. **Apply <prosody rate="..." pitch="..."> to modulate emotional intensity and pacing.**:
   - Apply <prosody rate="..." pitch="..."> to modulate emotional intensity and pacing.

4. **Define <phoneme alphabet="ipa" ph="..."> tags for proper names, technical acronyms, and brand names.**:
   - Define <phoneme alphabet="ipa" ph="..."> tags for proper names, technical acronyms, and brand names.

## Recommended Tools & Environments
- SSML
- XML
- Google Cloud TTS / AWS Polly
- ElevenLabs

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
