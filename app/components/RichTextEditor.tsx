// components/RichTextEditor.tsx
"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  X,
  Loader,
  Maximize2,
} from 'lucide-react';
import 'draft-js/dist/Draft.css';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

interface MediaData {
  src: string;
  type: 'image' | 'video';
  caption?: string;
  publicId?: string;
}

// Custom block component for images and videos
const MediaComponent: React.FC<{
  block: any;
  contentState: any;
  blockProps: {
    onRemove: (blockKey: string, publicId?: string) => void;
    onCaptionChange: (blockKey: string, caption: string) => void;
  };
}> = ({ block, contentState, blockProps }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, type, caption = '', publicId } = entity.getData() as MediaData;
  const [localCaption, setLocalCaption] = useState(caption);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadStartTime] = useState(Date.now());

  // Optimize Cloudinary URL for faster loading
  const optimizedSrc = React.useMemo(() => {
    if (type === 'image' && src.includes('cloudinary.com')) {
      const urlParts = src.split('/upload/');
      if (urlParts.length === 2) {
        return `${urlParts[0]}/upload/f_auto,q_auto,w_1200/${urlParts[1]}`;
      }
    }
    return src;
  }, [src, type]);

  // Build display URL with retry counter
  const displaySrc = React.useMemo(() => {
    const base = type === 'image' ? optimizedSrc : src;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}retry=${retryCount}`;
  }, [optimizedSrc, src, type, retryCount]);

  // Timeout for loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
        console.error(`Image load timed out after 10s: ${src}`);
      }
    }, 10000); // 10s timeout
    return () => clearTimeout(timeout);
  }, [isLoading, src]);

  const handleCaptionSave = () => {
    blockProps.onCaptionChange(block.getKey(), localCaption);
    setIsEditing(false);
  };

  const handleRemove = () => {
    blockProps.onRemove(block.getKey(), publicId);
  };

  const handleMediaLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log(`Media loaded successfully: ${src}`);
  };

  const handleMediaError = (e: any) => {
    console.error('Media load error:', e, 'URL:', src);
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount((c) => c + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      console.error('Max retries reached for:', src);
    }
  };

  return (
    <>
      <div className="relative my-6 group">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <Loader className="animate-spin text-green-500" size={32} />
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 p-4">
              <X className="text-red-500 mb-2" size={32} />
              <p className="text-red-400 text-sm text-center mb-2">Failed to load {type}</p>
              <p className="text-gray-500 text-xs mt-1 max-w-md truncate text-center mb-3">{src}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Retry ({retryCount}/3)
                </button>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                >
                  Open Direct
                </a>
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center max-w-sm">
                If retry fails, check your Cloudinary settings or open the link directly.
              </p>
            </div>
          )}
          {type === 'image' ? (
            <div className="relative">
              <img
                key={displaySrc}
                src={displaySrc}
                alt={caption || 'Content image'}
                className="w-full h-auto max-h-[600px] object-contain bg-gray-950"
                onLoad={handleMediaLoad}
                onError={handleMediaError}
                style={{ display: hasError ? 'none' : 'block' }}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
              {!isLoading && !hasError && (
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                  title="View fullscreen"
                >
                  <Maximize2 size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="relative bg-black">
              <video
                key={displaySrc}
                src={displaySrc}
                controls
                controlsList="nodownload"
                className="w-full h-auto max-h-[600px] object-contain"
                preload="metadata"
                onLoadedData={handleMediaLoad}
                onError={handleMediaError}
                style={{ display: hasError ? 'none' : 'block' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-20"
            title="Remove media"
          >
            <X size={18} />
          </button>
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-white text-xs font-medium flex items-center gap-1">
              {type === 'image' ? <Image size={12} /> : <Video size={12} />}
              {type.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="mt-3 px-1">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={localCaption}
                onChange={(e) => setLocalCaption(e.target.value)}
                placeholder="Add a caption..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCaptionSave();
                  else if (e.key === 'Escape') {
                    setLocalCaption(caption);
                    setIsEditing(false);
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleCaptionSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setLocalCaption(caption);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className="text-gray-400 text-sm italic cursor-pointer hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-800/50"
            >
              {caption || 'Click to add caption...'}
            </p>
          )}
        </div>
      </div>
      {isFullscreen && type === 'image' && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={displaySrc}
            alt={caption || 'Content image'}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {caption && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-lg max-w-2xl">
              <p className="text-white text-center">{caption}</p>
            </div>
          )}
        </div>
      )}
    </>
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
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor>(null);

  const handleEditorChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    onChange(JSON.stringify(rawContent));
  }, [onChange]);

  const keyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 75) {
      return 'add-link';
    }
    return getDefaultKeyBinding(e);
  };

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

  const toggleInlineStyle = (style: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const addLink = () => {
    if (!linkUrl.trim()) return;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: linkUrl });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    handleEditorChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const addMedia = async (file: File, type: 'image' | 'video') => {
    setIsUploading(true);
    setUploadProgress(`Uploading ${type}...`);

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadProgress('✗ File too large. Maximum size is 10MB.');
      setTimeout(() => setUploadProgress(''), 5000);
      setIsUploading(false);
      return;
    }

    try {
      console.log('Starting upload:', { name: file.name, type, size: file.size });
      const result = await uploadToCloudinary(file);
      console.log('Upload result:', result);
      if (!result || !result.url) {
        throw new Error('Invalid upload result: missing URL');
      }

      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('MEDIA', 'IMMUTABLE', {
        src: result.url,
        type,
        publicId: result.publicId,
        caption: '',
      });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      console.log('Entity created:', { src: result.url, type, publicId: result.publicId });
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      handleEditorChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
      setUploadProgress('✓ Upload complete!');
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUploadProgress(`✗ Upload failed: ${errorMessage}`);
      setTimeout(() => setUploadProgress(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (file && validTypes.includes(file.type)) {
      addMedia(file, 'image');
    } else {
      setUploadProgress('✗ Invalid file type. Use JPEG, PNG, GIF, or WebP.');
      setTimeout(() => setUploadProgress(''), 5000);
    }
    e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (file && validTypes.includes(file.type)) {
      addMedia(file, 'video');
    } else {
      setUploadProgress('✗ Invalid file type. Use MP4, WebM, or OGG.');
      setTimeout(() => setUploadProgress(''), 5000);
    }
    e.target.value = '';
  };

  const removeMediaBlock = async (blockKey: string, publicId?: string) => {
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
        console.log('Deleted from Cloudinary:', publicId);
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap().delete(blockKey);
    const newContentState = contentState.set('blockMap', blockMap) as ContentState;
    handleEditorChange(EditorState.push(editorState, newContentState, 'remove-range'));
  };

  const updateMediaCaption = (blockKey: string, caption: string) => {
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(blockKey);
    const entityKey = block.getEntityAt(0);
    const entity = contentState.getEntity(entityKey);
    const newData = { ...entity.getData(), caption };
    const newContentState = contentState.replaceEntityData(entityKey, newData);
    handleEditorChange(EditorState.push(editorState, newContentState, 'apply-entity'));
  };

  const blockRendererFn = (block: any) => {
    console.log('Rendering block:', block.getType());
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

  const currentStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  return (
    <div className={`border border-gray-600 rounded-lg bg-gray-800 shadow-xl ${className}`}>
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-1 mr-4">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleInlineStyle('BOLD');
            }}
            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
              currentStyle.has('BOLD') ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleInlineStyle('ITALIC');
            }}
            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
              currentStyle.has('ITALIC') ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleInlineStyle('UNDERLINE');
            }}
            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
              currentStyle.has('UNDERLINE') ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline size={18} />
          </button>
        </div>
        <div className="flex items-center gap-1 mr-4">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('header-one');
            }}
            className={`px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-bold ${
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
            className={`px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-bold ${
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
            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
              currentBlockType === 'unordered-list-item' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('ordered-list-item');
            }}
            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
              currentBlockType === 'ordered-list-item' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlockType('blockquote');
            }}
            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
              currentBlockType === 'blockquote' ? 'bg-gray-700 text-green-400' : 'text-gray-300'
            }`}
            title="Quote"
          >
            <Quote size={18} />
          </button>
        </div>
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add Image"
          >
            {isUploading ? <Loader size={18} className="animate-spin" /> : <Image size={18} />}
          </button>
          <button
            onClick={() => videoInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add Video"
          >
            <Video size={18} />
          </button>
          <button
            onClick={() => setShowLinkInput(true)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
            title="Add Link (Ctrl+K)"
          >
            <Link size={18} />
          </button>
        </div>
        {uploadProgress && (
          <div className="ml-auto px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200 font-medium">
            {uploadProgress}
          </div>
        )}
      </div>
      {showLinkInput && (
        <div className="p-3 border-b border-gray-700 bg-gray-800">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addLink();
                else if (e.key === 'Escape') {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }
              }}
              autoFocus
            />
            <button
              onClick={addLink}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="min-h-[300px] p-5">
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        onChange={handleVideoUpload}
        className="hidden"
      />
      <style jsx global>{`
        .DraftEditor-root {
          position: relative;
        }
        .DraftEditor-editorContainer {
          position: relative;
          z-index: 1;
        }
        .public-DraftEditor-content {
          min-height: 250px;
          color: white;
          font-size: 16px;
          line-height: 1.7;
        }
        .public-DraftEditor-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem;
          color: white;
          line-height: 1.2;
        }
        .public-DraftEditor-content h2 {
          font-size: 1.75rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem;
          color: white;
          line-height: 1.3;
        }
        .public-DraftEditor-content blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #d1d5db;
          background: rgba(16, 185, 129, 0.05);
          padding: 1rem 1.25rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .public-DraftEditor-content ul,
        .public-DraftEditor-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .public-DraftEditor-content li {
          margin: 0.5rem 0;
        }
        .public-DraftEditor-content a {
          color: #10b981;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .public-DraftEditor-content a:hover {
          color: #059669;
        }
        .public-DraftStyleDefault-block {
          margin: 0.75rem 0;
        }
        .public-DraftEditor-content [data-contents="true"] {
          line-height: 1.7;
        }
        .public-DraftEditorPlaceholder-root {
          color: #6b7280;
          position: absolute;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;