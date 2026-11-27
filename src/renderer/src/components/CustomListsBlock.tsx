import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Edit2,
  Trash2,
  Check,
  Search,
} from 'lucide-react';
import { cn } from '@shared/utils';
import type { CustomList, CustomListScope } from '../stores/skillsStore';

export interface ListCandidateItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface CustomListsAccordionProps {
  lists: CustomList[];
  itemsById: Map<string, React.ReactNode>;
  onEditList: (list: CustomList) => void;
  onDeleteList: (listId: string) => void;
  emptyHint?: string;
}

export const CustomListsAccordion: React.FC<CustomListsAccordionProps> = ({
  lists,
  itemsById,
  onEditList,
  onDeleteList,
}) => {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  if (lists.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
        Custom Lists ({lists.length})
      </p>
      {lists.map(list => {
        const isOpen = Boolean(expandedMap[list.id]);
        const validIds = list.itemIds.filter(id => itemsById.has(id));
        return (
          <div
            key={list.id}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-[rgb(var(--color-surface-hover))]/60">
              <button
                type="button"
                onClick={() => setExpandedMap(prev => ({ ...prev, [list.id]: !prev[list.id] }))}
                className="flex items-center gap-2 min-w-0 flex-1 text-left"
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-[rgb(var(--color-foreground-muted))] flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[rgb(var(--color-foreground-muted))] flex-shrink-0" />
                )}
                <span className="text-sm font-semibold text-[rgb(var(--color-foreground))] truncate">
                  {list.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] flex-shrink-0">
                  {validIds.length}
                </span>
              </button>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEditList(list)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
                  title="Add or remove items in this list"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Items</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteList(list.id)}
                  className="p-1.5 rounded text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/10"
                  title="Delete custom list (keeps items)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="p-3 space-y-2 border-t border-[rgb(var(--color-border))]">
                {validIds.length === 0 ? (
                  <p className="text-xs text-[rgb(var(--color-foreground-muted))] py-2 text-center">
                    No items in this list yet — click <strong>Items</strong> above to add from your saved entries.
                  </p>
                ) : (
                  validIds.map(id => (
                    <React.Fragment key={id}>{itemsById.get(id)}</React.Fragment>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface CustomListModalProps {
  scope: CustomListScope;
  editingList: CustomList | null;
  candidates: ListCandidateItem[];
  onClose: () => void;
  onSave: (name: string, itemIds: string[], editingListId?: string) => void;
}

const SCOPE_TITLES: Record<CustomListScope, string> = {
  'api-keys': 'API Keys',
  plugins: 'Plugins',
  skills: 'AI Skills',
};

export const CustomListModal: React.FC<CustomListModalProps> = ({
  scope,
  editingList,
  candidates,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(editingList?.name || '');
  const [selectedIds, setSelectedIds] = useState<string[]>(editingList?.itemIds || []);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setName(editingList?.name || '');
    setSelectedIds(editingList?.itemIds || []);
    setSearchQuery('');
  }, [editingList, scope]);

  const selectedSet = new Set(selectedIds);
  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return c.label.toLowerCase().includes(q) || (c.sublabel || '').toLowerCase().includes(q);
  });

  const toggleId = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content p-6 w-full max-w-md max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <FolderPlus className="w-5 h-5 text-[rgb(var(--color-accent-ink))]" />
          <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
            {editingList ? `Edit ${SCOPE_TITLES[scope]} List` : `Create ${SCOPE_TITLES[scope]} List`}
          </h3>
        </div>

        <div className="space-y-3 flex-1 min-h-0 flex flex-col">
          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--color-foreground))]">List / Category Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={`e.g. Production ${SCOPE_TITLES[scope]}`}
              autoFocus
              className="w-full text-sm"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <label className="text-sm font-medium text-[rgb(var(--color-foreground))]">
              Select {SCOPE_TITLES[scope]} ({selectedIds.length} selected)
            </label>
            {candidates.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (selectedIds.length === filteredCandidates.length) {
                    const fSet = new Set(filteredCandidates.map(c => c.id));
                    setSelectedIds(prev => prev.filter(id => !fSet.has(id)));
                  } else {
                    const next = new Set(selectedIds);
                    filteredCandidates.forEach(c => next.add(c.id));
                    setSelectedIds(Array.from(next));
                  }
                }}
                className="text-xs text-[rgb(var(--color-accent-ink))] hover:underline"
              >
                {selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0 ? 'Clear Filtered' : 'Select Filtered'}
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-foreground-muted))]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search added ${SCOPE_TITLES[scope].toLowerCase()}...`}
              className="w-full pl-8 pr-3 py-1.5 text-xs"
            />
          </div>

          <div className="flex-1 min-h-[160px] max-h-64 overflow-y-auto border border-[rgb(var(--color-border))] rounded-lg divide-y divide-[rgb(var(--color-border))]">
            {filteredCandidates.length === 0 ? (
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] text-center py-6">
                No matching items added yet.
              </p>
            ) : (
              filteredCandidates.slice(0, 120).map(item => {
                const checked = selectedSet.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleId(item.id)}
                    className={cn(
                      'w-full px-3 py-2 flex items-center justify-between gap-2 text-left text-xs transition-colors',
                      checked
                        ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-foreground))]'
                        : 'hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground))]'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.label}</p>
                      {item.sublabel && (
                        <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] truncate">{item.sublabel}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                        checked
                          ? 'bg-[rgb(var(--color-primary))] border-transparent text-[rgb(var(--color-primary-foreground))]'
                          : 'border-[rgb(var(--color-border))]'
                      )}
                    >
                      {checked && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={() => {
              if (!name.trim()) return;
              onSave(name.trim(), selectedIds, editingList?.id);
            }}
            className="px-4 py-2 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50 font-medium"
          >
            {editingList ? 'Save List' : 'Create List'}
          </button>
        </div>
      </div>
    </div>
  );
};
