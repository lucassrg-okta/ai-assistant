import fs from 'node:fs/promises';
import path from 'node:path';

export type DocumentMetadata = {
  id: string;
  tier: 'basic' | 'advanced';
};

export type Document = {
  text: string;
  metadata: DocumentMetadata;
};

export async function readDocuments(): Promise<Document[]> {
  const folderPath = path.join(process.cwd(), 'src/lib/rag/assets/docs');
  const files = await fs.readdir(folderPath);

  const documents: Document[] = [];

  for (const file of files) {
    const text = await fs.readFile(path.join(folderPath, file), 'utf-8');

    documents.push({
      text,
      metadata: {
        id: file.slice(0, file.lastIndexOf('.')),
        tier: file.includes('advanced') ? 'advanced' : 'basic', // ✅ now correctly typed
      },
    });
  }

  return documents;
}
