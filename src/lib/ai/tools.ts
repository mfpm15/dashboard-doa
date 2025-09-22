import { AITool, Item } from '@/types';
import { addItem, updateItem, loadItems, query } from '@/lib/storage';

export const TOOLS: AITool[] = [
  {
    type: 'function',
    function: {
      name: 'create_item',
      description: 'Buat item doa baru',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          arabic: { type: 'string' },
          latin: { type: 'string' },
          translation_id: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          source: { type: 'string' },
          favorite: { type: 'boolean' }
        },
        required: ['title', 'category']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'update_item',
      description: 'Perbarui item doa yang sudah ada',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          patch: { type: 'object' }
        },
        required: ['id', 'patch']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_items',
      description: 'Cari item doa lokal',
      parameters: {
        type: 'object',
        properties: {
          term: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          favorite: { type: 'boolean' },
          limit: { type: 'number' }
        },
        required: ['term']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'export_db',
      description: 'Ekspor database untuk analisis AI',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'analyze_text',
      description: 'Analisis teks untuk ekstraksi field doa',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string' }
        },
        required: ['text']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'suggest_categories_tags',
      description: 'Sarankan kategori dan tag untuk item doa',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          arabic: { type: 'string' },
          latin: { type: 'string' },
          translation_id: { type: 'string' }
        },
        required: ['title']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'quality_check',
      description: 'Periksa kualitas item doa dan berikan saran perbaikan',
      parameters: {
        type: 'object',
        properties: {
          item: { type: 'object' }
        },
        required: ['item']
      }
    }
  }
];

export async function executeAITool(
  name: string,
  args: any,
  callbacks?: { onItemUpdate?: (item: any) => void; onItemsChange?: () => void }
): Promise<any> {
  const result = await dispatchTool(name, args);

  // Trigger callbacks if CRUD operations
  if (name === 'create_item' || name === 'update_item') {
    callbacks?.onItemsChange?.();
    if (name === 'update_item') {
      callbacks?.onItemUpdate?.(result);
    }
  }

  return result;
}

