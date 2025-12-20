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
  SelectionState,
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
  Check,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  Minimize,
} from 'lucide-react';
import 'draft-js/dist/Draft.css';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

type ImageSize = 'small' | 'medium' | 'large' | 'full';
type ImageAlign = 'left' | 'center' | 'right';

interface MediaData {
  src: string;
  type: 'image' | 'video';
  caption?: string;
  publicId?: string;
  size?: ImageSize;
  align?: ImageAlign;
}

// Custom block component for images and videos
const MediaComponent: React.FC<{
  block: any;
  contentState: any;
  blockProps: {
    onRemove: (blockKey: string, publicId?: string) => void;
    onSelect: (blockKey: string) => void;
    selectedBlock: string | null;
  };
}> = ({ block, contentState, blockProps }) => {
  const entityKey = block.getEntityAt(0);
  if (!entityKey) return null;

  const entity = contentState.getEntity(entityKey);
  const entityData = entity.getData() as MediaData;
  const { src, type, publicId, caption = '', size = 'full', align = 'center' } = entityData;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const blockKey = block.getKey();
  const isSelected = blockProps.selectedBlock === blockKey;

  // Size mapping
  const sizeMap = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full'
  };

  // Alignment mapping
  const alignMap = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  };

  // Optimized Cloudinary URL
  const optimizedSrc = React.useMemo(() => {
    if (type === 'image' && src.includes('cloudinary.com')) {
      const urlParts = src.split('/upload/');
      if (urlParts.length === 2) {
        return `${urlParts[0]}/upload/f_auto,q_auto,w_1200/${urlParts[1]}`;
      }
    }
    return src;
  }, [src, type]);

  const displaySrc = React.useMemo(() => {
    const base = type === 'image' ? optimizedSrc : src;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}retry=${retryCount}`;
  }, [optimizedSrc, src, type, retryCount]);

  // Loading timeout
  useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
        console.error(`Media load timed out: ${src}`);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [isLoading, src, retryCount]);

  const handleRemove = useCallback(() => {
    blockProps.onRemove(blockKey, publicId);
  }, [blockKey, publicId, blockProps]);

  const handleMediaLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleMediaError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(c => c + 1);
      setIsLoading(true);
      setHasError(false);
    }
  }, [retryCount]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    blockProps.onSelect(blockKey);
  }, [blockKey, blockProps]);

  const containerClass = type === 'image' 
    ? `${sizeMap[size]} ${alignMap[align]}`
    : 'w-full';

  return (
    <div 
      className="relative my-6 group" 
      contentEditable={false} 
      suppressContentEditableWarning
      onClick={handleClick}
    >
      <div className={`relative ${containerClass}`}>
        <div className={`relative bg-gray-900 rounded-lg overflow-hidden border-2 shadow-lg transition-all ${
          isSelected ? 'border-green-500 ring-2 ring-green-500/50' : 'border-gray-700'
        }`}>
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
                  disabled={retryCount >= 3}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
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
                If retry fails, check Cloudinary settings or try the direct link.
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                  }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
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

          {isSelected && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-green-500"></div>
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-green-500"></div>
            </div>
          )}
        </div>

        {/* Display Caption Below */}
        {caption && (
          <div className="mt-3 px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-700">
            <p className="text-sm text-gray-200 leading-relaxed">{caption}</p>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && type === 'image' && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            title="Close (Esc)"
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
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-lg max-w-3xl mx-4">
              <p className="text-white text-center text-sm leading-relaxed">{caption}</p>
            </div>
          )}
        </div>
      )}
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
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [selectedBlockKey, setSelectedBlockKey] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('full');
  const [imageAlign, setImageAlign] = useState<ImageAlign>('center');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor>(null);

  // Update caption, size, and align when selection changes
  useEffect(() => {
    if (selectedBlockKey) {
      const contentState = editorState.getCurrentContent();
      const block = contentState.getBlockForKey(selectedBlockKey);
      if (block && block.getType() === 'atomic') {
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
          const entity = contentState.getEntity(entityKey);
          const data = entity.getData() as MediaData;
          setCaptionText(data.caption || '');
          setImageSize(data.size || 'full');
          setImageAlign(data.align || 'center');
        }
      }
    } else {
      setCaptionText('');
      setImageSize('full');
      setImageAlign('center');
    }
  }, [selectedBlockKey, editorState]);

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

    if (file.size > 10 * 1024 * 1024) {
      setUploadProgress('✗ File too large. Max 10MB.');
      setTimeout(() => setUploadProgress(''), 5000);
      setIsUploading(false);
      return;
    }

    try {
      const result = await uploadToCloudinary(file);
      if (!result?.url) throw new Error('Upload failed');

      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('MEDIA', 'IMMUTABLE', {
        src: result.url,
        type,
        publicId: result.publicId,
        caption: '',
        size: 'full',
        align: 'center',
      });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

      handleEditorChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));

      setUploadProgress('✓ Uploaded successfully!');
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(`✗ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setUploadProgress(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      addMedia(file, 'image');
    } else {
      setUploadProgress('✗ Invalid image type.');
      setTimeout(() => setUploadProgress(''), 5000);
    }
    e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ['video/mp4', 'video/webm', 'video/ogg'].includes(file.type)) {
      addMedia(file, 'video');
    } else {
      setUploadProgress('✗ Invalid video type.');
      setTimeout(() => setUploadProgress(''), 5000);
    }
    e.target.value = '';
  };

  const removeMediaBlock = useCallback(async (blockKey: string, publicId?: string) => {
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Delete from Cloudinary failed:', error);
      }
    }

    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap().delete(blockKey);
    const newContentState = contentState.set('blockMap', blockMap) as ContentState;
    const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
    handleEditorChange(newEditorState);
    
    if (selectedBlockKey === blockKey) {
      setSelectedBlockKey(null);
    }
  }, [editorState, handleEditorChange, selectedBlockKey]);

  const handleBlockSelect = useCallback((blockKey: string) => {
    setSelectedBlockKey(blockKey);
  }, []);

  const updateMediaSettings = useCallback(() => {
    if (!selectedBlockKey) return;

    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selectedBlockKey);
    
    if (!block || block.getType() !== 'atomic') return;
    
    const entityKey = block.getEntityAt(0);
    if (!entityKey) return;

    const entity = contentState.getEntity(entityKey);
    const data = entity.getData() as MediaData;

    // Only update size and align for images
    const updates: Partial<MediaData> = { 
      caption: captionText.trim() 
    };

    if (data.type === 'image') {
      updates.size = imageSize;
      updates.align = imageAlign;
    }

    const newContentState = contentState.mergeEntityData(entityKey, updates);
    
    const newEditorState = EditorState.push(
      editorState, 
      newContentState, 
      'apply-entity'
    );
    
    handleEditorChange(newEditorState);
  }, [selectedBlockKey, captionText, imageSize, imageAlign, editorState, handleEditorChange]);

  const blockRendererFn = useCallback((block: any) => {
    if (block.getType() === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          onRemove: removeMediaBlock,
          onSelect: handleBlockSelect,
          selectedBlock: selectedBlockKey,
        },
      };
    }
    return null;
  }, [removeMediaBlock, handleBlockSelect, selectedBlockKey]);

  const currentStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  // Check if selected block is an image
  const isImageSelected = React.useMemo(() => {
    if (!selectedBlockKey) return false;
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selectedBlockKey);
    if (block && block.getType() === 'atomic') {
      const entityKey = block.getEntityAt(0);
      if (entityKey) {
        const entity = contentState.getEntity(entityKey);
        const data = entity.getData() as MediaData;
        return data.type === 'image';
      }
    }
    return false;
  }, [selectedBlockKey, editorState]);

  return (
    <div className={`border border-gray-600 rounded-lg bg-gray-800 shadow-xl ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-1 mr-4">
          <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('BOLD'); }} className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${currentStyle.has('BOLD') ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Bold (Ctrl+B)"><Bold size={18} /></button>
          <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('ITALIC'); }} className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${currentStyle.has('ITALIC') ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Italic (Ctrl+I)"><Italic size={18} /></button>
          <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('UNDERLINE'); }} className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${currentStyle.has('UNDERLINE') ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Underline (Ctrl+U)"><Underline size={18} /></button>
        </div>

        <div className="flex items-center gap-1 mr-4">
          <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('header-one'); }} className={`px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-bold ${currentBlockType === 'header-one' ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Heading 1">H1</button>
          <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('header-two'); }} className={`px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-bold ${currentBlockType === 'header-two' ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Heading 2">H2</button>
          <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('unordered-list-item'); }} className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${currentBlockType === 'unordered-list-item' ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Bullet List"><List size={18} /></button>
          <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('ordered-list-item'); }} className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${currentBlockType === 'ordered-list-item' ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Numbered List"><ListOrdered size={18} /></button>
          <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('blockquote'); }} className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${currentBlockType === 'blockquote' ? 'bg-gray-700 text-green-400' : 'text-gray-300'}`} title="Quote"><Quote size={18} /></button>
        </div>

        <div className="flex items-center gap-1 mr-4">
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50" title="Add Image">
            {isUploading ? <Loader size={18} className="animate-spin" /> : <Image size={18} />}
          </button>
          <button onClick={() => videoInputRef.current?.click()} disabled={isUploading} className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50" title="Add Video"><Video size={18} /></button>
          <button onClick={() => setShowLinkInput(true)} className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300" title="Add Link (Ctrl+K)"><Link size={18} /></button>
        </div>

        {uploadProgress && (
          <div className="ml-auto px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200 font-medium">
            {uploadProgress}
          </div>
        )}
      </div>

      {/* Media Settings Panel - Shows when media is selected */}
      {selectedBlockKey && (
        <div className="p-4 border-b border-gray-700 bg-gray-900">
          {/* Caption Input */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Type size={16} className="text-green-500" />
              <span className="font-medium text-sm text-gray-300">Caption</span>
            </div>
            <input
              type="text"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Add a caption..."
              maxLength={200}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateMediaSettings();
                }
              }}
            />
            <div className="mt-1 text-xs text-gray-500">
              {captionText.length}/200 characters
            </div>
          </div>

          {/* Image Size and Alignment Controls - Only for images */}
          {isImageSelected && (
            <>
              {/* Size Controls */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Maximize size={16} className="text-green-500" />
                  <span className="font-medium text-sm text-gray-300">Size</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImageSize('small')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageSize === 'small'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Minimize size={14} className="inline mr-1" />
                    Small
                  </button>
                  <button
                    onClick={() => setImageSize('medium')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageSize === 'medium'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setImageSize('large')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageSize === 'large'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Large
                  </button>
                  <button
                    onClick={() => setImageSize('full')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageSize === 'full'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Maximize size={14} className="inline mr-1" />
                    Full
                  </button>
                </div>
              </div>

              {/* Alignment Controls */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlignCenter size={16} className="text-green-500" />
                  <span className="font-medium text-sm text-gray-300">Alignment</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImageAlign('left')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageAlign === 'left'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <AlignLeft size={16} className="inline mr-1" />
                    Left
                  </button>
                  <button
                    onClick={() => setImageAlign('center')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageAlign === 'center'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <AlignCenter size={16} className="inline mr-1" />
                    Center
                  </button>
                  <button
                    onClick={() => setImageAlign('right')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageAlign === 'right'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <AlignRight size={16} className="inline mr-1" />
                    Right
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={updateMediaSettings}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Check size={16} />
              Apply Changes
            </button>
            <button 
              onClick={() => setSelectedBlockKey(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-3 border-b border-gray-700 bg-gray-800">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addLink();
                if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); }
              }}
              autoFocus
            />
            <button onClick={addLink} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">Add</button>
            <button onClick={() => { setShowLinkInput(false); setLinkUrl(''); }} className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium">Cancel</button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div 
        className="min-h-[300px] p-5"
        onClick={() => setSelectedBlockKey(null)}
      >
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

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageUpload} className="hidden" />
      <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/ogg" onChange={handleVideoUpload} className="hidden" />

      <style jsx global>{`
        .public-DraftEditor-content {
          min-height: 250px;
          color: white;
          font-size: 16px;
          line-height: 1.7;
        }
        .public-DraftEditor-content h1 { font-size: 2.25rem; font-weight: 700; margin: 1.5rem 0 1rem; }
        .public-DraftEditor-content h2 { font-size: 1.75rem; font-weight: 600; margin: 1.25rem 0 0.75rem; }
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
        .public-DraftEditor-content ol { margin: 1rem 0; padding-left: 2rem; }
        .public-DraftEditor-content a { color: #10b981; text-decoration: underline; }
        .public-DraftEditor-content a:hover { color: #059669; }
        .public-DraftStyleDefault-block { margin: 0.75rem 0; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;