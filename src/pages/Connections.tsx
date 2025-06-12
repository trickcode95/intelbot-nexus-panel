import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Connections = () => {
  const [userSettings, setUserSettings] = useState({
    connection_status: "desconectado",
    qr_code_link: "",
  });
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        setUserSettings(data);
        setQrCodeLink(data.qr_code_link || "");
      } else {
        // Create default settings if none exist
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            connection_status: 'desconectado',
            qr_code_link: '',
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

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateUserSettings({ connection_status: "desconectado" });
      toast({
        title: "Instância desconectada",
        description: "A conexão foi encerrada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao desconectar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função utilitária para extrair o ID da instância da URL
  function extractInstanceId(url: string): string | null {
    try {
      const parts = url.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    } catch {
      return null;
    }
  }

  const fetchQrCode = async (instanceUrl: string) => {
    try {
      setLoading(true);
      const instanceId = extractInstanceId(instanceUrl);
      if (!instanceId) throw new Error('ID da instância não encontrado na URL');
      // Monta a URL do endpoint
      const baseUrl = instanceUrl.replace(/\/[^/]*$/, '');
      const url = `${baseUrl}/instance/${instanceId}/qrcode`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao buscar QR Code');
      const data = await response.json();
      if (data.status === 'success' && data.qrcode) {
        setQrCodeUrl(data.qrcode);
      } else {
        setQrCodeUrl(null);
        toast({
          title: "Erro ao buscar QR Code",
          description: "A API não retornou um QR Code válido.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setQrCodeUrl(null);
      toast({
        title: "Erro ao buscar QR Code",
        description: "Verifique a URL da instância e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQrCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeLink.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um link válido.",
        variant: "destructive",
      });
      return;
    }
    await updateUserSettings({ qr_code_link: qrCodeLink });
    toast({
      title: "URL salva!",
      description: "Buscando QR Code...",
    });
    fetchQrCode(qrCodeLink);
  };

  useEffect(() => {
    if (userSettings.qr_code_link) {
      fetchQrCode(userSettings.qr_code_link);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettings.qr_code_link]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await updateUserSettings({ connection_status: "conectado" });
      toast({
        title: "Instância conectada",
        description: "Conexão estabelecida com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao conectar",
        description: "Verifique o QR Code e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-4 text-white">
      <div>
        <h1 className="text-3xl font-bold">Conexões</h1>
        <p className="text-gray-300 mt-2">
          Gerencie suas instâncias e conexões WhatsApp
        </p>
      </div>

      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {userSettings.connection_status === "conectado" ? (
              <Wifi className="h-5 w-5 text-green-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-400" />
            )}
            Status da Instância
          </CardTitle>
          <CardDescription className="text-gray-400">
            Estado atual da sua conexão com o WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-300">Estado atual:</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={userSettings.connection_status === "conectado" ? "default" : "destructive"}
              >
                {userSettings.connection_status === "conectado" ? "Conectado" : "Desconectado"}
              </Badge>
              {userSettings.connection_status === "desconectado" && (
                <Button 
                  onClick={handleConnect} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200 px-4 py-1 text-sm"
                >
                  {loading ? "Conectando..." : "Conectar"}
                </Button>
              )}
            </div>
          </div>
          
          {userSettings.connection_status === "conectado" && (
            <div className="pt-4 border-t border-gray-700">
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={loading}
                className="text-red-400 border-red-400 hover:bg-red-900"
              >
                {loading ? "Desconectando..." : "Desconectar Instância"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle>Gerar QR Code da Instância</CardTitle>
          <CardDescription className="text-gray-400">
            Insira o link da sua instância para gerar o QR Code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateQrCode} className="space-y-4">
            <div>
              <Label htmlFor="qr_code_link" className="text-gray-200">Link da instância (para gerar QR Code)</Label>
              <Input
                id="qr_code_link"
                type="text"
                value={qrCodeLink}
                onChange={(e) => setQrCodeLink(e.target.value)}
                placeholder="https://minha.instancia.com"
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full font-semibold rounded-lg shadow transition-all duration-200">
              {loading ? "Buscando QR..." : "Salvar e Mostrar QR"}
            </Button>
          </form>
          {qrCodeUrl && (
            <div className="flex flex-col items-center mt-8">
              <img src={qrCodeUrl} alt="QR Code de Conexão" className="w-48 h-48 rounded-lg border-2 border-gray-700 shadow-lg" />
              <p className="text-gray-300 mt-2">Escaneie este QR Code no WhatsApp</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Conexões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">📱 Instância Principal</p>
                <p className="text-sm text-gray-500">+55 11 91234-5678</p>
              </div>
              <Badge variant="default">🟢 Ativo</Badge>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">🔌 Instância Teste</p>
                <p className="text-sm text-gray-500">Desconectado há 2 dias</p>
              </div>
              <Badge variant="secondary">⚪ Inativo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Connections;
