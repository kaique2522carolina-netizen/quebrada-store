import { useState } from 'react'

export function useCEP() {
  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lookup = async (cep) => {
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length !== 8) return

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`)
      const data = await res.json()
      if (data.erro) {
        setError('CEP não encontrado')
        setAddress(null)
      } else {
        setAddress({
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || '',
        })
      }
    } catch {
      setError('Erro ao buscar CEP')
    }
    setLoading(false)
  }

  return { address, loading, error, lookup }
}
