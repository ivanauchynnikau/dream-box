import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings, Plus, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface DreamData {
  dreamName: string;
  imageUrl: string;
  targetAmount: number;
  timeValue: number;
  timeUnit: "days" | "months" | "years";
  savedAmount: number;
  startDate: string;
  lastSavedDate?: string;
}

interface DreamTrackerProps {
  dreamData: DreamData;
  onEdit: () => void;
  onUpdateSavings: (amount: number) => void;
}

export const DreamTracker = ({ dreamData, onEdit, onUpdateSavings }: DreamTrackerProps) => {
  const [savingAmount, setSavingAmount] = useState<string>("");
  const [daysLeft, setDaysLeft] = useState(0);
  const [dailyRecommendation, setDailyRecommendation] = useState(0);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const start = new Date(dreamData.startDate);
      let endDate = new Date(start);

      switch (dreamData.timeUnit) {
        case "days":
          endDate.setDate(endDate.getDate() + dreamData.timeValue);
          break;
        case "months":
          endDate.setMonth(endDate.getMonth() + dreamData.timeValue);
          break;
        case "years":
          endDate.setFullYear(endDate.getFullYear() + dreamData.timeValue);
          break;
      }

      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const days = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      setDaysLeft(days);

      // Calculate daily recommendation
      const remaining = dreamData.targetAmount - dreamData.savedAmount;
      const daily = days > 0 ? remaining / days : 0;
      setDailyRecommendation(Math.max(0, daily));
    };

    calculateDaysLeft();
  }, [dreamData]);

  const handleAddSaving = () => {
    const amount = parseFloat(savingAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Введите корректную сумму");
      return;
    }

    onUpdateSavings(amount);
    setSavingAmount("");
    toast.success(`Отложено $${amount.toFixed(2)}!`, {
      description: "Вы на шаг ближе к своей мечте! 🎯",
    });
  };

  const progressPercentage = Math.min(
    100,
    (dreamData.savedAmount / dreamData.targetAmount) * 100
  );

  const today = new Date().toDateString();
  const savedToday = dreamData.lastSavedDate === today;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            Моя мечта
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            className="border-border hover:bg-secondary"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Dream Card */}
        <Card className="border-border overflow-hidden">
          {dreamData.imageUrl && (
            <div className="w-full h-64 overflow-hidden">
              <img
                src={dreamData.imageUrl}
                alt={dreamData.dreamName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{dreamData.dreamName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Savings */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Отложить сегодня</label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Введите сумму"
                  value={savingAmount}
                  onChange={(e) => setSavingAmount(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSaving()}
                  className="bg-secondary border-input"
                />
                <Button
                  onClick={handleAddSaving}
                  className="bg-gradient-to-r from-accent to-green-600 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Накоплено</span>
                <span className="font-semibold text-primary">
                  ${dreamData.savedAmount.toFixed(2)} / ${dreamData.targetAmount.toFixed(2)}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-right text-sm font-medium text-accent">
                {progressPercentage.toFixed(1)}%
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Осталось дней</span>
                </div>
                <p className="text-2xl font-bold">{daysLeft}</p>
              </div>

              <div className="bg-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Осталось накопить</span>
                </div>
                <p className="text-2xl font-bold">
                  ${(dreamData.targetAmount - dreamData.savedAmount).toFixed(2)}
                </p>
              </div>

              <div className="bg-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">В день</span>
                </div>
                <p className="text-2xl font-bold text-accent">
                  ${dailyRecommendation.toFixed(2)}
                </p>
              </div>

              <div className="bg-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">В неделю</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${(dailyRecommendation * 7).toFixed(2)}
                </p>
              </div>

              <div className="bg-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">В месяц</span>
                </div>
                <p className="text-2xl font-bold text-amber-500">
                  ${(dailyRecommendation * 30).toFixed(2)}
                </p>
              </div>

              <div className="bg-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">В год</span>
                </div>
                <p className="text-2xl font-bold text-green-500">
                  ${(dailyRecommendation * 365).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Daily Recommendation */}
            {!savedToday && dailyRecommendation > 0 && (
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1">
                  💡 Рекомендация на сегодня
                </p>
                <p className="text-lg font-semibold">
                  Отложите ${dailyRecommendation.toFixed(2)}, чтобы достичь цели вовремя
                </p>
              </div>
            )}

            {savedToday && (
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <p className="text-sm text-accent font-medium">
                  ✅ Сегодня вы уже откладывали деньги. Отличная работа!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivation */}
        {progressPercentage >= 100 && (
          <Card className="border-accent bg-gradient-to-r from-accent/10 to-primary/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">🎉 Поздравляем!</h3>
              <p className="text-lg">Вы достигли своей цели! Мечта стала реальностью!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
