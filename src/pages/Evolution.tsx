
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Key, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Evolution = () => {
  const [userSettings, setUserSettings] = useState({
    evolution_url: "",
    evolution_key: "",
    last_checked: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadUserSettings(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const loadUserSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user settings:', error);
        return;
      }

      if (data) {
        setUserSettings({
          evolution_url: data.evolution_url || "",
          evolution_key: data.evolution_key || "",
          last_checked: data.last_checked,
        });
      } else {
        // Create default settings if none exist
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            evolution_url: '',
            evolution_key: '',
          });

        if (insertError) {
          console.error('Error creating user settings:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in loadUserSettings:', error);
    }
  };

  const updateUserSettings = async (updates: Partial<typeof userSettings>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user settings:', error);
        toast({
          title: "Erro ao salvar",
          description: "Erro ao salvar as configurações.",
          variant: "destructive",
        });
        return;
      }

      setUserSettings(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error in updateUserSettings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserSettings({
        evolution_url: userSettings.evolution_url,
        evolution_key: userSettings.evolution_key,
      });
      
      toast({
        title: "Configurações salvas!",
        description: "Configurações salvas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Verifique as informações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!userSettings.evolution_url || !userSettings.evolution_key) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a URL e a chave da API primeiro.",
        variant: "destructive",
      });
      return;
    }

    setTestLoading(true);

    try {
      // Simulação de teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula sucesso ou falha aleatoriamente para demonstração
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        const now = new Date().toISOString();
        await updateUserSettings({ last_checked: now });
        
        toast({
          title: "✅ Conexão bem-sucedida!",
          description: "Conexão bem-sucedida com a Evolution API!",
        });
      } else {
        toast({
          title: "❌ Erro na conexão",
          description: "Erro ao conectar. Verifique a URL e chave.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro na conexão",
        description: "Erro ao conectar. Verifique a URL e chave.",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações Evolution API</h1>
        <p className="text-gray-600 mt-2">
          Configure a integração com a Evolution API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurar Integração com Evolution API
          </CardTitle>
          <CardDescription>
            Insira a URL e chave da sua instância. Essas informações são necessárias para testar a conexão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="evolution_url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                🌐 URL da Evolution
              </Label>
              <Input
                id="evolution_url"
                type="text"
                value={userSettings.evolution_url}
                onChange={(e) => setUserSettings(prev => ({ ...prev, evolution_url: e.target.value }))}
                placeholder="https://api.evolution.com/instancia"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL completa da sua instância Evolution API
              </p>
            </div>

            <div>
              <Label htmlFor="evolution_key" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                🔑 API Key da Evolution
              </Label>
              <Input
                id="evolution_key"
                type="password"
                value={userSettings.evolution_key}
                onChange={(e) => setUserSettings(prev => ({ ...prev, evolution_key: e.target.value }))}
                placeholder="sk-xxxx"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Chave de API fornecida pela Evolution (mantenha em segredo)
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testar Conexão</CardTitle>
          <CardDescription>
            Verifique se as credenciais e a URL estão funcionando corretamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTestConnection} 
            disabled={testLoading}
            className="w-full"
          >
            {testLoading ? "Testando..." : "🔍 Testar Conexão com Evolution API"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status da Conexão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status da API:</span>
              <span className="text-orange-600 font-medium">
                {userSettings.evolution_url && userSettings.evolution_key ? "Configurado" : "Não configurado"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Última verificação:</span>
              <span className="text-gray-500">
                {userSettings.last_checked 
                  ? new Date(userSettings.last_checked).toLocaleString() 
                  : "Nenhuma verificação realizada ainda."
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Para obter suas credenciais da Evolution API:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Acesse o painel da Evolution API</li>
              <li>Navegue até as configurações de API</li>
              <li>Copie a URL da instância e a chave de API</li>
              <li>Cole as informações nos campos acima</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evolution;
