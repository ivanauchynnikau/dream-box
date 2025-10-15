import { useState, useEffect } from "react";
import { DreamSetup } from "@/components/DreamSetup";
import { DreamTracker } from "@/components/DreamTracker";

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
  const [dreamData, setDreamData] = useState<DreamData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dreamData");
    if (saved) {
      setDreamData(JSON.parse(saved));
    }
  }, []);

  const handleSaveDream = (data: any) => {
    const newDreamData: DreamData = {
      ...data,
      savedAmount: dreamData?.savedAmount || 0,
      startDate: dreamData?.startDate || new Date().toISOString(),
      lastSavedDate: dreamData?.lastSavedDate,
    };
    setDreamData(newDreamData);
    localStorage.setItem("dreamData", JSON.stringify(newDreamData));
  };

  const handleUpdateSavings = (amount: number) => {
    if (!dreamData) return;

    const updatedData: DreamData = {
      ...dreamData,
      savedAmount: dreamData.savedAmount + amount,
      lastSavedDate: new Date().toDateString(),
    };
    setDreamData(updatedData);
    localStorage.setItem("dreamData", JSON.stringify(updatedData));
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (data: any) => {
    handleSaveDream(data);
    setIsEditing(false);
  };

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
