import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Copy, CheckIcon } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function QRGenerator() {
  const [code, setCode] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("14:30");
  const [generatedText, setGeneratedText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!code.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um código numérico.",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Erro", 
        description: "Por favor, selecione uma data.",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = format(date, "dd/MM/yyyy");
    const finalText = `${code} - ${formattedDate} ${time}`;
    setGeneratedText(finalText);

    try {
      const qrUrl = await QRCode.toDataURL(finalText, {
        width: 300,
        margin: 2,
        color: {
          dark: "#1a1a1a",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
      setQrCodeUrl(qrUrl);
      
      toast({
        title: "Sucesso!",
        description: "QR Code gerado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar QR Code.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência.",
      });
    } catch (error) {
      console.error("Erro ao copiar:", error);
      toast({
        title: "Erro",
        description: "Falha ao copiar texto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Gerador QR Code
          </h1>
          <p className="text-muted-foreground">
            Crie QR codes com código e data/hora
          </p>
        </div>

        {/* Form Card */}
        <Card className="card-modern p-6 space-y-6">
          {/* Code Input */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Código Numérico
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="Ex: 12345"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="h-12 text-center text-lg font-mono"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">
              Horário
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 text-center text-lg"
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            className="w-full h-12 text-lg font-semibold"
            variant="default"
          >
            Gerar QR Code
          </Button>
        </Card>

        {/* Results */}
        {generatedText && (
          <div className="space-y-6">
            {/* Generated Text */}
            <Card className="result-container">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-sm flex-1 min-w-0 break-all">
                  {generatedText}
                </p>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="shrink-0 h-8 w-8 p-0"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="flex justify-center">
                <div className="qr-container">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code gerado"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}