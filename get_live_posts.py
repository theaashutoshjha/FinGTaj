import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\ADMIN\.gemini\antigravity-ide\brain\83414539-af05-473a-a570-852a6ab3311d\.system_generated\steps\331\content.md', encoding='utf-8') as f:
    text = f.read()

# Find post titles and links
post_matches = re.findall(r'<h[23][^>]*class=[\'"][^\'"]*entry-title[^\'"]*[\'"][^>]*>.*?<a[^>]*href=[\'"]([^\'"]+)[\'"][^>]*>(.*?)</a>.*?</h[23]>', text, re.DOTALL)
print(f"Entry title matches: {len(post_matches)}")
for link, title in post_matches:
    clean_title = re.sub(r'<[^>]+>', '', title).strip()
    print(f"- {clean_title} ({link})")

if not post_matches:
    # Try finding any post titles
    titles = re.findall(r'href=[\'"](https://www\.fingtaj\.com/\d{4}/\d{2}/[^\'"]+\.html)[\'"]', text)
    print(f"URL regex matches: {len(set(titles))}")
    for u in set(titles):
        print(u)
