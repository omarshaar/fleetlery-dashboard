# ProductImageGallery - استخدام مباشر للبيانات

## 📌 الفكرة الأساسية

المكون يعيد لك مصفوفة من الصور (`ImageItem[]`). أنت تتحكم كيف تحول هذه البيانات لإرسالها للباكإند.

---

## 🎯 البنية الأساسية

```typescript
// هذا هو الشكل الذي يعيده المكون
const images: ImageItem[] = [
  {
    id: "img_123",
    src: "blob:http://localhost/...",  // صورة محلية (قبل الرفع)
    file: File,                         // الملف الأصلي
    alt: "وصف الصورة",
    isMain: true,
  },
  {
    id: "img_456",
    src: "https://example.com/image.jpg",  // صورة من URL
    alt: "صورة أخرى",
    isMain: false,
  }
]
```

---

## 💡 كيفية الاستخدام

### الطريقة 1️⃣: FormData (الأفضل)

```typescript
const handleSubmit = (images: ImageItem[]) => {
  const formData = new FormData()
  
  images.forEach((image, index) => {
    // إذا كانت الصورة ملف محلي
    if (image.file) {
      formData.append(`images[${index}]`, image.file)
      formData.append(`alt[${index}]`, image.alt || "")
      formData.append(`is_main[${index}]`, image.isMain ? "1" : "0")
    }
    // إذا كانت صورة من URL (وليست مؤقتة)
    else if (image.src && !image.src.startsWith("blob:")) {
      formData.append(`image_urls[${index}]`, image.src)
      formData.append(`alt[${index}]`, image.alt || "")
      formData.append(`is_main[${index}]`, image.isMain ? "1" : "0")
    }
  })

  // إرسال للباكإند
  fetch("/api/products", {
    method: "POST",
    body: formData,  // مهم: بدون Content-Type header
  })
}
```

### الطريقة 2️⃣: JSON (للمعلومات فقط)

```typescript
const handleSubmit = (images: ImageItem[]) => {
  // تصفية البيانات (بدون File objects وبدون blob URLs)
  const imageData = images
    .filter(img => !img.src?.startsWith("blob:"))
    .map(img => ({
      src: img.src,
      alt: img.alt,
      isMain: img.isMain,
    }))

  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "منتج جديد",
      images: imageData,
    }),
  })
}
```

### الطريقة 3️⃣: مختلط (ملفات + معلومات)

```typescript
const handleSubmit = async (images: ImageItem[]) => {
  const formData = new FormData()
  const uploadedImages: string[] = []

  // أولاً: رفع الملفات المحلية
  for (const image of images.filter(img => img.file)) {
    if (image.file) {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: (() => {
          const fd = new FormData()
          fd.append("file", image.file)
          return fd
        })(),
      })
      const { url } = await response.json()
      uploadedImages.push(url)
    }
  }

  // ثانياً: إرسال المعلومات
  const imageData = images.map((img, i) => ({
    src: img.file ? uploadedImages.shift() : img.src,
    alt: img.alt,
    isMain: img.isMain,
  }))

  await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images: imageData }),
  })
}
```

---

## ⚠️ أشياء مهمة

### ❌ تجنب:

```typescript
// ❌ blob: URLs مؤقتة (ستختفي بعد refresh الصفحة)
const src = "blob:http://localhost/..."

// ❌ إرسال File objects مباشرة في JSON
JSON.stringify(images)  // خطأ!

// ❌ صورة بدون تعيين isMain
images.filter(img => !img.isMain).length === images.length
```

### ✅ افعل:

```typescript
// ✅ استخدم blob: URLs قبل الإرسال فقط
if (image.src.startsWith("blob:")) {
  // استخدم image.file بدلاً منها
}

// ✅ استخدم FormData للملفات
const formData = new FormData()
formData.append("file", image.file)

// ✅ تأكد من وجود صورة رئيسية
const hasMain = images.some(img => img.isMain)
```

---

## 📝 مثال عملي كامل

```typescript
import { useState } from "react"
import { ProductImageGallery } from "@/components"

export function CreateProduct() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // التحقق البسيط
    if (images.length === 0) {
      setError("لا توجد صور")
      return
    }
    
    if (!images.some(img => img.isMain)) {
      setError("حدد صورة رئيسية")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      
      images.forEach((image, index) => {
        if (image.file) {
          // صورة محلية
          formData.append(`images[${index}]`, image.file)
        } else if (image.src && !image.src.startsWith("blob:")) {
          // صورة من URL
          formData.append(`image_urls[${index}]`, image.src)
        }
        
        formData.append(`alt[${index}]`, image.alt || "")
        formData.append(`is_main[${index}]`, image.isMain ? "1" : "0")
      })

      // إضافة بيانات أخرى
      formData.append("name", "اسم المنتج")
      formData.append("price", "99.99")

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("خطأ في الإرسال")
      
      alert("تم إنشاء المنتج بنجاح")
      setImages([])
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ProductImageGallery 
        value={images}
        onChange={setImages}
        maxFiles={5}
        forceAutoCrop={true}
      />
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button 
        type="submit" 
        disabled={loading}
      >
        {loading ? "جاري الإرسال..." : "إنشاء المنتج"}
      </button>
    </form>
  )
}
```

---

## 🔄 في الباكإند (Laravel مثال)

```php
public function store(Request $request)
{
    // التحقق
    $request->validate([
        'images.*' => 'image|max:5120',
        'image_urls.*' => 'url',
        'alt.*' => 'string',
        'is_main.*' => 'boolean',
    ]);

    $product = Product::create($request->only('name', 'price'));

    // معالجة الملفات المحلية
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $file) {
            $path = $file->store("products", 'public');
            $product->images()->create([
                'url' => "/storage/$path",
                'alt' => $request->input("alt.$index", ''),
                'is_main' => (bool)$request->input("is_main.$index"),
            ]);
        }
    }

    // معالجة URLs الخارجية
    if ($request->input('image_urls')) {
        foreach ($request->input('image_urls') as $index => $url) {
            $product->images()->create([
                'url' => $url,
                'alt' => $request->input("alt.$index", ''),
                'is_main' => (bool)$request->input("is_main.$index"),
            ]);
        }
    }

    return response()->json(['id' => $product->id], 201);
}
```

---

## 📚 ملخص

| الحالة | الحل |
|-------|-----|
| صورة محلية (`.file` موجود) | استخدم `image.file` في FormData |
| صورة من URL | استخدم `image.src` في FormData أو JSON |
| blob: URL مؤقتة | تجاهلها، استخدم `.file` بدلاً منها |
| إرسال ملفات | **استخدم FormData** |
| إرسال بيانات نصية فقط | يمكن استخدام JSON |

---

**الخلاصة:** أنت تتحكم بـ 100% في كيفية تحويل البيانات! 🎉
