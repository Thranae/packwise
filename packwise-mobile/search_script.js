const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\thranae\\.gemini\\antigravity-ide\\brain\\a00f31f0-1933-427c-955c-8056c5cbf248\\.system_generated\\logs\\transcript_full.jsonl';

async function processLineByLine() {
  try {
    const fileStream = fs.createReadStream(logPath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (line.includes('HeroTripCard.tsx')) {
        try {
          const data = JSON.parse(line);
          if (data.source === 'MODEL' && data.tool_calls) {
            for (const call of data.tool_calls) {
              if (call.name && (call.name.includes('write') || call.name.includes('replace'))) {
                const args = call.args || {};
                const targetFile = args.TargetFile || '';
                
                if (targetFile.includes('HeroTripCard.tsx')) {
                  console.log('--- FOUND HeroTripCard.tsx ---');
                  console.log(args.CodeContent || args.ReplacementContent);
                  console.log('------------------------------');
                }
              }
            }
          }
        } catch (e) {
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

processLineByLine();
