import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-6 rounded-full">
              <Target className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            DreamBox
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Превратите свои мечты в реальность с помощью умного планирования накоплений
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Button size="lg" onClick={() => navigate("/app")}>
                Перейти в приложение
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/register")}>
                  Начать бесплатно
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Войти
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Визуализация прогресса</CardTitle>
              <CardDescription>
                Отслеживайте свой прогресс с помощью наглядных графиков и статистики
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Гибкое планирование</CardTitle>
              <CardDescription>
                Устанавливайте цели по дням, месяцам или годам — на ваш выбор
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Безопасное хранение</CardTitle>
              <CardDescription>
                Ваши данные надежно защищены и синхронизируются в облаке
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it works */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Как это работает?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Создайте свою мечту</h3>
                <p className="text-muted-foreground">
                  Добавьте фото, название и укажите, сколько нужно накопить
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Установите срок</h3>
                <p className="text-muted-foreground">
                  Выберите, за какое время хотите достичь цели — система автоматически рассчитает план
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Отслеживайте прогресс</h3>
                <p className="text-muted-foreground">
                  Добавляйте накопления и следите, как ваша мечта становится ближе с каждым днем
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-muted-foreground mb-6">
            Присоединяйтесь к тысячам людей, которые уже достигают своих целей
          </p>
          <Button size="lg" onClick={() => navigate(user ? "/app" : "/register")}>
            {user ? "Перейти в приложение" : "Создать первую мечту"}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 DreamBox. Воплощайте мечты в реальность.</p>
        </div>
      </footer>
    </div>
  );
}