export async function dispatchTool(name: string, args: any): Promise<any> {
  switch (name) {
    case 'create_item':
      return addItem(args);

    case 'update_item':
      return updateItem(args.id, args.patch);

    case 'search_items': {
      const items = loadItems();

      // If no items found (server-side), provide sample data for search demo
      if (items.length === 0) {
        const sampleData = [
          {
            id: 'sample-1',
            title: 'Istighfar dan Taubat',
            arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ الَّذِيْ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ',
            latin: 'Astaghfirullahal \'azhiimalladzi laa ilaaha illa huwal hayyul qayyuumu wa atuubu ilaih',
            translation_id: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.',
            category: 'Istighfar & Taubat',
            tags: ['istighfar', 'taubat', 'ampunan'],
            favorite: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            source: '',
            audio: []
          },
          {
            id: 'sample-2',
            title: 'Doa Keselamatan Dunia Akhirat',
            arabic: 'رَبَّنَا آتِنَا فِى الدُّنْيَا حَسَنَةً وَفِى الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            latin: 'Rabbanaa aatinaa fid dunyaa hasanatan wa fil aakhirati hasanatan wa qinaa \'adzaaban naar',
            translation_id: 'Ya Tuhan kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari azab neraka.',
            category: 'Doa Sehari-hari',
            tags: ['keselamatan', 'dunia', 'akhirat'],
            favorite: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            source: '',
            audio: []
          }
        ];

        const results = query(sampleData, {
          term: args.term,
          category: args.category,
          tags: args.tags,
          favorite: args.favorite
        });
        return results.slice(0, args.limit || 20);
      }

      const results = query(items, {
        term: args.term,
        category: args.category,
        tags: args.tags,
        favorite: args.favorite
      });
      return results.slice(0, args.limit || 20);
    }

    case 'export_db':
      return loadItems();

    case 'analyze_text':
      // This will be processed by AI, return the text for analysis
      return { text: args.text, action: 'analyze_for_fields' };

    case 'suggest_categories_tags':
      // This will be processed by AI
      return {
        title: args.title,
        arabic: args.arabic,
        latin: args.latin,
        translation_id: args.translation_id,
        action: 'suggest_categories_tags'
      };

    case 'quality_check':
      // This will be processed by AI
      return { item: args.item, action: 'quality_check' };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Agent loop for handling tool calls
export async function runAgent(
  messages: any[],
  onProgress?: (content: string) => void
): Promise<string> {
  const { aiStream } = await import('./client');

  let finalContent = '';

  await aiStream({
    messages,
    tools: TOOLS,
    model: 'deepseek/deepseek-chat-v3.1:free',
    onDelta: (delta) => {
      finalContent += delta;
      onProgress?.(finalContent);
    },
    onToolCalls: async (calls) => {
      for (const call of calls) {
        const { name, arguments: rawArgs } = call.function;
        const args = JSON.parse(rawArgs || '{}');

        try {
          const result = await dispatchTool(name, args);
          messages.push({
            role: 'tool',
            name,
            tool_call_id: call.id,
            content: JSON.stringify(result)
          });
        } catch (error) {
          messages.push({
            role: 'tool',
            name,
            tool_call_id: call.id,
            content: JSON.stringify({ error: (error as Error).message })
          });
        }
      }

      // Continue the conversation to get the final response
      finalContent = '';
      await runAgent(messages, onProgress);
    }
  });

  return finalContent;
}

// System prompt for the AI assistant
export const SYSTEM_PROMPT = `Kamu adalah asisten untuk mengelola database doa lokal yang komprehensif.

TUGAS UTAMA:
1. Gunakan tools yang tersedia untuk perubahan data (create_item, update_item, search_items)
2. Untuk parsing teks, hasilkan object dengan field: {title, arabic, latin, translation_id, category, tags, source, favorite}
3. Normalisasi tag (lowercase, trimming, tanpa duplikasi)
4. Jika ragu tentang sumber, tulis "butuh verifikasi"
5. Saat menilai kualitas, beri alasan singkat dan patch yang disarankan

KATEGORI UMUM:
- Zikir Setelah Shalat
- Doa Pengampunan
- Doa Iman & Akhlak
- Doa Keluarga
- Doa Umat
- Doa Hajat Dunia
- Pembukaan & Penutup Doa

ATURAN PARSING:
- Pisahkan teks Arab dari Latin/transliterasi
- Teks dalam kurung atau setelah "artinya:" adalah terjemahan
- Tag berdasarkan tema: istighfar, shalat, pagi, malam, keluarga, rezeki, dll
- Jika ada referensi hadits/ayat, masukkan ke field source

QUALITY CHECK:
- Pastikan ada terjemahan Indonesia
- Cek konsistensi transliterasi
- Verifikasi tidak ada duplikasi
- Periksa kelengkapan field wajib

Selalu berikan preview sebelum commit perubahan dan jelaskan tindakan yang akan diambil.`;

// Common prompts for different AI features
export const PROMPTS = {
  PARSE_TEXT: (text: string) => `
Analisis teks berikut dan ekstrak informasi untuk membuat item doa:

"${text}"

Hasilkan JSON dengan struktur:
{
  "title": "string",
  "arabic": "string (jika ada)",
  "latin": "string (transliterasi jika ada)",
  "translation_id": "string (terjemahan Indonesia)",
  "category": "string (pilih dari kategori umum)",
  "tags": ["array", "of", "strings"],
  "source": "string (referensi hadits/ayat jika ada, atau 'butuh verifikasi')",
  "favorite": false
}
`,

  SUGGEST_TAGS: (item: Partial<Item>) => `
Berdasarkan item doa berikut, sarankan tags dan kategori yang tepat:

Title: ${item.title}
Arabic: ${item.arabic || 'N/A'}
Latin: ${item.latin || 'N/A'}
Translation: ${item.translation_id || 'N/A'}

Berikan saran dalam format JSON:
{
  "category": "string",
  "tags": ["array", "of", "suggested", "tags"],
  "reasoning": "string (penjelasan singkat)"
}
`,

  QUALITY_CHECK: (item: Item) => `
Periksa kualitas item doa berikut dan berikan saran perbaikan:

${JSON.stringify(item, null, 2)}

Berikan analisis dalam format JSON:
{
  "issues": ["array", "of", "issues", "found"],
  "suggestions": {
    "field": "suggested_value"
  },
  "score": "number (1-10)",
  "reasoning": "string (penjelasan penilaian)"
}
`
};