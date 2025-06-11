
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [botPrompt, setBotPrompt] = useState(
    "Você é um assistente inteligente e prestativo. Responda sempre de forma educada e objetiva."
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSavePrompt = async () => {
    setLoading(true);
    try {
      // Simulação de salvamento - em produção, usar Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Prompt salvo com sucesso!",
        description: "As alterações foram aplicadas ao seu bot.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Gerencie seu bot e configurações
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt do Bot</CardTitle>
          <CardDescription>
            Altere o prompt do seu assistente a qualquer momento. 
            Este texto define como seu bot irá se comportar nas conversas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={botPrompt}
            onChange={(e) => setBotPrompt(e.target.value)}
            placeholder="Escreva aqui o prompt do seu bot..."
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSavePrompt} disabled={loading}>
              {loading ? "Salvando..." : "Salvar Prompt"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bot Status:</span>
                <span className="text-green-600 font-medium">Ativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conexões:</span>
                <span className="text-blue-600 font-medium">1 ativa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mensagens hoje:</span>
                <span className="text-gray-900 font-medium">47</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Ver Conexões
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Configurar Evolution API
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Histórico de Conversas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
