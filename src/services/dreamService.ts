import { supabase, DreamData } from '@/lib/supabase';

export class DreamService {
  // Получить мечту пользователя
  static async getUserDream(userId: string): Promise<DreamData | null> {
    console.log('DreamService.getUserDream called for userId:', userId);
    
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Изменено с .single() на .maybeSingle()

    if (error) {
      console.error('Ошибка получения мечты:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Если ошибка связана с schema cache, показываем понятное сообщение
      if (error.message.includes('schema cache') || error.code === 'PGRST301') {
        throw new Error('База данных еще загружается. Пожалуйста, подождите 30 секунд и обновите страницу.');
      }
      
      throw error;
    }

    console.log('Dream data fetched:', data);
    return data;
  }

  // Создать новую мечту
  static async createDream(dreamData: Omit<DreamData, 'id' | 'created_at' | 'updated_at'>): Promise<DreamData> {
    const { data, error } = await supabase
      .from('dreams')
      .insert([dreamData])
      .select()
      .single();

    if (error) {
      console.error('Ошибка создания мечты:', error);
      throw error;
    }

    return data;
  }

  // Обновить мечту
  static async updateDream(userId: string, dreamData: Partial<DreamData>): Promise<DreamData> {
    const { data, error } = await supabase
      .from('dreams')
      .update(dreamData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Ошибка обновления мечты:', error);
      throw error;
    }

    return data;
  }

  // Добавить накопления
  static async addSavings(userId: string, amount: number): Promise<DreamData> {
    // Сначала получаем текущую мечту
    const dream = await this.getUserDream(userId);
    if (!dream) {
      throw new Error('Мечта не найдена');
    }

    // Обновляем накопления
    const updatedData = {
      saved_amount: (dream.saved_amount || 0) + amount,
      last_saved_date: new Date().toDateString(),
    };

    return await this.updateDream(userId, updatedData);
  }

  // Мигрировать данные из localStorage
  static async migrateFromLocalStorage(userId: string): Promise<void> {
    try {
      const localData = localStorage.getItem('dreamData');
      if (!localData) return;

      const parsedData = JSON.parse(localData);
      
      // Проверяем, есть ли уже мечта в базе
      const existingDream = await this.getUserDream(userId);
      if (existingDream) {
        console.log('Мечта уже существует в базе данных, миграция не требуется');
        return;
      }

      // Создаем мечту в базе данных
      await this.createDream({
        user_id: userId,
        dream_name: parsedData.dreamName,
        image_url: parsedData.imageUrl || '',
        target_amount: parsedData.targetAmount,
        time_value: parsedData.timeValue,
        time_unit: parsedData.timeUnit,
        saved_amount: parsedData.savedAmount || 0,
        start_date: parsedData.startDate || new Date().toISOString(),
        last_saved_date: parsedData.lastSavedDate,
      });

      // Удаляем из localStorage после успешной миграции
      localStorage.removeItem('dreamData');
      console.log('Данные успешно мигрированы из localStorage в Supabase');
    } catch (error) {
      console.error('Ошибка миграции данных:', error);
    }
  }
}

