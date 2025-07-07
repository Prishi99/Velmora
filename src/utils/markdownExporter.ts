
import { EXAMPLES } from '../data/healthData';

export function exportToMarkdown(): void {
  let markdown = '# Health Assistant Q&A Examples\n\n';
  
  EXAMPLES.forEach((pair, index) => {
    markdown += `### ${index + 1}\n`;
    markdown += `**Q:** ${pair.q}\n\n`;
    markdown += `**A:** ${pair.a}\n\n`;
  });
  
  // Create downloadable file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'health-qa-examples.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log(`Exported ${EXAMPLES.length} Q&A examples to markdown`);
}
