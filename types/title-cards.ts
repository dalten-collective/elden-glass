export interface HeaderPopup {
  type: 'titlecard' | 'note' | 'image' | 'webpage';
  titleCardId?: string; // For type: 'titlecard'
  note?: string; // For type: 'note'
  imageUrl?: string; // For type: 'image' or auto-fetched webpage preview
  title?: string; // For type: 'webpage' or 'note'
  url?: string; // For type: 'webpage' - clickable link
}

export interface TitleCard {
  id: string;
  term: string; // The word/phrase that triggers this card (stored lowercase for matching)
  aliases?: string[]; // Additional words/phrases that also trigger this card (stored lowercase)
  scope: 'global' | 'instance'; // global = all instances, instance = specific location
  instanceId?: string; // For instance-scoped cards, unique ID of the specific occurrence
  title: string;
  description: string;
  image?: string; // Optional image URL/path (single image cards)
  images?: string[]; // Optional array of image URLs for split/composite cards
  section?: string; // Legacy field - will be migrated to category/subcategory
  category?: string; // Main category (e.g., "Works of Marcel Duchamp", "Elden Ring")
  subcategory?: string; // Optional subcategory (e.g., "The Readymades", "The Large Glass")
  source?: 'base' | 'dlc'; // For Elden Ring cards: base game or Shadow of the Erdtree DLC
  links?: Array<{
    label: string;
    url: string;
  }>;
  // Split card configuration
  isSplit?: boolean; // Whether this is a split card (multiple images side-by-side)
  splitCardIds?: string[]; // IDs of cards referenced in this split card
  headerPopup?: HeaderPopup; // Optional header popup above split cards
  // Guidance of Grace connections
  connections?: Array<{
    cardId: string; // ID of the connected card
    label?: string; // Optional label for the connection
  }>;
  // Semantic senses (from WordNet via Diomora)
  senses?: string[]; // WordNet sense keys e.g. ["queen.n.01", "deity.n.01"]
  axes?: number[]; // Computed axes for each sense (for Nock addressing)
  createdAt: string;
  updatedAt: string;
}

export interface TitleCardDatabase {
  cards: TitleCard[];
}

export interface CreateTitleCardRequest {
  term: string;
  scope: 'global' | 'instance';
  instanceId?: string;
  title: string;
  description: string;
  image?: string;
  links?: Array<{
    label: string;
    url: string;
  }>;
}

export interface UpdateTitleCardRequest {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  links?: Array<{
    label: string;
    url: string;
  }>;
}
