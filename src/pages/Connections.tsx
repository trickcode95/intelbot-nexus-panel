
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
      title: "QR Code gerado!",
      description: "QR Code gerado e salvo com sucesso!",
    });
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conexões</h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas instâncias e conexões WhatsApp
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {userSettings.connection_status === "conectado" ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            Status da Instância
          </CardTitle>
          <CardDescription>
            Estado atual da sua conexão com o WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Estado atual:</span>
            <Badge 
              variant={userSettings.connection_status === "conectado" ? "default" : "destructive"}
            >
              {userSettings.connection_status === "conectado" ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
          
          {userSettings.connection_status === "conectado" && (
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={loading}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {loading ? "Desconectando..." : "Desconectar Instância"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {userSettings.connection_status === "desconectado" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Gerar QR Code da Instância</CardTitle>
              <CardDescription>
                Insira o link da sua instância para gerar o QR Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateQrCode} className="space-y-4">
                <div>
                  <Label htmlFor="qr_code_link">Link da instância (para gerar QR Code)</Label>
                  <Input
                    id="qr_code_link"
                    type="text"
                    value={qrCodeLink}
                    onChange={(e) => setQrCodeLink(e.target.value)}
                    placeholder="https://minha.instancia.com"
                  />
                </div>
                <Button type="submit">Salvar e Mostrar QR</Button>
              </form>
            </CardContent>
          </Card>

          {userSettings.qr_code_link && (
            <Card>
              <CardHeader>
                <CardTitle>QR Code Gerado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <QrCode className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">QR Code para: {userSettings.qr_code_link}</p>
                  <p className="text-sm text-gray-500">
                    Escaneie este código no WhatsApp
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Escanear QR Code de Conexão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <QrCode className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Escaneie um QR Code para conectar
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Abra o WhatsApp → Menu → Aparelhos Conectados → Conectar um aparelho
                </p>
                <Button onClick={handleConnect} disabled={loading}>
                  {loading ? "Conectando..." : "Simular Conexão"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

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
