// components/RichTextEditor.tsx
"use client";

import React, { useState, useRef, useCallback } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  AtomicBlockUtils,
  ContentState,
  convertToRaw,
  convertFromRaw,
  DraftHandleValue,
  DraftEditorCommand,
} from 'draft-js';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Image,
  Video,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Upload,
  X,
  Loader,
} from 'lucide-react';
import 'draft-js/dist/Draft.css';

interface RichTextEditorProps {
  value?: string; // JSON string of Draft.js content
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

interface MediaData {
  src: string;
  type: 'image' | 'video';
  caption?: string;
  publicId?: string; // For Cloudinary
}

// Custom block component for images and videos
const MediaComponent: React.FC<{
  block: any;
  contentState: any;
  blockProps: {
    onRemove: (blockKey: string) => void;
    onCaptionChange: (blockKey: string, caption: string) => void;
  };
}> = ({ block, contentState, blockProps }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, type, caption = '' } = entity.getData() as MediaData;
  const [localCaption, setLocalCaption] = useState(caption);
  const [isEditing, setIsEditing] = useState(false);

  const handleCaptionSave = () => {
    blockProps.onCaptionChange(block.getKey(), localCaption);
    setIsEditing(false);
  };

  const handleRemove = () => {
    blockProps.onRemove(block.getKey());
  };

  return (
    <div className="relative my-4 group">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {type === 'image' ? (
          <img
            src={src}
            alt={caption || 'Content image'}
            className="w-full max-h-96 object-contain"
          />
        ) : (
          <video
            src={src}
            controls
            className="w-full max-h-96"
            preload="metadata"
          />
        )}
        
        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>

      {/* Caption */}
      <div className="mt-2">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={localCaption}
              onChange={(e) => setLocalCaption(e.target.value)}
              placeholder="Add a caption..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCaptionSave();
                } else if (e.key === 'Escape') {
                  setLocalCaption(caption);
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
            <button
              onClick={handleCaptionSave}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="text-gray-400 text-sm italic cursor-pointer hover:text-gray-300 transition-colors"
          >
            {caption || 'Click to add caption...'}
          </p>
        )}
      </div>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
}) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      try {
        const contentState = convertFromRaw(JSON.parse(value));
        return EditorState.createWithContent(contentState);
      } catch (error) {
        console.error('Error parsing editor content:', error);
      }
    }
    return EditorState.createEmpty();
  });

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor>(null);

  // Handle editor state changes
  const handleEditorChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState);
    
    // Convert to JSON and call onChange
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    onChange(JSON.stringify(rawContent));
  }, [onChange]);

  // Key bindings
  const keyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (KeyBindingUtil.hasCommandModifier(e)) {
      switch (e.keyCode) {
        case 75: // K
          return 'add-link';
        default:
          break;
      }
    }
    return getDefaultKeyBinding(e);
  };

  // Handle key commands
  const handleKeyCommand = (command: string): DraftHandleValue => {
    if (command === 'add-link') {
      setShowLinkInput(true);
      return 'handled';
    }

    const newState = RichUtils.handleKeyCommand(editorState, command as DraftEditorCommand);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Style handlers
  const toggleInlineStyle = (style: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  // Link handlers
  const addLink = () => {
    if (!linkUrl.trim()) return;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
      url: linkUrl,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    handleEditorChange(
      RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey)
    );

    setShowLinkInput(false);
    setLinkUrl('');
  };

  // Media upload handler
  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  };

  // Add media to editor
  const addMedia = async (file: File, type: 'image' | 'video') => {
    setIsUploading(true);
    try {
      const { url, publicId } = await uploadToCloudinary(file);
      
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('MEDIA', 'IMMUTABLE', {
        src: url,
        type,
        publicId,
        caption: '',
      });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
      });

      handleEditorChange(
        AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
      );
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // File input handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      addMedia(file, 'image');
    }
    e.target.value = ''; // Reset input
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      addMedia(file, 'video');
    }
    e.target.value = ''; // Reset input
  };

  // Media component handlers
  const removeMediaBlock = (blockKey: string) => {
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap().delete(blockKey);
    const newContentState = contentState.set('blockMap', blockMap) as ContentState;
    const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
    handleEditorChange(newEditorState);
  };

  const updateMediaCaption = (blockKey: string, caption: string) => {
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(blockKey);
    const entityKey = block.getEntityAt(0);
    const entity = contentState.getEntity(entityKey);
    const newData = { ...entity.getData(), caption };
    
    const newContentState = contentState.replaceEntityData(entityKey, newData);
    const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
    handleEditorChange(newEditorState);
  };

  // Block renderer
  const blockRendererFn = (block: any) => {
    if (block.getType() === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          onRemove: removeMediaBlock,
          onCaptionChange: updateMediaCaption,
        },
      };
    }
    return null;
  };

  // Get current styles for button states
  const currentStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  return (
    <div className={`border border-gray-600 rounded-lg bg-gray-800 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-700 bg-gray-750">
        {/* Text formatting */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleInlineStyle('BOLD');
            }}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              currentStyle.has('BOLD') ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleInlineStyle('ITALIC');
            }}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              currentStyle.has('ITALIC') ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleInlineStyle('UNDERLINE');
            }}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              currentStyle.has('UNDERLINE') ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline size={16} />
          </button>
        </div>

        {/* Block formatting */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('header-one');
            }}
            className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-medium ${
              currentBlockType === 'header-one' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('header-two');
            }}
            className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-medium ${
              currentBlockType === 'header-two' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('unordered-list-item');
            }}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              currentBlockType === 'unordered-list-item' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('ordered-list-item');
            }}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              currentBlockType === 'ordered-list-item' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('blockquote');
            }}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              currentBlockType === 'blockquote' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Quote"
          >
            <Quote size={16} />
          </button>
        </div>

        {/* Media */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50"
            title="Add Image"
          >
            {isUploading ? <Loader size={16} className="animate-spin" /> : <Image size={16} />}
          </button>
          <button
            onClick={() => videoInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50"
            title="Add Video"
          >
            <Video size={16} />
          </button>
          <button
            onClick={() => setShowLinkInput(true)}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Add Link (Ctrl+K)"
          >
            <Link size={16} />
          </button>
        </div>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="p-3 border-b border-gray-700 bg-gray-750">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addLink();
                } else if (e.key === 'Escape') {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }
              }}
              autoFocus
            />
            <button
              onClick={addLink}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="min-h-[300px] p-4">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
          blockRendererFn={blockRendererFn}
          placeholder={placeholder}
          spellCheck={true}
        />
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* Custom styles */}
      <style jsx global>{`
        .DraftEditor-root {
          position: relative;
        }
        
        .DraftEditor-editorContainer {
          position: relative;
          z-index: 1;
        }
        
        .public-DraftEditor-content {
          min-height: 200px;
          color: white;
        }
        
        .public-DraftEditor-content h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
          color: white;
        }
        
        .public-DraftEditor-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
          color: white;
        }
        
        .public-DraftEditor-content blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #d1d5db;
        }
        
        .public-DraftEditor-content ul,
        .public-DraftEditor-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .public-DraftEditor-content a {
          color: #10b981;
          text-decoration: underline;
        }
        
        .public-DraftEditor-content a:hover {
          color: #059669;
        }
        
        .public-DraftStyleDefault-block {
          margin: 0.5rem 0;
        }
        
        .public-DraftEditor-content [data-contents="true"] {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;