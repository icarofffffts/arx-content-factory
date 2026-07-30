import json, base64

with open('/tmp/qr.json') as f:
    d = json.load(f)

b64 = d.get('base64', '')
code = d.get('code', '')

# Write base64 image to file
if b64:
    img_data = b64.split(',')[1] if ',' in b64 else b64
    with open('/tmp/qr.png', 'wb') as img:
        img.write(base64.b64decode(img_data))
    print('QR code saved to /tmp/qr.png')
    print(f'Code (first 50 chars): {code[:50]}')
