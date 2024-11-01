# AES-CTR File Decryption Tool

Simple Python script for file decryption using AES-CTR mode with a modified IV/nonce counting pattern.

## Requirements
- Python 3.6+
- pycryptodome: `pip install pycryptodome`

## Usage

1. **Prepare key file**
   - Create a binary file containing:
     - First 32 bytes: encryption key
     - Next 16 bytes: IV
   - Total: 48 bytes minimum

2. **Run script**
```bash
python decrypt.py <key_file> <encrypted_file> <output_file>
```

Example:
```bash
python decrypt.py my_key.bin encrypted.bin decrypted.txt
```

## Disclaimer

This tool is for educational purposes only. Only use on files you have permission to decrypt. No warranties provided - use at your own risk. Do not use for unauthorized decryption of data.

---
Created by: Moshe Siman Tov Bustan

Full article: [[Here](https://www.linkedin.com/pulse/unveiling-telegrams-view-once-feature-android-guide-siman-tov-bustan-ud5xf)]
