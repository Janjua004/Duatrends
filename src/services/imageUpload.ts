import { getSupabaseClient } from './cloudStore';

const metaEnv = (import.meta as any).env || {};

/**
 * Upload Image File (Supports Cloudinary REST API, Supabase Storage, or Data URL fallback)
 */
export async function uploadImageFile(file: File): Promise<{ success: boolean; url: string; message: string }> {
  try {
    // 1. Try Cloudinary REST API if credentials are provided or configured in CMS
    const cloudName = localStorage.getItem('duatrends_cloudinary_cloud_name') || localStorage.getItem('stylewing_cloudinary_cloud_name') || metaEnv.VITE_CLOUDINARY_CLOUD_NAME || 'dwdnfn1ab';
    const customPreset = localStorage.getItem('duatrends_cloudinary_preset') || localStorage.getItem('stylewing_cloudinary_preset');
    
    const uploadPresets = [
      customPreset,
      metaEnv.VITE_CLOUDINARY_UPLOAD_PRESET,
      'ml_default',
      'duatrends_preset',
      'unsigned_preset',
      'duatrends'
    ].filter(Boolean);

    if (cloudName) {
      for (const preset of uploadPresets) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', preset as string);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
          });

          if (res.ok) {
            const data = await res.json();
            if (data.secure_url) {
              return {
                success: true,
                url: data.secure_url,
                message: 'Image uploaded & CDN-optimized via Cloudinary!'
              };
            }
          }
        } catch (cErr) {
          console.warn(`Cloudinary preset ${preset} attempt failed:`, cErr);
        }
      }
    }

    // 2. Try Supabase Storage Bucket ('product-images')
    const supabase = getSupabaseClient();
    if (supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return {
            success: true,
            url: publicUrlData.publicUrl,
            message: 'Image uploaded successfully to Supabase Storage!'
          };
        }
      }
    }

    // 3. Fallback: Convert file to Data URL for instant offline preview & saving
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    return {
      success: true,
      url: dataUrl,
      message: 'Image processed successfully.'
    };
  } catch (err: any) {
    console.error('Image upload error:', err);
    return {
      success: false,
      url: '',
      message: `Failed to upload image: ${err.message || 'Unknown error'}`
    };
  }
}

/**
 * Test Cloudinary Credentials & Preset Connectivity
 */
export async function testCloudinaryConnection(cloudName: string, preset: string): Promise<{ success: boolean; message: string }> {
  try {
    const pixelBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const formData = new FormData();
    formData.append('file', pixelBase64);
    formData.append('upload_preset', preset.trim());

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) {
        return { success: true, message: 'Cloudinary credentials verified & working perfectly!' };
      }
    }
    const errData = await res.json();
    return { success: false, message: errData.error?.message || `Cloudinary status ${res.status}` };
  } catch (err: any) {
    return { success: false, message: `Cloudinary connection error: ${err.message || err}` };
  }
}

