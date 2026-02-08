# Image Optimization Guide

## Overview
This project uses automatic image optimization to ensure fast loading times and efficient storage. All uploaded images are compressed and resized based on their use case.

## Installation

```bash
npm install browser-image-compression
```

## Image Types & Optimization Settings

### 1. Company Logos
**Use:** Company cards, profile pictures  
**Target Size:** 200x200px  
**Max File Size:** 500KB  
**Quality:** 90% (high - logos need crisp text)  
**Function:** `optimizeCompanyLogo(file)`

### 2. Deal Images
**Use:** DealCard images  
**Target Size:** 800x600px  
**Max File Size:** 1MB  
**Quality:** 85% (balanced)  
**Function:** `optimizeDealImage(file)`

### 3. Hero Banners
**Use:** Homepage carousel, promotional banners  
**Target Size:** 1920x1080px (Full HD)  
**Max File Size:** 2MB  
**Quality:** 80% (web-optimized)  
**Function:** `optimizeHeroBanner(file)`

### 4. Company Images
**Use:** CompanyCard square images  
**Target Size:** 400x400px  
**Max File Size:** 800KB  
**Quality:** 85%  
**Function:** `optimizeCompanyImage(file)`

## Usage Examples

### Using ImageUpload Component (Recommended)

```jsx
import ImageUpload from '@/components/ui/ImageUpload';

// In your form component
export default function CompanyRegistrationForm() {
  const [logo, setLogo] = useState(null);

  return (
    <form>
      <ImageUpload
        type="logo"
        label="Company Logo"
        helperText="Upload your company logo. Square images work best."
        required
        onImageSelect={(optimizedFile) => setLogo(optimizedFile)}
        onImageRemove={() => setLogo(null)}
      />
    </form>
  );
}
```

### Using Optimization Functions Directly

```jsx
import { optimizeDealImage } from '@/lib/imageOptimizer';

async function handleFileUpload(file) {
  try {
    const optimizedFile = await optimizeDealImage(file);
    // Upload optimizedFile to server/storage
    await uploadToSupabase(optimizedFile);
  } catch (error) {
    console.error('Optimization failed:', error);
  }
}
```

## ImageUpload Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'deal' | Image type: 'logo', 'deal', 'banner', 'company' |
| `currentImage` | string | null | URL of existing image (for editing) |
| `onImageSelect` | function | - | Callback when image is selected & optimized |
| `onImageRemove` | function | - | Callback when image is removed |
| `label` | string | 'Upload Image' | Label text |
| `helperText` | string | null | Helper text below label |
| `required` | boolean | false | Show required asterisk |

## Integration Examples

### Company Registration Form
```jsx
<ImageUpload
  type="logo"
  label="Company Logo"
  required
  onImageSelect={(file) => setFormData({...formData, logo: file})}
/>
```

### Deal Creation Form
```jsx
<ImageUpload
  type="deal"
  label="Deal Image"
  helperText="Upload an image showcasing your offer"
  required
  onImageSelect={(file) => setDealImage(file)}
/>
```

### Admin - Hero Banner Upload
```jsx
<ImageUpload
  type="banner"
  label="Hero Banner"
  helperText="Upload a banner for the homepage carousel (1920x1080 recommended)"
  onImageSelect={(file) => setBannerImage(file)}
/>
```

### Company Profile - Company Image
```jsx
<ImageUpload
  type="company"
  label="Company Image"
  helperText="Upload a photo of your business (storefront, office, etc.)"
  onImageSelect={(file) => setCompanyImage(file)}
/>
```

## Validation

The utility includes built-in validation:
- ✅ Accepts: JPG, PNG, WebP
- ❌ Rejects: GIF, SVG, other formats
- ✅ Max upload size: 10MB (before compression)
- ✅ Automatic compression based on type

## Best Practices

1. **Use the right type** - Always specify the correct image type for optimal results
2. **Original quality** - Upload high-quality originals; optimization happens automatically
3. **Aspect ratios:**
   - Logos: Square (1:1)
   - Deal images: Landscape (4:3)
   - Banners: Widescreen (16:9)
   - Company images: Square (1:1)

4. **Don't pre-compress** - Let the utility handle compression for best results

## Server-Side Upload (Example with Supabase)

```jsx
import { supabase } from '@/lib/supabase';
import { optimizeDealImage } from '@/lib/imageOptimizer';

async function uploadDealImage(file, dealId) {
  try {
    // 1. Optimize image
    const optimizedFile = await optimizeDealImage(file);
    
    // 2. Generate unique filename
    const fileExt = optimizedFile.name.split('.').pop();
    const fileName = `${dealId}_${Date.now()}.${fileExt}`;
    
    // 3. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('deal-images')
      .upload(fileName, optimizedFile);
    
    if (error) throw error;
    
    // 4. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('deal-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

## Troubleshooting

**Images look blurry:**
- Logos should use 90% quality - check you're using `optimizeCompanyLogo()`
- Increase `initialQuality` in optimizer options

**File size still too large:**
- Reduce `maxWidthOrHeight` value
- Lower `maxSizeMB` value
- Ensure original image quality isn't excessive (no need for RAW/TIFF)

**Optimization is slow:**
- Large original files take longer
- Consider showing a loading indicator
- `useWebWorker: true` is enabled by default for better performance

## Performance Tips

1. **Show preview immediately** - Use `getImagePreviewUrl()` for instant feedback
2. **Cleanup previews** - Always call `revokeImagePreviewUrl()` to prevent memory leaks
3. **Optimize on upload** - Don't store original large files
4. **Use Next.js Image component** - Handles responsive sizing automatically

## File Structure

```
lib/
  imageOptimizer.js       # Core optimization functions
components/
  ui/
    ImageUpload.jsx       # Reusable upload component
```