import { AlertCircle, Home, ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RippleButton from '../components/RippleButton'

export default function FailPage({ onHome, onBack }) {
  const [searchParams] = useSearchParams()
  const [errorDetails, setErrorDetails] = useState(null)

  useEffect(() => {
    const status = searchParams.get('status')
    const paymentId = searchParams.get('payment_id')
    const reason = searchParams.get('reason') || 'insufficient_funds'

    const reasonMap = {
      insufficient_funds: 'Fundos insuficientes',
      card_declined: 'Cartão recusado',
      invalid_installments: 'Parcelamento inválido',
      duplicated_transaction: 'Transação duplicada',
      call_issuer: 'Ligação para emissor necessária',
      insufficient_data: 'Dados insuficientes',
    }

    setErrorDetails({
      paymentId,
      status: status || 'rejected',
      reason,
      reasonText: reasonMap[reason] || 'Pagamento não autorizado',
      timestamp: new Date().toLocaleString('pt-BR'),
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center gap-6 py-20">
      {/* Error Icon */}
      <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center animate-pulse">
        <AlertCircle size={48} className="text-red-400" />
      </div>

      {/* Error Message */}
      <div className="space-y-2 max-w-md">
        <h1 className="text-white font-black text-3xl md:text-4xl">PAGAMENTO FALHOU</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Não conseguimos processar seu pagamento. <br />
          Por favor, verifique seus dados e tente novamente.
        </p>
      </div>

      {/* Error Details */}
      {errorDetails && (
        <div className="w-full max-w-md bg-red-950/20 border border-red-500/20 rounded-2xl p-6 space-y-3">
          <div className="space-y-2">
            <p className="text-red-400 text-xs font-black uppercase">Motivo da Recusa</p>
            <p className="text-white font-bold">{errorDetails.reasonText}</p>
          </div>
          <div className="border-t border-red-500/10 pt-3 space-y-2">
            <p className="text-zinc-500 text-xs font-black uppercase">ID do Pagamento</p>
            <p className="text-zinc-400 text-xs font-mono break-all">{errorDetails.paymentId || 'N/A'}</p>
          </div>
          <div className="border-t border-red-500/10 pt-3 space-y-2">
            <p className="text-zinc-500 text-xs font-black uppercase">Data da Tentativa</p>
            <p className="text-zinc-400 text-xs">{errorDetails.timestamp}</p>
          </div>
        </div>
      )}

      {/* Solutions */}
      <div className="w-full max-w-md space-y-3">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <p className="text-blue-400 text-xs font-black mb-2">💡 SOLUÇÕES</p>
          <ul className="text-zinc-500 text-[11px] leading-relaxed space-y-1.5 text-left">
            <li>✓ Verifique se os dados do cartão estão corretos</li>
            <li>✓ Consulte com seu banco sobre bloqueios de transação</li>
            <li>✓ Tente uma forma de pagamento diferente (PIX ou Boleto)</li>
            <li>✓ Verifique se o cartão tem limite disponível</li>
          </ul>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
          <p className="text-yellow-400 text-xs font-black mb-1">⏱️ CARINHO SALVO</p>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Seus itens continuam no carrinho. Quando tiver disponibilidade, tente novamente.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-md space-y-2 pt-4">
        <RippleButton
          className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm tracking-widest hover:bg-zinc-100 transition-colors"
          onClick={onBack}
        >
          <ChevronLeft size={16} className="inline mr-2" />
          TENTAR NOVAMENTE
        </RippleButton>

        <RippleButton
          className="w-full bg-zinc-900 text-white font-black py-3 rounded-2xl text-sm tracking-widest hover:bg-zinc-800 transition-colors border border-white/10"
          onClick={onHome}
        >
          <Home size={16} className="inline mr-2" />
          CONTINUAR COMPRANDO
        </RippleButton>
      </div>

      {/* Support */}
      <div className="text-center pt-4">
        <p className="text-zinc-600 text-xs">
          Precisa de ajuda? Entre em contato pelo WhatsApp:
          <br />
          <a href="https://wa.me/5511999999999" className="text-green-400 hover:text-green-300 font-bold">
            (11) 99999-9999
          </a>
        </p>
      </div>
    </div>
  )
}
