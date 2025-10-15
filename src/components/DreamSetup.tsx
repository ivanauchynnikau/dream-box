import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

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
  const [timeUnit, setTimeUnit] = useState<"days" | "months" | "years">(
    initialData?.timeUnit || "months"
  );

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

  const onSubmit = (data: DreamFormData) => {
    onSave(data);
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
              <Label htmlFor="imageUrl">Фото мечты</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className="bg-secondary border-input"
              />
              {errors.imageUrl && (
                <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
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
            >
              {initialData ? "Сохранить изменения" : "Начать копить"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
