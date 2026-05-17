import { CollectionPart } from '@/types/asmaulHusna';
import { partsMetadata } from './metadata';

// Lazy loader for part content - only loads when needed
export async function loadPartContent(partNumber: number): Promise<CollectionPart | null> {
  try {
    switch (partNumber) {
      case 1:
        return (await import('./parts/part-01')).default;
      case 2:
        return (await import('./parts/part-02')).default;
      case 3:
        return (await import('./parts/part-03')).default;
      case 4:
        return (await import('./parts/part-04')).default;
      case 5:
        return (await import('./parts/part-05')).default;
      case 6:
        return (await import('./parts/part-06')).default;
      case 7:
        return (await import('./parts/part-07')).default;
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        return (await import('./parts/stubs')).getStubPart(partNumber);
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load part ${partNumber}:`, error);
    return null;
  }
}

export { partsMetadata, COLLECTION_INFO } from './metadata';
