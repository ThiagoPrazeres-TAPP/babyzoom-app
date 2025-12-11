'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Baby } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se usuário já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/')
      } else {
        setLoading(false)
      }
    })

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-pulse">
          <Baby className="w-16 h-16 text-[#00BFFF]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00BFFF] to-[#FF69B4] mb-4 shadow-2xl">
            <Baby className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">BabyZoom</h1>
          <p className="text-gray-400">Acompanhe cada momento especial</p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-2xl border border-gray-800">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00BFFF',
                    brandAccent: '#FF69B4',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#1A1A1A',
                    defaultButtonBackgroundHover: '#2A2A2A',
                    defaultButtonBorder: '#333333',
                    defaultButtonText: 'white',
                    dividerBackground: '#333333',
                    inputBackground: '#0D0D0D',
                    inputBorder: '#333333',
                    inputBorderHover: '#00BFFF',
                    inputBorderFocus: '#00BFFF',
                    inputText: 'white',
                    inputLabelText: '#CCCCCC',
                    inputPlaceholder: '#666666',
                    messageText: 'white',
                    messageTextDanger: '#FF4444',
                    anchorTextColor: '#00BFFF',
                    anchorTextHoverColor: '#FF69B4',
                  },
                  space: {
                    spaceSmall: '8px',
                    spaceMedium: '16px',
                    spaceLarge: '24px',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '14px',
                    baseButtonSize: '14px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Criar conta com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                  confirmation_text: 'Verifique seu email para confirmar',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando...',
                  link_text: 'Esqueceu sua senha?',
                  confirmation_text: 'Verifique seu email para redefinir a senha',
                },
                update_password: {
                  password_label: 'Nova senha',
                  password_input_placeholder: '••••••••',
                  button_label: 'Atualizar senha',
                  loading_button_label: 'Atualizando...',
                  confirmation_text: 'Sua senha foi atualizada',
                },
                magic_link: {
                  email_input_label: 'Email',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar link mágico',
                  loading_button_label: 'Enviando...',
                  link_text: 'Enviar um link mágico',
                  confirmation_text: 'Verifique seu email para o link mágico',
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Ao criar uma conta, você concorda com nossos Termos de Uso
        </p>
      </div>

      <style jsx global>{`
        .auth-container {
          width: 100%;
        }
        .auth-button {
          transition: all 0.3s ease;
        }
        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 191, 255, 0.3);
        }
        .auth-input:focus {
          box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
