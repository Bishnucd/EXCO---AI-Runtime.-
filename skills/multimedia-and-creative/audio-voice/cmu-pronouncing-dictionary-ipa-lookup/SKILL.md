---
name: cmu-pronouncing-dictionary-ipa-lookup
description: Transcribes English text into phonetic ARPAbet and IPA phoneme sequences using the CMU Pronouncing Dictionary. Use when fixing mispronounced words in TTS and speech recognition models.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "http://www.speech.cs.cmu.edu/cgi-bin/cmudict"
---
# Cmu Pronouncing Dictionary Ipa Lookup

## Overview
TTS engines frequently mispronounce brand names, medical terms, and homographs. CMUDict maps English words to standardized phonetic pronunciations to force exact phonetic output.

## Operational Workflow

1. **Look up ambiguous words in CMUDict lexicon to obtain ARPAbet phoneme sequence (e.g., READ -> R EH D vs R IY D).**:
   - Look up ambiguous words in CMUDict lexicon to obtain ARPAbet phoneme sequence (e.g., READ -> R EH D vs R IY D).

2. **Construct phoneme override rule in TTS dictionary or SSML <phoneme alphabet="ipa" ph="..."> tag.**:
   - Construct phoneme override rule in TTS dictionary or SSML <phoneme alphabet="ipa" ph="..."> tag.

3. **Handle out-of-vocabulary words using grapheme-to-phoneme (G2P) neural fallback models.**:
   - Handle out-of-vocabulary words using grapheme-to-phoneme (G2P) neural fallback models.

4. **Verify that synthesized voice output pronounces foreign names and technical jargon correctly.**:
   - Verify that synthesized voice output pronounces foreign names and technical jargon correctly.

## Recommended Tools & Environments
- CMUDict
- ARPAbet / IPA
- Phonetic Transcription
- Python / NLTK

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
