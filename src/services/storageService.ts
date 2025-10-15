import { supabase } from '@/lib/supabase';

export class StorageService {
  private static BUCKET_NAME = 'dream-images';

  /**
   * Загрузить изображение мечты
   * @param userId - ID пользователя
   * @param file - Файл изображения
   * @returns URL загруженного изображения
   */
  static async uploadDreamImage(userId: string, file: File): Promise<string> {
    try {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, загрузите изображение');
      }

      // Проверка размера файла (максимум 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Размер файла не должен превышать 5MB');
      }

      // Создаем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Загружаем файл в Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Ошибка загрузки файла:', error);
        throw new Error('Не удалось загрузить изображение');
      }

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Ошибка в uploadDreamImage:', error);
      throw error;
    }
  }

  /**
   * Удалить старое изображение мечты
   * @param imageUrl - URL изображения для удаления
   */
  static async deleteDreamImage(imageUrl: string): Promise<void> {
    try {
      // Извлекаем путь из URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split(`/${this.BUCKET_NAME}/`);
      
      if (pathParts.length < 2) {
        console.warn('Не удалось извлечь путь из URL');
        return;
      }

      const filePath = pathParts[1];

      // Удаляем файл
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Ошибка удаления файла:', error);
        // Не бросаем ошибку, так как это не критично
      }
    } catch (error) {
      console.error('Ошибка в deleteDreamImage:', error);
      // Не бросаем ошибку, так как это не критично
    }
  }

  /**
   * Проверить, создан ли bucket
   */
  static async checkBucketExists(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Ошибка проверки buckets:', error);
        return false;
      }

      return data.some(bucket => bucket.name === this.BUCKET_NAME);
    } catch (error) {
      console.error('Ошибка в checkBucketExists:', error);
      return false;
    }
  }
}

