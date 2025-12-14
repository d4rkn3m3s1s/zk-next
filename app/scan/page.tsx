"use client";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { getWolvoxProduct } from "@/app/actions/wolvox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Camera, Search, ShoppingCart } from "lucide-react";

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [manualCode, setManualCode] = useState("");
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize Scanner
        // Need to wait for DOM element "reader"
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 300, height: 150 }, // Rectangular box better for 1D barcodes
                aspectRatio: 1.0,
                // Use native barcode detector if available (much faster/accurate)
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true
                },
                // Request higher resolution for better 1D barcode reading
                videoConstraints: {
                    facingMode: "environment",
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 },
                },
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.QR_CODE
                ]
            },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, []);

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
        // Handle on success condition with the decoded message.
        if (decodedText !== scanResult) {
            console.log("Scan Success:", decodedText);
            setScanResult(decodedText);
            setManualCode(decodedText); // Show in input box
            fetchProduct(decodedText);

            // Optional: Pause scanner for a moment to avoid multiple reads
            if (scannerRef.current) {
                scannerRef.current.pause();
                setTimeout(() => {
                    scannerRef.current?.resume();
                }, 2000);
            }
        }
    };

    const onScanFailure = (error: any) => {
        // handle on error condition, with error message
        // console.warn(`Code scan error = ${error}`);
    };

    const fetchProduct = async (barcode: string) => {
        setLoading(true);
        setError(null);
        setProduct(null);

        try {
            const res = await getWolvoxProduct(barcode);
            if (res.success) {
                setProduct(res.product);
                // Vibrate if available
                if (navigator.vibrate) navigator.vibrate(200);
            } else {
                setError(res.error || "Ürün bulunamadı");
            }
        } catch (err) {
            setError("Sunucu hatası");
        } finally {
            setLoading(false);
        }
    };

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.length > 2) {
            setScanResult(manualCode);
            fetchProduct(manualCode);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-cyan-400" /> Barkod Tarayıcı
            </h1>

            <div className="w-full max-w-md space-y-6">
                {/* Camera Area */}
                <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                    <CardContent className="p-0">
                        <div id="reader" className="w-full bg-black" />
                    </CardContent>
                </Card>

                {/* Manual Input */}
                <form onSubmit={handleManualSearch} className="flex gap-2">
                    <Input
                        placeholder="Barkod el ile giriniz..."
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                        <Search className="w-4 h-4" />
                    </Button>
                </form>

                {/* Result Area */}
                {loading && (
                    <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
                        <p className="mt-2 text-slate-400">Ürün aranıyor...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {product && (
                    <Card className="bg-slate-800 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-sm uppercas">Ürün Detayı</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{product.name}</h2>
                                <p className="text-xs text-slate-500 mt-1">Barkod: {scanResult}</p>
                            </div>

                            <div className="flex justify-between items-end border-t border-slate-700 pt-4">
                                <div>
                                    <div className="text-sm text-slate-400">Satış Fiyatı</div>
                                    <div className="text-3xl font-black text-green-400">
                                        ₺{product.price ? Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0.00'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400">Stok Durumu</div>
                                    <div className={`text-xl font-bold ${Number(product.stock) > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                        {Number(product.stock)} Adet
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold h-12 text-lg">
                                <ShoppingCart className="mr-2 w-5 h-5" /> Sepete Ekle
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
