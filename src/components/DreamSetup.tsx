import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Upload, Loader2, X } from "lucide-react";
import { StorageService } from "@/services/storageService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const dreamSchema = z.object({
  dreamName: z.string().min(1, "Введите название мечты"),
  imageUrl: z.string().url("Введите корректную ссылку на изображение").or(z.literal("")),
  targetAmount: z.number().min(1, "Сумма должна быть больше 0"),
  timeValue: z.number().min(1, "Срок должен быть больше 0"),
  timeUnit: z.enum(["days", "months", "years"]),
});

type DreamFormData = z.infer<typeof dreamSchema>;

interface DreamSetupProps {
  onSave: (data: DreamFormData) => void;
  initialData?: DreamFormData;
}

export const DreamSetup = ({ onSave, initialData }: DreamSetupProps) => {
  const { user } = useAuth();
  const [timeUnit, setTimeUnit] = useState<"days" | "months" | "years">(
    initialData?.timeUnit || "months"
  );
  const [uploadTab, setUploadTab] = useState<"url" | "file">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DreamFormData>({
    resolver: zodResolver(dreamSchema),
    defaultValues: initialData || {
      dreamName: "",
      imageUrl: "",
      targetAmount: 15000,
      timeValue: 12,
      timeUnit: "months",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB');
      return;
    }

    setSelectedFile(file);

    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(initialData?.imageUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: DreamFormData) => {
    setIsUploading(true);
    try {
      let finalImageUrl = data.imageUrl;

      // Если выбран файл, загружаем его
      if (selectedFile && user) {
        toast.info('Загружаем изображение...');
        finalImageUrl = await StorageService.uploadDreamImage(user.id, selectedFile);
        toast.success('Изображение загружено!');
      }

      // Сохраняем мечту с URL изображения
      onSave({
        ...data,
        imageUrl: finalImageUrl,
      });
    } catch (error: any) {
      toast.error(error.message || 'Ошибка загрузки изображения');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl border-border shadow-[var(--shadow-glow)]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary to-amber-600">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            {initialData ? "Редактировать мечту" : "Какая у тебя мечта?"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {initialData ? "Обновите параметры своей мечты" : "Определите цель и начните путь к её достижению"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dreamName">Мечта</Label>
              <Input
                id="dreamName"
                {...register("dreamName")}
                placeholder="Купить свой остров!"
                className="bg-secondary border-input"
              />
              {errors.dreamName && (
                <p className="text-sm text-destructive">{errors.dreamName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Фото мечты</Label>
              <Tabs value={uploadTab} onValueChange={(v) => setUploadTab(v as "url" | "file")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">Загрузить файл</TabsTrigger>
                  <TabsTrigger value="url">Ссылка на фото</TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="space-y-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {selectedFile ? 'Выбрать другое фото' : 'Выбрать фото'}
                      </Button>
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={clearFile}
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Выбрано: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="space-y-2">
                  <Input
                    id="imageUrl"
                    {...register("imageUrl")}
                    placeholder="https://example.com/image.jpg"
                    className="bg-secondary border-input"
                    onChange={(e) => {
                      setValue("imageUrl", e.target.value);
                      setPreviewUrl(e.target.value);
                      setSelectedFile(null);
                    }}
                    disabled={isUploading}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                  )}
                </TabsContent>
              </Tabs>

              {/* Превью изображения */}
              {previewUrl && (
                <div className="mt-3">
                  <Label className="text-sm text-muted-foreground mb-2 block">Превью:</Label>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                    <img
                      src={previewUrl}
                      alt="Превью мечты"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setPreviewUrl("");
                        toast.error("Не удалось загрузить изображение");
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Сумма до мечты ($)</Label>
              <Input
                id="targetAmount"
                type="number"
                {...register("targetAmount", { valueAsNumber: true })}
                placeholder="15000"
                className="bg-secondary border-input"
              />
              {errors.targetAmount && (
                <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Срок достижения</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    {...register("timeValue", { valueAsNumber: true })}
                    placeholder="12"
                    className="bg-secondary border-input"
                  />
                  {errors.timeValue && (
                    <p className="text-sm text-destructive mt-1">{errors.timeValue.message}</p>
                  )}
                </div>
                <Select
                  value={timeUnit}
                  onValueChange={(value: "days" | "months" | "years") => {
                    setTimeUnit(value);
                    setValue("timeUnit", value);
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-secondary border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Дней</SelectItem>
                    <SelectItem value="months">Месяцев</SelectItem>
                    <SelectItem value="years">Лет</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-amber-600 hover:opacity-90 transition-opacity text-primary-foreground font-semibold text-lg py-6"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                initialData ? "Сохранить изменения" : "Начать копить"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
