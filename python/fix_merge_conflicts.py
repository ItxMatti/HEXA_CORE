import os

exts = ('.html', '.css', '.js', '.php', '.py', '.txt')

def fix_conflicts(content):
    lines = content.splitlines(keepends=True)
    result = []
    in_head = False
    in_other = False

    for line in lines:
        if line.startswith('<<<<<<<'):
            in_head = True
            in_other = False
            continue
        elif line.startswith('======='):
            in_head = False
            in_other = True
            continue
        elif line.startswith('>>>>>>>'):
            in_head = False
            in_other = False
            continue

        if in_other:
            continue  # skip duplicate code

        result.append(line)

    return ''.join(result)

count = 0
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d != '.git']
    for fname in files:
        if fname.endswith(exts):
            path = os.path.join(root, fname)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            fixed = fix_conflicts(content)
            if fixed != content:
                with open(path, 'w', encoding='utf-8', errors='ignore') as f:
                    f.write(fixed)
                print('Fixed:', path)
                count += 1

print(f'\nDONE! Fixed {count} files.')
