import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ThemeTest() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Theme Test</h1>
      
      {/* Color Palette Test */}
      <Card className="bg-card border">
        <CardHeader>
          <CardTitle>Color Palette Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sky Colors */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-sky-100 rounded-lg border"></div>
            <div className="w-12 h-12 bg-sky-300 rounded-lg border"></div>
            <div className="w-12 h-12 bg-sky-500 rounded-lg border"></div>
            <div className="w-12 h-12 bg-sky-700 rounded-lg border"></div>
            <span className="text-sm text-muted-foreground">Sky Colors</span>
          </div>
          
          {/* Leaf Colors */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-leaf-100 rounded-lg border"></div>
            <div className="w-12 h-12 bg-leaf-300 rounded-lg border"></div>
            <div className="w-12 h-12 bg-leaf-500 rounded-lg border"></div>
            <div className="w-12 h-12 bg-leaf-700 rounded-lg border"></div>
            <span className="text-sm text-muted-foreground">Leaf Colors</span>
          </div>
          
          {/* Ember Colors */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-ember-100 rounded-lg border"></div>
            <div className="w-12 h-12 bg-ember-300 rounded-lg border"></div>
            <div className="w-12 h-12 bg-ember-500 rounded-lg border"></div>
            <div className="w-12 h-12 bg-ember-700 rounded-lg border"></div>
            <span className="text-sm text-muted-foreground">Ember Colors</span>
          </div>
          
          {/* Sun Colors */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-sun-100 rounded-lg border"></div>
            <div className="w-12 h-12 bg-sun-300 rounded-lg border"></div>
            <div className="w-12 h-12 bg-sun-500 rounded-lg border"></div>
            <div className="w-12 h-12 bg-sun-700 rounded-lg border"></div>
            <span className="text-sm text-muted-foreground">Sun Colors</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Component Test */}
      <Card className="bg-card border">
        <CardHeader>
          <CardTitle>Component Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
          
          <div className="flex space-x-2">
            <Badge variant="default">Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">This is muted background with muted foreground text.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* FuSteps Brand Colors */}
      <Card className="bg-card border">
        <CardHeader>
          <CardTitle>FuSteps Brand Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: 'var(--fusteps-red)' }}></div>
            <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: 'var(--fusteps-blue)' }}></div>
            <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: 'var(--fusteps-yellow)' }}></div>
            <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: 'var(--fusteps-green)' }}></div>
            <span className="text-sm text-muted-foreground">FuSteps Brand Colors</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}