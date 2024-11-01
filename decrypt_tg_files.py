from Crypto.Cipher import AES
import binascii
import argparse
import sys


def read_key_iv(key_file):
    """Read key and IV from file."""
    try:
        with open(key_file, 'rb') as f:
            key = f.read(32)  # Read first 32 bytes for key
            iv = f.read(16)  # Read next 16 bytes for IV
            if len(key) != 32 or len(iv) != 16:
                raise ValueError("Key file must contain at least 48 bytes (32 for key + 16 for IV)")
            return key, iv
    except Exception as e:
        print(f"Error reading key file: {str(e)}")
        sys.exit(1)


def decrypt_file(input_file, output_file, key, iv):
    # Process in blocks of 16 bytes (128 bits)
    block_size = 16
    decrypted_blocks = []

    try:
        # Read the entire input file
        with open(input_file, 'rb') as f:
            encrypted_data = f.read()

        for block_number in range(0, len(encrypted_data) // block_size):
            # Calculate offset and modify IV (nonce)
            offset = block_number
            modified_iv = bytearray(iv)

            # Modify last 4 bytes of IV according to the pattern
            modified_iv[15] = offset & 0xff
            modified_iv[14] = (offset >> 8) & 0xff
            modified_iv[13] = (offset >> 16) & 0xff
            modified_iv[12] = (offset >> 24) & 0xff

            # Create cipher with modified IV
            cipher = AES.new(key, AES.MODE_CTR, nonce=bytes(modified_iv[:8]),
                             initial_value=int.from_bytes(modified_iv[8:], byteorder='big'))

            # Get current block
            start_pos = block_number * block_size
            end_pos = start_pos + block_size
            current_block = encrypted_data[start_pos:end_pos]

            # Decrypt block
            decrypted_block = cipher.decrypt(current_block)
            decrypted_blocks.append(decrypted_block)

        # Combine all decrypted blocks
        decrypted_data = b''.join(decrypted_blocks)

        # Write to output file
        with open(output_file, 'wb') as f:
            f.write(decrypted_data)

    except Exception as e:
        print(f"Error during decryption: {str(e)}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description='Decrypt file using AES-CTR mode')
    parser.add_argument('key_file', help='File containing key (first 32 bytes) and IV (next 16 bytes)')
    parser.add_argument('input_file', help='Encrypted input file')
    parser.add_argument('output_file', help='Output file for decrypted data')

    args = parser.parse_args()

    # Read key and IV from file
    key, iv = read_key_iv(args.key_file)

    try:
        decrypt_file(args.input_file, args.output_file, key, iv)
        print(f"Successfully decrypted {args.input_file} to {args.output_file}")
    except Exception as e:
        print(f"Error during decryption: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()