import { useState } from 'react'
import { ChevronLeft, CheckCircle, Lock, Zap, CreditCard, FileText, Loader } from 'lucide-react'
import { useCartStore } from '../store'
import { useCEP } from '../hooks/useCEP'
import { createPaymentPreference } from '../services/pagamento'
import RippleButton from '../components/RippleButton'

const STEPS = ['Dados', 'Endereço', 'Pagamento']

export default function CheckoutPage({ onBack, onSuccess, toast }) {
  const { items, clearCart } = useCartStore()
  const [step, setStep] = useState(0)
  const [payMethod, setPayMethod] = useState('pix')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { address, loading: cepLoading, lookup } = useCEP()

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0)

  const [form, setForm] = useState({
    nome: '', sobrenome: '', cpf: '', whatsapp: '',
    cep: '', numero: '', complemento: '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Formatters
  const fmtCPF = v => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14)
  const fmtPhone = v => v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15)
  const fmtCEP = v => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9)

  const handleCepChange = (v) => {
    const formatted = fmtCEP(v)
    set('cep', formatted)
    if (formatted.replace(/\D/g, '').length === 8) lookup(formatted)
  }

  const validateStep = () => {
    if (step === 0) {
      if (!form.nome.trim()) { toast('Informe seu nome', 'error'); return false }
      if (!form.sobrenome.trim()) { toast('Informe seu sobrenome', 'error'); return false }
      if (form.cpf.replace(/\D/g, '').length < 11) { toast('CPF inválido', 'error'); return false }
      if (form.whatsapp.replace(/\D/g, '').length < 10) { toast('WhatsApp inválido', 'error'); return false }
    }
    if (step === 1) {
      if (form.cep.replace(/\D/g, '').length < 8) { toast('CEP inválido', 'error'); return false }
      if (!form.numero.trim()) { toast('Informe o número', 'error'); return false }
      if (!address) { toast('Informe um CEP válido', 'error'); return false }
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else handleConfirm()
  }

  const handleConfirm = async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      // Prepare order data
      const orderData = {
        items: items.map(i => ({
          name: i.name,
          price: i.price,
          qty: i.qty,
          emoji: i.emoji,
        })),
        payer: {
          nome: form.nome,
          sobrenome: form.sobrenome,
          cpf: form.cpf,
          whatsapp: form.whatsapp,
          email: form.email || 'customer@quebrada.store',
          logradouro: address?.logradouro,
          numero: form.numero,
          complemento: form.complemento,
          cep: form.cep,
          cidade: address?.cidade,
          uf: address?.uf,
          bairro: address?.bairro,
        },
      }

      // Call API to create payment preference
      const preference = await createPaymentPreference(orderData)

      // Redirect to Mercado Pago checkout
      if (preference.initPoint) {
        // Use production URL if available, fallback to sandbox
        const checkoutUrl = preference.initPoint || preference.sandboxInitPoint
        window.location.href = checkoutUrl
      } else {
        throw new Error('Não foi possível gerar o link de pagamento')
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      setErrorMsg(error.message || 'Erro ao processar seu pedido. Tente novamente.')
      toast(error.message || 'Erro ao processar pagamento', 'error')
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center gap-6 page-enter">
        <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center animate-pulse">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-white font-black text-3xl">PEDIDO CONFIRMADO!</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Recebemos seu pedido com sucesso.<br />
            Você será redirecionado para o Mercado Pago.
          </p>
        </div>
        <div className="w-full bg-zinc-950 rounded-2xl p-6 border border-white/5 space-y-3">
          <p className="text-zinc-400 text-sm">Total do pedido</p>
          <p className="text-white font-black text-3xl">
            R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-zinc-500 text-xs">
            Entrega: {address?.cidade || 'Brasil'} · {form.cep}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-16 pb-36 page-enter">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-white/10">
        <button onClick={step > 0 ? () => setStep(s => s - 1) : onBack} className="text-zinc-400 hover:text-white transition-colors" disabled={loading}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-base tracking-widest">CHECKOUT</h1>
        <Lock size={14} className="text-zinc-600 ml-auto" />
      </div>

      {/* Stepper */}
      <div className="flex items-center px-6 py-4 gap-0 border-b border-white/5">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                i < step ? 'bg-green-500 text-black' :
                i === step ? 'bg-white text-black' :
                'bg-zinc-800 text-zinc-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] font-black tracking-wider ${i === step ? 'text-white' : 'text-zinc-600'}`}>{s.toUpperCase()}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-all duration-300 ${i < step ? 'bg-green-500' : 'bg-zinc-800'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="px-4 mt-6 space-y-4">
        {/* STEP 0 - Dados pessoais */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-white font-black text-sm tracking-widest mb-5">SEUS DADOS</h2>
            <Field label="Nome *">
              <input className={inputCls} placeholder="Seu nome" value={form.nome} onChange={e => set('nome', e.target.value)} disabled={loading} />
            </Field>
            <Field label="Sobrenome *">
              <input className={inputCls} placeholder="Seu sobrenome" value={form.sobrenome} onChange={e => set('sobrenome', e.target.value)} disabled={loading} />
            </Field>
            <Field label="CPF *">
              <input className={inputCls} placeholder="000.000.000-00" value={form.cpf} onChange={e => set('cpf', fmtCPF(e.target.value))} inputMode="numeric" disabled={loading} />
            </Field>
            <Field label="WhatsApp *">
              <input className={inputCls} placeholder="(11) 99999-9999" value={form.whatsapp} onChange={e => set('whatsapp', fmtPhone(e.target.value))} inputMode="tel" disabled={loading} />
            </Field>
          </div>
        )}

        {/* STEP 1 - Endereço */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-white font-black text-sm tracking-widest mb-5">ENDEREÇO DE ENTREGA</h2>
            <Field label="CEP *">
              <div className="relative">
                <input className={inputCls} placeholder="00000-000" value={form.cep} onChange={e => handleCepChange(e.target.value)} inputMode="numeric" disabled={loading} />
                {cepLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
              </div>
            </Field>
            {address && (
              <>
                <Field label="Logradouro">
                  <input className={`${inputCls} opacity-60`} value={address.logradouro} readOnly />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Número *">
                    <input className={inputCls} placeholder="123" value={form.numero} onChange={e => set('numero', e.target.value)} inputMode="numeric" disabled={loading} />
                  </Field>
                  <Field label="Complemento">
                    <input className={inputCls} placeholder="Apto, Sala..." value={form.complemento} onChange={e => set('complemento', e.target.value)} disabled={loading} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Cidade">
                    <input className={`${inputCls} opacity-60`} value={address.cidade} readOnly />
                  </Field>
                  <Field label="UF">
                    <input className={`${inputCls} opacity-60`} value={address.uf} readOnly />
                  </Field>
                </div>
                <Field label="Bairro">
                  <input className={`${inputCls} opacity-60`} value={address.bairro} readOnly />
                </Field>
              </>
            )}
          </div>
        )}

        {/* STEP 2 - Pagamento */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-white font-black text-sm tracking-widest mb-5">FORMA DE PAGAMENTO</h2>

            {[
              { id: 'pix', label: 'PIX', desc: 'Aprovação instantânea · 5% de desconto', icon: <Zap size={20} />, badge: '5% OFF' },
              { id: 'credito', label: 'Cartão de Crédito', desc: 'Até 12x sem juros', icon: <CreditCard size={20} /> },
              { id: 'boleto', label: 'Boleto Bancário', desc: 'Vencimento em 3 dias úteis', icon: <FileText size={20} /> },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPayMethod(m.id)}
                disabled={loading}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  payMethod === m.id ? 'border-white bg-zinc-900' : 'border-white/10 bg-zinc-950 hover:border-white/20'
                }`}
              >
                <span className={`${payMethod === m.id ? 'text-white' : 'text-zinc-500'} transition-colors`}>{m.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-sm">{m.label}</p>
                    {m.badge && <span className="text-[9px] font-black bg-green-500 text-black px-2 py-0.5 rounded-full">{m.badge}</span>}
                  </div>
                  <p className="text-zinc-500 text-xs mt-0.5">{m.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payMethod === m.id ? 'border-white' : 'border-zinc-700'}`}>
                  {payMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}

            {/* Error message */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                <p className="text-red-400 text-xs font-black mb-1">❌ ERRO</p>
                <p className="text-red-400/80 text-[11px]">{errorMsg}</p>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-zinc-950 rounded-2xl p-5 border border-white/5 space-y-3 mt-4">
              <p className="text-white font-black text-xs tracking-widest">RESUMO DO PEDIDO</p>
              {items.map(item => (
                <div key={item.key} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{item.emoji}</span>
                    <span className="text-zinc-400 text-xs">{item.name} ×{item.qty}</span>
                  </div>
                  <span className="text-white font-bold text-xs">
                    R${(item.price * item.qty).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-zinc-400 text-sm font-medium">Frete</span>
                <span className="text-green-400 text-sm font-bold">Grátis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white font-black text-sm">TOTAL</span>
                <span className="text-white font-black text-lg">
                  R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* MP Notice */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4">
              <p className="text-green-400 text-xs font-black mb-1">✅ MERCADO PAGO — INTEGRADO</p>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Clique em "CONFIRMAR PEDIDO" para ser redirecionado ao Mercado Pago e completar o pagamento com segurança.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-gradient-to-t from-black via-black to-transparent z-50">
        <RippleButton
          className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm tracking-widest hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={handleNext}
          disabled={loading}
        >
          {loading && <Loader size={16} className="animate-spin" />}
          {loading ? 'PROCESSANDO...' : (step < STEPS.length - 1 ? `CONTINUAR → ${STEPS[step + 1].toUpperCase()}` : 'CONFIRMAR PEDIDO')}
        </RippleButton>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Lock size={11} className="text-zinc-600" />
          <p className="text-zinc-600 text-[10px] font-medium">Pagamento 100% seguro · SSL · Mercado Pago</p>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors placeholder-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed'

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-zinc-400 text-[11px] font-black tracking-wider block">{label}</label>
      {children}
    </div>
  )
      }
