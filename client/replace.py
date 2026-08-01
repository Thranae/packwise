import re

with open('src/pages/HomePage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

with open('hero_replacement.txt', 'r', encoding='utf-8') as f:
    replacement = f.read()

# Fix the {${glassStyle} ...} back to proper JSX since powershell @""@ removed the backticks when it wasn't escaped
replacement = replacement.replace('"{${', '{${').replace('}"', '}')

start_marker = '{/* HERO SECTION */}'
end_marker = '{/* FEATURES */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + replacement + '\n        ' + content[end_idx:]
    with open('src/pages/HomePage.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced.")
else:
    print("Markers not found.")
