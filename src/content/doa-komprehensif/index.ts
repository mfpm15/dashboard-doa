import { CollectionPart } from '@/types/asmaulHusna';

// Lazy loader for part content - only loads when needed
export async function loadPartContent(partNumber: number): Promise<CollectionPart | null> {
  try {
    switch (partNumber) {
      case 1:
        return (await import('./parts/part-01')).default;
      case 2:
        return (await import('./parts/part-02')).default;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return (await import('./parts/stubs')).getStubPart(partNumber);
      case 8:
        return (await import('./parts/part-08')).default;
      case 9:
        return (await import('./parts/part-09')).default;
      case 10:
        return (await import('./parts/part-10')).default;
      case 11:
        return (await import('./parts/part-11')).default;
      case 12:
        return (await import('./parts/part-12')).default;
      case 13:
        return (await import('./parts/part-13')).default;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load part ${partNumber}:`, error);
    return null;
  }
}

export { partsMetadata, COLLECTION_INFO } from './metadata';
