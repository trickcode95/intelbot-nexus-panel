
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, Shield, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Painel Tech</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bem-vindo ao Painel Tech Inteligente
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conecte-se, personalize seu bot e integre com a Evolution API. 
            Gerencie suas automações de forma inteligente e eficiente.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-3">
                Começar Agora
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Integração Rápida</CardTitle>
              <CardDescription>
                Conecte-se facilmente com a Evolution API e configure seu bot em minutos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Seguro e Confiável</CardTitle>
              <CardDescription>
                Seus dados protegidos com Supabase e criptografia de ponta a ponta
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Fácil de Usar</CardTitle>
              <CardDescription>
                Interface intuitiva para gerenciar suas conexões e personalizar prompts
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 mb-6">
            Crie sua conta gratuita e comece a gerenciar seus bots hoje mesmo.
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-8 py-3">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Painel Tech. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
