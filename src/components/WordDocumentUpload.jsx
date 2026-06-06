import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { parseWordDocument } from '@/utils/wordDocumentParser';
import { convertHtmlToMarkdown, extractContentSections } from '@/utils/contentConverter';
import { generateSlug, generateMetaDescription, extractKeywords } from '@/utils/seoGenerator';
import { standardizeBranding } from '@/utils/brandStandardizer';

const WordDocumentUpload = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file.name.endsWith('.docx')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a valid .docx file.',
        variant: 'destructive'
      });
      return false;
    }
    
    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Maximum file size is 10MB.',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };

  const processFile = async (file) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    setProgress(10);
    
    try {
      // 1. Parse Document
      setProgress(30);
      const { rawHtml, rawText } = await parseWordDocument(file);
      
      // 2. Convert to Markdown
      setProgress(50);
      let markdown = convertHtmlToMarkdown(rawHtml);
      
      // 3. Standardize Branding
      setProgress(70);
      markdown = standardizeBranding(markdown);
      const standardizedRawText = standardizeBranding(rawText);
      
      // 4. Extract Sections & Generate SEO
      setProgress(85);
      const sections = extractContentSections(markdown, standardizedRawText);
      
      const seoData = {
        h1_headline: sections.h1_headline,
        title: sections.h1_headline, // Default title to H1
        slug: generateSlug(sections.h1_headline),
        seo_title: sections.h1_headline.length > 60 ? sections.h1_headline.substring(0, 57) + '...' : sections.h1_headline,
        meta_description: generateMetaDescription(sections.introduction, sections.h1_headline),
        keywords: extractKeywords(standardizedRawText, sections.h1_headline),
      };
      
      // 5. Finalize
      setProgress(100);
      
      const finalData = {
        ...sections,
        ...seoData,
        status: 'draft',
        author: 'Dream Black Horse Team',
        category: 'KFPS Friesian'
      };
      
      toast({
        title: 'Document Parsed Successfully',
        description: 'Content, SEO, and branding have been automatically processed.',
      });
      
      setTimeout(() => {
        onUploadComplete(finalData);
        setIsProcessing(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: 'Processing Failed',
        description: error.message || 'An error occurred while parsing the document.',
        variant: 'destructive'
      });
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="text-[#d4af37] w-5 h-5" />
        <h3 className="text-lg font-bold text-white">Import from Word Document</h3>
      </div>
      
      {!isProcessing ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-[#d4af37] bg-[#d4af37]/5' 
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept=".docx" 
            className="hidden" 
          />
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <p className="text-white font-medium mb-1">Click or drag a .docx file here to upload</p>
          <p className="text-sm text-gray-500">Auto-extracts content, generates SEO, and standardizes branding.</p>
          <p className="text-xs text-gray-600 mt-2">Max file size: 10MB</p>
        </div>
      ) : (
        <div className="border border-white/10 bg-[#1a1a1a] rounded-xl p-8 text-center">
          <Loader2 className="w-10 h-10 text-[#d4af37] mx-auto mb-4 animate-spin" />
          <p className="text-white font-medium mb-2">Processing Document...</p>
          
          <div className="w-full max-w-md mx-auto bg-[#222] rounded-full h-2.5 mb-2 overflow-hidden">
            <div 
              className="bg-[#d4af37] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">{progress}% Complete</p>
          
          <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 max-w-sm mx-auto text-left">
            <div className="flex items-center gap-2">
              {progress > 10 ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Reading .docx file</span>
            </div>
            <div className="flex items-center gap-2">
              {progress > 30 ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Extracting structure and formatting</span>
            </div>
            <div className="flex items-center gap-2">
              {progress > 60 ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Applying Dream Black Horse branding</span>
            </div>
            <div className="flex items-center gap-2">
              {progress > 80 ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Generating SEO metadata & slugs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordDocumentUpload;