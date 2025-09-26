import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanResult: (result: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanResult, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const startScanner = async () => {
      if (videoRef.current) {
        try {
          qrScannerRef.current = new QrScanner(
            videoRef.current,
            (result) => {
              onScanResult(result.data);
              toast({
                title: "QR Code detectado!",
                description: "Código extraído com sucesso.",
              });
              onClose();
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
              preferredCamera: "environment", // Câmera traseira
            }
          );

          await qrScannerRef.current.start();
          setIsScanning(true);
        } catch (error) {
          console.error("Erro ao iniciar scanner:", error);
          toast({
            title: "Erro",
            description: "Não foi possível acessar a câmera. Verifique as permissões.",
            variant: "destructive",
          });
        }
      }
    };

    startScanner();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [onScanResult, onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Scanner QR Code</h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 rounded-lg bg-gray-900 object-cover"
            autoPlay
            muted
            playsInline
          />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
              <p className="text-white text-sm">Iniciando câmera...</p>
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          Posicione o QR Code dentro da área de escaneamento
        </p>
      </Card>
    </div>
  );
}