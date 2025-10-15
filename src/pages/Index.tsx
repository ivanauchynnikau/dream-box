import { useState, useEffect } from "react";
import { DreamSetup } from "@/components/DreamSetup";
import { DreamTracker } from "@/components/DreamTracker";
import { useAuth } from "@/contexts/AuthContext";
import { DreamService } from "@/services/dreamService";
import { Loader2 } from "lucide-react";
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

const Index = () => {
  const { user } = useAuth();
  const [dreamData, setDreamData] = useState<DreamData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Index.tsx useEffect - user:", user?.email);
    
    if (!user) {
      console.log("No user, setting loading to false");
      setLoading(false);
      return;
    }

    const loadDreamData = async () => {
      console.log("Loading dream data for user:", user.id);
      try {
        // Сначала попытка миграции из localStorage
        await DreamService.migrateFromLocalStorage(user.id);

        // Загрузка данных из Supabase
        console.log("Fetching dream from Supabase...");
        const dream = await DreamService.getUserDream(user.id);
        console.log("Dream data received:", dream);
        
        if (dream) {
          setDreamData({
            dreamName: dream.dream_name,
            imageUrl: dream.image_url,
            targetAmount: dream.target_amount,
            timeValue: dream.time_value,
            timeUnit: dream.time_unit,
            savedAmount: dream.saved_amount,
            startDate: dream.start_date,
            lastSavedDate: dream.last_saved_date,
          });
          console.log("Dream data set successfully");
        } else {
          console.log("No dream found for user, will show setup form");
        }
      } catch (error: any) {
        console.error("Ошибка загрузки данных:", error);
        // Показываем конкретную ошибку
        const errorMessage = error?.message || "Не удалось загрузить данные";
        toast.error("Ошибка загрузки", {
          description: errorMessage,
        });
        // Даже при ошибке позволяем создать новую мечту
        setDreamData(null);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    loadDreamData();
  }, [user]);

  const handleSaveDream = async (data: any) => {
    if (!user) return;

    try {
      const dreamPayload = {
        user_id: user.id,
        dream_name: data.dreamName,
        image_url: data.imageUrl || "",
        target_amount: data.targetAmount,
        time_value: data.timeValue,
        time_unit: data.timeUnit,
        saved_amount: dreamData?.savedAmount || 0,
        start_date: dreamData?.startDate || new Date().toISOString(),
        last_saved_date: dreamData?.lastSavedDate,
      };

      let savedDream;
      if (dreamData) {
        // Обновление существующей мечты
        savedDream = await DreamService.updateDream(user.id, dreamPayload);
      } else {
        // Создание новой мечты
        savedDream = await DreamService.createDream(dreamPayload);
      }

      setDreamData({
        dreamName: savedDream.dream_name,
        imageUrl: savedDream.image_url,
        targetAmount: savedDream.target_amount,
        timeValue: savedDream.time_value,
        timeUnit: savedDream.time_unit,
        savedAmount: savedDream.saved_amount,
        startDate: savedDream.start_date,
        lastSavedDate: savedDream.last_saved_date,
      });

      toast.success(dreamData ? "Мечта обновлена!" : "Мечта создана!");
    } catch (error) {
      console.error("Ошибка сохранения мечты:", error);
      toast.error("Не удалось сохранить мечту");
    }
  };

  const handleUpdateSavings = async (amount: number) => {
    if (!user || !dreamData) return;

    try {
      const updatedDream = await DreamService.addSavings(user.id, amount);
      
      setDreamData({
        dreamName: updatedDream.dream_name,
        imageUrl: updatedDream.image_url,
        targetAmount: updatedDream.target_amount,
        timeValue: updatedDream.time_value,
        timeUnit: updatedDream.time_unit,
        savedAmount: updatedDream.saved_amount,
        startDate: updatedDream.start_date,
        lastSavedDate: updatedDream.last_saved_date,
      });
    } catch (error) {
      console.error("Ошибка обновления накоплений:", error);
      toast.error("Не удалось обновить накопления");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (data: any) => {
    await handleSaveDream(data);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (!dreamData || isEditing) {
    return (
      <DreamSetup 
        onSave={isEditing ? handleSaveEdit : handleSaveDream} 
        initialData={dreamData || undefined}
      />
    );
  }

  return (
    <DreamTracker
      dreamData={dreamData}
      onEdit={handleEdit}
      onUpdateSavings={handleUpdateSavings}
    />
  );
};

export default Index;
