python3 -c '
import json, sys, base64
d = json.load(sys.stdin)
raw = d.get("base64", "")
b64 = raw.split(",")[1] if "," in raw else raw
html = "<html><body style=\"display:flex;justify-content:center;align-items:center;height:100vh;background:#fff\">"
html += "<img src=\"data:image/png;base64," + b64 + "\" style=\"width:400px;max-width:90vw\"/>"
html += "</body></html>"
with open("/opt/content_factory/dashboard/public/qr.html", "w") as f:
    f.write(html)
print("QR HTML created")
'