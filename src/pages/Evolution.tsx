
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Key, Globe, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Evolution = () => {
  const [evolutionUrl, setEvolutionUrl] = useState("");
  const [evolutionKey, setEvolutionKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulação de salvamento - em produção, usar Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    if (!evolutionUrl || !evolutionKey) {
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
        toast({
          title: "✅ Conexão bem-sucedida!",
          description: "Conexão bem-sucedida com a Evolution API!",
        });
        setLastChecked(new Date().toLocaleString());
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
                value={evolutionUrl}
                onChange={(e) => setEvolutionUrl(e.target.value)}
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
                value={evolutionKey}
                onChange={(e) => setEvolutionKey(e.target.value)}
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
                {evolutionUrl && evolutionKey ? "Configurado" : "Não configurado"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Última verificação:</span>
              <span className="text-gray-500">
                {lastChecked || "Nenhuma verificação realizada ainda."}
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
