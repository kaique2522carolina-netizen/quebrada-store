import { CheckCircle, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RippleButton from '../components/RippleButton'

export default function SuccessPage({ onHome }) {
  const [searchParams] = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState(null)
  
  useEffect(() => {
    // Get payment ID from URL
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    const externalRef = searchParams.get('external_reference')

    if (paymentId || status === 'approved') {
      setPaymentDetails({
        paymentId,
        status: 'approved',
        externalRef,
        timestamp: new Date().toLocaleString('pt-BR'),
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center gap-6 py-20">
      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center animate-bounce">
        <CheckCircle size={48} className="text-green-400" />
      </div>

      {/* Success Message */}
      <div className="space-y-2 max-w-md">
        <h1 className="text-white font-black text-3xl md:text-4xl">PAGAMENTO CONFIRMADO!</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Seu pedido foi processado com sucesso. <br />
          Em breve entraremos em contato via WhatsApp com os detalhes da entrega.
        </p>
      </div>

      {/* Payment Details */}
      {paymentDetails && (
        <div className="w-full max-w-md bg-zinc-950 rounded-2xl p-6 border border-white/5 space-y-3">
          <div className="space-y-2">
            <p className="text-zinc-500 text-xs font-black uppercase">ID do Pagamento</p>
            <p className="text-white text-sm font-mono break-all">{paymentDetails.paymentId || 'Processando...'}</p>
          </div>
          <div className="border-t border-white/10 pt-3 space-y-2">
            <p className="text-zinc-500 text-xs font-black uppercase">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-green-400 font-bold">Aprovado</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-3 space-y-2">
            <p className="text-zinc-500 text-xs font-black uppercase">Data</p>
            <p className="text-white text-xs">{paymentDetails.timestamp}</p>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="w-full max-w-md space-y-3">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <p className="text-blue-400 text-xs font-black mb-1">📦 PRÓXIMOS PASSOS</p>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Você receberá um WhatsApp com a confirmação do pedido e informações de entrega.
          </p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
          <p className="text-yellow-400 text-xs font-black mb-1">⏱️ TEMPO DE ENTREGA</p>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Entrega estimada em 3-7 dias úteis dependendo da sua região.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-md space-y-2 pt-4">
        <RippleButton
          className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm tracking-widest hover:bg-zinc-100 transition-colors"
          onClick={onHome}
        >
          <Home size={16} className="inline mr-2" />
          VOLTAR À LOJA
        </RippleButton>
      </div>

      {/* Footer Note */}
      <p className="text-zinc-600 text-xs max-w-md">
        💡 Guarde este número para consultar o status do seu pedido: <span className="text-white font-mono">{paymentDetails?.paymentId?.slice(-6)}</span>
      </p>
    </div>
  )
}
