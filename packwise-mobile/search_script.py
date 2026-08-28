import json

log_path = r"C:\Users\thranae\.gemini\antigravity-ide\brain\a00f31f0-1933-427c-955c-8056c5cbf248\.system_generated\logs\transcript_full.jsonl"

try:
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            if 'HeroTripCard' in line:
                data = json.loads(line)
                if data.get('source') == 'MODEL' and 'tool_calls' in data:
                    for call in data['tool_calls']:
                        if call.get('name') in ['write_to_file', 'replace_file_content']:
                            args = call.get('args', {})
                            if 'HeroTripCard' in str(args.get('TargetFile', '')):
                                print("FOUND HeroTripCard generation!")
                                print("Code Content:")
                                print(args.get('CodeContent', '')[:500] + "... (truncated)")
                                print("---")
except Exception as e:
    print("Error:", e)
