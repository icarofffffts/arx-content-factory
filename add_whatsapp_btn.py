import re

with open('/opt/content_factory/dashboard/public/index.html', 'r') as f:
    html = f.read()

# Add WhatsApp button to draft card template
old_card = """'<button class="btn btn-publish-now" onclick="approveDraft(\\'' + d.id + '\\')">\\u2705 Aprovar & Publicar</button>' +"""
new_card = """'<button class="btn btn-publish-now" onclick="approveDraft(\\'' + d.id + '\\')">\\u2705 Aprovar & Publicar</button>' +
                        '<button class="btn btn-primary" onclick="sendDraftToWhatsApp(\\'' + d.id + '\\')" style="background:#25D366">\\ud83d\\udcf2 Notificar WhatsApp</button>' +"""

html = html.replace(old_card, new_card)

# Add sendDraftToWhatsApp function after rejectDraft
old_func = """async function rejectDraft(id) {"""
new_func = """async function sendDraftToWhatsApp(id) {
            try {
                const res = await fetchWithAuth('/api/drafts/' + id + '/send-whatsapp', { method: 'POST' });
                const data = await res.json();
                if (data.success) { alert('\\u2705 Preview enviado via WhatsApp!'); }
                else { alert('Erro: ' + (data.error || '')); }
            } catch (e) { alert('Erro ao enviar WhatsApp.'); }
        }

        async function rejectDraft(id) {"""

html = html.replace(old_func, new_func)

with open('/opt/content_factory/dashboard/public/index.html', 'w') as f:
    f.write(html)

print('OK - WhatsApp button and function added')
