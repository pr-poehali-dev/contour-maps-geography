import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type Label = {
  id: string;
  text: string;
  x: number;
  y: number;
};

type MapData = {
  id: string;
  name: string;
  labels: Label[];
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [maps, setMaps] = useState<MapData[]>([
    { id: 'world', name: 'Карта мира', labels: [] },
    { id: 'europe', name: 'Европа', labels: [] },
    { id: 'russia', name: 'Россия', labels: [] },
  ]);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [labelText, setLabelText] = useState('');

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!selectedMap) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setClickPosition({ x, y });
  };

  const addLabel = () => {
    if (!clickPosition || !labelText || !selectedMap) return;
    
    setMaps(maps.map(map => {
      if (map.id === selectedMap) {
        return {
          ...map,
          labels: [...map.labels, {
            id: Date.now().toString(),
            text: labelText,
            x: clickPosition.x,
            y: clickPosition.y,
          }]
        };
      }
      return map;
    }));
    
    setClickPosition(null);
    setLabelText('');
  };

  const removeLabel = (mapId: string, labelId: string) => {
    setMaps(maps.map(map => {
      if (map.id === mapId) {
        return {
          ...map,
          labels: map.labels.filter(l => l.id !== labelId)
        };
      }
      return map;
    }));
  };

  const renderMap = (mapId: string) => {
    const currentMap = maps.find(m => m.id === mapId);
    if (!currentMap) return null;

    return (
      <div className="space-y-4">
        <div className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-auto cursor-crosshair"
            onClick={handleMapClick}
          >
            <rect width="800" height="500" fill="#f0f9ff" />
            
            {mapId === 'world' && (
              <>
                <path d="M 100 150 Q 150 120 200 140 Q 250 160 300 150 L 320 180 L 280 220 L 240 200 L 180 210 L 120 190 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M 350 180 Q 400 160 450 170 L 480 200 L 460 240 L 420 250 L 380 230 L 340 210 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M 500 200 Q 550 180 600 190 L 630 220 L 610 260 L 570 270 L 520 250 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M 200 280 Q 250 260 300 270 L 320 310 L 280 340 L 230 330 L 180 310 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M 400 300 Q 450 280 500 290 L 520 330 L 480 360 L 430 350 L 380 330 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
              </>
            )}
            
            {mapId === 'europe' && (
              <>
                <path d="M 300 150 L 350 140 L 380 160 L 370 190 L 340 200 L 310 180 Z" fill="#e0f2fe" stroke="#f97316" strokeWidth="2" />
                <path d="M 380 160 L 430 150 L 460 170 L 450 200 L 420 210 L 390 190 Z" fill="#e0f2fe" stroke="#f97316" strokeWidth="2" />
                <path d="M 340 210 L 390 200 L 420 220 L 410 250 L 380 260 L 350 240 Z" fill="#e0f2fe" stroke="#f97316" strokeWidth="2" />
                <path d="M 280 220 L 330 210 L 360 230 L 350 260 L 320 270 L 290 250 Z" fill="#e0f2fe" stroke="#f97316" strokeWidth="2" />
              </>
            )}
            
            {mapId === 'russia' && (
              <>
                <path d="M 150 200 Q 300 180 450 190 Q 600 200 700 210 L 680 280 L 550 290 L 400 280 L 250 270 L 140 260 Z" fill="#e0f2fe" stroke="#8b5cf6" strokeWidth="2" />
                <ellipse cx="280" cy="240" rx="30" ry="25" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="1.5" />
                <ellipse cx="450" cy="250" rx="35" ry="30" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="1.5" />
              </>
            )}

            {currentMap.labels.map((label) => (
              <g key={label.id}>
                <circle
                  cx={`${(label.x / 100) * 800}`}
                  cy={`${(label.y / 100) * 500}`}
                  r="4"
                  fill="#ef4444"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLabel(mapId, label.id);
                  }}
                />
                <text
                  x={`${(label.x / 100) * 800 + 8}`}
                  y={`${(label.y / 100) * 500 + 4}`}
                  fontSize="14"
                  fill="#1e293b"
                  fontWeight="600"
                  className="cursor-pointer select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLabel(mapId, label.id);
                  }}
                >
                  {label.text}
                </text>
              </g>
            ))}
            
            {clickPosition && (
              <circle
                cx={`${(clickPosition.x / 100) * 800}`}
                cy={`${(clickPosition.y / 100) * 500}`}
                r="6"
                fill="#f97316"
                opacity="0.8"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>

        {clickPosition && (
          <Card className="border-2 border-secondary">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Введите название объекта..."
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLabel()}
                  autoFocus
                  className="flex-1"
                />
                <Button onClick={addLabel} size="lg" className="bg-secondary hover:bg-secondary/90">
                  <Icon name="Plus" size={20} />
                  Добавить
                </Button>
                <Button
                  onClick={() => {
                    setClickPosition(null);
                    setLabelText('');
                  }}
                  variant="outline"
                  size="lg"
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentMap.labels.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="List" size={20} />
                Подписанные объекты ({currentMap.labels.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentMap.labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="secondary"
                    className="text-sm px-3 py-1.5 cursor-pointer hover:bg-destructive hover:text-white transition-colors"
                    onClick={() => removeLabel(mapId, label.id)}
                  >
                    {label.text}
                    <Icon name="X" size={14} className="ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Map" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ГеоКарты
              </h1>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('home')}
                className="gap-2"
              >
                <Icon name="Home" size={18} />
                Главная
              </Button>
              <Button
                variant={activeSection === 'maps' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('maps')}
                className="gap-2"
              >
                <Icon name="Map" size={18} />
                Карты
              </Button>
              <Button
                variant={activeSection === 'about' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('about')}
                className="gap-2"
              >
                <Icon name="Info" size={18} />
                О проекте
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {activeSection === 'home' && (
          <div className="space-y-16">
            <section className="text-center space-y-6 py-12">
              <div className="inline-block">
                <Badge className="text-sm px-4 py-2 mb-4 bg-accent/10 text-accent border-accent/20">
                  <Icon name="Sparkles" size={16} className="mr-1" />
                  Образовательная платформа
                </Badge>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Изучай географию<br />интерактивно
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Подписывай объекты на контурных картах, запоминай расположение стран, городов и природных объектов
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => setActiveSection('maps')}
                  className="gap-2 text-lg px-8 bg-primary hover:bg-primary/90"
                >
                  <Icon name="Map" size={20} />
                  Открыть карты
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setActiveSection('about')}
                  className="gap-2 text-lg px-8"
                >
                  <Icon name="BookOpen" size={20} />
                  Узнать больше
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="MousePointerClick" size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Кликай и подписывай</h3>
                  <p className="text-muted-foreground">
                    Нажимай на карту и добавляй названия географических объектов
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary transition-all hover:shadow-lg">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                    <Icon name="Layers" size={32} className="text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">Разные карты</h3>
                  <p className="text-muted-foreground">
                    Работай с картами мира, континентов и отдельных стран
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-all hover:shadow-lg">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon name="Brain" size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Запоминай легко</h3>
                  <p className="text-muted-foreground">
                    Интерактивный подход помогает лучше запомнить географию
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeSection === 'maps' && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold">Интерактивные карты</h2>
              <p className="text-muted-foreground text-lg">
                Выбери карту и начни подписывать географические объекты
              </p>
            </div>

            <Tabs value={selectedMap || 'world'} onValueChange={setSelectedMap} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1">
                <TabsTrigger value="world" className="gap-2 py-3 text-base">
                  <Icon name="Globe" size={18} />
                  Мир
                </TabsTrigger>
                <TabsTrigger value="europe" className="gap-2 py-3 text-base">
                  <Icon name="MapPin" size={18} />
                  Европа
                </TabsTrigger>
                <TabsTrigger value="russia" className="gap-2 py-3 text-base">
                  <Icon name="Mountain" size={18} />
                  Россия
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground bg-white/60 backdrop-blur-sm p-3 rounded-lg">
                      <Icon name="Info" size={16} />
                      <span>Кликните на карту, чтобы добавить подпись. Кликните на подпись, чтобы удалить её.</span>
                    </div>
                    {selectedMap && renderMap(selectedMap)}
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold">О проекте ГеоКарты</h2>
              <p className="text-muted-foreground text-lg">
                Современная образовательная платформа для изучения географии
              </p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon name="Target" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Наша цель</h3>
                      <p className="text-muted-foreground">
                        Сделать изучение географии интересным и эффективным через интерактивные контурные карты. 
                        Мы верим, что активное взаимодействие с материалом помогает лучше запоминать информацию.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Icon name="Users" size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Для кого</h3>
                      <p className="text-muted-foreground">
                        ГеоКарты подходят для школьников, студентов и всех, кто хочет улучшить свои знания географии. 
                        Платформа интуитивно понятна и не требует специальных навыков.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon name="Lightbulb" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Как работает</h3>
                      <p className="text-muted-foreground">
                        Просто выберите карту, кликните на нужное место и введите название объекта. 
                        Все ваши подписи сохраняются во время работы с картой. Вы можете легко добавлять и удалять метки.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge variant="outline" className="text-base px-4 py-2">
                      <Icon name="Zap" size={16} className="mr-2" />
                      Быстро
                    </Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">
                      <Icon name="Smile" size={16} className="mr-2" />
                      Просто
                    </Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">
                      <Icon name="Award" size={16} className="mr-2" />
                      Эффективно
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setActiveSection('maps')}
                className="gap-2 text-lg px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Icon name="Rocket" size={20} />
                Начать работу с картами
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-20 bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Icon name="Map" size={18} />
            <span>ГеоКарты — образовательный проект по географии</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
