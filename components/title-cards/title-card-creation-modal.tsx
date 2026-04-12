'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { useTitleCards } from './title-card-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TitleCard, HeaderPopup } from '@/types/title-cards';

interface TitleCardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TitleCardCreationModal({ isOpen, onClose }: TitleCardCreationModalProps) {
  const { selectedText, refreshCards } = useTitleCards();
  const [term, setTerm] = useState('');
  const [scope, setScope] = useState<'global' | 'instance'>('global');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Split card state
  const [isSplit, setIsSplit] = useState(false);
  const [splitImages, setSplitImages] = useState<string[]>(['', '']);
  const [availableCards, setAvailableCards] = useState<TitleCard[]>([]);

  // Header popup state
  const [hasHeaderPopup, setHasHeaderPopup] = useState(false);
  const [headerType, setHeaderType] = useState<'titlecard' | 'note' | 'image' | 'webpage'>('note');
  const [headerTitleCardId, setHeaderTitleCardId] = useState('');
  const [headerNote, setHeaderNote] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerUrl, setHeaderUrl] = useState('');

  useEffect(() => {
    if (selectedText) {
      setTerm(selectedText);
    }
  }, [selectedText]);

  // Load available cards for split card selection
  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch('/api/title-cards');
        const data = await response.json();
        // API returns array directly
        setAvailableCards(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load cards:', error);
      }
    };
    if (isOpen) {
      loadCards();
    }
  }, [isOpen]);

  const handleAddLink = () => {
    setLinks([...links, { label: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSave = async () => {
    if (!term || !title || !description) {
      alert('Please fill in term, title, and description');
      return;
    }

    // Validate split card images
    if (isSplit) {
      const validImages = splitImages.filter((img) => img.trim());
      if (validImages.length < 2) {
        alert('Please provide at least 2 image URLs for split card');
        return;
      }
    }

    setIsSaving(true);
    try {
      // Build header popup object if enabled
      let headerPopup: HeaderPopup | undefined;
      if (isSplit && hasHeaderPopup) {
        headerPopup = { type: headerType };

        if (headerType === 'titlecard') {
          headerPopup.titleCardId = headerTitleCardId;
        } else if (headerType === 'note') {
          headerPopup.note = headerNote;
          headerPopup.title = headerTitle;
        } else if (headerType === 'image') {
          headerPopup.imageUrl = headerImageUrl;
          headerPopup.title = headerTitle;
        } else if (headerType === 'webpage') {
          headerPopup.url = headerUrl;
          headerPopup.title = headerTitle;
          headerPopup.imageUrl = headerImageUrl; // Can be provided or will be auto-fetched
        }
      }

      const response = await fetch('/api/title-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term,
          scope,
          title,
          description,
          image: image || undefined,
          images: isSplit ? splitImages.filter((img) => img.trim()) : undefined,
          category: category || undefined,
          subcategory: subcategory || undefined,
          links: links.filter((l) => l.label && l.url),
          isSplit,
          headerPopup,
        }),
      });

      if (response.ok) {
        await refreshCards();
        // Reset form
        setTerm('');
        setTitle('');
        setDescription('');
        setImage('');
        setCategory('');
        setSubcategory('');
        setLinks([]);
        setIsSplit(false);
        setSplitImages(['', '']);
        setHasHeaderPopup(false);
        setHeaderType('note');
        setHeaderTitleCardId('');
        setHeaderNote('');
        setHeaderImageUrl('');
        setHeaderTitle('');
        setHeaderUrl('');
        alert('Title card created successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to create title card: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating title card:', error);
      alert('Failed to create title card');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create Title Card</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Term/Phrase</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter the word or phrase..."
            />
            <p className="text-xs text-gray-500 mt-1">The text that will trigger this card</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Scope</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={scope === 'global'}
                  onChange={() => setScope('global')}
                />
                <span>Global (all instances)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={scope === 'instance'}
                  onChange={() => setScope('instance')}
                />
                <span>Single instance</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {scope === 'global'
                ? 'Card will appear for all occurrences of this term'
                : 'Card will appear only for this specific occurrence'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Card title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Card description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image (optional)</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/... or /images/animation.gif"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports static images (PNG, JPG) and animated GIFs
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category (optional)</label>
            <select
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category...</option>
              <option value="Works of Marcel Duchamp">Works of Marcel Duchamp</option>
              <option value="Elden Ring">Elden Ring</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Main category (like MTG card types)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subcategory (optional)</label>
            <select
              className="w-full p-2 border rounded"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              spellCheck={false}
            >
              <option value="">Select a subcategory...</option>
              <option value="The Large Glass">The Large Glass</option>
              <option value="The Readymades">The Readymades</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Subcategory (like MTG card subtypes)</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Links/References (optional)</label>
              <Button size="sm" variant="outline" onClick={handleAddLink}>
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
            </div>
            {links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  value={link.label}
                  onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                  placeholder="Label"
                />
                <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  placeholder="URL"
                />
                <Button size="sm" variant="ghost" onClick={() => handleRemoveLink(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Split Card Configuration */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={isSplit}
                onChange={(e) => setIsSplit(e.target.checked)}
              />
              <span className="text-sm font-medium">
                Enable Split Card (multiple images side-by-side)
              </span>
            </label>

            {isSplit && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <p className="text-xs text-gray-500">
                  Add image URLs to display side-by-side (at least 2 required)
                </p>

                {splitImages.map((imageUrl, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-sm font-medium w-20">Image {index + 1}:</span>
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded"
                      value={imageUrl}
                      onChange={(e) => {
                        const newImages = [...splitImages];
                        newImages[index] = e.target.value;
                        setSplitImages(newImages);
                      }}
                      placeholder="https://example.com/image.png"
                    />
                    {splitImages.length > 2 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newImages = splitImages.filter((_, i) => i !== index);
                          setSplitImages(newImages);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSplitImages([...splitImages, ''])}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Image
                </Button>

                {/* Header Popup Configuration */}
                <div className="border-t pt-4">
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={hasHeaderPopup}
                      onChange={(e) => setHasHeaderPopup(e.target.checked)}
                    />
                    <span className="text-sm font-medium">
                      Add Header Popup (appears above split cards)
                    </span>
                  </label>

                  {hasHeaderPopup && (
                    <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                      <div>
                        <label className="block text-sm font-medium mb-1">Header Type</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={headerType}
                          onChange={(e) => setHeaderType(e.target.value as any)}
                        >
                          <option value="note">Note/Text</option>
                          <option value="image">Image</option>
                          <option value="webpage">Webpage Preview</option>
                          <option value="titlecard">Title Card</option>
                        </select>
                      </div>

                      {headerType === 'titlecard' && (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Select Title Card
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={headerTitleCardId}
                            onChange={(e) => setHeaderTitleCardId(e.target.value)}
                          >
                            <option value="">Select a card...</option>
                            {availableCards
                              .filter((c) => !c.isSplit)
                              .map((card) => (
                                <option key={card.id} value={card.id}>
                                  {card.title}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {headerType === 'note' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">Header Title</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={headerTitle}
                              onChange={(e) => setHeaderTitle(e.target.value)}
                              placeholder="Optional title..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Note Text</label>
                            <textarea
                              className="w-full p-2 border rounded min-h-[80px]"
                              value={headerNote}
                              onChange={(e) => setHeaderNote(e.target.value)}
                              placeholder="Enter note text..."
                            />
                          </div>
                        </>
                      )}

                      {headerType === 'image' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">Header Title</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={headerTitle}
                              onChange={(e) => setHeaderTitle(e.target.value)}
                              placeholder="Optional title..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={headerImageUrl}
                              onChange={(e) => setHeaderImageUrl(e.target.value)}
                              placeholder="/images/..."
                            />
                          </div>
                        </>
                      )}

                      {headerType === 'webpage' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">Webpage Title</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={headerTitle}
                              onChange={(e) => setHeaderTitle(e.target.value)}
                              placeholder="Page title..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Webpage URL</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={headerUrl}
                              onChange={(e) => setHeaderUrl(e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Preview Image (optional)
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={headerImageUrl}
                              onChange={(e) => setHeaderImageUrl(e.target.value)}
                              placeholder="Leave empty for auto-fetch"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              If empty, we&apos;ll attempt to fetch a preview image
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || !term || !title || !description}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Title Card'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
