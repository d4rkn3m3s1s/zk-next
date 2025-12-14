"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImagePlus, X, Save, RefreshCw, Download, ChevronsUpDown, Check } from "lucide-react"
import { createProduct, updateProduct } from "@/app/actions/product"
import { getBrands, getModels, getPhoneSpecs, Brand, Model } from "@/app/actions/api-integration"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface BrandComboboxProps {
    brands: Brand[]
    value: string
    onChange: (value: string) => void
}

function BrandCombobox({ brands, value, onChange }: BrandComboboxProps) {
    const [open, setOpen] = useState(false)

    // Sort brands: Popular ones first, then alphabetical
    const popularBrands = ["apple", "samsung", "xiaomi", "huawei", "oppo", "oneplus", "google"]
    const sortedBrands = [...brands].sort((a, b) => {
        const aName = a.brand_name.toLowerCase()
        const bName = b.brand_name.toLowerCase()
        const aPop = popularBrands.indexOf(aName)
        const bPop = popularBrands.indexOf(bName)

        if (aPop !== -1 && bPop !== -1) return aPop - bPop // Both popular, sort by rank
        if (aPop !== -1) return -1 // Only A is popular
        if (bPop !== -1) return 1 // Only B is popular
        return aName.localeCompare(bName) // Sort alphabetically
    })

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    type="button"
                >
                    {value
                        ? brands.find((brand) => brand.brand_slug === value)?.brand_name
                        : "Marka seçin..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Marka ara..." />
                    <CommandList>
                        <CommandEmpty>Marka bulunamadı.</CommandEmpty>
                        <CommandGroup>
                            {sortedBrands.map((brand) => (
                                <CommandItem
                                    key={brand.brand_id}
                                    value={brand.brand_name} // Command searches by this value
                                    onSelect={() => {
                                        onChange(brand.brand_slug)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === brand.brand_slug ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {brand.brand_name}
                                    <span className="ml-auto text-xs text-muted-foreground">{brand.device_count} cihaz</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

interface ModelComboboxProps {
    models: Model[]
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

function ModelCombobox({ models, value, onChange, disabled }: ModelComboboxProps) {
    const [open, setOpen] = useState(false)

    // Sort models: Prefer newer/higher number models (simple heuristic) or just keep API order logic
    // Usually API returns relevant order, but let's just make it searchable which is the main request.

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                    type="button"
                >
                    {value
                        ? models.find((model) => model.model_slug === value)?.model_name
                        : "Model seçin..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Model ara..." />
                    <CommandList>
                        <CommandEmpty>Model bulunamadı.</CommandEmpty>
                        <CommandGroup>
                            {models.map((model) => (
                                <CommandItem
                                    key={model.model_slug}
                                    value={model.model_name}
                                    onSelect={() => {
                                        onChange(model.model_slug)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === model.model_slug ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {model.model_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

interface ProductFormProps {
    product?: any
    isSecondHand?: boolean
}

export function ProductForm({ product, isSecondHand = false }: ProductFormProps) {
    const router = useRouter()
    // Form States
    const [productName, setProductName] = useState(product?.name || "")
    const [productDesc, setProductDesc] = useState(product?.description || "")
    const [productPrice, setProductPrice] = useState(product?.price || "")
    const [productStock, setProductStock] = useState(product?.stock || "")
    const [productBrand, setProductBrand] = useState(product?.brand || "")
    const [productCategory, setProductCategory] = useState(product?.category || "phones")
    const [productStatus, setProductStatus] = useState(product?.status || "active")
    const [images, setImages] = useState<string[]>(product?.images ? JSON.parse(product.images) : [])
    // Second Hand Fields
    const [condition, setCondition] = useState(product?.condition || "")
    const [batteryHealth, setBatteryHealth] = useState(product?.batteryHealth || "")
    const [warranty, setWarranty] = useState(product?.warranty || "")

    const [loading, setLoading] = useState(false)
    const [fetchingParams, setFetchingParams] = useState(false)

    // API Integration States
    const [brands, setBrands] = useState<Brand[]>([])
    const [models, setModels] = useState<Model[]>([])
    const [selectedBrand, setSelectedBrand] = useState<string>("")
    const [selectedModel, setSelectedModel] = useState<string>("")

    useEffect(() => {
        // Load brands on mount
        async function loadBrands() {
            const data = await getBrands()
            setBrands(data)
        }
        loadBrands()
    }, [])

    useEffect(() => {
        if (selectedBrand) {
            async function loadModels() {
                const data = await getModels(selectedBrand)
                setModels(data)
            }
            loadModels()
        } else {
            setModels([])
        }
    }, [selectedBrand])

    // State for visual specs preview
    const [specHighlights, setSpecHighlights] = useState<Record<string, string>>({})

    const handleFetchSpecs = async () => {
        if (!selectedBrand || !selectedModel) return
        setFetchingParams(true)
        try {
            const specs = await getPhoneSpecs(selectedBrand, selectedModel)
            if (specs) {
                // Auto-fill form fields
                setProductName(`${specs.brand_name} ${specs.model_name}`)

                // Extract Highlights
                const newHighlights: Record<string, string> = {}
                if (specs.specifications) {
                    // Display
                    const display = specs.specifications["Display"]
                    if (display) {
                        const size = display["Size"] ? display["Size"] : "";
                        const res = display["Resolution"] ? display["Resolution"] : "";
                        if (size || res) newHighlights["Ekran"] = `${size} ${res}`.trim()
                    }

                    // Processor (Platform)
                    const platform = specs.specifications["Platform"]
                    if (platform) {
                        const chipset = platform["Chipset"]
                        if (chipset) newHighlights["İşlemci"] = chipset
                    }

                    // Camera (Main)
                    const mainCam = specs.specifications["Main Camera"]
                    if (mainCam) {
                        // Usually "Triple", "Dual" or just keys like "Single"
                        // We iterate to find the first key that looks like a camera spec or check standard keys
                        const features = Object.values(mainCam).join(" ");
                        // Simple extraction: take the first ~50 chars or first line
                        newHighlights["Kamera"] = features.split(',')[0]
                    }

                    // Battery
                    const battery = specs.specifications["Battery"]
                    if (battery) {
                        const type = battery["Type"]
                        if (type) newHighlights["Batarya"] = type
                    }

                    // Memory
                    const memory = specs.specifications["Memory"]
                    if (memory) {
                        const internal = memory["Internal"]
                        if (internal) newHighlights["Hafıza"] = internal
                    }

                    // Colors
                    const misc = specs.specifications["Misc"] || specs.specifications["Comms"]; // Sometimes Colors in Comms or Misc
                    if (misc && misc["Colors"]) {
                        const colors = misc["Colors"];
                        newHighlights["Renkler"] = colors;
                    }
                }
                setSpecHighlights(newHighlights)

                // Format description (Keeping full detail for SEO/Page)
                let desc = `Marka: ${specs.brand_name}\nModel: ${specs.model_name}\n`
                if (specs.specifications) {
                    Object.entries(specs.specifications).forEach(([category, values]) => {
                        desc += `\n${category}:\n`
                        if (typeof values === 'object') {
                            Object.entries(values).forEach(([key, val]) => {
                                desc += `- ${key}: ${val}\n`
                            })
                        } else {
                            desc += `- ${values}\n`
                        }
                    })
                }
                setProductDesc(desc)

                // Try to map brand
                // Our internal brands: apple, samsung, xiaomi, huawei, oppo
                // API Brand: Samsung, Apple, etc.
                const lowerBrand = specs.brand_name.toLowerCase()
                if (['apple', 'samsung', 'xiaomi', 'huawei', 'oppo'].includes(lowerBrand)) {
                    setProductBrand(lowerBrand)
                }

                setProductCategory("phones")

                // Images - Populate Gallery
                if (specs.phone_images && specs.phone_images.length > 0) {
                    setImages(specs.phone_images)
                } else if (specs.model_img) {
                    setImages([specs.model_img])
                }
            }
        } catch (error) {
            console.error("Error fetching specs:", error)
        } finally {
            setFetchingParams(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = `https://picsum.photos/seed/${Math.random()}/400/400`
            setImages([...images, url])
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    // Image Preview State
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        formData.append("images", JSON.stringify(images))

        // Append controlled values just in case inputs didn't update (though they should have)
        // Actually FormData grabs from inputs. If we control inputs, their value attr is set, so FormData is correct.

        try {
            if (product) {
                await updateProduct(product.id, formData)
            } else {
                await createProduct(formData)
            }
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* API Fetch Section */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Download className="h-5 w-5" /> Veritabanından Çek
                    </h3>
                    <span className="text-xs text-muted-foreground">Marka ve Model seçerek bilgileri otomatik doldurun.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 flex flex-col">
                        <Label className="mb-1">Marka</Label>
                        <BrandCombobox
                            brands={brands}
                            value={selectedBrand}
                            onChange={(val) => setSelectedBrand(val)}
                        />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label className="mb-1">Model</Label>
                        <ModelCombobox
                            models={models}
                            value={selectedModel}
                            onChange={(val) => setSelectedModel(val)}
                            disabled={!selectedBrand}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            type="button"
                            className="w-full gap-2"
                            onClick={handleFetchSpecs}
                            disabled={!selectedBrand || !selectedModel || fetchingParams}
                        >
                            {fetchingParams ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            {fetchingParams ? "Çekiliyor..." : "Bilgileri Getir"}
                        </Button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Temel Bilgiler</h3>

                        <div className="space-y-2">
                            <Label htmlFor="name">Ürün Adı</Label>
                            <Input
                                id="name"
                                name="name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Örn: iPhone 15 Pro"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>

                            {/* Spec Preview Boxes */}
                            {Object.keys(specHighlights).length > 0 && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {Object.entries(specHighlights).map(([key, val]) => (
                                        <div key={key} className="bg-muted/30 p-3 rounded-lg border border-border text-sm">
                                            <span className="block text-xs font-semibold text-muted-foreground uppercase">{key}</span>
                                            <span className="font-medium text-foreground">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Textarea
                                id="description"
                                name="description"
                                value={productDesc}
                                onChange={(e) => setProductDesc(e.target.value)}
                                placeholder="Ürün özelliklerini detaylıca anlatın..."
                                className="min-h-[150px]"
                            />
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Medya</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group cursor-pointer" onClick={() => setPreviewImage(img)}>
                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center cursor-pointer gap-2">
                                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-medium">Görsel Ekle</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                    {/* Lightbox Dialog */}
                    {previewImage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImage(null)}>
                            <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
                                <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                                <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setPreviewImage(null)}>
                                    <X className="h-8 w-8" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Fiyatlandırma & Stok</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Fiyat (TL)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comparePrice">İndirimsiz Fiyat (Opsiyonel)</Label>
                                <Input id="comparePrice" name="comparePrice" type="number" step="0.01" defaultValue={product?.comparePrice} placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cost">Maliyet (Opsiyonel)</Label>
                                <Input id="cost" name="cost" type="number" step="0.01" defaultValue={product?.cost} placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stok Adedi</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    value={productStock}
                                    onChange={(e) => setProductStock(e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Organizasyon</h3>

                        <div className="space-y-2">
                            <Label>Durum</Label>
                            <Select name="status" value={productStatus} onValueChange={setProductStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Durum seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="draft">Taslak</SelectItem>
                                    <SelectItem value="archived">Arşivlenmiş</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select name="category" value={productCategory} onValueChange={setProductCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategori seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phones">Telefonlar</SelectItem>
                                    <SelectItem value="accessories">Aksesuarlar</SelectItem>
                                    <SelectItem value="tablets">Tabletler</SelectItem>
                                    <SelectItem value="parts">Yedek Parça</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Marka</Label>
                            <Select name="brand" value={productBrand} onValueChange={setProductBrand}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Marka seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="samsung">Samsung</SelectItem>
                                    <SelectItem value="xiaomi">Xiaomi</SelectItem>
                                    <SelectItem value="huawei">Huawei</SelectItem>
                                    <SelectItem value="oppo">Oppo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Özellikler</h3>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="featured" name="isFeatured" defaultChecked={product?.isFeatured} />
                                <Label htmlFor="featured">Öne Çıkan Ürün</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="new" name="isNew" defaultChecked={product?.isNew} />
                                <Label htmlFor="new">Yeni Ürün Etiketi</Label>
                            </div>
                        </div>
                    </div>

                    {/* Second Hand Specific Fields */}
                    {(isSecondHand || condition || batteryHealth) && (
                        <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>
                                İkinci El Durumu
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Kozmetik Durum</Label>
                                    <Select name="condition" value={condition} onValueChange={setCondition}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Durum seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mukemmel">Mükemmel (Kusursuz)</SelectItem>
                                            <SelectItem value="cok-iyi">Çok İyi (Kılcal Çizikler)</SelectItem>
                                            <SelectItem value="iyi">İyi (Belirgin İzler)</SelectItem>
                                            <SelectItem value="orta">Orta (Yıpranmış)</SelectItem>
                                            <SelectItem value="tamir-gormus">Tamir Görmüş</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="batteryHealth">Pil Sağlığı (%)</Label>
                                        <div className="relative">
                                            <Input
                                                id="batteryHealth"
                                                name="batteryHealth"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={batteryHealth}
                                                onChange={(e) => setBatteryHealth(e.target.value)}
                                                placeholder="85"
                                            />
                                            <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="warranty">Garanti Durumu</Label>
                                        <Input
                                            id="warranty"
                                            name="warranty"
                                            value={warranty}
                                            onChange={(e) => setWarranty(e.target.value)}
                                            placeholder="Örn: 6 Ay Mağaza, 1 Yıl Apple"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </div>
            </form >
        </div >
    )
}
